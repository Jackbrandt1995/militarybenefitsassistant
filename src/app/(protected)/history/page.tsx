'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { getAllForms } from '@/lib/forms/registry';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle,
  Send,
  Loader,
  Inbox,
  ArrowRight,
  Package,
  ExternalLink,
} from 'lucide-react';

interface Submission {
  id: string;
  form_id: string;
  form_name: string;
  generated_at: string;
  submission_status: string | null;
  agent_filing_requested: boolean | null;
  tracking_number: string | null;
}

interface InProgressForm {
  id: string;
  formNumber: string;
  title: string;
}

type DisplayStatus =
  | 'in_progress'
  | 'complete'
  | 'received'
  | 'processing'
  | 'sent';

function getDisplayStatus(sub: Submission): DisplayStatus {
  if (sub.submission_status === 'agent_mailed') return 'sent';

  if (sub.agent_filing_requested) {
    const hoursSince =
      (Date.now() - new Date(sub.generated_at).getTime()) / 1000 / 3600;
    return hoursSince >= 24 ? 'processing' : 'received';
  }

  return 'complete';
}

const STATUS_CONFIG: Record<
  DisplayStatus,
  { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  in_progress: {
    label: 'In Progress',
    icon: <Clock className="w-3.5 h-3.5" />,
    bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200',
  },
  complete: {
    label: 'Complete',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200',
  },
  received: {
    label: 'Received by MBA',
    icon: <Inbox className="w-3.5 h-3.5" />,
    bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200',
  },
  processing: {
    label: 'Processing',
    icon: <Loader className="w-3.5 h-3.5 animate-spin" />,
    bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200',
  },
  sent: {
    label: 'Sent to VA',
    icon: <Send className="w-3.5 h-3.5" />,
    bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200',
  },
};

function StatusBadge({ status }: { status: DisplayStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [inProgressForms, setInProgressForms] = useState<InProgressForm[]>([]);
  const [loading, setLoading] = useState(true);

  // Check localStorage for in-progress forms (client-only)
  useEffect(() => {
    const allForms = getAllForms();
    const inProgress = allForms.filter(f =>
      localStorage.getItem(`form-wizard-${f.id}`) !== null
    );
    setInProgressForms(inProgress.map(f => ({
      id: f.id,
      formNumber: f.formNumber,
      title: f.title,
    })));
  }, []);

  // Fetch completed submissions from Supabase
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('form_submissions')
      .select('id, form_id, form_name, generated_at, submission_status, agent_filing_requested, tracking_number')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .then(({ data }) => {
        setSubmissions((data ?? []) as Submission[]);
        setLoading(false);
      });
  }, [user]);

  const hasAnything = inProgressForms.length > 0 || submissions.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Filing History</h1>
          <p className="text-slate-500 mt-1 text-sm">Track the status of every form you've started or submitted.</p>
        </div>

        {/* Status legend */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Status Guide</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUS_CONFIG) as DisplayStatus[]).map(s => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
          </div>
        )}

        {/* Empty state */}
        {!loading && !hasAnything && (
          <div className="bg-white rounded-xl border border-slate-200 p-14 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-600">No forms yet.</p>
            <p className="text-sm text-slate-400 mt-1">
              Head to the{' '}
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </Link>{' '}
              to get started.
            </p>
          </div>
        )}

        {/* In-progress forms */}
        {inProgressForms.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">In Progress</h2>
            {inProgressForms.map(f => (
              <div key={f.id} className="bg-white rounded-xl border border-yellow-200 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{f.title}</p>
                    <p className="text-xs text-slate-400 font-mono uppercase mt-0.5">{f.formNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status="in_progress" />
                  <Link
                    href={`/forms/${f.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Continue
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Completed submissions */}
        {!loading && submissions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Submitted Forms</h2>
            {submissions.map(sub => {
              const status = getDisplayStatus(sub);
              const date   = new Date(sub.generated_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              });
              const time   = new Date(sub.generated_at).toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit',
              });

              return (
                <div
                  key={sub.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm leading-tight">{sub.form_name}</p>
                    <p className="text-xs text-slate-400 font-mono uppercase mt-0.5">{sub.form_id}</p>
                    <p className="text-xs text-slate-400 mt-1">{date} at {time}</p>
                    {sub.tracking_number && (
                      <a
                        href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${sub.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        <Package className="w-3 h-3" />
                        Track: {sub.tracking_number}
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    )}
                  </div>

                  <div className="shrink-0">
                    <StatusBadge status={status} />
                  </div>
                </div>
              );
            })}
          </section>
        )}

      </div>
    </div>
  );
}
