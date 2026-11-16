'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all pointer-events-none">
      {/* Expanded Width & Luxurious Length Container */}
      <div className="w-full px-3 sm:px-6 lg:px-8 max-w-[1560px] mx-auto pt-3 sm:pt-4 pointer-events-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_16px_40px_-10px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.03)] px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 flex items-center justify-between gap-3 xl:gap-8 transition-all"
        >
          {/* Prominent Official RND CADD Logo (Increased Size) */}
          <a href="#" className="flex items-center shrink-0 group py-0.5">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-11 sm:h-13 lg:h-15 xl:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs"
            />
          </a>

          {/* Stream Navigation Switcher with Framer Motion Sliding Pill (NO BORDERS) */}
          <nav
            onMouseLeave={() => setHoveredTab(null)}
            className="hidden lg:flex items-center justify-center p-1.5 bg-slate-100/80 rounded-full relative"
          >
            {NAV_ITEMS.map((item) => {
              const isSelected = activeStream === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectStream(item.id)}
                  onMouseEnter={() => setHoveredTab(item.id)}
                  className="relative px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold tracking-tight cursor-pointer select-none whitespace-nowrap focus:outline-none transition-colors"
                >
                  {/* Framer Motion Active Sliding Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#EE2C3C] via-[#E01829] to-[#D20A0B] shadow-md shadow-red-500/30"
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

          {/* CTAs */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
            {isStudent ? (
              <>
                {/* Active Jobs Portal Button */}
                <Link
                  href="/jobs"
                  className="relative group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#EE2C3C] text-[#FFFFFF] border border-slate-700 hover:border-[#EE2C3C] text-xs font-black tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-red-500/25 cursor-pointer active:scale-95"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-[#15304C] hover:text-[#EE2C3C] border border-[#CBD5E1] hover:border-[#EE2C3C] bg-white transition-all shadow-xs hover:shadow"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{currentUser?.name ? currentUser.name.split(' ')[0] : 'STUDENT'} (PORTAL)</span>
                </Link>

                {/* Quick Sign Out Button */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3.5 py-2.5 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </>
            ) : isAdmin ? (
              <>
                <Link
                  href="/portal/admin"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#15304C] hover:bg-[#0F2038] border border-[#15304C] transition-all shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>ADMIN DASHBOARD</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3.5 py-2.5 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Guest State: Modern Borderless Sign In & Glowing Sign Up */}
                <Link
                  href="/signin"
                  className="px-4.5 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-slate-700 hover:text-[#EE2C3C] bg-slate-100/70 hover:bg-slate-200/70 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wider uppercase bg-gradient-to-r from-[#EE2C3C] via-[#E01829] to-[#D20A0B] hover:from-[#D20A0B] hover:to-[#B50809] text-white transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>SIGN UP</span>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
};
