'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  // ── One-click demo sign-in ─────────────────────────────────────────────────
  // Only enabled when NEXT_PUBLIC_ENABLE_DEMO === 'true'. Lets a prospective user
  // try the app with no credentials. Run supabase/seed_demo_accounts.sql first.
  const demoEnabled = process.env.NEXT_PUBLIC_ENABLE_DEMO === 'true';
  const demoCreds = {
    user: {
      email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL || 'demo.user@militarybenefitsassistant.com',
      password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD || 'DemoUser2026!',
    },
    admin: {
      email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || 'demo.admin@militarybenefitsassistant.com',
      password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'DemoAdmin2026!',
    },
  };

  const handleDemo = async (role: 'user' | 'admin') => {
    setError('');
    setLoading(true);
    const { email: demoEmail, password: demoPassword } = demoCreds[role];
    const { error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPassword });
    if (error) {
      setError(
        `Demo ${role} sign-in failed: ${error.message}. Make sure the demo accounts have been seeded (supabase/seed_demo_accounts.sql).`,
      );
      setLoading(false);
    } else {
      router.push(role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/seal.png" alt="Military Benefits Assistant" width={64} height={64} className="mx-auto mb-4 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
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
            <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Link href="/forgot-password" className="text-xs text-blue-700 hover:underline">Forgot password?</Link>
          </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-700 font-medium hover:underline">Sign up</Link>
        </p>

        {demoEnabled && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs uppercase tracking-wide text-gray-400">
                  Or try a demo
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemo('user')}
                disabled={loading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Demo as User
              </button>
              <button
                type="button"
                onClick={() => handleDemo('admin')}
                disabled={loading}
                className="rounded-md border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
              >
                Demo as Admin
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              Demo accounts are pre-filled and shared. Don&apos;t enter real personal information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
