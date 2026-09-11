# LegalLingo

Understand your legal case in plain language, powered by voice AI.

## Problem

Legal conversations often contain specialist terminology that prevents people from understanding their own case. LegalLingo gives clients a readable, privacy-aware way to revisit a lawyer consultation or hearing and identify what needs attention.

## How it works

1. Upload a recording or use a demo scenario.
2. AssemblyAI transcribes the audio with speaker diarization.
3. AssemblyAI redacts selected PII, then LegalLingo highlights legal jargon in the transcript.
4. AssemblyAI LeMUR produces a plain-language summary. When LeMUR is unavailable, the server provides a non-empty extractive fallback.

## Stack

- React + Vite with plain CSS and Lucide icons
- Node.js + Express
- AssemblyAI: audio upload, speaker diarization, PII redaction, and LeMUR summarization
- In-memory request flow with no database or authentication

## Setup

1. Copy `.env.example` to `backend/.env` and add your `ASSEMBLYAI_API_KEY`.
2. Run `npm install` in `backend`, then `npm start`.
3. In a separate terminal, run `npm install` in `frontend`, then `npm run dev`.
4. Open the Vite URL shown in the terminal. The frontend defaults to `http://localhost:5000`; set `VITE_API_BASE_URL` if your API uses another address.

Without an API key, the API intentionally returns a polished demo transcript so the full UI can be reviewed. Add a key for real AssemblyAI transcription and PII redaction.

### Vercel Blob uploads

The deployed app uploads audio directly from the browser to a Vercel Blob store, then sends AssemblyAI the resulting URL. This bypasses Vercel Functions' 4.5 MB request limit and supports files up to 50 MB. In the **backend Vercel project**, open **Storage**, create a **Blob** store, and connect it to Production. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.

The hackathon flow uses a public, random Blob URL so AssemblyAI can retrieve the recording. Delete Blob objects after demonstration; production legal recordings require authenticated private storage, a signed retrieval workflow, and retention controls.

## Sample audio

Real audio cannot be generated as part of this project. Add your own permitted `.mp3`, `.wav`, or `.m4a` recordings under `backend/sample-audio/`. The preset scenario URLs in `frontend/src/components/UploadPanel.jsx` are placeholders; point them to publicly reachable audio files before a live demo.

## Future work

- Live call integration
- Multilingual support beyond the English demonstration
- Native mobile application

## Hackathon and Production Readiness

This repository is a hackathon MVP with practical safeguards: explicit recording permission, file-type and size validation, configurable CORS, a basic API rate limit, PII-redaction requests, and editable speaker roles. It does **not** claim to be production-ready for confidential client recordings yet.

Before a public launch, follow the checklist in `docs/production-readiness.md`: use an authentication provider, persistent rate limits, secure object storage with retention/deletion controls, audit logging, legal privacy review, monitoring, and a security assessment. Never present automated summaries as legal advice.
