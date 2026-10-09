'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  HardHat,
  Building2,
  Sparkles,
  KeyRound,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/home';
  const urlError = searchParams.get('error');

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(urlError ? 'Authentication session failed. Please try again.' : '');
  const [successMsg, setSuccessMsg] = useState('');

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.session) {
          setSuccessMsg('Successfully signed in. Redirecting...');
          setTimeout(() => {
            router.push(redirectPath);
          }, 800);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || 'Citizen',
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.user) {
          if (data.session) {
            setSuccessMsg('Account created successfully! Redirecting...');
            setTimeout(() => {
              router.push(redirectPath);
            }, 800);
          } else {
            setSuccessMsg('Check your email for confirmation link to complete registration.');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const autofillCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('password123');
    setErrorMsg('');
    setSuccessMsg(`Autofilled credentials for ${roleEmail}`);
  };

  const handleDemoBypass = (role: 'CITIZEN' | 'STAFF' | 'ADMIN') => {
    if (role === 'CITIZEN') router.push('/home');
    if (role === 'STAFF') router.push('/staff/dashboard');
    if (role === 'ADMIN') router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between font-sans text-civic-text">
      {/* TOP HEADER */}
      <header className="w-full border-b border-civic-border/70 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-civic-primary text-white flex items-center justify-center shadow-md shadow-civic-primary/25 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black text-civic-text tracking-tight">
                  Namma City
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-civic-primary/10 text-civic-primary">
                  ನಮ್ಮ ನಗರ
                </span>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-civic-text-muted hover:text-civic-text transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl border border-civic-border shadow-civic-elevated p-6 sm:p-8">
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-civic-primary/10 text-civic-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-civic-text tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Create Civic Account'}
            </h1>
            <p className="text-xs text-civic-text-muted mt-1.5">
              {mode === 'signin'
                ? 'Sign in to access unified municipal services and track complaints'
                : 'Join millions of Bengaluru residents on the unified civic mesh'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-civic-border hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 text-sm font-semibold text-civic-text shadow-xs active:scale-[0.99] disabled:opacity-60"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* DIVIDER */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-civic-border" />
            <span className="absolute bg-white px-3 text-[11px] font-semibold text-civic-text-muted uppercase tracking-wider">
              Or continue with email
            </span>
          </div>

          {/* EMAIL & PASSWORD FORM */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-civic-text mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-civic-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-civic-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-civic-primary/30 focus:border-civic-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-civic-text mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-civic-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-civic-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-civic-primary/30 focus:border-civic-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-civic-text mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-civic-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-civic-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-civic-primary/30 focus:border-civic-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-civic-text-muted hover:text-civic-text"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-civic-primary hover:bg-civic-primary-dark text-white font-bold text-sm shadow-md shadow-civic-primary/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* TOGGLE SIGNIN / SIGNUP */}
          <div className="mt-4 text-center text-xs text-civic-text-muted">
            {mode === 'signin' ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                  className="text-civic-primary font-bold hover:underline"
                >
                  Create one
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg('');
                  }}
                  className="text-civic-primary font-bold hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>

          {/* OFFICIAL SEPARATE ACCOUNTS FOR USER, STAFF, ADMIN */}
          <div className="mt-6 pt-5 border-t border-civic-border">
            <p className="text-[11px] font-bold text-center text-civic-text mb-1 flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3 text-[#176B68]" />
              <span>Official Seeded Accounts (Tap to Autofill):</span>
            </p>
            <p className="text-[10px] text-center text-civic-text-muted mb-2.5">
              Default password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">password123</code>
            </p>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => autofillCredentials('citizen@nammacity.gov.in')}
                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-teal-50 border border-civic-border hover:border-teal-300 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">
                    C
                  </div>
                  <div>
                    <p className="text-xs font-bold text-civic-text">Citizen User</p>
                    <p className="text-[10px] text-civic-text-muted font-mono">citizen@nammacity.gov.in</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">Autofill</span>
              </button>

              <button
                type="button"
                onClick={() => autofillCredentials('staff@nammacity.gov.in')}
                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-civic-border hover:border-amber-300 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                    S
                  </div>
                  <div>
                    <p className="text-xs font-bold text-civic-text">Field Staff</p>
                    <p className="text-[10px] text-civic-text-muted font-mono">staff@nammacity.gov.in</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">Autofill</span>
              </button>

              <button
                type="button"
                onClick={() => autofillCredentials('admin@nammacity.gov.in')}
                className="w-full p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-civic-border hover:border-purple-300 flex items-center justify-between text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <div>
                    <p className="text-xs font-bold text-civic-text">Ward Admin</p>
                    <p className="text-[10px] text-civic-text-muted font-mono">admin@nammacity.gov.in</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded">Autofill</span>
              </button>
            </div>

            {/* Instant Demo Bypass */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-civic-text-muted">Instant Portal Access:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoBypass('CITIZEN')}
                  className="px-2 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-[10px] font-bold text-teal-800 transition-colors"
                >
                  Citizen →
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoBypass('STAFF')}
                  className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-[10px] font-bold text-amber-800 transition-colors"
                >
                  Staff →
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoBypass('ADMIN')}
                  className="px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-[10px] font-bold text-purple-800 transition-colors"
                >
                  Admin →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-civic-border/70 py-3 text-center text-xs text-civic-text-muted">
        <span>BBMP • BESCOM • BWSSB • Government of Karnataka</span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm">
          Loading login portal...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}

