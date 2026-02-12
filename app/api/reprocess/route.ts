import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { chunkText } from "@/lib/file/extraction";
import prisma from "@/lib/db";

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

        // Get the document with its extracted text
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
                        "No text content found in this document. The file may not contain extractable text. Try re-uploading the document.",
                },
                { status: 400 },
            );
        }

        // Delete existing sections (if any) before recreating
        if (document.sections.length > 0) {
            await prisma.section.deleteMany({
                where: { documentId: document.id },
            });
        }

        // Re-chunk and create sections directly via Prisma
        const chunks = chunkText(document.extractedText, 1500);

        if (chunks.length === 0) {
            return NextResponse.json(
                {
                    error:
                        "Could not split the document into sections. The extracted text may be too short.",
                },
                { status: 400 },
            );
        }

        const sections = await prisma.$transaction(
            chunks.map((chunk, index) =>
                prisma.section.create({
                    data: {
                        documentId: document.id,
                        title: `Section ${index + 1}`,
                        content: chunk,
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
