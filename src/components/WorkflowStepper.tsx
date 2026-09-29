import React from 'react';
import { FileText, Files, Cpu, Award, CheckCircle2 } from 'lucide-react';

interface WorkflowStepperProps {
  currentStep: number; // 1, 2, 3, 4
  onStepClick?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  onStepClick,
  canNavigateToStep,
}) => {
  const steps = [
    {
      number: 1,
      title: 'Job Description',
      subtitle: 'Define role requirements',
      icon: FileText,
    },
    {
      number: 2,
      title: 'Upload Resumes',
      subtitle: 'Compare 2–10 candidates (PDF/DOCX)',
      icon: Files,
    },
    {
      number: 3,
      title: 'AI ATS Screening',
      subtitle: 'Parse & score metrics',
      icon: Cpu,
    },
    {
      number: 4,
      title: 'Rankings & Decision',
      subtitle: 'Dossiers, gaps & report',
      icon: Award,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress">
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const isClickable = canNavigateToStep ? canNavigateToStep(step.number) : false;

              return (
                <li
                  key={step.number}
                  onClick={() => {
                    if (isClickable && onStepClick) {
                      onStepClick(step.number);
                    }
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                    isClickable ? 'cursor-pointer hover:border-slate-300' : 'cursor-default'
                  } ${
                    isCurrent
                      ? 'bg-indigo-50/60 border-indigo-300 ring-1 ring-indigo-500/20'
                      : isCompleted
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-white border-slate-200/60 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Step {step.number}
                    </p>
                    <p
                      className={`text-sm font-semibold truncate ${
                        isCurrent ? 'text-indigo-950' : 'text-slate-800'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
