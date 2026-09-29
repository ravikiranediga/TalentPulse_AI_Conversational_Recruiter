/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  ArrowLeft, 
  Download, 
  Layers, 
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  FileCheck2,
  Users
} from 'lucide-react';
import { Header } from './components/Header';
import { WorkflowStepper } from './components/WorkflowStepper';
import { JobDescriptionSection } from './components/JobDescriptionSection';
import { ResumeUploadSection } from './components/ResumeUploadSection';
import { LeaderboardTable } from './components/LeaderboardTable';
import { BestCandidateSpotlight } from './components/BestCandidateSpotlight';
import { CandidateDossierModal } from './components/CandidateDossierModal';
import { SideBySideCompareModal } from './components/SideBySideCompareModal';
import { ReportExportModal } from './components/ReportExportModal';
import { SlackShareModal } from './components/SlackShareModal';
import { ChatbotRecruiterView } from './components/ChatbotRecruiterView';
import { SAMPLE_JOB_PROFILES } from './data/sampleJobProfiles';
import { 
  ResumeInput, 
  BatchAnalysisResponse, 
  CandidateAnalysisResult 
} from './types/recruitment';

export default function App() {
  // Start with clean slate: NO preloaded candidates (Maya, David, Chloe deleted)
  const defaultProfile = SAMPLE_JOB_PROFILES[0];

  const [activePresetId, setActivePresetId] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [resumes, setResumes] = useState<ResumeInput[]>([]);

  // Workflow State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Results State
  const [analysisResults, setAnalysisResults] = useState<BatchAnalysisResponse | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateAnalysisResult | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showSlackModal, setShowSlackModal] = useState<boolean>(false);
  // Default to Chatbot mode per user/HR requirement
  const [isChatbotMode, setIsChatbotMode] = useState<boolean>(true);

  // Quick preset loader
  const handleLoadPreset = (presetId: string) => {
    const profile = SAMPLE_JOB_PROFILES.find((p) => p.id === presetId);
    if (!profile) return;

    setActivePresetId(profile.id);
    setJobTitle(profile.roleTitle);
    setJobDescription(profile.jobDescription);
    setResumes(profile.sampleResumes);
    setAnalysisResults(null);
    setSelectedCandidate(null);
    setSelectedForCompare([]);
    setAnalysisError(null);
    setCurrentStep(1);
  };

  // Populate sample resumes for current job
  const handleLoadSampleResumes = () => {
    const profile = SAMPLE_JOB_PROFILES.find((p) => p.id === activePresetId) || SAMPLE_JOB_PROFILES[0];
    setResumes(profile.sampleResumes);
  };

  // Full reset
  const handleReset = () => {
    setJobTitle('');
    setJobDescription('');
    setResumes([]);
    setAnalysisResults(null);
    setSelectedCandidate(null);
    setSelectedForCompare([]);
    setAnalysisError(null);
    setActivePresetId('');
    setCurrentStep(1);
  };

  // Toggle candidate selection for comparison
  const handleToggleCompare = (candidateId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= 3) {
        // limit comparison to 3 candidates simultaneously for visual clarity
        return [...prev.slice(1), candidateId];
      }
      return [...prev, candidateId];
    });
  };

  // Run the batch analysis API call
  const handleStartAnalysis = async () => {
    if (!jobDescription.trim()) {
      setAnalysisError('Please provide a Job Description.');
      setCurrentStep(1);
      return;
    }

    if (resumes.length === 0) {
      setAnalysisError('Please upload at least 1 candidate resume.');
      setCurrentStep(2);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentStep(3);

    try {
      const response = await fetch('/api/analyze-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: jobTitle.trim() || 'Target Position',
          jobDescription: jobDescription.trim(),
          resumes: resumes.map((r) => ({
            id: r.id,
            fileName: r.fileName,
            candidateName: r.candidateName,
            fileType: r.fileType,
            rawText: r.rawText,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || `Server responded with ${response.status}`
        );
      }

      const res = await response.json();
      if (!res.data || !res.data.candidates) {
        throw new Error('Invalid format returned by AI screening engine.');
      }

      setAnalysisResults(res.data);
      setCurrentStep(4);

      // Auto-select first two candidates for quick comparison if multiple exist
      if (res.data.candidates.length >= 2) {
        setSelectedForCompare([res.data.candidates[0].id, res.data.candidates[1].id]);
      }
    } catch (err: any) {
      console.error('AI screening error:', err);
      setAnalysisError(err.message || 'An unexpected error occurred during screening.');
      setCurrentStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const candidatesForComparison = analysisResults
    ? analysisResults.candidates.filter((c) => selectedForCompare.includes(c.id))
    : [];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        onSelectPreset={handleLoadPreset}
        onReset={handleReset}
        onOpenExport={() => setShowExportModal(true)}
        hasResults={Boolean(analysisResults)}
        activePresetId={activePresetId}
        isChatbotMode={isChatbotMode}
        onToggleChatbotMode={() => setIsChatbotMode(!isChatbotMode)}
      />

      {isChatbotMode ? (
        /* CHATBOT RECRUITER VIEW (Slack / WhatsApp / Telegram Simulator) */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ChatbotRecruiterView
            jobTitle={jobTitle}
            jobDescription={jobDescription}
            resumes={resumes}
            onUpdateResumes={setResumes}
            onUpdateJob={(title, desc) => {
              setJobTitle(title);
              setJobDescription(desc);
            }}
            onSwitchToDashboard={() => setIsChatbotMode(false)}
          />
        </main>
      ) : (
        <>
          {/* 4-Step Recruitment Process Stepper */}
          <WorkflowStepper
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step === 1) setCurrentStep(1);
              if (step === 2 && jobDescription.trim().length > 30) setCurrentStep(2);
              if (step === 4 && analysisResults) setCurrentStep(4);
            }}
            canNavigateToStep={(step) => {
              if (step === 1) return true;
              if (step === 2) return jobDescription.trim().length > 30;
              if (step === 3) return isAnalyzing;
              if (step === 4) return Boolean(analysisResults);
              return false;
            }}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification */}
        {analysisError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-bold">Screening Error</strong>
              <p className="mt-0.5">{analysisError}</p>
            </div>
            <button
              onClick={() => setAnalysisError(null)}
              className="text-xs font-semibold text-rose-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* STEP 1: Job Description Specification */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <JobDescriptionSection
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              onProceedToResumes={() => setCurrentStep(2)}
              onLoadSample={handleLoadPreset}
            />
          </div>
        )}

        {/* STEP 2: Resume Upload & Management */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <ResumeUploadSection
              resumes={resumes}
              setResumes={setResumes}
              onAnalyze={handleStartAnalysis}
              onBackToJob={() => setCurrentStep(1)}
              onLoadSampleResumes={handleLoadSampleResumes}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        {/* STEP 3: Active AI Screening In-Progress State */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-md max-w-2xl mx-auto my-12 space-y-6">
            <div className="relative w-20 h-20 mx-auto">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-indigo-600 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Evaluating Resumes with Gemini AI Engine...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Parsing candidate resumes, verifying technical stacks, evaluating experience scale,
                calculating ATS sub-metrics, and generating explainability reasoning.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 text-left max-w-md mx-auto font-mono">
              <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Job Description Parsed: &ldquo;{jobTitle || 'Target Role'}&rdquo;</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                <span>Processing {resumes.length} candidate resumes...</span>
              </div>
              <div className="text-[11px] text-slate-400 pl-6">
                Calibrating skills match, experience scale, and generating 3-tier ranking
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Results & Recruiter Dashboard */}
        {currentStep === 4 && analysisResults && (
          <div className="space-y-6">
            {/* Top Results Navigation Banner */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  Screening Completed
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  Evaluation Report: {analysisResults.jobTitle}
                </h2>
                <p className="text-xs text-slate-500">
                  {analysisResults.candidates.length} Candidates Screened • Analyzed on{' '}
                  {new Date(analysisResults.analyzedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedForCompare.length >= 2 && (
                  <button
                    onClick={() => setShowCompareModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-2xs"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Compare ({selectedForCompare.length})</span>
                  </button>
                )}
                <button
                  onClick={() => setShowSlackModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#4A154B] hover:bg-[#3d113e] text-white rounded-lg transition-colors shadow-2xs"
                  title="Share candidate ranking directly to Slack"
                >
                  <span className="font-bold text-sm leading-none">#</span>
                  <span>Share to Slack</span>
                </button>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Edit Candidates</span>
                </button>
              </div>
            </div>

            {/* Feature 7: Best Candidate Selection (Top 3 Podium) */}
            <BestCandidateSpotlight
              rankingSummary={analysisResults.rankingSummary}
              candidates={analysisResults.candidates}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
            />

            {/* Feature 6: Candidate Comparison Ranking Table */}
            <LeaderboardTable
              candidates={analysisResults.candidates}
              onSelectCandidate={(cand) => setSelectedCandidate(cand)}
              selectedForCompare={selectedForCompare}
              onToggleCompare={handleToggleCompare}
              onOpenCompareModal={() => setShowCompareModal(true)}
            />
          </div>
        )}
      </main>
      </>
      )}

      {/* Candidate Deep-Dive Dossier Modal */}
      {selectedCandidate && (
        <CandidateDossierModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          jobTitle={analysisResults?.jobTitle || jobTitle}
        />
      )}

      {/* Side-by-Side Comparison Matrix Modal */}
      {showCompareModal && (
        <SideBySideCompareModal
          candidates={candidatesForComparison}
          onClose={() => setShowCompareModal(false)}
          onSelectCandidate={(cand) => setSelectedCandidate(cand)}
        />
      )}

      {/* Report Export Modal */}
      {showExportModal && analysisResults && (
        <ReportExportModal
          data={analysisResults}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Slack Share Modal */}
      {showSlackModal && analysisResults && (
        <SlackShareModal
          data={analysisResults}
          onClose={() => setShowSlackModal(false)}
        />
      )}
    </div>
  );
}
