// Minimal in-memory store for jobs and docs metadata. Replace with DB if desired.

export type JobStatus = "queued" | "processing" | "completed" | "failed";

export interface JobRecord {
  id: string;
  jobTitle: string;
  cvId: string;
  reportId: string;
  status: JobStatus;
  result?: any;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DocRecord {
  id: string;
  kind:
    | "cv"
    | "report"
    | "job_description"
    | "case_brief"
    | "rubric_cv"
    | "rubric_report";
  title: string;
  path: string;
  mime: string;
}

export const db = {
  jobs: new Map<string, JobRecord>(),
  docs: new Map<string, DocRecord>(),
};
