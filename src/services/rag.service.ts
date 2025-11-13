import { QdrantClient } from 'qdrant-js';
import { config } from '../config';
import { embed } from './llm.service';


export type CollectionName = 'job_descriptions'|'case_brief'|'rubric_cv'|'rubric_report';


const client = new QdrantClient({ url: config.qdrant.url, apiKey: config.qdrant.apiKey });


async function ensureCollection(name: CollectionName, vectorSize = 3072) {
const exists = await client.getCollections().then(r => r.collections?.some(c => c.name === name));
if (!exists) {
await client.createCollection(name, {
vectors: { size: vectorSize, distance: 'Cosine' }
});
}
}


export async function ingestDocuments(name: CollectionName, items: {title: string, text: string}[]) {
await ensureCollection(name);
const points = [] as any[];
for (const it of items) {
const vec = await embed(it.text);
points.push({ id: crypto.randomUUID(), vector: vec, payload: { title: it.title, text: it.text } });
}
await client.upsert(name, { points });
}


export async function retrieve(name: CollectionName, query: string, topK = 8): Promise<string[]> {
await ensureCollection(name);
const qv = await embed(query);
const r = await client.search(name, { vector: qv, limit: topK, with_payload: true });
return (r ?? []).map((p: any) => p.payload?.text).filter(Boolean);
}