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
          <a
            href="#jobs-portal"
            className="text-emerald-300 font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>{isStudent ? '[MY COURSE PLACEMENTS ACTIVE]' : '[PLACEMENTS OPEN]'}</span>
          </a>
          <span className="text-[#FF4D4F] font-bold px-2 py-0.5 rounded-full bg-[#FF4D4F]/10 border border-[#FF4D4F]/20">[BATCH 2026 OPEN]</span>
          <span>100% PLACEMENT SUPPORT</span>
          <span className="text-[#64748B]">|</span>
          <span className="text-[#FFFFFF] font-semibold">+91 98490 12345</span>
        </div>
      </div>

      {/* Main Entire Navigation Bar with Box Shadow & Border Radius (Image-2) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto py-2 sm:py-2.5">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#CBD5E1] shadow-[0_12px_35px_-5px_rgba(15,23,42,0.15),0_4px_16px_rgba(15,23,42,0.06)] px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-4 xl:gap-6 transition-all">
          {/* Prominent Official RND CADD Logo */}
          <a href="#" className="flex items-center shrink-0 group py-0.5">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm"
            />
          </a>

          {/* Stream Navigation Switcher - Exact Image 3 Rounded Pills without icons */}
          <nav
            className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-4 space-x-1.5 xl:space-x-2 overflow-x-auto no-scrollbar scrollbar-none py-2"
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#EE2C3C] text-white border border-[#EE2C3C] shadow-md shadow-red-500/25 scale-105 font-bold'
                      : 'bg-white text-slate-800 border border-[#EE2C3C] hover:bg-red-50/50 hover:scale-105 shadow-sm'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {isStudent ? (
              <>
                {/* Jobs Portal Button (Ref: https://jobs.unlox.com/) */}
                <a
                  href="#jobs-portal"
                  className="relative group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#EE2C3C] text-[#FFFFFF] border border-slate-700 hover:border-[#EE2C3C] text-xs font-black tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-red-500/25 cursor-pointer active:scale-95"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EE2C3C] group-hover:bg-white"></span>
                  </span>
                  <span>EXPLORE JOBS</span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-red-500/20 group-hover:bg-white/20 text-red-300 group-hover:text-white border border-red-500/30">
                    LIVE
                  </span>
                </a>

                {/* Logged-in Student Portal Link */}
                <Link
                  href="/portal/student"
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-[#15304C] hover:text-[#D20A0B] border border-[#CBD5E1] hover:border-[#D20A0B] bg-[#FFFFFF] transition-all shadow-sm hover:shadow"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{currentUser?.name ? currentUser.name.split(' ')[0] : 'STUDENT'} (PORTAL)</span>
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link
                  href="/portal/admin"
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-[#FFFFFF] bg-[#15304C] hover:bg-[#0F2038] border border-[#15304C] transition-all shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>ADMIN DASHBOARD</span>
                </Link>
              </>
            ) : (
              <Link
                href="/signin"
                className="inline-block px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-[#15304C] hover:text-[#D20A0B] border border-[#CBD5E1] hover:border-[#D20A0B] bg-[#FFFFFF] transition-all shadow-sm hover:shadow"
              >
                PORTAL SIGN IN
              </Link>
            )}

            <button
              onClick={onOpenEnrollModal}
              className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] border border-[#D20A0B] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              ENROLL NOW -&gt;
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
