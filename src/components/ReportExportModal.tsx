import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileCode, Printer, Copy, Check } from 'lucide-react';
import { BatchAnalysisResponse } from '../types/recruitment';
import { exportCandidatesToCSV } from '../utils/formatters';

interface ReportExportModalProps {
  data: BatchAnalysisResponse;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({ data, onClose }) => {
  const [copiedBrief, setCopiedBrief] = useState(false);

  const handleDownloadCSV = () => {
    exportCandidatesToCSV(data.candidates, data.jobTitle);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ATS_Report_${data.jobTitle.replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyExecutiveBrief = () => {
    const brief = `# Executive Recruitment Screening Brief
Job Title: ${data.jobTitle}
Date of Evaluation: ${new Date(data.analyzedAt).toLocaleDateString()}

## Cohort Summary
${data.rankingSummary.cohortOverview}

## Top Ranked Candidates
1. ${data.rankingSummary.bestCandidate?.candidateName} (Score: ${data.rankingSummary.bestCandidate?.score}/100)
   Edge: ${data.rankingSummary.bestCandidate?.keyEdge}
   Rationale: ${data.rankingSummary.bestCandidate?.justification}

${
  data.rankingSummary.secondBestCandidate
    ? `2. ${data.rankingSummary.secondBestCandidate.candidateName} (Score: ${data.rankingSummary.secondBestCandidate.score}/100)
   Edge: ${data.rankingSummary.secondBestCandidate.keyEdge}
   Rationale: ${data.rankingSummary.secondBestCandidate.justification}\n`
    : ''
}
${
  data.rankingSummary.thirdBestCandidate
    ? `3. ${data.rankingSummary.thirdBestCandidate.candidateName} (Score: ${data.rankingSummary.thirdBestCandidate.score}/100)
   Edge: ${data.rankingSummary.thirdBestCandidate.keyEdge}
   Rationale: ${data.rankingSummary.thirdBestCandidate.justification}\n`
    : ''
}
## Candidate Rankings & Recommendations
${data.candidates
  .map(
    (c) =>
      `• #${c.rank} ${c.candidateName} (ATS ${c.scores.overallScore}) - ${c.hiringSummary.recommendationStatus}: "${c.hiringSummary.conciseSummary}"`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(brief);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto space-y-4 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600" />
              Export ATS Recruitment Report
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Target Role: <strong className="text-slate-800">{data.jobTitle}</strong> (
              {data.candidates.length} Candidates Screened)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* CSV Export */}
          <button
            onClick={handleDownloadCSV}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
              Download CSV Spreadsheet
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Includes candidate ranks, all 5 ATS sub-scores, experience years, and recommendations.
            </p>
          </button>

          {/* JSON Export */}
          <button
            onClick={handleDownloadJSON}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-300 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileCode className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-800">
              Export Complete JSON Dossier
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Complete raw data including full parsed profiles, questions, and gap analysis.
            </p>
          </button>

          {/* Print / Save as PDF */}
          <button
            onClick={handlePrint}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-300 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
              Print / Save as PDF
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Open print-ready report dialog to print or save as formatted PDF document.
            </p>
          </button>

          {/* Copy Markdown Summary */}
          <button
            onClick={handleCopyExecutiveBrief}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-amber-50/40 hover:border-amber-300 transition-all text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              {copiedBrief ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
              {copiedBrief ? 'Copied to Clipboard!' : 'Copy Executive Brief (Markdown)'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Formatted markdown summary ready to paste into Slack, Notion, or recruiter email.
            </p>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
