import React, { useState } from 'react';
import { X, Send, Check, AlertCircle, MessageSquare, Copy, ExternalLink } from 'lucide-react';
import { BatchAnalysisResponse } from '../types/recruitment';

interface SlackShareModalProps {
  data: BatchAnalysisResponse;
  onClose: () => void;
}

export const SlackShareModal: React.FC<SlackShareModalProps> = ({ data, onClose }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [channelName, setChannelName] = useState('#recruitment-hiring');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const top1 = data.rankingSummary.bestCandidate;
  const top2 = data.rankingSummary.secondBestCandidate;
  const top3 = data.rankingSummary.thirdBestCandidate;

  // Formatted Slack mrkdwn message payload
  const formattedSlackMarkdown = `🎯 *TalentPulse AI: Candidate Screening Summary*
*Role:* ${data.jobTitle}
*Screened:* ${data.candidates.length} candidates | *Date:* ${new Date(data.analyzedAt).toLocaleDateString()}

🏆 *Top Candidate Rankings:*
1️⃣ *#1 ${top1?.candidateName || 'N/A'}* — Score: *${top1?.score || 0}/100*
> *Key Edge:* ${top1?.keyEdge || 'N/A'}
> *Rationale:* ${top1?.justification || 'N/A'}

${top2 ? `2️⃣ *#2 ${top2.candidateName}* — Score: *${top2.score}/100*\n> *Key Edge:* ${top2.keyEdge}\n` : ''}
${top3 ? `3️⃣ *#3 ${top3.candidateName}* — Score: *${top3.score}/100*\n> *Key Edge:* ${top3.keyEdge}\n` : ''}
📊 *Cohort Overview:*
${data.rankingSummary.cohortOverview}

🔗 *Full Interactive Dossier & Leaderboard:* ${window.location.href}`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedSlackMarkdown);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 3000);
    } catch {
      setErrorMsg('Failed to copy to clipboard automatically.');
    }
  };

  const handleSendToSlackWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) {
      setErrorMsg('Please paste a Slack Incoming Webhook URL.');
      return;
    }

    setIsSending(true);
    setErrorMsg(null);
    setSendSuccess(false);

    try {
      const response = await fetch('/api/share-slack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim(),
          channel: channelName.trim(),
          jobTitle: data.jobTitle,
          summary: data.rankingSummary,
          candidatesCount: data.candidates.length,
          previewUrl: window.location.href,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to dispatch to Slack webhook.');
      }

      setSendSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending message to Slack webhook.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4A154B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              #
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Share Candidate Ranking to Slack
              </h3>
              <p className="text-xs text-slate-500">
                Post an executive hiring digest directly into your team channel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {sendSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Posted to Slack successfully!</strong> Your hiring team channel has received the candidate rankings.
            </span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Option A: Automated Slack Incoming Webhook */}
        <form onSubmit={handleSendToSlackWebhook} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Send via Slack Webhook</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-medium normal-case">Direct Integration</span>
            </label>
            <a
              href="https://api.slack.com/messaging/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Get Webhook URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2">
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/T.../B.../..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Channel tag:</span>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="#recruitment-hiring"
                className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#4A154B] hover:bg-[#3d113e] text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending...' : 'Post to Slack'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Option B: One-Click Copy Formatted Slack Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Or Quick Copy Message (Formatted for Slack)</span>
            </span>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy for Slack</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-[11px] max-h-36 overflow-y-auto leading-relaxed border border-slate-800 select-all">
            {formattedSlackMarkdown}
          </div>
          <p className="text-[11px] text-slate-500">
            Paste directly into any Slack DM, group, or channel. It automatically uses Slack bold, emojis, quotes, and links.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
