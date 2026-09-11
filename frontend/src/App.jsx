import { RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { requestTranscript, uploadAudio } from './api/client.js';
import Landing from './components/Landing.jsx';
import UploadPanel from './components/UploadPanel.jsx';
import TranscriptView from './components/TranscriptView.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import PrivacyBadge from './components/PrivacyBadge.jsx';
import CaseBrief from './components/CaseBrief.jsx';
import AccuracyIndicator from './components/AccuracyIndicator.jsx';
import { demoResult } from './data/demoResult.js';

export default function App() {
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [speakerNames, setSpeakerNames] = useState({});
  const showResult = (data) => {
    setSpeakerNames(Object.fromEntries([...new Set(data.transcript.map((line) => line.speaker))].map((speaker) => [speaker, `Speaker ${speaker}`])));
    setResult(data);
    setStatus('results');
    setTimeout(() => document.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };
  const handleSubmit = async (payload) => {
    setError(''); setStatus('uploading');
    if (payload.demo) { showResult(demoResult); return; }
    try {
      const audioUrl = payload.file ? await uploadAudio(payload.file) : payload.audioUrl;
      setStatus('processing');
      const data = await requestTranscript({ ...payload, file: undefined, audioUrl });
      showResult(data);
    }
    catch (requestError) { setError(requestError.message); setStatus('idle'); }
  };
  const reset = () => { setResult(null); setSpeakerNames({}); setError(''); setStatus('idle'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <main><Landing /><UploadPanel status={status} onSubmit={handleSubmit} error={error} />{result && <section id="results" className="results"><div className="result-topline"><div><p className="eyebrow">Analysis complete</p><h2>Conversation brief</h2></div><div className="result-actions"><PrivacyBadge /><AccuracyIndicator accuracy={result.accuracy} language={result.detected_language} />{result.demo_mode && <span className="demo-note">Demo result</span>}<button className="reset-button" onClick={reset}><RotateCcw size={15} /> New analysis</button></div></div><div className="result-layout"><TranscriptView transcript={result.transcript} jargonMatches={result.jargon_matches} speakerNames={speakerNames} onSpeakerNameChange={(speaker, name) => setSpeakerNames((current) => ({ ...current, [speaker]: name }))} /><aside className="brief-column"><CaseBrief brief={result.case_brief} /><SummaryCard summary={result.summary} /></aside></div></section>}</main>;
}
