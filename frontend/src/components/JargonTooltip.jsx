import { Info } from 'lucide-react';

export default function JargonTooltip({ term, definition, onClose }) {
  return <aside className="jargon-tooltip" role="dialog"><button className="close-tooltip" onClick={onClose} aria-label="Close definition">×</button><Info size={17} /><div><strong>{term}</strong><p>{definition}</p></div></aside>;
}
