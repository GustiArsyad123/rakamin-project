import { Queue, Worker } from "bullmq";
import { config } from "../config";
import { logger } from "../utils/logger";
import evaluateWorker from "./workers/evaluate.worker";

export const queueName = "evaluation";
export const evaluationQueue = new Queue(queueName, {
  connection: { url: config.redisUrl },
});

new Worker(queueName, evaluateWorker as any, {
  connection: { url: config.redisUrl },
  concurrency: 2,
})
  .on("failed", (job, err) =>
    logger.error({ jobId: job?.id, err }, "Job failed"),
  )
  .on("completed", (job) => logger.info({ jobId: job?.id }, "Job completed"));
