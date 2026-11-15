'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({ '01': true });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'about' | 'advantages' | 'curriculum' | 'batches' | 'certificate' | 'career' | 'faq'>('about');
  
  // Consultation form state
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultBatch, setConsultBatch] = useState('Weekday Morning (08:00 AM - 10:30 AM)');
  const [consultMode, setConsultMode] = useState<'classroom' | 'online'>('classroom');
  const [isConsultSubmitted, setIsConsultSubmitted] = useState(false);

  if (!course) return null;

  // Tools & Software normalizer
  const toolsList: string[] = typeof (course as any).software === 'string' && (course as any).software.trim()
    ? (course as any).software.split(',').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(course.tools) && course.tools.length > 0
    ? course.tools
    : ['AutoCAD 2026', 'Industry CAD Workstation', 'Parametric 3D Suite'];

  // Modules normalizer
  const rawModules = Array.isArray(course.modules) && course.modules.length > 0
    ? course.modules
    : Array.isArray((course as any).syllabus) && (course as any).syllabus.length > 0
    ? (course as any).syllabus.map((s: string, idx: number) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: s,
        hours: 20,
        topics: [
          `${s} - Industry specifications & ISO/ASME standards`,
          'Parametric modeling, geometric constraints & relations',
          'Practical drafting lab exercises with live 1:1 mentor assistance',
          'Production drawing sheets generation & automated BOM'
        ],
      }))
    : [
        {
          number: '01',
          title: 'Introduction to CAD & Software User Interface',
          hours: 20,
          topics: [
            'CAD/CAM/CAE Concepts, coordinate systems & design tree hierarchy',
            'Workspace customization, standard templates & drafting units (mm/inch)',
            '2D parametric geometric relations: Horizontal, Vertical, Tangent, Concentric',
            'Smart Dimensioning, baseline dimensions & fully-constrained sketches'
          ],
        },
        {
          number: '02',
          title: 'Advanced 3D Part Modeling, Features & Surfacing',
          hours: 25,
          topics: [
            'Extruded Boss/Base, Revolved Boss/Base, Swept & Lofted Solid Features',
            'Extruded Cut, Hole Wizard (Counterbore, Countersink, Tapped) & Thread tool',
            'Surface modeling: Splines, boundary curves & curvature continuity (G0, G1, G2)',
            'Direct editing, draft analysis, curvature evaluation & wall thickness verification'
          ],
        },
        {
          number: '03',
          title: 'Assembly Modeling, Kinematics & Motion Simulation',
          hours: 25,
          topics: [
            'Top-down and bottom-up assembly architectures with standard mechanical mates',
            'Smart Fasteners, Toolbox components & hardware library configuration',
            'Dynamic collision detection, physical dynamics & interference analysis',
            'Mechanism motion simulation, exploded view animation & sweep envelopes'
          ],
        },
        {
          number: '04',
          title: 'Production 2D Drawings, GD&T & Bill of Materials (BOM)',
          hours: 20,
          topics: [
            'Standard view projections, section views, detail views & broken-out sections',
            'Geometric Dimensioning & Tolerancing (GD&T) conforming to ASME Y14.5 / ISO 1101',
            'Automated Bill of Quantities / Materials (BOM) extraction with part numbers',
            'Title block customization, revision tables & DWG/DXF/PDF batch plotting'
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

  // Capstone Project normalizer
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
        title: `${course.title} Comprehensive Live Industry Project`,
        description: 'Complete real-world industrial modeling, drafting, and multi-disciplinary validation project conforming to international engineering standards.',
        deliverables: ['Production 2D Drawings (.dwg)', '3D Parametric Master Assembly', 'Automated Bill of Materials (BOM)', 'Engineering Verification Dossier'],
      };

  // Career Roles normalizer
  const careerList: string[] = Array.isArray(course.careerRoles) && course.careerRoles.length > 0
    ? course.careerRoles
    : typeof (course as any).careerRoles === 'string' && (course as any).careerRoles.trim()
    ? (course as any).careerRoles.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['CAD Design Engineer', 'Product Specialist', 'Senior Design Modeler', 'Project Engineering Associate', 'BIM / CAD Coordinator'];

  const certificationText = course.certification || 'Autodesk & Dassault Systèmes Certificate';
  const prerequisitesText = course.prerequisites || 'Diploma / B.Tech / Working Professional / Mechanical / Civil / Electrical Graduate';
  const courseLevel = course.level || 'Professional Diploma';
  const totalHours = course.totalHours || (modulesList.reduce((acc: number, m: any) => acc + (m.hours || 0), 0) || 80);
  const streamText = (course.folder || course.stream || 'engineering').toUpperCase();
  const categoryText = course.category || `${streamText} CERTIFIED PROGRAM`;
  const feeAmount = Number(course.fee) || 32000;
  const trainingMode = course.mode || 'Classroom & Dedicated CAD Workstation Lab';

  // CAD DESK Hyderabad Hallmark: 6 Advantages of the Course
  const courseAdvantages = [
    {
      title: 'Industry-Focused Practical Training',
      desc: '100% practical curriculum designed around live corporate engineering requirements with zero fluff.',
      icon: '📐'
    },
    {
      title: '1:1 Dedicated Computer Workstation',
      desc: 'Every candidate receives an unshared high-performance RTX GPU computer rig during instruction & open lab.',
      icon: '🖥️'
    },
    {
      title: 'Real-Time Live Client Projects',
      desc: 'Work on live industrial projects, mechanical assemblies, architectural drawings, and verified BOMs.',
      icon: '🏗️'
    },
    {
      title: 'Dual Certification Benefits',
      desc: 'Authorized partner certification accredited with global validation and institute Master Diploma.',
      icon: '🎓'
    },
    {
      title: '100% Placement Assistance',
      desc: 'Dedicated Ameerpet placement cell providing 3 mock technical CAD interviews and direct hiring drives.',
      icon: '💼'
    },
    {
      title: 'Lifetime Revision & Portal Access',
      desc: 'Free repeat batch attendances, open lab access, and 24/7 student portal access to all class recordings.',
      icon: '🔄'
    }
  ];

  // CAD DESK Hyderabad Upcoming Batches Table
  const upcomingBatches = [
    { name: 'Weekday Morning Batch', date: 'Upcoming Monday', timing: '08:00 AM – 10:30 AM', mode: 'Classroom (Ameerpet Lab)' },
    { name: 'Weekday Evening Batch', date: 'Upcoming Monday', timing: '06:30 PM – 09:00 PM', mode: 'Classroom (Ameerpet Lab)' },
    { name: 'Weekend Fast-Track Batch', date: 'Upcoming Saturday', timing: '10:00 AM – 03:00 PM', mode: 'Classroom & Online' },
    { name: 'Online Interactive Batch', date: 'Upcoming Tuesday', timing: '07:30 PM – 09:30 PM', mode: 'Live Instructor-Led Online' },
  ];

  // Frequently Asked Questions (CAD DESK Hyderabad Style)
  const faqList = [
    {
      q: `What are the eligibility criteria for this ${course.title} course in Hyderabad?`,
      a: `${prerequisitesText}. Any diploma, B.Tech, or engineering student or working professional looking to upskill in CAD/BIM can join. We begin from user interface fundamentals and advance to complex industry design.`
    },
    {
      q: 'Will I get an unshared computer during practice hours?',
      a: 'Yes, 100% guaranteed 1:1 workstation allocation. You will have your own dedicated computer workstation with official software licenses. Our Ameerpet lab is open 7 days a week from 07:00 AM to 09:30 PM.'
    },
    {
      q: 'How does the Dual Certification benefit my job search?',
      a: `You receive dual certification: An Authorized Partner Certificate (${certificationText}) plus the Institute Master Diploma featuring an online QR verification ID and unique credential serial number accepted worldwide.`
    },
    {
      q: 'How does the Ameerpet placement assistance cell work?',
      a: 'After you complete your Capstone Portfolio Project, our placement team organizes 3 rounds of technical CAD interviews, polishes your resume, and lines up direct interview calls with top corporate hiring partners.'
    },
    {
      q: 'Can I attend a free demo class before paying the fee?',
      a: 'Yes! You can attend a free 1-on-1 counseling and live demo session with our lead engineering instructor. There is zero reservation fee required to attend the demo.'
    }
  ];

  // Top hiring MNC conglomerates
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

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultPhone.trim()) return;
    setIsConsultSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 sm:p-5 overflow-hidden">
      
      {/* CAD DESK Hyderabad Pleasant & Compact Container (max-w-5xl ~1050px - NOT over-zoomed) */}
      <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Top Header Bar */}
        <div className="bg-[#FFFFFF] border-b border-slate-200 px-5 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-6 w-auto object-contain flex-shrink-0"
            />
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-2 text-xs truncate">
              <span className="font-extrabold text-[#15304C] uppercase tracking-wider text-[11px] sm:text-xs">
                CADDESK TRAINING INSTITUTE &bull; AMEERPET HYDERABAD
              </span>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <span className="text-blue-600 font-mono font-bold text-[11px] hidden sm:inline">
                ID: {(course.code || course.id).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 bg-[#F8FAFC]">
          
          {/* Hero Section: Course Title & Floating Consultation Card (CAD DESK Hyderabad Style) */}
          <div className="bg-[#15304C] text-white px-5 sm:px-8 py-6 border-b border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Course Titles & Highlights (7 cols) */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D20A0B] text-white font-extrabold uppercase text-[10px] tracking-wider">
                    {streamText} HYDERABAD
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 font-bold uppercase text-[10px]">
                    {categoryText}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                    ★ AUTODESK &amp; DASSAULT AUTHORIZED
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase leading-snug">
                  {course.title} Training Institute In Hyderabad
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  {course.tagline || 'Build Your Design Career with Industry-Focused CAD Training in Ameerpet Hyderabad'}
                </p>

                {/* Rating & Fast Stats Strip */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 border-t border-white/10">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <span>★</span>
                    <span className="text-white font-black">4.9</span>
                    <span className="text-slate-400 font-normal">(1,840+ Reviews)</span>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-white font-bold">{course.duration || '8-10 Weeks'}</span> ({totalHours} Lab Hours)
                  </div>
                  <div className="text-emerald-400 font-bold">
                    ✓ 100% Placement Assistance
                  </div>
                  <div className="text-slate-300">
                    1:1 RTX GPU Rig Guarantee
                  </div>
                </div>
              </div>

              {/* Right Column: Mini Course Badge & Fee (4 cols) */}
              <div className="md:col-span-4 bg-white text-slate-900 rounded-xl p-4 shadow-xl border border-slate-200 space-y-3">
                <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-900">
                  <img
                    src={course.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-[#D20A0B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                    AMEERPET LAB
                  </div>
                </div>

                <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Standard Tuition Fee</span>
                  <span className="text-xl font-black text-[#D20A0B]">₹{feeAmount.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEnroll(course.title);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Enroll In This Program &rarr;
                </button>
              </div>

            </div>
          </div>

          {/* Sticky Tab Navigation Bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 sm:px-8 py-2 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              {[
                { id: 'about', label: 'About Course' },
                { id: 'advantages', label: 'Advantages (6 Key Highlights)' },
                { id: 'curriculum', label: `Course Content (${modulesList.length} Units)` },
                { id: 'batches', label: 'New Batches' },
                { id: 'certificate', label: 'Dual Certification' },
                { id: 'career', label: 'Career & Jobs' },
                { id: 'consult', label: 'Get Free Consultation' },
                { id: 'faq', label: 'FAQ' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    const el = document.getElementById(`hyd-${tab.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`py-1 px-3 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#15304C] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Body Content */}
          <div className="px-5 sm:px-8 py-6 space-y-6">
            
            {/* 1. ABOUT COURSE */}
            <section id="hyd-about" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  CADDESK AMEERPET OVERVIEW
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  About {course.title} Course
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {course.overview || course.tagline || 'Master end-to-end industrial drafting, modeling, and validation workflows conforming to international engineering standards.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Eligibility / Prerequisite</span>
                  <span className="font-semibold text-slate-800">{prerequisitesText}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Awarded Credential</span>
                  <span className="font-semibold text-slate-800">{certificationText}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-slate-500 block text-[10px] uppercase">Training Mode</span>
                  <span className="font-semibold text-slate-800">{trainingMode}</span>
                </div>
              </div>

              {/* Tools We Use */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Authorized Software Ecosystem Mastered:
                </span>
                <div className="flex flex-wrap gap-2">
                  {toolsList.map((tool, idx) => (
                    <span key={idx} className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. ADVANTAGES OF THE COURSE (CAD DESK Hyderabad Hallmark) */}
            <section id="hyd-advantages" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  KEY HIGHLIGHTS &amp; BENEFITS
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Advantages Of {course.title} Course
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {courseAdvantages.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <h3 className="text-xs font-extrabold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug pl-7">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. COURSE CONTENT (Syllabus Accordions) */}
            <section id="hyd-curriculum" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                    STEP-BY-STEP SYLLABUS
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {course.title} Course Content ({modulesList.length} Units)
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={expandAllModules}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Expand All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={collapseAllModules}
                    className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
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
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-white hover:border-slate-300"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.number)}
                        className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-slate-100 text-[#D20A0B] font-black text-xs flex items-center justify-center flex-shrink-0 border border-slate-200">
                            {mod.number}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {mod.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {mod.hours} Lab Hrs
                          </span>
                          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                            {isExpanded ? '−' : '+'}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-3.5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Topics &amp; Hands-on CAD Blueprint Exercises:
                          </span>
                          <ul className="space-y-1 pl-1">
                            {mod.topics.map((t: string, tIdx: number) => (
                              <li key={tIdx} className="flex items-start gap-2 text-slate-600 leading-snug">
                                <span className="text-[#D20A0B] font-bold text-sm leading-none mt-0.5">&bull;</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. NEW BATCHES (CAD DESK Hyderabad Upcoming Schedule Table) */}
            <section id="hyd-batches" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  CLASSROOM &amp; ONLINE SCHEDULE
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  New Batches Starting Soon in Ameerpet
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-[#15304C] text-white">
                    <tr>
                      <th className="p-2.5 font-bold uppercase text-[10px]">Batch Schedule</th>
                      <th className="p-2.5 font-bold uppercase text-[10px]">Start Date</th>
                      <th className="p-2.5 font-bold uppercase text-[10px]">Timings</th>
                      <th className="p-2.5 font-bold uppercase text-[10px]">Training Mode</th>
                      <th className="p-2.5 font-bold uppercase text-[10px] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {upcomingBatches.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-800">{b.name}</td>
                        <td className="p-2.5 text-slate-600 font-medium">{b.date}</td>
                        <td className="p-2.5 text-slate-800 font-bold">{b.timing}</td>
                        <td className="p-2.5 text-emerald-600 font-bold">{b.mode}</td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onEnroll(course.title);
                            }}
                            className="px-3 py-1 rounded bg-[#D20A0B] hover:bg-[#B50809] text-white font-extrabold text-[10px] uppercase tracking-wider cursor-pointer shadow-xs"
                          >
                            Book Slot
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. DUAL CERTIFICATION BENEFITS (CAD DESK Hyderabad Dual Certificate) */}
            <section id="hyd-certificate" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                  INDUSTRY CREDENTIALS
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Earn Industry-Recognized Certification With Dual Certificate Benefits
                </h2>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-extrabold text-emerald-900 text-sm">Dual Certificate Advantage</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Gain official {certificationText} from CADDESK Hyderabad, an Autodesk &amp; Dassault Authorized Partner, along with an Institute Master Diploma with online QR Verification ID accepted by MNC engineering enterprises worldwide.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-bold text-[11px] text-emerald-800">
                  <span>✓ Online QR Credential ID</span>
                  <span>&bull;</span>
                  <span>✓ Recognized Across India, UAE &amp; Global EPCs</span>
                  <span>&bull;</span>
                  <span>✓ Valid for Technical CAD Interviews</span>
                </div>
              </div>
            </section>

            {/* 6. CAREER OPPORTUNITIES & HIRING CLIENTS */}
            <section id="hyd-career" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  PLACEMENT CELL
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Career Opportunities After {course.title} In CADDESK Ameerpet Hyderabad
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {careerList.map((role: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{role}</span>
                      <span className="text-[10px] text-slate-400">Starting CTC: ₹4.5L &ndash; ₹9.2L PA</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Hiring
                    </span>
                  </div>
                ))}
              </div>

              {/* Our Hiring Clients */}
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Our Hiring Clients (Top Conglomerates):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hiringPartners.map((p, idx) => (
                    <span key={idx} className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 7. GET A FREE CONSULTATION (CAD DESK Hyderabad Consultation Form) */}
            <section id="hyd-consult" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                  DIRECT ADMISSION DESK
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Get A Free Consultation
                </h2>
                <p className="text-xs text-slate-500">
                  Fill the Form &bull; Our Ameerpet Counselor will Contact you within 24 Hours with Syllabus PDF &amp; Demo Slot
                </p>
              </div>

              {isConsultSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                  <span className="text-emerald-700 font-bold text-sm block">✓ Consultation Request Received!</span>
                  <p className="text-xs text-emerald-600">
                    Our lead CAD counselor will connect with you on WhatsApp / Phone shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      placeholder="+91 98490 XXXXX"
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Preferred Batch Timing</label>
                    <select
                      value={consultBatch}
                      onChange={(e) => setConsultBatch(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Weekday Morning (08:00 AM - 10:30 AM)">Weekday Morning (08:00 AM)</option>
                      <option value="Weekday Evening (06:30 PM - 09:00 PM)">Weekday Evening (06:30 PM)</option>
                      <option value="Weekend Fast-Track (Sat & Sun)">Weekend Fast-Track (Sat &amp; Sun)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 uppercase text-[10px] block mb-1">Training Mode</label>
                    <div className="flex gap-4 pt-1.5">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                        <input
                          type="radio"
                          name="mode"
                          checked={consultMode === 'classroom'}
                          onChange={() => setConsultMode('classroom')}
                        />
                        Classroom (Ameerpet Lab)
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                        <input
                          type="radio"
                          name="mode"
                          checked={consultMode === 'online'}
                          onChange={() => setConsultMode('online')}
                        />
                        Online Live
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-lg bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                    >
                      Book Free Demo Class &amp; Request Callback &rarr;
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* 8. FREQUENTLY ASKED QUESTIONS */}
            <section id="hyd-faq" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">
                  STUDENT HELP
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-2">
                {faqList.map((faq, idx) => {
                  const isFaqOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isFaqOpen ? null : idx)}
                        className="w-full p-3 text-left font-bold text-xs text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <span className="font-mono text-slate-500 font-bold ml-2">
                          {isFaqOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isFaqOpen && (
                        <div className="px-3 pb-3 pt-1 text-xs text-slate-600 bg-slate-50/70 border-t border-slate-100 leading-relaxed font-normal">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="bg-[#FFFFFF] border-t border-slate-200 px-5 sm:px-6 py-3 flex items-center justify-between gap-3 flex-shrink-0 z-20">
          <div className="text-xs text-slate-600 truncate">
            <span className="font-extrabold text-slate-900">Total Program Fee: </span>
            <span className="text-[#D20A0B] font-black text-sm sm:text-base">₹{feeAmount.toLocaleString('en-IN')}</span>
            <span className="text-slate-400 hidden sm:inline"> &bull; Zero Reservation Fee &bull; 1:1 Dedicated RTX Workstation Lab</span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="px-5 py-2 bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white text-xs font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Enroll Now &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
