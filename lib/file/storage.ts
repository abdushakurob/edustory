import * as fs from "fs";
import * as path from "path";
import { writeFile } from "fs/promises";

export async function saveUploadedFile(
  file: File,
  filename: string,
  subjectId: string,
): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", subjectId);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  // Return relative path for web access
  return `/uploads/${subjectId}/${filename}`;
}

export function validateFileType(filename: string): boolean {
  const allowedExtensions = [
    ".pdf",
    ".docx",
    ".ppt",
    ".pptx",
    ".txt",
    ".png",
    ".jpg",
    ".jpeg",
  ];
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
}

export async function readFileAsBuffer(filePath: string): Promise<Buffer> {
  const fullPath = path.join(process.cwd(), "public", filePath);
  return fs.readFileSync(fullPath);
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase().replace(".", "");
}

export function getFileName(filename: string): string {
  return path.basename(filename);
}
