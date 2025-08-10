# Smart Interview App
# AIRecruiter

AIRecruiter is an AI-powered recruitment assistant platform that streamlines candidate evaluation by conducting voice-based interviews, generating structured feedback, and maintaining conversation logs. It integrates Vapi AI for real-time voice conversations, Deepgram for transcription, and OpenAI GPT for intelligent feedback generation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)
- [How It Works](#how-it-works)
- [API & SDK Integration](#api--sdk-integration)
- [Notes & Recommendations](#notes--recommendations)
- [License](#license)

## Overview

AIRecruiter automates the first stage of candidate interviews. It provides a voice-based AI interviewer that can:

- Greet candidates and explain the process.
- Ask predefined or dynamic technical/HR questions.
- Transcribe answers in real time.
- Generate AI-driven interview summaries and feedback.
- Save conversation history for future review.

The goal is to reduce human effort in screening candidates while maintaining structured, unbiased, and efficient evaluation.

## Features

- 🎙 **Real-time voice interview via Vapi AI**
- ✍ **Instant transcription with Deepgram**
- 🤖 **AI-powered question & feedback generation using GPT models**
- 📜 **Structured conversation logs for later review**
- 🌐 **Modern web UI built with Next.js + Tailwind CSS**
- 🛠 **Configurable interview topics (e.g., machine learning engineer, frontend developer, etc.)**

## Tech Stack

**Frontend**
- Next.js (React framework)
- Tailwind CSS for styling
- Shadcn/UI for UI components
- Custom React Hooks (`useVapi`) for Vapi AI SDK integration

**Backend / AI Services**
- Vapi AI Web SDK — Real-time AI voice conversation engine
- Deepgram — Real-time transcription
- OpenAI GPT — AI-generated responses & summaries

## Project Structure

```
AIRecruiter-master/
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── interview/       # Interview page & logic
│   │   └── page.tsx         # Landing page
│   ├── components/          # UI components
│   ├── hooks/
│   │   └── useVapi.ts       # Custom hook for Vapi integration
│   ├── context/
│   │   └── InterviewContext.tsx  # Context for managing interview state
│   └── styles/
├── .env.example             # Example environment file (create .env.local)
├── package.json
└── README.md
```

## Environment Variables

Create a `.env.local` in the root directory with:

```env
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

**Notes:**
- `NEXT_PUBLIC_` prefix is required for frontend access.
- Get keys from:
    - Vapi AI dashboard (API key & assistant ID)
    - Deepgram console
    - OpenAI dashboard

## Setup & Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/AIRecruiter.git
cd AIRecruiter-master
```

Install dependencies:

```bash
npm install
```

Setup environment variables:

```bash
cp .env.example .env.local
# Fill in your API keys in .env.local
```

## Running the Project

**Development mode:**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

**Build for production:**

```bash
npm run build
npm start
```

## How It Works

1. **Landing Page** — Candidate chooses an interview topic (e.g., "Machine Learning Engineer").
2. **Interview Page** —
     - Starts Vapi AI voice conversation with configured assistant.
     - Deepgram transcribes candidate’s answers in real-time.
     - OpenAI processes transcripts to generate follow-up questions and feedback.
3. **Post-interview** —
     - Conversation logs and AI feedback displayed to interviewer.
     - (Optional) Save results to a database.

## API & SDK Integration

- **Vapi AI**: Handles voice streaming between candidate and AI. Configured in `useVapi.ts` with API key & assistant ID.
- **Deepgram**: Provides speech-to-text transcription. Integrated via Vapi AI’s transcription pipeline.
- **OpenAI GPT**: Generates interview questions, summaries, and evaluations. Called from within the interview session after transcript chunks are received.

## Notes & Recommendations

- ✅ Add persistent storage (Supabase, MongoDB, etc.) to save interview history beyond current session.
- ⚠ API keys are sensitive — never commit `.env.local` to source control.
- 📈 You can add analytics for average interview length, completion rates, etc.
- 🎯 Customizable interview flows — you can add HR, coding, or behavioral question sets.

## License

This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.