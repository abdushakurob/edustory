import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { generateSectionStory } from "@/app/actions/stories";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sectionId, subjectId, userFeedback } = await request.json();

    if (!sectionId || !subjectId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify authorization
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject || subject.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const story = await generateSectionStory(sectionId, subjectId, userFeedback);

    return NextResponse.json({ success: true, story }, { status: 201 });
  } catch (error) {
    console.error("Story generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Story generation failed",
      },
      { status: 500 },
    );
  }
}
