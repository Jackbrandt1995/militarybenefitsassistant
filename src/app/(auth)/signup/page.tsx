'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import CaptchaField from '@/components/CaptchaField';

const CAPTCHA_REQUIRED = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  function resetCaptcha() {
    setCaptchaToken('');
    setCaptchaKey(k => k + 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
        captchaToken: captchaToken || undefined,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      resetCaptcha();
    } else if (data.session) {
      // Email confirmation is OFF in Supabase -> the account is created and the
      // user is already signed in. Skip the "check your email" screen and go
      // straight into the app (which then routes them through MFA setup).
      router.push('/dashboard');
    } else {
      // Confirmation required -> the default Supabase email was sent; tell them
      // to check their inbox.
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <Image src="/seal.png" alt="Military Benefits Assistant" width={64} height={64} className="mx-auto mb-4 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            We sent a confirmation link to <strong>{email}</strong>.
            Click the link to activate your account.
          </p>
          <Link href="/login" className="text-blue-700 font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/seal.png" alt="Military Benefits Assistant" width={64} height={64} className="mx-auto mb-4 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-1">Start auto-filling VA forms today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <CaptchaField key={captchaKey} onToken={setCaptchaToken} />

          <Button type="submit" loading={loading} disabled={loading || (CAPTCHA_REQUIRED && !captchaToken)} className="w-full">
            Create Account
          </Button>

          <p className="text-xs text-gray-500 text-center pt-1">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-blue-700 hover:underline">Terms of Service &amp; Privacy Notice</Link>.
          </p>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-700 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
