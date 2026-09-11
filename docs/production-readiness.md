# LegalLingo Production Readiness

## Implemented in this MVP

- API key stays on the server and is not sent to the browser.
- Users must confirm they have permission to process a recording before upload.
- The API validates audio type, size, and HTTPS sample URLs.
- The API requests AssemblyAI speaker diarization and selected PII redaction.
- Speaker roles are intentionally unassigned until a user confirms them in the UI.
- The service returns a visible non-advice disclaimer with every case action brief.
- CORS can be restricted with `FRONTEND_ORIGIN`; a small in-memory rate limit is enabled.
- LegalLingo does not write recordings or transcripts to its own database in this MVP.

## Required before public launch

- Add user authentication, organization/workspace boundaries, and role-based access control.
- Replace the in-memory rate limiter with a shared provider such as Redis and add DDoS protection at the edge.
- Use signed object-storage uploads, encryption at rest, malware scanning, strict retention periods, and reliable deletion workflows for both app and transcription-provider data.
- Confirm AssemblyAI retention and deletion behavior against the current account agreement; expose a user-visible deletion control.
- Add audit logs that do not retain sensitive transcript content.
- Obtain a legal/privacy review for the jurisdictions and professional-responsibility rules where the product will be used.
- Add observability, incident response procedures, backups, accessibility testing, dependency scanning, and penetration testing.
- Put the API behind HTTPS and configure the exact deployed frontend origin in `FRONTEND_ORIGIN`.

## Demo Guidance

Use only recordings you created or have permission to use. For a hackathon demonstration, use the built-in scenario flow or a short consented recording containing clear terms such as `affidavit`, `hearing`, `bail`, and `adjournment`. State plainly that speaker roles are confirmed by the user and that LegalLingo is an assistive explanation tool, not a substitute for legal counsel.
