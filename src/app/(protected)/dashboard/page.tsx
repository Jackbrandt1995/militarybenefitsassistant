'use client';

import { useAuth } from '@/components/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import FormCard from '@/components/FormCard';
import { getAllForms } from '@/lib/forms/registry';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';

const COMPLETENESS_FIELDS: Array<keyof NonNullable<ReturnType<typeof useProfile>['profile']>['profile']> = [
  'first_name',
  'last_name',
  'dob',
  'sex',
  'ssn_encrypted',
  'phone_mobile',
  'address_street',
  'address_city',
  'address_state',
  'address_zip',
];

function getCompleteness(p: ReturnType<typeof useProfile>['profile']): number {
  if (!p?.profile) return 0;
  const filled = COMPLETENESS_FIELDS.filter(f => {
    const v = p.profile[f];
    return v !== null && v !== undefined && String(v).trim() !== '';
  });
  return Math.round((filled.length / COMPLETENESS_FIELDS.length) * 100);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const forms = getAllForms();

  const firstName = profile?.profile?.first_name?.trim() || '';
  const pct = getCompleteness(profile);
  const isComplete = pct === 100;

  const categories = [
    { key: 'application',   label: 'Applications' },
    { key: 'change',        label: 'Change Requests' },
    { key: 'reimbursement', label: 'Reimbursements' },
    { key: 'dependent',     label: 'Dependent Forms' },
    { key: 'healthcare',    label: 'Health Care' },
    { key: 'home-loan',     label: 'Home Loan' },
    { key: 'other',         label: 'Other' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {firstName ? `Welcome back, ${firstName}!` : 'Welcome!'}
        </h1>
        <p className="text-gray-600 mt-1">Select a form to get started.</p>
      </div>

      {/* Profile completeness banner */}
      {!profileLoading && (
        <div className="mb-8">
          {isComplete ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm font-medium text-green-800">
                Profile complete ✓ — your forms will be pre-filled automatically
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-amber-900">
                    Your profile is {pct}% complete — fill it in to auto-populate your forms
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-amber-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="pl-8">
                <Link
                  href="/profile"
                  className="text-sm font-semibold text-amber-700 hover:text-amber-900 hover:underline"
                >
                  Complete Profile →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form categories */}
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
