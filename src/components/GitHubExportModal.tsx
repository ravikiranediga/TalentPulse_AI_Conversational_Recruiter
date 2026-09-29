import React, { useState } from 'react';
import { 
  Github, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ExternalLink, 
  Key, 
  FolderArchive, 
  Terminal, 
  Loader2 
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/ravikiranediga/TalentPulse_AI_Conversational_Recruiter');
  const [githubToken, setGithubToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handlePushToGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your GitHub repository URL.' });
      return;
    }

    setIsPushing(true);
    setStatusMessage({ type: 'info', text: 'Connecting to GitHub and pushing main branch...' });

    try {
      const res = await fetch('/api/push-to-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          token: githubToken.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || '🎉 All 26 files successfully pushed to your GitHub repository!',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to push to GitHub. Please check your token and repo permissions.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error pushing to GitHub.' });
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Export &amp; Push to GitHub
              </h2>
              <p className="text-xs text-slate-400">
                Download to your computer or push directly to your GitHub repo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`my-4 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-red-950/60 border-red-500/40 text-red-200'
                : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 animate-spin" />
            )}
            <div className="flex-1 font-medium">{statusMessage.text}</div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method 1: Push Directly to GitHub */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-indigo-300 font-semibold text-sm">
                <Github className="w-4 h-4" />
                <span>Method 1: Push Directly from Cloud</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                No local git or computer setup needed! Push all source files directly to your GitHub repository in 1 click.
              </p>

              <form onSubmit={handlePushToGitHub} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    GitHub Repo URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/talentpulse"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <Key className="w-3 h-3 text-amber-400" /> Personal Access Token:
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=TalentPulse+Export"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 underline"
                    >
                      Generate token <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Token with <span className="text-amber-300 font-mono">repo</span> scope needed for authentication.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isPushing}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Pushing to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-3.5 h-3.5" />
                      <span>Push to GitHub Now</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Method 2: Download Code to Local Computer */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-300 font-semibold text-sm">
                <Download className="w-4 h-4" />
                <span>Method 2: Download to Your PC</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Download the complete codebase archive to your local computer and run or push it locally.
              </p>

              <a
                href="/api/download-project"
                download="talentpulse-ats-source.tar.gz"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer mb-3"
              >
                <FolderArchive className="w-4 h-4 text-emerald-400" />
                <span>Download Source Archive (.tar.gz)</span>
              </a>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="text-slate-500 text-[10px] font-sans flex items-center gap-1 mb-1">
                  <Terminal className="w-3 h-3 text-slate-400" /> Local Setup Commands:
                </div>
                <div className="text-emerald-400"># 1. Extract archive</div>
                <div>tar -xzf talentpulse-ats-source.tar.gz</div>
                <div className="text-emerald-400 mt-1"># 2. Install dependencies</div>
                <div>npm install</div>
                <div className="text-emerald-400 mt-1"># 3. Start app</div>
                <div>npm run dev</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
