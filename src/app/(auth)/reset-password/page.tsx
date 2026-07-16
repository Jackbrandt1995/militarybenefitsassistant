'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Shield, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  // null = still checking; updating a password requires the recovery session
  // established by the emailed link, so verify one exists before showing the form.
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Supabase's raw "Auth session missing!" is jargon — translate it.
      setError(
        error.message.toLowerCase().includes('session missing')
          ? 'This reset link has expired or was already used. Please request a new one below.'
          : error.message
      );
      setLoading(false);
    } else {
      setDone(true);
      // Give the user a moment to read the confirmation, then send to dashboard
      setTimeout(() => router.push('/dashboard'), 2500);
    }
  }

  // No recovery session: the link expired, was already used, or the user
  // navigated here directly. Point them back to request a fresh link.
  if (hasSession === false) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Shield className="h-12 w-12 text-blue-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This password reset link has expired or was already used. Request a new
            one and we&apos;ll email it to you right away.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Request a New Link
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            <Link href="/login" className="text-blue-700 font-medium hover:underline">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Still verifying the link — avoid flashing the form before we know.
  if (hasSession === null) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">Checking your reset link…</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h1>
          <p className="text-gray-600">Your password has been reset. Redirecting you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Choose a New Password</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Pick something strong that you haven&apos;t used before.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Update Password
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Link not working?{' '}
          <Link href="/forgot-password" className="text-blue-700 font-medium hover:underline">
            Request a new one
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          <Link href="/login" className="text-blue-700 font-medium hover:underline">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
