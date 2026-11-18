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
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-45, 45]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-45, 45]);

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
      className="relative w-full bg-white overflow-hidden border-b border-slate-100"
    >
      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 lg:pb-28">
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

          {/* Right Column: ONLY THE TRANSPARENT LOGO with Interactive Mouse Tracking (Up, Down, Left, Right) */}
          <div
            className="lg:col-span-5 flex items-center justify-center relative mt-8 lg:mt-0 py-6 select-none"
            style={{ perspective: 1200 }}
          >
            {/* Interactive Mouse-Tracking Animated Logo: seamlessly merged into hero background */}
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
                className="w-64 sm:w-80 md:w-96 lg:w-[440px] xl:w-[480px] h-auto object-contain transition-transform duration-200 hover:scale-105"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
