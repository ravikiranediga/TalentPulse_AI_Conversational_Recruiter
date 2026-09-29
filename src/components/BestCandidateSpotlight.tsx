import React from 'react';
import { Award, Trophy, Medal, ArrowRight, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { CandidateAnalysisResult, CohortRankingSummary } from '../types/recruitment';
import { getScoreBadgeClass } from '../utils/formatters';

interface BestCandidateSpotlightProps {
  rankingSummary: CohortRankingSummary;
  candidates: CandidateAnalysisResult[];
  onSelectCandidate: (candidate: CandidateAnalysisResult) => void;
}

export const BestCandidateSpotlight: React.FC<BestCandidateSpotlightProps> = ({
  rankingSummary,
  candidates,
  onSelectCandidate,
}) => {
  const bestCandidateObj = candidates.find(
    (c) => c.id === rankingSummary.bestCandidate?.candidateId
  ) || candidates[0];

  const secondBestObj = candidates.find(
    (c) => c.id === rankingSummary.secondBestCandidate?.candidateId
  ) || candidates[1];

  const thirdBestObj = candidates.find(
    (c) => c.id === rankingSummary.thirdBestCandidate?.candidateId
  ) || candidates[2];

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Best Candidate Selection &amp; Cohort Ranking
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {rankingSummary.cohortOverview}
            </p>
          </div>

          {bestCandidateObj && (
            <button
              onClick={() => onSelectCandidate(bestCandidateObj)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm shrink-0 self-start md:self-center"
            >
              <span>View Top Candidate ({bestCandidateObj.candidateName})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Top 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* #1 Best Candidate */}
        {bestCandidateObj && (
          <div className="bg-white rounded-xl border-2 border-amber-300 shadow-md p-5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                  <Trophy className="w-4 h-4 text-amber-600 fill-amber-400" />
                  <span>BEST CANDIDATE (RANK 1)</span>
                </span>
                <span className="text-lg font-black font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {bestCandidateObj.scores.overallScore}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {bestCandidateObj.candidateName}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {bestCandidateObj.profile.headline || `${bestCandidateObj.profile.totalYearsExperience} Years Experience`}
              </p>

              {/* Key Edge */}
              <div className="mt-3 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-600" /> Key Competitive Edge:
                </span>
                <p className="text-amber-950 font-medium leading-relaxed">
                  {rankingSummary.bestCandidate?.keyEdge || 'Strongest technical and domain alignment with core requirements.'}
                </p>
              </div>

              {/* Justification why ranked */}
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800">Ranking Rationale:</span>
                <p className="leading-relaxed">
                  {rankingSummary.bestCandidate?.justification || bestCandidateObj.explainability.whyScoreAssigned}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Recommended for Interview
              </span>
              <button
                onClick={() => onSelectCandidate(bestCandidateObj)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* #2 Second Best Candidate */}
        {secondBestObj && (
          <div className="bg-white rounded-xl border border-slate-300 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                  <Medal className="w-4 h-4 text-slate-500 fill-slate-300" />
                  <span>SECOND BEST (RANK 2)</span>
                </span>
                <span className="text-base font-black font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {secondBestObj.scores.overallScore}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {secondBestObj.candidateName}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {secondBestObj.profile.headline || `${secondBestObj.profile.totalYearsExperience} Years Experience`}
              </p>

              {/* Key Edge */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-slate-500" /> Candidate Profile:
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {rankingSummary.secondBestCandidate?.keyEdge || 'Solid domain foundation with targeted growth areas.'}
                </p>
              </div>

              {/* Justification why ranked */}
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800">Ranking Rationale:</span>
                <p className="leading-relaxed">
                  {rankingSummary.secondBestCandidate?.justification || secondBestObj.explainability.whyScoreAssigned}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Strong Contender
              </span>
              <button
                onClick={() => onSelectCandidate(secondBestObj)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* #3 Third Best Candidate */}
        {thirdBestObj ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  <Medal className="w-4 h-4 text-amber-700" />
                  <span>THIRD BEST (RANK 3)</span>
                </span>
                <span className="text-base font-black font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {thirdBestObj.scores.overallScore}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {thirdBestObj.candidateName}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {thirdBestObj.profile.headline || `${thirdBestObj.profile.totalYearsExperience} Years Experience`}
              </p>

              {/* Key Edge */}
              <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-slate-500" /> Candidate Profile:
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {rankingSummary.thirdBestCandidate?.keyEdge || 'Potential fit with specific upskilling or coaching required.'}
                </p>
              </div>

              {/* Justification why ranked */}
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800">Ranking Rationale:</span>
                <p className="leading-relaxed">
                  {rankingSummary.thirdBestCandidate?.justification || thirdBestObj.explainability.whyScoreAssigned}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Backup Candidate
              </span>
              <button
                onClick={() => onSelectCandidate(thirdBestObj)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Full Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-5 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-medium text-slate-500">
              Only {candidates.length} candidate{candidates.length > 1 ? 's' : ''} screened.
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Upload 3 or more resumes to populate the complete 3-tier podium ranking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
