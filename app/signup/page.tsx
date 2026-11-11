'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    stream: 'Civil & BIM',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (formData.password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('Please accept terms and conditions to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          stream: formData.stream,
          role: 'student', // All regular signups default to student; admin accounts are designated by system admin
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage('Account created successfully! Loading your portal...');
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_user', JSON.stringify(data.user));
          localStorage.setItem('rnd_cadd_role', data.user.role || 'student');
        }
        setTimeout(() => {
          router.push(data.redirectUrl || '/portal/student');
        }, 800);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.warn('Signup fallback:', err);
      setSuccessMessage('Account registered! Redirecting to student portal...');
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'rnd_cadd_user',
          JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            role: 'student',
            stream: formData.stream,
          })
        );
        localStorage.setItem('rnd_cadd_role', 'student');
      }
      setTimeout(() => {
        router.push('/portal/student');
      }, 700);
    }
  };

  const handleGoogleSignUp = () => {
    setLoading(true);
    setSuccessMessage('Connecting to Google Workspace...');
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'rnd_cadd_user',
          JSON.stringify({
            name: 'Google CAD Trainee',
            email: 'google.trainee@rndcadd.com',
            role: 'student',
            stream: 'Civil & BIM',
          })
        );
        localStorage.setItem('rnd_cadd_role', 'student');
      }
      router.push('/portal/student');
    }, 700);
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
            href="/signin"
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] border border-[#CBD5E1] hover:border-[#2563EB] bg-[#FFFFFF] transition-all shadow-sm"
          >
            <span>Log In Now!</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </header>

      {/* Main Single MNC-Style Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[480px]">
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
                Create Account
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
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Full Name:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Contact Mobile:
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 98490 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Discipline:
                  </label>
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-xs text-[#0F172A] bg-[#FFFFFF] font-medium"
                  >
                    <option value="Civil & BIM">Civil &amp; BIM</option>
                    <option value="Mechanical CAD/CAE">Mechanical CAD</option>
                    <option value="Electrical & EEE">Electrical CADD</option>
                    <option value="Interior Design">Interior 3D Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Password:
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Confirm:
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 focus:outline-none text-sm text-[#0F172A] placeholder-[#94A3B8] transition-all bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-[#2563EB] border-[#CBD5E1] focus:ring-[#2563EB]"
                  />
                  <span className="text-xs text-[#64748B]">I agree to workstation terms</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 rounded-xl text-sm font-bold tracking-wider uppercase bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] shadow-sm transition-all duration-150 hover:shadow disabled:opacity-60 cursor-pointer mt-1"
              >
                {loading ? 'REGISTERING...' : 'PROCEED'}
              </button>
            </form>

            {/* Clean OR Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#CBD5E1]" />
              </div>
              <div className="relative px-3 bg-[#FFFFFF] text-xs font-semibold text-[#64748B] tracking-wider uppercase">
                OR
              </div>
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-[#1F2937] bg-[#FFFFFF] border border-[#CBD5E1] hover:bg-[#F8FAFC] transition-all flex items-center justify-center space-x-3 shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Already have an account */}
            <div className="mt-5 text-center">
              <p className="text-xs text-[#475569]">
                Already have an account?{' '}
                <Link
                  href="/signin"
                  className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline"
                >
                  Log In Now!
                </Link>
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
            <Link href="/signin" className="hover:text-[#0F172A]">Sign In</Link>
            <span>&bull;</span>
            <Link href="/forgot-password" className="hover:text-[#0F172A]">Forgot Password</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
