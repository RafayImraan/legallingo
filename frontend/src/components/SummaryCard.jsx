import { CheckCircle2, ClipboardList, CalendarDays } from 'lucide-react';

const labels = [{ title: 'What happened', icon: ClipboardList }, { title: 'What to do next', icon: CheckCircle2 }, { title: 'Important dates', icon: CalendarDays }];
export default function SummaryCard({ summary }) {
  const chunks = summary.split(/\n\s*\n/).filter(Boolean);
  return <section className="summary-card" aria-labelledby="summary-title"><p className="eyebrow">Plain-language summary</p><h2 id="summary-title">Your legal conversation, translated.</h2><div className="summary-grid">{labels.map((label, index) => { const Icon = label.icon; const content = chunks[index]?.replace(/^[^:]+:\s*/, '') || 'No details were found.'; return <article key={label.title}><Icon size={19} /><h3>{label.title}</h3><p>{content}</p></article>; })}</div></section>;
}
