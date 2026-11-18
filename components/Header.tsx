'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  activeStream: string;
  onSelectStream: (stream: any) => void;
  onOpenEnrollModal: () => void;
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
  activeStream,
  onSelectStream,
  onOpenEnrollModal,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      try {
        if (typeof window !== 'undefined') {
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

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
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
        localStorage.removeItem('rnd_cadd_user');
        localStorage.removeItem('rnd_cadd_role');
        localStorage.removeItem('rnd_cadd_enrolled_courses');
        localStorage.removeItem('rnd_cadd_enrolled_course');
        setCurrentUser(null);
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/signin';
      }
    } catch {
      // ignore
    }
  };

  const handleStreamClick = (streamId: string) => {
    onSelectStream(streamId);
    setMobileMenuOpen(false);
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
            className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_20px_45px_-12px_rgba(15,23,42,0.15),0_6px_20px_rgba(15,23,42,0.04)] px-4 sm:px-7 lg:px-9 xl:px-11 py-3.5 sm:py-4.5 lg:py-5 flex items-center justify-between gap-3 sm:gap-4 xl:gap-8 transition-all min-h-[72px] sm:min-h-[82px] lg:min-h-[92px]"
          >
            {/* Prominent Official RND CADD Logo */}
            <Link href="/" className="flex items-center shrink-0 group py-0.5" aria-label="RND CADD Home">
              <img
                src="/logo.png"
                alt="RND CADD"
                className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-[72px] 2xl:h-[76px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs"
              />
            </Link>

            {/* Stream Navigation Switcher with Framer Motion Sliding Pill (Desktop Only) */}
            <nav
              onMouseLeave={() => setHoveredTab(null)}
              className="hidden lg:flex items-center justify-center p-1.5 xl:p-2 bg-slate-100/90 rounded-full relative"
              aria-label="Desktop Stream Navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isSelected = activeStream === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectStream(item.id)}
                    onMouseEnter={() => setHoveredTab(item.id)}
                    className="relative px-3.5 xl:px-4.5 py-2.5 rounded-full text-xs sm:text-[13px] xl:text-[14px] font-bold tracking-tight cursor-pointer select-none whitespace-nowrap focus:outline-none transition-colors"
                  >
                    {/* Framer Motion Active Sliding Indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute inset-0 rounded-full bg-[#0F172A] shadow-sm"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}

                    {/* Framer Motion Hover Highlight Indicator */}
                    {hoveredTab === item.id && !isSelected && (
                      <motion.div
                        layoutId="hoverNavTab"
                        className="absolute inset-0 rounded-full bg-slate-200/70"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}

                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        isSelected
                          ? 'text-white'
                          : 'text-slate-700 hover:text-slate-950'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
              {isStudent ? (
                <>
                  {/* Active Jobs Portal Button */}
                  <Link
                    href="/jobs"
                    className="relative group inline-flex items-center gap-2 px-4.5 sm:px-5.5 py-2.5 sm:py-3 rounded-full bg-[#0F172A] hover:bg-[#EE2C3C] text-[#FFFFFF] border border-slate-700 hover:border-[#EE2C3C] text-xs font-black tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-red-500/25 cursor-pointer active:scale-95"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EE2C3C] group-hover:bg-white"></span>
                    </span>
                    <span>EXPLORE JOBS</span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-red-500/20 group-hover:bg-white/20 text-red-300 group-hover:text-white border border-red-500/30">
                      LIVE
                    </span>
                  </Link>

                  {/* Logged-in Student Portal Link */}
                  <Link
                    href="/portal/student"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 sm:py-3 rounded-full text-xs sm:text-[13px] font-bold text-[#15304C] hover:text-[#EE2C3C] border border-[#CBD5E1] hover:border-[#EE2C3C] bg-white transition-all shadow-xs hover:shadow"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{currentUser?.name ? currentUser.name.split(' ')[0] : 'STUDENT'} (PORTAL)</span>
                  </Link>

                  {/* Quick Sign Out Button */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-[13px] font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    Sign Out
                  </button>
                </>
              ) : isAdmin ? (
                <>
                  <Link
                    href="/portal/admin"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-[13px] font-bold text-white bg-[#15304C] hover:bg-[#0F2038] border border-[#15304C] transition-all shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>ADMIN DASHBOARD</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-4 py-2.5 sm:py-3 rounded-full text-xs sm:text-[13px] font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="px-5 sm:px-5.5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-slate-700 hover:text-[#EE2C3C] bg-slate-100/70 hover:bg-slate-200/70 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5.5 sm:px-6.5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#0F172A] hover:bg-[#1E293B] text-white transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </div>

            {/* Mobile / Tablet Controls (< lg) */}
            <div className="flex lg:hidden items-center gap-2.5 shrink-0">
              {/* Quick Jobs Badge Link on Mobile */}
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900 text-white text-xs font-bold tracking-tight uppercase shadow-xs active:scale-95"
                title="Jobs Portal"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                <span>Jobs</span>
              </Link>

              {/* Hamburger Button (44px touch target) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors focus:outline-none cursor-pointer border border-slate-200"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
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
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto safe-pt safe-pb p-5 sm:p-6"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <img src="/logo.png" alt="RND CADD" className="h-9 w-auto object-contain" />
                    <div>
                      <span className="text-xs font-black text-[#15304C] uppercase tracking-wide block">
                        RND CADD
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        Training Institute
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close Menu"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Status / Portal Card in Drawer */}
                <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  {currentUser ? (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Signed in as
                        </span>
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {currentUser.name || currentUser.email}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#EE2C3C] uppercase inline-block mt-0.5">
                          {currentUser.role || 'Student'}
                        </span>
                      </div>
                      <Link
                        href={isAdmin ? '/portal/admin' : '/portal/student'}
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
                        className="flex-1 py-2 text-center rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 shadow-2xs"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2 text-center rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Primary Quick Links */}
                <div className="space-y-1 mb-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-1">
                    Quick Navigation
                  </span>
                  <Link
                    href="/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#EE2C3C]"></span>
                      <span>Verified Jobs &amp; Placement Portal</span>
                    </span>
                    <span className="text-[10px] bg-red-50 text-[#EE2C3C] border border-red-200 px-2 py-0.5 rounded-full font-bold">
                      LIVE
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenEnrollModal();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 text-xs font-bold text-slate-900 transition-colors text-left"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Reserve Workstation / Demo</span>
                    </span>
                    <span className="text-slate-400">&rarr;</span>
                  </button>
                </div>

                {/* Engineering Disciplines Switcher */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-2">
                    Browse Engineering Domains
                  </span>
                  <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const isSelected = activeStream === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleStreamClick(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                            isSelected
                              ? 'bg-[#EE2C3C] text-white shadow-sm'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{item.label}</span>
                          {isSelected && <span>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-slate-200 mt-6">
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
                <p className="text-[10px] text-slate-400 text-center">
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