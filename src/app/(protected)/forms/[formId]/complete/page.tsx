'use client';

import { use, useState, useEffect } from 'react';
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
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function CompletePage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const form = getFormById(formId);
  const router = useRouter();
  const { user } = useAuth();

  // PDF generation state
  const [status, setStatus] = useState<'generating' | 'ready' | 'error'>('generating');
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [wizardAttachedCount, setWizardAttachedCount] = useState(0);

  // Submission mode
  const [submissionMode, setSubmissionMode] = useState<'self' | 'agent' | null>(null);
  const [userState, setUserState] = useState('');

  // Agent filing state
  const [agentSig, setAgentSig] = useState('');
  const [agentAuthorized, setAgentAuthorized] = useState(false);
  const [isAuthorizingAgent, setIsAuthorizingAgent] = useState(false);
  const [agentError, setAgentError] = useState('');

  // Self-submit details expansion
  const [showWhatToInclude, setShowWhatToInclude] = useState(true);

  const guide: SubmissionGuide | undefined = SUBMISSION_GUIDES[formId];

  useEffect(() => {
    if (!form) return;

    async function generate() {
      try {
        const stored = localStorage.getItem(`form-wizard-${formId}`);
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
        if (wizardFiles.length > 0) {
          try {
            bytes = await mergePdfsWithAttachments(bytes, wizardFiles);
            setWizardAttachedCount(wizardFiles.filter(f => f.type === 'application/pdf').length);
          } catch (mergeErr) {
            console.warn('Wizard attachment merge (non-fatal):', mergeErr);
          }
          clearFormFiles();
        }

        setPdfBytes(bytes);

        // Scrub sensitive fields before storing
        const sensitiveFieldIds = new Set<string>();
        for (const step of form!.steps) {
          for (const field of step.fields) {
            if (field.type === 'ssn' || field.sensitive === true) {
              sensitiveFieldIds.add(field.id);
            }
          }
        }
        const safeAnswers: Record<string, string | boolean> = {};
        for (const [k, v] of Object.entries(answers)) {
          if (!sensitiveFieldIds.has(k)) safeAnswers[k] = v as string | boolean;
        }

        if (user) {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('form_submissions')
            .insert({
              user_id: user.id,
              form_id: formId,
              form_name: form!.title,
              answers_json: safeAnswers,
              submission_status: 'downloaded',
            })
            .select('id')
            .single();
          if (error) throw error;
          setSubmissionId(data?.id ?? null);
        }

        localStorage.removeItem(`form-wizard-${formId}`);
        setStatus('ready');
      } catch (err: any) {
        console.error('PDF generation error:', err);
        setErrorMsg(err.message || 'Failed to generate PDF.');
        setStatus('error');
      }
    }

    generate();
  }, [form, formId, user]);

  if (!form) notFound();

  function handleDownload() {
    if (pdfBytes) {
      downloadPdf(pdfBytes, `${form!.formNumber.replace(/\s+/g, '-')}-filled.pdf`);
    }
  }

  async function handleAgentAuthorize() {
    if (!agentSig) { setAgentError('Please draw your authorization signature above.'); return; }
    if (!user || !submissionId || !pdfBytes) {
      setAgentError('Session error — please try refreshing the page.');
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
        .upload(pdfPath, new Blob([pdfBytes], { type: 'application/pdf' }));
      if (uploadErr) throw uploadErr;

      // Record authorization on the submission
      const { error: updateErr } = await supabase
        .from('form_submissions')
        .update({
          agent_filing_requested: true,
          agent_auth_signature: agentSig,
          pdf_storage_path: pdfPath,
          submission_status: 'agent_pending',
        })
        .eq('id', submissionId);
      if (updateErr) throw updateErr;

      setAgentAuthorized(true);
    } catch (err: any) {
      console.error('Agent authorization error:', err);
      setAgentError(err.message || 'Authorization failed. Please try again.');
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

              <Button onClick={handleDownload} className="mt-5 w-full sm:w-auto px-8">
                <Download className="w-4 h-4 mr-2" />
                Download Filled PDF
              </Button>
            </div>

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
                    <p className="font-semibold text-slate-900">I'll submit it myself</p>
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

                {/* ── Self-submit details ───────────────────────────────────── */}
                {submissionMode === 'self' && guide && (
                  <div className="mt-2 space-y-4 border-t border-gray-100 pt-4">

                    {/* Through-school forms */}
                    {guide.officeType === 'through-school' && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-2">
                        <p className="font-semibold text-amber-900 flex items-center gap-2">
                          <MapPin className="w-4 h-4 shrink-0" />
                          Do not mail this form directly to VA
                        </p>
                        <p className="text-sm text-amber-800 whitespace-pre-line">{guide.schoolNote}</p>
                      </div>
                    )}

                    {/* RPO forms — state selector + address */}
                    {(guide.officeType === 'rpo' || guide.officeType === 'rpo-with-school') && (
                      <div className="space-y-4">
                        {/* State selector */}
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Select your state to find the correct VA Regional Processing Office
                          </label>
                          <select
                            value={userState}
                            onChange={e => setUserState(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">— Select your state —</option>
                            {US_STATES.map(s => (
                              <option key={s.abbr} value={s.abbr}>{s.name}</option>
                            ))}
                            <option value="__FOREIGN__">Foreign school / outside US</option>
                          </select>
                        </div>

                        {/* RPO address card */}
                        {userState && (
                          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                            {userState === '__FOREIGN__' ? (
                              <>
                                <p className="font-semibold text-blue-900">Central Regional Processing Office</p>
                                <p className="text-sm text-blue-800 mt-1 whitespace-pre-line">
                                  {'9700 Page Ave.\nSt. Louis, MO 63132'}
                                </p>
                                <p className="text-sm text-blue-700 mt-1">Fax: (314) 253-4095</p>
                                <p className="text-xs text-blue-600 mt-2">Handles all foreign school applications</p>
                              </>
                            ) : rpo ? (
                              <>
                                <p className="font-semibold text-blue-900">{rpo.name}</p>
                                <p className="text-sm text-blue-800 mt-1 whitespace-pre-line">{rpo.address}</p>
                                <p className="text-sm text-blue-700 mt-1">Fax: {rpo.fax}</p>
                                <p className="text-xs text-blue-600 mt-2">
                                  Serves: {rpo.states.join(', ')}{rpo.foreignSchools ? ', and all foreign schools' : ''}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-blue-800">State not recognized — call VA at 1-888-GI-BILL-1 for your correct office.</p>
                            )}
                          </div>
                        )}

                        {/* School note for rpo-with-school */}
                        {guide.officeType === 'rpo-with-school' && guide.schoolNote && (
                          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                            <p className="font-semibold text-amber-900 text-sm mb-1">Also notify your school</p>
                            <p className="text-sm text-amber-800">{guide.schoolNote}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* VR&E — nearest Regional Office */}
                    {guide.officeType === 'regional-office' && (
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-2">
                        <p className="font-semibold text-blue-900 flex items-center gap-2">
                          <MapPin className="w-4 h-4 shrink-0" />
                          Find your nearest VA Regional Office
                        </p>
                        <p className="text-sm text-blue-800 whitespace-pre-line">{guide.moreInfo}</p>
                      </div>
                    )}

                    {/* What to include — collapsible */}
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setShowWhatToInclude(v => !v)}
                        className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        What to include in your mailing package
                        {showWhatToInclude ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {showWhatToInclude && (
                        <ul className="px-4 py-3 space-y-2">
                          {guide.whatToInclude.map((item, i) => (
                            <li key={i} className="flex gap-2 text-sm text-slate-700">
                              <span className="shrink-0 text-blue-500 font-bold">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* School note (RPO forms with school involved) */}
                    {guide.officeType === 'rpo' && guide.schoolNote && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                        <p className="font-semibold text-amber-900 text-sm mb-2">
                          ⚠ Additional steps required at your school
                        </p>
                        <p className="text-sm text-amber-800 whitespace-pre-line">{guide.schoolNote}</p>
                      </div>
                    )}

                    {/* General more-info note */}
                    {guide.moreInfo && guide.officeType !== 'regional-office' && (
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                        <p className="text-sm text-slate-700 whitespace-pre-line">{guide.moreInfo}</p>
                      </div>
                    )}

                    {/* Timeline */}
                    {guide.timeline && (
                      <p className="text-xs text-slate-500 italic">⏱ {guide.timeline}</p>
                    )}

                    {/* Mailing tips */}
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-1">
                      <p className="text-sm font-semibold text-green-900">Tips for mailing</p>
                      <ul className="space-y-1">
                        {[
                          'Make copies of everything before sealing the envelope.',
                          'Use USPS Certified Mail with Return Receipt so you have proof of delivery.',
                          'Keep your tracking number and delivery confirmation in a safe place.',
                        ].map((tip, i) => (
                          <li key={i} className="text-sm text-green-800 flex gap-2">
                            <span className="shrink-0">•</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* No guide available */}
                {submissionMode === 'self' && !guide && (
                  <div className="mt-2 rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-800">
                      Mail your completed form to your nearest VA Regional Processing Office.
                      Call <strong>1-888-GI-BILL-1</strong> (1-888-442-4551) for assistance finding the correct office.
                    </p>
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
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
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
