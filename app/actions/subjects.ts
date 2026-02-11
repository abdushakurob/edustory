"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function createSubject(
  title: string,
  description?: string,
  theme?: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  return await prisma.subject.create({
    data: {
      userId: session.userId,
      title,
      description,
      theme: theme || "Academic",
    },
  });
}

export async function getSubjects() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  return await prisma.subject.findMany({
    where: { userId: session.userId },
    include: {
      documents: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubject(subjectId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      documents: {
        include: {
          sections: true,
        },
      },
      stories: true,
      questions: true,
    },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Subject not found or unauthorized");
  }

  return subject;
}

export async function updateSubject(
  subjectId: string,
  title?: string,
  description?: string,
  theme?: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Subject not found or unauthorized");
  }

  return await prisma.subject.update({
    where: { id: subjectId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(theme && { theme }),
    },
  });
}

export async function deleteSubject(subjectId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Subject not found or unauthorized");
  }

  return await prisma.subject.delete({
    where: { id: subjectId },
  });
}
