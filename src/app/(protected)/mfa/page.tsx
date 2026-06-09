'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function MfaChallengePage() {
  const router = useRouter();
  const supabase = createClient();
  const { signOut } = useAuth();
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === 'aal2') {
        router.replace('/dashboard');
        return;
      }
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totp = (factors?.totp ?? []).find(f => f.status === 'verified');
      if (!totp) {
        router.replace('/mfa/setup');
        return;
      }
      setFactorId(totp.id);
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
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <ShieldCheck className="w-10 h-10 text-blue-700 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Two-step verification</h1>
          <p className="text-gray-600 mt-1">Enter the 6-digit code from your authenticator app.</p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          {status === 'loading' ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {error && (
                <div className="flex gap-2 rounded-md bg-red-50 border border-red-200 p-3">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
              <Input
                label="Authentication code"
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                autoFocus
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
              />
              <Button type="submit" loading={verifying} disabled={code.length !== 6} className="w-full">
                Verify
              </Button>
            </form>
          )}
          <button
            type="button"
            onClick={signOut}
            className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
