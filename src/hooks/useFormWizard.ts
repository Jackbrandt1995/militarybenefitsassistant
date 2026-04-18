'use client';

import { useState, useCallback, useEffect } from 'react';
import type { FormDefinition } from '@/lib/forms/types';

interface WizardState {
  currentStep: number;
  answers: Record<string, string | boolean>;
  errors: Record<string, string>;
  touched: Set<string>;
}

export function useFormWizard(form: FormDefinition | undefined, preFilledAnswers: Record<string, string | boolean> = {}) {
  const storageKey = form ? `wizard-${form.id}` : null;

  const totalStepCount = form?.steps.length ?? 0;

  const [state, setState] = useState<WizardState>(() => {
    // Try to restore from localStorage
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Invalidate cached state if the form step count has changed
          // (e.g., new steps were added to the form definition).
          if (parsed.totalStepCount && parsed.totalStepCount !== totalStepCount) {
            localStorage.removeItem(storageKey);
          } else {
            return {
              ...parsed,
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

  // Persist to localStorage on change (include totalStepCount for cache invalidation)
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      const toSave = {
        ...state,
        touched: Array.from(state.touched),
        totalStepCount,
      };
      localStorage.setItem(storageKey, JSON.stringify(toSave));
    }
  }, [state, storageKey, totalStepCount]);

  const totalSteps = totalStepCount;
  const currentStepDef = form?.steps[state.currentStep];

  const setAnswer = useCallback((fieldId: string, value: string | boolean) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [fieldId]: value },
      touched: new Set(prev.touched).add(fieldId),
      errors: { ...prev.errors, [fieldId]: '' },
    }));
  }, []);

  const validateCurrentStep = useCallback((): boolean => {
    if (!currentStepDef) return true;
    const newErrors: Record<string, string> = {};
    let valid = true;

    for (const field of currentStepDef.fields) {
      if (field.required) {
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
    if (validateCurrentStep() && state.currentStep < totalSteps - 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
      return true;
    }
    return false;
  }, [validateCurrentStep, state.currentStep, totalSteps]);

  const goBack = useCallback(() => {
    if (state.currentStep > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  }, [state.currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setState(prev => ({ ...prev, currentStep: step }));
    }
  }, [totalSteps]);

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
    currentStep: state.currentStep,
    totalSteps,
    currentStepDef,
    answers: state.answers,
    errors: state.errors,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === totalSteps - 1,
    setAnswer,
    goNext,
    goBack,
    goToStep,
    validateCurrentStep,
    clearSavedState,
    resetWizard,
  };
}
