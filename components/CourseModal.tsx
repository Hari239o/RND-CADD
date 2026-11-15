'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({ '01': true, '02': true });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultBatch, setConsultBatch] = useState('Weekday Morning (08:00 AM)');
  const [isConsultSubmitted, setIsConsultSubmitted] = useState(false);

  if (!course) return null;

  // Safe Fallback Normalizations to guarantee rich rendering matching Admin Dashboard
  const toolsList: string[] = typeof (course as any).software === 'string' && (course as any).software.trim()
    ? (course as any).software.split(',').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(course.tools) && course.tools.length > 0
    ? course.tools
    : ['AutoCAD 2026', 'Industry CAD Workstation', 'Parametric 3D Suite'];

  const rawModules = Array.isArray(course.modules) && course.modules.length > 0
    ? course.modules
    : Array.isArray((course as any).syllabus) && (course as any).syllabus.length > 0
    ? (course as any).syllabus.map((s: string, idx: number) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: s,
        hours: 20,
        topics: [
          `${s} - Industry specifications & ISO/ASME drawing standards`,
          'Parametric modeling, constraint validation & geometric relations',
          'Practical lab exercises with live 1:1 mentor assistance',
          'Production drawing sheets generation & automated BOM'
        ],
      }))
    : [
        {
          number: '01',
          title: 'Introduction to CAD & Software User Interface',
          hours: 20,
          topics: [
            'User Interface navigation, workspace templates & engineering drafting standards',
            '2D parametric geometric constraints, relations & dimensional formulas',
            'Feature tree hierarchy, coordinate datum systems & reference planes',
            'Drafting sheet layout, view projections & section views setup'
          ],
        },
        {
          number: '02',
          title: '2D Sketching, Relations & Dimensional Constraints',
          hours: 25,
          topics: [
            'Line, Circle, Arc, Spline, Ellipse, Polygon & Slot geometry creation',
            'Horizontal, Vertical, Collinear, Coradial, Tangent, Concentric relations',
            'Smart Dimensioning, baseline dimensions, ordinate dimensions & autotrace',
            'Sketch tools: Mirror, Offset, Trim, Extend, Pattern & Dynamic Mirror'
          ],
        },
        {
          number: '03',
          title: '3D Part Modeling, Features & Advanced Surfacing',
          hours: 30,
          topics: [
            'Extruded Boss/Base, Revolved Boss/Base, Swept Boss/Base & Lofted Features',
            'Extruded Cut, Hole Wizard (Counterbore, Countersink, Tapped) & Thread Tool',
            'Fillet, Chamfer, Shell, Rib, Dome, Flex, Wrap & Deform features',
            'Reference Geometry: Planes, Axes, Coordinate Systems, Points & Mate References'
          ],
        },
        {
          number: '04',
          title: 'Assembly Design, Kinematic Mates & Interference Checks',
          hours: 30,
          topics: [
            'Bottom-Up and Top-Down assembly architecture & sub-assembly creation',
            'Standard Mates: Coincident, Concentric, Distance, Angle, Parallel, Perpendicular',
            'Advanced & Mechanical Mates: Cam-Follower, Gear, Rack-Pinion, Screw, Width, Path',
            'Collision detection, physical dynamics, clearance audit & exploded views'
          ],
        },
        {
          number: '05',
          title: 'Production Drafting, GD&T & Automated Bill of Materials (BOM)',
          hours: 25,
          topics: [
            'Generating standard 3-view orthographic drawings, section views & detail views',
            'Geometric Dimensioning & Tolerancing (GD&T) conforming to ASME Y14.5M',
            'Automated Bill of Materials (BOM), balloons, cut lists & revision tables',
            'Exporting to DXF, DWG, STEP, IGES, PDF & high-resolution presentation sheets'
          ],
        },
      ];

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
      hours: Number(mod.hours) || 20,
      topics: topics.length > 0 ? topics : defaultTopics,
    };
  });

  const capstoneData = course.capstoneProject && course.capstoneProject.title
    ? {
        title: course.capstoneProject.title,
        description: course.capstoneProject.description || 'Comprehensive real-world industrial modeling, drafting, and validation project evaluated by senior corporate engineering leads.',
        deliverables: Array.isArray(course.capstoneProject.deliverables) && course.capstoneProject.deliverables.length > 0
          ? course.capstoneProject.deliverables
          : typeof (course.capstoneProject as any).deliverables === 'string'
          ? (course.capstoneProject as any).deliverables.split(',').map((s: string) => s.trim()).filter(Boolean)
          : ['Production 2D Drawings (.dwg)', '3D Parametric Master Assembly', 'Automated Bill of Materials (BOM)', 'Engineering Verification Dossier'],
      }
    : {
        title: `${course.title} Comprehensive Industrial Capstone Project`,
        description: 'Complete real-world industrial modeling, drafting, and multi-disciplinary validation project conforming to international engineering standards.',
        deliverables: ['Production 2D Drawings (.dwg)', '3D Parametric Master Assembly', 'Automated Bill of Materials (BOM)', 'Engineering Verification Dossier'],
      };

  const careerList: string[] = Array.isArray(course.careerRoles) && course.careerRoles.length > 0
    ? course.careerRoles
    : typeof (course as any).careerRoles === 'string' && (course as any).careerRoles.trim()
    ? (course as any).careerRoles.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['CAD Design Engineer', 'Product Specialist', 'Senior Design Modeler', 'Project Engineering Associate', 'BIM / CAD Coordinator'];

  const certificationText = course.certification || 'Autodesk & Dassault Systèmes Certificate';
  const prerequisitesText = course.prerequisites || 'Diploma / B.Tech / Working Professional / Engineering Graduate';
  const courseLevel = course.level || 'Professional';
  const totalHours = course.totalHours || (modulesList.reduce((acc: number, m: any) => acc + (m.hours || 0), 0) || 120);
  const streamText = (course.folder || course.stream || 'engineering').toUpperCase();
  const categoryText = course.category || `${streamText} CERTIFIED PROGRAM`;
  const feeAmount = Number(course.fee) || 32000;
  const cleanDuration = (course.duration || '60 Days (120 Hours)').replace(/\s*\(\d+\s*Hours?\)/gi, '').trim();

  // FAQs modeled directly on CADDESK Hyderabad
  const faqs = [
    {
      q: `What is ${course.title} and why is it important for engineers?`,
      a: `${course.title} is an industry-standard engineering program that provides comprehensive training on commercial 3D modeling, parametric assembly, kinematic simulation, and production drafting. Mastering this enables mechanical, civil, and electrical engineers to design real-world industrial components with high precision.`
    },
    {
      q: 'What are the prerequisites to enroll in this course?',
      a: 'This course is open to Diploma holders, B.E / B.Tech students and graduates in Mechanical, Civil, Electrical, Automotive, or Production Engineering, as well as working professionals looking to upgrade their 3D CAD design and simulation skills.'
    },
    {
      q: 'Does RND CADD provide 100% placement assistance in Hyderabad?',
      a: 'Yes. Our dedicated Ameerpet placement cell arranges 3 rounds of technical mock interviews, resume and portfolio optimization, and schedules direct campus interviews with top multinationals like Tata Technologies, L&T, Schneider Electric, Cyient, and MEIL.'
    },
    {
      q: 'Are both classroom and online training modes available with 1:1 workstation practice?',
      a: 'Yes. Classroom students train at our state-of-the-art Ameerpet campus with 1:1 unshared high-performance RTX GPU computer workstations and 7-day lab access. Online students receive interactive live instructor-led sessions with recorded backups and cloud assistance.'
    },
    {
      q: 'What certification will I receive upon completing the course?',
      a: 'You will receive an industry-recognized Master Diploma Certificate from RND CADD Training Institute along with international authorization certificate credentials from Autodesk / Dassault Systèmes / Bentley with dual certificate benefits.'
    }
  ];

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName || !consultPhone) return;
    setIsConsultSubmitted(true);
    setTimeout(() => {
      setIsConsultSubmitted(false);
      setConsultName('');
      setConsultPhone('');
    }, 4000);
  };

  const toggleModule = (num: string) => {
    setExpandedModules((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const expandAll = () => {
    const all: { [key: string]: boolean } = {};
    modulesList.forEach((m) => { all[m.number] = true; });
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-5 md:p-6 overflow-hidden animate-in fade-in duration-200">
      
      {/* Centered Pleasant Modal Container (Balanced Width, NOT Over-Zoomed) */}
      <div className="w-full max-w-5xl xl:max-w-6xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* ========================================================================= */}
        {/* MODAL TOP HEADER BAR                                                      */}
        {/* ========================================================================= */}
        <div className="px-5 sm:px-7 py-3 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center space-x-3 truncate">
            <img src="/logo.png" alt="RND CADD" className="h-6 sm:h-7 w-auto object-contain flex-shrink-0" />
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div className="truncate">
              <span className="text-[11px] font-extrabold text-[#D20A0B] uppercase tracking-wider block">
                INDUSTRY FOCUSED CAD TRAINING &bull; HYDERABAD
              </span>
              <span className="text-xs font-bold text-slate-800 truncate block">
                {course.title}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-[#D20A0B] flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-slate-200 hover:border-red-200"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL SCROLLABLE BODY (2-COLUMN BALANCED PLEASANT LAYOUT)                  */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          
          {/* Hero Section Banner (Clean, Pleasant, Non-Over-Zoomed) */}
          <div className="bg-[#101E33] text-white px-5 sm:px-8 py-6 sm:py-8 border-b border-slate-800 relative">
            <div className="max-w-4xl space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D20A0B] text-white text-[10px] font-black uppercase tracking-wider">
                  {streamText} DISCIPLINE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  {categoryText}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  ✓ DUAL CERTIFICATION BENEFIT
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {course.title} Training Institute In Hyderabad
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">
                {course.tagline || course.overview}
              </p>

              {/* Key Highlights Metrics (Exact CADDESK Style: 10000+, 97%, 100%) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-base sm:text-lg font-black text-[#EF4444] block">10,000+</span>
                  <span className="text-[10px] text-slate-300 font-medium">Students Trained</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-base sm:text-lg font-black text-emerald-400 block">97%</span>
                  <span className="text-[10px] text-slate-300 font-medium">Practical Lab Training</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-base sm:text-lg font-black text-amber-400 block">100%</span>
                  <span className="text-[10px] text-slate-300 font-medium">Placement Assistance</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <span className="text-base sm:text-lg font-black text-sky-400 block">1:1 RIG</span>
                  <span className="text-[10px] text-slate-300 font-medium">Dedicated RTX Lab</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Content Area */}
          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
            
            {/* ===================================================================== */}
            {/* LEFT COLUMN: 8 Columns (Main Course Details)                          */}
            {/* ===================================================================== */}
            <div className="lg:col-span-8 space-y-7">
              
              {/* 1. About The Course */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    COURSE OVERVIEW &bull; AMEERPET CAMPUS
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Build Your Design Career with Industry-Focused CAD Training
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {course.overview}
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                  <span><strong>Prerequisite:</strong> {prerequisitesText}</span>
                  <span className="text-[#D20A0B] font-bold">Level: {courseLevel}</span>
                </div>
              </div>

              {/* 2. Advantages Of Enrolling In This Course (Exact CADDESK Reference) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    WHY CHOOSE THIS PROGRAM
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Advantages Of {course.title} Course
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[#D20A0B] font-black text-sm block">01</span>
                    <h3 className="text-xs font-bold text-slate-900">Industry-Standard CAD Software</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Train on commercial CAD suites used across Fortune 500 manufacturing, automotive, and AEC firms worldwide.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[#D20A0B] font-black text-sm block">02</span>
                    <h3 className="text-xs font-bold text-slate-900">Intelligent 3D Modeling &amp; Assemblies</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Master parametric solids, complex surfacing, top-down assembly constraints, and dynamic kinematics.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[#D20A0B] font-black text-sm block">03</span>
                    <h3 className="text-xs font-bold text-slate-900">High-Demand Engineering Skill</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Ranked among the top technical competencies required by engineering recruitment panels in Hyderabad.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[#D20A0B] font-black text-sm block">04</span>
                    <h3 className="text-xs font-bold text-slate-900">Industry-Ready Drafting &amp; Workflows</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Generate ASME/ISO production blueprints, automated Bill of Materials (BOM), and client-ready dossiers.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Authorized Tools We Use */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  AUTHORIZED SOFTWARE ECOSYSTEM
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Software &amp; Tools You Will Master
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {toolsList.map((tool, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow-2xs"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#D20A0B]"></span>
                      <span>{tool}</span>
                      <span className="text-[10px] font-normal text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        Official License
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Course Content / Modules Syllabus (Clean Accordions) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                      CURRICULUM SPECIFICATION
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                      Course Content &amp; Modules ({modulesList.length} Units &bull; {totalHours} Hours)
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={expandAll}
                      className="text-[11px] font-bold text-slate-600 hover:text-[#D20A0B] px-2.5 py-1 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Expand All
                    </button>
                    <button
                      type="button"
                      onClick={collapseAll}
                      className="text-[11px] font-bold text-slate-600 hover:text-[#D20A0B] px-2.5 py-1 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {modulesList.map((mod) => {
                    const isExpanded = expandedModules[mod.number] ?? false;

                    return (
                      <div
                        key={mod.number}
                        className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.number)}
                          className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-[#D20A0B] font-black text-xs flex items-center justify-center flex-shrink-0">
                              {mod.number}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {mod.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {mod.hours} Lab Hrs
                            </span>
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                              {isExpanded ? '−' : '+'}
                            </span>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {mod.topics.map((topic: string, tIdx: number) => (
                                <div
                                  key={tIdx}
                                  className="flex items-start gap-2 p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-medium"
                                >
                                  <span className="text-[#D20A0B] font-bold">•</span>
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-[11px] text-emerald-800">
                              <span className="font-bold">✓ Hands-on Practical Lab Blueprint Exercise Included</span>
                              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 px-1.5 py-0.5 rounded">
                                Mentor Checked
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. New Batches & Training Modes (Classroom & Online) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    BATCH TIMINGS &amp; SCHEDULE
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Upcoming New Batches in Ameerpet Hyderabad
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase">Classroom Training</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        1:1 Dedicated Rig
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Conducted at our premier Ameerpet Hyderabad campus with high-end RTX GPU rigs, dual monitors, and in-person senior design mentors.
                    </p>
                    <div className="text-[11px] font-bold text-slate-700 space-y-1 pt-1">
                      <div>&bull; Morning Batch: 08:00 AM &ndash; 10:30 AM</div>
                      <div>&bull; Evening Batch: 06:30 PM &ndash; 09:00 PM</div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase">Live Online Training</span>
                      <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Interactive Live
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Attend live interactive instructor-led classes with screen share, cloud lab software access, and full recorded lecture backups.
                    </p>
                    <div className="text-[11px] font-bold text-slate-700 space-y-1 pt-1">
                      <div>&bull; Weekday Online: 07:00 PM &ndash; 09:00 PM</div>
                      <div>&bull; Weekend Fast-Track: Sat &amp; Sun 10 AM &ndash; 3 PM</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Dual Certificate Benefits */}
              <div className="bg-gradient-to-r from-[#101E33] to-[#182C4A] text-white p-5 sm:p-6 rounded-2xl shadow-sm space-y-3">
                <span className="text-[10px] font-black text-[#EF4444] uppercase tracking-wider block">
                  INTERNATIONAL ACCREDITATION
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Earn Industry-Recognized Certification With Dual Certificate Benefits
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gain industry-recognized certification from RND CADD Training Institute, an authorized training partner, with dual certification benefits for higher placement selection across top multinationals.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-emerald-400">✓</span> RND CADD Master Diploma
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-emerald-400">✓</span> {certificationText}
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <span className="text-emerald-400">✓</span> Online QR Credential ID
                  </span>
                </div>
              </div>

              {/* 7. Capstone Project Blueprint */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    PORTFOLIO BLUEPRINT
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Live Industry Capstone Project
                  </h2>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{capstoneData.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{capstoneData.description}</p>
                </div>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-700 block mb-2">Verified Project Deliverables:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {capstoneData.deliverables.map((item: string, idx: number) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-[#D20A0B] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                          0{idx + 1}
                        </span>
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 8. Career Opportunities After Course in Ameerpet Hyderabad */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    CAREER PATHWAYS &amp; PLACEMENT
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Career Opportunities After {course.title} Course
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    The demand for skilled CAD professionals is rapidly growing across manufacturing, automotive, aerospace, EPC, and infrastructure sectors.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {careerList.map((role, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">{role}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Hiring</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Responsible for 3D modeling, technical drafting, GD&amp;T validation, and client design reviews.
                      </p>
                      <div className="text-[11px] font-bold text-slate-800 pt-1">
                        Salary: ₹4.5L &ndash; ₹9.2L PA
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Conglomerates Hiring Clients */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-700 block uppercase">
                    Top Conglomerates Hiring From Ameerpet Campus:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Tata Technologies', 'Larsen & Toubro', 'Schneider Electric', 'Cyient', 'MEIL', 'Boeing & Airbus Tier-1', 'AtkinsRéalis', 'Jacobs'].map((partner, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200">
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 9. Frequently Asked Questions (Accordion) */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    FREQUENTLY ASKED QUESTIONS
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Got Questions? We Have Answers
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {faqs.map((faq, idx) => {
                    const isOpen = expandedFaq === idx;
                    return (
                      <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isOpen ? null : idx)}
                          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer gap-3"
                        >
                          <span className="text-xs sm:text-sm font-bold text-slate-800">
                            {idx + 1}. {faq.q}
                          </span>
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ===================================================================== */}
            {/* RIGHT COLUMN: 4 Columns (Sticky Snapshot Card & Quick Lead Form)       */}
            {/* ===================================================================== */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-4">
              
              {/* Course Snapshot Card */}
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-md space-y-4">
                
                {/* Course Image Preview */}
                <div className="h-40 w-full rounded-xl overflow-hidden bg-slate-900 relative shadow-inner">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#D20A0B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                    AMEERPET CAMPUS
                  </div>
                </div>

                {/* Pricing & Guarantee */}
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Standard Tuition Fee</span>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-2xl font-black text-[#D20A0B]">
                      ₹{feeAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Zero Reservation Fee
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">All-Inclusive &bull; No Hidden Registration Charges</span>
                </div>

                {/* Quick Specs Matrix */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-extrabold text-slate-900">{cleanDuration}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Total Lab Hours:</span>
                    <span className="font-extrabold text-slate-900">{totalHours} Hours (1:1 Rig)</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Training Modes:</span>
                    <span className="font-extrabold text-slate-900">Classroom &amp; Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Certification:</span>
                    <span className="font-bold text-emerald-700 text-right truncate max-w-[160px]" title={certificationText}>
                      Dual Authorized
                    </span>
                  </div>
                </div>

                {/* Primary Enrollment CTA Button */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEnroll(course.title);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ENROLL IN THIS COURSE NOW</span>
                  <span>&rarr;</span>
                </button>
              </div>

              {/* Get A Free Consultation Lead Card (Exact CADDESK Style) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div>
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    FREE CAREER CONSULTATION
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    Book A Free Demo Class
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Talk directly to our senior CAD mentor and reserve a free live demonstration class.
                  </p>
                </div>

                {isConsultSubmitted ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                    <span className="text-xs font-black text-emerald-800 block">✓ Consultation Reserved!</span>
                    <span className="text-[11px] text-emerald-700 block">
                      Our Ameerpet coordinator will call you within 15 minutes.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleConsultSubmit} className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={consultName}
                        onChange={(e) => setConsultName(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D20A0B]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp / Phone Number"
                        value={consultPhone}
                        onChange={(e) => setConsultPhone(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D20A0B]"
                      />
                    </div>
                    <div>
                      <select
                        value={consultBatch}
                        onChange={(e) => setConsultBatch(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#D20A0B]"
                      >
                        <option value="Weekday Morning (08:00 AM)">Weekday Morning (08:00 AM)</option>
                        <option value="Weekday Evening (06:30 PM)">Weekday Evening (06:30 PM)</option>
                        <option value="Weekend Fast-Track (10:00 AM)">Weekend Fast-Track (10:00 AM)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Request Free Callback
                    </button>
                  </form>
                )}

                {/* Direct Helpline & Campus Location */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Helpline:</span>
                    <a href="tel:+919849012345" className="font-bold text-[#D20A0B] hover:underline">
                      +91 98490 12345
                    </a>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Campus: Ameerpet, Hyderabad</span>
                    <span>7 AM &ndash; 9:30 PM</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL BOTTOM BAR                                                          */}
        {/* ========================================================================= */}
        <div className="px-5 sm:px-7 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0 z-20">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span className="font-extrabold text-slate-900">Total Program Fee:</span>
            <span className="text-[#D20A0B] font-black text-base">₹{feeAmount.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">&bull; 1:1 RTX GPU Rig &bull; Free Demo Class Included</span>
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="w-1/2 sm:w-auto px-6 py-2 bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white text-xs font-extrabold uppercase rounded-xl transition-all shadow-sm hover:shadow-red-500/20 cursor-pointer"
            >
              Confirm Batch Enrollment &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
