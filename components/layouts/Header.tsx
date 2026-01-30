'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-950/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-emerald-900/20' 
        : 'bg-transparent backdrop-blur-0 border-b border-transparent shadow-none'
    }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative h-12 w-12 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-all shadow-lg shadow-emerald-900/30 group-hover:shadow-xl">
            <img src="/logos/company-logo.png" alt="Saad Traders" className="h-9 w-9 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl text-white drop-shadow-lg">Saad Traders</span>
            <span className="text-[10px] text-emerald-200/80 -mt-1 font-medium tracking-wider uppercase drop-shadow-md">Excellence in Service</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-1">
          <Link 
            href="/" 
            className="px-4 py-2 text-sm font-semibold text-stone-200 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-all backdrop-blur-sm"
          >
            Home
          </Link>
          <Link 
            href="/digital-invoice" 
            className="px-4 py-2 text-sm font-semibold text-stone-200 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-all backdrop-blur-sm"
          >
            Digital Invoice
          </Link>
          <Link 
            href="/stitching-services" 
            className="px-4 py-2 text-sm font-semibold text-stone-200 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-all backdrop-blur-sm"
          >
            Stitching Services
          </Link>
          <Link 
            href="/contact" 
            className="px-4 py-2 text-sm font-semibold text-stone-200 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-all backdrop-blur-sm"
          >
            Contact Us
          </Link>
        </div>

        {/* CTA Buttons - Desktop */}
        <div className="hidden lg:flex lg:gap-x-3 lg:items-center">
          {isAuthenticated && user ? (
            <>
              <div className="text-sm text-stone-200 mr-2">
                <span className="font-semibold">{user.name}</span>
                <span className="ml-2 text-xs text-emerald-300/80">({user.role})</span>
              </div>
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/40 hover:from-emerald-600 hover:to-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 transition-all"
              >
                {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-lg border-2 border-red-500/50 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 transition-all backdrop-blur-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border-2 border-emerald-400/50 px-5 py-2.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 transition-all backdrop-blur-sm"
              >
                Login
              </Link>
              <Link
                href="/contact"
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 hover:shadow-xl hover:shadow-emerald-900/40 hover:from-emerald-600 hover:to-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden rounded-lg p-2.5 text-stone-200 hover:bg-white/10 transition-colors backdrop-blur-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 text-base font-semibold text-stone-200 hover:bg-white/10 hover:text-emerald-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/digital-invoice"
              className="block rounded-lg px-4 py-3 text-base font-semibold text-stone-200 hover:bg-white/10 hover:text-emerald-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Digital Invoice
            </Link>
            <Link
              href="/stitching-services"
              className="block rounded-lg px-4 py-3 text-base font-semibold text-stone-200 hover:bg-white/10 hover:text-emerald-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Stitching Services
            </Link>
            <Link
              href="/contact"
              className="block rounded-lg px-4 py-3 text-base font-semibold text-stone-200 hover:bg-white/10 hover:text-emerald-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>

            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-3 text-sm text-stone-300">
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-emerald-300/80 mt-1">{user.role}</div>
                </div>
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="block rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-center text-base font-semibold text-white shadow-lg shadow-emerald-900/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full rounded-lg border-2 border-red-500/50 px-4 py-3 text-center text-base font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-lg border-2 border-emerald-400/50 px-4 py-3 text-center text-base font-semibold text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/contact"
                  className="block rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-center text-base font-semibold text-white shadow-lg shadow-emerald-900/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
