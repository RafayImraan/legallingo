const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function uploadAudio(file) {
  const { upload } = await import('@vercel/blob/client');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  try {
    const blob = await upload(`legallingo-audio/${Date.now()}-${safeName}`, file, {
      access: 'public',
      handleUploadUrl: `${API_BASE}/api/blob/upload`
    });
    return blob.url;
  } catch (error) {
    throw new Error(error.message || 'Audio upload failed. Confirm the Vercel Blob store is connected to the API project.');
  }
}

export async function requestTranscript({ file, audioUrl, consent, demo = false }) {
  const options = {};
  if (file) {
    const body = new FormData();
    body.append('audio', file);
    body.append('consent', String(consent));
    options.body = body;
  } else {
    options.headers = { 'content-type': 'application/json' };
    options.body = JSON.stringify({ audio_url: audioUrl, consent, demo });
  }
  let response;
  try {
    response = await fetch(`${API_BASE}/api/transcript`, { method: 'POST', ...options });
  } catch {
    throw new Error('Could not reach the analysis service. For uploads, keep the file below 4 MB on this Vercel deployment.');
  }
  let data;
  try { data = await response.json(); } catch { throw new Error('The analysis service returned an invalid response. Please try again.'); }
  if (!response.ok) throw new Error(data.error || 'Unable to analyze this recording.');
  return data;
}
