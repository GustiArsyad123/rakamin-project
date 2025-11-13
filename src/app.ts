import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { config } from './config';
import uploadRouter from './routes/upload';
import evaluateRouter from './routes/evaluate';
import resultRouter from './routes/result';
import ingestRouter from './routes/ingest';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(fileUpload({ limits: { fileSize: config.maxFileMB * 1024 * 1024 }, abortOnLimit: true }));


app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/upload', uploadRouter);
app.use('/evaluate', evaluateRouter);
app.use('/result', resultRouter);
app.use('/ingest', ingestRouter);


export default app;