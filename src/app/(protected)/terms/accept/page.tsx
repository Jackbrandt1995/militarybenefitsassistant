'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AcceptTermsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAccept() {
    if (!accepted || !user) return;
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      // Store acceptance timestamp in user metadata (avoids extra DB query on every page load)
      const { error: metaErr } = await supabase.auth.updateUser({
        data: { terms_accepted_at: now },
      });
      if (metaErr) throw metaErr;

      // Also persist to profiles table for auditing
      await supabase
        .from('profiles')
        .upsert({ id: user.id, terms_accepted_at: now }, { onConflict: 'id' });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-700 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Before You Continue</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Please read and accept our Terms of Service to use Military Benefits Assistant.
          </p>
        </div>

        {/* Scrollable ToS summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-80 overflow-y-auto px-6 py-5 text-sm text-gray-700 leading-relaxed space-y-4 scroll-smooth">

            <p className="font-semibold text-gray-900">What this service does</p>
            <p>
              Military Benefits Assistant is an independent tool that helps veterans, service members, and their
              family members fill out VA education benefit forms. You answer questions and we pre-fill the
              appropriate VA PDF form so you can download and submit it yourself. <strong>We are not affiliated
              with the VA or any government agency, and we do not submit forms on your behalf.</strong>
            </p>

            <p className="font-semibold text-gray-900">What information we collect</p>
            <p>
              To pre-fill your forms, you may optionally save personal information to your profile: name, date
              of birth, Social Security Number, address, military service history, education history, and bank
              account information for direct deposit. <strong>Nothing is required</strong> — you can complete
              forms without saving anything.
            </p>

            <p className="font-semibold text-gray-900">How your data is protected</p>
            <p>
              Your data is stored on <strong>Supabase</strong>, which is SOC 2 Type II certified. All data is
              encrypted at rest with AES-256 and transmitted over TLS/HTTPS. Row-Level Security (RLS) rules
              in the database ensure that only you can read or write your own records — no other user can ever
              access your data.
            </p>
            <p>
              The application is hosted on <strong>Vercel</strong>, also SOC 2 Type II certified, with HTTPS
              enforced on all pages and DDoS protection at the edge.
            </p>
            <p>
              Your most sensitive fields — Social Security Number and bank account numbers — are encrypted with
              an additional layer of <strong>AES-256-GCM</strong> before reaching the database. Even a database
              administrator cannot read these values without the encryption key.
            </p>

            <p className="font-semibold text-gray-900">What we do not do</p>
            <ul className="list-disc list-inside space-y-1">
              <li>We do not submit your forms to the VA or any agency</li>
              <li>We do not sell or share your personal data with third parties</li>
              <li>We do not use your data to train AI or machine learning models</li>
              <li>We do not store the filled PDF on our servers — it is generated in your browser and
                downloaded directly to your device</li>
            </ul>

            <p className="font-semibold text-gray-900">Disclaimer</p>
            <p>
              This service is provided &ldquo;as is.&rdquo; We make no guarantee that generated forms will be accepted
              by the VA or that they reflect the most current form versions. <strong>You are responsible for
              reviewing every form before submitting it to the VA.</strong> Nothing here constitutes legal
              advice or a guarantee of VA benefits. If you need official assistance, please contact an
              accredited VA claims agent, attorney, or a Veterans Service Organization.
            </p>

            <p className="font-semibold text-gray-900">Your rights</p>
            <p>
              You may access, update, or delete your data at any time. To request full account deletion, email
              us at{' '}
              <a href="mailto:support@militarybenefitsassistant.com" className="text-blue-600 hover:underline">
                support@militarybenefitsassistant.com
              </a>. We will permanently delete your data within 30 days.
            </p>

            <p className="text-gray-500 text-xs">
              For the full Terms of Service, see{' '}
              <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
                militarybenefitsassistant.com/terms
              </Link>.
            </p>
          </div>

          {/* Scroll indicator fade */}
          <div className="h-6 bg-gradient-to-t from-white to-transparent -mt-6 pointer-events-none relative z-10" />
        </div>

        {/* Acceptance checkbox */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-5 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm text-gray-700 leading-snug">
              I have read and agree to the{' '}
              <Link href="/terms" target="_blank" className="text-blue-700 font-medium hover:underline">
                Terms of Service &amp; Privacy Notice
              </Link>
              . I understand that Military Benefits Assistant is not affiliated with the VA, does not submit
              forms on my behalf, and is not a source of legal or benefits advice.
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
          )}

          <Button
            onClick={handleAccept}
            disabled={!accepted || loading}
            loading={loading}
            className="w-full"
          >
            {loading ? 'Saving…' : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                I Agree — Continue to Dashboard
              </span>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
