'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  activeStream: string;
  onSelectStream: (stream: any) => void;
  onOpenEnrollModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeStream,
  onSelectStream,
  onOpenEnrollModal
}) => {
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
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
        setCurrentUser(null);
        window.dispatchEvent(new Event('storage'));
      }
    } catch {
      // ignore
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all">
      {/* Top Technical Notice Bar in Logo Navy */}
      <div className="bg-[#15304C] border-b border-[#0F2038] text-[11px] py-1.5 px-6 flex items-center justify-between text-[#E2E8F0]">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D20A0B] animate-pulse"></span>
          <span className="font-semibold text-[#FFFFFF]">AMEERPET HYDERABAD CAMPUS</span>
          <span className="text-[#64748B]">|</span>
          <span className="text-[#CBD5E1]">AUTODESK &amp; DASSAULT AUTHORIZED TRAINING CENTER</span>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/jobs"
            className="text-emerald-300 font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{isStudent ? '[MY COURSE PLACEMENTS ACTIVE]' : '[PLACEMENTS OPEN]'}</span>
          </Link>
          <span className="text-[#FF4D4F] font-bold px-2 py-0.5 rounded-full bg-[#FF4D4F]/10 border border-[#FF4D4F]/20">[BATCH 2026 OPEN]</span>
          <span>100% PLACEMENT SUPPORT</span>
          <span className="text-[#64748B]">|</span>
          <span className="text-[#FFFFFF] font-semibold">+91 98490 12345</span>
        </div>
      </div>

      {/* Main Entire Navigation Bar with Box Shadow & Border Radius (Image-2) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1536px] mx-auto py-2.5 sm:py-3.5">
        <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#CBD5E1] shadow-[0_16px_40px_-8px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.04)] px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4 xl:gap-8 transition-all">
          {/* Prominent Official RND CADD Logo */}
          <a href="#" className="flex items-center shrink-0 group py-0.5">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-11 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm"
            />
          </a>

          {/* Stream Navigation Switcher - Exact Image 3 Rounded Pills without icons */}
          <nav
            className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-4 space-x-2 xl:space-x-2.5 overflow-x-auto no-scrollbar scrollbar-none py-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {[
              { id: 'all', label: 'All Programs' },
              { id: 'civil', label: 'Civil & BIM' },
              { id: 'mechanical', label: 'Mechanical' },
              { id: 'eee', label: 'Electrical' },
              { id: 'interior', label: 'Interior' },
              { id: 'piping', label: 'Piping' },
              { id: 'ppm', label: 'PPM' },
            ].map((item) => {
              const isSelected = activeStream === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectStream(item.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold tracking-tight transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#EE2C3C] text-white border border-[#EE2C3C] shadow-md shadow-red-500/25 scale-105'
                      : 'bg-white text-slate-800 border border-[#EE2C3C] hover:bg-red-50/50 hover:scale-105 shadow-sm'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
            {isStudent ? (
              <>
                {/* Active Jobs Portal Button (Separate Page: /jobs - Ref: https://jobs.unlox.com/) */}
                <Link
                  href="/jobs"
                  className="relative group inline-flex items-center gap-2 px-4 sm:px-4.5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#EE2C3C] text-[#FFFFFF] border border-slate-700 hover:border-[#EE2C3C] text-xs font-black tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-red-500/25 cursor-pointer active:scale-95"
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
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-bold text-[#15304C] hover:text-[#EE2C3C] border-2 border-[#CBD5E1] hover:border-[#EE2C3C] bg-[#FFFFFF] transition-all shadow-xs hover:shadow"
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
                  className="inline-flex items-center gap-1.5 px-4 sm:px-4.5 py-2.5 rounded-full text-xs font-bold text-[#FFFFFF] bg-[#15304C] hover:bg-[#0F2038] border border-[#15304C] transition-all shadow-sm"
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
                {/* Guest State: Upgraded Modern Sign In & Sign Up buttons */}
                <Link
                  href="/signin"
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-[#15304C] hover:text-[#EE2C3C] bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-[#EE2C3C] transition-all duration-200 shadow-xs hover:shadow flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-extrabold tracking-wider uppercase bg-gradient-to-r from-[#EE2C3C] via-[#E01829] to-[#D20A0B] hover:from-[#D20A0B] hover:to-[#B50809] text-white transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 cursor-pointer border border-red-500/30"
                >
                  <span>SIGN UP</span>
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
