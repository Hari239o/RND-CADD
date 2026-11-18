'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface RndCaddHeroProps {
  onSelectStream: (stream: any) => void;
  onExploreCatalog: () => void;
}

export const RndCaddHero: React.FC<RndCaddHeroProps> = ({
  onSelectStream,
  onExploreCatalog,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse tracking physics for 4-directional movement (up, down, left, right)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, responsive cursor tracking
  const springConfig = { stiffness: 220, damping: 22 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 2D Translation: moves toward the cursor in all 4 directions (up, down, left, right)
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-50, 50]);

  // 3D Perspective Rotation (tilts smoothly toward cursor like Unlox)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [18, -18]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const target = heroRef.current || e.currentTarget;
    const rect = target.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToExperience = () => {
    const el = document.getElementById('upgrad-showcase') || document.getElementById('experience-disciplines');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] lg:min-h-[94vh] bg-white overflow-hidden border-b border-slate-100 flex items-center"
    >
      {/* Soft Curved Intersecting Backdrop Arcs (Exact unlox.com Image 2 & Image 3) */}
      <div className="absolute -top-32 sm:-top-48 right-[-10%] w-[56vw] max-w-[950px] h-[56vw] max-h-[950px] rounded-full bg-[#EDF5FF] -z-10 pointer-events-none" />
      <div className="absolute -bottom-32 sm:-bottom-48 right-[-5%] w-[60vw] max-w-[1000px] h-[60vw] max-h-[1000px] rounded-full bg-[#EBF3FF]/85 -z-10 pointer-events-none" />

      {/* Full-Screen Edge-to-Edge Container: Comfortably utilizes the left side space */}
      <div className="w-full px-6 sm:px-12 md:px-16 lg:px-20 xl:px-28 2xl:px-36 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-20 items-center w-full">
          {/* Left Column: Occupies Left Side Naturally (UNLOX Full Screen Style) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 self-start border border-blue-200/90 bg-blue-50/70 px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-medium text-[#15304C] shadow-2xs mb-5 sm:mb-6"
            >
              <svg className="w-4 h-4 text-[#D20A0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span>Industry 4.0 CAD &amp; BIM Academy</span>
            </motion.div>

            {/* Headline with Decreased, Balanced Font Size */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#15304C] tracking-tight leading-[1.14]"
            >
              Master Industrial CAD. <br />
              <span className="text-[#D20A0B]">Build Your Future.</span>
            </motion.h1>

            {/* Simple Steps Pattern (Replaces Heavy Paragraph Content) */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 bg-slate-50/80 border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-[#15304C] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="text-xs sm:text-[13px] font-bold text-slate-800">Choose Stream</span>
              </div>
              <span className="text-slate-300 font-bold hidden sm:inline">&rarr;</span>
              <div className="flex items-center gap-2 bg-slate-50/80 border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-[#D20A0B] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="text-xs sm:text-[13px] font-bold text-slate-800">1:1 RTX Lab Training</span>
              </div>
              <span className="text-slate-300 font-bold hidden sm:inline">&rarr;</span>
              <div className="flex items-center gap-2 bg-slate-50/80 border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-2xs">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="text-xs sm:text-[13px] font-bold text-slate-800">Certification &amp; Placement</span>
              </div>
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <button
                type="button"
                onClick={scrollToExperience}
                className="px-7 sm:px-8 py-3 sm:py-3.5 bg-[#D20A0B] hover:bg-[#B50809] text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center"
              >
                Explore Programs
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('enrollment');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-[#15304C] text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center"
              >
                Reserve Workstation
              </button>
            </motion.div>
          </div>

          {/* Right Column: LARGE TRANSPARENT LOGO with Interactive 4-Directional Tracking (Exact Unlox Scale) */}
          <div
            className="lg:col-span-5 flex items-center justify-center relative mt-8 lg:mt-0 py-6 select-none"
            style={{ perspective: 1200 }}
          >
            {/* Interactive Mouse-Tracking Animated Logo */}
            <motion.div
              style={{
                x: translateX,
                y: translateY,
                rotateX: rotateX,
                rotateY: rotateY,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                // Gentle idle floating when mouse is not moving
                scale: shouldReduceMotion ? 1 : [1, 1.025, 1],
              }}
              transition={{
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="relative flex items-center justify-center will-change-transform cursor-pointer"
            >
              <img
                src="/logo_mark.png"
                onError={(e: any) => {
                  e.currentTarget.src = '/logo.png';
                }}
                alt="RND CADD Logo"
                className="w-72 sm:w-96 md:w-[460px] lg:w-[540px] xl:w-[620px] 2xl:w-[680px] h-auto object-contain transition-transform duration-200 hover:scale-105"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
