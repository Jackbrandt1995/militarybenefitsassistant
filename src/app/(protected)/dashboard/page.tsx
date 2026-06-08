'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import FormCard from '@/components/FormCard';
import { getAllForms, getFormById } from '@/lib/forms/registry';
import { goals } from '@/lib/forms/goals';
import Link from 'next/link';
import {
  CheckCircle,
  AlertCircle,
  GraduationCap,
  BadgeCheck,
  Users,
  Briefcase,
  Home,
  HeartPulse,
  UserCheck,
  Receipt,
  Compass,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';

/** Guided benefits finder (lives on the marketing site) for users who are unsure. */
const GUIDED_FINDER_URL = 'https://www.militarybenefitsassistant.com/education-benefits';

const GOAL_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  BadgeCheck,
  Users,
  Briefcase,
  Home,
  HeartPulse,
  UserCheck,
  Receipt,
};

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
  const { profile, loading: profileLoading } = useProfile();
  const forms = getAllForms();

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const selectedGoal = goals.find(g => g.id === selectedGoalId) ?? null;

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
        <p className="text-gray-600 mt-1">Tell us what you want to do, and we&apos;ll find the right form.</p>
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

      {/* ── Goal finder ──────────────────────────────────────────────────── */}
      <section className="mb-12">
        {/* Header — hidden on mobile once a goal is chosen (results screen has its own header) */}
        <div
          className={`flex-wrap items-end justify-between gap-3 mb-5 ${
            selectedGoalId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <h2 className="text-lg font-semibold text-gray-800">What do you want to do?</h2>
          {/* Guided finder for users who aren't sure */}
          <a
            href={GUIDED_FINDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
          >
            <Compass className="w-4 h-4" />
            Not sure? Take the guided benefits finder
          </a>
        </div>

        <div className="lg:grid lg:grid-cols-[20rem_1fr] lg:gap-8 lg:items-start">
          {/* LEFT — goal cards. On mobile, hidden once a goal is selected (results take over). */}
          <div className={selectedGoalId ? 'hidden lg:block' : 'block'}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {goals.map(goal => {
                const Icon = GOAL_ICONS[goal.icon] ?? Compass;
                const isSelected = goal.id === selectedGoalId;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoalId(goal.id)}
                    aria-pressed={isSelected}
                    className={`flex items-start gap-3 text-left rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 leading-snug">{goal.label}</span>
                      <span className="block text-xs text-gray-500 mt-0.5">{goal.tagline}</span>
                      <span className="block text-xs font-medium text-blue-700 mt-1.5">
                        {goal.forms.length === 1 ? '1 form' : `${goal.forms.length} forms`}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — results. On mobile this is a separate screen; on desktop it's the right pane. */}
          <div className={selectedGoal ? 'block' : 'hidden lg:block'}>
            {selectedGoal ? (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 sm:p-6">
                {/* Mobile back button → returns to the goal list */}
                <button
                  type="button"
                  onClick={() => setSelectedGoalId(null)}
                  className="lg:hidden inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  All goals
                </button>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{selectedGoal.label}</h3>
                <p className="text-sm text-gray-500 mb-5">Choose the form that fits.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedGoal.forms.map(gf => {
                    const form = getFormById(gf.formId);
                    if (!form) return null;
                    return (
                      <FormCard
                        key={form.id}
                        formId={form.id}
                        formNumber={form.formNumber}
                        title={form.title}
                        description={form.description}
                        category={form.category}
                        actionLabel={gf.actionLabel}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Desktop empty state (mobile never reaches here — the list shows instead) */
              <div className="hidden lg:flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 h-full">
                <Compass className="w-8 h-8 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600">Select what you want to do</p>
                <p className="text-sm text-gray-400 mt-1">The matching forms will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Browse all forms ─────────────────────────────────────────────── */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Browse all forms</h2>
        <p className="text-sm text-gray-500 mb-6">
          Prefer to browse? Here is every form, grouped by type.
        </p>

        {categories.map(cat => {
          const catForms = forms.filter(f => f.category === cat.key);
          if (catForms.length === 0) return null;
          return (
            <div key={cat.key} className="mb-10">
              <h3 className="text-base font-semibold text-gray-700 mb-4">{cat.label}</h3>
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
    </div>
  );
}
