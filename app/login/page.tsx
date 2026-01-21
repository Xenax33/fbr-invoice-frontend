'use client';

import type { Metadata } from 'next';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showLoading('Signing you in...');

    try {
      await login(formData.email, formData.password);
      // Redirect is happening, hide loading after navigation starts
      hideLoading();
    } catch (error) {
      hideLoading();
      // Error toast is handled in the login function
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up">
        <Link href="/" className="flex justify-center group">
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
            <span className="font-display text-white text-3xl font-bold">ST</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-emerald-900/20 to-transparent"></div>
          </div>
        </Link>
        <h2 className="mt-8 text-center font-display text-4xl font-bold tracking-tight text-stone-900">
          Welcome Back
        </h2>
        <p className="mt-3 text-center text-base text-stone-600">
          Or{' '}
          <Link href="/contact" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
            contact us to get started
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in-up animation-delay-100">
        <div className="bg-white py-10 px-6 shadow-2xl sm:rounded-2xl sm:px-12 border border-stone-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-stone-900 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full px-4 py-3.5 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-stone-50 hover:bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-stone-900 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full px-4 py-3.5 border border-stone-300 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all bg-stone-50 hover:bg-white"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/contact" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group flex w-full justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  Sign in
                  <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-3 text-stone-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="https://wa.me/923184489249?text=I need help with login"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-stone-300 bg-white px-4 py-3.5 text-sm font-semibold text-stone-700 shadow-sm hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-300"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 group-hover:bg-emerald-600 transition-colors">
                  <svg className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                Contact via WhatsApp
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-stone-500">
            Don't have an account?{' '}
            <Link href="/contact" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Contact us to register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}