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

      // Before submitting, verify all required fields in the signature step are filled.
      // Users can bypass step validation via sidebar navigation, so we gate here.
      // Also check any 'privacyAct' step (present on some forms) for the same reason.
      for (const gateStepId of ['privacyAct', 'signature']) {
        const gateIdx = form.steps.findIndex(s => s.id === gateStepId);
        if (gateIdx !== -1) {
          const gateStep = form.steps[gateIdx];
          const missing = gateStep.fields.filter(f => {
            if (!f.required) return false;
            const val = answers[f.id];
            return val === undefined || val === null || val === '' || val === false;
          });
          if (missing.length > 0) {
            goToStep(gateIdx);
            return; // Force user to complete this step first
          }
        }
      }

      // Build final answers, applying any form-specific computed fields
      const finalAnswers = { ...answers };

      // VA 22-1990: auto-check the "None" telephone checkbox when both phone
      // fields were left blank, as required by the PDF form instructions.
      if (form.id === 'va-22-1990') {
        const primaryDigits  = String(finalAnswers.phonePrimary  || '').replace(/\D/g, '');
        const secondaryDigits = String(finalAnswers.phoneSecondary || '').replace(/\D/g, '');
        if (primaryDigits.length === 0 && secondaryDigits.length === 0) {
          finalAnswers.phoneNone = 'true';
        } else {
          delete finalAnswers.phoneNone;
        }
      }

      // Per-form phone "None" injection — checked independently per phone row
      // when that specific phone field is left blank.
      const dualPhoneFormConfigs: Record<string, [string, string, string, string]> = {
        'va-28-1900':  ['mainPhone',      'cellPhone',       'mainPhoneNone',       'cellPhoneNone'],
        'va-22-0803':  ['homePhone',      'mobilePhone',     'homePhoneNone',       'mobilePhoneNone'],
        'va-22-0810':  ['daytimePhone',   'eveningPhone',    'daytimePhoneNone',    'eveningPhoneNone'],
        'va-22-1990e': ['homePhone',      'mobilePhone',     'homePhoneNone',       'mobilePhoneNone'],
        'va-22-1995':  ['homePhone',      'mobilePhone',     'homePhoneNone',       'mobilePhoneNone'],
        'va-22-5490':  ['homePhone',      'mobilePhone',     'homePhoneNone',       'mobilePhoneNone'],
        'va-22-5495':  ['primaryPhone',   'secondaryPhone',  'primaryPhoneNone',    'secondaryPhoneNone'],
      };
      const phoneConfig = dualPhoneFormConfigs[form.id];
      if (phoneConfig) {
        const [phone1Field, phone2Field, none1Key, none2Key] = phoneConfig;
        const digits1 = String(finalAnswers[phone1Field] || '').replace(/\D/g, '');
        const digits2 = String(finalAnswers[phone2Field] || '').replace(/\D/g, '');
        if (digits1.length === 0) { finalAnswers[none1Key] = 'true'; } else { delete finalAnswers[none1Key]; }
        if (digits2.length === 0) { finalAnswers[none2Key] = 'true'; } else { delete finalAnswers[none2Key]; }
      }

      localStorage.setItem(`form-wizard-${form.id}`, JSON.stringify({ answers: finalAnswers }));
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

            {['attachments', 'requiredDocs', 'optionalDocs'].includes(stepDef.id) ? (
              /* ── Document upload steps ──────────────────────────────────── */
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{stepDef.title}</h2>
                  {stepDef.description && (
                    <p className="mt-1 text-sm text-gray-600">{stepDef.description}</p>
                  )}
                </div>

                {/* Required attachments — shown on requiredDocs step */}
                {stepDef.id === 'requiredDocs' && stepDef.requiredAttachments && stepDef.requiredAttachments.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Upload each document listed below — these are required
                    </p>
                    <ul className="space-y-3">
                      {stepDef.requiredAttachments.map((att, i) => (
                        <li key={i} className="text-sm text-amber-900">
                          <p className="font-semibold">↑ Upload: {att.label}</p>
                          {att.condition && (
                            <p className="text-amber-700 mt-0.5 text-xs">Applies when: {att.condition}</p>
                          )}
                          {att.helpText && (
                            <p className="text-amber-700 mt-0.5 text-xs">{att.helpText}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Optional attachments — shown on optionalDocs step */}
                {stepDef.id === 'optionalDocs' && stepDef.optionalAttachments && stepDef.optionalAttachments.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">These documents are optional — upload if you have them</p>
                    <ul className="space-y-3">
                      {stepDef.optionalAttachments.map((att, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          <p className="font-medium">↑ Upload (optional): {att.label}</p>
                          {att.condition && (
                            <p className="text-gray-500 mt-0.5 text-xs">Applies when: {att.condition}</p>
                          )}
                          {att.helpText && (
                            <p className="text-gray-500 mt-0.5 text-xs">{att.helpText}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Legacy attachments step — show both lists */}
                {stepDef.id === 'attachments' && stepDef.requiredAttachments && stepDef.requiredAttachments.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-amber-900">Required documents — upload below</p>
                    <ul className="space-y-2">
                      {stepDef.requiredAttachments.map((att, i) => (
                        <li key={i} className="text-sm text-amber-900">
                          <span className="font-medium">{att.label}</span>
                          {att.condition && <span className="text-amber-700 ml-1">({att.condition})</span>}
                          {att.helpText && <p className="text-amber-700 mt-0.5">{att.helpText}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {stepDef.id === 'attachments' && stepDef.optionalAttachments && stepDef.optionalAttachments.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Optional documents</p>
                    <ul className="space-y-2">
                      {stepDef.optionalAttachments.map((att, i) => (
                        <li key={i} className="text-sm text-gray-700">
                          <span className="font-medium">{att.label}</span>
                          {att.condition && <span className="text-gray-500 ml-1">({att.condition})</span>}
                          {att.helpText && <p className="text-gray-500 mt-0.5">{att.helpText}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* File uploader — additive across both upload steps */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {attachedFiles.length > 0
                      ? `${attachedFiles.length} file${attachedFiles.length !== 1 ? 's' : ''} uploaded — add more or continue`
                      : 'Upload files'}
                  </p>
                  {attachedFiles.length > 0 && (
                    <ul className="mb-3 space-y-1">
                      {attachedFiles.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded px-3 py-1.5">
                          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {f.name}
                          <button
                            onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="ml-auto text-red-400 hover:text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <DocumentUploader
                    onFilesSelected={newFiles =>
                      setAttachedFiles(prev => {
                        const map = new Map(prev.map(f => [f.name, f]));
                        newFiles.forEach(f => map.set(f.name, f));
                        return Array.from(map.values());
                      })
                    }
                  />
                </div>
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
