'use client';

import React, { useRef, useState } from 'react';

export const PinnedHorizontalShowcase: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      num: '01',
      tag: 'TECH INFRASTRUCTURE',
      title: 'RTX GPU WORKSTATION LABS',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      specs: [
        'Multi-Core Intel Core i9 & Xeon CAD Rigs',
        'Dedicated NVIDIA RTX GPU 16GB VRAM per Station',
        'Dual 4K Color-Accurate Engineering Monitors',
        'Licensed Commercial Autodesk, Dassault & Bentley Suites'
      ],
      note: 'Ameerpet Campus Hardware Lab 01 & 02'
    },
    {
      num: '02',
      tag: 'EXPERIENCE-BASED LEARNING',
      title: 'MANDATORY INDUSTRY CAPSTONES',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
      specs: [
        '5-Story Commercial BIM Model with Navisworks Clash Resolution',
        'Automotive Gearbox Parametric Assembly & Motion Study in SolidWorks',
        'FEA Rotor Structural Fatigue & Heat Transfer Validation in ANSYS',
        'Multi-Line Control Panel & 3D Pro Panel Enclosure in EPLAN'
      ],
      note: 'Portfolio-Ready Verified GitHub & Drive Deliverables'
    },
    {
      num: '03',
      tag: 'CREDENTIALING EXCELLENCE',
      title: 'DUAL GLOBAL CERTIFICATION',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
      specs: [
        'RND CADD Master Diploma with Unique QR Verification Code',
        'Autodesk Certified Professional (ACP) Exam Pathway',
        'Dassault Systèmes CSWA / CSWP Direct Training Accreditation',
        'Bentley Institute Structural Modeler Qualification'
      ],
      note: 'Globally Recognized by EPC & Manufacturing Employers'
    },
    {
      num: '04',
      tag: 'EMPLOYMENT HUB',
      title: '250+ ACTIVE HIRING EPC PARTNERS',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      specs: [
        'Dedicated Ameerpet Placement Assistance Cell',
        'Mock Technical Interviews & Tool Speed Tests',
        'Direct Campus Recruitment Drives by Tier-1 EPC Firms',
        'Average Placement Package: INR 4.5L - 8.2L per annum'
      ],
      note: 'L&T, Tata Technologies, Schneider Electric, Cyient, MEIL'
    }
  ];

  const handlePrev = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="py-14 sm:py-20 bg-[#F1F5F9] border-t border-b border-[#CBD5E1] overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1480px] mx-auto">
        {/* Top Heading Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-[#CBD5E1] gap-4">
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-1 tracking-wider uppercase">
              LAB INFRASTRUCTURE &amp; CERTIFICATION PATHWAYS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] uppercase">
              ENTERPRISE CAD TRAINING STANDARDS
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#64748B]">
              STAGE {slides[activeSlide].num} OF 0{slides.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Slide"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Slide"
                className="w-9 h-9 rounded-full bg-[#D20A0B] hover:bg-[#B50809] text-white shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Featured Active Stage Card */}
        <div className="w-full bg-[#FFFFFF] border border-[#CBD5E1] rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row transition-all duration-300">
          {/* Visual Half */}
          <div className="relative w-full lg:w-1/2 h-72 sm:h-80 lg:h-auto min-h-[320px] bg-[#CBD5E1] overflow-hidden">
            <img
              src={slides[activeSlide].image}
              alt={slides[activeSlide].title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-[#FFFFFF]/95 backdrop-blur-sm border border-[#CBD5E1] px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#D20A0B] shadow-sm">
              STAGE {slides[activeSlide].num} / 04
            </div>
          </div>

          {/* Information Half */}
          <div className="p-6 sm:p-10 w-full lg:w-1/2 flex flex-col justify-between bg-[#FFFFFF]">
            <div>
              <div className="text-[11px] font-bold text-[#D20A0B] uppercase mb-2 tracking-wider">
                {slides[activeSlide].tag}
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0F172A] tracking-tight uppercase">
                {slides[activeSlide].title}
              </h3>

              {/* Feature Bullets */}
              <div className="mt-6 space-y-3.5">
                {slides[activeSlide].specs.map((spec, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-[#334155]">
                    <span className="text-[#D20A0B] font-bold text-base leading-none">✓</span>
                    <span className="leading-relaxed">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span className="font-semibold">{slides[activeSlide].note}</span>
              <span className="text-[#00873D] font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                [VERIFIED]
              </span>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {slides.map((s, idx) => (
            <button
              key={s.num}
              onClick={() => setActiveSlide(idx)}
              className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                activeSlide === idx
                  ? 'bg-white border-[#D20A0B] shadow-md ring-1 ring-[#D20A0B]'
                  : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] font-bold text-[#D20A0B] uppercase">Stage {s.num}</div>
              <div className="text-xs font-bold text-slate-800 truncate mt-0.5">{s.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
