const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function requestTranscript({ file, audioUrl, consent }) {
  const options = {};
  if (file) {
    const body = new FormData();
    body.append('audio', file);
    body.append('consent', String(consent));
    options.body = body;
  } else {
    options.headers = { 'content-type': 'application/json' };
    options.body = JSON.stringify({ audio_url: audioUrl, consent });
  }
  const response = await fetch(`${API_BASE}/api/transcript`, { method: 'POST', ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to analyze this recording.');
  return data;
}
