import React from 'react';
import { X, Award, CheckCircle2, AlertTriangle, Layers, ChevronRight } from 'lucide-react';
import { CandidateAnalysisResult } from '../types/recruitment';
import { getScoreBadgeClass, getRecommendationMeta } from '../utils/formatters';

interface SideBySideCompareModalProps {
  candidates: CandidateAnalysisResult[];
  onClose: () => void;
  onSelectCandidate: (candidate: CandidateAnalysisResult) => void;
}

export const SideBySideCompareModal: React.FC<SideBySideCompareModalProps> = ({
  candidates,
  onClose,
  onSelectCandidate,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Side-by-Side Candidate Comparison Matrix</h2>
              <p className="text-xs text-slate-400">
                Comparing {candidates.length} candidates across calibrated ATS metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div
            className={`grid gap-4 ${
              candidates.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {candidates.map((cand) => {
              const badge = getScoreBadgeClass(cand.scores.overallScore);
              const rec = getRecommendationMeta(cand.hiringSummary.recommendationStatus);

              return (
                <div
                  key={cand.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs"
                >
                  {/* Candidate header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Rank #{cand.rank}
                      </span>
                      <span
                        className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.border}`}
                      >
                        ATS {cand.scores.overallScore}/100
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{cand.candidateName}</h3>
                    <p className="text-xs text-slate-500 mb-2 truncate">
                      {cand.profile.headline || `${cand.profile.totalYearsExperience} Yrs Experience`}
                    </p>

                    <div className="mb-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${rec.badgeClass}`}>
                        {rec.label}
                      </span>
                    </div>

                    {/* Metric Bars */}
                    <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                      {[
                        { label: 'Skills Match', val: cand.scores.skillsScore },
                        { label: 'Experience Match', val: cand.scores.experienceScore },
                        { label: 'Education Match', val: cand.scores.educationScore },
                        { label: 'Certifications', val: cand.scores.certificationScore },
                        { label: 'Project Relevance', val: cand.scores.projectRelevanceScore },
                      ].map((m) => {
                        const mBadge = getScoreBadgeClass(m.val);
                        return (
                          <div key={m.label} className="flex items-center justify-between">
                            <span className="text-slate-500">{m.label}</span>
                            <span className={`font-mono font-bold ${mBadge.text}`}>{m.val}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Key Strengths */}
                    <div className="mt-3 space-y-1">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Strengths
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {cand.explainability.strengths.slice(0, 3).map((s, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500">•</span>
                            <span className="truncate">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missing Skills */}
                    <div className="mt-3 space-y-1">
                      <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Missing Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {cand.skillGaps.missingSkills.length > 0 ? (
                          cand.skillGaps.missingSkills.slice(0, 4).map((s, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 text-[10px] bg-rose-50 text-rose-700 rounded border border-rose-200"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-600 font-medium">None missing!</span>
                        )}
                      </div>
                    </div>

                    {/* Recruiter Summary Snippet */}
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
                      &ldquo;{cand.hiringSummary.conciseSummary}&rdquo;
                    </div>
                  </div>

                  {/* Button to open candidate full dossier */}
                  <button
                    onClick={() => {
                      onClose();
                      onSelectCandidate(cand);
                    }}
                    className="w-full mt-3 py-2 text-xs font-bold text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-300 rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>View Full Dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Selected {candidates.length} candidate profiles for matrix evaluation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
