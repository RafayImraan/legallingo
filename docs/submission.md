# LegalLingo - Hackathon Submission

## Inspiration

Legal support is only useful when people can understand the language used around their own case. We wanted to make the lawyer-client conversation less intimidating without replacing professional advice.

## What it does

LegalLingo accepts a legal conversation, creates a speaker-labelled transcript, redacts selected sensitive information, highlights legal terms, and produces a concise next-step summary in plain language.

## How we built it

The interface uses React and Vite. An Express API receives audio files or hosted URLs, sends them to AssemblyAI for speaker diarization and PII redaction, detects legal terminology against a curated 50+ term dataset, and uses AssemblyAI LeMUR for summarization with an extractive fallback. No transcript database or authentication is required for the MVP.

## Challenges

We needed to make a multi-step AI pipeline feel understandable while keeping privacy visible. We also designed a graceful fallback so the demo is never blank if LeMUR access is unavailable.

## Accomplishments

We built a cohesive flow from upload through redacted transcript, interactive jargon definitions, and an action-oriented summary. The demo mode makes the experience reviewable without requiring live credentials.

## What we learned

The same transcript can serve very different audiences depending on presentation. Speaker context, definitions at the point of reading, and a structured summary make a significant difference to clarity.

## What's next

We plan to add live-call integration, broaden multilingual support, and build a mobile companion app. We would also add retention controls, user accounts, and legal-aid organization workflows before production use.
