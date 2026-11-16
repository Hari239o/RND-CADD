'use client';

import React, { useState, useEffect } from 'react';

interface ScrollToTopProgressProps {
  targetRef?: React.RefObject<HTMLElement | null>;
  threshold?: number;
}

export const ScrollToTopProgress: React.FC<ScrollToTopProgressProps> = ({
  targetRef,
  threshold = 150,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let currentScroll = 0;
      let totalScroll = 1;

      if (targetRef && targetRef.current) {
        currentScroll = targetRef.current.scrollTop;
        totalScroll = targetRef.current.scrollHeight - targetRef.current.clientHeight;
      } else {
        currentScroll = window.scrollY || document.documentElement.scrollTop;
        totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      }

      const progress = totalScroll > 0 ? Math.min(Math.max(currentScroll / totalScroll, 0), 1) : 0;
      setScrollProgress(progress);
      setIsVisible(currentScroll > threshold);
    };

    const target = targetRef && targetRef.current ? targetRef.current : window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [targetRef, threshold]);

  const scrollToTop = () => {
    if (targetRef && targetRef.current) {
      targetRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // SVG circular geometry
  const size = 50;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all duration-300 animate-in fade-in zoom-in-90"
      style={{ pointerEvents: 'auto' }}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className="relative group w-12 h-12 sm:w-[50px] sm:h-[50px] bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer border border-slate-100"
        title="Scroll to Top"
        aria-label="Scroll to top of page"
      >
        {/* Dynamic Circular Progress Indicator matching exact user Image 2 */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Subtle background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#DBEAFE"
            strokeWidth={strokeWidth}
          />
          {/* Active Yellow/Amber progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EAB308"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 80ms ease-out',
            }}
          />
        </svg>

        {/* Upward Gold/Amber Arrow matching exact user Image 2 */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-[#EAB308] group-hover:text-[#CA8A04] transition-transform duration-200 group-hover:-translate-y-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};
