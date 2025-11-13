import { Router } from "express";
import fs from "fs";
import path from "path";
import { ingestDocuments, CollectionName } from "../services/rag.service";

const router = Router();

const BodySchema = {
  // very light validation to keep dependencies small
  parse(body: any): {
    type: CollectionName;
    items: { title: string; text?: string; filePath?: string }[];
  } {
    const ok =
      body &&
      ["job_description", "case_brief", "rubric_cv", "rubric_report"].includes(
        body.type,
      ) &&
      Array.isArray(body.items);
    if (!ok) throw new Error("Invalid body");
    return body as any;
  },
};

router.post("/", async (req, res) => {
  try {
    const { type, items } = BodySchema.parse(req.body);
    const toIngest: { title: string; text: string }[] = [];
    for (const it of items) {
      if (it.text) toIngest.push({ title: it.title, text: it.text });
      else if (it.filePath) {
        const p = path.isAbsolute(it.filePath)
          ? it.filePath
          : path.join(process.cwd(), it.filePath);
        const text = fs.readFileSync(p, "utf8");
        toIngest.push({ title: it.title, text });
      } else {
        throw new Error("Each item needs text or filePath");
      }
    }
    await ingestDocuments(type as CollectionName, toIngest);
    res.json({ ok: true, count: toIngest.length });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
