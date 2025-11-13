import { embed } from "./llm.service";

export async function embedChunks(chunks: string[]): Promise<number[][]> {
  // Basic sequential embedding to keep it simple; can be batched in practice
  const out: number[][] = [];
  for (const c of chunks) out.push(await embed(c));
  return out;
}

export function chunkText(text: string, maxTokensApprox = 800): string[] {
  // naive chunk by characters (approx) — replace with tiktoken if needed
  const size = maxTokensApprox * 4; // ~4 chars per token heuristic
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}
