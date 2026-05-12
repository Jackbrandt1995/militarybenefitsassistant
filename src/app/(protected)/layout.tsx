'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Not logged in → go to login
    if (!user) {
      router.push('/login');
      return;
    }

    // Already on the acceptance page — don't redirect in a loop
    if (pathname === '/terms/accept') return;

    // New user hasn't accepted terms yet → gate them
    const termsAccepted = user.user_metadata?.terms_accepted_at;
    if (!termsAccepted) {
      router.push('/terms/accept');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
      </div>
    );
  }

  if (!user) return null;

  // Render children while the terms redirect (if any) is processing,
  // but suppress content on protected pages until accepted.
  const termsAccepted = user.user_metadata?.terms_accepted_at;
  if (!termsAccepted && pathname !== '/terms/accept') return null;

  return <>{children}</>;
}
