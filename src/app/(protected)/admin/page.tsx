'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  User,
  AlertCircle,
  RefreshCw,
  Package,
  Save,
  RotateCcw,
  Send,
  MessageSquare,
} from 'lucide-react';

interface AgentSubmission {
  id: string;
  form_id: string;
  form_name: string;
  submission_status: string;
  agent_auth_signature: string | null;
  pdf_storage_path: string | null;
  created_at: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  tracking_number: string | null;
  return_reason: string | null;
  returned_at: string | null;
}

interface MessageItem {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

type FilterType = 'all' | 'agent_pending' | 'agent_mailed' | 'agent_returned';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  agent_pending: {
    label: 'Awaiting Mailing',
    bg: 'bg-amber-100', text: 'text-amber-800',
    icon: <Clock className="w-3 h-3" />,
  },
  agent_mailed: {
    label: 'Mailed',
    bg: 'bg-green-100', text: 'text-green-800',
    icon: <CheckCircle className="w-3 h-3" />,
  },
  agent_returned: {
    label: 'Returned to Client',
    bg: 'bg-purple-100', text: 'text-purple-800',
    icon: <RotateCcw className="w-3 h-3" />,
  },
};

export default function AdminPage() {
  const [submissions, setSubmissions]         = useState<AgentSubmission[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [refreshing, setRefreshing]           = useState(false);
  const [filter, setFilter]                   = useState<FilterType>('agent_pending');
  const [expanded, setExpanded]               = useState<Record<string, boolean>>({});
  const [mailingId, setMailingId]             = useState<string | null>(null);
  const [downloadingId, setDownloadingId]     = useState<string | null>(null);
  const [error, setError]                     = useState('');

  // Tracking number state
  const [trackingInputs, setTrackingInputs]   = useState<Record<string, string>>({});
  const [savingTracking, setSavingTracking]   = useState<string | null>(null);

  // Return with edits state
  const [returnInputs, setReturnInputs]       = useState<Record<string, string>>({});
  const [returningId, setReturningId]         = useState<string | null>(null);
  const [showReturnForm, setShowReturnForm]   = useState<Record<string, boolean>>({});

  // Messaging state
  const [messages, setMessages]               = useState<Record<string, MessageItem[]>>({});
  const [loadingMessages, setLoadingMessages] = useState<Record<string, boolean>>({});
  const [adminNewMessage, setAdminNewMessage] = useState<Record<string, string>>({});
  const [sendingAdminMessage, setSendingAdminMessage] = useState<Record<string, boolean>>({});
  const [unreadCounts, setUnreadCounts]       = useState<Record<string, number>>({});

  // Reset-MFA panel
  const [mfaEmail, setMfaEmail]               = useState('');
  const [mfaResetting, setMfaResetting]       = useState(false);
  const [mfaResult, setMfaResult]             = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleResetMfa(e: React.FormEvent) {
    e.preventDefault();
    const email = mfaEmail.trim();
    if (!email) return;
    if (!confirm(`Reset MFA for ${email}? They'll have to set up their authenticator again on next login.`)) return;
    setMfaResetting(true);
    setMfaResult(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc('admin_reset_mfa', { p_email: email });
    setMfaResetting(false);
    if (error) {
      setMfaResult({ ok: false, msg: error.message });
    } else {
      setMfaResult({ ok: true, msg: `Removed ${data ?? 0} factor(s) for ${email}. They'll re-enroll on next login.` });
      setMfaEmail('');
    }
  }

  const loadSubmissions = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc('get_agent_submissions');
      if (rpcError) throw rpcError;
      const rows = (data ?? []) as AgentSubmission[];
      setSubmissions(rows);
      const seeds: Record<string, string> = {};
      rows.forEach(r => { seeds[r.id] = r.tracking_number ?? ''; });
      setTrackingInputs(prev => ({ ...seeds, ...prev }));

      // Load unread message counts via RPC
      try {
        const { data: counts } = await supabase.rpc('get_unread_message_counts');
        if (counts && Array.isArray(counts)) {
          const countMap: Record<string, number> = {};
          (counts as { submission_id: string; unread_count: number }[]).forEach(row => {
            countMap[row.submission_id] = row.unread_count;
          });
          setUnreadCounts(countMap);
        }
      } catch (countErr) {
        console.warn('[admin] get_unread_message_counts failed (non-fatal):', countErr);
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to load submissions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

  async function loadAdminMessages(submissionId: string) {
    setLoadingMessages(prev => ({ ...prev, [submissionId]: true }));
    const supabase = createClient();
    const { data, error: rpcErr } = await supabase.rpc('admin_get_messages', {
      p_submission_id: submissionId,
    });
    if (!rpcErr && data) {
      setMessages(prev => ({ ...prev, [submissionId]: data as MessageItem[] }));
    }
    setLoadingMessages(prev => ({ ...prev, [submissionId]: false }));
  }

  async function sendAdminMessage(sub: AgentSubmission) {
    const text = (adminNewMessage[sub.id] ?? '').trim();
    if (!text) return;

    setSendingAdminMessage(prev => ({ ...prev, [sub.id]: true }));
    const supabase = createClient();

    const { error: rpcErr } = await supabase.rpc('admin_send_message', {
      p_submission_id: sub.id,
      p_message: text,
    });

    if (!rpcErr) {
      setAdminNewMessage(prev => ({ ...prev, [sub.id]: '' }));
      // Reload thread to show the new message
      await loadAdminMessages(sub.id);
    } else {
      console.error('[admin_send_message]', rpcErr);
    }

    // Non-fatal notification
    try {
      await fetch('/api/notify-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: sub.id,
          direction: 'admin_to_client',
          userEmail: sub.email,
        }),
      });
    } catch (e) {
      console.warn('[notify-message] non-fatal:', e);
    }

    setSendingAdminMessage(prev => ({ ...prev, [sub.id]: false }));
  }

  async function handleDownload(sub: AgentSubmission) {
    if (!sub.pdf_storage_path) { alert('No PDF path on file for this submission.'); return; }
    setDownloadingId(sub.id);
    try {
      const supabase = createClient();
      const { data, error: urlErr } = await supabase.storage
        .from('form_submissions')
        .createSignedUrl(sub.pdf_storage_path, 3600);
      if (urlErr || !data?.signedUrl) throw urlErr ?? new Error('No signed URL returned');
      window.open(data.signedUrl, '_blank');
    } catch (err: any) {
      alert('Download failed: ' + (err.message ?? 'Unknown error'));
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleMarkMailed(id: string) {
    setMailingId(id);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc('mark_submission_mailed', { p_submission_id: id });
      if (rpcError) throw rpcError;
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, submission_status: 'agent_mailed' } : s)
      );
    } catch (err: any) {
      alert('Error marking as mailed: ' + (err.message ?? 'Unknown error'));
    } finally {
      setMailingId(null);
    }
  }

  async function handleSaveTracking(id: string) {
    const trackingNumber = (trackingInputs[id] ?? '').trim();
    setSavingTracking(id);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc('set_tracking_number', {
        p_submission_id: id,
        p_tracking_number: trackingNumber,
      });
      if (rpcError) throw rpcError;
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, tracking_number: trackingNumber || null } : s)
      );
    } catch (err: any) {
      alert('Error saving tracking number: ' + (err.message ?? 'Unknown error'));
    } finally {
      setSavingTracking(null);
    }
  }

  async function handleReturnWithEdits(sub: AgentSubmission) {
    const reason = (returnInputs[sub.id] ?? '').trim();
    if (!reason) { alert('Please enter a reason before returning the submission.'); return; }
    setReturningId(sub.id);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc('return_submission_for_edits', {
        p_submission_id: sub.id,
        p_return_reason: reason,
      });
      if (rpcError) throw rpcError;

      // Send email to client (non-fatal)
      try {
        const fullName = [sub.first_name, sub.last_name].filter(Boolean).join(' ') || 'there';
        await fetch('/api/notify-return', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: sub.email,
            userName: fullName,
            formName: sub.form_name,
            formId: sub.form_id,
            returnReason: reason,
          }),
        });
      } catch (emailErr) {
        console.warn('[notify-return] email failed (non-fatal):', emailErr);
      }

      setSubmissions(prev =>
        prev.map(s => s.id === sub.id
          ? { ...s, submission_status: 'agent_returned', return_reason: reason, returned_at: new Date().toISOString() }
          : s
        )
      );
      setShowReturnForm(prev => ({ ...prev, [sub.id]: false }));
      setReturnInputs(prev => ({ ...prev, [sub.id]: '' }));
    } catch (err: any) {
      alert('Error returning submission: ' + (err.message ?? 'Unknown error'));
    } finally {
      setReturningId(null);
    }
  }

  function toggleExpand(id: string) {
    const willOpen = !expanded[id];
    setExpanded(prev => ({ ...prev, [id]: willOpen }));
    // Auto-load messages when expanding
    if (willOpen && !messages[id]) {
      loadAdminMessages(id);
    }
  }

  const filtered = submissions.filter(s =>
    filter === 'all' || s.submission_status === filter
  );

  const pendingCount  = submissions.filter(s => s.submission_status === 'agent_pending').length;
  const mailedCount   = submissions.filter(s => s.submission_status === 'agent_mailed').length;
  const returnedCount = submissions.filter(s => s.submission_status === 'agent_returned').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent Filing Queue</h1>
            <p className="text-slate-500 mt-1 text-sm">Forms clients have authorized MBA to print and mail to VA.</p>
          </div>
          <button
            onClick={() => loadSubmissions(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 bg-white rounded-lg px-3 py-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-amber-200 p-5 text-center">
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Awaiting Mailing</p>
          </div>
          <div className="bg-white rounded-xl border border-purple-200 p-5 text-center">
            <p className="text-3xl font-bold text-purple-600">{returnedCount}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Returned</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-5 text-center">
            <p className="text-3xl font-bold text-green-600">{mailedCount}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Mailed</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <p className="text-3xl font-bold text-slate-700">{submissions.length}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Total</p>
          </div>
        </div>

        {/* Reset a user's MFA (support: lost authenticator device) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-900">Reset a user&apos;s two-step verification</h2>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            For a user who lost their authenticator. This removes their MFA factors; they&apos;ll set it up again on their next login.
          </p>
          <form onSubmit={handleResetMfa} className="flex flex-wrap items-center gap-2">
            <input
              type="email"
              value={mfaEmail}
              onChange={e => setMfaEmail(e.target.value)}
              placeholder="user@example.com"
              className="flex-1 min-w-[220px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" loading={mfaResetting} disabled={!mfaEmail.trim()} className="bg-slate-700 hover:bg-slate-800">
              Reset MFA
            </Button>
          </form>
          {mfaResult && (
            <p className={`mt-2 text-sm ${mfaResult.ok ? 'text-green-700' : 'text-red-700'}`}>{mfaResult.msg}</p>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {([
            { value: 'agent_pending',  label: 'Pending',  count: pendingCount },
            { value: 'agent_returned', label: 'Returned', count: returnedCount },
            { value: 'agent_mailed',   label: 'Mailed',   count: mailedCount },
            { value: 'all',            label: 'All',      count: null },
          ] as { value: FilterType; label: string; count: number | null }[]).map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${
                  filter === tab.value ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">Failed to load submissions</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading submissions…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-14 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-500">No submissions in this category.</p>
          </div>
        )}

        {/* Submission cards */}
        {!loading && filtered.map(sub => {
          const isExpanded      = !!expanded[sub.id];
          const isPending       = sub.submission_status === 'agent_pending';
          const isReturned      = sub.submission_status === 'agent_returned';
          const statusCfg       = STATUS_CONFIG[sub.submission_status] ?? STATUS_CONFIG.agent_pending;
          const fullName        = [sub.first_name, sub.last_name].filter(Boolean).join(' ') || 'Unknown';
          const date            = new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const time            = new Date(sub.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const trackingVal     = trackingInputs[sub.id] ?? sub.tracking_number ?? '';
          const trackingChanged = trackingVal !== (sub.tracking_number ?? '');
          const showReturn      = !!showReturnForm[sub.id];
          const returnMsg       = returnInputs[sub.id] ?? '';
          const unreadCount     = unreadCounts[sub.id] ?? 0;
          const threadMsgs      = messages[sub.id] ?? [];
          const msgLoading      = !!loadingMessages[sub.id];
          const isSendingMsg    = !!sendingAdminMessage[sub.id];

          return (
            <div
              key={sub.id}
              className={`bg-white rounded-xl border overflow-hidden transition-shadow ${
                isPending ? 'border-amber-200 shadow-sm' :
                isReturned ? 'border-purple-200 shadow-sm' :
                'border-slate-200'
              }`}
            >
              {/* Card top row */}
              <div className="p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.text}`}>
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>
                    {sub.tracking_number && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        <Package className="w-3 h-3" />
                        {sub.tracking_number}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{date} at {time}</span>
                  </div>

                  <p className="font-semibold text-slate-900 text-lg leading-tight">{sub.form_name}</p>
                  <p className="text-xs text-slate-400 font-mono uppercase mt-0.5">{sub.form_id}</p>

                  <div className="flex items-center gap-1.5 mt-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{fullName}</span>
                    {sub.email && <span className="text-sm text-slate-400">· {sub.email}</span>}
                    {/* Unread message badge */}
                    {unreadCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full ml-1">
                        <MessageSquare className="w-3 h-3" />
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0 items-end">
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleDownload(sub)}
                      disabled={downloadingId === sub.id}
                      className="text-sm py-1.5 px-3"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      {downloadingId === sub.id ? 'Opening…' : 'PDF'}
                    </Button>

                    {isPending && (
                      <Button
                        onClick={() => handleMarkMailed(sub.id)}
                        disabled={mailingId === sub.id}
                        className="text-sm py-1.5 px-3 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                        {mailingId === sub.id ? 'Saving…' : 'Mark Mailed'}
                      </Button>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(sub.id)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors mt-1"
                  >
                    {isExpanded
                      ? <><ChevronUp className="w-3.5 h-3.5" /> Hide details</>
                      : <><ChevronDown className="w-3.5 h-3.5" /> View details</>}
                  </button>
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 space-y-5">

                  {/* ── Messages ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Messages
                    </p>

                    {/* Thread */}
                    <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2 max-h-72 overflow-y-auto mb-3">
                      {msgLoading && (
                        <div className="text-center py-6">
                          <div className="animate-spin w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto" />
                        </div>
                      )}

                      {!msgLoading && threadMsgs.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-4">No messages yet.</p>
                      )}

                      {!msgLoading && threadMsgs.map(msg => {
                        const isAdminMsg = msg.sender_type === 'admin';
                        const msgDate    = new Date(msg.created_at).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                        });
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isAdminMsg ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm ${
                              isAdminMsg
                                ? 'bg-slate-700 text-white rounded-tr-none'
                                : 'bg-blue-100 text-blue-900 rounded-tl-none'
                            }`}>
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              <p className={`text-[10px] mt-1.5 ${isAdminMsg ? 'text-slate-300' : 'text-blue-400'}`}>
                                {isAdminMsg ? 'MBA' : 'Client'} · {msgDate}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Admin compose */}
                    <div className="flex gap-2 items-end">
                      <textarea
                        rows={2}
                        placeholder="Reply to client…"
                        value={adminNewMessage[sub.id] ?? ''}
                        onChange={e => setAdminNewMessage(prev => ({ ...prev, [sub.id]: e.target.value }))}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendAdminMessage(sub);
                          }
                        }}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      />
                      <Button
                        onClick={() => sendAdminMessage(sub)}
                        disabled={isSendingMsg || !(adminNewMessage[sub.id] ?? '').trim()}
                        className="shrink-0 text-sm py-2 px-3 bg-slate-700 hover:bg-slate-800"
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        {isSendingMsg ? 'Sending…' : 'Send'}
                      </Button>
                    </div>
                  </div>

                  {/* ── Return with edits ── */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Return with Edits</p>
                      {!isReturned && (
                        <button
                          onClick={() => setShowReturnForm(prev => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                          className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          {showReturn ? 'Cancel' : 'Return to Client'}
                        </button>
                      )}
                    </div>

                    {/* Show existing return reason */}
                    {isReturned && sub.return_reason && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-xs font-semibold text-purple-700 mb-1.5 flex items-center gap-1.5">
                          <RotateCcw className="w-3.5 h-3.5" />
                          Returned to client{sub.returned_at ? ` · ${new Date(sub.returned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                        </p>
                        <p className="text-sm text-purple-900 whitespace-pre-wrap">{sub.return_reason}</p>
                        <button
                          onClick={() => {
                            setReturnInputs(prev => ({ ...prev, [sub.id]: sub.return_reason ?? '' }));
                            setShowReturnForm(prev => ({ ...prev, [sub.id]: true }));
                          }}
                          className="mt-2 text-xs text-purple-600 hover:underline"
                        >
                          Send updated message
                        </button>
                      </div>
                    )}

                    {/* Return form */}
                    {showReturn && (
                      <div className="space-y-2 mt-2">
                        <textarea
                          rows={4}
                          placeholder="Explain what needs to be corrected or provide missing information. This message will be emailed directly to the client."
                          value={returnMsg}
                          onChange={e => setReturnInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400">
                            An email will be sent to {sub.email ?? 'the client'}.
                          </p>
                          <Button
                            onClick={() => handleReturnWithEdits(sub)}
                            disabled={returningId === sub.id || !returnMsg.trim()}
                            className="text-sm py-2 px-4 bg-purple-600 hover:bg-purple-700"
                          >
                            <Send className="w-3.5 h-3.5 mr-1.5" />
                            {returningId === sub.id ? 'Sending…' : 'Send Return'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {!isReturned && !showReturn && (
                      <p className="text-xs text-slate-400">
                        Use this to send the form back to the client with notes on what needs to be fixed.
                      </p>
                    )}
                  </div>

                  {/* ── Tracking number ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tracking Number</p>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1 max-w-xs">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. 9400111899223397622887"
                          value={trackingVal}
                          onChange={e => setTrackingInputs(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono placeholder:font-sans placeholder:text-slate-400"
                        />
                      </div>
                      <Button
                        onClick={() => handleSaveTracking(sub.id)}
                        disabled={savingTracking === sub.id || !trackingChanged}
                        className={`text-sm py-2 px-3 shrink-0 ${trackingChanged ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 cursor-not-allowed'}`}
                      >
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        {savingTracking === sub.id ? 'Saving…' : 'Save'}
                      </Button>
                    </div>
                    {sub.tracking_number && (
                      <p className="text-xs text-slate-400 mt-1.5">
                        <a
                          href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${sub.tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          Track on USPS →
                        </a>
                      </p>
                    )}
                  </div>

                  {/* ── Authorization signature ── */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Client Authorization Signature</p>
                    {sub.agent_auth_signature ? (
                      <div className="inline-block bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <img
                          src={sub.agent_auth_signature}
                          alt="Client authorization signature"
                          className="max-h-24 w-auto max-w-xs"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        No authorization signature on file.
                      </div>
                    )}
                  </div>

                  {/* ── Meta ── */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Submission ID', value: sub.id },
                      { label: 'User ID',        value: sub.user_id },
                      { label: 'PDF Path',       value: sub.pdf_storage_path ?? '—' },
                      { label: 'Status',         value: sub.submission_status },
                    ].map(row => (
                      <div key={row.label} className="bg-white rounded-lg border border-slate-200 px-4 py-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{row.label}</p>
                        <p className="text-xs font-mono text-slate-700 break-all">{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
