import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractPdfText(filePath: string): Promise<string> {
  const data = await pdfParse(fs.readFileSync(filePath));
  return data.text || "";
}
