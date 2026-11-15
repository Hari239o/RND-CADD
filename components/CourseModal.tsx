'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  const [activeSection, setActiveSection] = useState<'all' | 'curriculum' | 'tools' | 'capstone' | 'jobs' | 'outcomes'>('all');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(true);
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({ '01': true, '02': true });

  if (!course) return null;

  // Safe Fallback Normalizations to guarantee rich MNC-grade rendering
  const toolsList: string[] = Array.isArray(course.tools) && course.tools.length > 0
    ? course.tools
    : typeof (course as any).software === 'string' && (course as any).software.trim()
    ? (course as any).software.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['AutoCAD 2026', 'Industry CAD Workstation', 'Parametric 3D Suite'];

  const rawModules = Array.isArray(course.modules) && course.modules.length > 0
    ? course.modules
    : Array.isArray((course as any).syllabus) && (course as any).syllabus.length > 0
    ? (course as any).syllabus.map((s: string, idx: number) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: s,
        hours: 20,
        topics: [
          `${s} - Industry specifications & standards`,
          'Parametric modeling, constraint validation & dimensioning',
          'Practical drafting lab exercises with live mentor review',
          'Production drawing sheets generation & automated BOM'
        ],
      }))
    : [
        {
          number: '01',
          title: `${course.title} - Core Foundations & Engineering Standards`,
          hours: 25,
          topics: [
            'User Interface navigation, workspace templates & BIS/ISO drawing standards',
            '2D parametric geometric constraints, relations & dimensional formulas',
            'Feature tree hierarchy, coordinate datum systems & reference planes',
            'Drafting sheet layout, view projections & section views setup'
          ],
        },
        {
          number: '02',
          title: 'Advanced 3D Modeling, Surfacing & Part Assemblies',
          hours: 30,
          topics: [
            'Complex solid feature creation: Sweeps, Lofts, Ribs & Thin Shells',
            'Surface modeling: Splines, boundary curves & curvature continuity (G0, G1, G2)',
            'Top-down and bottom-up assembly architecture with kinematic constraints',
            'Hardware fastener insertion, smart components & interference detection'
          ],
        },
        {
          number: '03',
          title: 'Mechanism Kinematics, Stress Analysis & Clash Resolution',
          hours: 35,
          topics: [
            'Kinematic mechanism joints, motion simulation & sweep envelope generation',
            'Dynamic collision detection, clearance verification & tolerance stack-up',
            'FEA finite element boundary conditions, meshing & Von-Mises stress',
            'Coordination matrix documentation & multi-disciplinary engineering reviews'
          ],
        },
        {
          number: '04',
          title: 'Industry Capstone Portfolio & Production Documentation',
          hours: 30,
          topics: [
            'End-to-end live client industrial modeling & drawing generation',
            'Automated Bill of Quantities / Materials (BOM) with supplier part numbers',
            'GD&T Geometric Dimensioning and Tolerancing symbols conforming to ASME Y14.5',
            'Portfolio dossier packaging & mock technical interview defense'
          ],
        },
      ];

  // Ensure every module has rich, detailed topics
  const modulesList = rawModules.map((mod: any, idx: number) => {
    const defaultTopics = [
      `${mod.title} - Core industrial standards and workflows`,
      'Parametric feature definitions, constraints & layer architectures',
      'Hands-on lab modeling with real-scale CAD blueprints',
      'Validation checks, interference audits & automated documentation'
    ];
    const topics = Array.isArray(mod.topics) && mod.topics.length > 0
      ? mod.topics.flatMap((t: any) => typeof t === 'string' ? t.split(',').map((s) => s.trim()).filter(Boolean) : [String(t)])
      : defaultTopics;

    return {
      number: mod.number || String(idx + 1).padStart(2, '0'),
      title: mod.title || `Module ${idx + 1} Industrial Applications`,
      hours: Number(mod.hours) || 25,
      topics: topics.length > 0 ? topics : defaultTopics,
    };
  });

  const capstoneData = course.capstoneProject && course.capstoneProject.title
    ? {
        title: course.capstoneProject.title,
        description: course.capstoneProject.description || 'Comprehensive real-world industrial modeling, drafting, and validation project evaluated by senior corporate engineering leads.',
        deliverables: Array.isArray(course.capstoneProject.deliverables) && course.capstoneProject.deliverables.length > 0
          ? course.capstoneProject.deliverables
          : ['Production 2D Drawings (.dwg)', '3D Parametric Master Assembly', 'Automated Bill of Materials (BOM)', 'Engineering Verification Dossier'],
      }
    : {
        title: `${course.title} Comprehensive Industrial Capstone Project`,
        description: 'Complete real-world industrial modeling, drafting, and multi-disciplinary validation project conforming to international engineering standards.',
        deliverables: ['Production 2D Drawings (.dwg)', '3D Parametric Master Assembly', 'Automated Bill of Materials (BOM)', 'Engineering Verification Dossier'],
      };

  const careerList = Array.isArray(course.careerRoles) && course.careerRoles.length > 0
    ? course.careerRoles
    : ['CAD Design Engineer', 'Product Specialist', 'Senior Design Modeler', 'Project Engineering Associate', 'BIM / CAD Coordinator'];

  const certificationText = course.certification || 'Autodesk & Dassault Systèmes Certificate';
  const prerequisitesText = course.prerequisites || 'Diploma / B.Tech / Working Professional / Mechanical / Civil / Electrical Graduate';
  const courseLevel = course.level || 'Professional Diploma';
  const totalHours = course.totalHours || (modulesList.reduce((acc: number, m: any) => acc + (m.hours || 0), 0) || 120);
  const streamText = (course.folder || course.stream || 'engineering').toUpperCase();
  const categoryText = course.category || `${streamText} CERTIFIED PROGRAM`;
  const feeAmount = Number(course.fee) || 32000;
  const recordingsCount = course.classes?.length || 4;

  const toggleModule = (num: string) => {
    setExpandedModules((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAllModules = () => {
    const allExp: { [key: string]: boolean } = {};
    modulesList.forEach((m) => { allExp[m.number] = true; });
    setExpandedModules(allExp);
  };

  const collapseAllModules = () => {
    setExpandedModules({});
  };

  // Learning Outcomes derived Coursera-style
  const learningOutcomes = [
    {
      title: 'Industry Blueprint Standards',
      desc: 'Master international drafting norms (BIS, ISO, ASME Y14.5), geometric tolerances (GD&T), and multi-sheet production documentation.',
      tag: 'STANDARDS'
    },
    {
      title: 'Parametric 3D Modeling & Surfacing',
      desc: 'Build robust, fully-constrained parametric 3D solid models, generative curves, and Class-A aerodynamic curvature continuity (G0, G1, G2).',
      tag: 'MODELING'
    },
    {
      title: 'Assemblies & Dynamic Kinematics',
      desc: 'Create complex multi-part top-down assemblies, define mechanical joints, simulate kinematics, and audit dynamic interference clashes.',
      tag: 'ASSEMBLY'
    },
    {
      title: 'Multi-Physics & Load Validation',
      desc: 'Perform realistic structural, stress, and thermal checks with adaptive meshing, load conditions, and safety factor calculations.',
      tag: 'VALIDATION'
    },
    {
      title: 'Automated BOM & Cost Estimation',
      desc: 'Extract automated Bill of Materials (BOM), cut lists, weight roll-ups, and live supplier component specifications for fabrication.',
      tag: 'PRODUCTION'
    },
    {
      title: 'Corporate Portfolio Capstone',
      desc: 'Produce an end-to-end portfolio-grade capstone project verified by Ameerpet placement mentors for tier-1 MNC engineering interviews.',
      tag: 'PORTFOLIO'
    }
  ];

  // Top hiring MNC partner companies
  const hiringPartners = [
    'Tata Technologies',
    'Larsen & Toubro (L&T)',
    'Schneider Electric',
    'Cyient Limited',
    'MEIL Infrastructure',
    'Boeing & Airbus Tier-1',
    'AtkinsRéalis',
    'Jacobs Engineering',
    'Alstom Transport'
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#070D18]/90 backdrop-blur-md transition-all duration-200 overflow-hidden ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      }`}
    >
      {/* Modal Container */}
      <div
        className={`bg-[#FFFFFF] border border-[#CBD5E1] shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
          isFullscreen
            ? 'w-screen h-screen rounded-none border-none'
            : 'w-full max-w-[1600px] h-[95vh] rounded-2xl border-2 border-[#15304C]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between text-xs text-[#475569] flex-shrink-0 shadow-xs z-20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-7 w-auto object-contain flex-shrink-0"
            />
            <div className="flex items-center space-x-2 truncate">
              <span className="font-extrabold text-[#15304C] uppercase tracking-wider text-xs sm:text-[13px]">
                OFFICIAL COURSE SPECIFICATION
              </span>
              <span className="text-[#CBD5E1] hidden sm:inline">&bull;</span>
              <span className="text-[#0284C7] font-mono font-bold hidden sm:inline">
                ID: {(course.code || course.id).toUpperCase()}
              </span>
              <span className="text-[#CBD5E1] hidden md:inline">&bull;</span>
              <span className="text-emerald-600 font-bold hidden md:inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE SYNCED
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3.5 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[11px] font-bold text-[#15304C] flex items-center space-x-1.5 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Full Screen' : 'View Full Screen'}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M14 4h6m-6 0V1m0 3l7-3M4 10h6m0 0V4m0 6L3 3" />
                  </svg>
                  <span className="hidden md:inline">COMPACT</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="hidden md:inline">FULL SCREEN</span>
                </>
              )}
            </button>

            {/* Red Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FEF2F2] hover:bg-[#FEE2E2] active:scale-95 border-2 border-[#FECACA] hover:border-[#EF4444] text-[#DC2626] flex items-center justify-center transition-all shadow-sm flex-shrink-0 cursor-pointer"
              title="Close Blueprint"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 bg-[#F8FAFC]">
          
          {/* ========================================================================= */}
          {/* 1. COURSERA-STYLE EXECUTIVE HERO SECTION                                  */}
          {/* ========================================================================= */}
          <div className="bg-[#0B1528] text-white border-b border-slate-800 relative overflow-hidden">
            {/* Subtle Engineering Grid Background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            <div className="w-full max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Column: Course Identity, Rating, Title & Highlights (7 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Breadcrumb & Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#D20A0B] text-white font-extrabold uppercase tracking-wider text-[11px] shadow-sm">
                      {streamText} DISCIPLINE
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                      {categoryText}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-[11px] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      AUTODESK &amp; DASSAULT ACCREDITED
                    </span>
                  </div>

                  {/* Main Course Title */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md">
                    {course.title}
                  </h1>

                  {/* Subtitle / Tagline */}
                  <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl">
                    {course.tagline || course.overview}
                  </p>

                  {/* Rating & Social Proof Bar (Coursera Hallmark) */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-300 border-t border-slate-800">
                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                      <span className="text-base">★</span>
                      <span className="text-white font-extrabold text-sm sm:text-base">4.9</span>
                      <span className="text-slate-400 font-normal">(1,840+ Ratings)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">1,860+</span>
                      <span className="text-slate-400">Engineers Trained</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span>✓ 100% Placement Record</span>
                    </div>
                  </div>

                  {/* Key Fast Facts Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                      <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">{course.duration || '10 Weeks'}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Lab Hours</span>
                      <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">{totalHours} Hours (1:1 Rig)</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skill Level</span>
                      <span className="text-xs sm:text-sm font-extrabold text-white mt-0.5 block">{courseLevel}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class Recordings</span>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-400 mt-0.5 block">{recordingsCount} Lessons Incl.</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Card Preview & Immediate Action Box (5 cols) */}
                <div className="lg:col-span-4">
                  <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-slate-100 flex flex-col gap-4">
                    {/* Course Banner Preview */}
                    <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
                      <img
                        src={course.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-[#D20A0B] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-md">
                        CAMPUS LAB WORKSTATION
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Full Blueprint Dossier
                      </div>
                    </div>

                    {/* Commercial Pricing & Guarantee */}
                    <div className="border-b border-slate-200 pb-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tuition Fee</span>
                        <div className="text-right">
                          <span className="text-2xl sm:text-3xl font-black text-[#D20A0B]">
                            ₹{feeAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-medium">All-Inclusive &bull; No Hidden Charges</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md mt-2 flex items-center gap-1">
                        <span>✓</span> Zero Reservation Fee &bull; Free Demo Class with Lead Trainer
                      </p>
                    </div>

                    {/* Instant Action CTAs */}
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEnroll(course.title);
                        }}
                        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D20A0B] via-[#E01829] to-[#D20A0B] hover:from-[#B50809] hover:to-[#960607] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <span>ENROLL IN THIS PROGRAM NOW</span>
                        <span>&rarr;</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById('curriculum-roadmap');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>↓ VIEW FULL SYLLABUS &amp; LABS</span>
                      </button>
                    </div>

                    {/* Quick Bullet Trust Guarantees */}
                    <div className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-medium border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>1:1 Dedicated RTX GPU Workstation Rig Allocation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Official Institutional Software License for Practice</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Verified Portfolio Capstone Project with QR Credential</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. COURSERA-STYLE QUICK JUMP STICKY NAVIGATION                            */}
          {/* ========================================================================= */}
          <div className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0] shadow-xs px-5 sm:px-8 lg:px-12 py-2 flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Overview' },
              { id: 'outcomes', label: "What You'll Learn" },
              { id: 'tools', label: 'Tools We Use' },
              { id: 'curriculum', label: `Roadmap & Syllabus (${modulesList.length} Units)` },
              { id: 'capstone', label: 'Capstone Project' },
              { id: 'jobs', label: 'Jobs & Placements' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveSection(tab.id as any);
                  const el = document.getElementById(`section-${tab.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`py-2 px-3.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === tab.id
                    ? 'bg-[#15304C] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ========================================================================= */}
          {/* MAIN CONTENT CONTAINER                                                    */}
          {/* ========================================================================= */}
          <div className="w-full max-w-[1520px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10 space-y-12">
            
            {/* --------------------------------------------------------------------- */}
            {/* SECTION 1: WHAT YOU WILL LEARN (Coursera 6-Box Matrix)               */}
            {/* --------------------------------------------------------------------- */}
            <section id="section-outcomes" className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[11px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  LEARNING OUTCOMES &amp; COMPETENCIES
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  What You Will Learn In This Program
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Master end-to-end industrial workflows directly aligned with MNC engineering requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningOutcomes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs border border-emerald-200">
                        ✓
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* --------------------------------------------------------------------- */}
            {/* SECTION 2: TOOLS WE USE / AUTHORIZED TOOLCHAIN (MNC Visual Cards)     */}
            {/* --------------------------------------------------------------------- */}
            <section id="section-tools" className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[11px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  AUTHORIZED SOFTWARE ECOSYSTEM
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Industry Tools &amp; Software You Will Master
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Train on the exact commercial CAD/CAE/BIM software stacks used in Fortune 500 manufacturing &amp; EPC firms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {toolsList.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="w-8 h-8 rounded-lg bg-[#15304C] text-white flex items-center justify-center text-xs font-black shadow-xs">
                          {tool.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          ENTERPRISE 2026
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#D20A0B] transition-colors">
                        {tool}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Industry-certified drafting, parametric modeling, and tolerance validation module.
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-bold">
                      <span>✓ Official Student License</span>
                      <span className="text-slate-400 font-normal">Lab + Laptop</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --------------------------------------------------------------------- */}
            {/* SECTION 3: COMPREHENSIVE ROADMAP & MODULES SYLLABUS (Coursera Style)  */}
            {/* --------------------------------------------------------------------- */}
            <section id="section-curriculum" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-3 gap-2">
                <div>
                  <span className="text-[11px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    CURRICULUM BREAKDOWN &amp; ROADMAP
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                    Interactive Learning Roadmap ({modulesList.length} Units &bull; {totalHours} Hours)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Step-by-step modular engineering progression from core principles to production delivery.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={expandAllModules}
                    className="text-xs font-bold text-[#15304C] hover:text-[#D20A0B] px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllModules}
                    className="text-xs font-bold text-[#15304C] hover:text-[#D20A0B] px-3 py-1 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Modules Accordion List */}
              <div className="space-y-3.5">
                {modulesList.map((mod, idx) => {
                  const isExpanded = expandedModules[mod.number] ?? false;

                  return (
                    <div
                      key={mod.number}
                      className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300"
                    >
                      {/* Module Header Bar */}
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.number)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/70 transition-colors gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="w-9 h-9 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] text-[#D20A0B] font-black text-xs flex items-center justify-center flex-shrink-0">
                            {mod.number}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-extrabold text-[#D20A0B] uppercase tracking-wider block">
                              STAGE 0{idx + 1} &bull; WEEK {(idx * 2) + 1}–{(idx * 2) + 2}
                            </span>
                            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                              {mod.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 hidden sm:inline-block">
                            {mod.hours} Lab Hours
                          </span>
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                            {isExpanded ? '−' : '+'}
                          </span>
                        </div>
                      </button>

                      {/* Expandable Module Topics & Lab Deliverable */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 bg-slate-50/40 animate-fadeIn">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                              Core Engineering Topics Covered:
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {mod.topics.map((topic: string, tIdx: number) => (
                                <div
                                  key={tIdx}
                                  className="flex items-start gap-2.5 p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-700 shadow-2xs"
                                >
                                  <span className="text-[#D20A0B] font-black text-sm leading-none mt-0.5">•</span>
                                  <span className="leading-relaxed font-medium">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Practical Hands-on Lab Badge */}
                          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 font-medium">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-blue-700 uppercase text-[11px] bg-blue-100 px-2 py-0.5 rounded">
                                HANDS-ON LAB
                              </span>
                              <span>Real-Scale Drawing Blueprint Modeling &amp; Verification Assignment</span>
                            </div>
                            <span className="text-blue-700 font-bold hidden sm:inline">Mentor Validated ✓</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* --------------------------------------------------------------------- */}
            {/* SECTION 4: CAPSTONE PROJECT BLUEPRINT (Portfolio Asset)               */}
            {/* --------------------------------------------------------------------- */}
            <section id="section-capstone" className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[11px] font-black text-[#00873D] uppercase tracking-wider block">
                  MANDATORY PORTFOLIO CAPSTONE
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Industry Capstone Project Blueprint
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Deliver an industrial-grade portfolio project evaluated directly by corporate engineering panels.
                </p>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase border border-emerald-200 mb-2">
                    VERIFIED CLIENT CAPSTONE
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900">
                    {capstoneData.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-4xl">
                    {capstoneData.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-3">
                    Mandatory Verified Deliverables (Direct Portfolio Assets):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {capstoneData.deliverables.map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-center gap-2.5 shadow-2xs font-bold"
                      >
                        <span className="w-6 h-6 rounded-lg bg-[#D20A0B] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                          0{idx + 1}
                        </span>
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-black text-base">🛡</span>
                    <span>
                      <strong>Credential Accreditation:</strong> Verified RND CADD Master Diploma with online QR Verification ID and Autodesk/Dassault Authorization.
                    </span>
                  </div>
                  <span className="text-[#00873D] font-extrabold uppercase bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 whitespace-nowrap">
                    [MNC VERIFIED]
                  </span>
                </div>
              </div>
            </section>

            {/* --------------------------------------------------------------------- */}
            {/* SECTION 5: CAREER OPPORTUNITIES & MNC PLACEMENTS (Clarity Matrix)     */}
            {/* --------------------------------------------------------------------- */}
            <section id="section-jobs" className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[11px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  CAREER PATHWAYS &amp; EMPLOYMENT
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  MNC Job Roles &amp; Placement Guarantee
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Target high-growth corporate roles in top engineering, automotive, civil, and EPC multinationals.
                </p>
              </div>

              {/* Roles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {careerList.map((role: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ● HIRING ACTIVE
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">BATCH 2026</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-2">
                        {role}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Responsible for 3D engineering models, drafting approvals, and client design reviews.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Starting CTC:</span>
                      <span className="font-extrabold text-slate-900">₹4.5L – ₹9.2L PA</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Top Recruiting MNCs Banner */}
              <div className="bg-[#15304C] text-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-[#EE2C3C] uppercase tracking-wider block">
                      CAMPUS RECRUITMENT NETWORK
                    </span>
                    <h3 className="text-lg sm:text-xl font-black">
                      Top Conglomerates Hiring From This Course
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 w-fit">
                    Direct Ameerpet Placement Cell
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {hiringPartners.map((partner, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-white shadow-xs"
                    >
                      {partner}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/10 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
                  <span>✓ 3 Rounds of Mock Technical CAD Interviews</span>
                  <span>✓ 1:1 Resume &amp; LinkedIn Optimization</span>
                  <span>✓ Direct Interview Scheduling Upon Capstone Submission</span>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Modal Bottom Footer with Fast Enrollment CTA */}
        <div className="bg-[#FFFFFF] border-t-2 border-[#E2E8F0] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0 z-20 shadow-lg">
          <div className="text-xs text-slate-600 space-y-0.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-slate-900 font-black uppercase text-xs">Total Program Fee:</span>
              <span className="text-[#D20A0B] font-black text-lg sm:text-xl">₹{feeAmount.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Zero Reservation Fee
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Training Schedule: Weekday (Morning / Evening) &bull; Weekend Fast-Track &bull; 1:1 Dedicated RTX GPU Workstation Lab
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-6 py-3 bg-[#FFFFFF] border-2 border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase transition-colors shadow-xs rounded-xl cursor-pointer"
            >
              Back to Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="w-1/2 sm:w-auto px-8 py-3 bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-red-500/30 rounded-xl cursor-pointer"
            >
              Confirm Batch Enrollment &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
