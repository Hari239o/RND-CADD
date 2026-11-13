'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { JobPost } from '@/lib/jobs-data';
import { INITIAL_JOBS } from '@/lib/jobs-data';

export default function JobsPortalPage() {
  const [jobsList, setJobsList] = useState<JobPost[]>(INITIAL_JOBS);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Application Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobPost | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobPost | null>(null);
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantStream, setApplicantStream] = useState<string>('');
  const [applicantStudentId, setApplicantStudentId] = useState<string>('');
  const [applicantQualification, setApplicantQualification] = useState<string>('');
  const [applicantPortfolio, setApplicantPortfolio] = useState<string>('');
  const [applicantCoverNote, setApplicantCoverNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync Logged-In User from localStorage
  useEffect(() => {
    const syncUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('rnd_cadd_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.email || parsed.role)) {
              setCurrentUser(parsed);
              setApplicantName(parsed.name || '');
              setApplicantEmail(parsed.email || '');
              setApplicantStudentId(parsed.studentId || parsed.id || 'STU-001');
              setApplicantStream(parsed.stream || 'Civil & Architectural BIM');
              setApplicantPhone(parsed.phone || parsed.mobile || '+91 99080 12345');
              setApplicantQualification(parsed.qualification || 'B.Tech in Civil Engineering');
            } else {
              setCurrentUser(null);
            }
          } else {
            setCurrentUser(null);
          }
        }
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // Fetch Live Jobs from API
  const loadJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setJobsList(data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const isStudent = currentUser?.role === 'student';
  const isAdmin = currentUser?.role === 'admin';

  const handleSignOut = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rnd_cadd_user');
        localStorage.removeItem('rnd_cadd_role');
        setCurrentUser(null);
        window.dispatchEvent(new Event('storage'));
        showToast('Signed out successfully');
      }
    } catch {
      // ignore
    }
  };

  // Open apply modal with pre-filled student details
  const handleInitiateApply = (job: JobPost) => {
    if (!currentUser) {
      setSelectedJobForApply(job);
      return;
    }
    setSelectedJobForApply(job);
    setApplicantName(currentUser.name || 'Ram.g');
    setApplicantEmail(currentUser.email || 'student1@gmail.com');
    setApplicantStudentId(currentUser.studentId || currentUser.id || 'STU-001');
    setApplicantStream(currentUser.stream || job.discipline);
    setApplicantPhone(currentUser.phone || currentUser.mobile || '+91 99080 12345');
    setApplicantQualification(currentUser.qualification || 'B.Tech in Civil Engineering');
  };

  // Submit Job Application
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    if (!applicantName.trim() || !applicantEmail.trim() || !applicantPhone.trim()) {
      showToast('⚠️ Please provide your full name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJobForApply.id,
          name: applicantName.trim(),
          email: applicantEmail.trim(),
          phone: applicantPhone.trim(),
          stream: applicantStream || selectedJobForApply.discipline,
          studentId: applicantStudentId || 'DIRECT-APPLICANT',
          qualification: applicantQualification || 'B.Tech / Diploma in Engineering',
          portfolioUrl: applicantPortfolio.trim(),
          coverNote: applicantCoverNote.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApplySuccessMsg(data.message || 'Application submitted successfully to recruiting partners!');
        loadJobs();
        setTimeout(() => {
          setSelectedJobForApply(null);
          setApplySuccessMsg('');
          showToast('✓ Application recorded and sent to EPC hiring team');
        }, 2000);
      } else {
        alert(data.message || 'Failed to submit application. Please verify details.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Network error submitting job application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disciplineTabs = [
    { id: 'all', label: 'All Openings', count: jobsList.length },
    { id: 'civil', label: 'Civil & BIM', count: jobsList.filter((j) => j.discipline === 'civil').length },
    { id: 'mechanical', label: 'Mechanical CAD/CAE', count: jobsList.filter((j) => j.discipline === 'mechanical').length },
    { id: 'electrical', label: 'Electrical & Automation', count: jobsList.filter((j) => j.discipline === 'electrical').length },
    { id: 'piping', label: 'Piping & Plant CAD', count: jobsList.filter((j) => j.discipline === 'piping').length },
    { id: 'interior', label: 'Interior Architecture', count: jobsList.filter((j) => j.discipline === 'interior').length },
    { id: 'ppm', label: 'Project Management (PPM)', count: jobsList.filter((j) => j.discipline === 'ppm').length },
  ];

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const matchesDiscipline =
        selectedDiscipline === 'all' ||
        job.discipline === selectedDiscipline ||
        job.discipline === 'all';

      const matchesMode =
        selectedWorkMode === 'all' ||
        job.workMode.toLowerCase() === selectedWorkMode.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.tools.some((t) => t.toLowerCase().includes(q)) ||
        job.description.toLowerCase().includes(q);

      return matchesDiscipline && matchesMode && matchesSearch;
    });
  }, [jobsList, selectedDiscipline, selectedWorkMode, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#EE2C3C] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#131313] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-sm font-semibold flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FLOATING TOP NAVIGATION BAR (Exact unlox.com / RND CADD aesthetic) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <span className="hidden sm:inline-block text-slate-300 font-light">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#EE2C3C] animate-pulse"></span>
            Career Portal
          </span>
        </div>

        {/* Right Navigation & Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="text-xs font-bold text-slate-600 hover:text-[#EE2C3C] px-3 py-2 rounded-xl hover:bg-slate-50 transition-all hidden md:inline-block"
          >
            &larr; Back to Main Site
          </Link>

          {isStudent ? (
            <>
              <Link
                href="/portal/student"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#15304C] hover:text-[#EE2C3C] border border-slate-200 hover:border-[#EE2C3C] bg-white transition-all shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{currentUser?.name || 'Ram.g'} (Portal)</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : isAdmin ? (
            <>
              <Link
                href="/portal/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#15304C] hover:bg-[#0F2038] transition-all shadow-2xs"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Admin Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin?redirect=/jobs"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#EE2C3C] border border-slate-200 hover:border-[#EE2C3C] bg-white transition-all shadow-2xs"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 sm:px-5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase bg-[#EE2C3C] hover:bg-[#D71E2E] text-white border border-[#EE2C3C] transition-all shadow-md hover:shadow-red-500/25"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION (Exact Reference: https://jobs.unlox.com/) */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/90">
        {/* Animated Background High-Tech Grid & Radial Orbs */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] rounded-full bg-red-400/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-40 -left-20 w-[450px] h-[450px] rounded-full bg-blue-400/10 blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Live Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/80 mb-6 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EE2C3C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EE2C3C]"></span>
            </span>
            <span className="text-xs font-black text-[#EE2C3C] tracking-wider uppercase font-mono">
              ENGINEERING PLACEMENT PORTAL &bull; LIVE VACANCIES
            </span>
          </div>

          {/* Main Unlox-Style Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#131313] tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Unlox Your Future{' '}
            <span className="bg-gradient-to-r from-[#EE2C3C] via-[#FF4D4F] to-[#15304C] bg-clip-text text-transparent">
              Today
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Step into India’s most advanced student career ecosystem. Trusted by leading EPC institutions, BIM consultancies, and Fortune 500 infrastructure firms.
          </p>

          {/* Verified Student Stream Highlight Banner */}
          {isStudent && (
            <div className="mt-8 max-w-2xl mx-auto p-3.5 sm:p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">✓</span>
                <span>
                  Logged in as <strong>{currentUser?.name || 'Ram.g'}</strong> &bull; Tailored for <strong>{currentUser?.stream || 'Civil CADD & Master BIM'}</strong>
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                {currentUser?.studentId || 'STU-001'}
              </span>
            </div>
          )}

          {/* Interactive Search Console */}
          <div className="mt-10 max-w-3xl mx-auto bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, tool (Revit, AutoCAD, SolidWorks, SP3D), company, or location..."
                className="w-full pl-11 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#EE2C3C] transition-all"
              />
              <span className="absolute left-4 top-4 text-slate-400 text-base">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 px-2 py-1 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Work Mode Quick Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                Showing {filteredJobs.length} Engineering Roles
              </span>
              <div className="flex items-center space-x-1.5">
                {['all', 'on-site', 'hybrid', 'remote'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSelectedWorkMode(mode)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                      selectedWorkMode === mode
                        ? 'bg-[#131313] text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {mode === 'all' ? 'All Modes' : mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY HIRE FROM US / UNLOX INTERACTIVE FEATURE SECTION (Exact from jobs.unlox.com) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#EE2C3C] uppercase tracking-widest font-mono">
              Hiring, Made Easy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#131313] tracking-tight mt-1">
              Why Top EPC Firms &amp; Consultancies Hire From Us
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Every student undergoes intensive industrial CAD/BIM modeling rigor, clash matrix coordination, and real-time capstone deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1: Diverse Student Community */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EE2C3C]/10 text-[#EE2C3C] flex items-center justify-center font-black text-xl">
                👥
              </div>
              <h3 className="text-xl font-bold text-[#131313]">Diverse Student Community</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Access pre-trained candidates from Civil, Mechanical, Electrical, Piping, and PPM streams that bring precision, BIM coordination, and fresh perspectives to your engineering teams.
              </p>

              {/* Animated Interactive Candidate Preview Badges */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#131313] text-white flex items-center justify-center text-xs font-bold">
                      SM
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Shreya Moitra</h5>
                      <span className="text-[10px] text-slate-500">Junior BIM Modeler &bull; Revit &amp; Navisworks</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    Shortlisted
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EE2C3C] text-white flex items-center justify-center text-xs font-bold">
                      RG
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Ram.g (STU-001)</h5>
                      <span className="text-[10px] text-slate-500">Parametric BIM &amp; Civil CAD</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Well-Trained Pool of Candidates */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-[#131313]">Well-Trained Pool of Candidates</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Every candidate is industry-ready, trained with practical skills and real-time industrial drawing sets on dedicated NVIDIA Quadro workstations, ensuring faster onboarding and reduced corporate training costs.
              </p>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold space-y-1">
                <div className="flex items-center justify-between">
                  <span>Industrial Tool Proficiency:</span>
                  <span className="font-bold">100% Verified</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[96%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Card 3: Free of Cost Hiring */}
            <div className="bg-gradient-to-b from-slate-50 to-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl">
                🎯
              </div>
              <h3 className="text-xl font-bold text-[#131313]">Direct Campus Placement</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Hire top engineering talent directly from Autodesk &amp; Dassault training labs without paying recruitment commission fees. Quality candidate matching accessible to every engineering contractor.
              </p>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                <span>Placement Success Ratio</span>
                <span className="font-black text-emerald-700 text-sm">94.8% Shortlisted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECRUITER PARTNER BRANDS TICKER */}
      <section className="py-8 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-4">
            Authorized Recruitment Drives with Fortune 500 EPC Partners
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-700">LARSEN &amp; TOUBRO</span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-700">TATA PROJECTS</span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-700">PETROFAC</span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-700">SCHNEIDER ELECTRIC</span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-700">JACOBS ENGINEERING</span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-700">WORLEY</span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-700">GODREJ CONSTRUCTION</span>
          </div>
        </div>
      </section>

      {/* DISCIPLINE FILTER TABS & VACANCIES LISTING */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#131313] tracking-tight">
              Verified Industry Openings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Click any vacancy to inspect job expectations, required tools, and submit your portfolio directly.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 self-start md:self-auto">
            {filteredJobs.length} Vacancies Open
          </span>
        </div>

        {/* Discipline Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {disciplineTabs.map((tab) => {
            const isActive = selectedDiscipline === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDiscipline(tab.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#EE2C3C] text-white shadow-md shadow-red-500/25 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* JOBS GRID */}
        {isLoadingJobs ? (
          <div className="py-20 text-center text-sm font-semibold text-slate-500 bg-white rounded-3xl border border-slate-200">
            Loading live engineering job vacancies...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <span className="text-3xl">🔍</span>
            <h4 className="text-base font-bold text-slate-800">No vacancies match your current filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching disciplines or clearing search filters to see all active placement opportunities.
            </p>
            <button
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedWorkMode('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#EE2C3C]/50 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Discipline Tag & Work Mode */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#131313] text-white font-mono">
                      {job.discipline.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {job.workMode}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-[#131313] group-hover:text-[#EE2C3C] transition-colors line-clamp-2 leading-snug">
                    {job.title}
                  </h3>

                  {/* Company Name & Verification */}
                  <div className="flex items-center space-x-1.5 mt-2">
                    <span className="text-sm font-semibold text-slate-700">{job.company}</span>
                    <span className="text-blue-500 text-xs" title="Verified Recruiter">✓</span>
                  </div>

                  {/* Key Metadata Row: Location, Salary, Experience */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400">📍</span>
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-bold text-emerald-700">
                      <span>💰</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-400">⏳</span>
                      <span className="truncate">{job.experience}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                      <span>👥</span>
                      <span>{job.vacancies} Openings</span>
                    </div>
                  </div>

                  {/* Required Tools Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                      Required Software Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tools.slice(0, 4).map((tool) => (
                        <span
                          key={tool}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80"
                        >
                          {tool}
                        </span>
                      ))}
                      {job.tools.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-400 self-center">
                          +{job.tools.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Snippet */}
                  <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateApply(job)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold transition-all shadow-xs hover:shadow-red-500/25 cursor-pointer text-center"
                  >
                    Quick Apply &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* UNLOX-STYLE MEMBERSHIP ACCELERATION BANNER */}
      <section className="py-16 sm:py-20 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4D4F] px-3.5 py-1 rounded-full bg-white/5 border border-white/10 mb-4 inline-block">
            Student Placement Support
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Become an Enrolled R&amp;D CADD Student
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Unlock exclusive engineering career benefits — direct recruiter introduction, Autodesk &amp; Dassault certification portfolio verification, and 100% placement drive access.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm font-bold shadow-lg shadow-red-500/25 transition-all"
            >
              Register as Student
            </Link>
            <Link
              href="/signin?redirect=/jobs"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition-all"
            >
              Sign In to Placements &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* MODAL 1: VIEW JOB DETAILS */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleUp">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[#131313] text-white font-mono uppercase">
                  {selectedJobForDetails.discipline}
                </span>
                <h3 className="text-2xl font-bold text-[#131313] mt-2">
                  {selectedJobForDetails.title}
                </h3>
                <p className="text-sm font-semibold text-slate-600 mt-0.5">
                  {selectedJobForDetails.company} &bull; {selectedJobForDetails.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Salary</span>
                <span className="font-bold text-emerald-700">{selectedJobForDetails.salary}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Work Mode</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.workMode}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Experience</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.experience}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Vacancies</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.vacancies} Openings</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Job Description &amp; Scope</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {selectedJobForDetails.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Required Software Tools &amp; Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJobForDetails.tools.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const j = selectedJobForDetails;
                  setSelectedJobForDetails(null);
                  handleInitiateApply(j);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold shadow-md shadow-red-500/25 cursor-pointer"
              >
                Apply for this Role &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE QUICK APPLY MODAL */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleUp">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#EE2C3C] uppercase">Direct Recruiter Application</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#131313] mt-1">
                  Apply for {selectedJobForApply.title}
                </h3>
                <p className="text-xs font-medium text-slate-500">
                  {selectedJobForApply.company} &bull; {selectedJobForApply.location} &bull; {selectedJobForApply.salary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedJobForApply(null);
                  setApplySuccessMsg('');
                }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {applySuccessMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <span className="text-3xl">✓</span>
                <h4 className="text-base font-bold">Application Submitted!</h4>
                <p className="text-xs font-medium text-emerald-700">{applySuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                {!currentUser && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                    <span className="font-bold">Notice:</span>
                    <span>
                      You are not logged in. For fastest interview scheduling and verified CAD portfolio endorsement, please{' '}
                      <Link href="/signin?redirect=/jobs" className="font-bold underline text-[#EE2C3C]">
                        Sign In with Student Credentials
                      </Link>.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                      placeholder="e.g. Ram G."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EE2C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      required
                      placeholder="e.g. student1@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EE2C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      required
                      placeholder="+91 99080 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EE2C3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={applicantStudentId}
                      onChange={(e) => setApplicantStudentId(e.target.value)}
                      placeholder="STU-001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-[#EE2C3C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Portfolio / Drive Project Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://drive.google.com/your-bim-model-or-linkedin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EE2C3C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brief Note to Hiring Manager
                  </label>
                  <textarea
                    rows={3}
                    value={applicantCoverNote}
                    onChange={(e) => setApplicantCoverNote(e.target.value)}
                    placeholder="Mention your key CAD tools, hands-on capstone project, and notice period..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#EE2C3C]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Confirm & Apply Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="RND CADD" className="h-7 w-auto object-contain" />
            <span>&bull; Industrial Engineering Placement Portal</span>
          </div>
          <div>
            Copyright &copy; 2026 RND CADD Training Institute. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}