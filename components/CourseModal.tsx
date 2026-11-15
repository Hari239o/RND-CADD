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
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'capstone' | 'career' | 'faq'>('overview');
  
  // Quick Apply / Consultation form state
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('Weekday Morning (08:00 AM - 10:30 AM)');
  const [isApplicationSubmitted, setIsApplicationSubmitted] = useState(false);

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
          title: `${course.title} - Fundamentals & Drawing Standards`,
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
          title: 'Advanced 3D Modeling, Surfacing & Part Assemblies',
          hours: 25,
          topics: [
            'Complex solid feature creation: Sweeps, Lofts, Ribs & Thin Shells',
            'Surface modeling: Splines, boundary curves & curvature continuity (G0, G1, G2)',
            'Top-down and bottom-up assembly architecture with kinematic constraints',
            'Hardware fastener insertion, smart components & interference detection'
          ],
        },
        {
          number: '03',
          title: 'Kinematics, Load Simulation & Clash Resolution',
          hours: 25,
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
          hours: 25,
          topics: [
            'End-to-end live client industrial modeling & drawing generation',
            'Automated Bill of Quantities / Materials (BOM) with supplier part numbers',
            'GD&T Geometric Dimensioning and Tolerancing conforming to ASME Y14.5',
            'Portfolio dossier packaging & mock technical interview defense'
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
  const totalHours = course.totalHours || (modulesList.reduce((acc: number, m: any) => acc + (m.hours || 0), 0) || 90);
  const streamText = (course.folder || course.stream || 'engineering').toUpperCase();
  const categoryText = course.category || `${streamText} CERTIFIED PROGRAM`;
  const feeAmount = Number(course.fee) || 32000;
  const trainingMode = course.mode || 'Classroom & Dedicated CAD Workstation Lab';

  // CAD DESK style 6 Training Highlights
  const trainingHighlights = [
    { title: 'Instructor Led Training', desc: 'Expert corporate faculties with 10+ years engineering experience' },
    { title: 'Weekly Doubt Clearing', desc: '1:1 individual mentor doubt resolution & assignment reviews' },
    { title: 'Lifetime Revision Support', desc: 'Free repeat batch attendances & unlimited practice lab access' },
    { title: 'Student Portal Access', desc: 'Lifetime LMS login for class recordings, notes & software files' },
    { title: 'Worldwide Valid Certificate', desc: 'Accredited certificate recognized across global EPC multinationals' },
    { title: 'Industry Live Projects', desc: 'Mandatory portfolio capstone project with verified BOM sheets' }
  ];

  // Frequently Asked Questions (CAD DESK Style)
  const faqList = [
    {
      q: `What are the prerequisites for this ${course.title} course?`,
      a: `${prerequisitesText}. Basic computer fundamentals and fundamental engineering or diploma background is helpful. Our mentors start from user interface basics to advanced industrial modeling.`
    },
    {
      q: 'Will I get practical hands-on workstation practice during the course?',
      a: 'Yes, every student is guaranteed a 1:1 dedicated high-performance RTX GPU rig during instruction hours and open lab practice. Our lab is open 7 days a week from 07:00 AM to 09:30 PM.'
    },
    {
      q: 'How does the direct placement assistance work?',
      a: 'Upon successful submission and lead faculty evaluation of your Capstone Project Blueprint, the Ameerpet placement cell arranges 3 rounds of technical mock interviews, optimizes your CAD resume, and schedules direct interviews with top EPC and MNC hiring partners.'
    },
    {
      q: 'How will I receive my course completion certificate?',
      a: `You will receive a world-wide verifiable certificate accredited with official QR code verification and ${certificationText} authorization, accepted across top engineering enterprises in India and abroad.`
    },
    {
      q: 'Can I attend missed classes or access lecture recordings?',
      a: 'Yes, all enrolled candidates receive lifetime student portal login credentials where recorded classes, practice datasets, family libraries, and PDF manuals are accessible 24/7.'
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

  const handleApplyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidatePhone.trim()) return;
    setIsApplicationSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070D18]/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 overflow-hidden">
      
      {/* CAD DESK Style Pleasant & Proportioned Container (Max-Width 1180px - NOT over-zoomed) */}
      <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Compact Modal Header Bar */}
        <div className="bg-[#FFFFFF] border-b border-slate-200 px-5 sm:px-7 py-3 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-6 w-auto object-contain flex-shrink-0"
            />
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-2 text-xs truncate">
              <span className="font-extrabold text-[#15304C] uppercase tracking-wider text-[11px] sm:text-xs">
                PROGRAM BLUEPRINT
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-blue-600 font-mono font-bold text-[11px]">
                {(course.code || course.id).toUpperCase()}
              </span>
              <span className="text-slate-300 hidden sm:inline">&bull;</span>
              <span className="text-emerald-600 font-bold hidden sm:inline-flex items-center gap-1 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                ACTIVE BATCH
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
          
          {/* Pleasant Top Hero Banner (CAD DESK Style) */}
          <div className="bg-[#15304C] text-white px-5 sm:px-8 py-6 sm:py-7 border-b border-slate-700">
            <div className="max-w-5xl mx-auto space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D20A0B] text-white font-extrabold uppercase text-[10px] tracking-wider">
                  {streamText}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 font-bold uppercase text-[10px]">
                  {categoryText}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                  ★ ISO 9001:2015 CERTIFIED TRAINING
                </span>
              </div>

              {/* Course Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight uppercase leading-snug">
                {course.title}
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-3xl">
                {course.tagline || course.overview}
              </p>

              {/* Social Proof & Quick Facts Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 border-t border-white/10">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <span>★</span>
                  <span className="text-white font-black">4.9</span>
                  <span className="text-slate-400 font-normal">(1,840+ Ratings)</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-white font-bold">{course.duration || '8-10 Weeks'}</span> ({totalHours} Lab Hours)
                </div>
                <div className="text-slate-300">
                  Mode: <span className="text-white font-bold">{trainingMode}</span>
                </div>
                <div className="text-emerald-400 font-bold">
                  ✓ 100% Placement Record
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tab Anchor Nav */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-5 sm:px-8 py-2 shadow-xs">
            <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
              {[
                { id: 'overview', label: 'Course Overview' },
                { id: 'curriculum', label: `Course Contents (${modulesList.length} Units)` },
                { id: 'tools', label: 'Tools We Use' },
                { id: 'capstone', label: 'Capstone Project' },
                { id: 'career', label: 'Career & Jobs' },
                { id: 'faq', label: 'FAQ' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    const el = document.getElementById(`cd-section-${tab.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`py-1.5 px-3 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
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

          {/* Main 2-Column Content Body (CAD DESK Style) */}
          <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Main Course Syllabus, Highlights, FAQ (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. TRAINING HIGHLIGHTS (CAD DESK Hallmark: 6 Clean Icons Grid) */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
                  <h3 className="text-xs font-black text-[#D20A0B] uppercase tracking-wider mb-3">
                    TRAINING HIGHLIGHTS
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {trainingHighlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          ✓
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. COURSE OVERVIEW */}
                <section id="cd-section-overview" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                      PROGRAM SYNOPSIS
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Course Overview
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {course.overview || course.tagline || 'Master end-to-end industrial drafting, modeling, and validation workflows conforming to international engineering standards.'}
                  </p>
                  
                  {/* Prerequisite & Certification strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Eligibility / Prerequisite</span>
                      <span className="font-semibold text-slate-800">{prerequisitesText}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-500 block text-[10px] uppercase">Awarded Credential</span>
                      <span className="font-semibold text-slate-800">{certificationText}</span>
                    </div>
                  </div>
                </section>

                {/* 3. TOOLS WE USE */}
                <section id="cd-section-tools" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                      SOFTWARE STACK
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Industry Tools &amp; Software You Will Master
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {toolsList.map((tool, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-[#15304C] text-white flex items-center justify-center text-xs font-black">
                            {tool.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{tool}</span>
                            <span className="text-[10px] text-slate-400">Enterprise License &bull; Lab + Laptop</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Included
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 4. COURSE CONTENTS (Syllabus Accordion like CAD DESK) */}
                <section id="cd-section-curriculum" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                        STEP-BY-STEP CURRICULUM
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Course Contents ({modulesList.length} Units)
                      </h3>
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

                  {/* Module List Accordions */}
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
                                Topics &amp; Practical Exercises:
                              </span>
                              <ul className="space-y-1.5 pl-1">
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

                {/* 5. MANDATORY CAPSTONE PROJECT */}
                <section id="cd-section-capstone" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                      PRACTICAL PORTFOLIO
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {capstoneData.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {capstoneData.description}
                  </p>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Verified Portfolio Deliverables:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {capstoneData.deliverables.map((item: string, idx: number) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-[#D20A0B] text-white flex items-center justify-center text-[10px]">
                            0{idx + 1}
                          </span>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* 6. CAREER PATHWAYS & MNC JOBS */}
                <section id="cd-section-career" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                      PLACEMENT OPPORTUNITIES
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Target Job Roles &amp; Hiring Conglomerates
                    </h3>
                  </div>

                  {/* Roles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

                  {/* Hiring Partners */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Top Conglomerates Hiring From This Course:
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

                {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ Accordions) */}
                <section id="cd-section-faq" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">
                      NEED HELP?
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Frequently Asked Questions (FAQ)
                    </h3>
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

              {/* RIGHT SIDEBAR: Sticky Course Info & Consultation Form (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Course Card Box */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  {/* Image */}
                  <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                    <img
                      src={course.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-[#D20A0B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                      Ameerpet Lab
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Standard Program Fee</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-[#D20A0B]">
                        ₹{feeAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">All Inclusive</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                      ✓ Zero Reservation Fee &bull; Free Demo Class
                    </span>
                  </div>

                  {/* Specs Table */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Duration:</span>
                      <span className="font-bold text-slate-800">{course.duration || '10 Weeks'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Lab Hours:</span>
                      <span className="font-bold text-slate-800">{totalHours} Hours (1:1 Rig)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Skill Level:</span>
                      <span className="font-bold text-slate-800">{courseLevel}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Certification:</span>
                      <span className="font-bold text-slate-800 text-right">{certificationText}</span>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEnroll(course.title);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-red-500/20 cursor-pointer"
                  >
                    Enroll In This Program &rarr;
                  </button>
                </div>

                {/* Quick Apply / Counseling Form (CAD DESK "For More Info Apply Now") */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                      QUICK CONSULTATION
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      For More Info Apply Now
                    </h4>
                  </div>

                  {isApplicationSubmitted ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                      <span className="text-emerald-700 font-bold text-xs block">✓ Request Received!</span>
                      <p className="text-[11px] text-emerald-600">
                        Our Ameerpet course counselor will contact you shortly with syllabus PDF &amp; batch schedule.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyForm} className="space-y-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Candidate Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={candidatePhone}
                          onChange={(e) => setCandidatePhone(e.target.value)}
                          placeholder="+91 98490 XXXXX"
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Preferred Batch Timing
                        </label>
                        <select
                          value={selectedBatch}
                          onChange={(e) => setSelectedBatch(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-red-500"
                        >
                          <option value="Weekday Morning (08:00 AM - 10:30 AM)">Weekday Morning (08:00 AM)</option>
                          <option value="Weekday Evening (06:30 PM - 09:00 PM)">Weekday Evening (06:30 PM)</option>
                          <option value="Weekend Fast-Track (Sat & Sun)">Weekend Fast-Track (Sat &amp; Sun)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-3 rounded-lg bg-[#15304C] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Request Free Callback &rarr;
                      </button>
                    </form>
                  )}

                  {/* Helpline */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Inquiry Helpline:</span>
                    <a href="tel:+919849012345" className="font-bold text-[#D20A0B] hover:underline">
                      +91 98490 12345
                    </a>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#FFFFFF] border-t border-slate-200 px-5 sm:px-7 py-3 flex items-center justify-between gap-3 flex-shrink-0 z-20">
          <div className="text-xs text-slate-600 truncate">
            <span className="font-extrabold text-slate-900">Total Program Fee: </span>
            <span className="text-[#D20A0B] font-black text-sm sm:text-base">₹{feeAmount.toLocaleString('en-IN')}</span>
            <span className="text-slate-400 hidden sm:inline"> &bull; Zero Reservation Fee &bull; 1:1 Dedicated RTX Workstation</span>
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
