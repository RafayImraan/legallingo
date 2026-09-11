import { AlertTriangle, CalendarDays, CheckSquare, ListChecks } from 'lucide-react';

export default function CaseBrief({ brief }) {
  if (!brief) return null;
  const sections = [
    { title: 'Key points', icon: ListChecks, items: brief.key_points },
    { title: 'Suggested follow-up', icon: CheckSquare, items: brief.action_items },
    { title: 'Dates mentioned', icon: CalendarDays, items: brief.dates?.length ? brief.dates : ['No specific dates were detected.'] }
  ];
  return <section className="case-brief" aria-labelledby="brief-title"><p className="eyebrow">Case action brief</p><h2 id="brief-title">What to keep in view</h2>{sections.map(({ title, icon: Icon, items }) => <div className="brief-section" key={title}><Icon size={17} /><div><h3>{title}</h3><ul>{items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}</ul></div></div>)}<p className="legal-notice"><AlertTriangle size={15} /> {brief.disclaimer}</p></section>;
}
