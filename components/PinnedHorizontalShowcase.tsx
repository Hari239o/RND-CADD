'use client';

import React, { useRef, useState, useEffect } from 'react';

export const PinnedHorizontalShowcase: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            const totalScrollable = rect.height - window.innerHeight;
            if (totalScrollable > 0) {
              const currentProgress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
              setScrollProgress(currentProgress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Translate horizontal track smoothly based on scroll progress
  // At progress = 0 -> 0% translate
  // At progress = 1 -> -75% translate
  const translateX = -(scrollProgress * 75);

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

  return (
    <section ref={targetRef} className="relative h-[220vh] bg-[#F1F5F9]">
      {/* Sticky Pinned Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-16">
        
        {/* Sticky Top Heading Bar */}
        <div className="cad-container w-full flex items-center justify-between pb-6 border-b border-[#CBD5E1]">
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-1 tracking-wider uppercase">
              LAB INFRASTRUCTURE &amp; CERTIFICATION PATHWAYS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] uppercase">
              ENTERPRISE CAD TRAINING STANDARDS
            </h2>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-[#64748B]">
            <span className="w-2 h-2 bg-[#D20A0B]"></span>
            <span>ADVANCE THROUGH 4 INFRASTRUCTURE PILLARS</span>
          </div>
        </div>

        {/* Horizontal Sliding Track */}
        <div className="w-full my-auto overflow-hidden">
          <div
            style={{
              transform: `translate3d(${translateX}%, 0, 0)`,
              willChange: 'transform'
            }}
            className="flex space-x-8 pl-8 md:pl-24 w-[400vw] transition-transform duration-75 ease-out"
          >
            {slides.map((slide) => (
              <div
                key={slide.num}
                className="w-[85vw] max-w-[850px] bg-[#FFFFFF] border border-[#CBD5E1] flex flex-col lg:flex-row overflow-hidden shadow-xl flex-shrink-0"
              >
                {/* Visual Half */}
                <div className="relative w-full lg:w-1/2 h-64 lg:h-auto bg-[#CBD5E1] overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#FFFFFF] border border-[#CBD5E1] px-3 py-1 text-xs font-bold text-[#D20A0B] shadow-sm">
                    STAGE {slide.num} / 04
                  </div>
                </div>

                {/* Information Half */}
                <div className="p-8 w-full lg:w-1/2 flex flex-col justify-between bg-[#FFFFFF]">
                  <div>
                    <div className="text-[11px] font-bold text-[#D20A0B] uppercase mb-2 tracking-wider">
                      {slide.tag}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight uppercase">
                      {slide.title}
                    </h3>

                    {/* Feature Bullets - Zero Icons */}
                    <div className="mt-6 space-y-3">
                      {slide.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-start space-x-3 text-xs text-[#334155]">
                          <span className="text-[#D20A0B] font-bold text-sm">[+]</span>
                          <span className="leading-relaxed">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                    <span>{slide.note}</span>
                    <span className="text-[#00873D] font-bold">[VERIFIED]</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Progress Bar */}
        <div className="cad-container w-full pt-4 border-t border-[#CBD5E1] flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center space-x-4">
            <span>SLIDE PROGRESS TRACKER</span>
            <div className="w-32 h-1.5 bg-[#E2E8F0] overflow-hidden">
              <div
                style={{ width: `${scrollProgress * 100}%` }}
                className="h-full bg-[#D20A0B] transition-all duration-75"
              />
            </div>
          </div>
          <div>SCROLL CONTINUES TO COURSERA CURRICULUM MATRIX -&gt;</div>
        </div>

      </div>
    </section>
  );
};
