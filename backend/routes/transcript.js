import { Router } from 'express';
import multer from 'multer';
import { createTranscript, summarizeTranscript } from '../services/assemblyai.js';
import { findJargon } from '../services/jargonDetector.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const supportedTypes = new Set(['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg']);

router.post('/', upload.single('audio'), async (req, res, next) => {
  try {
    const audioUrl = req.body?.audio_url;
    const demo = req.body?.demo === true || req.body?.demo === 'true';
    const consent = req.body?.consent === true || req.body?.consent === 'true';
    if (!demo && !req.file && !audioUrl) {
      return res.status(400).json({ error: 'Upload an audio file or provide audio_url.' });
    }
    if (!consent) {
      return res.status(400).json({ error: 'Confirm that you have permission to process this recording.' });
    }
    if (req.file && !supportedTypes.has(req.file.mimetype)) {
      return res.status(400).json({ error: 'Unsupported file type. Upload MP3, WAV, M4A, AAC, or OGG audio.' });
    }
    if (audioUrl && !/^https:\/\/.+/i.test(audioUrl)) {
      return res.status(400).json({ error: 'audio_url must be a valid HTTPS URL.' });
    }

    const completed = await createTranscript({ file: req.file, audioUrl, demo });
    const transcriptText = completed.transcript.map((line) => line.text).join(' ');
    const jargonMatches = findJargon(transcriptText);
    const summary = await summarizeTranscript(completed.transcriptId, completed.safeText, completed.isDemo);

    res.json({
      transcript: completed.transcript,
      jargon_matches: jargonMatches,
      summary,
      case_brief: buildCaseBrief(completed.safeText),
      pii_redacted: true,
      detected_language: completed.detectedLanguage,
      accuracy: calculateAccuracy(completed.transcript),
      demo_mode: completed.isDemo
    });
  } catch (error) {
    next(error);
  }
});

function buildCaseBrief(text) {
  const sentences = text.match(/[^.!?]+[.!?]?/g)?.map((item) => item.trim()).filter(Boolean) || [];
  const actionItems = sentences.filter((sentence) => /\b(bring|attend|file|submit|provide|review|keep|contact|send)\b/i.test(sentence)).slice(0, 3);
  const dateMatches = text.match(/\b(?:today|tomorrow|next\s+(?:week|month|monday|tuesday|wednesday|thursday|friday)|\d{1,2}[\/-]\d{1,2}(?:[\/-]\d{2,4})?)\b/gi) || [];
  return {
    key_points: sentences.slice(0, 3),
    action_items: actionItems.length ? actionItems : ['Review the transcript with a qualified legal professional before taking action.'],
    dates: [...new Set(dateMatches)].slice(0, 3),
    disclaimer: 'LegalLingo explains recorded conversation. It is not legal advice and does not replace a qualified lawyer.'
  };
}

function calculateAccuracy(transcript) {
  const confidences = transcript.map((line) => line.confidence).filter((value) => Number.isFinite(value));
  if (!confidences.length) return { score: null, review_required: true, message: 'No confidence signal was returned. Review the transcript before relying on it.' };
  const score = confidences.reduce((sum, value) => sum + value, 0) / confidences.length;
  return {
    score: Number(score.toFixed(3)),
    review_required: score < 0.9,
    message: score < 0.9 ? 'Some portions may be uncertain. Review the highlighted transcript against the recording.' : 'Strong transcription confidence. Review critical legal details against the recording.'
  };
}

export default router;
