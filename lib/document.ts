import type { ParsedDocument } from "@/types";

export async function parseFile(file: File): Promise<ParsedDocument> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  let content = "";

  if (ext === "txt") {
    content = await readAsText(file);
  } else if (ext === "pdf") {
    content = await parsePdf(file);
  } else if (ext === "docx") {
    content = await parseDocx(file);
  } else {
    throw new Error(`Unsupported file type: .${ext}`);
  }

  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: file.name,
    type: ext as "pdf" | "txt" | "docx",
    content,
    size: file.size,
    uploadedAt: new Date(),
  };
}

function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read text file"));
    reader.readAsText(file);
  });
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // Dynamic import to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");
  // Use local worker from public directory
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const texts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => ("str" in (item as object) ? (item as { str: string }).str : ""))
      .join(" ");
    texts.push(pageText);
  }

  return texts.join("\n\n");
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};
