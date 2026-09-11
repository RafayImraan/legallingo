import { ArrowRight, Scale, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const scrollToUpload = () => document.querySelector('#upload')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="hero" aria-labelledby="page-title">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="LegalLingo home"><span className="brand-icon"><Scale size={18} /></span><span>LegalLingo</span></a>
        <nav aria-label="Primary navigation"><a href="#upload">Analyze audio</a><a href="#how-it-works">How it works</a></nav>
        <span className="secure-status"><ShieldCheck size={15} /> Private by design</span>
      </header>
      <div id="top" className="hero-content">
        <div className="hero-copy-block">
          <p className="eyebrow">Legal conversations, made clear</p>
          <h1 id="page-title">Understand the law behind the words.</h1>
          <p className="hero-copy">Upload a legal conversation and get a speaker-labelled transcript, clear explanations of legal terms, and a concise summary of what matters next.</p>
          <button className="primary-button" onClick={scrollToUpload}>Get started <ArrowRight size={17} /></button>
          <p className="trust-line"><ShieldCheck size={15} /> Sensitive information is redacted from results</p>
        </div>
        <aside className="case-preview" aria-label="Example analysis">
          <div className="preview-topline"><span>ANALYSIS PREVIEW</span><span className="live-dot">Ready</span></div>
          <div className="preview-row"><span className="row-label">Transcript</span><strong>Speaker-labelled</strong></div>
          <div className="preview-row"><span className="row-label">Jargon found</span><strong>6 terms explained</strong></div>
          <div className="preview-row"><span className="row-label">Privacy</span><strong>PII redacted</strong></div>
          <div className="preview-rule" />
          <p>Turn a complex conversation into a record you can understand and revisit.</p>
        </aside>
      </div>
      <div id="how-it-works" className="process-strip"><span className="is-active"><b>01</b> Upload audio</span><span><b>02</b> Review transcript</span><span><b>03</b> Understand next steps</span></div>
    </section>
  );
}
