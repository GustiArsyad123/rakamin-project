import { config } from "../config";
import fs from "fs";
import path from "path";

export async function saveFile(id: string, file: any): Promise<string> {
  const dir = config.storageDir;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, `${id}.pdf`);
  await file.mv(p);
  return p;
}
