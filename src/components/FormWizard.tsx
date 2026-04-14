'use client';

import type { FormDefinition } from '@/lib/forms/types';
import { useFormWizard } from '@/hooks/useFormWizard';
import { useAutoFill } from '@/hooks/useAutoFill';
import { useProfile } from '@/hooks/useProfile';
import FormStep from '@/components/FormStep';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface FormWizardProps {
  form: FormDefinition;
}

export default function FormWizard({ form }: FormWizardProps) {
  const router = useRouter();
  const { profile } = useProfile();
  const { preFilledAnswers, filledCount, totalCount, percentage } = useAutoFill(form, profile);
  const preFilledFields = new Set(Object.keys(preFilledAnswers));
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
  const stepLabels = form.steps.map((s) => s.title);

  function handleNext() {
    if (!validateCurrentStep()) return;
    if (isLastStep) {
      // Save answers to localStorage for review page
      localStorage.setItem(`form-wizard-${form.id}`, JSON.stringify({ answers }));
      router.push(`/forms/${form.id}/review`);
    } else {
      goNext();
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {percentage > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{filledCount} of {totalCount}</span> fields pre-filled from your profile ({percentage}%)
          </p>
        </div>
      )}

      <ProgressBar stepLabels={stepLabels} currentStep={currentStep} totalSteps={totalSteps} />

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <FormStep
          step={stepDef}
          answers={answers}
          errors={errors}
          preFilledFields={preFilledFields}
          onAnswer={setAnswer}
        />

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button variant="outline" onClick={goBack} disabled={isFirstStep}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {isLastStep ? 'Review Answers' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
