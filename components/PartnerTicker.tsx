'use client';

import React, { useState } from 'react';

interface PartnerLogo {
  name: string;
  category: 'university' | 'firm' | 'epc';
  renderLogo: () => React.ReactNode;
}

export const PartnerTicker: React.FC = () => {
  const [connectedCandidate, setConnectedCandidate] = useState<string | null>(null);

  // ROW 1: Colorful Real Company & Tech Giants (Scrolling Right-to-Left)
  const row1Logos: PartnerLogo[] = [
    {
      name: 'Google',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span className="text-sm font-bold tracking-tight text-slate-800">Google</span>
        </div>
      ),
    },
    {
      name: 'Tata Technologies',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-[1.5px] border-[#1E4B88] flex items-center justify-center bg-blue-50/60 shadow-xs">
            <span className="text-[10px] font-black text-[#1E4B88]">T</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[12px] font-black text-[#1E4B88] tracking-wider">TATA</span>
            <span className="text-[7.5px] font-bold text-slate-600 tracking-widest uppercase">TECHNOLOGIES</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Siemens Energy',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-black text-[#00646E] tracking-widest uppercase">SIEMENS</span>
          <span className="text-[9px] font-black text-[#EB780A] uppercase tracking-wider">ENERGY</span>
        </div>
      ),
    },
    {
      name: 'Schneider Electric',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#3DCD58] flex items-center justify-center text-white shadow-sm">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
              <path d="M8 5l8 7-8 7" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-[#2B3A4A] tracking-tight">Schneider</span>
            <span className="text-[7.5px] font-bold text-[#3DCD58] uppercase tracking-wider">Electric</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Amazon Web Services',
      category: 'firm',
      renderLogo: () => (
        <div className="flex flex-col items-center justify-center">
          <span className="text-base font-black text-[#232F3E] tracking-tight leading-none">aws</span>
          <svg className="w-9 h-2.5 text-[#FF9900] -mt-0.5" viewBox="0 0 60 16" fill="currentColor">
            <path d="M4 4 C 18 14, 42 14, 56 4 C 58 3, 56 6, 54 8 C 42 18, 16 18, 4 8 Z" />
            <polygon points="56,2 60,6 54,8" />
          </svg>
        </div>
      ),
    },
    {
      name: 'Autodesk',
      category: 'firm',
      renderLogo: () => (
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
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-[#008542] flex items-center justify-center text-white text-[10px] font-black shadow-sm">
            B
          </div>
          <span className="text-xs font-bold text-[#008542] tracking-tight">Bentley</span>
        </div>
      ),
    },
    {
      name: 'Dassault Systèmes',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#005386] flex items-center justify-center text-white text-[9px] font-black shadow-xs">
            3D
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-[#005386] tracking-tight">DASSAULT</span>
            <span className="text-[7px] font-bold text-slate-500 tracking-wider">SYSTEMES</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Microsoft',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
            <div className="bg-[#F25022] rounded-[1px] w-2 h-2"></div>
            <div className="bg-[#7FBA00] rounded-[1px] w-2 h-2"></div>
            <div className="bg-[#00A4EF] rounded-[1px] w-2 h-2"></div>
            <div className="bg-[#FFB900] rounded-[1px] w-2 h-2"></div>
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">Microsoft</span>
        </div>
      ),
    },
    {
      name: 'Larsen & Toubro',
      category: 'epc',
      renderLogo: () => (
        <div className="flex items-center gap-1.5 bg-[#003B71] text-white px-2.5 py-1 rounded-md shadow-sm">
          <span className="text-xs font-black tracking-wider">L&amp;T</span>
          <span className="text-[8.5px] font-semibold tracking-tight text-white/90 border-l border-white/30 pl-1.5">
            Engineering
          </span>
        </div>
      ),
    },
  ];

  // ROW 2: EPC Leaders, Engineering Software & Partner Universities (Scrolling Left-to-Right)
  const row2Logos: PartnerLogo[] = [
    {
      name: 'Jacobs',
      category: 'epc',
      renderLogo: () => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-[#00529B] tracking-widest uppercase">JACOBS</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00529B]"></div>
        </div>
      ),
    },
    {
      name: 'Worley',
      category: 'epc',
      renderLogo: () => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-slate-900 tracking-tight">Worley</span>
          <span className="w-2 h-2 rounded-full bg-[#00A3E0]"></span>
        </div>
      ),
    },
    {
      name: 'Ansys',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-4 bg-[#FFB71B] skew-x-[-12deg] rounded-xs shadow-xs"></div>
          <span className="text-xs font-black text-slate-900 tracking-widest">ANSYS</span>
        </div>
      ),
    },
    {
      name: 'Caterpillar',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-[#FFCD11]"></div>
          <span className="text-xs font-black text-slate-900 tracking-wider">CAT</span>
        </div>
      ),
    },
    {
      name: 'PTC',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full border-2 border-[#2DAE2B] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#2DAE2B]"></div>
          </div>
          <span className="text-sm font-extrabold text-[#2DAE2B] tracking-tight">ptc</span>
        </div>
      ),
    },
    {
      name: 'IIBA',
      category: 'university',
      renderLogo: () => (
        <div className="flex items-center gap-0.5 font-black text-lg italic text-[#004B87] tracking-tighter">
          <span className="text-[#0072CE]">II</span>
          <span>BA</span>
        </div>
      ),
    },
    {
      name: 'Liverpool John Moores University',
      category: 'university',
      renderLogo: () => (
        <div className="flex items-center gap-2 border border-[#00205B]/30 px-2 py-0.5 rounded bg-white shadow-xs">
          <svg className="w-4 h-5 text-[#00205B]" viewBox="0 0 24 28" fill="currentColor">
            <path d="M12 2 C8 2, 4 5, 4 10 C4 16, 12 26, 12 26 C12 26, 20 16, 20 10 C20 5, 16 2, 12 2 Z M12 6 C14 6, 16 8, 16 10 C16 13, 13 16, 12 18 C11 16, 8 13, 8 10 C8 8, 10 6, 12 6 Z" />
          </svg>
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-black tracking-widest text-[#00205B] uppercase">LIVERPOOL</span>
            <span className="text-[6.5px] font-bold text-[#00205B] tracking-wider uppercase">JOHN MOORES</span>
            <span className="text-[6px] font-medium text-slate-500 uppercase">UNIVERSITY</span>
          </div>
        </div>
      ),
    },
    {
      name: 'BIMTECH',
      category: 'university',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#1B365D] via-[#008542] to-[#E87722] flex items-center justify-center p-0.5 shadow-xs">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <span className="text-[8px] font-black text-[#1B365D]">B</span>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-black text-[#1B365D] tracking-wide">BIMTECH</span>
            <span className="text-[6px] font-bold text-[#E87722] uppercase tracking-wider">BIRLA INSTITUTE</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Schlumberger',
      category: 'firm',
      renderLogo: () => (
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-black text-[#0072CE] tracking-tighter">slb</span>
          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">Schlumberger</span>
        </div>
      ),
    },
    {
      name: 'Colorado State University',
      category: 'university',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#1E4D2B] flex items-center justify-center text-white text-[9px] font-black border border-[#C8C372] shadow-xs">
            CSU
          </div>
          <span className="text-[11px] font-black text-[#1E4D2B] tracking-tight">Colorado State</span>
        </div>
      ),
    },
    {
      name: 'EMLV Paris',
      category: 'university',
      renderLogo: () => (
        <div className="flex items-center gap-1">
          <span className="text-xs font-black text-[#004B87]">V</span>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-black text-slate-900 tracking-wider">EMLV</span>
            <span className="text-[6px] font-medium text-slate-500 uppercase">PARIS BUSINESS</span>
          </div>
        </div>
      ),
    },
    {
      name: 'esdes',
      category: 'university',
      renderLogo: () => (
        <div className="flex items-center">
          <span className="text-sm font-extrabold text-[#00838F] tracking-tight">esdes</span>
          <span className="text-[7px] font-bold text-[#00838F] align-top ml-0.5">LYON</span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white border-b border-[#E2E8F0] overflow-hidden">
      
      {/* ========================================================================= */}
      {/* PART 1: 2-ROW DUAL-DIRECTION COLORFUL REAL BRANDMARKS MARQUEE             */}
      {/* ========================================================================= */}
      <section className="py-12 bg-[#FAFCFF] border-b border-slate-100">
        <div className="cad-container">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-[#D20A0B] tracking-wider uppercase bg-red-50 px-3 py-1 rounded-full border border-red-100">
              GLOBAL CORPORATE RECRUITMENT NETWORK
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Great Universities, Top Global Firms
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Trusted by Fortune 500 EPC conglomerates, CAD/BIM software pioneers, and accredited institutions
            </p>
          </div>
        </div>

        {/* Dual Opposing Infinite Marquees with Edge Fade Gradients */}
        <div className="relative w-full overflow-hidden flex flex-col gap-4 sm:gap-5 py-2">
          {/* Edge Gradient Fades for Premium Finish */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none"></div>

          {/* ROW 1: Moves Right to Left */}
          <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
            <div className="inline-flex items-center gap-5 sm:gap-6 animate-marquee py-1">
              {row1Logos.concat(row1Logos).concat(row1Logos).map((item, idx) => (
                <div
                  key={`row1-${item.name}-${idx}`}
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:scale-105 flex-shrink-0 cursor-default select-none min-h-[48px] sm:min-h-[52px]"
                  title={item.name}
                >
                  {item.renderLogo()}
                </div>
              ))}
            </div>
          </div>

          {/* ROW 2: Moves Left to Right */}
          <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
            <div className="inline-flex items-center gap-5 sm:gap-6 animate-marquee-ltr py-1">
              {row2Logos.concat(row2Logos).concat(row2Logos).map((item, idx) => (
                <div
                  key={`row2-${item.name}-${idx}`}
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-slate-300 transition-all duration-300 hover:scale-105 flex-shrink-0 cursor-default select-none min-h-[48px] sm:min-h-[52px]"
                  title={item.name}
                >
                  {item.renderLogo()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PART 2: EXACT IMAGE 3 (jobs.unlox.com "Hiring, Made Easy" Showcase)       */}
      {/* ========================================================================= */}
      <section className="w-full py-16 sm:py-20 bg-[linear-gradient(to_bottom,#FFFFFF_0%,#F1F7FF_100%)] relative overflow-hidden">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />

        <div className="cad-container relative z-10">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-bold text-[#0066FF] tracking-wider uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 mb-3">
              Why hire from us ?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1D1D1F] tracking-tight">
              Hiring, Made Easy
            </h2>
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mt-3 leading-relaxed">
              Step into India’s most advanced engineering CAD, BIM &amp; EPC talent ecosystem with certified trainees ready for deployment.
            </p>
          </div>

          {/* Grid of the 2 Signature Cards from jobs.unlox.com (Image 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* ------------------------------------------------------------- */}
            {/* CARD 1: Diverse Student Community (Concentric Orbiting Avatars)*/}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col justify-between p-8 sm:p-10 bg-white rounded-[28px] shadow-xl shadow-blue-500/5 border border-slate-100 hover:shadow-2xl transition-all duration-300">
              
              {/* Animated Orbiting Solar System Container */}
              <div className="w-full flex items-center justify-center py-8">
                <div className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] flex items-center justify-center">
                  
                  {/* Outer Dotted Orbiting Ring (Counter-Clockwise) */}
                  <div className="absolute top-1/2 left-1/2 w-[270px] h-[270px] border border-dashed border-blue-200 rounded-full animate-rotate-ccw pointer-events-none">
                    
                    {/* Orbiting Avatar 1 (0 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full overflow-hidden shadow-lg border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(0deg) translateY(-135px) rotate(0deg)' }}
                      title="Civil / BIM Specialist"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-ccw"
                      />
                    </div>

                    {/* Orbiting Avatar 2 (72 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full overflow-hidden shadow-lg border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(72deg) translateY(-135px) rotate(-72deg)' }}
                      title="Mechanical CAD Engineer"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-ccw"
                      />
                    </div>

                    {/* Orbiting Avatar 3 (144 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full overflow-hidden shadow-lg border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(144deg) translateY(-135px) rotate(-144deg)' }}
                      title="Electrical CADD Engineer"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-ccw"
                      />
                    </div>

                    {/* Orbiting Avatar 4 (216 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full overflow-hidden shadow-lg border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(216deg) translateY(-135px) rotate(-216deg)' }}
                      title="Piping SP3D Specialist"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-ccw"
                      />
                    </div>

                    {/* Orbiting Avatar 5 (288 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-10 h-10 -ml-5 -mt-5 rounded-full overflow-hidden shadow-lg border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(288deg) translateY(-135px) rotate(-288deg)' }}
                      title="Interior Architect"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-ccw"
                      />
                    </div>
                  </div>

                  {/* Inner Dotted Orbiting Ring (Clockwise) */}
                  <div className="absolute top-1/2 left-1/2 w-[140px] h-[140px] border border-dashed border-blue-300 rounded-full animate-rotate-cw pointer-events-none">
                    
                    {/* Inner Avatar 1 (0 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-9 h-9 -ml-4.5 -mt-4.5 rounded-full overflow-hidden shadow-md border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(0deg) translateY(-70px) rotate(0deg)' }}
                      title="PPM Primavera Master"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-cw"
                      />
                    </div>

                    {/* Inner Avatar 2 (120 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-9 h-9 -ml-4.5 -mt-4.5 rounded-full overflow-hidden shadow-md border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(120deg) translateY(-70px) rotate(-120deg)' }}
                      title="Structural Analyst"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-cw"
                      />
                    </div>

                    {/* Inner Avatar 3 (240 deg) */}
                    <div
                      className="absolute top-1/2 left-1/2 w-9 h-9 -ml-4.5 -mt-4.5 rounded-full overflow-hidden shadow-md border-2 border-white pointer-events-auto"
                      style={{ transform: 'rotate(240deg) translateY(-70px) rotate(-240deg)' }}
                      title="FEA Simulation Trainee"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=160&q=80"
                        alt="Candidate"
                        className="w-full h-full object-cover animate-counter-cw"
                      />
                    </div>
                  </div>

                  {/* Center Sun Avatar */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full overflow-hidden shadow-2xl border-3 border-[#0066FF] z-20">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                      alt="Student Network Hub"
                      className="w-full h-full object-cover"
                    />
                  </div>

                </div>
              </div>

              {/* Text Description */}
              <div className="flex flex-col gap-2 pt-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                  Diverse Student Community
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Access candidates from varied domains, backgrounds, and skill sets that bring diversity, innovation, and fresh perspectives to your engineering and design teams.
                </p>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* CARD 2: Well-Trained Pool of Candidates (Candidate Cards Track)*/}
            {/* ------------------------------------------------------------- */}
            <div className="flex flex-col justify-between p-8 sm:p-10 bg-white rounded-[28px] shadow-xl shadow-blue-500/5 border border-slate-100 hover:shadow-2xl transition-all duration-300">
              
              {/* Candidate Cards Column */}
              <div className="w-full flex flex-col gap-3.5 py-4">
                
                {/* Candidate 1 */}
                <div className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80"
                      alt="Shreya Moitra"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border-2 border-blue-50"
                    />
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        Shreya Moitra
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        BIM Architect &amp; Revit • 2+ Years Exp.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConnectedCandidate('Shreya Moitra')}
                    className={`px-5 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                      connectedCandidate === 'Shreya Moitra'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md shadow-blue-500/20 active:scale-95'
                    }`}
                  >
                    {connectedCandidate === 'Shreya Moitra' ? '✓ Connected' : 'Connect'}
                  </button>
                </div>

                {/* Candidate 2 */}
                <div className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80"
                      alt="Surya K"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border-2 border-blue-50"
                    />
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        Surya K
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        Mechanical CAD/CAE • SolidWorks &amp; CATIA
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConnectedCandidate('Surya K')}
                    className={`px-5 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                      connectedCandidate === 'Surya K'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md shadow-blue-500/20 active:scale-95'
                    }`}
                  >
                    {connectedCandidate === 'Surya K' ? '✓ Connected' : 'Connect'}
                  </button>
                </div>

                {/* Candidate 3 */}
                <div className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 hover:-translate-y-0.5 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80"
                      alt="Simran M"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0 border-2 border-blue-50"
                    />
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        Simran M
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        Process Piping &amp; SP3D • 3+ Years Exp.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConnectedCandidate('Simran M')}
                    className={`px-5 sm:px-6 py-2 rounded-lg text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                      connectedCandidate === 'Simran M'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-md shadow-blue-500/20 active:scale-95'
                    }`}
                  >
                    {connectedCandidate === 'Simran M' ? '✓ Connected' : 'Connect'}
                  </button>
                </div>

              </div>

              {/* Text Description */}
              <div className="flex flex-col gap-2 pt-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
                  Well-Trained Pool of Candidates
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Every candidate is industry-ready, trained with practical skills and real-time projects, ensuring faster onboarding and reduced training costs.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
