'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import FormCard from '@/components/FormCard';
import { getAllForms, getFormById } from '@/lib/forms/registry';
import { goals } from '@/lib/forms/goals';
import Link from 'next/link';
import {
  AlertCircle,
  GraduationCap,
  BadgeCheck,
  Home,
  HeartPulse,
  Compass,
  ArrowLeft,
  type LucideIcon,
} from 'lucide-react';

/** Guided benefits finder (lives on the marketing site) for users who are unsure. */
const GUIDED_FINDER_URL = 'https://www.militarybenefitsassistant.com/education-benefits';

const GOAL_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  BadgeCheck,
  Home,
  HeartPulse,
};

/** Per-category accent classes (literal strings so Tailwind keeps them). */
const ACCENTS: Record<string, { tile: string; panelBorder: string; panelBg: string; iconBg: string }> = {
  education:      { tile: 'bg-blue-600 hover:bg-blue-700',       panelBorder: 'border-blue-200',    panelBg: 'bg-blue-50/40',    iconBg: 'bg-blue-600' },
  certifications: { tile: 'bg-emerald-600 hover:bg-emerald-700', panelBorder: 'border-emerald-200', panelBg: 'bg-emerald-50/40', iconBg: 'bg-emerald-600' },
  home:           { tile: 'bg-amber-500 hover:bg-amber-600',     panelBorder: 'border-amber-200',   panelBg: 'bg-amber-50/40',   iconBg: 'bg-amber-500' },
  healthcare:     { tile: 'bg-blue-900 hover:bg-blue-950',       panelBorder: 'border-blue-200',    panelBg: 'bg-blue-50/40',    iconBg: 'bg-blue-900' },
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
  // Exclude forms hidden from the public catalog (e.g. VA 21-22A, which is
  // reached only from the "Have MBA file for me" agent-filing flow).
  const forms = getAllForms().filter(f => !f.hidden);

  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const selectedGoal = goals.find(g => g.id === selectedGoalId) ?? null;
  const accent = selectedGoal ? (ACCENTS[selectedGoal.id] ?? ACCENTS.education) : null;
  const SelectedIcon = selectedGoal ? (GOAL_ICONS[selectedGoal.icon] ?? Compass) : Compass;

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

      {/* Profile completeness banner — only shown when the profile needs more info */}
      {!profileLoading && !isComplete && (
        <div className="mb-8">
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
        </div>
      )}

      {/* ── Category finder ──────────────────────────────────────────────── */}
      <section className="mb-12">
        {selectedGoal && accent ? (
          /* Selected category takes over the screen and lists its forms */
          <div className={`rounded-2xl border ${accent.panelBorder} ${accent.panelBg} p-5 sm:p-8 min-h-[70vh]`}>
            <button
              type="button"
              onClick={() => setSelectedGoalId(null)}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All categories
            </button>
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${accent.iconBg} text-white shrink-0`}>
                <SelectedIcon className="w-7 h-7" />
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedGoal.label}</h2>
                <p className="text-gray-500">{selectedGoal.tagline}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-5 mb-6">Choose the form that fits your situation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          /* Four big category tiles filling the screen in quarters */
          <>
            <div className="flex flex-wrap items-end justify-end gap-3 mb-5">
              <a
                href={GUIDED_FINDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
              >
                <Compass className="w-4 h-4" />
                Not sure? Learn more here
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {goals.map(goal => {
                const Icon = GOAL_ICONS[goal.icon] ?? Compass;
                const a = ACCENTS[goal.id] ?? ACCENTS.education;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoalId(goal.id)}
                    className={`flex flex-col justify-between text-left rounded-2xl text-white p-6 sm:p-8 min-h-[13rem] sm:min-h-[15rem] lg:min-h-[17rem] shadow-sm hover:shadow-xl transition-all ${a.tile}`}
                  >
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20">
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="mt-6">
                      <span className="block text-2xl sm:text-3xl font-bold leading-tight">{goal.label}</span>
                      <span className="block text-sm text-white/85 mt-1.5">{goal.tagline}</span>
                      <span className="block text-xs font-semibold text-white/80 mt-4">
                        {goal.forms.length === 1 ? '1 form' : `${goal.forms.length} forms`} →
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
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
