import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  ExternalLink, 
  Award, 
  ChevronRight, 
  CheckSquare, 
  Square,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CandidateAnalysisResult } from '../types/recruitment';
import { getScoreBadgeClass, getRecommendationMeta } from '../utils/formatters';

interface LeaderboardTableProps {
  candidates: CandidateAnalysisResult[];
  onSelectCandidate: (candidate: CandidateAnalysisResult) => void;
  selectedForCompare: string[];
  onToggleCompare: (candidateId: string) => void;
  onOpenCompareModal: () => void;
}

type SortField = 
  | 'rank' 
  | 'candidateName' 
  | 'overallScore' 
  | 'skillsScore' 
  | 'experienceScore' 
  | 'educationScore' 
  | 'certificationScore' 
  | 'projectRelevanceScore';

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  candidates,
  onSelectCandidate,
  selectedForCompare,
  onToggleCompare,
  onOpenCompareModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('overallScore');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // Default descending for scores
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = c.candidateName.toLowerCase().includes(q);
    const skillsMatch = c.profile.skills.coreTechnical.some((s) => s.toLowerCase().includes(q));
    return nameMatch || skillsMatch;
  });

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let aVal: any = 0;
    let bVal: any = 0;

    switch (sortField) {
      case 'rank':
        aVal = a.rank;
        bVal = b.rank;
        break;
      case 'candidateName':
        aVal = a.candidateName.toLowerCase();
        bVal = b.candidateName.toLowerCase();
        break;
      case 'overallScore':
        aVal = a.scores.overallScore;
        bVal = b.scores.overallScore;
        break;
      case 'skillsScore':
        aVal = a.scores.skillsScore;
        bVal = b.scores.skillsScore;
        break;
      case 'experienceScore':
        aVal = a.scores.experienceScore;
        bVal = b.scores.experienceScore;
        break;
      case 'educationScore':
        aVal = a.scores.educationScore;
        bVal = b.scores.educationScore;
        break;
      case 'certificationScore':
        aVal = a.scores.certificationScore;
        bVal = b.scores.certificationScore;
        break;
      case 'projectRelevanceScore':
        aVal = a.scores.projectRelevanceScore;
        bVal = b.scores.projectRelevanceScore;
        break;
      default:
        aVal = a.scores.overallScore;
        bVal = b.scores.overallScore;
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <Award className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>#1 Best</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
          <Award className="w-3.5 h-3.5 text-slate-500 fill-slate-400" />
          <span>#2</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Award className="w-3.5 h-3.5 text-amber-700" />
          <span>#3</span>
        </span>
      );
    }
    return (
      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
        #{rank}
      </span>
    );
  };

  const renderScorePill = (score: number, isMain: boolean = false) => {
    const badge = getScoreBadgeClass(score);
    return (
      <span
        className={`inline-flex items-center justify-center font-mono font-bold rounded-md border ${
          isMain
            ? `text-sm px-2.5 py-1 ${badge.bg} ${badge.border} ring-1 ${badge.ring}`
            : `text-xs px-2 py-0.5 ${badge.bg} ${badge.border}`
        }`}
      >
        {score}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Top Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>ATS Candidate Leaderboard</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
              {candidates.length} Applicants
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any column header to sort. Check 2–3 candidates for side-by-side comparison matrix.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search candidate or skill..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400 w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Side by side compare trigger */}
          {selectedForCompare.length >= 2 && (
            <button
              onClick={onOpenCompareModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-sm animate-pulse"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({selectedForCompare.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider select-none">
              <th className="py-3 px-3 w-10 text-center">
                <span className="sr-only">Select</span>
              </th>
              <th
                onClick={() => handleSort('rank')}
                className="py-3 px-3 cursor-pointer hover:text-indigo-600 text-center w-24"
              >
                <div className="inline-flex items-center gap-1">
                  <span>Rank</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('candidateName')}
                className="py-3 px-4 cursor-pointer hover:text-indigo-600 min-w-[200px]"
              >
                <div className="inline-flex items-center gap-1">
                  <span>Candidate Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('overallScore')}
                className="py-3 px-3 cursor-pointer hover:text-indigo-600 text-center"
              >
                <div className="inline-flex items-center gap-1 justify-center">
                  <span>Overall ATS</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('skillsScore')}
                className="py-3 px-3 cursor-pointer hover:text-indigo-600 text-center"
              >
                <div className="inline-flex items-center gap-1 justify-center">
                  <span>Skills</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('experienceScore')}
                className="py-3 px-3 cursor-pointer hover:text-indigo-600 text-center"
              >
                <div className="inline-flex items-center gap-1 justify-center">
                  <span>Experience</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('educationScore')}
                className="py-3 px-3 cursor-pointer hover:text-indigo-600 text-center"
              >
                <div className="inline-flex items-center gap-1 justify-center">
                  <span>Education</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('certificationScore')}
                className="py-3 px-3 cursor-pointer hover:text-indigo-600 text-center"
              >
                <div className="inline-flex items-center gap-1 justify-center">
                  <span>Certifications</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-left">Recruiter Recommendation</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sortedCandidates.length > 0 ? (
              sortedCandidates.map((candidate) => {
                const isSelected = selectedForCompare.includes(candidate.id);
                const rec = getRecommendationMeta(candidate.hiringSummary.recommendationStatus);

                return (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      candidate.rank === 1 ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Checkbox for side-by-side comparison */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleCompare(candidate.id)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Select for comparison"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-3 text-center">
                      {renderRankBadge(candidate.rank)}
                    </td>

                    {/* Candidate Name & Snapshot */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                          {candidate.candidateName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onSelectCandidate(candidate)}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors text-left truncate block max-w-[200px]"
                          >
                            {candidate.candidateName}
                          </button>
                          <p className="text-xs text-slate-500 truncate max-w-[220px]">
                            {candidate.profile.headline ||
                              `${candidate.profile.totalYearsExperience} yrs experience`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Overall ATS Score */}
                    <td className="py-3.5 px-3 text-center">
                      {renderScorePill(candidate.scores.overallScore, true)}
                    </td>

                    {/* Skills Score */}
                    <td className="py-3.5 px-3 text-center">
                      {renderScorePill(candidate.scores.skillsScore)}
                    </td>

                    {/* Experience Score */}
                    <td className="py-3.5 px-3 text-center">
                      {renderScorePill(candidate.scores.experienceScore)}
                    </td>

                    {/* Education Score */}
                    <td className="py-3.5 px-3 text-center">
                      {renderScorePill(candidate.scores.educationScore)}
                    </td>

                    {/* Certification Score */}
                    <td className="py-3.5 px-3 text-center">
                      {renderScorePill(candidate.scores.certificationScore)}
                    </td>

                    {/* Recruiter Recommendation */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${rec.badgeClass}`}
                      >
                        {rec.label}
                      </span>
                    </td>

                    {/* Action: Open Detailed Dossier */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onSelectCandidate(candidate)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-8 text-center text-xs text-slate-500">
                  No candidates match &ldquo;{searchTerm}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> 85+ Strong Match
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> 70–84 Moderate Match
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 55–69 Partial Match
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> &lt;55 Low Match
          </span>
        </div>

        <div>
          Showing {sortedCandidates.length} of {candidates.length} candidates
        </div>
      </div>
    </div>
  );
};
