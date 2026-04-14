'use client';

import Link from 'next/link';
import type { FormCategory } from '@/lib/forms/types';

interface FormCardProps {
  formId: string;
  formNumber: string;
  title: string;
  description: string;
  category: FormCategory;
}

const categoryColors: Record<FormCategory, string> = {
  application: 'bg-blue-100 text-blue-800',
  change: 'bg-amber-100 text-amber-800',
  reimbursement: 'bg-green-100 text-green-800',
  dependent: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
};

const categoryLabels: Record<FormCategory, string> = {
  application: 'Application',
  change: 'Change Request',
  reimbursement: 'Reimbursement',
  dependent: 'Dependent',
  other: 'Other',
};

export default function FormCard({ formId, formNumber, title, description, category }: FormCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {formNumber}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[category]}`}>
          {categoryLabels[category]}
        </span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 flex-1">{description}</p>
      <Link
        href={`/forms/${formId}`}
        className="inline-flex items-center justify-center rounded-md bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-800 transition-colors"
      >
        Start Form
      </Link>
    </div>
  );
}
