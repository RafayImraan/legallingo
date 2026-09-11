import { AlertCircle, BadgeCheck } from 'lucide-react';

export default function AccuracyIndicator({ accuracy, language }) {
  const score = accuracy?.score ? `${Math.round(accuracy.score * 100)}%` : 'Review needed';
  const Icon = accuracy?.review_required ? AlertCircle : BadgeCheck;
  return <div className={`accuracy-indicator ${accuracy?.review_required ? 'needs-review' : ''}`} title={accuracy?.message}><Icon size={15} /><span>{score} transcript confidence</span>{language && language !== 'unknown' && <small>{language.toUpperCase()}</small>}</div>;
}
