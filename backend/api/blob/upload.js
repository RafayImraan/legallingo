import { handleUpload } from '@vercel/blob/client';

const allowedTypes = [
  'audio/mpeg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/ogg'
];
const maxSize = 50 * 1024 * 1024;

function setCorsHeaders(req, res) {
  const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim());
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const response = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('legallingo-audio/')) {
          throw new Error('Invalid upload path.');
        }

        return {
          allowedContentTypes: allowedTypes,
          maximumSizeInBytes: maxSize,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ purpose: 'legal-transcription' })
        };
      },
      onUploadCompleted: async () => {}
    });

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Unable to authorize the audio upload.' });
  }
}
