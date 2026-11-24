'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { JobPost } from '@/lib/jobs-data';
import { INITIAL_JOBS } from '@/lib/jobs-data';
import { Header } from '@/components/Header';

// ============================================================
// ANIMATION GRAPHIC 1: Diverse Student Community (Orbital Rings)
// ============================================================
const ORBIT_INNER = [
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', deg: 0 },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', deg: 120 },
  { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', deg: 240 },
];

const ORBIT_OUTER = [
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', deg: 0 },
  { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', deg: 72 },
  { src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', deg: 144 },
  { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', deg: 216 },
  { src: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80', deg: 288 },
];

function OrbitalCommunityGraphic() {
  return (
    <div className="w-full flex items-center justify-center py-6 sm:py-8">
      <div className="relative w-[280px] h-[280px] max-sm:w-[200px] max-sm:h-[200px] flex items-center justify-center">
        {/* Inner Orbit (Clockwise rotation) */}
        <div className="absolute top-1/2 left-1/2 w-[120px] h-[120px] max-sm:w-[90px] max-sm:h-[90px] border border-dotted border-gray-300 rounded-full animate-rotate-cw pointer-events-none">
          {ORBIT_INNER.map((node, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38px] h-[38px] max-sm:w-[28px] max-sm:h-[28px] rounded-full overflow-hidden shadow-md border-2 border-white"
              style={{
                transform: `rotate(${node.deg}deg) translateY(-150%) rotate(-${node.deg}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={node.src}
                alt="Student"
                className="w-full h-full object-cover rounded-full animate-counter-cw"
              />
            </div>
          ))}
        </div>

        {/* Outer Orbit (Counter-Clockwise rotation) */}
        <div className="absolute top-1/2 left-1/2 w-[280px] h-[280px] max-sm:w-[200px] max-sm:h-[200px] border border-dotted border-gray-300 rounded-full animate-rotate-ccw pointer-events-none">
          {ORBIT_OUTER.map((node, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38px] h-[38px] max-sm:w-[28px] max-sm:h-[28px] rounded-full overflow-hidden shadow-md border-2 border-white"
              style={{
                transform: `rotate(${node.deg}deg) translateY(-350%) rotate(-${node.deg}deg)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={node.src}
                alt="Student"
                className="w-full h-full object-cover rounded-full animate-counter-ccw"
              />
            </div>
          ))}
        </div>

        {/* Center Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] max-sm:w-[32px] max-sm:h-[32px] rounded-full overflow-hidden border-2 border-[#0066ff] shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80"
            alt="Lead Candidate"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ANIMATION GRAPHIC 2: Well-Trained Pool of Candidates (Auto-Cycling Stack)
// ============================================================
interface CandidateItem {
  id: number;
  name: string;
  desc: string;
  img: string;
}

const INITIAL_CANDIDATES: CandidateItem[] = [
  {
    id: 1,
    name: 'Shreya Moitra',
    desc: 'UX Designer - 2+ Years of Experience',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Surya K',
    desc: 'UX Designer - 5+ Years of Experience',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Simran M',
    desc: 'UX Designer - 5+ Years of Experience',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Rahul V',
    desc: 'BIM Modeler - 3+ Years of Experience',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  },
];

function CyclingCandidatesGraphic() {
  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);

  useEffect(() => {
    const timer = setInterval(() => {
      setCandidates((prev) => {
        const copy = [...prev];
        const last = copy.pop();
        if (last) copy.unshift(last);
        return copy;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[280px] max-sm:h-auto my-6 max-sm:my-4 px-2 sm:px-4 flex flex-col gap-3 justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        {candidates.slice(0, 3).map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -35 }}
            transition={{ duration: 0.55 }}
            className="w-full flex py-2.5 px-5 max-sm:px-3 justify-between items-center shadow-md hover:shadow-lg rounded-[18px] bg-white border border-slate-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.img}
                alt={item.name}
                className="h-[48px] w-[48px] max-sm:h-9 max-sm:w-9 rounded-full object-cover border border-slate-200"
              />
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-[#1D1D1F] max-sm:text-xs">
                  {item.name}
                </h4>
                <p className="text-[#333435]/60 text-[11px] max-sm:text-[9px] font-medium line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </div>

            <div className="bg-[#0066ff] hover:bg-[#0055e6] px-6 py-1.5 rounded-md max-sm:px-3 max-sm:py-1 cursor-pointer transition shadow-xs flex-shrink-0">
              <span className="text-xs font-semibold text-white">Connect</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// ANIMATION GRAPHIC 3: Candidate Profile Window with Animated Tracks
// ============================================================
function CandidateProfileTracksGraphic() {
  return (
    <div className="w-full py-4 px-2 sm:px-6">
      <div className="w-full rounded-[14px] overflow-hidden relative shadow-xl h-[280px] bg-white border border-slate-100">
        {/* Header Bar */}
        <div className="w-full bg-[#54AFF0] py-2 px-4 shadow-xs">
          <h4 className="text-sm text-center font-semibold text-white tracking-wide">
            Candidate Profile
          </h4>
        </div>

        {/* Dynamic Tracks Area */}
        <div className="w-full h-[calc(100%-36px)] relative overflow-hidden bg-slate-50/40">
          {/* Track 1: Blue - Left to Right */}
          <div className="flex items-center absolute top-7 left-0">
            <motion.div
              className="h-[14px] rounded-r-none"
              style={{ backgroundColor: '#3AC6F2' }}
              animate={{ width: ['60px', '140px', '60px'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative -ml-2.5 flex items-center gap-1.5 bg-white py-0.5 px-2 rounded-full border border-sky-300 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                alt="Robert"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-[11px] font-bold text-slate-700">Robert</span>
            </div>
          </div>

          {/* Track 2: Green - Left to Right */}
          <div className="flex items-center absolute top-36 left-0">
            <motion.div
              className="h-[14px] rounded-r-none"
              style={{ backgroundColor: '#68F146' }}
              animate={{ width: ['140px', '70px', '140px'] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative -ml-2.5 flex items-center gap-1.5 bg-white py-0.5 px-2 rounded-full border border-emerald-300 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="Sara Doe"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-[11px] font-bold text-slate-700">Sara Doe</span>
            </div>
          </div>

          {/* Track 3: Red - Right to Left */}
          <div className="flex items-center absolute top-32 right-0 flex-row-reverse">
            <motion.div
              className="h-[14px] rounded-l-none"
              style={{ backgroundColor: '#F13C3C' }}
              animate={{ width: ['60px', '125px', '60px'] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative -mr-2.5 flex items-center gap-1.5 bg-white py-0.5 px-2 rounded-full border border-rose-300 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                alt="Nagma Khan"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-[11px] font-bold text-slate-700">Nagma Khan</span>
            </div>
          </div>

          {/* Track 4: Deep Blue - Right to Left */}
          <div className="flex items-center absolute top-7 right-0 flex-row-reverse">
            <motion.div
              className="h-[14px] rounded-l-none"
              style={{ backgroundColor: '#3189EF' }}
              animate={{ width: ['180px', '95px', '180px'] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative -mr-2.5 flex items-center gap-1.5 bg-white py-0.5 px-2 rounded-full border border-blue-300 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                alt="Will Smith"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-[11px] font-bold text-slate-700">Will Smith</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ANIMATION GRAPHIC 4: Free of Cost Hiring Review Window
// ============================================================
const REVIEW_CANDIDATES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
];

function FreeOfCostHiringGraphic() {
  const [photos, setPhotos] = useState<string[]>(REVIEW_CANDIDATES);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotos((prev) => {
        const copy = [...prev];
        const first = copy.shift();
        if (first) copy.push(first);
        return copy;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full my-6 px-2 sm:px-6 h-[260px] flex items-center justify-center">
      <div className="w-full max-w-[420px] bg-[#F4F4F4] rounded-[12px] h-[100%] relative border border-slate-200 shadow-xl overflow-hidden">
        {/* macOS Style Window Dots */}
        <div className="w-full flex items-center justify-start gap-1.5 px-3 py-2 bg-[#EAEAEA] border-b border-slate-200">
          <div className="w-2.5 h-2.5 rounded-full bg-[#EE6767]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F6C566]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#5BEB7B]" />
        </div>

        {/* Body Container */}
        <div className="w-full h-[calc(100%-28px)] flex items-center justify-between p-4 relative overflow-hidden">
          {/* Left: Featured Candidate Profile with Accept / Reject buttons */}
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-slate-200">
              <img
                src={photos[0]}
                alt="Selected Candidate"
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
            <div className="flex items-center justify-center gap-2 pt-2.5">
              <div className="rounded-[30px] text-white bg-[#0066ff] hover:bg-[#0055e6] px-4 py-1 text-xs font-semibold cursor-pointer shadow-xs transition">
                Accept
              </div>
              <div className="bg-[#FFD4E1] p-0.5 rounded-[31px]">
                <div className="rounded-[30px] text-white bg-[#E13468] hover:bg-[#c92556] px-4 py-1 text-xs font-semibold cursor-pointer shadow-xs transition">
                  Reject
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Queued Candidates */}
          <div className="w-1/4 flex flex-col items-center gap-2.5">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md border-2 border-white opacity-90">
              <img
                src={photos[1]}
                alt="Candidate 2"
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md border-2 border-white opacity-80">
              <img
                src={photos[2]}
                alt="Candidate 3"
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
          </div>

          {/* Right: Next Queue Cards */}
          <div className="w-1/4 flex flex-col items-center gap-2.5 opacity-60">
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-white">
              <img
                src={photos[3]}
                alt="Candidate 4"
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
            <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm border border-white">
              <img
                src={photos[4]}
                alt="Candidate 5"
                className="w-full h-full object-cover transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PARTNER COMPANIES (Image-2 Matching Real Corporate Logos)
// ============================================================
const PARTNER_COMPANIES = [
  {
    name: 'riveiT DIGITAL',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full border-2 border-[#1A4F8B] flex items-center justify-center bg-blue-50/60 text-[#1A4F8B]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-sm font-black text-[#1A4F8B] tracking-tight">riveiT</span>
          <span className="text-[7.5px] font-bold text-slate-500 tracking-widest uppercase">DIGITAL</span>
        </div>
      </div>
    ),
  },
  {
    name: 'Boostr Netwave',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 20L9 4L15 20L21 4" />
          </svg>
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-[11px] font-black text-slate-800 tracking-tight">Boostr Netwave</span>
          <span className="text-[6.5px] font-bold text-slate-500 uppercase tracking-wider">SOLUTIONS PVT. LTD.</span>
        </div>
      </div>
    ),
  },
  {
    name: 'DoLittle Technologies',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-r from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-black text-[11px] shadow-xs">
          DO
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-xs font-black text-[#1E3A8A]">DoLittle</span>
          <span className="text-[7px] font-semibold text-slate-500">Technologies Pvt Ltd</span>
        </div>
      </div>
    ),
  },
  {
    name: 'CORPORA',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full border-[2.5px] border-[#0F172A] flex items-center justify-center font-black text-[11px] text-[#0F172A]">
          C
        </div>
        <span className="text-xs font-black tracking-widest text-[#0F172A]">CORPORA</span>
      </div>
    ),
  },
  {
    name: 'CAIT',
    render: () => (
      <div className="flex items-center gap-1.5">
        <span className="text-base font-black tracking-tight text-[#0F172A]">CAIT</span>
        <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] skew-x-[-12deg]"></div>
      </div>
    ),
  },
  {
    name: 'ATUMX',
    render: () => (
      <div className="flex items-center gap-0.5">
        <span className="text-sm font-black tracking-wider text-[#0F172A]">ATUM</span>
        <span className="text-base font-black text-[#EA580C]">X</span>
      </div>
    ),
  },
  {
    name: 'Anandad Beauty',
    render: () => (
      <div className="flex items-center gap-1 bg-[#FFF5EB] px-2 py-0.5 rounded-md border border-[#FDE68A]/60">
        <span className="text-xs font-serif italic font-bold text-[#B45309]">Anandad</span>
        <span className="text-[9px] font-sans font-semibold text-[#92400E]">Beauty</span>
      </div>
    ),
  },
  {
    name: 'abouv',
    render: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full border-2 border-[#0D9488] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#0D9488]"></div>
        </div>
        <span className="text-xs font-black tracking-tight text-[#0D9488]">abôuv</span>
      </div>
    ),
  },
  {
    name: 'DORATIA TECHNOLOGIES',
    render: () => (
      <div className="flex items-center gap-1.5 bg-[#0F172A] text-white px-2 py-1 rounded">
        <span className="text-[10px] font-black text-[#00A3E0]">d</span>
        <div className="flex flex-col leading-none text-left">
          <span className="text-[8px] font-black tracking-wider text-white">DORATIA TECHNOLOGIES</span>
          <span className="text-[5.5px] font-medium text-slate-400">APPLIED INNOVATIONS</span>
        </div>
      </div>
    ),
  },
  {
    name: 'shaip',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#0284C7] flex items-center justify-center text-white">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </div>
        <span className="text-xs font-black text-[#4338CA] tracking-tight">shaip</span>
      </div>
    ),
  },
  {
    name: 'Larsen & Toubro',
    render: () => (
      <div className="flex items-center gap-1.5 bg-[#003B71] text-white px-2.5 py-1 rounded-md shadow-xs">
        <span className="text-xs font-black tracking-wider">L&amp;T</span>
        <span className="text-[8px] font-semibold text-white/90 border-l border-white/30 pl-1.5">Construction</span>
      </div>
    ),
  },
  {
    name: 'Tata Technologies',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full border-[1.5px] border-[#1E4B88] flex items-center justify-center bg-blue-50/60 shadow-xs">
          <span className="text-[10px] font-black text-[#1E4B88]">T</span>
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-[11px] font-black text-[#1E4B88] tracking-wider">TATA</span>
          <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">TECHNOLOGIES</span>
        </div>
      </div>
    ),
  },
  {
    name: 'Autodesk',
    render: () => (
      <div className="flex items-center gap-1.5">
        <svg className="w-4 h-4 text-[#0696D7]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 19L11 4L16 12L13 17L11 13L8 19H2ZM17 14L22 19H14L17 14Z" />
        </svg>
        <span className="text-xs font-black text-slate-900 tracking-widest uppercase">AUTODESK</span>
      </div>
    ),
  },
  {
    name: 'Bentley Systems',
    render: () => (
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded bg-[#008542] flex items-center justify-center text-white text-[10px] font-black shadow-xs">
          B
        </div>
        <span className="text-xs font-bold text-[#008542] tracking-tight">Bentley</span>
      </div>
    ),
  },
  {
    name: 'Schneider Electric',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#3DCD58] flex items-center justify-center text-white shadow-xs">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
            <path d="M8 5l8 7-8 7" />
          </svg>
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-xs font-black text-[#2B3A4A] tracking-tight">Schneider</span>
          <span className="text-[7px] font-bold text-[#3DCD58] uppercase tracking-wider">Electric</span>
        </div>
      </div>
    ),
  },
  {
    name: 'Worley',
    render: () => (
      <div className="flex items-center gap-1">
        <span className="text-sm font-black text-slate-900 tracking-tight">Worley</span>
        <span className="w-2 h-2 rounded-full bg-[#00A3E0]"></span>
      </div>
    ),
  },
  {
    name: 'Jacobs',
    render: () => (
      <div className="flex items-center gap-1">
        <span className="text-sm font-black text-[#00529B] tracking-widest uppercase">JACOBS</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#00529B]"></div>
      </div>
    ),
  },
  {
    name: 'Siemens Energy',
    render: () => (
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-black text-[#00646E] tracking-widest uppercase">SIEMENS</span>
        <span className="text-[8.5px] font-black text-[#EB780A] uppercase tracking-wider">ENERGY</span>
      </div>
    ),
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function JobsPortalPage() {
  const [jobsList, setJobsList] = useState<JobPost[]>(INITIAL_JOBS);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Application & Details Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobPost | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobPost | null>(null);
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantStream, setApplicantStream] = useState<string>('');
  const [applicantStudentId, setApplicantStudentId] = useState<string>('');
  const [applicantQualification, setApplicantQualification] = useState<string>('');
  const [applicantPortfolio, setApplicantPortfolio] = useState<string>('');
  const [applicantCoverNote, setApplicantCoverNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carousel scroll container ref
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync Logged-In User from localStorage
  useEffect(() => {
    const syncUser = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = sessionStorage.getItem('rnd_cadd_user') || localStorage.getItem('rnd_cadd_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.email || parsed.role)) {
              setCurrentUser(parsed);
              setApplicantName(parsed.name || '');
              setApplicantEmail(parsed.email || '');
              setApplicantStudentId(parsed.studentId || parsed.id || 'STU-001');
              setApplicantStream(parsed.stream || 'Civil & Architectural BIM');
              setApplicantPhone(parsed.phone || parsed.mobile || '+91 99080 12345');
              setApplicantQualification(parsed.qualification || 'B.Tech in Civil Engineering');
            } else {
              setCurrentUser(null);
            }
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
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // Fetch Live Jobs from API with instant fallback
  const loadJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobsList(data.jobs);
        }
      }
    } catch (err) {
      console.warn('Using local jobs data fallback:', err);
    }
  };

  useEffect(() => {
    loadJobs();
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
        showToast('Signed out successfully');
      }
    } catch {
      // ignore
    }
  };

  const handleInitiateApply = (job: JobPost) => {
    if (!currentUser) {
      showToast('🔒 Please Sign Up or Sign In to apply for jobs.');
      if (typeof window !== 'undefined') {
        window.location.href = '/signup?redirect=/jobs';
      }
      return;
    }
    setSelectedJobForApply(job);
    setApplicantName(currentUser.name || 'Student');
    setApplicantEmail(currentUser.email || '');
    setApplicantStudentId(currentUser.studentId || currentUser.id || 'STU-001');
    setApplicantStream(currentUser.stream || job.discipline);
    setApplicantPhone(currentUser.phone || currentUser.mobile || '');
    setApplicantQualification(currentUser.qualification || 'B.Tech / Diploma in Engineering');
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    if (!applicantName.trim() || !applicantEmail.trim() || !applicantPhone.trim()) {
      showToast('⚠️ Please provide your full name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJobForApply.id,
          name: applicantName.trim(),
          email: applicantEmail.trim(),
          phone: applicantPhone.trim(),
          stream: applicantStream || selectedJobForApply.discipline,
          studentId: applicantStudentId || 'DIRECT-APPLICANT',
          qualification: applicantQualification || 'B.Tech / Diploma in Engineering',
          portfolioUrl: applicantPortfolio.trim(),
          coverNote: applicantCoverNote.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApplySuccessMsg(data.message || 'Application submitted successfully to corporate recruiters!');
        loadJobs();
        setTimeout(() => {
          setSelectedJobForApply(null);
          setApplySuccessMsg('');
          showToast('✓ Application sent directly to hiring team');
        }, 1800);
      } else {
        alert(data.message || 'Failed to submit application. Please verify details.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Network error submitting job application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disciplineTabs = [
    { id: 'all', label: 'All Openings', count: jobsList.length },
    { id: 'civil', label: 'Civil & BIM', count: jobsList.filter((j) => j.discipline === 'civil').length },
    { id: 'mechanical', label: 'Mechanical CAD/CAE', count: jobsList.filter((j) => j.discipline === 'mechanical').length },
    { id: 'electrical', label: 'Electrical & Automation', count: jobsList.filter((j) => j.discipline === 'electrical').length },
    { id: 'piping', label: 'Piping & Plant CAD', count: jobsList.filter((j) => j.discipline === 'piping').length },
    { id: 'interior', label: 'Interior Architecture', count: jobsList.filter((j) => j.discipline === 'interior').length },
    { id: 'ppm', label: 'Project Management (PPM)', count: jobsList.filter((j) => j.discipline === 'ppm').length },
  ];

  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const matchesDiscipline =
        selectedDiscipline === 'all' ||
        job.discipline === selectedDiscipline ||
        job.discipline === 'all';

      const matchesMode =
        selectedWorkMode === 'all' ||
        job.workMode.toLowerCase() === selectedWorkMode.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.tools.some((t) => t.toLowerCase().includes(q)) ||
        job.description.toLowerCase().includes(q);

      return matchesDiscipline && matchesMode && matchesSearch;
    });
  }, [jobsList, selectedDiscipline, selectedWorkMode, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1D1D1F] font-sans antialiased selection:bg-[#0066ff] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1D1F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-sm font-medium flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* UNIFIED GLOBAL HEADER */}
      <Header />

      {/* HERO SECTION (Pleasant Blue Gradient with Radial Glow Orbs) */}
      <section className="relative w-full min-h-[580px] bg-[linear-gradient(to_bottom,_#FFFFFF_0%,_#FFFFFF_30%,_#C0DCFF_100%)] flex items-center pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 overflow-hidden">
        {/* Soft Radial Gradient Glow Circles */}
        <div className="w-[850px] h-[850px] absolute top-[-70%] left-[45%] max-sm:left-[-60%] max-sm:top-[-40%] rounded-full pointer-events-none">
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0)_30%,_rgba(145,194,255,0.45)_100%)]" />
        </div>
        <div className="w-[850px] h-[850px] absolute top-[50%] left-[45%] max-sm:left-[-60%] max-sm:top-[70%] rounded-full pointer-events-none">
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,_rgba(0,0,0,0)_30%,_rgba(145,194,255,0.45)_100%)]" />
        </div>

        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16 w-full flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          {/* Left Column: Heading and Subtitle */}
          <div className="w-full md:w-3/5 flex flex-col text-left">
            {/* Live Status Pill */}
            <div className="w-fit inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E7F0FF] border border-[#C7DEFF] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0066ff] animate-ping" />
              <span className="text-xs font-semibold text-[#0066ff] tracking-wide uppercase">
                RND CADD Career Ecosystem &bull; Live Vacancies
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-bl from-[#0062DC] via-[#0052cc] to-[#003D76] bg-clip-text text-transparent leading-[1.08] py-2">
              Accelerate Your <br /> Future Today
            </h1>

            <p className="mt-4 text-base sm:text-xl text-[#173B5D] opacity-80 max-w-xl font-normal leading-relaxed">
              Step into India’s most advanced engineering career ecosystem. Pre-trained, project-ready talent connected directly with industry leaders.
            </p>

            {/* Quick search and mode bar */}
            <div className="mt-8 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-[#C7DEFF] shadow-lg shadow-[#91C2FF]/20 max-w-xl">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search role, software tool (Revit, CATIA, SP3D), or city..."
                  className="w-full pl-11 pr-20 py-2.5 bg-transparent text-sm font-medium text-[#1D1D1F] placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Work Mode Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-medium">
              <span className="text-[#173B5D]/70 font-semibold pr-1">Work Mode:</span>
              {['all', 'on-site', 'hybrid', 'remote'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`px-3 py-1 rounded-full capitalize transition cursor-pointer ${
                    selectedWorkMode === mode
                      ? 'bg-[#0066ff] text-white shadow-xs font-semibold'
                      : 'bg-white/80 text-slate-600 hover:bg-white border border-[#C7DEFF]/60'
                  }`}
                >
                  {mode === 'all' ? 'All Modes' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: High-tech Engineering Stat Showcase Graphic */}
          <div className="w-full md:w-2/5 flex justify-center">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[28px] p-6 sm:p-7 border border-[#C7DEFF] shadow-xl shadow-[#91C2FF]/20 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E7F0FF] flex items-center justify-center text-[#0066ff] font-bold text-lg">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1D1D1F]">Direct Recruiter Pipeline</h4>
                    <p className="text-xs text-slate-500">Autodesk &amp; Dassault Lab Graduates</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Drives
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#E7F0FF]/60 rounded-2xl p-3.5 border border-[#C7DEFF]/40">
                  <span className="text-xs text-[#5B6F8E] font-medium block">Total Openings</span>
                  <span className="text-2xl font-bold text-[#1D1D1F]">{jobsList.length} Roles</span>
                </div>
                <div className="bg-[#E7F0FF]/60 rounded-2xl p-3.5 border border-[#C7DEFF]/40">
                  <span className="text-xs text-[#5B6F8E] font-medium block">Highest Package</span>
                  <span className="text-2xl font-bold text-[#0066ff]">₹9.0 LPA</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  Top Disciplines In Demand:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Civil &amp; BIM
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Mechanical CAE
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Process Piping SP3D
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Plant CAD
                  </span>
                </div>
              </div>

              <a
                href="#openings"
                className="w-full bg-[#0066ff] hover:bg-[#0055e6] text-white py-2.5 rounded-[30px] font-semibold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
              >
                <span>Browse All Opportunities</span>
                <span>&darr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RECRUITER PARTNER BRANDS TICKER (Image-2 Matching White Card Ribbon) */}
      <section className="bg-[#C0DCFF] py-6 sm:py-8 w-full flex flex-col items-center gap-5 border-y border-[#A5CAFE]/40 overflow-hidden">
        <p className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] opacity-80 text-center px-4">
          Trusted by Leading Institutions &amp; Companies
        </p>

        <div className="w-full overflow-hidden relative">
          <div className="flex items-center gap-4 sm:gap-6 animate-marquee whitespace-nowrap px-4">
            {/* Set 1 */}
            {PARTNER_COMPANIES.map((company, idx) => (
              <div
                key={`p1-${idx}`}
                className="flex items-center justify-center rounded-xl shadow-md bg-white px-5 sm:px-7 py-2.5 h-[58px] min-w-[160px] sm:min-w-[175px] border border-white/80 hover:shadow-lg transition-transform hover:-translate-y-0.5 flex-shrink-0"
              >
                {company.render()}
              </div>
            ))}
            {/* Set 2 (for seamless looping marquee) */}
            {PARTNER_COMPANIES.map((company, idx) => (
              <div
                key={`p2-${idx}`}
                className="flex items-center justify-center rounded-xl shadow-md bg-white px-5 sm:px-7 py-2.5 h-[58px] min-w-[160px] sm:min-w-[175px] border border-white/80 hover:shadow-lg transition-transform hover:-translate-y-0.5 flex-shrink-0"
              >
                {company.render()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY HIRE FROM US SECTION (Image-2 Matching Animated Grid) */}
      <section
        id="why-hire"
        className="w-full h-auto flex flex-col items-center py-20 bg-[linear-gradient(to_top,_#FFFFFF_0%,_#FFFFFF_5%,_#C0DCFF_100%)]"
      >
        <h2 className="text-[#333435] text-3xl sm:text-5xl font-medium text-center">
          Why hire from us ?
        </h2>
        <p className="text-[#333435] text-xl sm:text-3xl opacity-90 mt-2 sm:mt-3 text-center">
          Hiring, Made Easy
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 w-[85%] max-w-[1200px] gap-8 py-10">
          {/* Card 1: Diverse Student Community with Orbital Rings Animation */}
          <div
            id="community"
            className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100"
          >
            {/* Top Animation Graphic */}
            <OrbitalCommunityGraphic />

            {/* Title & Description Below */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-75 font-normal">
                Diverse Student Community
              </h3>
              <p className="text-sm text-[#1D1D1F] opacity-75 leading-relaxed">
                Access candidates from varied domains, backgrounds, and skill sets that bring diversity, innovation, and fresh perspectives to your team.
              </p>
            </div>
          </div>

          {/* Card 2: Well-Trained Pool of Candidates with Auto-Cycling Candidate Cards */}
          <div className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100">
            {/* Top Animation Graphic */}
            <CyclingCandidatesGraphic />

            {/* Title & Description Below */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-75 font-normal">
                Well-Trained Pool of Candidates
              </h3>
              <p className="text-sm text-[#1D1D1F] opacity-75 leading-relaxed">
                Every candidate is industry-ready, trained with practical skills and real-time projects, ensuring faster onboarding and reduced training costs.
              </p>
            </div>
          </div>

          {/* Card 3: Hire From Top Tier Colleges with Candidate Profile Tracks */}
          <div className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100">
            {/* Top Animation Graphic */}
            <CandidateProfileTracksGraphic />

            {/* Title & Description Below */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-75 font-normal">
                Hire From Top Tier Colleges
              </h3>
              <p className="text-sm text-[#1D1D1F] opacity-75 leading-relaxed">
                RND CADD connects you with ambitious students from India’s leading institutions, giving you direct access to premium talent.
              </p>
            </div>
          </div>

          {/* Card 4: Free of Cost Hiring with Interactive Review Window */}
          <div className="flex flex-col h-full justify-between p-8 sm:p-10 bg-white rounded-[27px] shadow-lg shadow-[#91C2FF]/15 border border-slate-100">
            {/* Top Animation Graphic */}
            <FreeOfCostHiringGraphic />

            {/* Title & Description Below */}
            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] opacity-75 font-normal">
                Free of Cost Hiring
              </h3>
              <p className="text-sm text-[#1D1D1F] opacity-75 leading-relaxed">
                Hire top talent without paying a single rupee. RND CADD makes quality hiring accessible to every employer by eliminating recruitment fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS SECTION (Pleasant modern #E7F0FF cards, #0066ff buttons) */}
      <section id="openings" className="w-full h-auto px-3.5 sm:px-8 lg:px-16 overflow-hidden py-10 sm:py-14 max-w-[1400px] mx-auto">
        {/* Student Auth Notice: Job application features are unlocked once signed up */}
        {!currentUser && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-red-50 border border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md shadow-red-500/20">
                🎓
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#15304C]">
                  Student Placement &amp; Job Applications
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Direct job applications and recruiter drives are exclusive to registered students. Please Sign Up or Sign In to unlock the application feature.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <Link
                href="/signup?redirect=/jobs"
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#EE2C3C] hover:bg-[#D20A0B] text-white text-xs font-bold shadow-sm shadow-red-500/20 transition-all text-center whitespace-nowrap active:scale-95"
              >
                Sign Up to Apply
              </Link>
              <Link
                href="/signin?redirect=/jobs"
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#15304C] text-xs font-bold shadow-2xs transition-all text-center whitespace-nowrap active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Section Top Header with Prev/Next Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[#1D1D1F] text-2xl sm:text-[36px] leading-[40px] font-medium">
              Take the first step of your career here.
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-normal">
              Click any opening to inspect job expectations, required software tools, and submit your portfolio directly.
            </p>
          </div>

          {/* Carousel Arrows & View Mode Switcher */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#C7DEFF] text-[#5B6F8E]">
              {filteredJobs.length} Vacancies Open
            </span>

            {/* Toggle View Mode */}
            <div className="flex bg-[#E7F0FF] p-1 rounded-full border border-[#C7DEFF]">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                  viewMode === 'carousel'
                    ? 'bg-[#0066ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0066ff]'
                }`}
                title="Carousel View"
              >
                Carousel
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                  viewMode === 'grid'
                    ? 'bg-[#0066ff] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0066ff]'
                }`}
                title="Grid View"
              >
                Grid
              </button>
            </div>

            {/* Arrow Buttons (Pleasant Modern Style) */}
            {viewMode === 'carousel' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="p-2.5 bg-[#C7DEFF] rounded-full hover:bg-[#a6c9ff] transition cursor-pointer text-[#5A6F8E] flex items-center justify-center shadow-xs"
                  aria-label="Previous Jobs"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="p-2.5 bg-[#C7DEFF] rounded-full hover:bg-[#a6c9ff] transition cursor-pointer text-[#5A6F8E] flex items-center justify-center shadow-xs"
                  aria-label="Next Jobs"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Discipline Navigation Tabs (Soft blue pills) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {disciplineTabs.map((tab) => {
            const isActive = selectedDiscipline === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDiscipline(tab.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#0066ff] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#E7F0FF] text-[#1D1D1F]/80 hover:bg-[#d8e8ff]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-[#5B6F8E]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* JOBS LISTING: Carousel or Grid */}
        {filteredJobs.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#E7F0FF]/40 rounded-3xl border border-dashed border-[#C7DEFF] p-8">
            <span className="text-3xl">🔍</span>
            <h4 className="text-base font-bold text-[#1D1D1F]">No openings match your current filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try switching disciplines or resetting search filters to view active opportunities.
            </p>
            <button
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedWorkMode('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full bg-[#0066ff] text-white text-xs font-semibold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'carousel' ? (
          /* Smooth Horizontal Carousel */
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-none no-scrollbar snap-x snap-mandatory"
          >
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="w-[85vw] max-w-[350px] min-w-[260px] sm:w-[350px] sm:min-w-[350px] snap-start bg-[#E7F0FF] rounded-[20px] p-5 sm:p-6 flex flex-col justify-between gap-4 border border-[#C7DEFF]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0"
              >
                {/* Top Discipline Tag & Work Mode */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-fit px-3 py-1 rounded-full bg-[#C7DEFF]">
                      <p className="text-[#5B6F8E] text-[13px] font-semibold uppercase tracking-wide">
                        {job.discipline}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]/70">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {job.workMode}
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-[#1D1D1F] text-lg font-bold line-clamp-1">
                    {job.title}
                  </h3>

                  {/* Company Row */}
                  <div className="w-full flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-[#1D1D1F]/80">{job.company}</span>
                      <span className="text-[#0066ff] text-xs font-bold" title="Verified Employer">✓</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#C7DEFF] p-1 flex items-center justify-center font-bold text-xs text-[#0066ff] shadow-xs">
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Card Divider */}
                  <div className="w-full h-[1px] bg-[#1D1D1F]/15 my-3" />

                  {/* 4 Details Rows with SVGs */}
                  <div className="w-full flex flex-col gap-2 text-xs sm:text-sm text-[#1D1D1F]/80 font-medium">
                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{job.location}</span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 font-semibold text-[#0066ff]">
                      <span className="text-base leading-none text-[#0066ff]">₹</span>
                      <span>{job.salary}</span>
                    </div>

                    {/* Job Type */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{job.jobType}</span>
                    </div>

                    {/* Experience & Vacancies */}
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.experience} &bull; {job.vacancies} Openings</span>
                    </div>
                  </div>

                  {/* Required Software Tools */}
                  <div className="mt-3 pt-2.5 border-t border-[#1D1D1F]/10">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Required Software Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="bg-white/90 text-[#1D1D1F] text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-[#C7DEFF]"
                        >
                          {tool}
                        </span>
                      ))}
                      {job.tools.length > 3 && (
                        <span className="text-[10px] font-semibold text-[#5B6F8E] self-center">
                          +{job.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons (Pleasant Modern Style) */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="flex-1 bg-white hover:bg-slate-50 text-[#1D1D1F] border border-[#C7DEFF] py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateApply(job)}
                    className="flex-1 bg-[#0066ff] hover:bg-[#0055e6] text-white py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Quick Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#E7F0FF] rounded-[20px] p-6 flex flex-col justify-between gap-4 border border-[#C7DEFF]/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-fit px-3 py-1 rounded-full bg-[#C7DEFF]">
                      <p className="text-[#5B6F8E] text-[13px] font-semibold uppercase tracking-wide">
                        {job.discipline}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D1D1F]/70">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {job.workMode}
                    </span>
                  </div>

                  <h3 className="text-[#1D1D1F] text-lg font-bold line-clamp-1">
                    {job.title}
                  </h3>

                  <div className="w-full flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-[#1D1D1F]/80">{job.company}</span>
                      <span className="text-[#0066ff] text-xs font-bold">✓</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#C7DEFF] p-1 flex items-center justify-center font-bold text-xs text-[#0066ff] shadow-xs">
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="w-full h-[1px] bg-[#1D1D1F]/15 my-3" />

                  <div className="w-full flex flex-col gap-2 text-xs sm:text-sm text-[#1D1D1F]/80 font-medium">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-[#0066ff]">
                      <span className="text-base leading-none text-[#0066ff]">₹</span>
                      <span>{job.salary}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{job.jobType}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#1D1D1F]/50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{job.experience} &bull; {job.vacancies} Openings</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1D1D1F]/10">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Required Software Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="bg-white/90 text-[#1D1D1F] text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-[#C7DEFF]"
                        >
                          {tool}
                        </span>
                      ))}
                      {job.tools.length > 3 && (
                        <span className="text-[10px] font-semibold text-[#5B6F8E] self-center">
                          +{job.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForDetails(job)}
                    className="flex-1 bg-white hover:bg-slate-50 text-[#1D1D1F] border border-[#C7DEFF] py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInitiateApply(job)}
                    className="flex-1 bg-[#0066ff] hover:bg-[#0055e6] text-white py-2 px-3 rounded-[30px] text-xs font-semibold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Quick Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* THREE BANNERS (100% RND CADD) */}
      <section className="w-full h-auto bg-[#E5EEFC] px-6 sm:px-12 lg:px-16 py-16 flex flex-col gap-12 max-w-[1400px] mx-auto rounded-[36px] my-10">
        {/* Banner 1: Student Membership */}
        <div className="w-full rounded-[30px] bg-[#A5CAFE]/25 flex flex-col md:flex-row justify-between items-center p-8 sm:p-12 border border-[#A5CAFE]/40 relative overflow-hidden">
          <div className="w-full md:w-3/5 flex flex-col gap-4 z-10">
            <h3 className="text-3xl sm:text-[44px] leading-tight font-medium text-[#1D1D1F]">
              Become an RND CADD Student Member
            </h3>
            <p className="text-sm sm:text-base text-[#1D1D1F] opacity-75 font-normal leading-relaxed max-w-xl">
              Unlock exclusive career benefits—priority internships, job alerts, mentor access, and direct placement drives. Join RND CADD membership and stay ahead in your engineering journey.
            </p>
            <div className="pt-2">
              <Link
                href="/signup"
                className="bg-[#0066ff] hover:bg-[#0055e6] cursor-pointer w-fit px-8 text-white py-2.5 rounded-[30px] flex items-center justify-center gap-2 text-sm font-semibold transition shadow-md shadow-blue-500/20"
              >
                <span>⚡ Get Membership</span>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white shadow-sm space-y-3 max-w-xs w-full">
              <div className="text-xs font-bold text-[#0066ff] uppercase tracking-wider">
                Member Privileges
              </div>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li className="flex items-center gap-2">✓ Verified Capstone Portfolio</li>
                <li className="flex items-center gap-2">✓ Direct Corporate Shortlisting</li>
                <li className="flex items-center gap-2">✓ Autodesk Certified Credential</li>
                <li className="flex items-center gap-2">✓ Unlimited Placement Drives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Banner 2: Hire Smarter with RND CADD (Dark to Blue Gradient) */}
        <div
          id="employers"
          className="w-full rounded-[30px] bg-gradient-to-b from-[#0055FF] to-[#1D1D1F] flex flex-col md:flex-row justify-between items-center p-8 sm:p-12 text-white relative overflow-hidden"
        >
          <div className="w-full md:w-3/5 flex flex-col gap-4 z-10">
            <h3 className="text-3xl sm:text-[44px] leading-tight font-medium text-white">
              Hire Smarter with RND CADD
            </h3>
            <p className="text-sm sm:text-base text-white opacity-85 font-normal leading-relaxed max-w-xl">
              Access a pool of pre-trained, project-ready candidates. Save time, reduce costs, and find talent that fits. Partner with us today to connect with the engineering workforce of tomorrow.
            </p>
            <div className="pt-2">
              <a
                href="mailto:placements@rndcadd.com?subject=Hire%20Engineers%20from%20RND%20CADD"
                className="bg-[#0066ff] border border-white/40 w-fit px-8 text-white py-2.5 rounded-[30px] flex items-center justify-center gap-2 text-sm font-semibold hover:bg-white hover:text-[#0066ff] transition cursor-pointer shadow-md"
              >
                <span>⚡ Start Hiring</span>
              </a>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-2 max-w-xs w-full">
              <span className="text-2xl">🤝</span>
              <h5 className="text-sm font-bold">Zero Recruitment Fee</h5>
              <p className="text-xs text-white/80">
                Direct interviews with certified candidates ready to deploy on day one.
              </p>
            </div>
          </div>
        </div>

        {/* Banner 3: Looking for more opportunities? */}
        <div className="w-full rounded-[30px] bg-gradient-to-r from-[#DFE8F6] to-[#FFFFFF] flex flex-col md:flex-row justify-between items-center p-8 sm:p-12 border border-[#A0C3F7] relative">
          <div className="w-full md:w-3/5 flex flex-col gap-3">
            <h3 className="text-2xl sm:text-[38px] leading-tight font-medium text-[#1D1D1F]">
              Looking for more such opportunities?
            </h3>
            <p className="text-sm sm:text-base opacity-75 font-normal text-[#1D1D1F]">
              Register now to access 1,000+ verified engineering openings posted across Civil, Mechanical, Electrical &amp; Piping!
            </p>
            <div className="pt-3">
              <Link
                href="/signin?redirect=/jobs"
                className="inline-flex items-center justify-center border border-gray-300 rounded-xl px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition shadow-xs"
              >
                Sign In Now &rarr;
              </Link>
            </div>
          </div>

          <div className="w-full md:w-2/5 flex justify-center md:justify-end mt-6 md:mt-0 text-xs text-slate-500">
            <span>
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#0066ff] underline">
                Terms and Conditions
              </Link>
            </span>
          </div>
        </div>
      </section>

      {/* MODAL 1: VIEW JOB DETAILS */}
      {selectedJobForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-6 max-h-[92dvh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E7F0FF] text-[#0066ff] uppercase tracking-wider">
                  {selectedJobForDetails.discipline}
                </span>
                <h3 className="text-2xl font-bold text-[#1D1D1F] mt-2">
                  {selectedJobForDetails.title}
                </h3>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  {selectedJobForDetails.company} &bull; {selectedJobForDetails.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#E7F0FF]/60 border border-[#C7DEFF] text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Salary</span>
                <span className="font-bold text-[#0066ff] text-sm">{selectedJobForDetails.salary}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Work Mode</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.workMode}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Experience</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.experience}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Vacancies</span>
                <span className="font-bold text-slate-800">{selectedJobForDetails.vacancies} Openings</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Job Description &amp; Scope
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {selectedJobForDetails.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Required Software Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedJobForDetails.tools.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg bg-white border border-[#C7DEFF] text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setSelectedJobForDetails(null)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const j = selectedJobForDetails;
                  setSelectedJobForDetails(null);
                  handleInitiateApply(j);
                }}
                className="px-6 py-2.5 rounded-full bg-[#0066ff] hover:bg-[#0055e6] text-white text-xs font-semibold shadow-md shadow-blue-500/20 cursor-pointer"
              >
                ⚡ Apply for this Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE QUICK APPLY MODAL */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 space-y-5 max-h-[92dvh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-[#0066ff] uppercase tracking-wider">
                  Direct Recruiter Application
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] mt-1">
                  Apply for {selectedJobForApply.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  {selectedJobForApply.company} &bull; {selectedJobForApply.location} &bull; {selectedJobForApply.salary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedJobForApply(null);
                  setApplySuccessMsg('');
                }}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {applySuccessMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <span className="text-3xl">✓</span>
                <h4 className="text-base font-bold">Application Submitted!</h4>
                <p className="text-xs font-medium text-emerald-700">{applySuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                {!currentUser && (
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start space-x-2">
                    <span className="font-bold">Tip:</span>
                    <span>
                      Already have an account?{' '}
                      <Link href="/signin?redirect=/jobs" className="font-semibold underline text-[#0066ff]">
                        Sign In
                      </Link>{' '}
                      to auto-fill your verified portfolio and student credentials.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                      placeholder="e.g. Ram G."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      required
                      placeholder="e.g. student1@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      required
                      placeholder="+91 99080 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={applicantStudentId}
                      onChange={(e) => setApplicantStudentId(e.target.value)}
                      placeholder="STU-001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:outline-none focus:border-[#0066ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Portfolio / Drive Project Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://drive.google.com/your-cad-portfolio-or-linkedin"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brief Note to Hiring Manager
                  </label>
                  <textarea
                    rows={3}
                    value={applicantCoverNote}
                    onChange={(e) => setApplicantCoverNote(e.target.value)}
                    placeholder="Mention your key CAD tools, hands-on capstone project, and notice period..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
                    className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-[#0066ff] hover:bg-[#0055e6] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Confirm & Apply Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="RND CADD" className="h-7 w-auto object-contain" />
            <span className="font-medium text-slate-600">&bull; Engineering Career &amp; Placements Ecosystem</span>
          </div>
          <div className="text-slate-400">
            Copyright &copy; 2026 RND CADD EduTech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
