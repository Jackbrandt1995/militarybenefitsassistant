'use client';

import { use, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getFormById } from '@/lib/forms/registry';
import { useAuth } from '@/components/AuthProvider';
import { fillPdf, downloadPdf, mergePdfsWithAttachments } from '@/lib/pdf/fillPdf';
import { getFieldMapping } from '@/lib/pdf/fieldMappings';
import { getFormFiles, clearFormFiles } from '@/lib/fileCache';
import { createClient } from '@/lib/supabase/client';
import DocumentUploader from '@/components/DocumentUploader';
import Button from '@/components/ui/Button';
import { CheckCircle, Download, FileText, ArrowLeft, AlertCircle } from 'lucide-react';

export default function CompletePage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const form = getFormById(formId);
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'generating' | 'ready' | 'error'>('generating');
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [wizardAttachedCount, setWizardAttachedCount] = useState(0);

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
        // Apply form-specific answer transforms (e.g., build fullName, fullAddress, computed totals)
        const answers = form!.computeAnswers ? form!.computeAnswers(rawAnswers) : rawAnswers;
        const mapping = getFieldMapping(formId);
        if (!mapping) {
          setErrorMsg('Field mapping not found for this form.');
          setStatus('error');
          return;
        }

        let bytes = await fillPdf(form!.pdfTemplate, answers, mapping);

        // Merge files that were attached in the wizard's "Attach Documents" step
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

        // Save submission record
        let submId = null;
        if (user) {
          const supabase = createClient();
          const { data, error } = await supabase.from('form_submissions').insert({
            user_id: user.id,
            form_id: formId,
            form_name: form!.title,
            answers_json: answers,
          }).select('id').single();

          if (error) throw error;
          submId = data?.id;
          setSubmissionId(submId);
        }

        // Clear wizard state
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

  async function handleUploadDocuments(files: File[]) {
    if (!user || !submissionId) {
      setErrorMsg('Unable to upload documents. Please try again.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    try {
      const supabase = createClient();
      const uploaded: string[] = [];

      for (const file of files) {
        const timestamp = Date.now();
        // Path: userId/submissionId/timestamp-filename (userId first for RLS policy)
        const fileName = `${user.id}/${submissionId}/${timestamp}-${file.name}`;
        const { error } = await supabase.storage
          .from('form_submissions')
          .upload(fileName, file);

        if (error) throw error;
        uploaded.push(fileName);
      }

      // Update submission record with file references (non-fatal if column doesn't exist yet)
      await supabase
        .from('form_submissions')
        .update({ document_files: uploaded })
        .eq('id', submissionId);

      setUploadedFiles(uploaded);

      // Merge any PDF attachments into the form PDF so the download is one package
      const pdfFiles = files.filter(f => f.type === 'application/pdf');
      if (pdfFiles.length > 0 && pdfBytes) {
        try {
          const merged = await mergePdfsWithAttachments(pdfBytes, pdfFiles);
          setPdfBytes(merged);
        } catch (mergeErr) {
          console.warn('PDF merge (non-fatal):', mergeErr);
        }
      }

      setIsUploading(false);
    } catch (err: any) {
      console.error('Document upload error:', err);
      setErrorMsg(`Upload failed: ${err.message || 'Unknown error'}`);
      setIsUploading(false);
    }
  }

  function handleDownload() {
    if (pdfBytes) {
      downloadPdf(pdfBytes, `${form!.formNumber.replace(/\s+/g, '-')}-filled.pdf`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-xl mx-auto text-center">
        {status === 'generating' && (
          <div className="bg-white rounded-lg shadow p-10">
            <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-slate-900">Generating Your PDF...</h1>
            <p className="text-slate-500 mt-2">Filling in {form.formNumber} with your answers.</p>
          </div>
        )}

        {status === 'ready' && (
          <div className="bg-white rounded-lg shadow p-10 space-y-8">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Form is Ready!</h1>
              <p className="text-slate-600">
                {form.formNumber} &mdash; {form.title} has been filled with your information.
              </p>
            </div>

            {/* Wizard-attached files confirmation */}
            {wizardAttachedCount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 mb-1">
                  ✓ {wizardAttachedCount} PDF{wizardAttachedCount > 1 ? 's' : ''} from your application merged
                </p>
                <p className="text-xs text-green-700">
                  Documents you attached during the wizard have been merged into this download.
                </p>
              </div>
            )}

            {/* Additional documents uploaded here */}
            {uploadedFiles.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-900 mb-1">
                  ✓ {uploadedFiles.length} additional document{uploadedFiles.length > 1 ? 's' : ''} attached
                </p>
                <p className="text-xs text-green-700">
                  PDF attachments merged. The download below includes all pages.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{errorMsg}</p>
              </div>
            )}

            {/* Additional documents — always available */}
            {uploadedFiles.length === 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Attach Additional Documents</h2>
                <p className="text-sm text-slate-500 mb-3">
                  Forgot something? You can attach more documents here. PDFs are merged into your download.
                </p>
                <DocumentUploader
                  onFilesSelected={setSelectedFiles}
                  isLoading={isUploading}
                />
                {selectedFiles.length > 0 && (
                  <Button
                    onClick={() => handleUploadDocuments(selectedFiles)}
                    disabled={isUploading}
                    className="w-full mt-4"
                  >
                    {isUploading ? 'Attaching...' : `Attach ${selectedFiles.length} Document${selectedFiles.length > 1 ? 's' : ''}`}
                  </Button>
                )}
              </div>
            )}

            {form.nextSteps && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Next Steps</h3>
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{form.nextSteps}</p>
              </div>
            )}

            <div className="space-y-3 border-t pt-6">
              <Button onClick={handleDownload} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-lg shadow p-10">
            <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-red-700 mb-2">Generation Failed</h1>
            <p className="text-slate-600 mb-6">{errorMsg}</p>
            <Button variant="outline" onClick={() => router.push(`/forms/${formId}`)}>
              Back to Form
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
