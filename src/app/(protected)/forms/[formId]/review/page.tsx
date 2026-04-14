'use client';

import { use, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getFormById } from '@/lib/forms/registry';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';

export default function ReviewPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const form = getFormById(formId);
  const router = useRouter();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem(`form-wizard-${formId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnswers(parsed.answers || {});
      } catch {}
    }
  }, [formId]);

  if (!form) notFound();

  function handleEdit(stepIndex: number) {
    router.push(`/forms/${formId}?step=${stepIndex}`);
  }

  function handleGenerate() {
    router.push(`/forms/${formId}/complete`);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Review Your Answers</h1>
        <p className="text-slate-600 mb-6">{form.formNumber} &mdash; {form.title}</p>

        <div className="space-y-6">
          {form.steps.map((step, stepIdx) => (
            <div key={step.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">{step.title}</h2>
                <button
                  onClick={() => handleEdit(stepIdx)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {step.fields.map((field) => {
                  const value = answers[field.id];
                  if (!value && !field.required) return null;
                  return (
                    <div key={field.id}>
                      <dt className="text-xs text-slate-500">{field.label}</dt>
                      <dd className="text-sm text-slate-900 mt-0.5">
                        {field.type === 'checkbox'
                          ? value === 'true' ? 'Yes' : 'No'
                          : value || <span className="text-red-500 italic">Not provided</span>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push(`/forms/${formId}`)}>
            Back to Form
          </Button>
          <Button onClick={handleGenerate}>
            Generate PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
