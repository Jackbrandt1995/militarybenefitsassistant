'use client';

import { useState, useEffect } from 'react';
import type { FieldDef, FormDefinition, FormStepDef } from '@/lib/forms/types';
import { useFormWizard } from '@/hooks/useFormWizard';
import { useAutoFill } from '@/hooks/useAutoFill';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/components/AuthProvider';
import { saveFormAnswersToProfile } from '@/lib/profile/saveToProfile';
import { cacheFormFiles, getFormFiles } from '@/lib/fileCache';
import FormStep from '@/components/FormStep';
import DocumentUploader from '@/components/DocumentUploader';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface FormWizardProps {
  form: FormDefinition;
}

const UPLOAD_STEP_IDS = ['requiredDocs', 'optionalDocs', 'attachments'];

/** True when a field has no condition, or its condition is currently met. */
function isConditionMet(field: FieldDef, answers: Record<string, string | boolean>): boolean {
  return !field.condition || answers[field.condition.field] === field.condition.value;
}

/**
 * Validate one step against the current answers. Skips fields whose condition
 * is unmet — they are hidden, so an error on them could never be seen or
 * fixed. Also checks SSN / phone / email formats so malformed values don't
 * reach the generated federal form.
 */
function getStepErrors(step: FormStepDef, answers: Record<string, string | boolean>): Record<string, string> {
  const stepErrors: Record<string, string> = {};
  for (const field of step.fields) {
    if (!isConditionMet(field, answers)) continue;
    const value = answers[field.id];
    const isEmpty = value === undefined || value === null || value === '' || value === false;
    if (field.required && isEmpty) {
      stepErrors[field.id] = `${field.label} is required`;
      continue;
    }
    if (isEmpty || typeof value !== 'string') continue;
    if (field.type === 'ssn' && value.replace(/\D/g, '').length !== 9) {
      stepErrors[field.id] = 'Enter your full 9-digit Social Security number';
    } else if (field.type === 'phone' && value.replace(/\D/g, '').length !== 10) {
      stepErrors[field.id] = 'Enter a full 10-digit phone number, including area code';
    } else if (field.type === 'email' && !/.+@.+\..+/.test(value)) {
      stepErrors[field.id] = 'Enter a valid email address, like name@example.com';
    }
  }
  return stepErrors;
}

