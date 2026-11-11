'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const normEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!normEmail || !trimmedPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);

    // Direct Instant Handling for Specified Credentials
    if (
      normEmail.includes('harikishore') ||
      normEmail.includes('admin') ||
      normEmail === 'harikishorereddy9908@gmial.com' ||
      normEmail === 'harikishorereddy9908@gmail.com'
    ) {
      if (trimmedPassword === '9908') {
        const userObj = {
          name: 'Hari Kishore Reddy',
          email: normEmail,
          role: 'admin',
          stream: 'Executive Administration',
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_user', JSON.stringify(userObj));
          localStorage.setItem('rnd_cadd_role', 'admin');
          window.location.href = '/portal/admin';
        }
        return;
      } else {
        setErrorMessage('Invalid password for administrator account.');
        setLoading(false);
        return;
      }
    }

    if (
      normEmail.includes('student') ||
      normEmail === 'student1@gmail.com'
    ) {
      if (trimmedPassword === '9908') {
        const userObj = {
          name: 'Ram.g',
          email: normEmail,
          role: 'student',
          stream: 'Civil & Architectural BIM',
          assignedCourses: ['Civil CADD & Master BIM', 'Interior Architecture & 3D Visualization'],
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_user', JSON.stringify(userObj));
          localStorage.setItem('rnd_cadd_role', 'student');
          window.location.href = '/portal/student';
        }
        return;
      } else {
        setErrorMessage('Invalid password for student account.');
        setLoading(false);
        return;
      }
    }

    // Server verification for registered users in MongoDB
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password: trimmedPassword }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_user', JSON.stringify(data.user));
          localStorage.setItem('rnd_cadd_role', data.user.role);
          window.location.href = data.redirectUrl || '/portal/student';
        }
      } else {
        setErrorMessage(data.message || 'Invalid credentials. Please verify your email and password.');
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage('Network connection error. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'rnd_cadd_user',
        JSON.stringify({
          name: 'Google CAD Member',
          email: 'member@gmail.com',
          role: 'student',
        })
      );
      localStorage.setItem('rnd_cadd_role', 'student');
      window.location.href = '/portal/student';
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between"
      style={{ fontFamily: 'Arial, Verdana, sans-serif' }}
    >
      {/* Top Header */}
      <header className="bg-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1] hover:border-[#94A3B8] bg-[#FFFFFF] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Single MNC Card (Matching Image 2) */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[440px]">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08),0_4px_12px_rgba(15,23,42,0.03)] p-7 sm:p-9">
            
            {/* Top Centered Logo */}
            <div className="flex flex-col items-center text-center mb-6">
              <Link href="/" className="inline-block mb-3">
                <img
                  src="/logo.png"
                  alt="RND CADD"
                  className="h-14 sm:h-16 w-auto object-contain"
                />
              </Link>
              <h1 className="text-2xl font-bold text-[#15304C] tracking-tight">
                Get Started
              </h1>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs font-medium rounded-xl flex items-start space-x-2">
                <svg className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] text-xs font-medium rounded-xl flex items-start space-x-2">
                <svg className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                  Email address:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#334155]">
                    Password:
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all bg-[#FFFFFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#475569] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center pt-0.5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB] border-[#CBD5E1] focus:ring-[#2563EB]"
                  />
                  <span className="text-xs text-[#64748B]">Remember this device</span>
                </label>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 rounded-xl text-sm font-bold tracking-wider uppercase bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] shadow-sm transition-all duration-150 hover:shadow disabled:opacity-60 cursor-pointer mt-1"
              >
                {loading ? 'AUTHENTICATING...' : 'PROCEED'}
              </button>
            </form>

            {/* Clean OR Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#CBD5E1]" />
              </div>
              <div className="relative px-3 bg-[#FFFFFF] text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                OR
              </div>
            </div>

            {/* Sign in with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-[#1F2937] bg-[#FFFFFF] border border-[#CBD5E1] hover:bg-[#F8FAFC] transition-all flex items-center justify-center space-x-3 shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Sign in with Google</span>
            </button>

            {/* Bottom Links */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[#475569]">
                Already have an account?{' '}
                <Link
                  href="/signin"
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                >
                  Log In Now!
                </Link>
              </p>
              <p className="text-xs text-[#475569] mt-1.5">
                New user?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                >
                  Register Workstation Account
                </Link>
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                By Signing in, you accept our{' '}
                <a href="#" className="text-[#2563EB] hover:underline">
                  terms and conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#2563EB] hover:underline">
                  privacy policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-3 text-center text-xs text-[#64748B]">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} RND CADD. All rights reserved.</span>
          <div className="flex items-center space-x-4 text-xs font-medium text-[#475569]">
            <Link href="/" className="hover:text-[#0F172A]">Home</Link>
            <span>&bull;</span>
            <Link href="/signup" className="hover:text-[#0F172A]">Sign Up</Link>
            <span>&bull;</span>
            <Link href="/forgot-password" className="hover:text-[#0F172A]">Forgot Password</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
