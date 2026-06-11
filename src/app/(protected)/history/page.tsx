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
  RotateCcw,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

interface Submission {
  id: string;
  form_id: string;
  form_name: string;
  generated_at: string;
  submission_status: string | null;
  agent_filing_requested: boolean | null;
  tracking_number: string | null;
  return_reason: string | null;
}

interface InProgressForm {
  id: string;
  formNumber: string;
  title: string;
}

interface MessageItem {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

type DisplayStatus =
  | 'in_progress'
  | 'complete'
  | 'received'
  | 'processing'
  | 'sent'
  | 'returned';

function getDisplayStatus(sub: Submission): DisplayStatus {
  if (sub.submission_status === 'agent_mailed')   return 'sent';
  if (sub.submission_status === 'agent_returned') return 'returned';

  if (sub.agent_filing_requested) {
    const hoursSince = (Date.now() - new Date(sub.generated_at).getTime()) / 1000 / 3600;
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
  returned: {
    label: 'Action Required',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200',
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
  const [submissions, setSubmissions]           = useState<Submission[]>([]);
  const [inProgressForms, setInProgressForms]   = useState<InProgressForm[]>([]);
  const [loading, setLoading]                   = useState(true);

  // Messaging state
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
  const [messages, setMessages]                 = useState<Record<string, MessageItem[]>>({});
  const [loadingMessages, setLoadingMessages]   = useState<Record<string, boolean>>({});
  const [newMessage, setNewMessage]             = useState<Record<string, string>>({});
  const [sendingMessage, setSendingMessage]     = useState<Record<string, boolean>>({});
  const [unreadCounts, setUnreadCounts]         = useState<Record<string, number>>({});

  useEffect(() => {
    const allForms = getAllForms();
    // The live wizard draft is persisted by useFormWizard to localStorage under
    // `wizard-<id>`. Only count it as "in progress" if the user actually advanced
    // past the first step or touched a field (the draft is written on mount).
    const inProgress = allForms.filter(f => {
      const raw = localStorage.getItem(`wizard-${f.id}`);
      if (!raw) return false;
      try {
        const p = JSON.parse(raw);
        return (p.currentStep ?? 0) > 0 || (Array.isArray(p.touched) && p.touched.length > 0);
      } catch {
        return false;
      }
    });
    setInProgressForms(inProgress.map(f => ({
      id: f.id,
      formNumber: f.formNumber,
      title: f.title,
    })));
  }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('form_submissions')
      .select('id, form_id, form_name, generated_at, submission_status, agent_filing_requested, tracking_number, return_reason')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .then(async ({ data }) => {
        const subs = (data ?? []) as Submission[];
        setSubmissions(subs);
        setLoading(false);

        // Load unread admin message counts for agent-filed submissions
        const agentSubIds = subs
          .filter(s => s.agent_filing_requested)
          .map(s => s.id);

        if (agentSubIds.length > 0) {
          const { data: unreadData } = await supabase
            .from('submission_messages')
            .select('submission_id')
            .in('submission_id', agentSubIds)
            .eq('sender_type', 'admin')
            .eq('is_read', false);

          if (unreadData) {
            const counts: Record<string, number> = {};
            unreadData.forEach(row => {
              counts[row.submission_id] = (counts[row.submission_id] ?? 0) + 1;
            });
            setUnreadCounts(counts);
          }
        }
      });
  }, [user]);

  async function loadMessages(submissionId: string) {
    setLoadingMessages(prev => ({ ...prev, [submissionId]: true }));
    const supabase = createClient();

    const { data } = await supabase
      .from('submission_messages')
      .select('id, sender_type, message, created_at, is_read')
      .eq('submission_id', submissionId)
      .order('created_at', { ascending: true });

    setMessages(prev => ({ ...prev, [submissionId]: (data ?? []) as MessageItem[] }));
    setLoadingMessages(prev => ({ ...prev, [submissionId]: false }));

    // Mark admin messages as read
    await supabase
      .from('submission_messages')
      .update({ is_read: true })
      .eq('submission_id', submissionId)
      .eq('sender_type', 'admin')
      .eq('is_read', false);

    // Clear unread count locally
    setUnreadCounts(prev => ({ ...prev, [submissionId]: 0 }));
  }

  async function sendMessage(submissionId: string) {
    const text = (newMessage[submissionId] ?? '').trim();
    if (!text) return;

    setSendingMessage(prev => ({ ...prev, [submissionId]: true }));
    const supabase = createClient();

    const { data: inserted, error } = await supabase
      .from('submission_messages')
      .insert({
        submission_id: submissionId,
        sender_type: 'client',
        message: text,
        is_read: false,
      })
      .select('id, sender_type, message, created_at, is_read')
      .single();

    if (!error && inserted) {
      setMessages(prev => ({
        ...prev,
        [submissionId]: [...(prev[submissionId] ?? []), inserted as MessageItem],
      }));
      setNewMessage(prev => ({ ...prev, [submissionId]: '' }));
    }

    // Non-fatal notification
    try {
      await fetch('/api/notify-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submissionId, direction: 'client_to_admin' }),
      });
    } catch (e) {
      console.warn('[notify-message] non-fatal:', e);
    }

    setSendingMessage(prev => ({ ...prev, [submissionId]: false }));
  }

  function toggleMessages(submissionId: string) {
    const willOpen = !expandedMessages[submissionId];
    setExpandedMessages(prev => ({ ...prev, [submissionId]: willOpen }));
    if (willOpen && !messages[submissionId]) {
      loadMessages(submissionId);
    }
  }

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
              <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>{' '}
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

        {/* Submitted forms */}
        {!loading && submissions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Submitted Forms</h2>
            {submissions.map(sub => {
              const status   = getDisplayStatus(sub);
              const isReturn = status === 'returned';
              const date     = new Date(sub.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const time     = new Date(sub.generated_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              const isAgentFiled = !!sub.agent_filing_requested;
              const msgExpanded  = !!expandedMessages[sub.id];
              const threadMsgs   = messages[sub.id] ?? [];
              const unreadCount  = unreadCounts[sub.id] ?? 0;
              const msgLoading   = !!loadingMessages[sub.id];
              const isSending    = !!sendingMessage[sub.id];

              return (
                <div
                  key={sub.id}
                  className={`bg-white rounded-xl border overflow-hidden ${isReturn ? 'border-red-200' : 'border-slate-200'}`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                        isReturn ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                      }`}>
                        {isReturn
                          ? <RotateCcw className="w-4 h-4 text-red-500" />
                          : <FileText className="w-4 h-4 text-slate-500" />}
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

                    {/* Return reason message */}
                    {isReturn && sub.return_reason && (
                      <div className="mt-3 ml-12 bg-red-50 border border-red-200 rounded-lg p-3.5">
                        <p className="text-xs font-semibold text-red-700 mb-1.5 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Message from MBA — action needed
                        </p>
                        <p className="text-sm text-red-900 whitespace-pre-wrap leading-relaxed">{sub.return_reason}</p>
                        <a
                          href="mailto:info@militarybenefitsassistant.com"
                          className="inline-block mt-2.5 text-xs font-medium text-red-700 hover:underline"
                        >
                          Reply to info@militarybenefitsassistant.com →
                        </a>
                      </div>
                    )}

                    {/* Messages toggle — only for agent-filed submissions */}
                    {isAgentFiled && (
                      <div className="mt-3 ml-12">
                        <button
                          onClick={() => toggleMessages(sub.id)}
                          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          <span className="relative">
                            <MessageSquare className="w-4 h-4" />
                            {unreadCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                                {unreadCount}
                              </span>
                            )}
                          </span>
                          {msgExpanded ? 'Hide Messages' : 'Messages'}
                          {unreadCount > 0 && !msgExpanded && (
                            <span className="text-red-600 font-semibold">({unreadCount} new)</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Messaging panel */}
                  {isAgentFiled && msgExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Messages</p>

                      {/* Thread */}
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {msgLoading && (
                          <div className="text-center py-6">
                            <div className="animate-spin w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
                          </div>
                        )}

                        {!msgLoading && threadMsgs.length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-4">No messages yet. Send a message to MBA below.</p>
                        )}

                        {!msgLoading && threadMsgs.map(msg => {
                          const isAdmin  = msg.sender_type === 'admin';
                          const msgDate  = new Date(msg.created_at).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                          });
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                            >
                              <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                                isAdmin
                                  ? 'bg-purple-100 text-purple-900 rounded-tl-none'
                                  : 'bg-blue-600 text-white rounded-tr-none'
                              }`}>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                <p className={`text-[10px] mt-1.5 ${isAdmin ? 'text-purple-500' : 'text-blue-200'}`}>
                                  {isAdmin ? 'MBA' : 'You'} · {msgDate}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Compose */}
                      <div className="flex gap-2 items-end">
                        <textarea
                          rows={2}
                          placeholder="Type a message to MBA…"
                          value={newMessage[sub.id] ?? ''}
                          onChange={e => setNewMessage(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage(sub.id);
                            }
                          }}
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                        <button
                          onClick={() => sendMessage(sub.id)}
                          disabled={isSending || !(newMessage[sub.id] ?? '').trim()}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {isSending ? 'Sending…' : 'Send'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

      </div>
    </div>
  );
}
