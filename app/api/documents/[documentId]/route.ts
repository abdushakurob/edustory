import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { documentId: string } },
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const document = await prisma.document.findUnique({
            where: { id: params.documentId },
            include: { subject: true },
        });

        if (!document) {
            return NextResponse.json(
                { error: "Document not found" },
                { status: 404 },
            );
        }

        if (document.subject.userId !== session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.document.delete({
            where: { id: params.documentId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Delete failed" },
            { status: 500 },
        );
    }
}
