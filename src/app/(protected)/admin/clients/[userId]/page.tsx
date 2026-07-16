'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  User,
  AlertCircle,
  Package,
  RotateCcw,
  Send,
  StickyNote,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

// ── Mirrors the queue's AgentSubmission shape (get_agent_submissions). ──
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

// ── Plaintext contact block from get_client_detail (NO ssn / va_file_number). ──
interface ClientDetail {
  id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  suffix: string | null;
  dob: string | null;
  sex: string | null;
  email: string | null;
  phone_home: string | null;
  phone_mobile: string | null;
  address_street: string | null;
  address_apt: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  address_country: string | null;
}

interface ClientNote {
  id: string;
  body: string;
  created_at: string;
  author_email: string | null;
}

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

export default function ClientCaseViewPage() {
  const params = useParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : (params.userId as string);

  const [detail, setDetail]           = useState<ClientDetail | null>(null);
  const [submissions, setSubmissions] = useState<AgentSubmission[]>([]);
  const [notes, setNotes]             = useState<ClientNote[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Notes compose state
  const [noteBody, setNoteBody]   = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [notesError, setNotesError] = useState('');

  const loadNotes = useCallback(async () => {
    if (!userId) return;
    setNotesError('');
    const supabase = createClient();
    const { data, error: rpcErr } = await supabase.rpc('get_client_notes', { p_user_id: userId });
    if (rpcErr) {
      console.error('[get_client_notes]', rpcErr);
      setNotesError(rpcErr.message ?? 'Failed to load notes.');
    } else if (Array.isArray(data)) {
      setNotes(data as ClientNote[]);
    }
  }, [userId]);

  const loadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();

      // Contact block for this veteran.
      const { data: detailRows, error: detailErr } = await supabase.rpc('get_client_detail', {
        p_user_id: userId,
      });
      if (detailErr) throw detailErr;
      const det = Array.isArray(detailRows) ? (detailRows[0] as ClientDetail | undefined) : undefined;
      setDetail(det ?? null);

      // Reuse the queue RPC; filter to this user for the consolidated forms list.
      const { data: subRows, error: subErr } = await supabase.rpc('get_agent_submissions');
      if (subErr) throw subErr;
      const mine = ((subRows ?? []) as AgentSubmission[]).filter(s => s.user_id === userId);
      setSubmissions(mine);

      await loadNotes();
    } catch (err: any) {
      setError(err.message ?? 'Failed to load client case.');
    } finally {
      setLoading(false);
    }
  }, [userId, loadNotes]);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function handleDownload(sub: AgentSubmission) {
    if (!sub.pdf_storage_path) { alert('No PDF path on file for this submission.'); return; }
    setDownloadingId(sub.id);
    // Open the tab synchronously within the click gesture so popup blockers allow it.
    const pdfWindow = window.open('', '_blank');
    try {
      const supabase = createClient();
      const { data, error: urlErr } = await supabase.storage
        .from('form_submissions')
        .createSignedUrl(sub.pdf_storage_path, 3600);
      if (urlErr || !data?.signedUrl) throw urlErr ?? new Error('No signed URL returned');
      if (pdfWindow) pdfWindow.location.href = data.signedUrl;
      else window.open(data.signedUrl, '_blank');
    } catch (err: any) {
      pdfWindow?.close();
      alert('Download failed: ' + (err.message ?? 'Unknown error'));
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleAddNote() {
    if (savingNote) return;
    const body = noteBody.trim();
    if (!body) return;
    setSavingNote(true);
    try {
      const supabase = createClient();
      const { error: rpcErr } = await supabase.rpc('add_client_note', {
        p_user_id: userId,
        p_body: body,
      });
      if (rpcErr) throw rpcErr;
      setNoteBody('');
      await loadNotes();
    } catch (err: any) {
      alert('Error saving note: ' + (err.message ?? 'Unknown error'));
    } finally {
      setSavingNote(false);
    }
  }

  // Prefer the contact block; fall back to whatever the submissions carry.
  const fullName =
    [detail?.first_name, detail?.middle_name, detail?.last_name, detail?.suffix]
      .filter(Boolean).join(' ')
    || [submissions[0]?.first_name, submissions[0]?.last_name].filter(Boolean).join(' ')
    || 'Unknown client';

  const email = detail?.email ?? submissions[0]?.email ?? null;

  const addressLine1 = [detail?.address_street, detail?.address_apt].filter(Boolean).join(', ');
  const addressLine2 = [
    [detail?.address_city, detail?.address_state].filter(Boolean).join(', '),
    detail?.address_zip,
  ].filter(Boolean).join(' ');
  const hasAddress = !!(addressLine1 || addressLine2);

  const dobFmt = detail?.dob
    ? new Date(detail.dob + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back link */}
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4" />
          Back to queue
        </Link>

        {/* Error */}
        {error && (
          <div className="flex gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800 text-sm">Failed to load client case</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16" role="status">
            <div className="animate-spin w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading client case…</p>
          </div>
        )}

        {/* Client not found — bad or stale link */}
        {!loading && !error && !detail && submissions.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-14 text-center">
            <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-medium text-slate-500">Client not found</p>
            <p className="text-sm text-slate-400 mt-1">
              We couldn&apos;t find a client with this ID. The link may be out of date.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to queue
            </Link>
          </div>
        )}

        {!loading && (detail || submissions.length > 0) && (
          <>
            {/* ── Contact block ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-slate-900 leading-tight truncate">{fullName}</h1>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">{userId}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email
                  </p>
                  <p className="text-sm text-slate-700 break-all">{email ?? '—'}</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" /> Phone
                  </p>
                  <p className="text-sm text-slate-700">
                    {detail?.phone_mobile || detail?.phone_home || '—'}
                    {detail?.phone_mobile && detail?.phone_home && detail.phone_mobile !== detail.phone_home && (
                      <span className="text-slate-400"> · {detail.phone_home} (home)</span>
                    )}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Date of Birth</p>
                  <p className="text-sm text-slate-700">{dobFmt ?? '—'}</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Sex</p>
                  <p className="text-sm text-slate-700">{detail?.sex ?? '—'}</p>
                </div>

                <div className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3 sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> Mailing Address
                  </p>
                  {hasAddress ? (
                    <p className="text-sm text-slate-700">
                      {addressLine1 && <>{addressLine1}<br /></>}
                      {addressLine2}
                      {detail?.address_country && detail.address_country !== 'US' && (
                        <><br />{detail.address_country}</>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400">—</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Consolidated forms ── */}
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Forms ({submissions.length})
              </h2>

              {submissions.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                  <FileText className="w-9 h-9 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No agent-filing forms for this client yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map(sub => {
                    const statusCfg = STATUS_CONFIG[sub.submission_status] ?? STATUS_CONFIG.agent_pending;
                    const date = new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const time = new Date(sub.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    const isPending  = sub.submission_status === 'agent_pending';
                    const isReturned = sub.submission_status === 'agent_returned';

                    return (
                      <div
                        key={sub.id}
                        className={`bg-white rounded-xl border p-5 ${
                          isPending ? 'border-amber-200 shadow-sm' :
                          isReturned ? 'border-purple-200 shadow-sm' :
                          'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
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

                            <p className="font-semibold text-slate-900 text-base leading-tight">{sub.form_name}</p>
                            <p className="text-xs text-slate-400 font-mono uppercase mt-0.5">{sub.form_id}</p>

                            {isReturned && sub.return_reason && (
                              <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1.5">
                                  <RotateCcw className="w-3 h-3" />
                                  Returned to client
                                  {sub.returned_at ? ` · ${new Date(sub.returned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                                </p>
                                <p className="text-sm text-purple-900 whitespace-pre-wrap">{sub.return_reason}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 shrink-0 items-end">
                            <Button
                              variant="outline"
                              onClick={() => handleDownload(sub)}
                              disabled={downloadingId === sub.id}
                              className="text-sm py-1.5 px-3"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              {downloadingId === sub.id ? 'Opening…' : 'PDF'}
                            </Button>
                            <Link
                              href={`/admin?status=${sub.submission_status}`}
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Manage in queue →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Private notes ── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" />
                Private Notes
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Internal notes about this client. Visible only to representatives — never to the client.
              </p>

              {/* Compose */}
              <div className="flex gap-2 items-end mb-4">
                <textarea
                  rows={2}
                  placeholder="Add a private note about this client…"
                  value={noteBody}
                  onChange={e => setNoteBody(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                />
                <Button
                  onClick={handleAddNote}
                  disabled={savingNote || !noteBody.trim()}
                  className="shrink-0 text-sm py-2 px-3 bg-slate-700 hover:bg-slate-800"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {savingNote ? 'Saving…' : 'Add Note'}
                </Button>
              </div>

              {/* Thread */}
              {notesError ? (
                <p className="text-xs text-red-600 text-center py-4">
                  Couldn&apos;t load notes.{' '}
                  <button
                    onClick={() => loadNotes()}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Retry
                  </button>
                </p>
              ) : notes.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No notes yet.</p>
              ) : (
                <div className="space-y-2">
                  {notes.map(note => {
                    const when = new Date(note.created_at).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
                    });
                    return (
                      <div key={note.id} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{note.body}</p>
                        <p className="text-[11px] text-slate-400 mt-1.5">
                          {note.author_email ?? 'Representative'} · {when}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
