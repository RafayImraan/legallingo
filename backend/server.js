import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import transcriptRouter from './routes/transcript.js';

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',');
const requests = new Map();

function rateLimit(req, res, next) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const record = requests.get(key) || { count: 0, startedAt: now };
  if (now - record.startedAt > 60_000) { record.count = 0; record.startedAt = now; }
  record.count += 1;
  requests.set(key, record);
  if (record.count > 15) return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  next();
}

app.disable('x-powered-by');
app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', rateLimit);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'LegalLingo API', assemblyaiConfigured: Boolean(process.env.ASSEMBLYAI_API_KEY) }));
app.use('/api/transcript', transcriptRouter);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Unexpected server error.' });
});

app.listen(port, () => console.log(`LegalLingo API listening on http://localhost:${port}`));
