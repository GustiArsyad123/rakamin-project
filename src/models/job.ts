import { z } from "zod";

export const EvaluateInput = z.object({
  jobTitle: z.string().min(2),
  cvId: z.string().uuid(),
  reportId: z.string().uuid(),
});
export type EvaluateInput = z.infer<typeof EvaluateInput>;
