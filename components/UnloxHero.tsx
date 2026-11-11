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
    const el = document.getElementById('experience-disciplines');
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
      className="relative w-full min-h-screen bg-[#F8FAFC] flex flex-col justify-between pt-36 sm:pt-40 lg:pt-44 pb-12 px-4 sm:px-8 overflow-hidden border-b border-[#CBD5E1]"
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
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto my-auto"
      >
        {/* Top Pill Badge (Exact Unlox Style with Logo Red) */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center space-x-2 border border-[#D20A0B] bg-[#FFFFFF] px-4 py-1.5 rounded-full text-xs font-bold text-[#D20A0B] shadow-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#D20A0B] animate-pulse"></span>
          <span>LEARNING REIMAGINED FOR INDUSTRY 4.0</span>
        </motion.div>

        {/* Letter-By-Letter Split-Text Reveal: ENGINEERING in Logo Navy */}
        <div className="overflow-hidden py-1 flex justify-center text-[#15304C] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none uppercase select-none">
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
          className="overflow-hidden py-1 flex items-center justify-center space-x-3 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase mt-3 select-none"
        >
          <span className="text-[#15304C]">CAD</span>
          <span className="text-[#D20A0B]">REIMAGINED</span>
        </motion.div>

        {/* Clean Subtext with Fade-In */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="mt-6 max-w-2xl text-xs sm:text-sm text-[#475569] leading-relaxed"
        >
          Industrial CAD, CAM, CAE &amp; BIM mastery on high-performance RTX GPU workstations. Certified programs for Civil, Mechanical, and Electrical engineers in Ameerpet, Hyderabad.
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={scrollToExperience}
            className="px-8 py-3.5 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 rounded-xl active:translate-y-0"
          >
            SELECT DISCIPLINE -&gt;
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('enrollment');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#15304C] text-xs font-bold tracking-wider uppercase transition-all shadow-sm hover:shadow rounded-xl"
          >
            RESERVE WORKSTATION
          </button>
        </motion.div>
      </motion.div>

      {/* Unlox Scroll Down Arrow Prompt in Logo Red: VISIBLE ONLY WHEN SCROLLING THE PAGE, OTHERWISE HIDDEN */}
      <div
        onClick={scrollToExperience}
        className={`relative z-10 flex flex-col items-center justify-center text-[11px] text-[#64748B] cursor-pointer animate-bounce pt-6 transition-all duration-300 ${
          isScrolling
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <span className="uppercase tracking-widest font-bold text-[#D20A0B]">SCROLL DOWN</span>
        <span className="text-xl text-[#D20A0B] leading-none mt-1">&#8595;</span>
      </div>
    </div>
  );
};
