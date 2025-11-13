import { Router } from "express";
import { v4 as uuid } from "uuid";
import { saveFile } from "../services/storage.service";
import { db } from "../models/store";

const router = Router();

router.post("/", async (req: any, res) => {
  const cv = req.files?.cv;
  const report = req.files?.report;
  if (!cv || !report)
    return res.status(400).json({ error: "cv and report are required" });
  const asFile = (f: any) => (Array.isArray(f) ? f[0] : f);
  const cvFile = asFile(cv);
  const rpFile = asFile(report);
  if (
    cvFile.mimetype !== "application/pdf" ||
    rpFile.mimetype !== "application/pdf"
  ) {
    return res.status(400).json({ error: "Only PDF is allowed" });
  }
  const cvId = uuid();
  const rpId = uuid();
  const cvPath = await saveFile(cvId, cvFile);
  const rpPath = await saveFile(rpId, rpFile);
  db.docs.set(cvId, {
    id: cvId,
    kind: "cv",
    title: "Candidate CV",
    path: cvPath,
    mime: cvFile.mimetype,
  });
  db.docs.set(rpId, {
    id: rpId,
    kind: "report",
    title: "Project Report",
    path: rpPath,
    mime: rpFile.mimetype,
  });
  res.json({ cvId, reportId: rpId });
});

export default router;
