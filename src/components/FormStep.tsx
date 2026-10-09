'use client';

import { useEffect, useRef, useState } from 'react';
import type { FieldDef, FormStepDef } from '@/lib/forms/types';
import SignaturePad from '@/components/SignaturePad';
import Button from '@/components/ui/Button';

// Inlined at build time by Next.js. When the flag is off the assist button
// never renders, so nothing on the page references the API.
const AI_ASSIST_ENABLED = process.env.NEXT_PUBLIC_AI_ASSIST === 'true';

interface FormStepProps {
  /** Sent with every draft-assist request so the server knows which form the notes belong to. */
  formId: string;
  step: FormStepDef;
  answers: Record<string, string | boolean>;
  errors: Record<string, string>;
  preFilledFields: Set<string>;
  onAnswer: (fieldId: string, value: string | boolean) => void;
}

type AssistState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; draft: string; questions: string[] }
  /** The server answered 200 with no draft (declined or nothing to work with). */
  | { status: 'notice'; message: string }
  | { status: 'error'; message: string };

/** Plain-language text for a failed /api/draft-assist call. */
function assistErrorMessage(status: number, serverError: unknown): string {
  const fromServer = typeof serverError === 'string' && serverError.trim() ? serverError.trim() : '';
  switch (status) {
    case 400:
      return fromServer || 'Please write a few notes first (up to 4,000 characters), then try again.';
    case 401:
      return 'Your session has expired. Please sign in again, then try once more.';
    case 429:
      return 'You have asked for help several times in a short period. Please wait a minute and try again.';
    case 503:
      return 'AI assistance is not available right now. You can keep writing your answer in your own words.';
    default:
      return 'Something went wrong while organizing your notes. Please try again.';
  }
}

interface DraftAssistProps {
  formId: string;
  field: FieldDef;
  /** The textarea's current text; sent as-is, nothing else about the veteran goes with it. */
  notes: string;
  onUseDraft: (draft: string) => void;
}

/**
 * "Help me organize my answer": sends the veteran's own rough notes to
 * POST /api/draft-assist and shows the returned draft in a preview. The
 * veteran chooses "Use this draft" or "Keep mine"; nothing overwrites the
 * textarea on its own.
 */