/** Scroll to and focus the first errored field so a failed Continue is never silent. */
function focusFirstError(step: FormStepDef, stepErrors: Record<string, string>) {
  const firstField = step.fields.find(f => stepErrors[f.id]);
  if (!firstField) return;
  // Defer so React can render the (possibly newly shown) step first.
  setTimeout(() => {
    const el = document.getElementById(firstField.id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus({ preventScroll: true });
  }, 50);
}

export default function FormWizard({ form }: FormWizardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { preFilledAnswers, filledCount, totalCount, percentage } = useAutoFill(form, profile);
  const preFilledFields = new Set(Object.keys(preFilledAnswers));
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Rehydrate from the module cache so files survive wizard → review → "Edit"
  // round-trips (the Edit links navigate back with ?step=). On fresh visits we
  // start clean so files cached for a different form can't leak in.
  const [attachedFiles, setAttachedFiles] = useState<File[]>(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('step')) {
      return getFormFiles();
    }
    return [];
  });
  const [uploadError, setUploadError] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [stepNotice, setStepNotice] = useState('');

  const {
    currentStep,
    totalSteps,
    answers,
    errors,
    setAnswer,
    goBack,
    goToStep,
    isFirstStep,
    isLastStep,
  } = useFormWizard(form, preFilledAnswers);

  const stepDef = form.steps[currentStep];

  // Honor ?step= deep-links from the review page's "Edit" buttons (once, on mount).
  useEffect(() => {
    const stepParam = new URLSearchParams(window.location.search).get('step');
    if (stepParam !== null) {
      const idx = parseInt(stepParam, 10);
      if (!Number.isNaN(idx)) goToStep(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the module cache in sync so attachments aren't silently dropped when
  // the wizard remounts (e.g. after editing answers from the review page).
  useEffect(() => {
    cacheFormFiles(attachedFiles);
  }, [attachedFiles]);

  // Voided check is required whenever the user has entered routing or account number
  const voidedCheckRequired =
    !!(answers.routingNumber && String(answers.routingNumber).replace(/\D/g, '').length > 0) ||
    !!(answers.accountNumber && String(answers.accountNumber).replace(/\D/g, '').length > 0);

  const isUploadStep = UPLOAD_STEP_IDS.includes(stepDef.id);

  function handleAnswer(fieldId: string, value: string | boolean) {
    setAnswer(fieldId, value);
    setLocalErrors(prev => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  /**
   * A step is "done" when its data is actually complete — every required
   * field (whose condition is met) has an answer — not merely because the
   * user is past it in the sequence.
   */
  function isStepComplete(step: FormStepDef, idx: number): boolean {
    if (UPLOAD_STEP_IDS.includes(step.id)) {
      // Upload steps have no field data; count them done once files are
      // attached (when uploads are required) or once the user has moved past.
      const needsFiles = (step.requiredAttachments?.length ?? 0) > 0 || voidedCheckRequired;
      return needsFiles ? attachedFiles.length > 0 : idx < currentStep;
    }
    if (step.fields.length === 0) return idx < currentStep;
    // All-optional steps would be vacuously "complete" before the user ever
    // saw them — fall back to position for those.
    if (!step.fields.some(f => f.required && isConditionMet(f, answers))) return idx < currentStep;
    return step.fields.every(f => {
      if (!f.required || !isConditionMet(f, answers)) return true;
      const v = answers[f.id];
      return v !== undefined && v !== null && v !== '' && v !== false;
    });
  }

  async function handleNext() {
    // Validate the current step, skipping hidden conditional fields (their
    // error text could never render, which used to leave users stuck).
    const stepErrors = getStepErrors(stepDef, answers);
    if (Object.keys(stepErrors).length > 0) {
      setLocalErrors(prev => ({ ...prev, ...stepErrors }));
      focusFirstError(stepDef, stepErrors);
      return;
    }

    // If banking info was entered, require at least one file on every upload step
    if (isUploadStep && voidedCheckRequired && attachedFiles.length === 0) {
      setUploadError(
        'You entered routing and account numbers, so a voided check or bank deposit slip is required. Please upload one before continuing.'
      );
      return;
    }
    setUploadError('');
    setStepNotice('');

    if (isLastStep) {
      // Users can jump to any step via the sidebar without validation, so
      // before review re-check every step and send the user to the first one
      // with missing or invalid required fields — with visible errors.
      for (let i = 0; i < form.steps.length; i++) {
        const gateErrors = getStepErrors(form.steps[i], answers);
        if (Object.keys(gateErrors).length > 0) {
          setLocalErrors(prev => ({ ...prev, ...gateErrors }));
          setStepNotice(
            `Please finish the required fields in "${form.steps[i].title}" before reviewing your answers.`
          );
          goToStep(i);
          focusFirstError(form.steps[i], gateErrors);
          return;
        }
      }

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

      // Build final answers, applying any form-specific computed fields
      const finalAnswers = { ...answers };

      // Drop answers for conditional fields that are no longer visible so
      // stale values (e.g. insurance details entered before switching the
      // controlling answer to "No") never reach the generated PDF.
      for (const s of form.steps) {
        for (const f of s.fields) {
          if (!isConditionMet(f, finalAnswers)) delete finalAnswers[f.id];
        }
      }

      // NOTE: Removed the phone "None" auto-checkbox injection. These VA forms have
      // no "I have no telephone number" checkbox; the guessed draw-check coordinates
      // drew a stray black square over real content (the 1990 "6A" label, 1990e's
      // instructions text, 28-1900's SSN field, 5495's email line) whenever a phone
      // was left blank. A blank phone now simply renders blank, which is correct.

      // sessionStorage (NOT localStorage): the draft carries sensitive answers
      // (SSN, bank, VA#, DOB) between the wizard → review → complete pages. Using
      // sessionStorage scopes it to the tab session so an abandoned form can't be
      // harvested later from a shared machine or by an infostealer.
      sessionStorage.setItem(`form-wizard-${form.id}`, JSON.stringify({ answers: finalAnswers }));
      router.push(`/forms/${form.id}/review`);
    } else {
      // This step was just validated above, so advance directly.
      goToStep(currentStep + 1);
    }
  }

  function handleStepClick(idx: number) {
    setStepNotice('');
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
                const isDone = isStepComplete(step, i);
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
                        {isDone && !isActive ? (
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
              aria-expanded={sidebarOpen}
              aria-controls="wizard-mobile-sections"
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
            <div id="wizard-mobile-sections" className="lg:hidden mb-4 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {form.steps.map((step, i) => {
                const isDone = isStepComplete(step, i);
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
                      {isDone && !isActive ? '✓' : i + 1}
                    </span>
                    {step.title}
                  </button>
                );
              })}
            </div>
          )}

          {/* Incomplete-step notice (shown after being redirected from review) */}
          {stepNotice && (
            <div role="alert" className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-800 font-medium">{stepNotice}</p>
            </div>
          )}

          {/* Step card — a real <form> so Enter advances like users expect */}
          <form
            noValidate
            onSubmit={e => {
              e.preventDefault();
              void handleNext();
            }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >

            {isUploadStep ? (
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

                {/* Voided check — injected as required when banking info is present */}
                {voidedCheckRequired && (
                  <div className="rounded-lg border border-red-300 bg-red-50 p-4 space-y-1">
                    <p className="text-sm font-semibold text-red-900 flex items-center gap-1.5">
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Required: Upload a voided check or bank deposit slip
                    </p>
                    <p className="text-sm text-red-800">
                      Because you entered routing and account numbers, VA requires a voided check or bank deposit slip to verify your direct deposit information. Write &quot;VOID&quot; in large letters across a blank check, or use a pre-printed deposit slip.
                    </p>
                  </div>
                )}

                {/* Upload error message */}
                {uploadError && (
                  <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-800 font-medium">{uploadError}</p>
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
                            type="button"
                            onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            aria-label={`Remove ${f.name}`}
                            className="ml-auto text-red-400 hover:text-red-600 text-xs"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <DocumentUploader
                    onFilesSelected={newFiles => {
                      setAttachedFiles(prev => {
                        const map = new Map(prev.map(f => [f.name, f]));
                        newFiles.forEach(f => map.set(f.name, f));
                        return Array.from(map.values());
                      });
                      if (newFiles.length > 0) setUploadError('');
                    }}
                  />
                </div>
              </div>
            ) : (
              /* ── Regular step ───────────────────────────────────────────── */
              <FormStep
                step={stepDef}
                answers={answers}
                errors={{ ...errors, ...localErrors }}
                preFilledFields={preFilledFields}
                onAnswer={handleAnswer}
              />
            )}

            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={goBack} disabled={isFirstStep}>
                ← Back
              </Button>
              <div className="text-xs text-gray-400">
                {currentStep + 1} / {totalSteps}
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : isLastStep ? 'Review Answers →' : 'Continue →'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
