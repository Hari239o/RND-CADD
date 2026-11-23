'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import type { HeroSectionContent } from '@/lib/site-content';

interface RndCaddHeroProps {
  onSelectStream: (stream: any) => void;
  onExploreCatalog: () => void;
  content?: HeroSectionContent;
}

export const RndCaddHero: React.FC<RndCaddHeroProps> = ({
  onSelectStream,
  onExploreCatalog,
  content,
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

  if (content?.hidden) return null;

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-0 lg:min-h-[90vh] bg-white overflow-hidden border-b border-slate-100 flex items-center"
    >
      {/* Background Circles - Centered on Mobile, Offset on Desktop */}
      <div className="absolute w-[90vw] h-[90vw] sm:w-[85vw] sm:h-[85vw] max-w-[1100px] max-h-[1100px] -top-[40%] sm:-top-[60%] lg:-top-[68%] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[40%] flex items-center justify-center pointer-events-none select-none z-0">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0)_35%,_rgba(145,194,255,0.38)_100%)]" />
      </div>

      <div className="absolute w-[90vw] h-[90vw] sm:w-[85vw] sm:h-[85vw] max-w-[1100px] max-h-[1100px] top-[40%] sm:top-[42%] lg:top-[38%] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[40%] flex items-center justify-center pointer-events-none select-none z-0">
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0)_35%,_rgba(145,194,255,0.38)_100%)]" />
      </div>

      {/* Seamless Vertical Gradient Overlay to blend top and bottom with page background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,1)_0%,transparent_30%,transparent_70%,rgba(255,255,255,1)_100%)] pointer-events-none z-0" />

      {/* Full-Screen Edge-to-Edge Container: Generous Top Clearance Below Floating Navbar */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 2xl:px-36 pt-32 xs:pt-36 sm:pt-40 lg:pt-44 xl:pt-48 pb-6 sm:pb-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-14 xl:gap-20 items-center w-full">
          {/* Main Column: Centered on Mobile, Natural Left on Desktop */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="inline-flex items-center gap-1.5 sm:gap-2 self-center lg:self-start border border-blue-200/90 bg-blue-50/70 px-3.5 sm:px-4 py-1.5 sm:py-1.5 rounded-full text-[11px] sm:text-[13px] font-medium text-[#15304C] shadow-2xs mb-3.5 sm:mb-6"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D20A0B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              <span className="truncate">{content?.badge || 'Industry 4.0 CAD & BIM Academy'}</span>
            </motion.div>

            {/* Headline with Balanced Responsive Typography */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#15304C] tracking-tight leading-[1.2] text-center lg:text-left mb-4 sm:mb-6"
            >
              {content?.title || 'Master Industrial CAD.'} <br />
              <span className="text-[#D20A0B]">{content?.highlight || 'Build Your Future.'}</span>
            </motion.h1>

            {/* Action CTAs - Responsive Balanced Buttons on Mobile & Desktop */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto lg:mx-0 mb-4 sm:mb-0"
            >
              <button
                type="button"
                onClick={() => {
                  const link = content?.primaryCtaLink || '#revealed-courses';
                  if (link.startsWith('#')) {
                    const el = document.getElementById(link.slice(1));
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else scrollToExperience();
                  } else {
                    window.location.href = link;
                  }
                }}
                className="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3.5 bg-[#D20A0B] hover:bg-[#B50809] text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center whitespace-nowrap"
              >
                {content?.primaryCtaText || 'Explore Programs'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const link = content?.secondaryCtaLink || '#enrollment';
                  if (link.startsWith('#')) {
                    const el = document.getElementById(link.slice(1));
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = link;
                  }
                }}
                className="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-[#15304C] text-xs sm:text-sm font-bold rounded-xl transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center whitespace-nowrap"
              >
                {content?.secondaryCtaText || 'Reserve Workstation'}
              </button>
            </motion.div>

            {/* Mobile Visual Pattern: Interactive 3D Animated Logo centered below Action CTAs */}
            <div
              className="flex lg:hidden items-center justify-center relative mt-3 mb-1 py-1 select-none z-10 w-full"
              style={{ perspective: 1200 }}
            >
              <motion.div
                style={{
                  x: translateX,
                  y: translateY,
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
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
                  src={content?.heroImage || '/logo_mark.png'}
                  onError={(e: any) => {
                    e.currentTarget.src = '/logo.png';
                  }}
                  alt="RND CADD Logo"
                  className="w-32 xs:w-40 sm:w-48 h-auto object-contain transition-transform duration-200 hover:scale-105 drop-shadow-md"
                  draggable={false}
                />
              </motion.div>
            </div>
          </div>

          {/* Desktop Right Column: Sleek Proportional Animated Logo (Hidden on Mobile, Visible on Desktop lg:) */}
          <div
            className="hidden lg:flex lg:col-span-5 items-center justify-center relative mt-3 sm:mt-6 lg:mt-0 py-2 sm:py-8 select-none z-10"
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
              className="relative flex items-center justify-center will-change-transform cursor-pointer max-w-full"
            >
              <img
                src={content?.heroImage || '/logo_mark.png'}
                onError={(e: any) => {
                  e.currentTarget.src = '/logo.png';
                }}
                alt="RND CADD Logo"
                className="w-36 xs:w-44 sm:w-64 md:w-80 lg:w-[540px] xl:w-[620px] 2xl:w-[680px] max-w-full h-auto object-contain transition-transform duration-200 hover:scale-105"
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
