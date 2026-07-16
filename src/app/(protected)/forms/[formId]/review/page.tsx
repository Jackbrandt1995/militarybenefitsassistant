'use client';

import { use, useEffect, useMemo, useSyncExternalStore } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getFormById } from '@/lib/forms/registry';
import Button from '@/components/ui/Button';

// Subscribe to nothing — we only need useSyncExternalStore's hydration-safe
// "read browser storage on the client" behavior.
const emptySubscribe = () => () => {};

/** yyyy-mm-dd → MM/DD/YYYY (matches what the filled PDF will print). */
function formatDateValue(value: string): string {
  const parts = value.split('-');
  return parts.length === 3 && parts[0].length === 4
    ? `${parts[1]}/${parts[2]}/${parts[0]}`
    : value;
}

export default function ReviewPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const form = getFormById(formId);
  const router = useRouter();

  // Hydration-safe storage reads: server snapshot is null/false, the real
  // values kick in on the client without a hydration mismatch.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const sessionRaw = useSyncExternalStore(
    emptySubscribe,
    () => sessionStorage.getItem(`form-wizard-${formId}`),
    () => null,
  );
  const draftRaw = useSyncExternalStore(
    emptySubscribe,
    () => localStorage.getItem(`wizard-${formId}`),
    () => null,
  );

  // The wizard rewrites the sessionStorage snapshot only when the last step is
  // submitted, but it auto-saves every edit to the localStorage draft. Fold the
  // (always at-least-as-fresh) draft over the snapshot so edits made via
  // "Edit" + browser Back aren't shown stale here. The draft never contains
  // sensitive answers (SSN/bank), so the spread order keeps those from the
  // snapshot.
  const answers = useMemo<Record<string, string | boolean> | null>(() => {
    if (!sessionRaw) return null;
    try {
      let merged: Record<string, string | boolean> = JSON.parse(sessionRaw).answers || {};
      if (draftRaw) {
        try {
          const draftAnswers = JSON.parse(draftRaw)?.answers;
          if (draftAnswers && typeof draftAnswers === 'object') {
            merged = { ...merged, ...draftAnswers };
          }
        } catch {
          // Unreadable draft — the snapshot still works on its own.
        }
      }
      // The wizard scrubs answers whose condition is no longer met before it
      // writes the snapshot, but the raw draft can reintroduce them (e.g.
      // insurance details after switching "other insurance" back to No). Scrub
      // again here so neither this page nor the generated PDF shows them.
      if (form) {
        for (const step of form.steps) {
          for (const field of step.fields) {
            if (field.condition && merged[field.condition.field] !== field.condition.value) {
              delete merged[field.id];
            }
          }
        }
      }
      return merged;
    } catch {
      return null;
    }
  }, [sessionRaw, draftRaw, form]);

  // Keep the snapshot in sync with what this page displays, so "Generate PDF"
  // fills the PDF with the same values the veteran just reviewed.
  useEffect(() => {
    if (answers && draftRaw) {
      sessionStorage.setItem(`form-wizard-${formId}`, JSON.stringify({ answers }));
    }
  }, [answers, draftRaw, formId]);

  if (!form) notFound();

  function handleEdit(stepIndex: number) {
    router.push(`/forms/${formId}?step=${stepIndex}`);
  }

  function handleGenerate() {
    router.push(`/forms/${formId}/complete`);
  }

  // Wait for the client before deciding whether answers exist.
  if (!mounted) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  // Direct navigation (or a closed tab) with no stored answers — don't render a
  // wall of "Not provided" with a live Generate button that dead-ends.
  if (!answers) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              We couldn&apos;t find your answers for this form
            </h1>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Your answers stay in this browser tab while you work. Go back to the
              form to continue — any progress you saved earlier will be restored
              automatically.
            </p>
            <Button onClick={() => router.push(`/forms/${formId}`)}>
              Go to the form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // A required field only counts as missing if its show-when condition (if any)
  // is met — mirrors the wizard's own visibility rules.
  const missingRequired = form.steps
    .flatMap(step => step.fields)
    .filter(f => {
      if (!f.required) return false;
      if (f.condition && answers[f.condition.field] !== f.condition.value) return false;
      return !answers[f.id];
    });

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
                  aria-label={`Edit ${step.title}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {step.fields.map((field) => {
                  // Skip fields whose show-when condition isn't met.
                  if (field.condition && answers[field.condition.field] !== field.condition.value) {
                    return null;
                  }
                  const value = answers[field.id];
                  if (!value && !field.required) return null;
                  return (
                    <div key={field.id}>
                      <dt className="text-xs text-slate-500">{field.label}</dt>
                      <dd className="text-sm text-slate-900 mt-0.5">
                        {field.type === 'checkbox' ? (
                          value ? 'Yes' : 'No'
                        ) : !value ? (
                          <span className="text-red-500 italic">
                            {field.type === 'signature' ? 'Not signed' : 'Not provided'}
                          </span>
                        ) : field.type === 'signature' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={String(value)} alt="Your signature" className="h-10" />
                        ) : field.type === 'date' ? (
                          formatDateValue(String(value))
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>

        {missingRequired.length > 0 && (
          <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-900 font-medium">
              {missingRequired.length} required answer{missingRequired.length > 1 ? 's are' : ' is'} still
              missing — use the Edit buttons above to complete them before generating your PDF.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.push(`/forms/${formId}`)}>
            Back to Form
          </Button>
          <Button onClick={handleGenerate} disabled={missingRequired.length > 0}>
            Generate PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
