import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { saveUploadedFile, validateFileType } from "@/lib/file/storage";
import {
  extractPdfText,
  extractDocxText,
  chunkText,
  cleanText,
} from "@/lib/file/extraction";
import { extractImageText } from "@/lib/ai/gemini";
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

    // Extract text based on file type
    let extractedText = "";
    const buffer = Buffer.from(await file.arrayBuffer());

    if (fileType === "pdf") {
      extractedText = await extractPdfText(buffer);
    } else if (fileType === "docx") {
      extractedText = await extractDocxText(buffer);
    } else if (["png", "jpg", "jpeg"].includes(fileType)) {
      extractedText = await extractImageText(buffer);
    } else if (fileType === "ppt" || fileType === "pptx") {
      // For now, just save as is - full PPT parsing requires additional library
      extractedText =
        "PowerPoint file uploaded. Content extraction coming soon.";
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

    return NextResponse.json(
      {
        success: true,
        document,
        sections: sections.length,
        message: `Document uploaded and split into ${sections.length} sections`,
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
