import { useState } from 'react';
import JargonTooltip from './JargonTooltip.jsx';

function markJargon(text, matches, onSelect) {
  const found = matches.flatMap((match) => [...text.matchAll(new RegExp(`\\b${match.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'))].map((item) => ({ start: item.index, end: item.index + item[0].length, match })));
  const ordered = found.sort((a, b) => a.start - b.start);
  let cursor = 0;
  const parts = [];
  ordered.forEach((item, index) => {
    if (item.start < cursor) return;
    if (item.start > cursor) parts.push(text.slice(cursor, item.start));
    parts.push(<button key={`${item.start}-${index}`} className="jargon-term" onClick={() => onSelect(item.match)}>{text.slice(item.start, item.end)}</button>);
    cursor = item.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export default function TranscriptView({ transcript, jargonMatches, speakerNames, onSpeakerNameChange }) {
  const [selected, setSelected] = useState(null);
  const speakers = [...new Set(transcript.map((line) => line.speaker))];
  return <section className="transcript-section" aria-labelledby="transcript-title"><div className="section-heading"><p className="eyebrow">Redacted transcript</p><h2 id="transcript-title">Every important detail, easier to follow.</h2></div><div className="role-confirmation"><div><strong>Confirm speaker roles</strong><p>Voice diarization identifies speakers, not their profession. Label them before sharing this brief.</p></div><div className="role-fields">{speakers.map((speaker) => <label key={speaker}>Speaker {speaker}<select value={speakerNames[speaker] || `Speaker ${speaker}`} onChange={(event) => onSpeakerNameChange(speaker, event.target.value)}><option>Speaker {speaker}</option><option>Lawyer</option><option>Client</option><option>Judge</option><option>Family member</option><option>Other participant</option></select></label>)}</div></div><div className="transcript-list">{transcript.map((line, index) => <article className={`transcript-line ${line.confidence !== null && line.confidence < 0.9 ? 'low-confidence' : ''}`} key={`${line.start}-${index}`}><div className="speaker">{speakerNames[line.speaker] || `Speaker ${line.speaker}`}{line.confidence !== null && line.confidence < 0.9 && <small>Review</small>}</div><p>{markJargon(line.text, jargonMatches, setSelected)}</p></article>)}</div>{selected && <JargonTooltip {...selected} onClose={() => setSelected(null)} />}</section>;
}
