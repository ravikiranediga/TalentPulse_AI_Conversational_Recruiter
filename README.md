# TalentPulse AI — Conversational ATS & Talent Intelligence Platform 

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-8E75C2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-Backend-black?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **TalentPulse AI** is an intelligent, dual-mode Applicant Tracking System (ATS) and autonomous recruiter platform powered by Google Gemini. It transforms traditional hiring workflows by evaluating candidate resumes against complex job descriptions in real-time, delivering multi-dimensional scoring, bias-resistant recommendations, side-by-side comparisons, and seamless recruiter workflows across web and mobile.

---

Development App:
👉 https://ais-dev-u6lya7rno7gf4nwbrf5nl3-802123425987.asia-southeast1.run.app

## 📸 Application Screenshots & UI Showcase

### 1. 🤖 Conversational AI Recruiter Assistant
> Interactive natural-language interface allowing hiring managers to query candidate pools, compare skills, and receive instantaneous candidate evaluations.

![Conversational AI Recruiter](docs/screenshots/conversational-recruiter.jpg)

### 2. 📊 Executive ATS Recruitment Dashboard
> Data-dense recruitment cockpit featuring ranked candidate leaderboards, multi-dimensional score distributions, and top candidate spotlights.

![ATS Dashboard Preview](docs/screenshots/dashboard-preview.jpg)

### 3. ⚖️ Head-to-Head Candidate Comparison
> Side-by-side comparative dossier evaluating key strengths, skill gaps, verified technical experience, and suggested interview questions.

![Candidate Comparison Dossier](docs/screenshots/candidate-comparison.jpg)

---

## 🌟 Key Highlights & Capabilities

### 1. 🤖 Dual Recruiter Experience
* **Conversational AI Recruiter Assistant**: Interactive natural-language interface allowing hiring managers to query candidate pools, ask specific behavioral/technical questions (*"Which candidate has the strongest Kubernetes background?"*), and trigger automated evaluations.
* **Executive ATS Dashboard**: Data-dense recruitment cockpit featuring real-time candidate leaderboards, match score distributions, and hiring progress trackers.

### 2. 📄 Native Multi-Format Resume Ingestion
* Built-in server-side parsing engine supporting **PDF** (`pdf-parse`) and **Microsoft Word DOCX** (`mammoth`).
* Zero external document converter dependencies — resumes are stripped, tokenized, and structured directly in-memory.

### 3. 🧠 Multidimensional Gemini ATS Evaluation Engine
Every candidate is evaluated across weighted dimensions:
* **Technical Competency & Skill Alignment** (30%)
* **Domain & Role Experience** (25%)
* **Seniority & Leadership Scope** (20%)
* **Education & Certifications** (15%)
* **Communication & Presentation Quality** (10%)
* **Output**: Overall Match %, Key Strengths, Skill Gaps, Red Flags, Tailored Interview Questions, and Hire/Pass Recommendations.

### 4. 📱 Mobile Recruiter Telegram Bot Integration
* Recruiters can forward resumes directly to a Telegram Bot on mobile devices.
* The bot parses the resume, evaluates it against the active job description using Gemini, and replies with instant scorecards and candidate summaries.

### 5. 📊 Deep Candidate Dossiers & Side-by-Side Comparison
* **Interactive Candidate Dossiers**: Inspect comprehensive candidate profiles, strengths, gap analyses, and suggested interview questions.
* **Side-by-Side Head-to-Head Comparison**: Compare top candidates across metrics with visual badges and comparative highlights.

### 6. 📤 Recruiter Collaboration & Exports
* **Exportable Reports**: Generate detailed audit-ready reports in JSON or printable dossier formats.
* **Slack Integration**: Send candidate summaries and scorecards directly to your team's Slack hiring channels with one click.

---

## 🏗️ Architecture & Workflow

```text
               +----------------------------------------------------+
               |              TalentPulse Frontend (Vite)           |
               |  (React 19 + TypeScript + Tailwind CSS v4 + Lucide)|
               +----------------------------------------------------+
                       |                                    |
           [Web Recruiter Chat / UI]             [ATS Dashboard & Dossier]
                       |                                    |
                       v                                    v
     +-----------------------------------------------------------------+
     |                     Express API Server (server.ts)              |
     +-----------------------------------------------------------------+
           |                       |                       |
           v                       v                       v
  [Document Parsers]       [Gemini 2.5 Flash SDK]    [Telegram Bot Service]
   - pdf-parse (PDF)        - ATS Evaluation Engine   - Mobile Resume Upload
   - mammoth (DOCX)         - Candidate Q&A Chat      - Instant Scorecards
```

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion (Framer Motion) |
| **Backend** | Node.js, Express, TypeScript (`tsx`) |
| **AI Engine** | Google Gen AI SDK (`@google/genai`) — Gemini 2.5 Flash |
| **Document Processing** | `pdf-parse`, `mammoth` |
| **Integrations** | Telegram Bot API, Slack Webhook API |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **bun**
* **Google Gemini API Key**: [Get your key at Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ravikiranediga/TalentPulse_AI_Conversational_Recruiter.git
   cd TalentPulse_AI_Conversational_Recruiter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   # Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Application Port
   PORT=3000

   # Optional: Telegram Bot Token (for mobile recruiter features)
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   ```



## 📱 Telegram Mobile Recruiter Setup (Optional)

1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow instructions to get your bot token (e.g., `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).
3. In the TalentPulse web app, click **Mobile Bot (Telegram)** in the header.
4. Paste your token and click **Start Bot Polling**.
5. Forward candidate PDF/DOCX resumes to your Telegram bot for instant mobile ATS screening!

---

## 📁 Repository Structure

```text
TalentPulse_AI_Conversational_Recruiter/
├── server.ts                    # Express server, document parsing, Gemini ATS logic & Telegram bot
├── index.html                   # HTML entry point with meta tags
├── package.json                 # Project dependencies and run scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
└── src/
    ├── main.tsx                 # React application mounting point
    ├── App.tsx                  # Core state orchestrator and recruiter workflow
    ├── index.css                # Global styles and Tailwind imports
    ├── components/
    │   ├── Header.tsx                   # Top navigation bar, mode switcher & quick actions
    │   ├── ChatbotRecruiterView.tsx     # Conversational AI recruiter chat interface
    │   ├── JobDescriptionSection.tsx    # Role editor with preset industry templates
    │   ├── ResumeUploadSection.tsx      # Multi-file drag-and-drop resume uploader
    │   ├── LeaderboardTable.tsx         # Ranked candidate scoreboard & metrics
    │   ├── BestCandidateSpotlight.tsx   # Top recommendation showcase
    │   ├── CandidateDossierModal.tsx    # In-depth candidate evaluation modal
    │   ├── SideBySideCompareModal.tsx   # Head-to-head candidate comparison
    │   ├── ReportExportModal.tsx        # PDF & JSON report exporter
    │   ├── SlackShareModal.tsx          # Team Slack notification bridge
    │   ├── GitHubExportModal.tsx        # Cloud-to-GitHub synchronization modal
    │   └── WorkflowStepper.tsx          # 4-stage recruitment pipeline progress
    ├── data/
    │   └── sampleJobProfiles.ts         # Preloaded engineering, product, and AI roles
    ├── types/
    │   └── recruitment.ts               # TypeScript interfaces & recruitment domain models
    └── utils/
        └── formatters.ts                # Score calculation and badge styling utilities
```

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/ravikiranediga/TalentPulse_AI_Conversational_Recruiter/issues).
