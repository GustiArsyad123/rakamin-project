import { Job } from "bullmq";
import { db } from "../../models/store";
import { extractPdfText } from "../../services/pdf.service";
import { retrieve } from "../../services/rag.service";
import {
  evaluateCV,
  evaluateReport,
  finalSynthesis,
} from "../../services/eval.service";
import { withRetry } from "../../services/retry.util";

export default async function evaluateWorker(job: Job) {
  const jobId = job.data.id as string;
  const record = db.jobs.get(jobId);
  if (!record) return;
  record.status = "processing";
  record.updatedAt = Date.now();

  try {
    const cvDoc = db.docs.get(record.cvId)!;
    const reportDoc = db.docs.get(record.reportId)!;
    const cvText = await extractPdfText(cvDoc.path);
    const reportText = await extractPdfText(reportDoc.path);

    const [jdCtx, briefCtx, rubricCv, rubricRp] = await Promise.all([
      retrieve("job_descriptions", record.jobTitle, 8),
      retrieve("case_brief", "case study requirements for backend", 8),
      retrieve("rubric_cv", "cv evaluation rubric backend", 6),
      retrieve("rubric_report", "project report rubric backend", 6),
    ]);

    const cvEval = await withRetry(
      () => evaluateCV(cvText, jdCtx, rubricCv),
      3,
      1500,
    );
    const rpEval = await withRetry(
      () => evaluateReport(reportText, briefCtx, rubricRp),
      3,
      1500,
    );
    const final = finalSynthesis(cvEval, rpEval);

    record.status = "completed";
    record.result = { ...cvEval, ...rpEval, ...final };
    record.updatedAt = Date.now();
    db.jobs.set(record.id, record);
  } catch (e: any) {
    record.status = "failed";
    record.error = String(e?.message || e);
    record.updatedAt = Date.now();
    db.jobs.set(record.id, record);
    throw e;
  }
}
