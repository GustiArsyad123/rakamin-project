import OpenAI from "openai";
import { config } from "../config";

const client = new OpenAI({
  apiKey: config.openai.apiKey,
  baseURL: config.openai.baseURL,
});

export async function chatJSON(system: string, user: string) {
  const r = await client.chat.completions.create({
    model: config.openai.model,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return JSON.parse(r.choices[0].message?.content ?? "{}");
}

export async function embed(text: string): Promise<number[]> {
  const r = await client.embeddings.create({
    model: config.openai.embeddingModel,
    input: text,
  });
  return r.data[0].embedding as unknown as number[];
}
