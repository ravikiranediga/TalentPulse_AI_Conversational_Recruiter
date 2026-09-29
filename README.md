# TalentPulse AI — Conversational ATS & Talent Intelligence Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Powered%20by-Gemini%202.5%20Flash-8E75C2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-Backend-black?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **TalentPulse AI** is an intelligent, dual-mode Applicant Tracking System (ATS) and autonomous recruiter platform powered by Google Gemini. It transforms traditional hiring workflows by evaluating candidate resumes against complex job descriptions in real-time, delivering multi-dimensional scoring, bias-resistant recommendations, side-by-side comparisons, and seamless recruiter workflows across web and mobile.

---

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
