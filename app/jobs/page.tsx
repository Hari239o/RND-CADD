'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import type { JobPost } from '@/lib/jobs-data';
import { INITIAL_JOBS } from '@/lib/jobs-data';

export default function JobsPortalPage() {
  const [jobsList, setJobsList] = useState<JobPost[]>(INITIAL_JOBS);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Application & Details Modal State
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

  // Carousel scroll container ref
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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

  // Fetch Live Jobs from API with instant fallback
  const loadJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobsList(data.jobs);
        }
      }
    } catch (err) {
      console.warn('Using local jobs data fallback:', err);
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

  const handleInitiateApply = (job: JobPost) => {
    setSelectedJobForApply(job);
    if (currentUser) {
      setApplicantName(currentUser.name || 'Ram.g');
      setApplicantEmail(currentUser.email || 'student1@gmail.com');
      setApplicantStudentId(currentUser.studentId || currentUser.id || 'STU-001');
      setApplicantStream(currentUser.stream || job.discipline);
      setApplicantPhone(currentUser.phone || currentUser.mobile || '+91 99080 12345');
      setApplicantQualification(currentUser.qualification || 'B.Tech / Diploma in Engineering');
    }
  };

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
        setApplySuccessMsg(data.message || 'Application submitted successfully to corporate recruiters!');
        loadJobs();
        setTimeout(() => {
          setSelectedJobForApply(null);
          setApplySuccessMsg('');
          showToast('✓ Application sent directly to hiring team');
        }, 1800);
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#1D1D1F] font-sans antialiased selection:bg-[#0066ff] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-sm font-medium flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR (Pleasant modern clean theme) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <span className="hidden sm:inline-block text-slate-300 font-light">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#0066ff] bg-[#E7F0FF] px-3 py-1 rounded-full border border-[#C7DEFF]">
            <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-pulse"></span>
            Job Portal
          </span>
        </div>

        {/* Center / Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#1D1D1F]/80">
          <a href="#openings" className="hover:text-[#0066ff] transition">
            All Openings
          </a>
          <a href="#why-hire" className="hover:text-[#0066ff] transition">
            Why Hire From Us
          </a>
          <a href="#community" className="hover:text-[#0066ff] transition">
            Student Community
          </a>
          <a href="#employers" className="text-[#0066ff] font-semibold flex items-center gap-1 hover:underline">
            For Employers <span>&rarr;</span>
          </a>
        </div>

        {/* Right Navigation & Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <Link
                href={isAdmin ? '/portal/admin' : '/portal/student'}
                className="inline-flex items-center gap-2 bg-[#0066ff] hover:bg-[#0055e6] text-white px-5 py-2 rounded-md font-medium text-sm transition shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span>{currentUser.name || 'Dashboard'}</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="border border-slate-300 px-4 py-2 rounded-md text-slate-600 hover:text-red-600 hover:border-red-300 text-sm font-medium transition cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin?redirect=/jobs"
                className="bg-[#0066ff] hover:bg-[#0055e6] text-white px-6 py-2 rounded-md text-sm font-medium transition shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="border border-[#0066ff] text-[#0066ff] hover:bg-blue-50 px-6 py-2 rounded-md text-sm font-medium transition"
              >
                Register
              </Link>
              <a
                href="#employers"
                className="text-[#0066ff] font-medium text-sm flex items-center gap-1 hover:underline pl-2"
              >
                For Employers <span>&rsaquo;</span>
              </a>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div
          className="md:hidden cursor-pointer p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg viewBox="0 0 100 60" width="28" height="28">
            <rect
              width="80"
              height="10"
              rx="5"
              className={`fill-[#1D1D1F] transition-all duration-300 origin-center ${
                mobileMenuOpen ? 'rotate-45 translate-y-[25px]' : 'rotate-0 translate-y-0'
              }`}
            />
            <rect
              y="20"
              width="80"
              height="10"
              rx="5"
              className={`fill-[#1D1D1F] transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <rect
              y="40"
              width="80"
              height="10"
              rx="5"
              className={`fill-[#1D1D1F] transition-all duration-300 origin-center ${
                mobileMenuOpen ? '-rotate-45 -translate-y-[20px] translate-x-[5px]' : 'rotate-0 translate-y-0'
              }`}
            />
          </svg>
        </div>

        {/* Mobile Slide-out Menu */}
        <div
          className={`fixed inset-0 z-40 bg-white flex flex-col items-start justify-start pt-24 px-6 gap-5 transition-transform duration-300 md:hidden shadow-2xl ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <a
            href="#openings"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-[#1D1D1F] hover:text-[#0066ff]"
          >
            All Openings
          </a>
          <a
            href="#why-hire"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-[#1D1D1F] hover:text-[#0066ff]"
          >
            Why Hire From Us
          </a>
          <a
            href="#community"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-[#1D1D1F] hover:text-[#0066ff]"
          >
            Student Community
          </a>
          <a
            href="#employers"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg font-semibold text-[#0066ff] flex items-center gap-1"
          >
            For Employers &rarr;
          </a>

          <div className="w-full pt-4 border-t border-slate-200 flex flex-col gap-3">
            {currentUser ? (
              <>
                <Link
                  href={isAdmin ? '/portal/admin' : '/portal/student'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#0066ff] w-full py-3 rounded-md text-white font-medium text-center hover:bg-[#0055e6] transition"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="border border-slate-300 w-full py-3 rounded-md text-slate-700 font-medium text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin?redirect=/jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-[#0066ff] w-full py-3 rounded-md text-white font-medium text-center hover:bg-[#0055e6] transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-[#0066ff] w-full py-3 rounded-md text-[#0066ff] font-medium text-center hover:bg-blue-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION (Pleasant Blue Gradient with Radial Glow Orbs) */}
      <section className="relative w-full min-h-[580px] bg-[linear-gradient(to_bottom,_#FFFFFF_0%,_#FFFFFF_30%,_#C0DCFF_100%)] flex items-center pt-28 pb-16 overflow-hidden">
        {/* Soft Radial Gradient Glow Circles */}
        <div className="w-[850px] h-[850px] absolute top-[-70%] left-[45%] max-sm:left-[-60%] max-sm:top-[-40%] rounded-full pointer-events-none">
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0)_30%,_rgba(145,194,255,0.45)_100%)]" />
        </div>
        <div className="w-[850px] h-[850px] absolute top-[50%] left-[45%] max-sm:left-[-60%] max-sm:top-[70%] rounded-full pointer-events-none">
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0)_30%,_rgba(145,194,255,0.45)_100%)]" />
        </div>

        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16 w-full flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          {/* Left Column: Heading and Subtitle */}
          <div className="w-full md:w-3/5 flex flex-col text-left">
            {/* Live Status Pill */}
            <div className="w-fit inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E7F0FF] border border-[#C7DEFF] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-ping" />
              <span className="text-xs font-semibold text-[#0066ff] tracking-wide uppercase">
                RND CADD Career Ecosystem &bull; Live Vacancies
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-bl from-[#0062DC] via-[#0052cc] to-[#003D76] bg-clip-text text-transparent leading-[1.08] py-2">
              Accelerate Your <br /> Future Today
            </h1>

            <p className="mt-4 text-base sm:text-xl text-[#173B5D] opacity-80 max-w-xl font-normal leading-relaxed">
              Step into India’s most advanced engineering career ecosystem. Pre-trained, project-ready talent connected directly with industry leaders.
            </p>

            {/* Quick search and mode bar */}
            <div className="mt-8 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-[#C7DEFF] shadow-lg shadow-[#91C2FF]/20 max-w-xl">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search role, software tool (Revit, CATIA, SP3D), or city..."
                  className="w-full pl-11 pr-20 py-2.5 bg-transparent text-sm font-medium text-[#1D1D1F] placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Work Mode Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-medium">
              <span className="text-[#173B5D]/70 font-semibold pr-1">Work Mode:</span>
              {['all', 'on-site', 'hybrid', 'remote'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`px-3 py-1 rounded-full capitalize transition cursor-pointer ${
                    selectedWorkMode === mode
                      ? 'bg-[#0066ff] text-white shadow-xs font-semibold'
                      : 'bg-white/80 text-slate-600 hover:bg-white border border-[#C7DEFF]/60'
                  }`}
                >
                  {mode === 'all' ? 'All Modes' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: High-tech Engineering Stat Showcase Graphic */}
          <div className="w-full md:w-2/5 flex justify-center">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[28px] p-6 sm:p-7 border border-[#C7DEFF] shadow-xl shadow-[#91C2FF]/20 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F0FF] flex items-center justify-center text-[#0066ff] font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1D1D1F]">Direct Recruiter Pipeline</h4>
                    <p className="text-xs text-slate-500">Autodesk &amp; Dassault Lab Graduates</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Drives
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#E7F0FF]/60 rounded-2xl p-3.5 border border-[#C7DEFF]/40">
                  <span className="text-xs text-[#5B6F8E] font-medium block">Total Openings</span>
                  <span className="text-2xl font-bold text-[#1D1D1F]">{jobsList.length} Roles</span>
                </div>
                <div className="bg-[#E7F0FF]/60 rounded-2xl p-3.5 border border-[#C7DEFF]/40">
                  <span className="text-xs text-[#5B6F8E] font-medium block">Highest Package</span>
                  <span className="text-2xl font-bold text-[#0066ff]">₹9.0 LPA</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  Top Disciplines In Demand:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Civil &amp; BIM
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Mechanical CAE
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Process Piping SP3D
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Plant CAD
                  </span>
                </div>
              </div>

              <a
                href="#openings"
                className="w-full bg-[#0066ff] hover:bg-[#0055e6] text-white py-2.5 rounded-[30px] font-semibold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
              >
                <span>Browse All Opportunities</span>
                <span>&darr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RECRUITER PARTNER BRANDS TICKER (bg-[#C0DCFF] ribbon) */}
      <section className="bg-[#C0DCFF] py-6 sm:py-8 w-full flex flex-col items-center gap-5 border-y border-[#A5CAFE]/40 overflow-hidden">
        <p className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] opacity-80 text-center px-4">
          Trusted by Leading Institutions &amp; Companies
        </p>

        <div className="w-full overflow-hidden relative">
          <div className="flex items-center justify-around gap-8 sm:gap-14 animate-marquee whitespace-nowrap px-4 opacity-85">
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              LARSEN &amp; TOUBRO
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              TATA TECHNOLOGIES
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              WORLEY ENGINEERING
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              JACOBS ENGINEERING
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              PETROFAC
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              SCHNEIDER ELECTRIC
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              BENTLEY SYSTEMS
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1D1D1F] tracking-tight bg-white/70 px-4 py-2 rounded-xl shadow-xs">
              AUTODESK TRAINING LABS
            </span>
          </div>
        </div>
      </section>

      {/* WHY HIRE FROM US SECTION (Linear Gradient to Top) */}
      <section
        id="why-hire"
        className="w-full h-auto flex flex-col items-center py-20 bg-[linear-gradient(to_top,_#FFFFFF_0%,_#FFFFFF_5%,_#C0DCFF_100%)]"
      >
        <h2 className="text-[#333435] text-3xl sm:text-5xl font-medium text-center">
          Why hire from us ?
        </h2>
        <p className="text-[#333435] text-xl sm:text-3xl opacity-90 mt-2 sm:mt-3 text-center">
          Hiring, Made Easy
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 w-[85%] max-w-[1200px] gap-6 py-10">
          {/* Feature 1: Diverse Student Community */}
          <div
            id="community"
            className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100 space-y-6"
          >
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-90 font-medium">
                Diverse Student Community
              </h3>
              <p className="text-sm sm:text-base text-[#1D1D1F] opacity-75 leading-relaxed">
                Access candidates from varied engineering domains, backgrounds, and tool competencies that bring diversity, innovation, and fresh perspectives to your project delivery teams.
              </p>
            </div>

            {/* Interactive Candidate Cards Preview (Exact as reference) */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0066ff] text-white flex items-center justify-center font-bold text-sm">
                    SM
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#1D1D1F]">Shreya Moitra</h5>
                    <p className="text-xs text-slate-500">BIM Modeler &bull; Revit &amp; Navisworks</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Connecting with Shreya Moitra...')}
                  className="px-4 py-1.5 rounded-full bg-[#C7DEFF] text-[#0066ff] hover:bg-[#a6c9ff] text-xs font-semibold transition"
                >
                  Connect
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#173B5D] text-white flex items-center justify-center font-bold text-sm">
                    SK
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#1D1D1F]">Surya K.</h5>
                    <p className="text-xs text-slate-500">Mechanical CAD &bull; CATIA &amp; SolidWorks</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Connecting with Surya K...')}
                  className="px-4 py-1.5 rounded-full bg-[#C7DEFF] text-[#0066ff] hover:bg-[#a6c9ff] text-xs font-semibold transition"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>

          {/* Feature 2: Well-Trained Pool of Candidates */}
          <div className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-90 font-medium">
                Well-Trained Pool of Candidates
              </h3>
              <p className="text-sm sm:text-base text-[#1D1D1F] opacity-75 leading-relaxed">
                Every candidate is industry-ready, trained with practical skills and real-time industrial drawing projects, ensuring faster onboarding and drastically reduced corporate training costs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#E7F0FF] border border-[#C7DEFF] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#173B5D]">
                <span>Industrial Rigor &amp; Clash Coordination</span>
                <span className="text-[#0066ff] font-bold">100% Verified</span>
              </div>
              <div className="w-full bg-[#C7DEFF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0066ff] h-full w-[95%] rounded-full" />
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Trained on dedicated NVIDIA Quadro workstations with real-world EPC drawings.
              </p>
            </div>
          </div>

          {/* Feature 3: Hire From Top Technical Labs */}
          <div className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-90 font-medium">
                Hire From Top Technical Labs
              </h3>
              <p className="text-sm sm:text-base text-[#1D1D1F] opacity-75 leading-relaxed">
                RND CADD connects you with ambitious engineering students from leading institutions, giving you direct access to premium, pre-screened talent across India.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                ✓ 0-2 Years Experience
              </span>
              <span className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                ✓ Certified Portfolios
              </span>
            </div>
          </div>

          {/* Feature 4: Free of Cost Hiring */}
          <div className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-90 font-medium">
                Free of Cost Hiring
              </h3>
              <p className="text-sm sm:text-base text-[#1D1D1F] opacity-75 leading-relaxed">
                Hire top engineering talent without paying a single rupee. RND CADD makes quality hiring accessible to every engineering enterprise by eliminating third-party recruitment fees.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Placement Guarantee</span>
                <span className="text-[11px] text-emerald-700">Zero recruitment commission charged</span>
              </div>
              <span className="text-sm font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                100% Free
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS SECTION (Pleasant modern #E7F0FF cards, #0066ff buttons) */}
      <section id="openings" className="w-full h-auto px-6 sm:px-12 lg:px-16 overflow-hidden py-14 max-w-[1400px] mx-auto">
        {/* Section Top Header with Prev/Next Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[#1D1D1F] text-2xl sm:text-[36px] leading-[40px] font-medium">
              Take the first step of your career here.
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              Click any opening to inspect job expectations, required software tools, and submit your portfolio directly.
            </p>
          </div>

          {/* Carousel Arrows & View Mode Switcher */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#C7DEFF] text-[#5B6F8E]">
              {filteredJobs.length} Vacancies Open
            </span>

            {/* Toggle View Mode */}
            <div className="flex bg-[#E7F0FF] p-1 rounded-full border border-[#C7DEFF]">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                  viewMode === 'carousel'
                    ? 'bg-[#0066ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0066ff]'
                }`}
                title="Carousel View"
              >
                Carousel
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                  viewMode === 'grid'
                    ? 'bg-[#0066ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0066ff]'
                }`}
                title="Grid View"
              >
                Grid
              </button>
            </div>

            {/* Arrow Buttons (Pleasant Modern Style) */}
            {viewMode === 'carousel' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="p-2.5 bg-[#C7DEFF] rounded-full hover:bg-[#a6c9ff] transition cursor-pointer text-[#5A6F8E] flex items-center justify-center shadow-xs"
                  aria-label="Previous Jobs"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="p-2.5 bg-[#C7DEFF] rounded-full hover:bg-[#a6c9ff] transition cursor-pointer text-[#5A6F8E] flex items-center justify-center shadow-xs"
                  aria-label="Next Jobs"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Discipline Navigation Tabs (Soft blue pills) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {disciplineTabs.map((tab) => {
            const isActive = selectedDiscipline === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDiscipline(tab.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#0066ff] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#E7F0FF] text-[#1D1D1F]/80 hover:bg-[#d8e8ff]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#5B6F8E]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* JOBS LISTING: Carousel or Grid */}
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#E7F0FF]/40 rounded-3xl border border-dashed border-[#C7DEFF] p-8">
            <span className="text-3xl">🔍</span>
            <h4 className="text-base font-bold text-[#1D1D1F]">No openings match your current filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching disciplines or resetting search filters to view active opportunities.
            </p>
            <button
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedWorkMode('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-[#0066ff] text-white text-xs font-semibold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          /* Smooth Horizontal Carousel */
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-none no-scrollbar snap-x snap-mandatory"
          >
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="w-[320px] sm:w-[350px] min-w-[320px] sm:min-w-[350px] snap-start bg-[#E7F0FF] rounded-[20px] p-6 flex flex-col justify-between gap-4 border border-[#C7DEFF]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top Discipline Tag & Work Mode */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-fit px-3 py-1 rounded-full bg-[#C7DEFF]">
                      <p className="text-[#5B6F8E] text-[13px] font-semibold uppercase tracking-wide">
                        {job.discipline}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]/70">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {job.workMode}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-[#1D1D1F] text-lg font-bold line-clamp-1">
                    {job.title}
                  </h3>

                  {/* Company Row */}
                  <div className="w-full flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-[#1D1D1F]/80">{job.company}</span>
                      <span className="text-[#0066ff] text-xs font-bold" title="Verified Employer">✓</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#C7DEFF] p-1 flex items-center justify-center font-bold text-xs text-[#0066ff] shadow-xs">
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Card Divider */}
                  <div className="w-full h-[1px] bg-[#1D1D1F]/15 my-3" />

                  {/* 4 Details Rows with SVGs */}
                  <div className="w-full flex flex-col gap-2 text-xs sm:text-sm text-[#1D1D1F]/80 font-medium">
                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{job.location}</span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 font-semibold text-[#0066ff]">
                      <span className="text-base leading-none text-[#0066ff]">₹</span>
                      <span>{job.salary}</span>
                    </div>

                    {/* Job Type */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{job.jobType}</span>
                    </div>

                    {/* Experience & Vacancies */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.experience} &bull; {job.vacancies} Openings</span>
                    </div>
                  </div>

                  {/* Required Software Tools */}
                  <div className="mt-3 pt-2.5 border-t border-[#1D1D1F]/10">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Required Software Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="bg-white/90 text-[#1D1D1F] text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-[#C7DEFF]"
                        >
                          {tool}
                        </span>
                      ))}
                      {job.tools.length > 3 && (
                        <span className="text-[10px] font-semibold text-[#5B6F8E] self-center">
                          +{job.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons (Pleasant Modern Style) */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="flex-1 bg-white hover:bg-slate-50 text-[#1D1D1F] border border-[#C7DEFF] py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateApply(job)}
                    className="flex-1 bg-[#0066ff] hover:bg-[#0055e6] text-white py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Quick Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#E7F0FF] rounded-[20px] p-6 flex flex-col justify-between gap-4 border border-[#C7DEFF]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-fit px-3 py-1 rounded-full bg-[#C7DEFF]">
                      <p className="text-[#5B6F8E] text-[13px] font-semibold uppercase tracking-wide">
                        {job.discipline}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]/70">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {job.workMode}
                    </span>
                  </div>

                  <h3 className="text-[#1D1D1F] text-lg font-bold line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="w-full flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-[#1D1D1F]/80">{job.company}</span>
                      <span className="text-[#0066ff] text-xs font-bold">✓</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#C7DEFF] p-1 flex items-center justify-center font-bold text-xs text-[#0066ff] shadow-xs">
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-[#1D1D1F]/15 my-3" />

                  <div className="w-full flex flex-col gap-2 text-xs sm:text-sm text-[#1D1D1F]/80 font-medium">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-[#0066ff]">
                      <span className="text-base leading-none text-[#0066ff]">₹</span>
                      <span>{job.salary}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{job.jobType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.experience} &bull; {job.vacancies} Openings</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1D1D1F]/10">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Required Software Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="bg-white/90 text-[#1D1D1F] text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-[#C7DEFF]"
                        >
                          {tool}
                        </span>
                      ))}
                      {job.tools.length > 3 && (
                        <span className="text-[10px] font-semibold text-[#5B6F8E] self-center">
                          +{job.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="flex-1 bg-white hover:bg-slate-50 text-[#1D1D1F] border border-[#C7DEFF] py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateApply(job)}
                    className="flex-1 bg-[#0066ff] hover:bg-[#0055e6] text-white py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Quick Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* THREE BANNERS (100% RND CADD) */}
      <section className="w-full h-auto bg-[#E5EEFC] px-6 sm:px-12 lg:px-16 py-16 flex flex-col gap-12 max-w-[1400px] mx-auto rounded-[36px] my-10">
        {/* Banner 1: Student Membership */}
        <div className="w-full rounded-[30px] bg-[#A5CAFE]/25 flex flex-col md:flex-row justify-between items-center p-8 sm:p-12 border border-[#A5CAFE]/40 relative overflow-hidden">
          <div className="w-full md:w-3/5 flex flex-col gap-4 z-10">
            <h3 className="text-3xl sm:text-[44px] leading-tight font-medium text-[#1D1D1F]">
              Become an RND CADD Student Member
            </h3>
            <p className="text-sm sm:text-base text-[#1D1D1F] opacity-75 font-normal leading-relaxed max-w-xl">
              Unlock exclusive career benefits—priority internships, job alerts, mentor access, and direct placement drives. Join RND CADD membership and stay ahead in your engineering journey.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="bg-[#0066ff] hover:bg-[#0055e6] cursor-pointer w-fit px-8 text-white py-2.5 rounded-[30px] flex items-center justify-center gap-2 text-sm font-semibold transition shadow-md shadow-blue-500/20"
              >
                <span>⚡ Get Membership</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-sm space-y-3 max-w-xs w-full">
              <div className="text-xs font-bold text-[#0066ff] uppercase tracking-wider">
                Member Privileges
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li className="flex items-center gap-2">✓ Verified Capstone Portfolio</li>
                <li className="flex items-center gap-2">✓ Direct Corporate Shortlisting</li>
                <li className="flex items-center gap-2">✓ Autodesk Certified Credential</li>
                <li className="flex items-center gap-2">✓ Unlimited Placement Drives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Banner 2: Hire Smarter with RND CADD (Dark to Blue Gradient) */}
        <div
          id="employers"
          className="w-full rounded-[30px] bg-gradient-to-b from-[#0055FF] to-[#1D1D1F] flex flex-col md:flex-row justify-between items-center p-8 sm:p-12 text-white relative overflow-hidden"
        >
          <div className="w-full md:w-3/5 flex flex-col gap-4 z-10">
            <h3 className="text-3xl sm:text-[44px] leading-tight font-medium text-white">
              Hire Smarter with RND CADD
            </h3>
            <p className="text-sm sm:text-base text-white opacity-85 font-normal leading-relaxed max-w-xl">
              Access a pool of pre-trained, project-ready candidates. Save time, reduce costs, and find talent that fits. Partner with us today to connect with the engineering workforce of tomorrow.
            </p>
            <div className="pt-2">
              <a
                href="mailto:placements@rndcadd.com?subject=Hire%20Engineers%20from%20RND%20CADD"
                className="bg-[#0066ff] border border-white/40 w-fit px-8 text-white py-2.5 rounded-[30px] flex items-center justify-center gap-2 text-sm font-semibold hover:bg-white hover:text-[#0066ff] transition cursor-pointer shadow-md"
              >
                <span>⚡ Start Hiring</span>
              </a>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-2 max-w-xs w-full">
              <span className="text-2xl">🤝</span>
              <h5 className="text-sm font-bold">Zero Recruitment Fee</h5>
              <p className="text-xs text-white/80">
                Direct interviews with certified candidates ready to deploy on day one.
              </p>
            </div>
          </div>
        </div>

        {/* Banner 3: Looking for more opportunities? */}
        <div className="w-full rounded-[30px] bg-gradient-to-r from-[#DFE8F6] to-[#FFFFFF] flex flex-col md:flex-row justify-between items-center p-8 sm:p-12 border border-[#A0C3F7] relative">
          <div className="w-full md:w-3/5 flex flex-col gap-3">
            <h3 className="text-2xl sm:text-[38px] leading-tight font-medium text-[#1D1D1F]">
              Looking for more such opportunities?
            </h3>
            <p className="text-sm sm:text-base opacity-75 font-normal text-[#1D1D1F]">
              Register now to access 1,000+ verified engineering openings posted across Civil, Mechanical, Electrical &amp; Piping!
            </p>
            <div className="pt-3">
              <Link
                href="/signin?redirect=/jobs"
                className="inline-flex items-center justify-center border border-gray-300 rounded-xl px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition shadow-xs"
              >
                Sign In Now &rarr;
              </Link>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0 text-xs text-slate-500">
            <span>
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#0066ff] underline">
                Terms and Conditions
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* MODAL 1: VIEW JOB DETAILS */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E7F0FF] text-[#0066ff] uppercase tracking-wider">
                  {selectedJobForDetails.discipline}
                </span>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mt-2">
                  {selectedJobForDetails.title}
                </h3>
                <p className="text-sm font-medium text-slate-600 mt-1">
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#E7F0FF]/60 border border-[#C7DEFF] text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Salary</span>
                <span className="font-bold text-[#0066ff] text-sm">{selectedJobForDetails.salary}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Work Mode</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.workMode}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Experience</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.experience}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Vacancies</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.vacancies} Openings</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Job Description &amp; Scope
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {selectedJobForDetails.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Required Software Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedJobForDetails.tools.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg bg-white border border-[#C7DEFF] text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
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
                className="px-6 py-2.5 rounded-full bg-[#0066ff] hover:bg-[#0055e6] text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                ⚡ Apply for this Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE QUICK APPLY MODAL */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0066ff] uppercase tracking-wider">
                  Direct Recruiter Application
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] mt-1">
                  Apply for {selectedJobForApply.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
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
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start space-x-2">
                    <span className="font-bold">Tip:</span>
                    <span>
                      Already have an account?{' '}
                      <Link href="/signin?redirect=/jobs" className="font-semibold underline text-[#0066ff]">
                        Sign In
                      </Link>{' '}
                      to auto-fill your verified portfolio and student credentials.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                      placeholder="e.g. Ram G."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      required
                      placeholder="e.g. student1@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      required
                      placeholder="+91 99080 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={applicantStudentId}
                      onChange={(e) => setApplicantStudentId(e.target.value)}
                      placeholder="STU-001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Portfolio / Drive Project Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://drive.google.com/your-cad-portfolio-or-linkedin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brief Note to Hiring Manager
                  </label>
                  <textarea
                    rows={3}
                    value={applicantCoverNote}
                    onChange={(e) => setApplicantCoverNote(e.target.value)}
                    placeholder="Mention your key CAD tools, hands-on capstone project, and notice period..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
                    className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-[#0066ff] hover:bg-[#0055e6] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
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
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="RND CADD" className="h-7 w-auto object-contain" />
            <span className="font-medium text-slate-600">&bull; Engineering Career &amp; Placements Ecosystem</span>
          </div>
          <div className="text-slate-400">
            Copyright &copy; 2026 RND CADD EduTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
