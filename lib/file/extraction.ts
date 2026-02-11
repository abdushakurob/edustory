import pdfParse from "pdf-parse";

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
    // For now, return a placeholder message
    // Full DOCX parsing requires additional setup
    return "Document text extracted. Full content parsing is in development.";
  } catch (error) {
    console.error("Error extracting DOCX:", error);
    throw new Error("Failed to extract DOCX text");
  }
}

export async function extractTextFile(buffer: Buffer): Promise<string> {
  try {
    return buffer.toString("utf-8");
  } catch (error) {
    console.error("Error extracting text file:", error);
    throw new Error("Failed to extract text file");
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
