import { ResumeInput } from '../types/recruitment';

export interface SampleProfile {
  id: string;
  roleTitle: string;
  department: string;
  experienceLevel: string;
  jobDescription: string;
  sampleResumes: ResumeInput[];
}

export const SAMPLE_JOB_PROFILES: SampleProfile[] = [
  {
    id: 'fullstack-ai-engineer',
    roleTitle: 'Senior Full-Stack AI Engineer',
    department: 'Core AI Product',
    experienceLevel: '5+ Years Experience',
    jobDescription: `Job Title: Senior Full-Stack AI Engineer
Department: AI Engineering & Products
Location: Hybrid / Remote

About The Role:
We are seeking an experienced Senior Full-Stack AI Engineer to build intelligent next-generation applications powered by Large Language Models (LLMs) and modern web technologies. You will architect resilient backend APIs, build high-performance React frontends, and integrate generative AI pipelines.

Key Responsibilities:
- Architect and maintain enterprise-grade web applications using TypeScript, React, and Node.js / Python (FastAPI).
- Integrate LLM APIs (Gemini, OpenAI, Claude) for real-time streaming, function calling, agents, and RAG pipelines.
- Design relational database schemas using PostgreSQL / pgvector and optimize queries.
- Build and maintain CI/CD pipelines, containerize services with Docker, and deploy to AWS / GCP.
- Collaborate with product managers, UX designers, and ML researchers to deliver intuitive user interfaces.
- Enforce clean architecture, automated testing (Jest, Cypress), and high security standards.

Requirements:
- 5+ years of software engineering experience in full-stack development.
- Strong proficiency in modern JavaScript/TypeScript, React 18+, Tailwind CSS, and state management.
- Demonstrated hands-on experience building backend microservices with Python (FastAPI/Flask) or Node.js.
- Practical experience with LLM orchestration (LangChain, LlamaIndex, or native SDKs), vector databases (Pinecone, pgvector), and prompt engineering.
- Deep knowledge of PostgreSQL, relational data modeling, and caching with Redis.
- Familiarity with cloud platforms (AWS/GCP), Docker containerization, and Kubernetes.
- Bachelor's or Master's degree in Computer Science, Software Engineering, or equivalent practical experience.
- Relevant cloud or AI certifications (e.g. AWS Certified Solutions Architect, Google Cloud Professional Cloud Architect) are a strong plus.`,
    sampleResumes: [],
  },
  {
    id: 'ai-product-manager',
    roleTitle: 'Senior Technical Product Manager - AI Platform',
    department: 'Product Management',
    experienceLevel: '6+ Years Experience',
    jobDescription: `Job Title: Senior Technical Product Manager - AI Platform
Department: Platform & Core AI
Location: San Francisco, CA / Remote

Role Overview:
We are seeking an exceptional Senior Technical Product Manager to lead the roadmap and execution of our Enterprise Generative AI platform. You will bridge customer needs, engineering feasibility, and strategic AI capabilities to ship high-impact developer tooling, LLM APIs, and AI agent frameworks.

Responsibilities:
- Own the end-to-end product vision, roadmap, and quarterly OKRs for the AI Developer Platform.
- Translate complex technical AI capabilities (fine-tuning, prompt orchestration, vector retrieval, evaluation metrics) into intuitive APIs and developer interfaces.
- Work closely with machine learning engineers, frontend developers, and enterprise customers to define PRDs and sprint backlogs.
- Establish AI safety, guardrails, latency, cost-efficiency, and model evaluation benchmarks.
- Drive user discovery interviews, competitive market research, and developer adoption analytics.

Requirements:
- 5+ years of product management experience with at least 2+ years leading AI/ML or developer platform products.
- Strong technical background: Computer Science, Engineering degree, or equivalent hands-on technical understanding of APIs, data architectures, and LLM lifecycles.
- Proven experience with developer-focused products (APIs, SDKs, developer consoles, SaaS platforms).
- Excellent communication and cross-functional leadership skills.
- Certified Scrum Product Owner (CSPO) or Pragmatic Institute certifications are valued.`,
    sampleResumes: [
      {
        id: 'sample-resume-pm-1',
        fileName: 'Elena_Rostova_Lead_AI_PM.pdf',
        candidateName: 'Elena Rostova',
        fileType: 'pdf',
        rawText: `ELENA ROSTOVA
San Francisco, CA | (415) 302-8819 | elena.rostova.pm@email.com | linkedin.com/in/elenarostova

PROFESSIONAL SUMMARY
Lead Technical Product Manager with 6.5 years of experience leading AI and developer platform products. Spearheaded enterprise LLM API gateway and developer tooling from 0 to $18M ARR. Deep technical background in Computer Science with expertise in prompt engineering, model evaluation, and developer experience.

CORE SKILLS
- Product Strategy: Product Roadmapping, PRDs, OKRs, User Research, Competitive Analysis, Pricing & Packaging
- AI / ML Platform: LLM APIs, Vector Databases, Evaluation Benchmarks, Safety Guardrails, RAG Architecture
- Technical: REST/GraphQL APIs, SDK Design, Python, SQL, Postman, Git, Cloud Run, AWS
- Agile & Tools: Jira, Linear, Mixpanel, Amplitude, Figma, Certified Scrum Product Owner (CSPO)

EXPERIENCE
Lead Product Manager - AI Developer Platform | Cognita AI, San Francisco, CA | 2022 - Present
- Led product strategy for enterprise LLM Gateway serving 1,400+ developers, growing ARR from $3M to $18M in 20 months.
- Launched automated model benchmarking and prompt playground, increasing developer weekly retention by 38%.
- Partnered with 14 ML engineers to ship streaming responses, semantic caching, and customizable PII guardrails.
- Conducted 60+ customer interviews with Fortune 500 engineering directors to define roadmap priorities.

Technical Product Manager | APIPlatform Systems, Palo Alto, CA | 2018 - 2022
- Managed developer portal and API monitoring SDKs for enterprise cloud infrastructure.
- Defined and tracked core developer KPIs: time-to-first-call decreased from 45 min to under 6 min.
- Led cross-functional team of 10 engineers and 2 UX designers using two-week sprint cadences.

EDUCATION
- B.S. in Computer Science & Human-Computer Interaction | Carnegie Mellon University | 2014 - 2018

CERTIFICATIONS
- Certified Scrum Product Owner (CSPO, Scrum Alliance, 2021)
- Pragmatic Institute Certified (PMC-III, 2022)`,
      },
      {
        id: 'sample-resume-pm-2',
        fileName: 'Marcus_Wright_Senior_SaaS_PM.pdf',
        candidateName: 'Marcus Wright',
        fileType: 'pdf',
        rawText: `MARCUS WRIGHT
Seattle, WA | (206) 455-8912 | m.wright@email.com | linkedin.com/in/marcuswright-pm

PROFESSIONAL SUMMARY
Senior Product Manager with 5+ years of experience leading SaaS B2B web applications and customer-facing workflows. Skilled in agile execution, stakeholder alignment, user experience optimization, and data-driven product iteration.

SKILLS
- Product Management: Agile/Scrum, User Stories, Roadmaps, A/B Testing, Go-To-Market, Customer Retention
- Tools: Jira, Confluence, Figma, Google Analytics, Segment, SQL basics
- Domain: B2B SaaS, CRM Workflows, E-commerce Checkout, User Onboarding

EXPERIENCE
Senior Product Manager | WorkflowPro SaaS, Seattle, WA | 2021 - Present
- Led redesign of customer onboarding funnels, lifting free-to-paid conversion by 22%.
- Managed backlog for 8 engineers and 1 product designer across bi-weekly sprints.
- Collaborated with enterprise sales to deliver custom integration hooks for Salesforce and HubSpot.

Product Manager | RetailPulse Technologies, Portland, OR | 2018 - 2021
- Shipped analytics dashboard for retail store managers tracking inventory and staffing levels.
- Ran user research sessions with 40+ store managers to validate UI prototypes.

EDUCATION
- Bachelor of Arts in Business Administration | University of Washington | 2014 - 2018

CERTIFICATIONS
- Certified Scrum Master (CSM, 2019)`,
      },
    ],
  },
];
