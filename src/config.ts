import "dotenv/config";
export const config = {
  port: Number(process.env.PORT || 8080),
  env: process.env.NODE_ENV || "development",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  storageDir: process.env.STORAGE_DIR || "./storage",
  maxFileMB: Number(process.env.MAX_FILE_MB || 15),
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-large",
  },
  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    apiKey: process.env.QDRANT_API_KEY,
  },
};
