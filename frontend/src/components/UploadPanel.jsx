import { FileAudio, HeartHandshake, House, LoaderCircle, Shield, Upload, Waves } from 'lucide-react';
import { useRef, useState } from 'react';

const samples = [
  { label: 'Property dispute', detail: 'Instant demo', icon: House },
  { label: 'Family case', detail: 'Instant demo', icon: HeartHandshake },
  { label: 'Criminal bail', detail: 'Instant demo', icon: Shield }
];

export default function UploadPanel({ status, onSubmit, error }) {
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const busy = status === 'uploading' || status === 'processing';
  const chooseFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > 50 * 1024 * 1024) {
      setFile(null);
      window.alert('The maximum audio size is 50 MB. Please trim or compress the recording, then try again.');
      event.target.value = '';
      return;
    }
    setFile(selected);
  };
  const submitFile = () => file && onSubmit({ file, consent });
  return (
    <section id="upload" className="upload-section" aria-labelledby="upload-title">
      <div className="upload-intro"><div className="section-heading"><p className="eyebrow">New analysis</p><h2 id="upload-title">Start with the conversation.</h2><p>Upload a recording or run a guided demo to see the full analysis.</p></div><div className="upload-guidance"><span>Accepted formats</span><strong>MP3, WAV, M4A</strong><span>Maximum file size</span><strong>50 MB</strong></div></div>
      <div className={`drop-zone ${file ? 'has-file' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const dropped = event.dataTransfer.files?.[0]; if (dropped) chooseFile({ target: { files: [dropped], value: '' } }); }}>
        <div className="upload-icon"><FileAudio size={25} /></div>
        <div className="drop-zone-copy"><h3>{file ? file.name : 'Drop your audio file here'}</h3><p>{file ? 'Ready for analysis' : 'or choose a file from your device'}</p></div>
        <input ref={inputRef} type="file" accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/x-m4a" onChange={chooseFile} hidden />
        <div className="upload-actions">
          <button className="secondary-button" onClick={() => inputRef.current?.click()} disabled={busy}><Upload size={16} /> Browse files</button>
          {file && <button className="primary-button compact" onClick={submitFile} disabled={busy || !consent}>Analyze recording</button>}
        </div>
      </div>
      <label className="consent-check"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I have permission from everyone recorded to process this audio. I understand LegalLingo is not legal advice.</span></label>
      <div className="sample-row"><span><Waves size={16} /> Or try a scenario</span>{samples.map((sample) => { const Icon = sample.icon; return <button key={sample.label} className="sample-button" onClick={() => onSubmit({ consent: true, demo: true })} disabled={busy}><Icon size={16} /><span><strong>{sample.label}</strong><small>{sample.detail}</small></span></button>; })}</div>
      {busy && <div className="progress-state" role="status"><LoaderCircle className="spin" size={20} /><span>{status === 'uploading' ? 'Uploading securely...' : 'Transcribing, redacting, and summarizing...'}</span><div className="progress-track"><i /></div></div>}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}
