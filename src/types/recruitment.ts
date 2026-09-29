export interface CandidateParsedProfile {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  skills: {
    coreTechnical: string[];
    toolsAndFrameworks: string[];
    softSkills: string[];
  };
  education: Array<{
    degree: string;
    institution: string;
    year?: string;
    fieldOfStudy?: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    duration?: string;
    highlights: string[];
  }>;
  totalYearsExperience: number;
  certifications: string[];
  projects: Array<{
    name: string;
    techStack: string[];
    description: string;
  }>;
}

export interface ATSScores {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  certificationScore: number;
  projectRelevanceScore: number;
}

export interface ScoreExplainability {
  whyScoreAssigned: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  missingKeywords: string[];
}

export interface SkillGapAnalysis {
  missingSkills: string[];
  missingTechnologies: string[];
  missingCertifications: string[];
  matchedSkills: string[];
}

export interface CertificationRecommendation {
  name: string;
  provider?: string;
  reason: string;
  expectedImpact: string;
}

export interface InterviewQuestion {
  question: string;
  focusArea: string;
  targetInsight: string;
}

export interface CandidateAnalysisResult {
  id: string;
  rank: number;
  candidateName: string;
  scores: ATSScores;
  profile: CandidateParsedProfile;
  explainability: ScoreExplainability;
  skillGaps: SkillGapAnalysis;
  recommendedCertifications: CertificationRecommendation[]; // Exactly 3
  hiringSummary: {
    conciseSummary: string; // e.g. "Candidate A demonstrates strong alignment..."
    recommendationStatus: 'STRONG_HIRE' | 'INTERVIEW' | 'CONSIDER_BACKUP' | 'NOT_RECOMMENDED';
    justification: string;
    actionableNextStep: string;
  };
  interviewQuestions: InterviewQuestion[];
}

export interface CohortRankingSummary {
  bestCandidate: {
    candidateId: string;
    candidateName: string;
    score: number;
    justification: string;
    keyEdge: string;
  };
  secondBestCandidate?: {
    candidateId: string;
    candidateName: string;
    score: number;
    justification: string;
    keyEdge: string;
  };
  thirdBestCandidate?: {
    candidateId: string;
    candidateName: string;
    score: number;
    justification: string;
    keyEdge: string;
  };
  cohortOverview: string;
  comparisonHighlights: string[];
}

export interface BatchAnalysisResponse {
  jobTitle: string;
  candidates: CandidateAnalysisResult[];
  rankingSummary: CohortRankingSummary;
  analyzedAt: string;
}

export interface ResumeInput {
  id: string;
  fileName: string;
  candidateName?: string;
  fileType: 'pdf' | 'docx' | 'txt';
  rawText: string;
  fileSize?: number;
  base64Data?: string;
}

export interface JobDescriptionInput {
  title: string;
  department?: string;
  rawText: string;
}
