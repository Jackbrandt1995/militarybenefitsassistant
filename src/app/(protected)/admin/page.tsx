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
}

type FilterType = 'all' | 'agent_pending' | 'agent_mailed';

export default function AdminPage() {
  const [submissions, setSubmissions]       = useState<AgentSubmission[]>([]);
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [filter, setFilter]                 = useState<FilterType>('agent_pending');
  const [expanded, setExpanded]             = useState<Record<string, boolean>>({});
  const [mailingId, setMailingId]           = useState<string | null>(null);
  const [downloadingId, setDownloadingId]   = useState<string | null>(null);
  const [error, setError]                   = useState('');

  // Per-submission tracking input state
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [savingTracking, setSavingTracking] = useState<string | null>(null);

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
      // Seed tracking inputs with existing values
      const seeds: Record<string, string> = {};
      rows.forEach(r => { seeds[r.id] = r.tracking_number ?? ''; });
      setTrackingInputs(prev => ({ ...seeds, ...prev }));
    } catch (err: any) {
      setError(err.message ?? 'Failed to load submissions.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);

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
      const { error: rpcError } = await supabase.rpc('mark_submission_mailed', {
        p_submission_id: id,
      });
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

  function toggleExpand(id: string) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const filtered = submissions.filter(s =>
    filter === 'all' || s.submission_status === filter
  );

  const pendingCount = submissions.filter(s => s.submission_status === 'agent_pending').length;
  const mailedCount  = submissions.filter(s => s.submission_status === 'agent_mailed').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent Filing Queue</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Forms clients have authorized MBA to print and mail to VA.
            </p>
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
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-amber-200 p-5 text-center">
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">Awaiting Mailing</p>
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

        {/* Filter tabs */}
        <div className="flex gap-2">
          {([
            { value: 'agent_pending', label: 'Pending' },
            { value: 'agent_mailed', label: 'Mailed' },
            { value: 'all',          label: 'All' },
          ] as { value: FilterType; label: string }[]).map(tab => (
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
              {tab.value !== 'all' && (
                <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${
                  filter === tab.value ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.value === 'agent_pending' ? pendingCount : mailedCount}
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
              <p className="text-xs text-red-600 mt-2">
                Make sure the <code className="bg-red-100 px-1 rounded">get_agent_submissions</code> SQL
                function has been created in Supabase.
              </p>
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
            <p className="font-medium text-slate-500">
              No {filter === 'all' ? '' : filter === 'agent_pending' ? 'pending ' : 'mailed '}submissions yet.
            </p>
          </div>
        )}

        {/* Submission cards */}
        {!loading && filtered.map(sub => {
          const isExpanded = !!expanded[sub.id];
          const isPending  = sub.submission_status === 'agent_pending';
          const fullName   = [sub.first_name, sub.last_name].filter(Boolean).join(' ') || 'Unknown';
          const date       = new Date(sub.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          });
          const time       = new Date(sub.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit',
          });
          const trackingVal    = trackingInputs[sub.id] ?? sub.tracking_number ?? '';
          const trackingChanged = trackingVal !== (sub.tracking_number ?? '');

          return (
            <div
              key={sub.id}
              className={`bg-white rounded-xl border overflow-hidden transition-shadow ${
                isPending ? 'border-amber-200 shadow-sm' : 'border-slate-200'
              }`}
            >
              {/* Card top row */}
              <div className="p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Status + date */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      isPending
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isPending
                        ? <Clock className="w-3 h-3" />
                        : <CheckCircle className="w-3 h-3" />}
                      {isPending ? 'Awaiting Mailing' : 'Mailed'}
                    </span>
                    {sub.tracking_number && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        <Package className="w-3 h-3" />
                        {sub.tracking_number}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">{date} at {time}</span>
                  </div>

                  {/* Form */}
                  <p className="font-semibold text-slate-900 text-lg leading-tight">{sub.form_name}</p>
                  <p className="text-xs text-slate-400 font-mono uppercase mt-0.5">{sub.form_id}</p>

                  {/* Client */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{fullName}</span>
                    {sub.email && (
                      <span className="text-sm text-slate-400">· {sub.email}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0 items-end">
                  <div className="flex gap-2">
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
                    {isExpanded ? (
                      <><ChevronUp className="w-3.5 h-3.5" /> Hide details</>
                    ) : (
                      <><ChevronDown className="w-3.5 h-3.5" /> View signature & details</>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded panel */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-5 space-y-5">

                  {/* Tracking number */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Tracking Number
                    </p>
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
                        className={`text-sm py-2 px-3 shrink-0 ${
                          trackingChanged
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        {savingTracking === sub.id ? 'Saving…' : 'Save'}
                      </Button>
                    </div>
                    {sub.tracking_number && (
                      <p className="text-xs text-slate-400 mt-1.5">
                        Visible to client on their History page.{' '}
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

                  {/* Authorization signature */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Client Authorization Signature
                    </p>
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
                        No authorization signature on file for this submission.
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Submission ID', value: sub.id },
                      { label: 'User ID',        value: sub.user_id },
                      { label: 'PDF Path',       value: sub.pdf_storage_path ?? '—' },
                      { label: 'Status',         value: sub.submission_status },
                    ].map(row => (
                      <div key={row.label} className="bg-white rounded-lg border border-slate-200 px-4 py-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                          {row.label}
                        </p>
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
