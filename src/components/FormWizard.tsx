'use client';

import { useState } from 'react';
import type { FormDefinition } from '@/lib/forms/types';
import { useFormWizard } from '@/hooks/useFormWizard';
import { useAutoFill } from '@/hooks/useAutoFill';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/components/AuthProvider';
import { saveFormAnswersToProfile } from '@/lib/profile/saveToProfile';
import { cacheFormFiles } from '@/lib/fileCache';
import FormStep from '@/components/FormStep';
import DocumentUploader from '@/components/DocumentUploader';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface FormWizardProps {
  form: FormDefinition;
}

export default function FormWizard({ form }: FormWizardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { preFilledAnswers, filledCount, totalCount, percentage } = useAutoFill(form, profile);
  const preFilledFields = new Set(Object.keys(preFilledAnswers));
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const {
    currentStep,
    totalSteps,
    answers,
    errors,
    setAnswer,
    goNext,
    goBack,
    goToStep,
    validateCurrentStep,
    isFirstStep,
    isLastStep,
  } = useFormWizard(form, preFilledAnswers);

  const stepDef = form.steps[currentStep];

  async function handleNext() {
    if (!validateCurrentStep()) return;

    if (isLastStep) {
      // Save attached files to module cache so complete/page.tsx can merge them
      cacheFormFiles(attachedFiles);

      // Save answers back to profile so other forms can pre-fill from them
      if (user) {
        setIsSaving(true);
        try {
          await saveFormAnswersToProfile(user.id, form, answers);
        } catch (e) {
          console.error('Profile save error (non-fatal):', e);
        } finally {
          setIsSaving(false);
        }
      }
      localStorage.setItem(`form-wizard-${form.id}`, JSON.stringify({ answers }));
      router.push(`/forms/${form.id}/review`);
    } else {
      goNext();
    }
  }

  function handleStepClick(idx: number) {
    goToStep(idx);
    setSidebarOpen(false);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {percentage > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{filledCount} of {totalCount}</span> fields pre-filled from your profile ({percentage}%)
          </p>
        </div>
      )}

      <div className="flex gap-6 items-start">

        {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
        <nav className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sections</p>
            </div>
            <ul>
              {form.steps.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <li key={step.id}>
                    <button
                      onClick={() => handleStepClick(i)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-start gap-2.5 transition-colors border-l-[3px] ${
                        isActive
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : isDone
                          ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100'
                          : 'border-transparent text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isDone ? (
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : i + 1}
                      </span>
                      <span className="leading-tight">{step.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Mobile top bar */}
          <div className="lg:hidden mb-4 bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Step {currentStep + 1} of {totalSteps}</p>
              <p className="text-sm font-semibold text-gray-800">{stepDef.title}</p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sm text-blue-600 font-medium flex items-center gap-1"
            >
              All sections
              <svg className={`w-4 h-4 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Mobile dropdown nav */}
          {sidebarOpen && (
            <div className="lg:hidden mb-4 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {form.steps.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(i)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 border-b border-gray-100 last:border-0 ${
                      isActive ? 'bg-blue-50 text-blue-700 font-semibold' : isDone ? 'bg-green-50 text-green-700' : 'text-gray-500'
                    }`}
                  >
                    <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-blue-600 text-white' : isDone ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isDone ? '✓' : i + 1}
                    </span>
                    {step.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Step card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

            {stepDef.id === 'attachments' ? (
              /* ── Document attachment step ───────────────────────────────── */
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{stepDef.title}</h2>
                  {stepDef.description && (
                    <p className="mt-1 text-sm text-gray-600">{stepDef.description}</p>
                  )}
                </div>

                {/* Required docs checklist */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-2">
                  <p className="text-sm font-semibold text-amber-900">Required documents (attach below)</p>
                  <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                    <li>DD Form 214 – Certificate of Release or Discharge from Active Duty (one per service period)</li>
                    <li>Voided check or bank letter – for direct deposit verification</li>
                  </ul>
                </div>

                {/* Optional docs checklist */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Optional / recommended documents</p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Notice of Basic Eligibility (NOBE) letter – required for Chapter 1606</li>
                    <li>ROTC scholarship contract or service academy commissioning document – if applicable</li>
                    <li>Official college transcripts – if you previously attended college</li>
                    <li>Marriage certificate or divorce decree – if claiming dependents</li>
                    <li>Birth certificates of dependent children – if applicable</li>
                    <li>Any prior VA conditional approval letters</li>
                  </ul>
                </div>

                {/* File uploader */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Upload files <span className="text-gray-400 font-normal">(PDF files will be merged into your downloaded form)</span>
                  </p>
                  <DocumentUploader onFilesSelected={setAttachedFiles} />
                </div>

                {attachedFiles.length > 0 && (
                  <p className="text-sm text-green-700 font-medium">
                    ✓ {attachedFiles.length} file{attachedFiles.length > 1 ? 's' : ''} ready to attach
                  </p>
                )}
              </div>
            ) : (
              /* ── Regular step ───────────────────────────────────────────── */
              <FormStep
                step={stepDef}
                answers={answers}
                errors={errors}
                preFilledFields={preFilledFields}
                onAnswer={setAnswer}
              />
            )}

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={goBack} disabled={isFirstStep}>
                ← Back
              </Button>
              <div className="text-xs text-gray-400">
                {currentStep + 1} / {totalSteps}
              </div>
              <Button onClick={handleNext} disabled={isSaving}>
                {isSaving ? 'Saving…' : isLastStep ? 'Review Answers →' : 'Continue →'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
