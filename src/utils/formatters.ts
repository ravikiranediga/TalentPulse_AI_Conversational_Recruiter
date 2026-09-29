import { CandidateAnalysisResult } from '../types/recruitment';

/**
 * Returns Tailwind color classes based on score (0-100)
 */
export function getScoreBadgeClass(score: number): {
  bg: string;
  text: string;
  border: string;
  ring: string;
  fillColor: string;
} {
  if (score >= 85) {
    return {
      bg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700 font-semibold',
      border: 'border-emerald-200',
      ring: 'ring-emerald-500/20',
      fillColor: '#10b981',
    };
  }
  if (score >= 70) {
    return {
      bg: 'bg-blue-50 text-blue-700',
      text: 'text-blue-700 font-semibold',
      border: 'border-blue-200',
      ring: 'ring-blue-500/20',
      fillColor: '#3b82f6',
    };
  }
  if (score >= 55) {
    return {
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700 font-semibold',
      border: 'border-amber-200',
      ring: 'ring-amber-500/20',
      fillColor: '#f59e0b',
    };
  }
  return {
    bg: 'bg-rose-50 text-rose-700',
    text: 'text-rose-700 font-semibold',
    border: 'border-rose-200',
    ring: 'ring-rose-500/20',
    fillColor: '#ef4444',
  };
}

/**
 * Returns human-readable label and color for recommendation status
 */
export function getRecommendationMeta(status: string): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'STRONG_HIRE':
      return {
        label: 'Strong Hire - Priority Interview',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      };
    case 'INTERVIEW':
      return {
        label: 'Advance to Interview',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      };
    case 'CONSIDER_BACKUP':
      return {
        label: 'Secondary / Hold',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    case 'NOT_RECOMMENDED':
    default:
      return {
        label: 'Not Recommended',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      };
  }
}

/**
 * Export Candidate Comparison table as CSV
 */
export function exportCandidatesToCSV(
  candidates: CandidateAnalysisResult[],
  jobTitle: string
): void {
  const headers = [
    'Rank',
    'Candidate Name',
    'Overall ATS Score',
    'Skills Score',
    'Experience Score',
    'Education Score',
    'Certification Score',
    'Project Score',
    'Total Experience (Yrs)',
    'Recommendation',
    'Recruiter Summary',
  ];

  const rows = candidates.map((c) => [
    c.rank,
    `"${c.candidateName.replace(/"/g, '""')}"`,
    c.scores.overallScore,
    c.scores.skillsScore,
    c.scores.experienceScore,
    c.scores.educationScore,
    c.scores.certificationScore,
    c.scores.projectRelevanceScore,
    c.profile.totalYearsExperience || 'N/A',
    `"${c.hiringSummary.recommendationStatus}"`,
    `"${c.hiringSummary.conciseSummary.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ATS_Ranking_${jobTitle.replace(/\s+/g, '_')}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
