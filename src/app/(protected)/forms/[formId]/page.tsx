'use client';

import { use } from 'react';
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
        <p className="text-sm text-slate-500">{form.formNumber}</p>
        <h1 className="text-2xl font-bold text-slate-900">{form.title}</h1>
        <p className="text-slate-600 mt-1">{form.description}</p>
      </div>
      <FormWizard form={form} />
    </div>
  );
}
