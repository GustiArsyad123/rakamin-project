import { Router } from "express";
import { v4 as uuid } from "uuid";
import { EvaluateInput } from "../models/job";
import { db } from "../models/store";
import { evaluationQueue } from "../queue";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = EvaluateInput.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten() });
  const { jobTitle, cvId, reportId } = parsed.data;

  const id = uuid();
  const now = Date.now();
  db.jobs.set(id, {
    id,
    jobTitle,
    cvId,
    reportId,
    status: "queued",
    createdAt: now,
    updatedAt: now,
  });
  await evaluationQueue.add(
    "evaluate",
    { id },
    { attempts: 3, backoff: { type: "exponential", delay: 2000 } },
  );
  res.json({ id, status: "queued" });
});

export default router;
