'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function MfaSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [qr, setQr] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      // If a verified factor already exists, no setup needed.
      const { data: factors } = await supabase.auth.mfa.listFactors();
      if ((factors?.totp ?? []).some(f => f.status === 'verified')) {
        router.replace('/dashboard');
        return;
      }
      // Clean up any abandoned unverified factors so we start fresh.
      for (const f of factors?.totp ?? []) {
        if (f.status !== 'verified') {
          await supabase.auth.mfa.unenroll({ factorId: f.id });
        }
      }
      const { data, error: enrollErr } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator app',
      });
      if (enrollErr || !data) {
        setError(enrollErr?.message || 'Could not start MFA setup.');
        setStatus('error');
        return;
      }
      setFactorId(data.id);
      setQr(data.totp.qr_code);
      setSecret(data.totp.secret);
      setStatus('ready');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    const { data: challenge, error: chErr } = await supabase.auth.mfa.challenge({ factorId });
    if (chErr || !challenge) {
      setError(chErr?.message || 'Could not verify. Try again.');
      setVerifying(false);
      return;
    }
    const { error: verErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: code.trim(),
    });
    if (verErr) {
      setError(verErr.message || 'That code didn’t match. Try again.');
      setVerifying(false);
      return;
    }
    router.replace('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <ShieldCheck className="w-10 h-10 text-blue-700 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Set up two-step verification</h1>
          <p className="text-gray-600 mt-1">
            Protecting your SSN and benefits info requires an authenticator app. You’ll enter a
            6-digit code each time you sign in.
          </p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 space-y-5">
          {status === 'loading' && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
            </div>
          )}

          {status === 'error' && (
            <div className="flex gap-2 rounded-md bg-red-50 border border-red-200 p-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {status === 'ready' && (
            <>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Install an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy).</li>
                <li>Scan this QR code, or enter the key manually.</li>
                <li>Enter the 6-digit code it shows.</li>
              </ol>

              {qr && (
                <div className="flex justify-center">
                  {/* Supabase returns the QR as an SVG data URL */}
                  <Image src={qr} alt="Authenticator QR code" width={200} height={200} unoptimized />
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-gray-500">Can’t scan? Enter this key:</p>
                <code className="text-xs font-mono break-all text-gray-700">{secret}</code>
              </div>

              <form onSubmit={handleVerify} className="space-y-3 border-t border-gray-100 pt-4">
                {error && (
                  <div className="flex gap-2 rounded-md bg-red-50 border border-red-200 p-3">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                <Input
                  label="6-digit code"
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                />
                <Button type="submit" loading={verifying} disabled={code.length !== 6} className="w-full">
                  Verify &amp; turn on
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
