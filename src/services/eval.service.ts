import { chatJSON } from "./llm.service";

export interface CvEval {
  cv_match_rate: number; // 0..1
  cv_feedback: string;
}
export interface ReportEval {
  project_score: number; // 1..5
  project_feedback: string;
}

export async function evaluateCV(
  cvText: string,
  jdCtx: string[],
  rubricCv: string[],
): Promise<CvEval> {
  const system =
    "You are a strict technical recruiter. Score ONLY by rubric. Return JSON.";
  const user = `
<JOB_DESCRIPTION>\n${jdCtx.join("\n---\n")}</JOB_DESCRIPTION>
<RUBRIC_CV>\n${rubricCv.join("\n---\n")}</RUBRIC_CV>
<CV>\n${cvText}</CV>
Return JSON with fields: {"cv_match_rate": number (0..1), "cv_feedback": string}`;
  return await chatJSON(system, user);
}

export async function evaluateReport(
  reportText: string,
  briefCtx: string[],
  rubricReport: string[],
): Promise<ReportEval> {
  const system =
    "You are a principal engineer evaluating a case-study report. Return JSON.";
  const user = `
<CASE_STUDY_BRIEF>\n${briefCtx.join("\n---\n")}</CASE_STUDY_BRIEF>
<RUBRIC_REPORT>\n${rubricReport.join("\n---\n")}</RUBRIC_REPORT>
<REPORT>\n${reportText}</REPORT>
Return JSON with fields: {"project_score": number (1..5), "project_feedback": string}`;
  return await chatJSON(system, user);
}

export function finalSynthesis(
  cv: CvEval,
  rp: ReportEval,
): { overall_summary: string } {
  const strong = rp.project_score >= 4 && cv.cv_match_rate >= 0.7;
  const msg = strong
    ? "Good candidate fit; strengths in core backend and case understanding. Consider deeper RAG/ops hardening."
    : "Partial fit; address gaps in rubric-related areas before moving forward.";
  return { overall_summary: msg };
}
