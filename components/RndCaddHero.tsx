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
    <section className="relative w-full min-h-[82vh] sm:min-h-[88vh] lg:min-h-[92vh] bg-[#F8FAFC] flex flex-col justify-between pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      {/* Hero Core Content Centered */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto my-auto w-full">
        {/* Top Eyebrow Badge - Pure Typography, No Icons, No Gradients */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-flex items-center border border-slate-200 bg-white px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider text-slate-700 shadow-xs mb-6 sm:mb-8"
        >
          <span>GLOBAL BENCHMARK FOR INDUSTRIAL CAD &amp; SIMULATION</span>
        </motion.div>

        {/* Headline: Clean, Authoritative MNC Typography */}
        <motion.h1
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center font-black tracking-tight leading-[0.95] select-none max-w-full"
        >
          <span className="text-[#0F172A] text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase">
            ENGINEERING
          </span>
          <span className="text-[#1D4ED8] text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase mt-2 sm:mt-3">
            CAD &amp; SIMULATION
          </span>
        </motion.h1>

        {/* Executive Subtext */}
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: 'easeOut' }}
          className="mt-6 sm:mt-8 max-w-2xl sm:max-w-3xl text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal px-2"
        >
          Empowering engineers with industry-standard CAD, CAM, CAE, and BIM capabilities. Master precision modeling, finite element analysis, and digital manufacturing on enterprise-grade computing infrastructure.
        </motion.p>

        {/* Action CTAs: Solid Executive Colors, No Icons, No Gradients */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22, ease: 'easeOut' }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0"
        >
          <button
            onClick={scrollToExperience}
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-150 shadow-sm hover:shadow-md rounded-xl cursor-pointer text-center"
          >
            EXPLORE DISCIPLINES
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('enrollment');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-[#0F172A] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-150 shadow-xs hover:shadow-sm rounded-xl cursor-pointer text-center"
          >
            RESERVE WORKSTATION
          </button>
        </motion.div>
      </div>

      {/* Clean Minimalist Scroll Prompt: Pure Typography, Zero Icons */}
      <div
        onClick={scrollToExperience}
        className="relative z-10 flex flex-col items-center justify-center cursor-pointer pt-6 sm:pt-8 transition-colors duration-150 group"
      >
        <span className="uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-slate-800 transition-colors text-center">
          EXPLORE ENGINEERING DISCIPLINES
        </span>
        <span className="mt-2 h-0.5 w-8 bg-slate-300 group-hover:w-12 group-hover:bg-slate-700 transition-all duration-200" />
      </div>
    </section>
  );
};
