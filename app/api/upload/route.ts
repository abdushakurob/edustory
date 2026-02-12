import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { saveUploadedFile, validateFileType } from "@/lib/file/storage";
import { analyzeDocument } from "@/lib/ai/gemini";
import { createDocument } from "@/app/actions/documents";
import { prisma } from "@/lib/db";

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
    const buffer = Buffer.from(await file.arrayBuffer());

    // Send the raw document to Gemini — it can read PDFs, images, etc. directly
    const analysis = await analyzeDocument(buffer, fileType, file.name);

    // Create document record with full text from Gemini
    const document = await createDocument(
      subjectId,
      title,
      file.name,
      fileType,
      filePath,
      file.size,
      analysis.fullText,
    );

    // Create sections directly from Gemini's intelligent analysis
    const sections = await prisma.$transaction(
      analysis.sections.map((section, index) =>
        prisma.section.create({
          data: {
            documentId: document.id,
            title: section.title,
            content: section.content,
            sectionNumber: index + 1,
            order: index,
          },
        }),
      ),
    );

    return NextResponse.json(
      {
        success: true,
        document,
        sections: sections.length,
        message: `Document analyzed and split into ${sections.length} learning sections`,
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