function DraftAssist({ formId, field, notes, onUseDraft }: DraftAssistProps) {
  const [state, setState] = useState<AssistState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  // Drop an in-flight request if the step changes under it.
  useEffect(() => () => abortRef.current?.abort(), []);

  async function requestDraft() {
    if (!notes.trim()) {
      setState({ status: 'error', message: 'Write a few notes in the box first, then I can help organize them.' });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/draft-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          fieldId: field.id,
          label: field.label,
          helpText: field.helpText,
          notes,
        }),
        signal: controller.signal,
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setState({ status: 'error', message: assistErrorMessage(res.status, body?.error) });
        return;
      }
      const draft = typeof body?.draft === 'string' ? body.draft.trim() : '';
      const questions: string[] = Array.isArray(body?.questions)
        ? body.questions.filter((q: unknown): q is string => typeof q === 'string' && q.trim() !== '')
        : [];
      if (!draft) {
        const message = typeof body?.message === 'string' && body.message.trim()
          ? body.message.trim()
          : 'No draft came back this time. Your notes are unchanged.';
        setState({ status: 'notice', message });
        return;
      }
      setState({ status: 'ready', draft, questions });
    } catch {
      if (controller.signal.aborted) return;
      setState({ status: 'error', message: 'We could not reach the assistant. Check your connection and try again.' });
    }
  }

  const isLoading = state.status === 'loading';
  const previewId = `${field.id}-draft-preview`;

  return (
    <div className="mt-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        loading={isLoading}
        onClick={requestDraft}
        aria-controls={state.status === 'ready' ? previewId : undefined}
      >
        {isLoading ? 'Organizing your notes…' : 'Help me organize my answer'}
      </Button>
      <p className="mt-1 text-xs text-gray-500">
        The draft only reorganizes what you wrote. Review it before using it.
      </p>

      {/* Status messages (polite live region so screen readers hear the outcome) */}
      <div aria-live="polite">
        {state.status === 'error' && (
          <p className="mt-1 text-xs text-red-600">{state.message}</p>
        )}
        {state.status === 'notice' && (
          <p className="mt-1 text-xs text-gray-700">{state.message}</p>
        )}
      </div>

      {state.status === 'ready' && (
        <div
          id={previewId}
          role="region"
          aria-label={`Suggested draft for ${field.label}`}
          className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3"
        >
          <p className="text-xs font-semibold text-blue-900 mb-1">Suggested draft, based only on your notes</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{state.draft}</p>
          {state.questions.length > 0 && (
            <div className="mt-3 rounded border border-blue-200 bg-white p-2">
              <p className="text-xs font-semibold text-blue-900">Still to answer in your own words (not added to the form):</p>
              <ul className="mt-1 list-disc list-inside text-xs text-gray-700 space-y-0.5">
                {state.questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onUseDraft(state.draft);
                setState({ status: 'idle' });
              }}
            >
              Use this draft
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setState({ status: 'idle' })}>
              Keep mine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormStep({ formId, step, answers, errors, preFilledFields, onAnswer }: FormStepProps) {
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  function toggleVisible(fieldId: string) {
    setVisibleFields(prev => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId); else next.add(fieldId);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
        {/* whitespace-pre-line keeps the paragraph breaks in multi-part
            descriptions (e.g. the certification step's two Privacy Act notices). */}
        {step.description && (
          <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{step.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {step.fields.map(field => {
          // Check conditional visibility
          if (field.condition) {
            const condValue = answers[field.condition.field];
            if (condValue !== field.condition.value) return null;
          }

          const value = answers[field.id] ?? '';
          const error = errors[field.id];
          const isPreFilled = preFilledFields.has(field.id);

          return (
            <div key={field.id} className="relative">
              {/* Label — checkboxes label themselves inline; radios use a
                  <fieldset>/<legend>; signature/document have no single input
                  a htmlFor could point to, so they get a plain heading. */}
              {field.type !== 'checkbox' && field.type !== 'radio' && (
                field.type === 'signature' || field.type === 'document' ? (
                  <span className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </span>
                ) : (
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )
              )}

              {/* Pre-fill badge */}
              {isPreFilled && (
                <span className="absolute top-0 right-0 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Auto-filled
                </span>
              )}

              {/* Field rendering based on type */}
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  value={String(value)}
                  onChange={e => onAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  rows={3}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              ) : field.type === 'select' ? (
                <select
                  id={field.id}
                  value={String(value)}
                  onChange={e => onAnswer(field.id, e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select...</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'radio' ? (
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </legend>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {field.options?.map((opt, optIdx) => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          id={optIdx === 0 ? field.id : undefined}
                          name={field.id}
                          value={opt.value}
                          checked={value === opt.value}
                          onChange={e => onAnswer(field.id, e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {/* Radios can't be un-picked natively. Once something is
                      selected, offer a way back to "no answer" (e.g. a second
                      branch of service chosen by mistake). Focus moves to the
                      first option so keyboard users aren't dropped. */}
                  {value !== '' && (
                    <button
                      type="button"
                      onClick={() => {
                        onAnswer(field.id, '');
                        document.getElementById(field.id)?.focus();
                      }}
                      aria-label={`Clear selection for ${field.label}`}
                      className="mt-1.5 text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Clear selection
                    </button>
                  )}
                </fieldset>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-start gap-2 text-sm mt-1">
                  <input
                    type="checkbox"
                    id={field.id}
                    checked={value === true || value === 'true'}
                    onChange={e => onAnswer(field.id, e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.helpText && (
                      <span className="block text-xs text-gray-500 mt-0.5">{field.helpText}</span>
                    )}
                  </span>
                </label>
              ) : field.type === 'ssn' ? (
                <div className="relative">
                  <input
                    type={visibleFields.has(field.id) ? 'text' : 'password'}
                    id={field.id}
                    value={String(value)}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
                      let formatted = digits;
                      if (digits.length > 5) {
                        formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
                      } else if (digits.length > 3) {
                        formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                      }
                      onAnswer(field.id, formatted);
                    }}
                    placeholder="XXX-XX-XXXX"
                    maxLength={11}
                    className={`w-full rounded-md border px-3 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisible(field.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {visibleFields.has(field.id) ? 'Hide' : 'Show'}
                  </button>
                </div>
              ) : field.type === 'phone' ? (
                <input
                  type="tel"
                  id={field.id}
                  value={String(value)}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    let formatted = digits;
                    if (digits.length > 6) {
                      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                    } else if (digits.length > 3) {
                      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                    }
                    onAnswer(field.id, formatted);
                  }}
                  placeholder="(555) 555-5555"
                  maxLength={14}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              ) : field.type === 'document' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{field.helpText}</p>
                </div>
              ) : field.type === 'signature' ? (
                /* id + tabIndex let the wizard scroll/focus here when the
                   signature is still missing at review time */
                <div id={field.id} tabIndex={-1}>
                  <SignaturePad
                    value={String(value || '')}
                    onChange={dataUrl => onAnswer(field.id, dataUrl)}
                  />
                </div>
              ) : field.sensitive ? (
                <div className="relative">
                  <input
                    type={visibleFields.has(field.id) ? 'text' : 'password'}
                    id={field.id}
                    value={String(value)}
                    onChange={e => onAnswer(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className={`w-full rounded-md border px-3 py-2 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisible(field.id)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {visibleFields.has(field.id) ? 'Hide' : 'Show'}
                  </button>
                </div>
              ) : (
                <input
                  type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                  id={field.id}
                  value={String(value)}
                  onChange={e => onAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              )}

              {/* Help text */}
              {field.helpText && field.type !== 'checkbox' && field.type !== 'document' && field.type !== 'signature' && (
                <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
              )}

              {/* Error message */}
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

              {/* Optional AI assist for long answers (feature-flagged) */}
              {AI_ASSIST_ENABLED && field.type === 'textarea' && field.aiAssist && (
                <DraftAssist
                  formId={formId}
                  field={field}
                  notes={String(value)}
                  onUseDraft={draft =>
                    onAnswer(field.id, field.maxLength ? draft.slice(0, field.maxLength) : draft)
                  }
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
