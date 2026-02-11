import pdfParse from "pdf-parse";
import { Docx } from "docx";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting PDF:", error);
    throw new Error("Failed to extract PDF text");
  }
}

export async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const doc = await Docx.fromBuffer(buffer);
    const paragraphs = doc.sections?.[0]?.children || [];

    const text = paragraphs
      .map((para: any) => {
        if (para.text) return para.text;
        if (para.children) {
          return para.children.map((child: any) => child.text || "").join("");
        }
        return "";
      })
      .join("\n");

    return text;
  } catch (error) {
    console.error("Error extracting DOCX:", error);
    throw new Error("Failed to extract DOCX text");
  }
}

export function chunkText(text: string, chunkSize: number = 2000): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim();
}
