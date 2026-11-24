'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeStream?: string;
  onSelectStream?: (stream: any) => void;
  onOpenEnrollModal?: () => void;
}

const NAV_ITEMS = [
  { id: 'all', label: 'All Programs' },
  { id: 'civil', label: 'Civil & BIM' },
  { id: 'mechanical', label: 'Mechanical' },
  { id: 'eee', label: 'Electrical' },
  { id: 'interior', label: 'Interior' },
  { id: 'piping', label: 'Piping' },
  { id: 'ppm', label: 'PPM' },
];

export const Header: React.FC<HeaderProps> = ({
  activeStream = 'all',
  onSelectStream,
  onOpenEnrollModal,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [desktopAuthDropdownOpen, setDesktopAuthDropdownOpen] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const desktopAuthDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUser = () => {
      try {
        if (typeof window !== 'undefined') {
          // Check this window's isolated session first!
          const sessionStored = sessionStorage.getItem('rnd_cadd_user');
          if (sessionStored) {
            setCurrentUser(JSON.parse(sessionStored));
            return;
          }
          const stored = localStorage.getItem('rnd_cadd_user');
          if (stored) {
            setCurrentUser(JSON.parse(stored));
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
    window.addEventListener('focus', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target as Node)) {
        setAuthDropdownOpen(false);
      }
      if (desktopAuthDropdownRef.current && !desktopAuthDropdownRef.current.contains(e.target as Node)) {
        setDesktopAuthDropdownOpen(false);
      }
    };
    if (authDropdownOpen || desktopAuthDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [authDropdownOpen, desktopAuthDropdownOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer and dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setAuthDropdownOpen(false);
        setDesktopAuthDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isStudent = currentUser?.role === 'student';
  const isAdmin = currentUser?.role === 'admin';

  const handleSignOut = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('rnd_cadd_user');
        sessionStorage.removeItem('rnd_cadd_role');
        sessionStorage.removeItem('rnd_cadd_student_session');
        sessionStorage.removeItem('rnd_cadd_admin_session');
        try {
          const local = localStorage.getItem('rnd_cadd_user');
          if (local && JSON.parse(local).email === currentUser?.email) {
            localStorage.removeItem('rnd_cadd_user');
            localStorage.removeItem('rnd_cadd_role');
          }
        } catch {}
        setCurrentUser(null);
        window.location.href = '/signin';
      }
    } catch {
      // ignore
    }
  };

  const handleStreamClick = (streamId: string) => {
    if (onSelectStream) {
      onSelectStream(streamId);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/?stream=${streamId}#revealed-courses`;
    }
    setMobileMenuOpen(false);
  };

  const handleEnrollClick = () => {
    setMobileMenuOpen(false);
    if (onOpenEnrollModal) {
      onOpenEnrollModal();
    } else if (typeof window !== 'undefined') {
      window.location.href = '/#enrollment';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all pointer-events-none">
        {/* Expanded Width & Luxurious Length Container */}
        <div className="w-full px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pt-3 sm:pt-4.5 pointer-events-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.1),0_2px_8px_rgba(15,23,42,0.04)] px-4 sm:px-6 lg:px-8 xl:px-10 py-2 sm:py-2.5 lg:py-2.5 xl:py-3 flex items-center justify-between gap-3 sm:gap-4 xl:gap-8 transition-all min-h-[68px] sm:min-h-[72px] md:min-h-[78px] lg:min-h-[86px] xl:min-h-[94px]"
          >
            {/* Prominent Official RND CADD Logo & Company Identity - Enlarged for Premium Impact */}
            <Link href="/" className="flex items-center shrink-0 group py-1" aria-label="RND CADD Home">
              <img
                src="/logo.png"
                alt="RND CADD Training Institute"
                className="h-12 sm:h-13 md:h-15 lg:h-18 xl:h-20 w-auto object-contain transition-transform duration-200 group-hover:scale-103 drop-shadow-xs"
              />
            </Link>

            {/* Stream Navigation Switcher with Clean White Sliding Pill (Desktop Only) */}
            <nav
              onMouseLeave={() => setHoveredTab(null)}
              className="hidden lg:flex items-center justify-center p-1 bg-slate-100/80 rounded-full relative border border-slate-200/70 shadow-xs"
              aria-label="Desktop Stream Navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isSelected = activeStream === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectStream(item.id)}
                    onMouseEnter={() => setHoveredTab(item.id)}
                    className="relative px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-[13px] font-semibold tracking-normal cursor-pointer select-none whitespace-nowrap focus:outline-none transition-colors"
                  >
                    {/* Framer Motion Active Clean White Sliding Pill */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-slate-200/80"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}

                    {/* Framer Motion Hover Highlight Indicator */}
                    {hoveredTab === item.id && !isSelected && (
                      <motion.div
                        layoutId="hoverNavTab"
                        className="absolute inset-0 rounded-full bg-slate-200/50"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}

                    <span
                      className={`relative z-10 transition-colors duration-200 flex items-center gap-1.5 ${
                        isSelected
                          ? 'text-slate-900 font-bold'
                          : 'text-slate-600 hover:text-slate-900 font-medium'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#EE2C3C]"></span>}
                      <span>{item.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-2 sm:space-x-2.5 shrink-0">
              {isStudent ? (
                <>
                  {/* Active Jobs Portal Button */}
                  <Link
                    href="/jobs"
                    className="relative group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-[#EE2C3C] text-white text-xs font-bold tracking-wide uppercase transition-all duration-200 shadow-xs active:scale-95"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Jobs</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                      LIVE
                    </span>
                  </Link>

                  {/* Logged-in Student Portal Link */}
                  <Link
                    href={currentUser?.email ? `/portal/student?email=${encodeURIComponent(currentUser.email)}` : '/portal/student'}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 hover:text-[#EE2C3C] border border-slate-200 hover:border-[#EE2C3C] bg-white transition-all shadow-2xs hover:shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{currentUser?.name ? currentUser.name.split(' ')[0] : 'STUDENT'} (PORTAL)</span>
                  </Link>

                  {/* Quick Sign Out Button */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    Sign Out
                  </button>
                </>
              ) : isAdmin ? (
                <>
                  <Link
                    href="/portal/admin"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#15304C] hover:bg-[#0F2038] transition-all shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>ADMIN DASHBOARD</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="relative" ref={desktopAuthDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDesktopAuthDropdownOpen(!desktopAuthDropdownOpen)}
                    className="px-4 py-2 rounded-full text-xs xl:text-[13px] font-bold bg-[#15304C] hover:bg-[#0F2038] text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
                    aria-expanded={desktopAuthDropdownOpen}
                  >
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>Sign In / Sign Up</span>
                    <svg className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${desktopAuthDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {desktopAuthDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 overflow-hidden"
                      >
                        <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Portal Access</p>
                        </div>
                        <Link
                          href="/signin"
                          onClick={() => setDesktopAuthDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#EE2C3C] transition-colors">Sign In</p>
                            <p className="text-[10px] text-slate-500 font-medium">Log into existing student account</p>
                          </div>
                        </Link>

                        <Link
                          href="/signup"
                          onClick={() => setDesktopAuthDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50/50 hover:bg-red-50 text-[#EE2C3C] transition-colors group cursor-pointer mt-1 border border-red-100/60"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#EE2C3C] text-white flex items-center justify-center shadow-xs">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.375 12.375 0 014 19.235z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#EE2C3C]">Sign Up</p>
                            <p className="text-[10px] text-slate-600 font-medium">New student registration</p>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Controls (< lg) - Jobs shown ONLY when signed up, otherwise Sign In / Sign Up dropdown */}
            <div className="flex lg:hidden items-center gap-2 sm:gap-2.5 shrink-0">
              {currentUser ? (
                /* Show Jobs button ONLY once student is signed up/signed in */
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-900 hover:bg-[#EE2C3C] text-white text-xs font-black tracking-wide uppercase shadow-sm active:scale-95 transition-all"
                  title="Verified Jobs Portal"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Jobs</span>
                </Link>
              ) : (
                /* In place of Jobs: Sign In / Sign Up Dropdown */
                <div className="relative" ref={authDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#15304C] hover:bg-[#0F2038] text-white text-xs font-bold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer"
                    aria-expanded={authDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Sign In or Sign Up"
                  >
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>Sign In / Up</span>
                    <svg className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${authDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Mobile Dropdown Menu */}
                  <AnimatePresence>
                    {authDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 overflow-hidden"
                      >
                        <div className="px-2.5 py-1.5 border-b border-slate-100 mb-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Account</p>
                        </div>
                        <Link
                          href="/signin"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-[#EE2C3C] transition-colors">Sign In</p>
                            <p className="text-[10px] text-slate-500 font-medium">Existing student login</p>
                          </div>
                        </Link>

                        <Link
                          href="/signup"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-red-50/50 hover:bg-red-50 text-[#EE2C3C] transition-colors group cursor-pointer mt-1 border border-red-100/60"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#EE2C3C] text-white flex items-center justify-center shadow-xs">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.375 12.375 0 014 19.235z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-[#EE2C3C]">Sign Up</p>
                            <p className="text-[10px] text-slate-600 font-medium">Create new account</p>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Hamburger Button - Prominent & Comfortable Touch Target */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors focus:outline-none cursor-pointer border border-slate-200 shadow-2xs active:scale-95"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-[360px] sm:max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto pt-9 xs:pt-11 sm:pt-12 px-5 sm:px-6 pb-6 rounded-l-3xl border-l border-slate-200/80"
            >
              <div>
                {/* Drawer Header with Generous Top Clearance */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/90">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="RND CADD" className="h-10 sm:h-12 w-auto object-contain" />
                    <div>
                      <span className="text-sm font-black text-[#15304C] uppercase tracking-wide block leading-tight">
                        RND CADD
                      </span>
                      <span className="text-[11px] sm:text-xs text-slate-500 font-semibold block leading-tight mt-0.5">
                        Training Institute
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                    aria-label="Close Menu"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Status / Portal Card in Drawer */}
                <div className="my-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                  {currentUser ? (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Signed in as
                        </span>
                        <p className="text-xs font-black text-slate-900 truncate">
                          {currentUser.name || currentUser.email}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#EE2C3C] uppercase inline-block mt-0.5">
                          {currentUser.role || 'Student'}
                        </span>
                      </div>
                      <Link
                        href={isAdmin ? '/portal/admin' : (currentUser?.email ? `/portal/student?email=${encodeURIComponent(currentUser.email)}` : '/portal/student')}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#15304C] text-white text-xs font-bold shrink-0 hover:bg-[#EE2C3C] transition-colors"
                      >
                        Dashboard
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/signin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2.5 text-center rounded-xl bg-white border border-slate-300 text-xs font-bold text-[#15304C] hover:bg-slate-50 shadow-2xs transition-all active:scale-95"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2.5 text-center rounded-xl bg-[#EE2C3C] hover:bg-[#D20A0B] text-white text-xs font-bold shadow-sm shadow-red-500/20 transition-all active:scale-95"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Primary Quick Links */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1 mb-1">
                    Quick Navigation
                  </span>
                  
                  {/* Verified Jobs Portal: ONLY shown once student is signed up/signed in */}
                  {currentUser && (
                    <Link
                      href="/jobs"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/70 text-xs font-bold text-slate-900 transition-colors"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#EE2C3C] animate-pulse"></span>
                        <span>Verified Jobs &amp; Placement Portal</span>
                      </span>
                      <span className="text-[9px] bg-red-100 text-[#EE2C3C] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        LIVE
                      </span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleEnrollClick}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/70 text-xs font-bold text-slate-900 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Reserve Workstation / Demo</span>
                    </span>
                    <span className="text-slate-400 font-bold">&rarr;</span>
                  </button>
                </div>

                {/* Engineering Disciplines Grid Pattern (Clean 2-Column Responsive Chips) */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1 mb-2">
                    Browse Engineering Domains
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {NAV_ITEMS.map((item) => {
                      const isSelected = activeStream === item.id;
                      const isAll = item.id === 'all';
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleStreamClick(item.id)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer active:scale-95 ${
                            isAll ? 'col-span-2' : ''
                          } ${
                            isSelected
                              ? 'bg-[#EE2C3C] text-white shadow-md shadow-red-500/20'
                              : 'bg-slate-50/90 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {isSelected && <span className="text-white text-xs ml-1 shrink-0">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-3.5 border-t border-slate-200/80 mt-4">
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors mb-2 cursor-pointer"
                  >
                    Sign Out
                  </button>
                )}
                <p className="text-[10px] text-slate-400 text-center font-medium">
                  RND CADD Training Institute &bull; Ameerpet, Hyderabad
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};