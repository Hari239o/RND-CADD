'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface UnloxHeroProps {
  onSelectStream: (stream: any) => void;
  onExploreCatalog: () => void;
}

export const UnloxHero: React.FC<UnloxHeroProps> = ({
  onSelectStream,
  onExploreCatalog,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 80]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0.3]);

  const [isScrolling, setIsScrolling] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsScrolling(false);
      }, 1200);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToExperience = () => {
    const el = document.getElementById('upgrad-showcase') || document.getElementById('experience-disciplines');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: shouldReduceMotion ? 0 : i * 0.035,
      },
    }),
  };

  const engineeringLetters = ['E', 'N', 'G', 'I', 'N', 'E', 'E', 'R', 'I', 'N', 'G'];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-[95vh] bg-[#F8FAFC] flex flex-col justify-between pt-36 sm:pt-40 lg:pt-44 pb-14 sm:pb-18 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#CBD5E1]"
    >
      {/* Clean CAD Architectural Blueprint Coordinate Grid with Parallax Scrubbing */}
      <motion.div
        style={{ y: gridY }}
        className="absolute inset-0 pointer-events-none opacity-30"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(#CBD5E1 1px, transparent 1px), linear-gradient(90deg, #CBD5E1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </motion.div>

      {/* Hero Core Content Centered */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto my-auto w-full"
      >
        {/* Top Pill Badge (Exact Unlox Style with Logo Red) */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center space-x-2 border border-[#D20A0B] bg-[#FFFFFF] px-4 py-1.5 rounded-full text-xs font-bold text-[#D20A0B] shadow-sm mb-6 sm:mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#D20A0B] animate-pulse"></span>
          <span>LEARNING REIMAGINED FOR INDUSTRY 4.0</span>
        </motion.div>

        {/* Letter-By-Letter Split-Text Reveal: ENGINEERING in Logo Navy */}
        <div className="overflow-hidden py-1 flex justify-center text-[#15304C] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight leading-none uppercase select-none">
          {engineeringLetters.map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Line 2: CAD in Navy, REIMAGINED in Logo Red #D20A0B */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden py-1 flex items-center justify-center space-x-3 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-none uppercase mt-2 sm:mt-3 select-none"
        >
          <span className="text-[#15304C]">CAD</span>
          <span className="text-[#D20A0B]">REIMAGINED</span>
        </motion.div>

        {/* Clean Subtext with Fade-In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="mt-6 sm:mt-7 max-w-2xl sm:max-w-3xl text-xs sm:text-sm md:text-base text-[#475569] leading-relaxed"
        >
          Industrial CAD, CAM, CAE &amp; BIM mastery on high-performance RTX GPU workstations. Certified programs for Civil, Mechanical, and Electrical engineers in Ameerpet, Hyderabad.
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
        >
          <button
            onClick={scrollToExperience}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-md hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-0.5 rounded-xl active:translate-y-0 cursor-pointer"
          >
            SELECT DISCIPLINE -&gt;
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('enrollment');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#15304C] text-xs sm:text-sm font-black tracking-wider uppercase transition-all shadow-sm hover:shadow-md rounded-xl cursor-pointer"
          >
            RESERVE WORKSTATION
          </button>
        </motion.div>

        {/* Downward Institutional Credibility & Metric Pillars (Increases vertical size downward) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
          className="mt-12 sm:mt-16 lg:mt-20 w-full max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 text-left">
            <div className="bg-white/90 backdrop-blur-xs border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#15304C] tracking-tight">15,000+</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Engineers Certified</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#D20A0B] tracking-tight">100%</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Placement Assistance</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-xl sm:text-2xl font-black text-[#15304C] tracking-tight">ISO 9001:2015</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Accredited Quality</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xs border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="text-2xl sm:text-3xl font-black text-[#15304C] tracking-tight">1:1 RTX Lab</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Dedicated GPU Workstation</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Downward Scroll Indicator to Domain Programs */}
      <div
        onClick={scrollToExperience}
        className="relative z-10 flex flex-col items-center justify-center text-xs text-slate-500 hover:text-[#D20A0B] cursor-pointer pt-8 sm:pt-12 transition-all duration-300 group"
      >
        <span className="uppercase tracking-[0.25em] text-[11px] font-black text-slate-400 group-hover:text-[#D20A0B] transition-colors">
          EXPLORE ENGINEERING DOMAINS
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="mt-2 w-8 h-8 rounded-full border border-slate-300 group-hover:border-[#D20A0B] flex items-center justify-center text-slate-400 group-hover:text-[#D20A0B] transition-colors bg-white shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
