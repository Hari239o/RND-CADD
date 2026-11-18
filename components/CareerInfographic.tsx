'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';

export interface CareerPathwayItem {
  id: string;
  step: string;
  experience: string;
  role: string;
  ctc: string;
  // Optional backward compatibility
  level?: string;
  focus?: string;
  growth?: string;
  status?: string;
  color?: 'blue' | 'orange';
  iconType?: string;
}

export const getCourseCareerPathways = (course: Course): CareerPathwayItem[] => {
  // Priority 1: Use live admin-curated career roles if provided
  if (Array.isArray(course.careerRoles) && course.careerRoles.length >= 2) {
    const expRanges = ['0 – 2 Yrs', '2 – 4 Yrs', '4 – 6 Yrs', '6 – 8 Yrs', '8+ Yrs'];
    const ctcRanges = ['₹4.5L – ₹9.0L PA', '₹6.0L – ₹11.5L PA', '₹8.0L – ₹15.0L PA', '₹11.0L – ₹19.0L PA', '₹15.0L – ₹28.0L+ PA'];
    return course.careerRoles.slice(0, 5).map((r, i) => ({
      id: String(i + 1),
      step: String(i + 1).padStart(2, '0'),
      experience: expRanges[i] || `${i * 2}+ Yrs`,
      role: r,
      ctc: ctcRanges[i] || '₹12.0L – ₹22.0L PA',
    }));
  }

  const query = `${course.id || ''} ${course.title || ''} ${course.stream || ''} ${course.folder || ''} ${course.category || ''} ${Array.isArray(course.tools) ? course.tools.join(' ') : ''} ${typeof (course as any).software === 'string' ? (course as any).software : ''}`.toLowerCase();

  // 1. CNC / Mastercam / Manufacturing
  if (query.includes('mastercam') || query.includes('cnc') || query.includes('cam') || query.includes('machining')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'CNC Programmer', ctc: '₹4.2L – ₹8.5L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: '3/4-Axis CAM Engineer', ctc: '₹5.2L – ₹10.5L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: '5-Axis Multi-Tasking Lead', ctc: '₹7.2L – ₹13.8L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Manufacturing Process Lead', ctc: '₹9.5L – ₹17.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Chief CAM Consultant', ctc: '₹14.0L – ₹24.0L+ PA' },
    ];
  }

  // 2. SolidWorks / Creo / Mechanical Design
  if (query.includes('solidworks') || query.includes('creo') || query.includes('inventor') || query.includes('mechanical cad') || (query.includes('mechanical') && !query.includes('ansys') && !query.includes('catia'))) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'Mechanical 3D Modeler', ctc: '₹4.5L – ₹8.8L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Product Design Engineer', ctc: '₹5.8L – ₹11.0L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Senior Machine Designer', ctc: '₹7.5L – ₹14.0L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Product Development Lead', ctc: '₹10.0L – ₹18.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Chief Mechanical Architect', ctc: '₹15.0L – ₹26.0L+ PA' },
    ];
  }

  // 3. CATIA V5 Aerospace & Automotive Surfacing
  if (query.includes('catia') || query.includes('aerospace') || query.includes('automotive') || query.includes('surfacing')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'Surface CAD Modeler', ctc: '₹5.0L – ₹9.5L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Class-A BIW Specialist', ctc: '₹6.5L – ₹12.5L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Aerospace DMU Lead', ctc: '₹8.5L – ₹15.5L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Vehicle Systems Lead', ctc: '₹11.5L – ₹20.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Chief Aerospace Consultant', ctc: '₹16.0L – ₹28.0L+ PA' },
    ];
  }

  // 4. ANSYS FEA & CFD Multiphysics Simulation
  if (query.includes('ansys') || query.includes('fea') || query.includes('cfd') || query.includes('simulation') || query.includes('multiphysics')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'CAE Simulation Analyst', ctc: '₹5.2L – ₹10.0L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'FEA & Fatigue Specialist', ctc: '₹6.8L – ₹13.0L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'CFD Aerodynamics Lead', ctc: '₹9.0L – ₹16.5L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Simulation Authority', ctc: '₹12.0L – ₹21.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Principal CAE Consultant', ctc: '₹17.0L – ₹30.0L+ PA' },
    ];
  }

  // 5. Revit Architecture & BIM Specialist
  if (query.includes('revit') || query.includes('bim') || query.includes('navisworks')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'BIM Architectural Modeler', ctc: '₹4.5L – ₹9.0L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Revit Family Specialist', ctc: '₹5.5L – ₹10.5L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Lead BIM Coordinator', ctc: '₹7.0L – ₹13.5L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Clash & 4D Simulation Lead', ctc: '₹9.5L – ₹17.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Corporate BIM Consultant', ctc: '₹14.0L – ₹24.0L+ PA' },
    ];
  }

  // 6. STAAD.Pro / ETABS / High-Rise Structural Design
  if (query.includes('staad') || query.includes('etabs') || query.includes('structural') || query.includes('seismic')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'Structural CAD Drafter', ctc: '₹4.2L – ₹8.0L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Junior Structural Engineer', ctc: '₹5.5L – ₹10.5L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Senior Structural Analyst', ctc: '₹7.5L – ₹14.0L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Lead Project Consultant', ctc: '₹10.0L – ₹18.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Principal Structural Director', ctc: '₹15.0L – ₹26.0L+ PA' },
    ];
  }

  // 7. AutoCAD Civil / 2D Drafting / Survey / Municipal
  if (query.includes('autocad') || query.includes('civil') || query.includes('drafting')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'Civil 2D/3D Drafter', ctc: '₹3.8L – ₹7.5L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Infrastructure Modeler', ctc: '₹4.8L – ₹9.5L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Highway & Survey Lead', ctc: '₹6.5L – ₹12.5L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Civil Delivery Lead', ctc: '₹8.8L – ₹16.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Chief Civil Consultant', ctc: '₹13.0L – ₹23.0L+ PA' },
    ];
  }

  // 8. 3ds Max / V-Ray / Lumion / Architectural Visualization / Interior
  if (query.includes('lumion') || query.includes('3ds max') || query.includes('v-ray') || query.includes('sketchup') || query.includes('interior') || query.includes('rendering')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: '3D Visualizer & Modeler', ctc: '₹4.2L – ₹8.5L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Lighting & V-Ray Artist', ctc: '₹5.5L – ₹10.8L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Walkthrough & VR Lead', ctc: '₹7.2L – ₹14.0L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Studio Art Director', ctc: '₹9.8L – ₹17.5L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Chief Visualization Partner', ctc: '₹14.5L – ₹25.0L+ PA' },
    ];
  }

  // 9. Electrical CAD / EPLAN / ETAP / Automation
  if (query.includes('eplan') || query.includes('electrical') || query.includes('automation') || query.includes('etap') || query.includes('plc')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'Electrical CAD Drafter', ctc: '₹4.5L – ₹8.5L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'EPLAN Automation Specialist', ctc: '₹5.8L – ₹11.0L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Power Grid Analyst (ETAP)', ctc: '₹7.8L – ₹14.5L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Lead Substation Engineer', ctc: '₹10.5L – ₹18.5L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Principal Energy Consultant', ctc: '₹15.0L – ₹27.0L+ PA' },
    ];
  }

  // 10. Piping / SP3D / Caesar II / Plant Design
  if (query.includes('piping') || query.includes('sp3d') || query.includes('plant') || query.includes('caesar')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'Piping Layout Modeler', ctc: '₹4.8L – ₹9.2L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'SP3D Plant Detailer', ctc: '₹6.2L – ₹12.0L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Piping Stress Analyst', ctc: '₹8.2L – ₹15.5L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Lead Piping Coordinator', ctc: '₹11.5L – ₹20.0L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Principal Plant Consultant', ctc: '₹16.0L – ₹28.0L+ PA' },
    ];
  }

  // 11. Primavera P6 / PPM
  if (query.includes('primavera') || query.includes('ppm') || query.includes('project')) {
    return [
      { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'Planning Engineer', ctc: '₹5.0L – ₹9.5L PA' },
      { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Primavera P6 Controller', ctc: '₹6.8L – ₹13.0L PA' },
      { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Earned Value Analyst', ctc: '₹9.0L – ₹16.5L PA' },
      { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Portfolio Controls Manager', ctc: '₹12.5L – ₹21.5L PA' },
      { id: '5', step: '05', experience: '8+ Yrs', role: 'Chief Program Director', ctc: '₹17.5L – ₹30.0L+ PA' },
    ];
  }

  // Default Fallback
  return [
    { id: '1', step: '01', experience: '0 – 2 Yrs', role: 'CAD Design Engineer', ctc: '₹4.5L – ₹8.8L PA' },
    { id: '2', step: '02', experience: '2 – 4 Yrs', role: 'Senior Project Modeler', ctc: '₹5.8L – ₹11.0L PA' },
    { id: '3', step: '03', experience: '4 – 6 Yrs', role: 'Engineering Coordinator', ctc: '₹7.5L – ₹14.0L PA' },
    { id: '4', step: '04', experience: '6 – 8 Yrs', role: 'Technical Project Authority', ctc: '₹10.0L – ₹18.0L PA' },
    { id: '5', step: '05', experience: '8+ Yrs', role: 'Chief Engineering Consultant', ctc: '₹15.0L – ₹26.0L+ PA' },
  ];
};

export interface HiringConglomerate {
  id: string;
  name: string;
  renderLogo: () => React.ReactNode;
}

export const HIRING_CONGLOMERATES: HiringConglomerate[] = [
  {
    id: 'tata-tech',
    name: 'Tata Technologies',
    renderLogo: () => (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-5 h-5 rounded-full border-[1.5px] border-[#1E4B88] flex items-center justify-center bg-blue-50/60 shadow-xs">
          <span className="text-[10px] font-black text-[#1E4B88]">T</span>
        </div>
        <span className="text-[11px] font-black text-[#1E4B88] tracking-wider">TATA</span>
      </div>
    ),
  },
  {
    id: 'lt',
    name: 'Larsen & Toubro (L&T)',
    renderLogo: () => (
      <div className="flex items-center gap-1 bg-[#003B71] text-white px-2 py-0.5 rounded shadow-xs flex-shrink-0">
        <span className="text-[11px] font-black tracking-wider">L&amp;T</span>
      </div>
    ),
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    renderLogo: () => (
      <div className="w-5 h-5 rounded bg-[#3DCD58] flex items-center justify-center text-white shadow-xs flex-shrink-0">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <path d="M8 5l8 7-8 7" />
        </svg>
      </div>
    ),
  },
  {
    id: 'cyient',
    name: 'Cyient Limited',
    renderLogo: () => (
      <div className="w-5 h-5 rounded-full bg-[#00A3E0] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    ),
  },
  {
    id: 'meil',
    name: 'MEIL Infrastructure',
    renderLogo: () => (
      <div className="px-1.5 py-0.5 rounded bg-[#C4122F] text-white font-black text-[10px] tracking-tight flex-shrink-0 shadow-xs">
        MEIL
      </div>
    ),
  },
  {
    id: 'boeing-airbus',
    name: 'Boeing & Airbus Tier-1',
    renderLogo: () => (
      <div className="flex items-center -space-x-1 flex-shrink-0">
        <div className="w-5 h-5 rounded bg-[#0033A0] flex items-center justify-center text-white shadow-xs" title="Boeing">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93V15h-2v3.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 11v2h2v-2l5-5h2v2l-3.5 3.5H19c.62 0 1.2.09 1.76.24C20.08 15.22 16.95 18.44 13 18.93z" />
          </svg>
        </div>
        <div className="w-5 h-5 rounded bg-[#00205B] flex items-center justify-center text-white shadow-xs" title="Airbus">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      </div>
    ),
  },
  {
    id: 'atkins',
    name: 'AtkinsRéalis',
    renderLogo: () => (
      <div className="w-5 h-5 rounded bg-[#E0004D] flex items-center justify-center text-white font-black text-[10px] flex-shrink-0 shadow-xs">
        ▲
      </div>
    ),
  },
  {
    id: 'jacobs',
    name: 'Jacobs Engineering',
    renderLogo: () => (
      <div className="flex items-center gap-1 bg-[#00529B] text-white px-1.5 py-0.5 rounded shadow-xs flex-shrink-0">
        <span className="text-[10px] font-black tracking-wider">JACOBS</span>
      </div>
    ),
  },
  {
    id: 'alstom',
    name: 'Alstom Transport',
    renderLogo: () => (
      <div className="flex items-center gap-0.5 bg-[#002B49] text-white px-1.5 py-0.5 rounded shadow-xs flex-shrink-0">
        <span className="text-[10px] font-black text-[#FF003B]">/</span>
        <span className="text-[9px] font-black tracking-tight">ALSTOM</span>
      </div>
    ),
  },
  {
    id: 'siemens',
    name: 'Siemens Energy',
    renderLogo: () => (
      <div className="flex items-baseline gap-1 bg-[#00646E] text-white px-1.5 py-0.5 rounded shadow-xs flex-shrink-0">
        <span className="text-[9px] font-black tracking-wider uppercase">SIEMENS</span>
      </div>
    ),
  },
];

interface CareerInfographicProps {
  course: Course;
}

export const CareerInfographic: React.FC<CareerInfographicProps> = ({ course }) => {
  const pathways = getCourseCareerPathways(course);

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* 1. CLEAN DIRECT HEADER - NO SUBTITLES, NO SUB-HEADERS */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-6 bg-[#EE2C3C] rounded-full inline-block" />
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Career Progression Path
          </h3>
        </div>
      </div>

      {/* 2. SLEEK FLOWING ROADMAP PATTERN - NO BOX-IN-BOX, NO CLUTTER */}
      <div className="relative py-2">
        {/* Continuous Flow Rail on Desktop */}
        <div className="hidden lg:block absolute top-[28px] left-[7%] right-[7%] h-[3px] bg-gradient-to-r from-blue-600 via-indigo-600 to-[#EE2C3C] rounded-full z-0 opacity-80" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          {pathways.map((item, idx) => {
            const isLast = idx === pathways.length - 1;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`relative rounded-2xl p-5 transition-all cursor-default flex flex-col justify-between ${
                  isLast
                    ? 'bg-gradient-to-b from-red-50/80 to-white border-2 border-[#EE2C3C] shadow-md shadow-red-500/10'
                    : 'bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md shadow-xs'
                }`}
              >
                {/* Node Milestone & Experience */}
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shadow-xs ${
                      isLast
                        ? 'bg-[#EE2C3C] text-white shadow-red-500/30 ring-4 ring-red-100'
                        : 'bg-[#15304C] text-white ring-4 ring-blue-50'
                    }`}
                  >
                    {item.step}
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {item.experience}
                  </span>
                </div>

                {/* Role Designation */}
                <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug mb-4 min-h-[2.5rem]">
                  {item.role}
                </h4>

                {/* Package (CTC) Benchmark */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation</span>
                    <span className={`text-xs font-black ${isLast ? 'text-[#EE2C3C]' : 'text-emerald-700'}`}>
                      {item.ctc}
                    </span>
                  </div>
                  <span className="text-slate-400 font-bold text-xs">↗</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. CORPORATE RECRUITERS RIBBON WITH REAL LOGOS */}
      <div className="pt-5 border-t border-slate-100">
        <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3.5">
          Our Alumni Are Hired At Top MNC Firms:
        </span>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {HIRING_CONGLOMERATES.map((partner) => (
            <motion.div
              key={partner.id}
              whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.15 } }}
              className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-white px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-default select-none shadow-2xs group"
            >
              {partner.renderLogo()}
              <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};
