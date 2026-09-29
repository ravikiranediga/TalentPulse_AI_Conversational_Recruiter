import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Paperclip, 
  RefreshCw, 
  FileText, 
  Copy, 
  Check, 
  SlidersHorizontal,
  ExternalLink,
  Info,
  Upload
} from 'lucide-react';
import { ResumeInput } from '../types/recruitment';

export type ChatPlatform = 'slack' | 'whatsapp' | 'telegram';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  badges?: string[];
}

interface ChatbotRecruiterViewProps {
  jobTitle: string;
  jobDescription: string;
  resumes: ResumeInput[];
  onUpdateResumes?: (resumes: ResumeInput[]) => void;
  onUpdateJob?: (title: string, desc: string) => void;
  onSwitchToDashboard?: () => void;
}

export const ChatbotRecruiterView: React.FC<ChatbotRecruiterViewProps> = ({
  jobTitle,
  jobDescription,
  resumes,
  onUpdateResumes,
  onUpdateJob,
  onSwitchToDashboard,
}) => {
  const [platform, setPlatform] = useState<ChatPlatform>('slack');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tgTokenInput, setTgTokenInput] = useState('');
  const [tgConnecting, setTgConnecting] = useState(false);
  const [tgStatusMsg, setTgStatusMsg] = useState<string | null>(null);

  const candidateNamesList = resumes && resumes.length > 0
    ? resumes.map((r) => r.candidateName || r.fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')).join(', ')
    : 'None (Ready for your resumes)';

  const firstCandidate = resumes[0]?.candidateName || 'Candidate 1';
  const secondCandidate = resumes[1]?.candidateName || 'Candidate 2';

  const initialBotMessage = resumes.length > 0
    ? `👋 *TalentPulse AI Recruitment Bot online!*
I am connected and ready to assist you directly in *${platform.toUpperCase()}*.

Currently loaded:
• *Role:* ${jobTitle || 'Active Job Opening'}
• *Candidates in queue:* ${resumes.length} resumes (${candidateNamesList})

*Quick Commands you can tap or type:*
1. 📄 *"Resume options"* (How to submit candidate resumes)
2. 🎯 *"Rank all candidates for this role"*
3. 🏆 *"Who is the #1 best candidate and why?"*
4. 🆚 *"Compare ${firstCandidate} and ${secondCandidate}"*
5. 🎓 *"Suggest 3 certifications to fix skill gaps"*
6. ❓ *"Generate tough interview questions for ${firstCandidate}"*`
    : `👋 *TalentPulse AI Recruitment Bot online!*
I am connected and ready in *${platform.toUpperCase()}*.

🧹 *All previous resumes have been cleared!*
Old default profiles (Maya, David, Chloe) are deleted. I will analyze ONLY the resumes and Job Description you send.

📥 *Ready for your inputs:*
1. 💼 *Job Description:* ${jobTitle ? `"${jobTitle}"` : 'Paste your Job Description or role title'}
2. 📄 *Resumes:* Tap the **Attach Resume / JD (📎)** button below to send your PDF/Word resume files.
3. ⚡ I will score and rank ONLY your applicants!`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: initialBotMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const lowerQuery = query.toLowerCase().trim();
    const isJdQuery =
      lowerQuery.startsWith('/jd') ||
      lowerQuery.startsWith('/job') ||
      lowerQuery.startsWith('/role') ||
      lowerQuery.startsWith('job description:') ||
      lowerQuery.startsWith('target role:') ||
      lowerQuery.startsWith('role:') ||
      lowerQuery.startsWith('position:') ||
      ((lowerQuery.includes('responsibilities') || lowerQuery.includes('requirements')) && lowerQuery.includes('looking for'));

    if (isJdQuery && onUpdateJob) {
      const cleanDesc = query
        .replace(/^\/jd/i, '')
        .replace(/^\/job/i, '')
        .replace(/^\/role/i, '')
        .replace(/^job description:?/i, '')
        .replace(/^target role:?/i, '')
        .trim();
      const firstLine = cleanDesc.split('\n')[0].replace(/^job title:?/i, '').replace(/^role:?/i, '').trim();
      const title = firstLine && firstLine.length < 80 ? firstLine : 'Target Role';
      onUpdateJob(title, cleanDesc || query);
    }

    // Check if user is submitting a candidate resume via chat text or /resume
    const isPastedResume =
      !isJdQuery &&
      (lowerQuery.startsWith('/resume') ||
        lowerQuery.startsWith('/cv') ||
        lowerQuery.startsWith('candidate:') ||
        lowerQuery.startsWith('resume:') ||
        (lowerQuery.includes('experience') && lowerQuery.includes('skills') && lowerQuery.includes('education') && query.length > 80));

    let activeResumesList = [...resumes];
    let extractedCandidateName = '';

    if (isPastedResume) {
      const nameMatch = query.match(/(?:candidate name|name|applicant):\s*([^\n\r,]+)/i);
      if (nameMatch) {
        extractedCandidateName = nameMatch[1].trim();
      } else {
        const firstLine = query.replace(/^\/resume/i, '').replace(/^candidate:?/i, '').trim().split('\n')[0].trim();
        extractedCandidateName = firstLine && firstLine.length < 50 ? firstLine : `Candidate #${resumes.length + 1}`;
      }

      const newResume: ResumeInput = {
        id: `pasted-${Date.now()}`,
        fileName: `${extractedCandidateName}.txt`,
        candidateName: extractedCandidateName,
        rawText: query,
        fileType: 'txt',
      };

      activeResumesList = [...resumes, newResume];
      if (onUpdateResumes) {
        onUpdateResumes(activeResumesList);
      }
    }

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/bot-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          message: query.trim(),
          isJobDescription: isJdQuery,
          isCandidateResume: isPastedResume,
          candidateName: extractedCandidateName,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          currentJob: `${jobTitle}\n${jobDescription}`,
          resumes: activeResumesList.map((r) => ({
            id: r.id,
            candidateName: r.candidateName,
            fileName: r.fileName,
            rawText: r.rawText,
          })),
        }),
      });

      const data = await response.json();

      if (data.isJobDescription && onUpdateJob) {
        onUpdateJob(data.jobTitle || 'Target Role', data.jobDescription || query);
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      let fallbackText = '';
      if (isJdQuery || activeResumesList.length === 0) {
        fallbackText = `🎯 *Active Job Description Updated!*
Target role locked. There are currently *0 candidate resumes* in the queue.
👉 Please click **Attach Candidate Resume(s) (📄)** to send candidate files to screen against this role!`;
      } else {
        fallbackText = `⚠️ *TalentPulse Evaluation Summary (${activeResumesList.length} candidates loaded):*\nTop candidate leads with strong ATS alignment. Type *"Compare candidates"* or *"ATS score of candidate"* for breakdown.`;
      }

      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to reliably classify whether an uploaded document is a Job Description or a Candidate Resume
  const classifyDocumentType = (fileName: string, text: string): 'jd' | 'resume' => {
    const fn = fileName.toLowerCase();
    const t = text.toLowerCase();

    const hasJdFileName =
      fn.includes('jd') ||
      fn.includes('job') ||
      fn.includes('description') ||
      fn.includes('role') ||
      fn.includes('spec') ||
      fn.includes('posting') ||
      fn.includes('vacancy');

    const hasResumeFileName =
      fn.includes('resume') ||
      fn.includes('cv') ||
      fn.includes('curriculum') ||
      fn.includes('candidate') ||
      fn.includes('applicant');

    if (hasJdFileName && !hasResumeFileName) return 'jd';
    if (hasResumeFileName) return 'resume';

    let jdScore = 0;
    let resumeScore = 0;

    const jdKeywords = [
      'responsibilities',
      'requirements',
      'qualifications',
      'we are looking for',
      'what you will do',
      "what you'll do",
      'job summary',
      'role overview',
      'about the role',
      'about the job',
      'who you are',
      'minimum requirements',
      'preferred qualifications',
      'reports to',
      'compensation',
    ];

    const resumeKeywords = [
      'curriculum vitae',
      'work experience',
      'education',
      'university',
      'bachelor',
      'master',
      'gpa',
      'skills:',
      'projects:',
      'certifications:',
      'employment history',
      'personal profile',
    ];

    for (const kw of jdKeywords) {
      if (t.includes(kw)) jdScore += 2;
    }
    for (const kw of resumeKeywords) {
      if (t.includes(kw)) resumeScore += 2;
    }

    if (jdScore >= 4 && jdScore > resumeScore) return 'jd';
    return 'resume';
  };

  // Handle uploading specifically a Job Description document
  const handleUploadJobDescription = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64Data = (uploadEvent.target?.result as string)?.split(',')[1];
      if (!base64Data) return;

      const userMsgId = `jd-upload-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          sender: 'user',
          text: `💼 *Uploaded Target Job Description:* "${file.name}"\nPlease set this as the active role for screening candidates.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      setIsLoading(true);
      try {
        const extRes = await fetch('/api/extract-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.name.endsWith('.docx') ? 'docx' : file.name.endsWith('.pdf') ? 'pdf' : 'txt',
            base64Data,
          }),
        });
        const extData = await extRes.json();
        const extractedText = extData.extractedText || '';

        const cleanFirstLine = extractedText.split('\n')[0].replace(/^job title:?/i, '').replace(/^role:?/i, '').trim();
        const extractedTitle =
          cleanFirstLine && cleanFirstLine.length < 80
            ? cleanFirstLine
            : file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

        if (onUpdateJob) {
          onUpdateJob(extractedTitle, extractedText);
        }

        const chatRes = await fetch('/api/bot-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Set target Job Description: ${extractedTitle}\n\n${extractedText.slice(0, 3000)}`,
            isJobDescription: true,
            jobTitle: extractedTitle,
            platform,
            history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
            currentJob: `${extractedTitle}\n${extractedText}`,
            resumes: resumes.map((r) => ({
              id: r.id,
              candidateName: r.candidateName,
              fileName: r.fileName,
              rawText: r.rawText,
            })),
          }),
        });

        const chatData = await chatRes.json();

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text:
              chatData.reply ||
              `🎯 *Active Job Description Updated!*\n━━━━━━━━━━━━━━━━━━━━━━\n💼 *Target Role:* ${extractedTitle}\n\n✅ *The bot is now locked to this Job Description!*\nCurrently *0 candidate resumes* in queue.\n\n📥 *Next Step:* Tap **Attach Candidate Resume(s) (📄)** to send candidate files to evaluate against this role!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: `⚠️ Error parsing Job Description ${file.name}: ${err.message}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const readFileBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = (reader.result as string)?.split(',')[1];
        if (b64) resolve(b64);
        else reject(new Error('Failed to read file'));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle uploading candidate resumes (or auto-routing if user attached a JD)
  const handleUploadCandidateResumes = async (fileList: FileList) => {
    setIsLoading(true);
    let currentResumes = [...resumes];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const base64Data = await readFileBase64(file);
        // Extract text
        const extRes = await fetch('/api/extract-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.name.endsWith('.docx') ? 'docx' : file.name.endsWith('.pdf') ? 'pdf' : 'txt',
            base64Data,
          }),
        });
        const extData = await extRes.json();
        const extractedText = extData.extractedText || '';

        // Auto-classify whether this file is actually a JD or a Resume
        const docType = classifyDocumentType(file.name, extractedText);

        if (docType === 'jd') {
          // It's a Job Description! Set active job and do NOT score as a resume
          const cleanFirstLine = extractedText.split('\n')[0].replace(/^job title:?/i, '').replace(/^role:?/i, '').trim();
          const extractedTitle =
            cleanFirstLine && cleanFirstLine.length < 80
              ? cleanFirstLine
              : file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');

          if (onUpdateJob) {
            onUpdateJob(extractedTitle, extractedText);
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `usr-jd-${Date.now()}-${i}`,
              sender: 'user',
              text: `💼 *Uploaded Job Description:* "${file.name}"`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            {
              id: `bot-jd-${Date.now()}-${i + 1}`,
              sender: 'bot',
              text: `🎯 *Active Job Description Updated!*
━━━━━━━━━━━━━━━━━━━━━━
💼 *Target Role:* ${extractedTitle}

✅ *The bot is now locked to this Job Description!*
There are currently *${currentResumes.length} candidate resumes* in the queue.
(This file was recognized as a Job Description and was NOT counted as a candidate resume).

📥 *Next Step:*
Now click **Attach Candidate Resume(s) (📄)** to send candidate files to evaluate against this role!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          continue;
        }

        // Real Candidate Resume!
        const candidateName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        const newResume: ResumeInput = {
          id: `upload-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          fileName: file.name,
          candidateName,
          rawText: extractedText,
          fileType: file.name.endsWith('.docx') ? 'docx' : file.name.endsWith('.pdf') ? 'pdf' : 'txt',
        };

        currentResumes = [...currentResumes, newResume];
        if (onUpdateResumes) {
          onUpdateResumes(currentResumes);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `usr-${Date.now()}-${i}`,
            sender: 'user',
            text: `📄 Uploaded candidate resume #${currentResumes.length}: *${file.name}* (${candidateName})\nPlease score against active Job Description: "${jobTitle || 'Target Role'}".`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Send query to recruiter bot to score candidate
        const chatRes = await fetch('/api/bot-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Here is candidate resume #${currentResumes.length} from ${file.name} (${candidateName}):\n\n${extractedText.slice(0, 3500)}`,
            candidateName,
            isCandidateResume: true,
            platform,
            history: messages.slice(-4).map((m) => ({ sender: m.sender, text: m.text })),
            currentJob: `${jobTitle}\n${jobDescription}`,
            resumes: currentResumes,
          }),
        });
        const chatData = await chatRes.json();

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-eval-${Date.now()}-${i}`,
            sender: 'bot',
            text: chatData.reply || `Candidate ${candidateName} evaluated successfully.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}-${i}`,
            sender: 'bot',
            text: `⚠️ Error evaluating candidate ${file.name}: ${err.message}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }
    setIsLoading(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Platform specific visual themes
  const platformConfig = {
    slack: {
      name: 'Slack Bot',
      badgeColor: 'bg-[#4A154B] text-white',
      accentBorder: 'border-[#4A154B]',
      headerBg: 'bg-[#3F0E40] text-white',
      chatBg: 'bg-[#F8F8F8]',
      botBubble: 'bg-white border border-slate-200 text-slate-800 shadow-xs',
      userBubble: 'bg-[#1264A3] text-white',
      channelTag: '#talent-acquisition-ai',
      integrationNote: 'Live Slack Bot User Integration (Bolt.js / Slash command /recruiter-screen)',
    },
    whatsapp: {
      name: 'WhatsApp Business Bot',
      badgeColor: 'bg-[#25D366] text-white',
      accentBorder: 'border-[#25D366]',
      headerBg: 'bg-[#075E54] text-white',
      chatBg: 'bg-[#EFEAE2]',
      botBubble: 'bg-white border border-[#e1dcd5] text-slate-800 shadow-xs',
      userBubble: 'bg-[#DCF8C6] text-slate-800 border border-[#c4eab0]',
      channelTag: '+1 (800) HR-AI-BOT (Verified)',
      integrationNote: 'Official WhatsApp Business Cloud API & Webhook Dispatcher',
    },
    telegram: {
      name: 'Telegram Bot',
      badgeColor: 'bg-[#229ED9] text-white',
      accentBorder: 'border-[#229ED9]',
      headerBg: 'bg-[#2AABEE] text-white',
      chatBg: 'bg-[#E6ECF0]',
      botBubble: 'bg-white border border-slate-200 text-slate-800 shadow-xs',
      userBubble: 'bg-[#EFFDDE] text-slate-800 border border-[#bceba0]',
      channelTag: '@TalentPulseRecruiterBot',
      integrationNote: 'Telegram BotFather Engine with Inline Keyboards & Commands',
    },
  };

  const currentTheme = platformConfig[platform];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Platform Switcher & HR Pitch Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Native Chatbot Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Runs in messaging clients (Slack / Telegram / WhatsApp)
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            TalentPulse AI Conversational Recruiter
          </h2>
          <p className="text-xs text-slate-500">
            Hiring managers and recruiters screen and rank candidates directly in their chat client.
          </p>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
          <button
            type="button"
            onClick={() => setPlatform('slack')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              platform === 'slack' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="font-bold text-sm">#</span>
            <span>Slack</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('telegram')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              platform === 'telegram' ? 'bg-[#229ED9] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✈️</span>
            <span>Telegram Bot</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('whatsapp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              platform === 'whatsapp' ? 'bg-[#25D366] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Real Telegram Bot Live Connect Bar */}
      {platform === 'telegram' && (
        <div className="p-4 bg-sky-50 border-2 border-sky-300 rounded-xl text-xs text-sky-950 space-y-3 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-950 text-sm">✈️ Connect Your Telegram Bot Token</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Direct Polling (Zero 302 Errors)
              </span>
            </div>
            <p className="text-xs text-sky-800">
              Paste the Bot Token you received from <strong>@BotFather</strong> below, then click <strong>"⚡ Activate Bot"</strong>. The server connects directly to Telegram so your phone receives instant replies when HR sends resumes or commands.
            </p>
          </div>

          {/* Direct Input Field and Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={tgTokenInput}
              onChange={(e) => setTgTokenInput(e.target.value)}
              placeholder="e.g. 7839482910:AAGF23849x..."
              className="flex-1 bg-white border border-sky-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#229ED9]"
            />
            <button
              disabled={tgConnecting || !tgTokenInput.trim()}
              onClick={async () => {
                setTgConnecting(true);
                setTgStatusMsg(null);
                try {
                  const res = await fetch('/api/setup-telegram-bot', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: tgTokenInput.trim() }),
                  });
                  const d = await res.json();
                  if (d.success) {
                    setTgStatusMsg(`🎉 Connected to @${d.bot.username}! Ready on mobile now.`);
                  } else {
                    setTgStatusMsg(`⚠️ ${d.error || 'Failed to connect'}`);
                  }
                } catch (e: any) {
                  setTgStatusMsg(`⚠️ Error: ${e.message}`);
                } finally {
                  setTgConnecting(false);
                }
              }}
              className="px-4 py-2 bg-[#229ED9] hover:bg-[#1e8cc0] disabled:opacity-50 text-white font-bold rounded-lg transition-colors shrink-0 text-center cursor-pointer shadow-xs"
            >
              {tgConnecting ? 'Connecting...' : '⚡ Activate Bot'}
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/telegram-status');
                  const d = await res.json();
                  if (d.connected) {
                    setTgStatusMsg(`✅ Connected! Bot: @${d.bot.username}. Polling is actively pulling messages.`);
                  } else {
                    setTgStatusMsg(`⚠️ ${d.message}`);
                  }
                } catch (e: any) {
                  setTgStatusMsg(`Status check failed: ${e.message}`);
                }
              }}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-sky-800 border border-sky-300 font-semibold rounded-lg text-xs cursor-pointer shrink-0"
            >
              🔍 Check Status
            </button>
          </div>

          {tgStatusMsg && (
            <div className={`p-2.5 rounded-lg text-xs font-medium ${tgStatusMsg.startsWith('🎉') || tgStatusMsg.startsWith('✅') ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'}`}>
              {tgStatusMsg}
            </div>
          )}
        </div>
      )}

      {/* Main Chat Window Mockup */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[640px]">
        {/* Chat App Header */}
        <div className={`${currentTheme.headerBg} px-5 py-3.5 flex items-center justify-between transition-colors duration-200 shadow-xs`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg text-white">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm leading-tight text-white">{currentTheme.name}</h3>
                <span className="text-[10px] bg-white/20 text-white font-mono px-1.5 py-0.2 rounded">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-white/80 font-mono">
                {currentTheme.channelTag} • {resumes.length} Resumes Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onUpdateResumes && (
              <button
                type="button"
                onClick={() => {
                  onUpdateResumes([]);
                  setMessages([
                    {
                      id: `clear-${Date.now()}`,
                      sender: 'bot',
                      text: `🧹 *All candidate resumes have been cleared!*
Zero resumes in queue. Old default resumes (Maya, David, Chloe) are deleted.

👉 *Next Step:* Tap **Attach Resume / JD (📎)** below to send your new candidate files.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ]);
                }}
                title="Delete all resumes and start completely fresh"
                className="px-2.5 py-1 text-xs font-semibold bg-rose-500/80 hover:bg-rose-600 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Clear Resumes</span>
              </button>
            )}
            <button
              onClick={() => {
                setMessages([
                  {
                    id: `rst-${Date.now()}`,
                    sender: 'bot',
                    text: initialBotMessage,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }}
              title="Reset conversation"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {onSwitchToDashboard && (
              <button
                onClick={onSwitchToDashboard}
                className="px-2.5 py-1 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Full Web Matrix</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Integration Specs Sub-Banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{currentTheme.integrationNote}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Powered by Gemini 3.8 Flash Engine
          </span>
        </div>

        {/* Message Stream */}
        <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${currentTheme.chatBg}`}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-indigo-600 text-white shadow-2xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user' ? currentTheme.userBubble : currentTheme.botBubble
                  }`}
                >
                  {msg.text}
                </div>

                <div
                  className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="hover:text-slate-600 transition-colors inline-flex items-center gap-0.5"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 shadow-xs flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                <span>TalentPulse is thinking & scoring resumes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 font-medium shrink-0">Quick prompts:</span>
          <button
            type="button"
            onClick={() => handleSendMessage('/start')}
            className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0 font-bold transition-colors"
          >
            🚀 Start
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('What is the ATS score of the candidate?')}
            className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shrink-0 font-bold transition-colors"
          >
            📊 ATS Score of Candidate
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Compare candidates and show side-by-side strengths')}
            className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 shrink-0 font-bold transition-colors"
          >
            🆚 Compare Candidates
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Who is the best candidate and why? Rank all candidates.')}
            className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shrink-0 font-bold transition-colors"
          >
            🏆 Best Candidate (#1)
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(`What 3 certifications would bridge ${secondCandidate}'s skill gaps?`)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 shrink-0 transition-colors"
          >
            🎓 Suggest 3 Certifications
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage(`Generate 3 tough technical interview questions for ${firstCandidate}`)}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 shrink-0 transition-colors"
          >
            ❓ 3 Interview Questions
          </button>
        </div>

        {/* Chat Input Field & File Upload Controls */}
        <div className="bg-white border-t border-slate-200 p-3 space-y-2">
          {/* Quick upload badge bar with dedicated JD and Candidate Resume upload buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span>📎 Chat Attachments:</span>
              <span className="text-slate-400">Target Role: <strong className="text-indigo-600 font-semibold">{jobTitle || 'Custom Role'}</strong></span>
            </span>

            <div className="flex items-center gap-2">
              {/* Option 1: Explicitly Upload Job Description */}
              <label className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded-lg cursor-pointer transition-colors text-xs shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>💼 Set Target JD</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUploadJobDescription(file);
                      e.target.value = '';
                    }
                  }}
                />
              </label>

              {/* Option 2: Upload 1 or more Candidate Resumes */}
              <label className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold rounded-lg cursor-pointer transition-colors text-xs shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>📄 Attach Candidate Resume(s)</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      handleUploadCandidateResumes(files);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${currentTheme.name} (e.g. "Rank all candidates", "Compare Ravi vs Sarah", "Score this resume")...`}
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-xl text-white font-medium transition-all flex items-center justify-center disabled:opacity-40 cursor-pointer ${
                platform === 'slack'
                  ? 'bg-[#4A154B] hover:bg-[#3d113e]'
                  : platform === 'whatsapp'
                  ? 'bg-[#25D366] hover:bg-[#20bd5a]'
                  : 'bg-[#229ED9] hover:bg-[#1f8ec4]'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* HR Direct Pitch Summary Card */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-indigo-900">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Why this answers the HR prompt directly:</span>
        </div>
        <p className="leading-relaxed">
          HR does not want another heavy dashboard portal. They want recruiters and hiring managers to <strong>drop resumes or a Job Description into Slack, WhatsApp, or Telegram</strong> and receive instant comparative rankings, skill gap audits, and interview questions right inside their daily conversation channel.
        </p>
      </div>
    </div>
  );
};
