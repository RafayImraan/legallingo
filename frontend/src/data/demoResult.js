export const demoResult = {
  transcript: [
    { speaker: 'A', text: 'The plaintiff filed an affidavit about the property dispute. We can request an adjournment while the court reviews the evidence.', start: 0, end: 7600, confidence: 0.98 },
    { speaker: 'B', text: 'Will I need to attend the hearing next month?', start: 7900, end: 10500, confidence: 0.97 },
    { speaker: 'A', text: 'Yes. Bring the original agreement and any messages that support your claim. The court will decide whether an injunction is necessary.', start: 10800, end: 18000, confidence: 0.96 }
  ],
  jargon_matches: [
    { term: 'affidavit', definition: 'A written statement made under oath and used as evidence.', occurrences: [23] },
    { term: 'plaintiff', definition: 'The person or organization that starts a court case.', occurrences: [4] },
    { term: 'adjournment', definition: 'A postponement of a court hearing to another time.', occurrences: [79] },
    { term: 'injunction', definition: 'A court order requiring someone to do or stop doing something.', occurrences: [284] },
    { term: 'evidence', definition: 'Information used to prove or disprove a fact.', occurrences: [119] },
    { term: 'hearing', definition: 'A court session where a judge considers an issue.', occurrences: [155] }
  ],
  summary: 'What happened: The plaintiff filed an affidavit about the property dispute. We can request an adjournment while the court reviews the evidence.\n\nWhat the client needs to do next: Review the documents mentioned, keep supporting evidence, and attend the next hearing.\n\nImportant dates: Confirm the hearing date with your legal representative.',
  case_brief: {
    key_points: ['The plaintiff filed an affidavit about the property dispute.', 'We can request an adjournment while the court reviews the evidence.', 'Will I need to attend the hearing next month?'],
    action_items: ['Bring the original agreement and any messages that support your claim.', 'Confirm the hearing date with the legal representative.'],
    dates: ['next month'],
    disclaimer: 'LegalLingo explains recorded conversation. It is not legal advice and does not replace a qualified lawyer.'
  },
  pii_redacted: true,
  detected_language: 'en',
  accuracy: { score: 0.97, review_required: false, message: 'Strong transcription confidence. Review critical legal details against the recording.' },
  demo_mode: true
};
