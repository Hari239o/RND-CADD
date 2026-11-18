'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RndCaddHeroProps {
  onSelectStream: (stream: any) => void;
  onExploreCatalog: () => void;
}

export const RndCaddHero: React.FC<RndCaddHeroProps> = ({
  onSelectStream,
  onExploreCatalog,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToExperience = () => {
    const el = document.getElementById('upgrad-showcase') || document.getElementById('experience-disciplines');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-white overflow-hidden border-b border-slate-100">
      {/* Top Announcement Ticker Bar (Exact UNLOX style) */}
      <div className="w-full bg-[#15304C] text-white py-2 px-4 overflow-hidden select-none">
        <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap text-xs sm:text-[13px] font-semibold tracking-wide">
          <span>RND CADD is now ISO 9001:2015 certified!</span>
          <span className="text-red-400">•</span>
          <span>Industry 4.0 CAD, CAM, CAE &amp; BIM Center</span>
          <span className="text-red-400">•</span>
          <span>1:1 Dedicated RTX Workstation Labs</span>
          <span className="text-red-400">•</span>
          <span>Admissions Open for 2026 Batch</span>
          <span className="text-red-400">•</span>
          <span>Over 25,000+ Engineers Trained</span>
          <span className="text-red-400">•</span>
          <span>RND CADD is now ISO 9001:2015 certified!</span>
          <span className="text-red-400">•</span>
          <span>Industry 4.0 CAD, CAM, CAE &amp; BIM Center</span>
          <span className="text-red-400">•</span>
          <span>1:1 Dedicated RTX Workstation Labs</span>
          <span className="text-red-400">•</span>
          <span>Admissions Open for 2026 Batch</span>
          <span className="text-red-400">•</span>
          <span>Over 25,000+ Engineers Trained</span>
        </div>
      </div>

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Simple, Inspirational Student-Friendly Messaging (UNLOX Style) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 self-start border border-blue-200 bg-blue-50/70 px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-medium text-[#15304C] shadow-2xs mb-5 sm:mb-6"
            >
              <svg className="w-4 h-4 text-[#D20A0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span>Learning Reimagined For The Future</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#15304C] tracking-tight leading-[1.08]"
            >
              Engineering <br />
              Made <span className="text-[#D20A0B]">Simple</span>
            </motion.h1>

            {/* Inspirational Subtext */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal max-w-xl"
            >
              RND CADD was created with one simple yet powerful core belief: &ldquo;Engineering Made Simple&rdquo;. Dive into our dynamic programs, master real-world CAD on high-performance RTX workstations, connect with awesome mentors, and experience education like never before.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                onClick={scrollToExperience}
                className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#D20A0B] hover:bg-[#B50809] text-white text-sm sm:text-base font-bold rounded-xl transition-all duration-150 shadow-md hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
              >
                Explore Programs
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('enrollment');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 sm:px-10 py-3.5 sm:py-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-[#15304C] text-sm sm:text-base font-bold rounded-xl transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center"
              >
                Reserve Workstation
              </button>
            </motion.div>
          </div>

          {/* Right Column: Animated Company Logo with Soft Ambient Circles (Exact UNLOX Visual) */}
          <div className="lg:col-span-5 flex items-center justify-center relative mt-8 lg:mt-0">
            {/* Ambient Circular Layers */}
            <div className="absolute w-[320px] sm:w-[420px] lg:w-[480px] h-[320px] sm:h-[420px] lg:h-[480px] rounded-full bg-slate-50/90 border border-slate-100 -z-10" />
            <div className="absolute w-[240px] sm:w-[320px] lg:w-[360px] h-[240px] sm:h-[320px] lg:h-[360px] rounded-full bg-blue-50/40 -z-10" />

            {/* Smooth Floating Logo Container */}
            <motion.div
              animate={{
                y: shouldReduceMotion ? 0 : [0, -14, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative p-6 sm:p-10 bg-white rounded-3xl shadow-2xl border border-slate-100/90 flex items-center justify-center group"
            >
              <img
                src="/logo_mark.png"
                onError={(e: any) => {
                  e.currentTarget.src = '/logo.png';
                }}
                alt="RND CADD Logo"
                className="w-56 sm:w-72 md:w-80 lg:w-[360px] h-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {/* Floating Live Badge 1 */}
              <motion.div
                animate={{
                  y: shouldReduceMotion ? 0 : [0, 8, 0],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4,
                }}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white border border-slate-200/80 shadow-lg px-3.5 py-1.5 rounded-full text-xs font-bold text-[#15304C] flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>1:1 RTX GPU Labs</span>
              </motion.div>

              {/* Floating Live Badge 2 */}
              <motion.div
                animate={{
                  y: shouldReduceMotion ? 0 : [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.8,
                }}
                className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white border border-slate-200/80 shadow-lg px-3.5 py-1.5 rounded-full text-xs font-bold text-[#D20A0B] flex items-center gap-1.5"
              >
                <span>★ ISO 9001:2015</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
