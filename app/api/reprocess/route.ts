import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { documentId } = await request.json();

        if (!documentId) {
            return NextResponse.json(
                { error: "Missing documentId" },
                { status: 400 },
            );
        }

        // Get the document
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: {
                subject: true,
                sections: true,
            },
        });

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 },
            );
        }

        // Verify ownership
        if (document.subject.userId !== session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if there's extracted text to work with
        if (
            !document.extractedText ||
            document.extractedText.trim().length === 0
        ) {
            return NextResponse.json(
                {
                    error:
                        "No content was found for this document. Please delete it and re-upload — Gemini will analyze the file directly.",
                },
                { status: 400 },
            );
        }

        // Delete existing sections before recreating
        if (document.sections.length > 0) {
            await prisma.section.deleteMany({
                where: { documentId: document.id },
            });
        }

        // Split the stored text into sections using simple logic
        // (since we can't re-send the original file to Gemini from here)
        const paragraphs = document.extractedText.split(/\n\n+/).filter((p) => p.trim().length > 50);

        if (paragraphs.length === 0) {
            return NextResponse.json(
                {
                    error:
                        "The stored text is too short to create sections. Try deleting and re-uploading the document.",
                },
                { status: 400 },
            );
        }

        // Group paragraphs into sections of ~1500 chars
        const sectionContents: { title: string; content: string }[] = [];
        let currentContent = "";
        let sectionIndex = 1;

        for (const para of paragraphs) {
            if (currentContent.length + para.length > 1500 && currentContent.length > 0) {
                sectionContents.push({
                    title: `Section ${sectionIndex}`,
                    content: currentContent.trim(),
                });
                sectionIndex++;
                currentContent = para;
            } else {
                currentContent += (currentContent ? "\n\n" : "") + para;
            }
        }

        if (currentContent.trim().length > 0) {
            sectionContents.push({
                title: `Section ${sectionIndex}`,
                content: currentContent.trim(),
            });
        }

        const sections = await prisma.$transaction(
            sectionContents.map((sec, index) =>
                prisma.section.create({
                    data: {
                        documentId: document.id,
                        title: sec.title,
                        content: sec.content,
                        sectionNumber: index + 1,
                        order: index,
                    },
                }),
            ),
        );

        return NextResponse.json(
            {
                success: true,
                sections: sections.length,
                message: `Document reprocessed into ${sections.length} sections`,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Reprocess error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Reprocess failed" },
            { status: 500 },
        );
    }
}
