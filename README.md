# rakamin-project

node-backend-ai-evaluator

Backend service to automate initial screening of job applications using an async AI pipeline with RAG. Built with Node.js + TypeScript + Express, BullMQ (Redis), Qdrant for vector search, and OpenAI-compatible LLMs.

Features

REST endpoints: POST /upload, POST /evaluate, GET /result/:id, POST /ingest

Async evaluation via BullMQ. Poll results with /result/:id

RAG over Job Descriptions, Case Study Brief, CV Rubric, Report Rubric (ingest once, reproducible)

PDF parsing (cv/report), robust prompts, JSON schema validation, retries/backoff

Pluggable LLM (OpenAI, OpenRouter, others via OpenAI-compatible base URL)

Dockerized (api + redis + qdrant); no external DB needed beyond Redis and Qdrant