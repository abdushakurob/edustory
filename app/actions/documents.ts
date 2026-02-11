"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function getDocuments(subjectId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Verify subject belongs to user
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.document.findMany({
    where: { subjectId },
    include: {
      sections: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocument(documentId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      sections: {
        include: {
          story: true,
          questions: true,
        },
        orderBy: { order: "asc" },
      },
      subject: true,
    },
  });

  if (!document) throw new Error("Document not found");

  // Verify subject belongs to user
  if (document.subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return document;
}

export async function createDocument(
  subjectId: string,
  title: string,
  fileName: string,
  fileType: string,
  filePath: string,
  fileSize: number,
  extractedText: string,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Verify subject belongs to user
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject || subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.document.create({
    data: {
      subjectId,
      title,
      fileName,
      fileType,
      filePath,
      fileSize,
      extractedText,
    },
  });
}

export async function deleteDocument(documentId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { subject: true },
  });

  if (!document) throw new Error("Document not found");

  if (document.subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.document.delete({
    where: { id: documentId },
  });
}

export async function createSection(
  documentId: string,
  title: string,
  content: string,
  sectionNumber: number,
  order: number,
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { subject: true },
  });

  if (!document) throw new Error("Document not found");

  if (document.subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return await prisma.section.create({
    data: {
      documentId,
      title,
      content,
      sectionNumber,
      order,
    },
  });
}

export async function getSection(sectionId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const section = await prisma.section.findUnique({
    where: { id: sectionId },
    include: {
      document: {
        include: { subject: true },
      },
      story: true,
      questions: true,
    },
  });

  if (!section) throw new Error("Section not found");

  if (section.document.subject.userId !== session.userId) {
    throw new Error("Unauthorized");
  }

  return section;
}
