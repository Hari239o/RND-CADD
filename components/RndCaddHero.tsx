'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RndCaddHeroProps {
  onSelectStream: (stream: any) => void;
  onExploreCatalog: () => void;
}

const DISCIPLINES = [
  {
    id: 'mechanical',
    tag: 'MECHANICAL',
    title: 'Product Design & CAE Simulation',
    tools: 'SolidWorks • CATIA • NX CAD • ANSYS FEA',
    duration: '3 to 6 Months',
  },
  {
    id: 'civil',
    tag: 'CIVIL & BIM',
    title: 'Structural Engineering & BIM Modeling',
    tools: 'Revit BIM • STAAD.Pro • ETABS • AutoCAD',
    duration: '3 to 6 Months',
  },
  {
    id: 'eee',
    tag: 'ELECTRICAL',
    title: 'Industrial Automation & Electrical CAD',
    tools: 'AutoCAD Electrical • EPLAN • SCADA Systems',
    duration: '2 to 4 Months',
  },
  {
    id: 'piping',
    tag: 'PIPING & PLANT',
    title: 'Plant Design Management & Piping Stress',
    tools: 'SP3D • Caesar II • PDMS • Plant 3D',
    duration: '3 to 5 Months',
  },
];

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

  const handleSelectTrack = (streamId: string) => {
    onSelectStream(streamId);
    scrollToExperience();
  };

  return (
    <section className="relative w-full bg-[#F8FAFC] border-b border-slate-200 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Authoritative MNC Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Top Category Badge - Pure Typography */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="inline-flex items-center self-start border border-slate-200 bg-white px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider text-slate-700 uppercase shadow-2xs mb-4 sm:mb-6"
            >
              <span>ENTERPRISE ENGINEERING &amp; DESIGN ACADEMY</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12]"
            >
              Master Industrial CAD, CAM &amp; BIM at{' '}
              <span className="text-[#1D4ED8]">Enterprise Scale</span>
            </motion.h1>

            {/* Executive Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
              className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl"
            >
              Accelerate your engineering competencies with rigorous, hands-on training in product modeling, finite element analysis, and building information systems. Designed and delivered by certified domain specialists on high-performance RTX computing infrastructure.
            </motion.p>

            {/* Action CTAs: Solid Executive Colors, No Icons, No Gradients */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <button
                type="button"
                onClick={scrollToExperience}
                className="px-7 sm:px-8 py-3.5 sm:py-4 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer text-center"
              >
                Explore All Programs
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('enrollment');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-[#0F172A] text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer text-center"
              >
                Reserve Lab Workstation
              </button>
            </motion.div>

            {/* Executive Trust Metrics Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">25,000+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Engineers Certified</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1D4ED8] tracking-tight">450+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Hiring Partners</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">1:1</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Dedicated RTX Labs</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1D4ED8] tracking-tight">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Project Practical</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Discipline & Specialization Console */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: 'easeOut' }}
            className="lg:col-span-5 w-full"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xs font-bold tracking-widest uppercase text-slate-900">
                    Engineering Disciplines
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select a specialization to inspect curriculum
                  </p>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  ACTIVE BATCH
                </span>
              </div>

              {/* Specialization Cards List */}
              <div className="mt-4 space-y-3">
                {DISCIPLINES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectTrack(item.id)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-[#1D4ED8] bg-slate-50/50 hover:bg-white transition-all duration-150 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 group-hover:border-[#1D4ED8] group-hover:text-[#1D4ED8] transition-colors">
                        {item.tag}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                        {item.duration}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#1D4ED8] transition-colors mt-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">
                      {item.tools}
                    </div>
                  </button>
                ))}
              </div>

              {/* Card Footer Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Need guidance choosing a discipline?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('enrollment');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#1D4ED8] hover:text-[#0F172A] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Request Consultation
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Standards Accreditation Strip across full hero width */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-slate-500 text-xs">
          <span className="font-bold tracking-wider uppercase text-slate-700 text-[11px]">
            Enterprise Alignment:
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 font-semibold text-[11px] text-slate-700 shadow-2xs">
              ISO 9001:2015 Certified
            </span>
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 font-semibold text-[11px] text-slate-700 shadow-2xs">
              Autodesk Aligned
            </span>
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 font-semibold text-[11px] text-slate-700 shadow-2xs">
              Dassault Systèmes Aligned
            </span>
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 font-semibold text-[11px] text-slate-700 shadow-2xs">
              Bentley Systems Aligned
            </span>
            <span className="px-3 py-1 rounded-md bg-white border border-slate-200 font-semibold text-[11px] text-slate-700 shadow-2xs">
              Industry 4.0 Standards
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
