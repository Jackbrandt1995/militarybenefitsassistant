'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getFormById } from '@/lib/forms/registry';
import FormWizard from '@/components/FormWizard';

export default function FormPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const form = getFormById(formId);
  if (!form) notFound();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto mb-6">
        {/* Answers auto-save as you type, so leaving the wizard is safe. */}
        <Link
          href="/dashboard"
          className="inline-block text-sm text-blue-600 hover:text-blue-800 mb-2"
        >
          ← Back to dashboard
        </Link>
        <p className="text-sm text-slate-500">{form.formNumber}</p>
        <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
        <p className="text-slate-600 mt-1">{form.description}</p>
      </div>
      <FormWizard form={form} />
    </div>
  );
}
