import legalJargon from '../data/legalJargon.json' with { type: 'json' };

const API_URL = 'https://api.assemblyai.com/v2';
const LEMUR_URL = 'https://api.assemblyai.com/lemur/v3/generate/task';

const demoTranscript = [
  { speaker: 'A', text: 'The plaintiff filed an affidavit about the property dispute. We can request an adjournment while the court reviews the evidence.', start: 0, end: 7600, confidence: 0.98 },
  { speaker: 'B', text: 'Will I need to attend the hearing next month?', start: 7900, end: 10500, confidence: 0.97 },
  { speaker: 'A', text: 'Yes. Bring the original agreement and any messages that support your claim. The court will decide whether an injunction is necessary.', start: 10800, end: 18000, confidence: 0.96 }
];

const headers = () => ({ authorization: process.env.ASSEMBLYAI_API_KEY });

export async function createTranscript({ file, audioUrl }) {
  if (!process.env.ASSEMBLYAI_API_KEY) return { transcript: demoTranscript, safeText: demoTranscript.map((line) => line.text).join(' '), transcriptId: null, isDemo: true, detectedLanguage: 'en' };

  let sourceUrl = audioUrl;
  if (file) {
    const uploadResponse = await fetch(`${API_URL}/upload`, { method: 'POST', headers: { ...headers(), 'content-type': file.mimetype }, body: file.buffer });
    if (!uploadResponse.ok) throw new Error('Audio provider rejected the upload. Check your AssemblyAI key, account status, and audio format.');
    sourceUrl = (await uploadResponse.json()).upload_url;
  }

  const startResponse = await fetch(`${API_URL}/transcript`, {
    method: 'POST',
    headers: { ...headers(), 'content-type': 'application/json' },
    body: JSON.stringify({
      audio_url: sourceUrl,
      speech_models: [process.env.SPEECH_MODEL || 'universal-3-pro'],
      language_detection: true,
      speaker_labels: true,
      speaker_options: { min_speakers_expected: 1, max_speakers_expected: 4 },
      keyterms_prompt: legalJargon.map((item) => item.term),
      redact_pii: true,
      redact_pii_policies: ['person_name', 'phone_number', 'us_social_security_number', 'credit_card_number', 'email_address', 'location', 'date_of_birth', 'passport_number', 'drivers_license'],
      redact_pii_sub: 'hash'
    })
  });
  if (!startResponse.ok) throw new Error('Audio provider could not start transcription. Check your AssemblyAI key and account status.');
  const started = await startResponse.json();
  const deadline = Date.now() + 60000;
  let result;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const pollResponse = await fetch(`${API_URL}/transcript/${started.id}`, { headers: headers() });
    result = await pollResponse.json();
    if (result.status === 'completed') break;
    if (result.status === 'error') throw new Error(result.error || 'AssemblyAI could not transcribe this audio.');
  }
  if (result?.status !== 'completed') throw new Error('Transcription timed out after 60 seconds.');
  const transcript = (result.utterances || [{ speaker: 'A', text: result.text, start: 0, end: result.audio_duration || 0, confidence: result.confidence }]).map((line) => ({
    speaker: line.speaker || 'A', text: line.text, start: line.start, end: line.end, confidence: line.confidence ?? null
  }));
  return { transcript, safeText: result.text, transcriptId: started.id, isDemo: false, detectedLanguage: result.language_code || 'unknown' };
}

export async function summarizeTranscript(transcriptId, text, isDemo) {
  const fallback = extractiveSummary(text);
  if (isDemo || !process.env.ASSEMBLYAI_API_KEY || !transcriptId) return fallback;
  try {
    const response = await fetch(LEMUR_URL, {
      method: 'POST',
      headers: { ...headers(), 'content-type': 'application/json' },
      body: JSON.stringify({
        transcript_ids: [transcriptId],
        prompt: 'Summarize this legal conversation in plain, simple language a non-lawyer would understand. Structure your response as: 1) What happened, 2) What the client needs to do next, 3) Any important dates mentioned. Keep it under 150 words.'
      })
    });
    if (!response.ok) return fallback;
    const data = await response.json();
    return data.response || fallback;
  } catch {
    return fallback;
  }
}

function extractiveSummary(text) {
  const sentences = text.match(/[^.!?]+[.!?]?/g)?.map((item) => item.trim()).filter(Boolean) || [];
  return `What happened: ${sentences.slice(0, 2).join(' ')}\n\nWhat the client needs to do next: Review the documents mentioned, keep supporting evidence, and attend the next hearing.\n\nImportant dates: Confirm the hearing date with your legal representative.`;
}
