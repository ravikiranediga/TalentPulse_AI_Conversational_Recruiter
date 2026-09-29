import React, { useRef, useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  Check, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { SAMPLE_JOB_PROFILES } from '../data/sampleJobProfiles';

interface JobDescriptionSectionProps {
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  onProceedToResumes: () => void;
  onLoadSample: (sampleId: string) => void;
}

export const JobDescriptionSection: React.FC<JobDescriptionSectionProps> = ({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  onProceedToResumes,
  onLoadSample,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      if (file.name.endsWith('.txt') || file.type.includes('text')) {
        const text = await file.text();
        setJobDescription(text);
        if (!jobTitle) {
          const guessedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
          setJobTitle(guessedTitle);
        }
      } else {
        // Send to backend extract-text endpoint for docx/pdf
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64String = (reader.result as string).split(',')[1];
            const fileType = file.name.endsWith('.docx') ? 'docx' : 'pdf';

            const resp = await fetch('/api/extract-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileName: file.name,
                fileType,
                base64Data: base64String,
              }),
            });

            if (!resp.ok) {
              const err = await resp.json();
              throw new Error(err.details || err.error || 'Failed to extract file text');
            }

            const data = await resp.json();
            setJobDescription(data.extractedText);
            if (!jobTitle) {
              setJobTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
            }
          } catch (err: any) {
            setUploadError(err.message || 'Error processing document');
          } finally {
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
        return;
      }
    } catch (err: any) {
      setUploadError(err.message || 'Error reading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const isReady = jobDescription.trim().length > 50;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Header */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-base font-bold text-slate-900">Define Job Description</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Paste your Job Spec, upload a document (PDF/DOCX/TXT), or select a pre-populated recruiter preset.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden lg:inline">Quick Samples:</span>
          {SAMPLE_JOB_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onLoadSample(profile.id)}
              className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{profile.id === 'fullstack-ai-engineer' ? 'Full-Stack SWE' : 'AI Product Mgr'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Job Title and Upload Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Title / Target Role <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack AI Engineer, Technical Product Manager..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 font-medium"
              />
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Import Job Spec (JD)</span>
              <span className="text-[10px] text-indigo-600 font-normal normal-case">PDF / Word</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-lg text-indigo-800 transition-colors cursor-pointer disabled:opacity-50"
              title="Upload a company Job Description document (PDF/Word/TXT) to auto-fill requirements"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>{isUploading ? 'Extracting JD text...' : 'Upload Job Spec / JD'}</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Job Requirements &amp; Responsibilities <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {wordCount} words | {jobDescription.length} characters
            </span>
          </div>
          <textarea
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste complete Job Description here... Include role overview, required technical skills, years of experience, responsibilities, education requirements, and preferred qualifications."
            className="w-full p-4 text-sm font-mono leading-relaxed bg-slate-50/30 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400 resize-y"
          />
        </div>

        {/* Action Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            {isReady ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <Check className="w-4 h-4" /> Ready for candidate screening
              </span>
            ) : (
              <span className="text-slate-400">
                Please enter at least 50 characters of job specifications.
              </span>
            )}
          </div>

          <button
            onClick={onProceedToResumes}
            disabled={!isReady}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-600/20"
          >
            <span>Proceed to Step 2: Upload Resumes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
