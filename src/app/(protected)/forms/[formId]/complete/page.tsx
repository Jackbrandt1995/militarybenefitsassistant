'use client';

import { use, useState, useEffect, useRef } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getFormById } from '@/lib/forms/registry';
import { useAuth } from '@/components/AuthProvider';
import { fillPdf, downloadPdf, mergePdfsWithAttachments } from '@/lib/pdf/fillPdf';
import { getFieldMapping } from '@/lib/pdf/fieldMappings';
import { getFormFiles, clearFormFiles } from '@/lib/fileCache';
import { createClient } from '@/lib/supabase/client';
import {
  SUBMISSION_GUIDES,
  getRpoForState,
  US_STATES,
  type SubmissionGuide,
  type RPO,
} from '@/lib/forms/submissionInstructions';
import SignaturePad from '@/components/SignaturePad';
import Button from '@/components/ui/Button';
import {
  CheckCircle,
  Download,
  FileText,
  ArrowLeft,
  AlertCircle,
  Mail,
  ClipboardList,
} from 'lucide-react';

export default function CompletePage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const form = getFormById(formId);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // PDF generation state
  const [status, setStatus] = useState<'generating' | 'ready' | 'error'>('generating');
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  // Seed from sessionStorage so a refresh of this page reuses the submission
  // row recorded on the first visit instead of inserting a duplicate (the
  // draft snapshot survives until download/agent-filing, so Effect 2 would
  // otherwise re-record on every reload).
  const [submissionId, setSubmissionId] = useState<string | null>(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem(`form-wizard-${formId}-sid`) : null,
  );
  // Ref (not state) so two rapid retry clicks can't start two POSTs before a
  // re-render lands; the state mirror below only drives the button UI.
  const recordingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [wizardAttachedCount, setWizardAttachedCount] = useState(0);
  const [skippedFileNames, setSkippedFileNames] = useState<string[]>([]);
  const [uploadStepHadNoFiles, setUploadStepHadNoFiles] = useState(false);
  const [safeAnswers, setSafeAnswers] = useState<Record<string, string | boolean> | null>(null);
  const [recordAttempt, setRecordAttempt] = useState(0);

  // Submission mode
  const [submissionMode, setSubmissionMode] = useState<'self' | 'agent' | null>(null);
  const [userState, setUserState] = useState('');

  // Agent filing state
  const [agentSig, setAgentSig] = useState('');
  const [agentAuthorized, setAgentAuthorized] = useState(false);
  const [isAuthorizingAgent, setIsAuthorizingAgent] = useState(false);
  const [agentError, setAgentError] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  const guide: SubmissionGuide | undefined = SUBMISSION_GUIDES[formId];

  // Effect 1: Generate PDF — runs once when the form is available.
  // Intentionally excludes `user` from deps so auth loading never triggers
  // a second run.
  useEffect(() => {
    if (!form) return;

    async function generate() {
      try {
        const stored = sessionStorage.getItem(`form-wizard-${formId}`);
        if (!stored) {
          setErrorMsg('No form data found. Please go back and complete the form.');
          setStatus('error');
          return;
        }
        const { answers: rawAnswers } = JSON.parse(stored);
        const answers = form!.computeAnswers ? form!.computeAnswers(rawAnswers) : rawAnswers;

        // Pre-populate state for RPO lookup from form answers
        const stateFromAnswers =
          (answers.state as string) ||
          (answers.currentState as string) ||
          (answers.mailingState as string) ||
          '';
        if (stateFromAnswers) setUserState(stateFromAnswers.toUpperCase());

        const mapping = getFieldMapping(formId);
        if (!mapping) {
          setErrorMsg('Field mapping not found for this form.');
          setStatus('error');
          return;
        }

        let bytes = await fillPdf(form!.pdfTemplate, answers, mapping);

        const wizardFiles = getFormFiles();
        const hasUploadStep = form!.steps.some(s =>
          ['requiredDocs', 'optionalDocs', 'attachments'].includes(s.id),
        );
        if (wizardFiles.length > 0) {
          try {
            bytes = await mergePdfsWithAttachments(bytes, wizardFiles);
            setWizardAttachedCount(wizardFiles.filter(f => f.type === 'application/pdf').length);
            // Only PDFs can be merged — tell the veteran which files were left
            // out so they know to mail them separately.
            setSkippedFileNames(wizardFiles.filter(f => f.type !== 'application/pdf').map(f => f.name));
          } catch (mergeErr) {
            console.warn('Wizard attachment merge (non-fatal):', mergeErr);
            setSkippedFileNames(wizardFiles.map(f => f.name));
          }
          clearFormFiles();
        } else if (hasUploadStep) {
          // Uploaded files live in an in-memory cache that does not survive a
          // full page reload — surface that instead of silently merging nothing.
          setUploadStepHadNoFiles(true);
        }

        // Scrub sensitive data before storing answers_json. `answers` here is the
        // COMPUTED set, so this must also catch derived keys (ssnFormatted,
        // spouseSsnFormatted) — not just the raw field ids — plus a value-level
        // net for any stray dashed SSN. The stored history must never hold PII.
        const sensitiveFieldIds = new Set<string>();
        for (const step of form!.steps) {
          for (const field of step.fields) {
            if (field.type === 'ssn' || field.sensitive === true) {
              sensitiveFieldIds.add(field.id);
            }
          }
        }
        const isSensitiveKey = (k: string) =>
          sensitiveFieldIds.has(k) || /ssn|routing|account|bank|vafile|filenumber/i.test(k);
        const looksLikeSSN = (v: unknown) =>
          typeof v === 'string' && /^\d{3}-\d{2}-\d{4}$/.test(v.trim());
        const safe: Record<string, string | boolean> = {};
        for (const [k, v] of Object.entries(answers)) {
          if (isSensitiveKey(k) || looksLikeSSN(v)) continue;
          safe[k] = v as string | boolean;
        }

        // NOTE: the sessionStorage snapshot and localStorage draft are NOT
        // cleared here — they're cleared in clearStoredDrafts() once the
        // veteran has actually downloaded the PDF (or authorized agent
        // filing). That way a refresh before download can regenerate instead
        // of losing every answer.
        setPdfBytes(bytes);
        setSafeAnswers(safe);
        setStatus('ready');
      } catch (err) {
        console.error('PDF generation error:', err);
        setErrorMsg(err instanceof Error ? err.message : 'Failed to generate PDF.');
        setStatus('error');
      }
    }

    generate();
  }, [form, formId]);

  // Effect 2: Record submission once PDF is ready AND user session is resolved.
  // Kept separate so auth loading never interferes with PDF generation.
  useEffect(() => {
    if (!user || !safeAnswers || status !== 'ready' || submissionId) return;

    async function record() {
      if (recordingRef.current) return; // a POST is already in flight
      recordingRef.current = true;
      setIsRecording(true);
      try {
        // Server route encrypts the answers at rest (keeps only name + email
        // plaintext) and returns the new submission id.
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formId, formName: form!.title, answers: safeAnswers }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          // Surface the real reason instead of leaving submissionId silently null
          // (which later shows a misleading "Session error" on agent filing).
          console.error('[submissions] failed', res.status, json);
          setSubmissionError(
            res.status === 403
              ? "We couldn't save this submission because your account isn't verified for secure actions (two-step verification). You can still download the PDF."
              : res.status === 401
                ? 'Your session has expired — please sign in again to save this submission.'
                : (json?.error || "We couldn't save this submission. Please try again."),
          );
          return;
        }
        setSubmissionError('');
        setSubmissionId(json?.id ?? null);
        // Remember the row this page created so a refresh (the draft snapshot
        // survives until download/agent-filing) doesn't insert a duplicate.
        if (json?.id) sessionStorage.setItem(`form-wizard-${formId}-sid`, json.id);
      } catch (dbErr) {
        console.error('Submission record error:', dbErr);
        setSubmissionError("We couldn't save this submission — please check your connection and try again.");
      } finally {
        recordingRef.current = false;
        setIsRecording(false);
      }
    }

    record();
  }, [user, safeAnswers, status, submissionId, formId, form, recordAttempt]);

  if (!form) notFound();

  // Auth resolved to signed-out: Effect 2 can never run, so the submission
  // will never be saved. Derived (not stored) so it clears if the user signs
  // back in from another tab and the save then succeeds.
  const sessionExpired = status === 'ready' && !authLoading && !user && !submissionId;

  // Clear saved answers only once the veteran actually has the PDF (download
  // or agent filing) — until then, a refresh can regenerate from the draft.
  function clearStoredDrafts() {
    sessionStorage.removeItem(`form-wizard-${formId}`);
    sessionStorage.removeItem(`form-wizard-${formId}-sid`); // next submission gets its own row
    localStorage.removeItem(`wizard-${formId}`); // stops showing under "In Progress"
  }

  function handleDownload() {
    if (pdfBytes) {
      downloadPdf(pdfBytes, `${form!.formNumber.replace(/\s+/g, '-')}-filled.pdf`);
      clearStoredDrafts();
    }
  }

  async function handleAgentAuthorize() {
    if (!agentSig) { setAgentError('Please draw your authorization signature above.'); return; }
    if (!user || !submissionId || !pdfBytes) {
      setAgentError(
        submissionError ||
        (sessionExpired
          ? 'Your session has expired — please sign in again before authorizing MBA to file for you.'
          : "We couldn't record your submission, so it can't be sent for filing yet. Please refresh and try again."),
      );
      return;
    }
    setIsAuthorizingAgent(true);
    setAgentError('');
    try {
      const supabase = createClient();

      // Upload the filled PDF so MBA staff can retrieve it
      const pdfPath = `${user.id}/${submissionId}/form.pdf`;
      const { error: uploadErr } = await supabase.storage
        .from('form_submissions')
        .upload(
          pdfPath,
          new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' }),
          { contentType: 'application/pdf' },
        );
      // If a previous attempt uploaded this file but a later step failed, the
      // retry hits "The resource already exists" — that earlier upload is this
      // exact same PDF, so treat it as success instead of dead-ending.
      if (uploadErr && !/already exists/i.test(uploadErr.message)) throw uploadErr;

      // Record authorization via RPC — bypasses PostgREST schema cache entirely
      const { error: updateErr } = await supabase.rpc('record_agent_filing', {
        p_submission_id: submissionId,
        p_user_id: user.id,
        p_agent_auth_signature: agentSig,
        p_pdf_storage_path: pdfPath,
      });
      if (updateErr) throw updateErr;

      // Send notification email to MBA staff (non-fatal — don't block confirmation)
      try {
        const firstName = (safeAnswers?.firstName as string) ?? '';
        const lastName  = (safeAnswers?.lastName  as string) ?? '';
        const userName  = [firstName, lastName].filter(Boolean).join(' ') || (user.email ?? 'Unknown');

        await fetch('/api/notify-filing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName,
            formName:     form!.title,
            formId,
            userEmail:    user.email,
            submissionId,
            submittedAt:  new Date().toISOString(),
          }),
        });
      } catch (emailErr) {
        console.warn('Notification email failed (non-fatal):', emailErr);
      }

      clearStoredDrafts();
      setAgentAuthorized(true);
    } catch (err) {
      console.error('Agent authorization error:', err);
      setAgentError(
        'Something went wrong while sending your form — please try again. ' +
        'Your PDF is still available to download above, so you can also mail it yourself.',
      );
    } finally {
      setIsAuthorizingAgent(false);
    }
  }

  // ── Derived values for self-submit UI ─────────────────────────────────────
  const officeType = guide?.officeType ?? 'rpo';
  const rpo = (officeType === 'rpo' || officeType === 'rpo-with-school')
    ? getRpoForState(userState)
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Generating spinner ────────────────────────────────────────────── */}
        {status === 'generating' && (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-slate-900">Generating Your PDF…</h1>
            <p className="text-slate-500 mt-2">Filling in {form.formNumber} with your answers.</p>
          </div>
        )}

        {/* ── Error ─────────────────────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-red-700 mb-2">Generation Failed</h1>
            <p className="text-slate-600 mb-6">{errorMsg}</p>
            <Button variant="outline" onClick={() => router.push(`/forms/${formId}`)}>
              Back to Form
            </Button>
          </div>
        )}

        {/* ── Ready ─────────────────────────────────────────────────────────── */}
        {status === 'ready' && (
          <>
            {/* Header card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-slate-900">{form.formNumber} is Ready</h1>
              <p className="text-slate-500 mt-1">{form.title}</p>

              {wizardAttachedCount > 0 && (
                <p className="mt-2 text-sm text-green-700 font-medium">
                  ✓ {wizardAttachedCount} supporting PDF{wizardAttachedCount > 1 ? 's' : ''} merged into this download
                </p>
              )}

              {skippedFileNames.length > 0 && (
                <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 text-left">
                  <p className="text-sm font-semibold text-amber-900">
                    {skippedFileNames.length} uploaded file{skippedFileNames.length > 1 ? 's' : ''} could
                    not be merged into this PDF: {skippedFileNames.join(', ')}
                  </p>
                  <p className="text-sm text-amber-800 mt-1">
                    Only PDF files can be merged. Print these documents separately and include
                    them in your envelope.
                  </p>
                </div>
              )}

              {uploadStepHadNoFiles && (
                <p className="mt-3 text-sm text-slate-500">
                  This download contains only the filled form — no uploaded documents were merged.
                  If you uploaded documents earlier, print them and include copies in your envelope.
                </p>
              )}

              <Button onClick={handleDownload} className="mt-5 w-full sm:w-auto px-8">
                <Download className="w-4 h-4 mr-2" />
                Download Filled PDF
              </Button>
            </div>

            {/* Submission save failed — the PDF is fine, but it wasn't recorded to history */}
            {(submissionError || sessionExpired) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Your PDF is ready to download, but it wasn&apos;t saved to your history.
                  </p>
                  <p className="text-sm text-amber-800 mt-0.5">
                    {submissionError ||
                      'Your session has expired — sign in again to save this submission to your history.'}
                  </p>
                  {submissionError && (
                    <button
                      onClick={() => { setSubmissionError(''); setRecordAttempt(a => a + 1); }}
                      disabled={isRecording}
                      className="mt-2 text-sm font-semibold text-amber-900 underline hover:text-amber-700 disabled:opacity-60 disabled:no-underline"
                    >
                      {isRecording ? 'Saving…' : 'Try saving again'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Submission choice ─────────────────────────────────────────── */}
            {!agentAuthorized && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">How would you like to submit?</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Option 1 — Self */}
                  <button
                    onClick={() => setSubmissionMode(submissionMode === 'self' ? null : 'self')}
                    className={`text-left rounded-xl border-2 p-5 transition-all ${
                      submissionMode === 'self'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <Mail className={`w-7 h-7 mb-2 ${submissionMode === 'self' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <p className="font-semibold text-slate-900">I&apos;ll submit it myself</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Step-by-step instructions to find the correct VA office and mail your package.
                    </p>
                  </button>

                  {/* Option 2 — Agent */}
                  <button
                    onClick={() => setSubmissionMode(submissionMode === 'agent' ? null : 'agent')}
                    className={`text-left rounded-xl border-2 p-5 transition-all ${
                      submissionMode === 'agent'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <ClipboardList className={`w-7 h-7 mb-2 ${submissionMode === 'agent' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <p className="font-semibold text-slate-900">Have MBA file for me</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Authorize Military Benefits Assistant to print and mail this form to VA on your behalf.
                    </p>
                  </button>
                </div>

                {/* ── Self-submit: step-by-step guide ──────────────────────── */}
                {submissionMode === 'self' && (
                  <div className="mt-2 border-t border-gray-100 pt-5 space-y-0">

                    {/* ── THROUGH-SCHOOL FORMS (e.g. 22-1999c) ──────────────── */}
                    {guide?.officeType === 'through-school' && (
                      <div className="space-y-3">
                        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                          <p className="font-semibold text-amber-900 text-sm">
                            ⚠ Do not mail this form directly to VA — it goes through your school.
                          </p>
                        </div>
                        {[
                          {
                            n: 1, title: 'Print your form',
                            body: `Download the PDF above and print all pages on standard 8.5″ × 11″ white paper. Do not staple — use a binder clip or paper clip.`,
                          },
                          {
                            n: 2, title: 'Check the date requirement',
                            body: `You may only sign and submit this form on or after the 7th calendar day from your enrollment agreement date. If you haven't reached that date yet, wait before proceeding.`,
                          },
                          {
                            n: 3, title: 'Make a photocopy for your records',
                            body: `Before handing anything over, photocopy every page. Label the copies "MY COPY — DO NOT SUBMIT" and keep them somewhere safe.`,
                          },
                          {
                            n: 4, title: 'Deliver to your school\'s VA Certifying Official',
                            body: guide?.schoolNote ?? '',
                          },
                        ].map(step => (
                          <StepCard key={step.n} number={step.n} title={step.title} body={step.body} />
                        ))}
                        {guide?.timeline && (
                          <p className="text-xs text-slate-500 italic pt-1">⏱ {guide.timeline}</p>
                        )}
                      </div>
                    )}

                    {/* ── FORMS REQUIRING EXTRA SIGNATURES BEFORE MAILING (e.g. 22-1990t) ── */}
                    {guide?.officeType === 'rpo' && guide?.schoolNote && (
                      <div className="space-y-3">
                        <StepCard number={1} title="Print your form"
                          body={`Download the PDF above and print all pages on standard 8.5″ × 11″ white paper. Do not staple.`} />
                        <StepCard number={2} title="Collect required signatures — in this exact order"
                          body={guide.schoolNote} />
                        <StepCard number={3} title="Gather your supporting documents"
                          body="Assemble the documents listed below before sealing your envelope."
                          list={guide.whatToInclude} />
                        <StepCard number={4} title="Make photocopies of everything"
                          body={`Photocopy every page — your signed form plus all supporting documents. Label the set "MY COPIES — DO NOT SUBMIT" and store them somewhere safe. If VA loses your package, these are your only backup.`} />
                        <MailingSteps
                          stepOffset={5}
                          formNumber={form!.formNumber}
                          officeType="rpo"
                          userState={userState}
                          setUserState={setUserState}
                          rpo={rpo}
                          timeline={guide.timeline}
                          moreInfo={guide.moreInfo}
                        />
                      </div>
                    )}

                    {/* ── STANDARD RPO MAIL FORMS ────────────────────────────── */}
                    {(guide?.officeType === 'rpo' && !guide?.schoolNote) && (
                      <div className="space-y-3">
                        <StepCard number={1} title="Print your form"
                          body={`Download the PDF above and print all pages on standard 8.5″ × 11″ white paper. Do not staple — use a binder clip or paper clip.`} />
                        <StepCard number={2} title="Gather your supporting documents"
                          body="Collect each of the documents listed below before you seal the envelope."
                          list={guide.whatToInclude} />
                        {guide.moreInfo && (
                          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                            <p className="text-sm text-slate-700 whitespace-pre-line">{guide.moreInfo}</p>
                          </div>
                        )}
                        <StepCard number={3} title="Make photocopies of everything"
                          body={`Before you seal anything, photocopy every page — your signed form plus every supporting document. Label the set "MY COPIES — DO NOT SUBMIT" and store them somewhere safe. If VA loses your package, these are your only backup.`} />
                        <MailingSteps
                          stepOffset={4}
                          formNumber={form!.formNumber}
                          officeType="rpo"
                          userState={userState}
                          setUserState={setUserState}
                          rpo={rpo}
                          timeline={guide.timeline}
                          moreInfo={undefined}
                        />
                      </div>
                    )}

                    {/* ── RPO + SCHOOL NOTIFICATION (e.g. 22-1995, 22-5495) ─── */}
                    {guide?.officeType === 'rpo-with-school' && (
                      <div className="space-y-3">
                        <StepCard number={1} title="Print your form"
                          body={`Download the PDF above and print all pages on standard 8.5″ × 11″ white paper. Do not staple.`} />
                        <StepCard number={2} title="Gather your supporting documents"
                          body="Collect each of the documents listed below before you seal the envelope."
                          list={guide.whatToInclude} />
                        <StepCard number={3} title="Make photocopies of everything"
                          body={`Photocopy every page — form and all attachments. Label the set "MY COPIES — DO NOT SUBMIT" and keep them safe.`} />
                        <MailingSteps
                          stepOffset={4}
                          formNumber={form!.formNumber}
                          officeType="rpo"
                          userState={userState}
                          setUserState={setUserState}
                          rpo={rpo}
                          timeline={guide.timeline}
                          moreInfo={undefined}
                        />
                        {guide.schoolNote && (
                          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-2">
                            <p className="font-semibold text-amber-900 text-sm mb-1">Also notify your school</p>
                            <p className="text-sm text-amber-800">{guide.schoolNote}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── VR&E REGIONAL OFFICE (28-1900) ────────────────────── */}
                    {guide?.officeType === 'regional-office' && (
                      <div className="space-y-3">
                        <StepCard number={1} title="Print your form"
                          body={`Download the PDF above and print all pages on standard 8.5″ × 11″ white paper. Do not staple.`} />
                        <StepCard number={2} title="Gather your supporting documents"
                          body="Collect each of the documents listed below before you seal the envelope."
                          list={guide.whatToInclude} />
                        <StepCard number={3} title="Make photocopies of everything"
                          body={`Photocopy every page — form and all attachments. Label the set "MY COPIES — DO NOT SUBMIT" and keep them safe. These are your only backup if VA loses the package.`} />
                        <MailingSteps
                          stepOffset={4}
                          formNumber={form!.formNumber}
                          officeType="regional-office"
                          userState={userState}
                          setUserState={setUserState}
                          rpo={null}
                          timeline={guide.timeline}
                          moreInfo={guide.moreInfo}
                        />
                      </div>
                    )}

                    {/* ── FALLBACK (no guide) ────────────────────────────────── */}
                    {/* This form has no specific mailing guide. Do NOT show the
                        education-RPO address picker here — non-education forms
                        (health care, home loan, representation) go to entirely
                        different VA offices. Point to the form's own
                        instructions instead of guessing. */}
                    {!guide && (
                      <div className="space-y-3">
                        <StepCard number={1} title="Print your form"
                          body="Download the PDF above and print all pages on standard 8.5″ × 11″ white paper. Do not staple — use a binder clip or paper clip." />
                        <StepCard number={2} title="Make photocopies for your records"
                          body={`Photocopy every page and label the copies "MY COPY — DO NOT SUBMIT". Keep them somewhere safe. If VA loses your package, these are your only backup.`} />
                        <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                          <p className="font-semibold text-blue-900 text-sm mb-1">Where to send it</p>
                          <p className="text-sm text-blue-800">
                            Check the mailing instructions printed on your form — the correct address
                            is listed on the form itself or its instruction pages. If you are not sure,
                            call VA at 1-800-827-1000 and ask where to send VA Form {form!.formNumber}.
                          </p>
                          <p className="text-sm text-blue-800 mt-2">
                            When you mail it, send it Certified Mail with Return Receipt Requested at
                            the Post Office counter so you have proof VA received it.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Agent authorization form ──────────────────────────────── */}
                {submissionMode === 'agent' && (
                  <div className="mt-2 border-t border-gray-100 pt-4 space-y-4">
                    {/* What we'll do */}
                    <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4 space-y-2">
                      <p className="font-semibold text-indigo-900">What happens next</p>
                      <ul className="space-y-1">
                        {[
                          'Your filled PDF is securely uploaded to Military Benefits Assistant.',
                          'MBA staff will print your form and any merged attachments.',
                          'Your package is mailed via USPS Certified Mail to the correct VA office.',
                          'Allow 3–5 business days for MBA to process and mail your submission.',
                        ].map((item, i) => (
                          <li key={i} className="text-sm text-indigo-800 flex gap-2">
                            <span className="shrink-0 font-bold text-indigo-500">{i + 1}.</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Authorization text */}
                    <div className="rounded-lg border border-gray-300 bg-white p-4 text-sm text-slate-700 leading-relaxed">
                      <p className="font-semibold text-slate-900 mb-2">Authorization to File on My Behalf</p>
                      <p>
                        I, the undersigned, hereby authorize <strong>Military Benefits Assistant LLC</strong> to
                        print and mail my completed <strong>VA {form.formNumber}</strong> — along with any
                        supporting documents I have uploaded — to the appropriate VA office on my behalf.
                      </p>
                      <p className="mt-2">
                        I certify that all information in this form is true and correct to the best of my
                        knowledge, and that I have reviewed the filled PDF prior to authorizing this submission.
                        I understand that Military Benefits Assistant is acting as my authorized agent for the
                        purpose of physically delivering this form and does not provide legal or claims
                        representation services.
                      </p>
                      <p className="mt-2 text-xs text-slate-400">
                        Your authorization signature will be stored securely alongside your submission record.
                      </p>
                    </div>

                    {/* Signature pad */}
                    <div role="group" aria-labelledby="agent-sig-label">
                      <label id="agent-sig-label" className="block text-sm font-semibold text-slate-700 mb-2">
                        Sign below to authorize MBA to file on your behalf
                      </label>
                      <SignaturePad value={agentSig} onChange={setAgentSig} />
                    </div>

                    {agentError && (
                      <div className="flex gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{agentError}</p>
                      </div>
                    )}

                    <Button
                      onClick={handleAgentAuthorize}
                      disabled={isAuthorizingAgent || !agentSig}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isAuthorizingAgent ? 'Uploading & Authorizing…' : 'Authorize MBA to File My Form'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ── Agent authorized confirmation ──────────────────────────────── */}
            {agentAuthorized && (
              <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-6 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-indigo-500 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">Authorization Received</h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Your signed authorization and filled PDF have been securely uploaded.
                  Military Benefits Assistant will print and mail your <strong>{form.formNumber}</strong> to
                  the correct VA office within <strong>3–5 business days</strong>.
                </p>
                <p className="text-xs text-slate-400">
                  You will receive email confirmation when your form has been mailed. You can also
                  track this submission from your dashboard.
                </p>
              </div>
            )}

            {/* Footer nav */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────────

function StepCard({
  number,
  title,
  body,
  list,
}: {
  number: number;
  title: string;
  body: string;
  list?: string[];
}) {
  return (
    <div className="flex gap-4">
      {/* Step badge + vertical line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
          {number}
        </div>
        <div className="w-px flex-1 bg-blue-200 mt-1" />
      </div>
      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <p className="font-semibold text-slate-800 mb-1">{title}</p>
        {body && <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{body}</p>}
        {list && list.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {list.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700">
                <span className="shrink-0 text-blue-500 font-bold mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MailingSteps({
  stepOffset,
  formNumber,
  officeType,
  userState,
  setUserState,
  rpo,
  timeline,
  moreInfo,
}: {
  stepOffset: number;
  formNumber: string;
  officeType: string;
  userState: string;
  setUserState: (s: string) => void;
  rpo: RPO | null;
  timeline?: string;
  moreInfo?: string;
}) {
  const isRegionalOffice = officeType === 'regional-office';

  // Determine mailing address text
  let addressBlock = '';
  let officeName = '';
  if (isRegionalOffice) {
    officeName = 'Your Nearest VA Regional Office';
    addressBlock = 'Call 1-800-827-1000 to get the mailing address for your nearest VA Regional Office, or visit in person — no appointment needed.';
  } else if (userState === '__FOREIGN__') {
    officeName = 'Central Regional Processing Office';
    addressBlock = '9700 Page Ave.\nSt. Louis, MO 63132';
  } else if (rpo) {
    officeName = rpo.name;
    addressBlock = rpo.address;
  }

  const s = stepOffset;

  return (
    <>
      {/* Step: Address the envelope */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {s}
          </div>
          <div className="w-px flex-1 bg-blue-200 mt-1" />
        </div>
        <div className="pb-5 flex-1 min-w-0">
          <p className="font-semibold text-slate-800 mb-1">Address your envelope</p>
          <p className="text-sm text-slate-600 mb-3">
            Use a <strong>9″ × 12″ manila or kraft envelope</strong> — large enough so your documents lie flat without folding.
            Write <strong>&quot;VA FORM {formNumber} ENCLOSED&quot;</strong> in the lower-left corner of the envelope front.
            Put your own return address in the upper-left corner.
          </p>

          {/* Address sub-section */}
          {!isRegionalOffice && (
            <>
              <label htmlFor="mailing-state" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Select your state to get the correct mailing address
              </label>
              <select
                id="mailing-state"
                value={userState}
                onChange={e => setUserState(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select your state —</option>
                {US_STATES.map(st => (
                  <option key={st.abbr} value={st.abbr}>{st.name}</option>
                ))}
                <option value="__FOREIGN__">Foreign school or U.S. territory (outside the 50 states)</option>
              </select>
            </>
          )}

          {(userState || isRegionalOffice) && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Write this address on the envelope</p>
              <p className="font-semibold text-blue-900 text-sm">{officeName}</p>
              {addressBlock && (
                <p className="text-sm text-blue-800 mt-1 whitespace-pre-line font-mono leading-relaxed">{addressBlock}</p>
              )}
              {!isRegionalOffice && rpo && (
                <p className="text-xs text-blue-600 mt-2">Serves: {rpo.states.join(', ')}{rpo.foreignSchools ? ', and all foreign schools' : ''}</p>
              )}
              {!isRegionalOffice && userState === '__FOREIGN__' && (
                <p className="text-xs text-blue-600 mt-2">Handles all foreign school applications</p>
              )}
            </div>
          )}

          {moreInfo && (
            <p className="text-sm text-slate-600 mt-3 whitespace-pre-line">{moreInfo}</p>
          )}
        </div>
      </div>

      {/* Step: Go to the Post Office */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {s + 1}
          </div>
          <div className="w-px flex-1 bg-blue-200 mt-1" />
        </div>
        <div className="pb-5 flex-1 min-w-0">
          <p className="font-semibold text-slate-800 mb-1">Go to the Post Office — bring your sealed envelope to the counter</p>
          <p className="text-sm text-slate-600 mb-3">
            <strong>Do not use a drop box or street mailbox.</strong> You must go inside to the counter so the clerk can
            process Certified Mail and give you a receipt.
          </p>
          <p className="text-sm text-slate-700 font-medium mb-2">Tell the clerk exactly this:</p>
          <div className="rounded-lg bg-slate-800 text-white px-4 py-3 text-sm font-mono mb-3">
            &quot;I need to send this Certified Mail with Return Receipt Requested.&quot;
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-2">What that means:</p>
          <ul className="space-y-2 mb-3">
            {[
              { term: 'Certified Mail', def: 'VA must sign for the envelope upon delivery. This creates an official record that your form was received. VA cannot claim they never got it.' },
              { term: 'Return Receipt Requested', def: 'A small green postcard (PS Form 3811) is attached to your envelope. VA signs it when they receive your mail and the Post Office returns it to you. This green card is your legal proof of delivery — keep it permanently.' },
              { term: 'Cost', def: 'Approximately $8–12 total depending on weight. Worth every penny as proof of government delivery.' },
            ].map((item, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2">
                <span className="shrink-0 font-semibold text-slate-800">{item.term}:</span>
                {item.def}
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-600">
            The clerk will weigh your envelope, calculate postage, attach a Certified Mail barcode label, and hand you a receipt with your tracking number.
          </p>
        </div>
      </div>

      {/* Step: Save your tracking info */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {s + 2}
          </div>
          <div className="w-px flex-1 bg-blue-200 mt-1" />
        </div>
        <div className="pb-5 flex-1 min-w-0">
          <p className="font-semibold text-slate-800 mb-1">Save your tracking number and Post Office receipt</p>
          <ul className="space-y-2">
            {[
              'Write your USPS tracking number somewhere you won\'t lose it — take a photo of your receipt.',
              'Your green Return Receipt card will arrive in your mailbox 1–2 weeks after VA signs for your package. Do not throw it away — it is permanent proof of delivery.',
              'Keep your copies, receipt, and green card together in one folder.',
              timeline ? `Expected processing time: ${timeline}` : 'VA typically notifies you by mail once your form has been processed.',
              'If you haven\'t heard from VA after 60 days, call 1-888-GI-BILL-1 (education forms) or 1-800-827-1000 (VR&E) and provide your form number, mailing date, and tracking number.',
            ].map((item, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2">
                <span className="shrink-0 text-blue-500 font-bold mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

