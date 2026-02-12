import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { saveUploadedFile, validateFileType } from "@/lib/file/storage";
import { chunkText, cleanText } from "@/lib/file/extraction";
import { extractDocumentText } from "@/lib/ai/gemini";
import { createDocument, createSection } from "@/app/actions/documents";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const subjectId = formData.get("subjectId") as string;
    const title = formData.get("title") as string;

    if (!file || !subjectId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate size (4.5MB limit for Vercel/Lambda)
    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds the 4.5MB limit" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!validateFileType(file.name)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 },
      );
    }

    // Save file
    const filePath = await saveUploadedFile(file, file.name, subjectId);
    const fileType = file.name.split(".").pop()?.toLowerCase() || "unknown";

    // Extract text using Gemini LLM for all file types
    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    try {
      extractedText = await extractDocumentText(buffer, fileType, file.name);
    } catch (extractionError) {
      console.error("Text extraction failed:", extractionError);
      // Still create the document record even if extraction fails
    }

    extractedText = cleanText(extractedText);

    // Create document
    const document = await createDocument(
      subjectId,
      title,
      file.name,
      fileType,
      filePath,
      file.size,
      extractedText,
    );

    // Create sections from chunks
    let sectionsCount = 0;
    if (extractedText.length > 0) {
      const chunks = chunkText(extractedText, 1500);
      const sections = await Promise.all(
        chunks.map((chunk, index) =>
          createSection(
            document.id,
            `Section ${index + 1}`,
            chunk,
            index + 1,
            index,
          ),
        ),
      );
      sectionsCount = sections.length;
    }

    return NextResponse.json(
      {
        success: true,
        document,
        sections: sectionsCount,
        message:
          sectionsCount > 0
            ? `Document uploaded and split into ${sectionsCount} sections`
            : "Document uploaded but text extraction returned empty. You can retry processing from the document page.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}
