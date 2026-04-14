'use client';

import type { FormStepDef } from '@/lib/forms/types';

interface FormStepProps {
  step: FormStepDef;
  answers: Record<string, string | boolean>;
  errors: Record<string, string>;
  preFilledFields: Set<string>;
  onAnswer: (fieldId: string, value: string | boolean) => void;
}

export default function FormStep({ step, answers, errors, preFilledFields, onAnswer }: FormStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{step.title}</h2>
        {step.description && (
          <p className="mt-1 text-sm text-gray-600">{step.description}</p>
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
              {/* Label */}
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

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
                <div className="flex flex-wrap gap-4 mt-1">
                  {field.options?.map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
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
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-2 text-sm mt-1">
                  <input
                    type="checkbox"
                    id={field.id}
                    checked={value === true || value === 'true'}
                    onChange={e => onAnswer(field.id, e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  {field.helpText || field.label}
                </label>
              ) : field.type === 'ssn' ? (
                <input
                  type="password"
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
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
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
              {field.helpText && field.type !== 'checkbox' && (
                <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
              )}

              {/* Error message */}
              {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
