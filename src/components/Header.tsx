import React from 'react';
import { 
  Users, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Briefcase,
  FileCheck,
  Github
} from 'lucide-react';
import { SAMPLE_JOB_PROFILES } from '../data/sampleJobProfiles';

interface HeaderProps {
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
  onOpenExport?: () => void;
  onOpenGitHubExport?: () => void;
  hasResults: boolean;
  activePresetId?: string;
  isChatbotMode: boolean;
  onToggleChatbotMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  onOpenExport,
  onOpenGitHubExport,
  hasResults,
  activePresetId,
  isChatbotMode,
  onToggleChatbotMode,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">TalentPulse AI</span>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Recruiter Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Explainable ATS Screening, Multi-Candidate Comparison &amp; Ranking Engine
              </p>
            </div>
          </div>

          {/* Quick Presets & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Presets dropdown/buttons */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
              <span className="px-2 text-slate-400 font-medium flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Presets:
              </span>
              {SAMPLE_JOB_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onSelectPreset(profile.id)}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    activePresetId === profile.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title={`Load ${profile.roleTitle} & 3 real resumes`}
                >
                  {profile.id === 'fullstack-ai-engineer' ? 'Full-Stack AI' : 'AI Product Mgr'}
                </button>
              ))}
            </div>

            {/* Direct Dual View Switcher: AI Chatbot vs Resume Upload Studio */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => isChatbotMode || onToggleChatbotMode()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isChatbotMode
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>🤖 AI Chatbot</span>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-emerald-200">Omni-Channel</span>
              </button>

              <button
                onClick={() => !isChatbotMode || onToggleChatbotMode()}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isChatbotMode
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>📄 Upload Resumes &amp; Score</span>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded text-indigo-200">ATS Studio</span>
              </button>
            </div>

            {onOpenGitHubExport && (
              <button
                onClick={onOpenGitHubExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-all shadow-sm cursor-pointer"
                title="Push codebase to GitHub or download source archive"
              >
                <Github className="w-3.5 h-3.5 text-indigo-400" />
                <span>GitHub / Download</span>
              </button>
            )}

            {hasResults && onOpenExport && (
              <button
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Reset session and start new screening"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Screening</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
