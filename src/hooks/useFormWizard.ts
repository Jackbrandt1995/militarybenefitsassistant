'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { FieldDef, FormDefinition, FormStepDef } from '@/lib/forms/types';

/** True when a field has no condition, or its condition is currently met. */
export function isFieldConditionMet(field: FieldDef, answers: Record<string, string | boolean>): boolean {
  return !field.condition || answers[field.condition.field] === field.condition.value;
}

/**
 * True when a step has no condition, or its condition is currently met. A step
 * whose condition is unmet is treated as if it did not exist: Next/Back and the
 * sidebar skip it, validation ignores it, the review page hides it, and its
 * answers are scrubbed before the PDF is filled.
 */
export function isStepConditionMet(step: FormStepDef, answers: Record<string, string | boolean>): boolean {
  return !step.condition || answers[step.condition.field] === step.condition.value;
}

interface WizardState {
  currentStep: number;
  answers: Record<string, string | boolean>;
  errors: Record<string, string>;
  touched: Set<string>;
}

export function useFormWizard(form: FormDefinition | undefined, preFilledAnswers: Record<string, string | boolean> = {}) {
  const storageKey = form ? `wizard-${form.id}` : null;

  const totalStepCount = form?.steps.length ?? 0;
  const formVersion = form?.version ?? 1;

  // Sensitive answers (SSN, bank, anything flagged) must NEVER be written to
  // localStorage — they live only in React memory and re-populate from the
  // (decrypted) profile pre-fill each session.
  const sensitiveIds = new Set<string>();
  for (const step of form?.steps ?? []) {
    for (const f of step.fields) {
      if (f.type === 'ssn' || f.sensitive === true) sensitiveIds.add(f.id);
    }
  }
  const isSensitiveKey = (k: string) => sensitiveIds.has(k) || /ssn|routing|account|bank|vafile|filenumber/i.test(k);
  const stripSensitive = (a: Record<string, string | boolean> = {}) => {
    const out: Record<string, string | boolean> = {};
    for (const [k, v] of Object.entries(a)) if (!isSensitiveKey(k)) out[k] = v;
    return out;
  };

  const [state, setState] = useState<WizardState>(() => {
    // Try to restore from localStorage
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Invalidate cached state if the form version changed (definition was updated)
          // or if the step count changed (steps were added/removed).
          const versionMismatch = parsed.formVersion !== undefined && parsed.formVersion !== formVersion;
          const stepMismatch = parsed.totalStepCount && parsed.totalStepCount !== totalStepCount;
          if (versionMismatch || stepMismatch) {
            localStorage.removeItem(storageKey);
          } else {
            return {
              ...parsed,
              // Drop any sensitive values an older build may have persisted.
              answers: stripSensitive(parsed.answers),
              touched: new Set(parsed.touched || []),
            };
          }
        }
      } catch {
        // Ignore parse errors
      }
    }

    return {
      currentStep: 0,
      answers: { ...preFilledAnswers },
      errors: {},
      touched: new Set<string>(),
    };
  });

  // Merge pre-filled answers (only for fields not already touched by user)
  useEffect(() => {
    if (Object.keys(preFilledAnswers).length > 0) {
      setState(prev => {
        const merged = { ...preFilledAnswers };
        // User-touched fields take priority
        for (const key of prev.touched) {
          if (prev.answers[key] !== undefined) {
            merged[key] = prev.answers[key];
          }
        }
        return { ...prev, answers: { ...merged, ...Object.fromEntries(
          Array.from(prev.touched).filter(k => prev.answers[k] !== undefined).map(k => [k, prev.answers[k]])
        )}};
      });
    }
  }, [preFilledAnswers]);

  // Persist to localStorage on change (include totalStepCount + formVersion for cache invalidation)
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      const toSave = {
        ...state,
        answers: stripSensitive(state.answers),
        touched: Array.from(state.touched),
        totalStepCount,
        formVersion,
      };
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    }
  }, [state, storageKey, totalStepCount, formVersion]);

  const totalSteps = totalStepCount;

  // Absolute indices (into form.steps) of the steps whose condition is met,
  // in order. Every navigation below moves between these only, so a step
  // that does not apply (e.g. the VR&E job steps once a resume is provided)
  // is never shown. Indices stay absolute so ?step= deep-links, the review
  // page's Edit buttons and the submit-time gate keep working unchanged.
  const visibleStepIndices = useMemo(() => {
    const out: number[] = [];
    (form?.steps ?? []).forEach((step, i) => {
      if (isStepConditionMet(step, state.answers)) out.push(i);
    });
    return out;
  }, [form, state.answers]);

  // A restored draft or a stale ?step= deep-link can point at a step whose
  // condition is no longer met. Rather than storing a corrected index (which
  // would need an effect), derive the step actually shown: the stored one when
  // it applies, otherwise the next step that does (or the last one). Every
  // consumer below reads this derived value, never the raw stored index.
  const storedStep = state.currentStep;
  const currentStep = visibleStepIndices.includes(storedStep)
    ? storedStep
    : (visibleStepIndices.find(i => i > storedStep) ?? visibleStepIndices[visibleStepIndices.length - 1] ?? storedStep);
  const currentStepDef = form?.steps[currentStep];

  const firstVisibleStep = visibleStepIndices[0] ?? 0;
  const lastVisibleStep = visibleStepIndices[visibleStepIndices.length - 1] ?? totalSteps - 1;
  // 1-based position among the steps that apply, for "Step 3 of 12" labels.
  const currentStepPosition = visibleStepIndices.filter(i => i <= currentStep).length;

  const setAnswer = useCallback((fieldId: string, value: string | boolean) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [fieldId]: value },
      touched: new Set(prev.touched).add(fieldId),
      errors: { ...prev.errors, [fieldId]: '' },
    }));
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    // A step that does not apply, and fields hidden by their own condition,
    // can never show an error, so they never block the veteran.
    if (!currentStepDef || !isStepConditionMet(currentStepDef, state.answers)) return true;
    const newErrors: Record<string, string> = {};
    let valid = true;

    for (const field of currentStepDef.fields) {
      if (field.required && isFieldConditionMet(field, state.answers)) {
        const value = state.answers[field.id];
        if (value === undefined || value === null || value === '' || value === false) {
          newErrors[field.id] = `${field.label} is required`;
          valid = false;
        }
      }
    }

    setState(prev => ({ ...prev, errors: { ...prev.errors, ...newErrors } }));
    return valid;
  }, [currentStepDef, state.answers]);

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) return false;
    const next = visibleStepIndices.find(i => i > currentStep);
    if (next === undefined) return false;
    setState(prev => ({ ...prev, currentStep: next }));
    return true;
  }, [validateCurrentStep, currentStep, visibleStepIndices]);

  const goBack = useCallback(() => {
    let previous: number | undefined;
    for (const i of visibleStepIndices) {
      if (i < currentStep) previous = i;
    }
    if (previous !== undefined) {
      setState(prev => ({ ...prev, currentStep: previous }));
    }
  }, [currentStep, visibleStepIndices]);

  const goToStep = useCallback((step: number) => {
    if (step < 0 || step >= totalSteps) return;
    // A target that does not apply snaps forward to the next step that does
    // (or back to the last one), so no caller can land on a hidden step.
    const target = visibleStepIndices.includes(step)
      ? step
      : (visibleStepIndices.find(i => i > step) ?? visibleStepIndices[visibleStepIndices.length - 1] ?? step);
    setState(prev => ({ ...prev, currentStep: target }));
  }, [totalSteps, visibleStepIndices]);

  const clearSavedState = useCallback(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const resetWizard = useCallback(() => {
    clearSavedState();
    setState({
      currentStep: 0,
      answers: { ...preFilledAnswers },
      errors: {},
      touched: new Set(),
    });
  }, [clearSavedState, preFilledAnswers]);

  return {
    currentStep,
    totalSteps,
    currentStepDef,
    answers: state.answers,
    errors: state.errors,
    visibleStepIndices,
    visibleStepCount: visibleStepIndices.length,
    currentStepPosition,
    isFirstStep: currentStep <= firstVisibleStep,
    isLastStep: currentStep >= lastVisibleStep,
    setAnswer,
    goNext,
    goBack,
    goToStep,
    validateCurrentStep,
    clearSavedState,
    resetWizard,
  };
}
