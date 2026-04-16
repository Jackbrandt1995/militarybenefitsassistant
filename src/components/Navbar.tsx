'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-300 transition-colors">Dashboard</Link>
                <Link href="/profile" className="hover:text-blue-300 transition-colors">Profile</Link>
                <Link href="/history" className="hover:text-blue-300 transition-colors">History</Link>
                <button onClick={signOut} className="text-gray-300 hover:text-white transition-colors">
                  Sign Out
                </button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login" className="hover:text-blue-300 transition-colors">Log In</Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/profile" className="block py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link href="/history" className="block py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>History</Link>
                <button onClick={signOut} className="block py-2 text-gray-300 hover:text-white">Sign Out</button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login" className="block py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link href="/signup" className="block py-2 hover:text-blue-300" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}
