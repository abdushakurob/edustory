"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import {
  generateStory,
  generateQuestions,
  generateFeedback,
} from "@/lib/ai/gemini";

export async function createStory(
  sectionId: string,
  subjectId: string,
  narrative: string,
  keyPoints: string[],
  summary: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Verify authorization
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.story.create({
    data: {
      sectionId,
      subjectId,
      narrative,
      keyPoints: JSON.stringify(keyPoints),
      summary,
    },
  });
}

export async function generateSectionStory(
  sectionId: string,
  subjectId: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Verify authorization
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) throw new Error("Section not found");

  // Check if story already exists
  const existingStory = await prisma.story.findUnique({
    where: { sectionId },
  });

  if (existingStory) {
    return existingStory;
  }

  // Generate story from section content
  const story = await generateStory(
    section.content,
    subject.title,
    subject.theme,
    section.title || undefined,
  );

  return await createStory(
    sectionId,
    subjectId,
    story.narrative,
    story.keyPoints,
    story.summary,
  );
}

export async function getStory(sectionId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const story = await prisma.story.findUnique({
    where: { sectionId },
    include: {
      section: {
        include: {
          document: {
            include: { subject: true },
          },
        },
      },
    },
  });

  if (!story) return null;

  if (story.section.document.subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return {
    ...story,
    keyPoints: JSON.parse(story.keyPoints),
  };
}

export async function generateSectionQuestions(
  sectionId: string,
  subjectId: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Verify authorization
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) throw new Error("Section not found");

  // Get the story for context - IMPORTANT: story provides the AI-generated narrative
  const story = await prisma.story.findUnique({
    where: { sectionId },
  });

  if (!story) {
    throw new Error(
      "Please generate the story first before creating questions",
    );
  }

  // Generate questions using BOTH story narrative and original content
  const questionSet = await generateQuestions(
    section.content,
    subject.title,
    subject.theme,
    story.narrative, // Use the AI-generated story narrative
  );

  if (!questionSet.questions || questionSet.questions.length === 0) {
    throw new Error("Failed to generate valid questions. Please try again.");
  }

  // Save questions to database
  const savedQuestions = await Promise.all(
    questionSet.questions.map((q, index) =>
      prisma.question.create({
        data: {
          sectionId,
          subjectId,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options ? JSON.stringify(q.options) : null,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          order: index,
        },
      }),
    ),
  );

  return savedQuestions;
}

export async function getQuestions(sectionId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const questions = await prisma.question.findMany({
    where: { sectionId },
    orderBy: { order: "asc" },
  });

  // Verify authorization
  if (questions.length > 0) {
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        document: {
          include: { subject: true },
        },
      },
    });

    if (!section || section.document.subject.userId !== session.userId) {
      throw new Error("Unauthorized");
    }
  }

  return questions.map((q) => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null,
  }));
}

export async function submitAnswer(
  questionId: string,
  userAnswer: string,
  subjectId: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) throw new Error("Question not found");

  if (question.subjectId !== subjectId) {
    throw new Error("Question does not belong to this subject");
  }

  // Verify subject belongs to user
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  // Check if answer is correct
  const isCorrect =
    userAnswer.toLowerCase().trim() ===
    question.correctAnswer.toLowerCase().trim();

  // Generate feedback
  let feedback = question.explanation;
  if (!isCorrect) {
    try {
      feedback = await generateFeedback(
        userAnswer,
        question.correctAnswer,
        question.questionText,
        subject.title,
        subject.theme,
      );
    } catch (error) {
      feedback = question.explanation;
    }
  }

  // Save attempt
  const attempt = await prisma.answerAttempt.create({
    data: {
      userId: session.userId,
      subjectId,
      questionId,
      userAnswer,
      isCorrect,
      feedback,
    },
  });

  return {
    isCorrect,
    feedback,
    correctAnswer: question.correctAnswer,
    attempt,
  };
}

export async function getAnswerHistory(subjectId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Verify subject belongs to user
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.answerAttempt.findMany({
    where: {
      userId: session.userId,
      subjectId,
    },
    include: {
      question: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
