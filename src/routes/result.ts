import { Router } from "express";
import { db } from "../models/store";

const router = Router();

router.get("/:id", async (req, res) => {
  const r = db.jobs.get(req.params.id);
  if (!r) return res.status(404).json({ error: "not found" });
  if (r.status === "completed")
    return res.json({ id: r.id, status: r.status, result: r.result });
  if (r.status === "failed")
    return res.status(500).json({ id: r.id, status: r.status, error: r.error });
  return res.json({ id: r.id, status: r.status });
});

export default router;
