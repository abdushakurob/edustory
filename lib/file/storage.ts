import * as fs from "fs";
import * as path from "path";
import { writeFile } from "fs/promises";

export async function saveUploadedFile(
  file: File,
  filename: string,
  subjectId: string,
): Promise<string> {
  // On production (Vercel), we can't write to filesystem
  // Instead, return a virtual path and store content in database
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    // Return a virtual path that won't be used for file serving
    // The actual file content will be stored as text in the database
    return `/uploads/${subjectId}/${filename}`;
  }

  // Local development: write to filesystem
  const uploadDir = path.join(process.cwd(), "public", "uploads", subjectId);

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return `/uploads/${subjectId}/${filename}`;
  } catch (error) {
    console.warn("Failed to write file to disk, using virtual path:", error);
    // Fallback to virtual path if filesystem write fails
    return `/uploads/${subjectId}/${filename}`;
  }
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
