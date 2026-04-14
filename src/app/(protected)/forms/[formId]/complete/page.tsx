'use client';

import { use, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getFormById } from '@/lib/forms/registry';
import { useAuth } from '@/components/AuthProvider';
import { fillPdf, downloadPdf } from '@/lib/pdf/fillPdf';
import { getFieldMapping } from '@/lib/pdf/fieldMappings';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { CheckCircle, Download, FileText, ArrowLeft } from 'lucide-react';

export default function CompletePage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);
  const form = getFormById(formId);
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'generating' | 'ready' | 'error'>('generating');
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

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
        const { answers } = JSON.parse(stored);
        const mapping = getFieldMapping(formId);
        if (!mapping) {
          setErrorMsg('Field mapping not found for this form.');
          setStatus('error');
          return;
        }

        const bytes = await fillPdf(form!.pdfTemplate, answers, mapping);
        setPdfBytes(bytes);

        // Save submission record
        if (user) {
          const supabase = createClient();
          await supabase.from('form_submissions').insert({
            user_id: user.id,
            form_id: formId,
            answers_json: answers,
          });
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
          <div className="bg-white rounded-lg shadow p-10">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Form is Ready!</h1>
            <p className="text-slate-600 mb-6">
              {form.formNumber} &mdash; {form.title} has been filled with your information.
            </p>
            <div className="space-y-3">
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
