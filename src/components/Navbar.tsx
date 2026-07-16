'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, loading, signingOut, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const desktopLink = (href: string) =>
    `hover:text-blue-300 transition-colors ${isActive(href) ? 'text-blue-300 font-semibold' : ''}`;
  const mobileLink = (href: string) =>
    `block py-2 hover:text-blue-300 ${isActive(href) ? 'text-blue-300 font-semibold' : ''}`;
  const current = (href: string) => (isActive(href) ? 'page' as const : undefined);

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/seal.png" alt="Military Benefits Assistant" width={36} height={36} className="rounded-full" />
            <span className="hidden sm:inline">Military Benefits Assistant</span>
            <span className="sm:hidden">MBA</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {loading ? (
              <div className="h-5 w-48 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
            ) : user ? (
              <>
                <Link href="/dashboard" aria-current={current('/dashboard')} className={desktopLink('/dashboard')}>Dashboard</Link>
                <Link href="/profile" aria-current={current('/profile')} className={desktopLink('/profile')}>Profile</Link>
                <Link href="/history" aria-current={current('/history')} className={desktopLink('/history')}>History</Link>
                {user.app_metadata?.is_admin && (
                  <Link
                    href="/admin"
                    aria-current={current('/admin')}
                    className={`hover:text-amber-300 transition-colors ${isActive('/admin') ? 'text-amber-300 font-semibold' : 'font-medium'}`}
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" aria-current={current('/login')} className={desktopLink('/login')}>Log In</Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" className="md:hidden pb-4 space-y-2">
            {loading ? (
              <div className="h-5 w-32 my-2 rounded bg-slate-800 animate-pulse" aria-hidden="true" />
            ) : user ? (
              <>
                <Link href="/dashboard" aria-current={current('/dashboard')} className={mobileLink('/dashboard')} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/profile" aria-current={current('/profile')} className={mobileLink('/profile')} onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link href="/history" aria-current={current('/history')} className={mobileLink('/history')} onClick={() => setMenuOpen(false)}>History</Link>
                {user.app_metadata?.is_admin && (
                  <Link
                    href="/admin"
                    aria-current={current('/admin')}
                    className={`block py-2 hover:text-amber-300 ${isActive('/admin') ? 'text-amber-300 font-semibold' : 'font-medium'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="block py-2 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" aria-current={current('/login')} className={mobileLink('/login')} onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link href="/signup" aria-current={current('/signup')} className={mobileLink('/signup')} onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
