import { FileAudio, HeartHandshake, House, LoaderCircle, Shield, Upload, Waves } from 'lucide-react';
import { useRef, useState } from 'react';

const samples = [
  { label: 'Property dispute', detail: '~90 sec demo', icon: House, url: 'https://example.com/legallingo-property-dispute.mp3' },
  { label: 'Family case', detail: '~75 sec demo', icon: HeartHandshake, url: 'https://example.com/legallingo-family-case.mp3' },
  { label: 'Criminal bail', detail: '~60 sec demo', icon: Shield, url: 'https://example.com/legallingo-criminal-bail.mp3' }
];

export default function UploadPanel({ status, onSubmit, error }) {
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const busy = status === 'uploading' || status === 'processing';
  const chooseFile = (event) => {
    const selected = event.target.files?.[0];
    if (selected) setFile(selected);
  };
  const submitFile = () => file && onSubmit({ file, consent });
  return (
    <section id="upload" className="upload-section" aria-labelledby="upload-title">
      <div className="upload-intro"><div className="section-heading"><p className="eyebrow">New analysis</p><h2 id="upload-title">Start with the conversation.</h2><p>Upload a recording or run a guided demo to see the full analysis.</p></div><div className="upload-guidance"><span>Accepted formats</span><strong>MP3, WAV, M4A</strong><span>Maximum file size</span><strong>50 MB</strong></div></div>
      <div className={`drop-zone ${file ? 'has-file' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const dropped = event.dataTransfer.files?.[0]; if (dropped) setFile(dropped); }}>
        <div className="upload-icon"><FileAudio size={25} /></div>
        <div className="drop-zone-copy"><h3>{file ? file.name : 'Drop your audio file here'}</h3><p>{file ? 'Ready for analysis' : 'or choose a file from your device'}</p></div>
        <input ref={inputRef} type="file" accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a" onChange={chooseFile} hidden />
        <div className="upload-actions">
          <button className="secondary-button" onClick={() => inputRef.current?.click()} disabled={busy}><Upload size={16} /> Browse files</button>
          {file && <button className="primary-button compact" onClick={submitFile} disabled={busy || !consent}>Analyze recording</button>}
        </div>
      </div>
      <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I have permission from everyone recorded to process this audio. I understand LegalLingo is not legal advice.</span></label>
      <div className="sample-row"><span><Waves size={16} /> Or try a scenario</span>{samples.map((sample) => { const Icon = sample.icon; return <button key={sample.label} className="sample-button" onClick={() => onSubmit({ audioUrl: sample.url, consent: true })} disabled={busy}><Icon size={16} /><span><strong>{sample.label}</strong><small>{sample.detail}</small></span></button>; })}</div>
      {busy && <div className="progress-state" role="status"><LoaderCircle className="spin" size={20} /><span>{status === 'uploading' ? 'Uploading securely...' : 'Transcribing, redacting, and summarizing...'}</span><div className="progress-track"><i /></div></div>}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}
