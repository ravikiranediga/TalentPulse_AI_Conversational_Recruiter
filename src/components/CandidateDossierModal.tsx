import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderGit2, 
  BadgeCheck, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles,
  TrendingUp,
  FileText
} from 'lucide-react';
import { CandidateAnalysisResult } from '../types/recruitment';
import { getScoreBadgeClass, getRecommendationMeta } from '../utils/formatters';

interface CandidateDossierModalProps {
  candidate: CandidateAnalysisResult;
  onClose: () => void;
  jobTitle?: string;
}

export const CandidateDossierModal: React.FC<CandidateDossierModalProps> = ({
  candidate,
  onClose,
  jobTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills-gap' | 'parsed-profile' | 'interview-questions'>('overview');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);

  const overallBadge = getScoreBadgeClass(candidate.scores.overallScore);
  const recMeta = getRecommendationMeta(candidate.hiringSummary.recommendationStatus);

  const handleCopySummary = () => {
    const text = `Candidate: ${candidate.candidateName}
ATS Score: ${candidate.scores.overallScore}/100
Recommendation: ${candidate.hiringSummary.recommendationStatus}

Recruiter Summary:
${candidate.hiringSummary.conciseSummary}

Why Score Assigned:
${candidate.explainability.whyScoreAssigned}

Actionable Next Step:
${candidate.hiringSummary.actionableNextStep}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyQuestions = () => {
    const text = candidate.interviewQuestions
      .map(
        (q, idx) =>
          `Q${idx + 1} (${q.focusArea}): ${q.question}\nTarget Insight: ${q.targetInsight}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Score Ring Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-white shadow-lg shrink-0 border-2"
              style={{ backgroundColor: overallBadge.fillColor, borderColor: '#ffffff40' }}
            >
              <span className="text-xl font-mono leading-none">{candidate.scores.overallScore}</span>
              <span className="text-[10px] uppercase font-semibold opacity-90">ATS Score</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Rank #{candidate.rank}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${recMeta.badgeClass}`}
                >
                  {recMeta.label}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mt-1">
                {candidate.candidateName}
              </h2>
              <p className="text-xs text-slate-300">
                {candidate.profile.headline || `${candidate.profile.totalYearsExperience} Years Experience`}
                {jobTitle ? ` • Evaluating for ${jobTitle}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition-colors"
              title="Copy formatted summary to clipboard"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-slate-50 flex items-center gap-4 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ATS Breakdown &amp; Explainability
          </button>
          <button
            onClick={() => setActiveTab('skills-gap')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'skills-gap'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Skill Gap &amp; Cert Recommendations
          </button>
          <button
            onClick={() => setActiveTab('parsed-profile')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'parsed-profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Parsed Resume Dossier
          </button>
          <button
            onClick={() => setActiveTab('interview-questions')}
            className={`py-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'interview-questions'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Tailored Interview Questions ({candidate.interviewQuestions.length})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & EXPLAINABILITY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Hiring Summary Statement Banner */}
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                  Recruiter Hiring Summary
                </span>
                <p className="text-sm font-medium text-indigo-950 leading-relaxed">
                  &ldquo;{candidate.hiringSummary.conciseSummary}&rdquo;
                </p>
                <div className="mt-2.5 pt-2.5 border-t border-indigo-200/60 flex items-center justify-between text-xs text-indigo-900">
                  <span className="font-semibold">Recommended Next Action:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {candidate.hiringSummary.actionableNextStep}
                  </span>
                </div>
              </div>

              {/* 5 Core Sub-Score Meters */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  ATS Score Matrix
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Skills Match', score: candidate.scores.skillsScore },
                    { label: 'Experience Match', score: candidate.scores.experienceScore },
                    { label: 'Education Match', score: candidate.scores.educationScore },
                    { label: 'Certifications', score: candidate.scores.certificationScore },
                    { label: 'Project Relevance', score: candidate.scores.projectRelevanceScore },
                  ].map((metric) => {
                    const badge = getScoreBadgeClass(metric.score);
                    return (
                      <div
                        key={metric.label}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                      >
                        <span className="text-xs text-slate-500 font-medium">{metric.label}</span>
                        <div className="mt-2 flex items-baseline justify-between">
                          <span className={`text-xl font-bold font-mono ${badge.text}`}>
                            {metric.score}
                          </span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${metric.score}%`,
                              backgroundColor: badge.fillColor,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explainability Section: Why Score Was Assigned */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Why This ATS Score Was Assigned
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {candidate.explainability.whyScoreAssigned}
                </p>
              </div>

              {/* Strengths & Weaknesses 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Strengths ({candidate.explainability.strengths.length})
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {candidate.explainability.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses / Gaps */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Weaknesses &amp; Gaps ({candidate.explainability.weaknesses.length})
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {candidate.explainability.weaknesses.map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing ATS Keywords */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/20 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  Missing ATS Keywords in Resume
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.explainability.missingKeywords.length > 0 ? (
                    candidate.explainability.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-100 text-rose-800 border border-rose-200"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium">
                      No critical keywords missing!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILL GAP & CERTIFICATION RECOMMENDATIONS */}
          {activeTab === 'skills-gap' && (
            <div className="space-y-6">
              {/* Skill Gap Analysis Box */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Skill &amp; Technology Gap Analysis
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Missing Skills */}
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      Missing Functional Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skillGaps.missingSkills.length > 0 ? (
                        candidate.skillGaps.missingSkills.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600">None missing!</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Technologies */}
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      Missing Technologies / Stacks
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skillGaps.missingTechnologies.length > 0 ? (
                        candidate.skillGaps.missingTechnologies.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded"
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600">All key stacks matched!</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Certifications */}
                  <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      Missing Target Certifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skillGaps.missingCertifications.length > 0 ? (
                        candidate.skillGaps.missingCertifications.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs bg-slate-100 text-slate-700 border border-slate-200 rounded"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600">All target certs held!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Matched Skills */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Matched Skills from Job Description:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skillGaps.matchedSkills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center gap-1 font-medium"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 Recommended Certifications (Feature 5) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-indigo-600" />
                    Recommended Certifications to Bridge Gaps (3 Recommended)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Curated to elevate ATS score for this role
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {candidate.recommendedCertifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-indigo-600 font-semibold mb-1">
                          <span>Recommendation #{idx + 1}</span>
                          {cert.provider && <span>{cert.provider}</span>}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{cert.name}</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          <strong className="text-slate-800">Why recommended: </strong>
                          {cert.reason}
                        </p>
                      </div>

                      <div className="p-2 rounded bg-white border border-indigo-100 text-[11px] text-indigo-900">
                        <strong className="block font-semibold">Expected Impact:</strong>
                        <span>{cert.expectedImpact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARSED RESUME PROFILE (Feature 1) */}
          {activeTab === 'parsed-profile' && (
            <div className="space-y-6">
              {/* Contact & Summary */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{candidate.profile.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Total Experience: {candidate.profile.totalYearsExperience} Years
                  </span>
                </div>
                {candidate.profile.summary && (
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    &ldquo;{candidate.profile.summary}&rdquo;
                  </p>
                )}
              </div>

              {/* Skills Categorization */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-600" />
                  Extracted Skills Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Core Technical
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.profile.skills.coreTechnical.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-800 rounded font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Tools &amp; Frameworks
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.profile.skills.toolsAndFrameworks.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-800 rounded font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Soft &amp; Leadership Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.profile.skills.softSkills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs bg-slate-100 text-slate-800 rounded font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Work Experience History
                </h4>
                <div className="space-y-3">
                  {candidate.profile.experience.map((exp, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900">{exp.role}</h5>
                        {exp.duration && (
                          <span className="text-xs text-slate-500 font-mono">{exp.duration}</span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-600 font-medium mb-2">{exp.company}</p>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certifications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Education
                  </h4>
                  {candidate.profile.education.map((edu, idx) => (
                    <div key={idx} className="text-xs border-b border-slate-100 pb-2 last:border-0">
                      <p className="font-bold text-slate-800">{edu.degree}</p>
                      <p className="text-slate-500">
                        {edu.institution} {edu.year ? `(${edu.year})` : ''}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Certifications Found */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-indigo-600" />
                    Verified Certifications in Resume
                  </h4>
                  {candidate.profile.certifications.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {candidate.profile.certifications.map((cert, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{cert}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">No industry certifications found in resume text.</p>
                  )}
                </div>
              </div>

              {/* Key Projects */}
              {candidate.profile.projects.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                    Key Projects
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {candidate.profile.projects.map((proj, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white">
                        <h5 className="text-xs font-bold text-slate-900">{proj.name}</h5>
                        <p className="text-xs text-slate-600 my-1">{proj.description}</p>
                        {proj.techStack && proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {proj.techStack.map((tech, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 text-[10px] font-mono bg-indigo-50 text-indigo-700 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TAILORED INTERVIEW QUESTIONS */}
          {activeTab === 'interview-questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    AI-Generated Interview Questions for {candidate.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Specifically generated to address this candidate&apos;s weak points, verify claims, and probe missing keywords.
                  </p>
                </div>
                <button
                  onClick={handleCopyQuestions}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  {copiedQuestions ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedQuestions ? 'Questions Copied' : 'Copy All'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {candidate.interviewQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Focus: {q.focusArea}
                      </span>
                      <span className="font-mono text-slate-400">Question #{idx + 1}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">&ldquo;{q.question}&rdquo;</p>
                    <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-start gap-1.5">
                      <strong className="text-slate-700 shrink-0">Target Insight:</strong>
                      <span>{q.targetInsight}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            ATS Screening Result • Evaluated against &ldquo;{jobTitle || 'Active Job'}&rdquo;
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
