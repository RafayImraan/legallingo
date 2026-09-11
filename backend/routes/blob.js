import { Router } from 'express';
import { handleUpload } from '@vercel/blob/client';

const router = Router();
const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg'];
const maxSize = 50 * 1024 * 1024;

router.post('/upload', async (req, res) => {
  try {
    const response = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('legallingo-audio/')) throw new Error('Invalid upload path.');
        return {
          allowedContentTypes: allowedTypes,
          maximumSizeInBytes: maxSize,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ purpose: 'legal-transcription' })
        };
      },
      onUploadCompleted: async () => {}
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to authorize the audio upload.' });
  }
});

export default router;
