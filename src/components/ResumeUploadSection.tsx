import React, { useRef, useState } from 'react';
import { 
  Files, 
  Upload, 
  FileText, 
  Trash2, 
  Eye, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { ResumeInput } from '../types/recruitment';

interface ResumeUploadSectionProps {
  resumes: ResumeInput[];
  setResumes: React.Dispatch<React.SetStateAction<ResumeInput[]>>;
  onAnalyze: () => void;
  onBackToJob: () => void;
  onLoadSampleResumes: () => void;
  isAnalyzing: boolean;
}

export const ResumeUploadSection: React.FC<ResumeUploadSectionProps> = ({
  resumes,
  setResumes,
  onAnalyze,
  onBackToJob,
  onLoadSampleResumes,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewResume, setPreviewResume] = useState<ResumeInput | null>(null);
  const [showManualAddModal, setShowManualAddModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualContent, setManualContent] = useState('');

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (resumes.length + files.length > 10) {
      setErrorMessage('You can upload a maximum of 10 resumes for comparison.');
      return;
    }

    setIsProcessingFile(true);
    setErrorMessage(null);

    const newResumes: ResumeInput[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const fileType = (ext === 'pdf' ? 'pdf' : ext === 'docx' ? 'docx' : 'txt') as 'pdf' | 'docx' | 'txt';

      const guessedName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/[_-]/g, ' ')
        .replace(/resume/gi, '')
        .replace(/cv/gi, '')
        .trim();

      try {
        if (fileType === 'txt') {
          const text = await file.text();
          newResumes.push({
            id: `resume-${Date.now()}-${i}`,
            fileName: file.name,
            candidateName: guessedName || `Candidate ${resumes.length + i + 1}`,
            fileType,
            rawText: text,
            fileSize: file.size,
          });
        } else {
          // Send base64 to server to extract text via mammoth or Gemini PDF engine
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = (reader.result as string).split(',')[1];
              resolve(res);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const resp = await fetch('/api/extract-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileType,
              base64Data,
            }),
          });

          if (!resp.ok) {
            const errData = await resp.json();
            throw new Error(errData.details || `Failed to extract text from ${file.name}`);
          }

          const result = await resp.json();
          newResumes.push({
            id: `resume-${Date.now()}-${i}`,
            fileName: file.name,
            candidateName: guessedName || `Candidate ${resumes.length + i + 1}`,
            fileType,
            rawText: result.extractedText,
            fileSize: file.size,
          });
        }
      } catch (err: any) {
        console.error(`Error processing file ${file.name}:`, err);
        setErrorMessage(`Could not parse ${file.name}: ${err.message}`);
      }
    }

    if (newResumes.length > 0) {
      setResumes((prev) => [...prev, ...newResumes]);
    }

    setIsProcessingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddManualResume = () => {
    if (!manualContent.trim()) return;

    const newResume: ResumeInput = {
      id: `manual-resume-${Date.now()}`,
      fileName: `${manualName.trim() || 'Candidate'}_Resume.txt`,
      candidateName: manualName.trim() || `Candidate ${resumes.length + 1}`,
      fileType: 'txt',
      rawText: manualContent.trim(),
      fileSize: manualContent.length,
    };

    setResumes((prev) => [...prev, newResume]);
    setManualName('');
    setManualContent('');
    setShowManualAddModal(false);
  };

  const updateCandidateName = (id: string, newName: string) => {
    setResumes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, candidateName: newName } : r))
    );
  };

  const hasMinimumResumes = resumes.length >= 1;
  const isOptimalComparison = resumes.length >= 2;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">Upload Candidate Resumes</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload 2 to 10 resumes (PDF, DOCX, TXT) to compare skills, experience, and calculate ATS scores.
          </p>
        </div>

        {/* Counter & Sample Loader */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-md text-xs font-medium text-indigo-700">
            {resumes.length} of 10 Candidates Loaded
          </div>
          <button
            type="button"
            onClick={onLoadSampleResumes}
            className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
            title="Populate 3 diverse pre-built resumes"
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Load 3 Sample Resumes</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {errorMessage && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drag & Drop Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-xl p-8 text-center cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            multiple
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            {isProcessingFile ? 'Parsing document contents with AI...' : 'Click or drag resumes here'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
            Supports PDF, DOCX, and Plain Text files. Upload up to 10 resumes for side-by-side ATS comparison.
          </p>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            <Files className="w-3.5 h-3.5" /> PDF / Word (.docx) / Text (.txt)
          </div>
        </div>

        {/* Extra Action Buttons */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Need to paste resume text directly?</span>
          <button
            type="button"
            onClick={() => setShowManualAddModal(true)}
            className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Paste / Manual Add Resume</span>
          </button>
        </div>

        {/* Uploaded Resumes List */}
        {resumes.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Uploaded Resumes ({resumes.length})
              </h4>
              {resumes.length > 1 && (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Multi-candidate comparison enabled
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resumes.map((resume, idx) => (
                <div
                  key={resume.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0 text-xs font-bold">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={resume.candidateName || ''}
                          onChange={(e) => updateCandidateName(resume.id, e.target.value)}
                          placeholder="Candidate Name"
                          className="text-sm font-semibold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1 -mx-1 py-0.5 rounded focus:outline-none transition-all truncate w-full"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="px-1.5 py-0.5 uppercase text-[10px] font-bold bg-slate-200 text-slate-700 rounded">
                          {resume.fileType}
                        </span>
                        <span className="truncate max-w-[140px]" title={resume.fileName}>
                          {resume.fileName}
                        </span>
                        <span>•</span>
                        <span>{Math.round(resume.rawText.length / 5)} words</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewResume(resume)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Preview extracted resume text"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveResume(resume.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Remove candidate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500">No resumes added yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Upload at least 1 resume, or click &ldquo;Load 3 Sample Resumes&rdquo; above to test instantly.
            </p>
          </div>
        )}

        {/* Footer Navigation & Submit */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onBackToJob}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Description</span>
          </button>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={!hasMinimumResumes || isAnalyzing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/20"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Screening {resumes.length} Candidate{resumes.length > 1 ? 's' : ''}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>
                  Analyze &amp; Rank {resumes.length} Candidate{resumes.length > 1 ? 's' : ''}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Resume Add Modal */}
      {showManualAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Paste Candidate Resume</h3>
              <button
                onClick={() => setShowManualAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Resume Content / Plain Text
              </label>
              <textarea
                rows={8}
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                placeholder="Paste experience, skills, education, projects, certifications..."
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowManualAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddManualResume}
                disabled={!manualContent.trim()}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {previewResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {previewResume.candidateName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">{previewResume.fileName}</p>
              </div>
              <button
                onClick={() => setPreviewResume(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 flex-1">
              {previewResume.rawText}
            </div>
            <div className="p-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewResume(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
