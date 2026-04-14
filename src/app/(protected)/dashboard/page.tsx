'use client';

import { useAuth } from '@/components/AuthProvider';
import FormCard from '@/components/FormCard';
import { getAllForms } from '@/lib/forms/registry';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const forms = getAllForms();

  const categories = [
    { key: 'application', label: 'Applications' },
    { key: 'change', label: 'Change Requests' },
    { key: 'reimbursement', label: 'Reimbursements' },
    { key: 'dependent', label: 'Dependent Forms' },
    { key: 'other', label: 'Other' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-gray-600 mt-1">Select a form to get started. Your profile data will be auto-filled.</p>
        <div className="mt-4">
          <Link
            href="/profile"
            className="text-blue-700 hover:underline text-sm font-medium"
          >
            Complete your profile to enable auto-fill &rarr;
          </Link>
        </div>
      </div>

      {categories.map(cat => {
        const catForms = forms.filter(f => f.category === cat.key);
        if (catForms.length === 0) return null;
        return (
          <div key={cat.key} className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{cat.label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {catForms.map(form => (
                <FormCard
                  key={form.id}
                  formId={form.id}
                  formNumber={form.formNumber}
                  title={form.title}
                  description={form.description}
                  category={form.category}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
