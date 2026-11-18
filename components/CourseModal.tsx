'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';
import { CareerInfographic } from './CareerInfographic';
import { CourseCertificateShowcase } from './CourseCertificateShowcase';
import { ScrollToTopProgress } from './ScrollToTopProgress';
import { EnquiryModal } from './EnquiryModal';
import { CourseHeroBackground, getVerifiedCourseImages, CourseSafeImage } from './CourseMediaBanner';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

// Dynamic software-accurate high-resolution engineering imagery with guaranteed fallbacks
export const getCourseDynamicImage = (c: Course): string => {
  return getVerifiedCourseImages(c).primary;
};

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({ '01': true, '02': false });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  
  // Quick Enquiry Form State
  const [applyName, setApplyName] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyCategory, setApplyCategory] = useState('');
  const [applyCourse, setApplyCourse] = useState('');
  const [applyState, setApplyState] = useState('Telangana');
  const [applyCenter, setApplyCenter] = useState('Ameerpet (Hyderabad Headquarters)');
  const [isApplySubmitting, setIsApplySubmitting] = useState(false);
  const [isApplySubmitted, setIsApplySubmitted] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  if (!course) return null;

  const dynamicImage = getCourseDynamicImage(course);
  const verifiedImages = getVerifiedCourseImages(course);

  // Tools & Software normalizer
  const toolsList: string[] = typeof (course as any).software === 'string' && (course as any).software.trim()
    ? (course as any).software.split(',').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(course.tools) && course.tools.length > 0
    ? course.tools
    : ['AutoCAD 2026', 'Industry CAD Workstation', 'Parametric 3D Suite'];

  const mainTool = toolsList[0] || course.title;

  // Modules normalizer matching CAD DESK Unit breakdown
  const rawModules = Array.isArray(course.modules) && course.modules.length > 0
    ? course.modules
    : Array.isArray((course as any).syllabus) && (course as any).syllabus.length > 0
    ? (course as any).syllabus.map((s: string, idx: number) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: s,
        hours: 20,
        topics: [
          `Introduction to ${s} & industrial interface navigation`,
          'Parametric modeling, constraint validation & geometric relations',
          'Practical drafting lab exercises with live 1:1 mentor assistance',
          'Production drawing sheets generation & automated BOM'
        ],
      }))
    : [
        {
          number: '01',
          title: `Introduction To ${mainTool} 3D`,
          hours: 20,
          topics: [
            `CAD Concepts & ${mainTool} User Interface overview`,
            'Controlling the camera, viewports & navigation hotkeys',
            'Using the Settings window, preferences & drafting units',
            'Modeling fundamentals and coordinate datum systems'
          ],
        },
        {
          number: '02',
          title: `Creating A Project In ${mainTool}`,
          hours: 25,
          topics: [
            'Creating a scene, template selection & presets configuration',
            'Sculpting the terrain, topographical surface contours & heightmaps',
            'Configuring the editor quality & hardware performance',
            'Use of layers, grouping & scene hierarchy management'
          ],
        },
        {
          number: '03',
          title: 'Importing 3D Models & Geometry',
          hours: 25,
          topics: [
            'Importing native CAD files (.dwg, .rvt, .skp, .fbx, .obj, .step)',
            'LiveSync real-time connection with Revit, SketchUp & Rhino',
            'Solving common geometry import issues & normal alignments',
            'Model placement, scaling, orientation & object libraries'
          ],
        },
        {
          number: '04',
          title: 'Applying And Creating Materials',
          hours: 20,
          topics: [
            'Standard PBR material library navigation & categorization',
            'Custom texture maps: Diffuse, Normal, Roughness & Displacement',
            'Glass, water, metal, foliage, emissive & transparent shaders',
            'Weathering, edge softening, moss effects & wear simulation'
          ],
        },
        {
          number: '05',
          title: 'Lighting, Animation & Production Rendering',
          hours: 20,
          topics: [
            'Raytracing, global illumination, shadow softening & depth of field',
            'Camera keyframing, walkthrough paths & orbit animations',
            'Rendering ultra-HD 4K still perspectives & panoramic 360 views',
            'Final video clip compilation, sound effects & presentation export'
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
      title: mod.title || `Unit ${idx + 1} Industrial Applications`,
      hours: Number(mod.hours) || 20,
      topics: topics.length > 0 ? topics : defaultTopics,
    };
  });

  const certificationText = course.certification || 'Autodesk & Dassault Systèmes Certificate';
  const prerequisitesText = course.prerequisites || 'Diploma / B.Tech / Working Professional / Mechanical / Civil / Electrical Graduate';
  const totalHours = course.totalHours || (modulesList.reduce((acc: number, m: any) => acc + (m.hours || 0), 0) || 80);
  const streamText = (course.folder || course.stream || 'engineering').toUpperCase();
  const categoryText = course.category || `${streamText} CERTIFIED PROGRAM`;
  const feeAmount = Number(course.fee) || 32000;
  const trainingMode = course.mode || 'Classroom & Dedicated CAD Workstation Lab';

  // CAD DESK Hallmark: Training Highlights 6 items (Exact CAD DESK Reference)
  const trainingHighlights = [
    {
      title: 'Instructor Led Training',
      desc: 'Expert CAD trainers with 10+ years EPC project experience.',
      icon: (
        <svg className="w-6 h-6 text-[#15304C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      title: 'Weekly Doubt Clearing Session',
      desc: 'One-on-one lab guidance for complex modeling problems.',
      icon: (
        <svg className="w-6 h-6 text-[#15304C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'Lifetime Assistance for Revision',
      desc: 'Repeat any module or tool training anytime at zero cost.',
      icon: (
        <svg className="w-6 h-6 text-[#15304C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: 'Lifetime Login to Student Dashboard',
      desc: '24/7 access to video recordings, project files & e-books.',
      icon: (
        <svg className="w-6 h-6 text-[#15304C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'World-Wide Valid Certification',
      desc: 'Official accredited certificate verifiable online with QR code.',
      icon: (
        <svg className="w-6 h-6 text-[#15304C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: 'Study Material, Assignments & Projects',
      desc: 'Real industrial CAD drawing dossiers & portfolio capstones.',
      icon: (
        <svg className="w-6 h-6 text-[#15304C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  // Course Highlights specific to this exact software
  const courseHighlights = [
    `3D Modeling & Parametric Assembly in ${mainTool}`,
    `Learn to create live industrial projects using ${mainTool}`,
    'Drafting standards, GD&T tolerances & multi-sheet production sets',
    `Dynamic motion simulation, animations & design validation`,
    'Clash detection, interference check & parametric design tables',
    'Automated Bill of Quantities / Materials (BOM) extraction'
  ];

  // Frequently Asked Questions
  const faqList = [
    {
      q: `Is there any prerequisite for the ${course.title} Course in Hyderabad?`,
      a: `No strict prerequisite. ${prerequisitesText}. Anyone from an engineering, diploma, architecture, or design background can join. The training begins from software fundamentals and advances to complex industrial projects.`
    },
    {
      q: 'Will I get practical hands-on computer lab training?',
      a: 'Yes, 100% guaranteed. Every student gets an unshared, high-performance RTX GPU computer rig during both instruction and practice lab hours. Our lab is open 7 days a week from 07:00 AM to 09:30 PM.'
    },
    {
      q: 'How does the placement assistance support work?',
      a: 'Upon submission and evaluation of your Capstone Project, our placement team schedules 3 rounds of technical CAD interviews, polishes your resume, and lines up direct interviews with top EPC and MNC recruiters.'
    },
    {
      q: 'How will I receive my course completion certificate?',
      a: `You will receive a world-wide verifiable certificate accredited with official QR code verification and ${certificationText} authorization, accepted across top engineering enterprises in India and abroad.`
    },
    {
      q: 'Can I access lecture recordings if I miss any class?',
      a: 'Yes, every enrolled student receives lifetime student portal login credentials where recorded classes, practice datasets, family libraries, and PDF manuals are accessible 24/7.'
    }
  ];

  const toggleModule = (num: string) => {
    setExpandedModules((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const scrollToApply = () => {
    const el = document.getElementById('enquiry-form-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyPhone.trim()) return;
    setIsApplySubmitting(true);
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: applyName.trim(),
          phone: applyPhone.trim(),
          courseCategory: applyCategory || categoryText,
          courseTitle: applyCourse || course.title,
          state: applyState,
          center: applyCenter,
        }),
      });
    } catch {}
    setIsApplySubmitting(false);
    setIsApplySubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] w-full h-full flex flex-col overflow-hidden text-[#0F172A] animate-fadeIn">
      
      {/* 1. TOP STICKY BAR: CLEAN BRANDING & CLOSE */}
      <header className="bg-white border-b border-slate-200 py-2.5 sm:py-3.5 px-3.5 sm:px-6 lg:px-10 flex-shrink-0 z-30 shadow-xs">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 sm:space-x-4 overflow-hidden min-w-0">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-7 sm:h-9 w-auto object-contain flex-shrink-0"
            />
            <div className="h-4 sm:h-5 w-px bg-slate-200 flex-shrink-0"></div>
            <div className="flex items-center space-x-2 text-xs truncate">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-xs sm:text-sm truncate">
                RND CADD TRAINING INSTITUTE &bull; AMEERPET
              </span>
              <span className="text-slate-300 hidden md:inline">&bull;</span>
              <span className="text-[#EE2C3C] font-mono font-bold hidden md:inline">
                CODE: {(course.code || course.id).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Close Button (Touch optimized 40x40px min) */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200 flex-shrink-0 active:scale-95"
            title="Back to Catalog"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. FULL SCREEN SCROLLABLE CONTENT */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
        
        {/* 3. HERO BANNER: EXPANDED WIDTH UTILIZING BOTH LEFT AND RIGHT SIDES PROPERLY */}
        <div className="bg-[#15304C] text-white py-10 sm:py-12 border-b border-[#0F2038] relative overflow-hidden">
          {/* Animated Ambient Engineering Background with Discipline Video Loop */}
          <CourseHeroBackground stream={streamText} title={course.title} />

          <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Course Identity, Badges & Highlights */}
              <div className="lg:col-span-8 space-y-4">
                {/* Breadcrumbs */}
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="hover:underline cursor-pointer" onClick={onClose}>Home</span>
                  <span>&gt;</span>
                  <span className="uppercase text-slate-200 font-bold">{streamText} Courses</span>
                  <span>&gt;</span>
                  <span className="text-white font-bold truncate">{course.title}</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-3 py-1 rounded-md bg-[#EE2C3C] text-white font-bold uppercase text-[11px] tracking-wider">
                    {streamText} DISCIPLINE
                  </span>
                  <span className="px-3 py-1 rounded-md bg-white/15 text-white font-bold uppercase text-[11px] border border-white/20">
                    {categoryText}
                  </span>
                  <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold">
                    ★ ISO 9001:2015 CERTIFIED TRAINING
                  </span>
                </div>

                {/* Main Program Title (Pleasant Modern Typography, No Clunky All-Caps) */}
                <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-extrabold text-white tracking-tight leading-snug">
                  {course.title} Course in Hyderabad
                </h1>

                {/* Hero Tagline / Subtitle from Admin Course Management */}
                {course.tagline && (
                  <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed max-w-3xl">
                    {course.tagline}
                  </p>
                )}

                {/* Key Facts Row */}
                <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-slate-200 border-t border-white/15">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <span className="text-base">★</span>
                    <span className="text-white font-black text-base">4.9</span>
                    <span className="text-slate-300 font-normal">(1,840+ Ratings)</span>
                  </div>
                  <div>
                    Duration: <span className="text-white font-bold">{course.duration || '8-10 Weeks'}</span> ({totalHours} Lab Hours)
                  </div>
                  <div>
                    Mode: <span className="text-white font-bold">{trainingMode}</span>
                  </div>
                  <div className="text-emerald-300 font-bold flex items-center gap-1">
                    <span className="text-base">✓</span> 100% Placement Assistance
                  </div>
                </div>
              </div>

              {/* Right Column: Course Image Preview Card with Instant CTA */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-5 text-slate-800 space-y-4">
                  {/* Clean High-Resolution Course Software Preview with Guaranteed Fail-Safe Fallback */}
                  <div className="relative h-52 sm:h-56 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner group">
                    <CourseSafeImage
                      primary={verifiedImages.primary}
                      secondary={verifiedImages.secondary}
                      title={course.title}
                      tag={verifiedImages.tag || mainTool}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute top-3 left-3 bg-[#15304C]/95 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-md shadow-md border border-white/20">
                      {verifiedImages.tag || mainTool}
                    </div>
                  </div>

                  {/* Fee & Batch Info */}
                  <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase block">Standard Tuition Fee</span>
                      <span className="text-2xl font-black text-[#EE2C3C]">₹{feeAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      Zero Reservation Fee
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEnroll(course.title);
                      }}
                      className="w-full py-3.5 bg-[#EE2C3C] hover:bg-[#D20A0B] active:scale-98 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>Enroll In This Program &rarr;</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsEnquiryModalOpen(true)}
                      className="w-full py-3 bg-white hover:bg-red-50 hover:text-[#EE2C3C] text-slate-900 text-xs sm:text-sm font-bold rounded-xl border-2 border-slate-900 hover:border-[#EE2C3C] transition-all cursor-pointer"
                    >
                      Enquire for Free Demo Class &rarr;
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-500 pt-1">
                    ✓ Next Batch Starts Monday &bull; 1:1 RTX GPU Rig Included
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4. MAIN BODY CONTAINER (2-COLUMN BALANCED LAYOUT PROPERLY USING LEFT & RIGHT) */}
        <main className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT COLUMN (8 COLS): Full Detailed Course Walkthrough */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* SECTION 0: COURSE OVERVIEW & OBJECTIVE FROM ADMIN */}
              {course.overview && (
                <motion.section
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <span className="w-2.5 h-6 bg-[#EE2C3C] rounded-full inline-block"></span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-normal">
                      Course Overview &amp; Learning Objectives
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                    {course.overview}
                  </p>
                </motion.section>
              )}

              {/* SECTION A: Key Course Metrics (Open Seamless 4-Pillar Layout, Absolutely No Nested Inner Box Cards) */}
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm"
              >
                <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-6 bg-[#EE2C3C] rounded-full inline-block"></span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-normal">
                      Course Academic Facts &amp; Eligibility
                    </h3>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Admissions Open</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-slate-100">
                  {/* Pillar 1 */}
                  <div className="space-y-2 lg:pr-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                      Eligibility / Prerequisite
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {prerequisitesText}
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="space-y-2 lg:px-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                      Awarded Credential
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {certificationText}
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="space-y-2 lg:px-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                      Training Mode
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {trainingMode}
                    </p>
                  </div>

                  {/* Pillar 4 */}
                  <div className="space-y-2 lg:pl-6">
                    <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                      Software Tools
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {toolsList.join(', ')}
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* SECTION B: TRAINING HIGHLIGHTS (CLEAN 6-BOX GRID, NO CEMENT GREY, FRAMER MOTION HOVER) */}
              <section className="space-y-4">
                <div className="border-b border-slate-200/80 pb-3 flex items-center gap-3">
                  <span className="w-2.5 h-6 bg-[#EE2C3C] rounded-full inline-block"></span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-normal">
                    Training <span className="text-[#EE2C3C]">Highlights</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {trainingHighlights.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-[#EE2C3C] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-[#EE2C3C] border border-red-100/80 flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {item.icon}
                        </div>
                        <h4 className="font-bold text-base text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed pt-1">
                        {item.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* SECTION C: COURSE HIGHLIGHTS (SPLIT BANNER WITH SOFTWARE-ACCURATE IMAGE) */}
              <section className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                  
                  {/* Left: Dynamic Course Image with Fail-Safe Multi-Tier Fallback */}
                  <div className="md:col-span-5 relative min-h-[280px] bg-slate-900 overflow-hidden">
                    <img
                      src={dynamicImage}
                      alt={course.title}
                      onError={(e) => {
                        const verified = getVerifiedCourseImages(course);
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== verified.secondary) {
                          target.src = verified.secondary;
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#15304C]/95 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md">
                      Ameerpet Workstation Lab
                    </div>
                  </div>

                  {/* Right: Checklist Items */}
                  <div className="md:col-span-7 p-7 sm:p-8 flex flex-col justify-center space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-normal">
                      Course Highlights &amp; Core Competencies
                    </h3>

                    <div className="space-y-3 pt-1">
                      {courseHighlights.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                            ✓
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </section>

              {/* SECTION D: INTERACTIVE SYLLABUS & ROADMAP (ACCORDIONS) */}
              <section className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-6 bg-[#EE2C3C] rounded-full inline-block"></span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-normal flex items-center gap-3">
                      Course Contents &amp; Units Breakdown
                      <span className="text-xs font-bold text-[#EE2C3C] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                        {modulesList.length} Units
                      </span>
                    </h2>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        const allOpen: { [k: string]: boolean } = {};
                        modulesList.forEach((m) => { allOpen[m.number] = true; });
                        setExpandedModules(allOpen);
                      }}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 hover:border-[#EE2C3C] hover:text-[#EE2C3C] bg-white font-bold cursor-pointer transition-colors"
                    >
                      Expand All
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedModules({})}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 hover:border-[#EE2C3C] hover:text-[#EE2C3C] bg-white font-bold cursor-pointer transition-colors"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {modulesList.map((mod) => {
                    const isOpen = !!expandedModules[mod.number];
                    return (
                      <div
                        key={mod.number}
                        className={`border rounded-2xl overflow-hidden transition-all ${
                          isOpen ? 'border-[#EE2C3C]/40 shadow-sm' : 'border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.number)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between transition-colors cursor-pointer bg-white"
                        >
                          <div className="flex items-center space-x-3.5 pr-4">
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 transition-colors ${
                              isOpen ? 'bg-[#EE2C3C] text-white' : 'bg-[#15304C] text-white'
                            }`}>
                              {mod.number}
                            </span>
                            <span className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                              {mod.title}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg hidden sm:inline-block">
                              {mod.hours} Lab Hours
                            </span>
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                              isOpen ? 'bg-red-50 text-[#EE2C3C]' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isOpen ? '−' : '+'}
                            </span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 bg-white border-t border-slate-100 space-y-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                              Topics Covered:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 font-medium">
                              {mod.topics.map((topic: string, tIdx: number) => (
                                <li key={tIdx} className="flex items-start space-x-2.5">
                                  <span className="text-[#EE2C3C] font-bold text-base leading-none mt-0.5">&bull;</span>
                                  <span className="leading-snug">{topic}</span>
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

              {/* SECTION E: PLACEMENT CELL & CAREER OPPORTUNITIES INFOGRAPHIC (FAN INFOGRAPHIC MATCHING USER IMAGE 1 & 2) */}
              <CareerInfographic course={course} />

              {/* SECTION F: OFFICIAL CERTIFICATE OF COMPLETION SHOWCASE (MATCHING USER IMAGE 1 EXACTLY) */}
              <CourseCertificateShowcase course={course} />

              {/* SECTION G: DUAL CERTIFICATION & CAPSTONE PROJECT */}
              <section className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-6 bg-[#EE2C3C] rounded-full inline-block"></span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-normal">
                      Dual Certification &amp; Industry Capstone Project
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-[#EE2C3C] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                    Mandatory Portfolio
                  </span>
                </div>

                {/* Real Capstone Project Details from Admin Course Management */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-[#EE2C3C] uppercase tracking-wider">
                      Industry Capstone Project Blueprint
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      Live Industry Deliverable
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {course.capstoneProject?.title || `${course.title} Live Industry Project`}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {course.capstoneProject?.description || 'Real-world industrial drafting, modeling, and validation project with detailed engineering dossier.'}
                  </p>

                  {course.capstoneProject?.deliverables && course.capstoneProject.deliverables.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Verified Deliverables Submitted:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {course.capstoneProject.deliverables.map((del, dIdx) => (
                          <span key={dIdx} className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-800 shadow-2xs">
                            ✓ {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#EE2C3C] uppercase tracking-wider block">
                      1. Course Completion Certificate
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      Certified {course.title} Associate
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Accredited by {certificationText} with lifetime online QR code verification.
                    </p>
                  </div>

                  <div className="space-y-2 sm:border-l sm:border-slate-100 sm:pl-6">
                    <span className="text-xs font-bold text-[#15304C] uppercase tracking-wider block">
                      2. Project Verification Certificate
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      Live Industrial Capstone Project Dossier
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Proof of hands-on model creation, drafting, and tolerance audits verified by senior mentors.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-800">100% Industry Mentor Evaluated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-bold text-slate-800">Instant Online QR Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-bold text-slate-800">ISO 9001:2015 Accredited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-bold text-slate-800">Shareable Digital Portfolio</span>
                  </div>
                </div>
              </section>

              {/* SECTION F: FREQUENTLY ASKED QUESTIONS */}
              <section className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-2.5 h-6 bg-[#EE2C3C] rounded-full inline-block"></span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-normal">
                    Frequently Asked Questions (FAQ)
                  </h2>
                </div>

                <div className="space-y-3">
                  {faqList.map((faq, idx) => {
                    const isFaqOpen = expandedFaq === idx;
                    return (
                      <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isFaqOpen ? null : idx)}
                          className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer bg-white"
                        >
                          <span className="pr-4">{faq.q}</span>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            isFaqOpen ? 'bg-red-50 text-[#EE2C3C]' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isFaqOpen ? '−' : '+'}
                          </span>
                        </button>
                        {isFaqOpen && (
                          <div className="px-5 pb-5 pt-1 text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* RIGHT SIDEBAR (4 COLS): Sticky Admission & Consultation Console */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
              
              {/* Card 1: Fast Enquiry & Free Demo Form */}
              <div id="enquiry-form-card" className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#EE2C3C] bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                    ADMISSIONS OPEN
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    Book A Free Demo Class
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Speak with a senior engineering counselor today.
                  </p>
                </div>

                {isApplySubmitted ? (
                  <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                    <span className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mx-auto">
                      ✓
                    </span>
                    <h4 className="font-bold text-base text-emerald-900">Enquiry Received!</h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      Our counselor from {applyCenter} will call you at {applyPhone} within 15 minutes.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-3 text-sm">
                    <div>
                      <input
                        type="text"
                        required
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-[#EE2C3C] focus:ring-1 focus:ring-[#EE2C3C] focus:outline-none text-slate-800 font-medium text-sm placeholder-slate-400 transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        value={applyPhone}
                        onChange={(e) => setApplyPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-[#EE2C3C] focus:ring-1 focus:ring-[#EE2C3C] focus:outline-none text-slate-800 font-medium text-sm placeholder-slate-400 transition-colors"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={applyCategory || categoryText}
                        onChange={(e) => {
                          setApplyCategory(e.target.value);
                          setApplyCourse('');
                        }}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#EE2C3C] focus:ring-1 focus:ring-[#EE2C3C] focus:outline-none text-slate-700 font-medium text-sm cursor-pointer pr-10 transition-colors"
                      >
                        <option value="">Select Course Category</option>
                        <option value="Civil & BIM Architecture">Civil &amp; BIM Architecture</option>
                        <option value="Mechanical CAD/CAE">Mechanical CAD/CAE</option>
                        <option value="Electrical & Automation">Electrical &amp; Automation</option>
                        <option value="Interior Architecture">Interior Architecture</option>
                        <option value="Piping & Plant CAD">Piping &amp; Plant CAD</option>
                        <option value="Project Management (PPM)">Project Management (PPM)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={applyCourse || course.title}
                        onChange={(e) => setApplyCourse(e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#EE2C3C] focus:ring-1 focus:ring-[#EE2C3C] focus:outline-none text-slate-700 font-medium text-sm cursor-pointer pr-10 transition-colors"
                      >
                        <option value={course.title}>{course.title}</option>
                        <option value="AutoCAD Civil 2D & 3D Planning">AutoCAD Civil 2D &amp; 3D Planning</option>
                        <option value="Revit Architecture & BIM Specialist">Revit Architecture &amp; BIM Specialist</option>
                        <option value="SOLIDWORKS Master Professional">SOLIDWORKS Master Professional</option>
                        <option value="CATIA V5 Aerospace & Automotive Surfacing">CATIA V5 Aerospace &amp; Automotive</option>
                        <option value="ANSYS FEA & CFD Multiphysics Simulation">ANSYS FEA &amp; CFD Multiphysics</option>
                        <option value="STAAD.Pro & ETABS Structural Design">STAAD.Pro &amp; ETABS Structural</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={applyState}
                        onChange={(e) => {
                          const s = e.target.value;
                          setApplyState(s);
                          if (s === 'Telangana') setApplyCenter('Ameerpet (Hyderabad Headquarters)');
                          else if (s === 'Andhra Pradesh') setApplyCenter('Vijayawada (Benz Circle)');
                          else if (s === 'Karnataka') setApplyCenter('Bengaluru (Indiranagar)');
                          else if (s === 'Maharashtra') setApplyCenter('Pune (Shivaji Nagar)');
                          else if (s === 'Tamil Nadu') setApplyCenter('Chennai (Guindy)');
                        }}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#EE2C3C] focus:ring-1 focus:ring-[#EE2C3C] focus:outline-none text-slate-700 font-medium text-sm cursor-pointer pr-10 transition-colors"
                      >
                        <option value="Telangana">Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        value={applyCenter}
                        onChange={(e) => setApplyCenter(e.target.value)}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-[#EE2C3C] focus:ring-1 focus:ring-[#EE2C3C] focus:outline-none text-slate-700 font-medium text-sm cursor-pointer pr-10 transition-colors"
                      >
                        {applyState === 'Telangana' && (
                          <>
                            <option value="Ameerpet (Hyderabad Headquarters)">Ameerpet (Hyderabad Headquarters)</option>
                            <option value="Dilsukhnagar (Hyderabad)">Dilsukhnagar (Hyderabad)</option>
                            <option value="Kukatpally (Hyderabad)">Kukatpally (Hyderabad)</option>
                            <option value="Madhapur / Hitec City (Hyderabad)">Madhapur / Hitec City (Hyderabad)</option>
                            <option value="Secunderabad">Secunderabad</option>
                          </>
                        )}
                        {applyState === 'Andhra Pradesh' && (
                          <>
                            <option value="Vijayawada (Benz Circle)">Vijayawada (Benz Circle)</option>
                            <option value="Visakhapatnam (Dwaraka Nagar)">Visakhapatnam (Dwaraka Nagar)</option>
                            <option value="Guntur (Arundelpet)">Guntur (Arundelpet)</option>
                            <option value="Tirupati (Bhavani Nagar)">Tirupati (Bhavani Nagar)</option>
                          </>
                        )}
                        {applyState === 'Karnataka' && (
                          <>
                            <option value="Bengaluru (Indiranagar)">Bengaluru (Indiranagar)</option>
                            <option value="Bengaluru (BTM Layout)">Bengaluru (BTM Layout)</option>
                            <option value="Bengaluru (Marathahalli)">Bengaluru (Marathahalli)</option>
                          </>
                        )}
                        {applyState === 'Maharashtra' && (
                          <>
                            <option value="Pune (Shivaji Nagar)">Pune (Shivaji Nagar)</option>
                            <option value="Pune (Wakad)">Pune (Wakad)</option>
                            <option value="Mumbai (Thane West)">Mumbai (Thane West)</option>
                          </>
                        )}
                        {applyState === 'Tamil Nadu' && (
                          <>
                            <option value="Chennai (Guindy)">Chennai (Guindy)</option>
                            <option value="Chennai (Anna Nagar)">Chennai (Anna Nagar)</option>
                          </>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isApplySubmitting}
                      className="w-full py-4 bg-[#15304C] hover:bg-[#EE2C3C] active:scale-98 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isApplySubmitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <span>Submit Enquiry &rarr;</span>
                      )}
                    </button>
                  </form>
                )}

                {/* Direct Helpline */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-semibold">Counselor Helpline:</span>
                  <a href="tel:+919849012345" className="font-bold text-[#15304C] hover:text-[#EE2C3C] transition-colors">
                    +91 98490 12345
                  </a>
                </div>
              </div>

              {/* Card 2: Workstation Lab & Batch Status */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3.5 text-sm">
                <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Lab &amp; Workstation Guarantee
                </h4>
                <div className="space-y-2.5 text-slate-700 font-medium">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-emerald-600 font-bold text-base">✓</span>
                    <span>Dedicated NVIDIA RTX GPU Workstation</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-emerald-600 font-bold text-base">✓</span>
                    <span>1:1 Lab Seat &bull; No Computer Sharing</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-emerald-600 font-bold text-base">✓</span>
                    <span>Lab Open 7 Days: 07:00 AM to 09:30 PM</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-emerald-600 font-bold text-base">✓</span>
                    <span>Continuous High-Speed Fiber Internet</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>
        </main>

        {/* 5. STICKY BOTTOM ENROLLMENT BAR */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 py-3.5 z-30 shadow-lg">
          <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-700 truncate">
              <span className="font-bold text-slate-900">Total Tuition Fee: </span>
              <span className="text-[#EE2C3C] font-black text-base sm:text-lg">₹{feeAmount.toLocaleString('en-IN')}</span>
              <span className="text-slate-400 hidden sm:inline"> &bull; Zero Reservation Fee &bull; 1:1 Dedicated RTX GPU Workstation</span>
            </div>

            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Back to Catalog
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnroll(course.title);
                }}
                className="px-5 py-2.5 bg-[#EE2C3C] hover:bg-[#D20A0B] active:scale-98 text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
              >
                Enroll In This Program &rarr;
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic Circular Progress Scroll-To-Top Button elevated above sticky footer */}
      <ScrollToTopProgress
        targetRef={scrollContainerRef}
        threshold={200}
        className="fixed bottom-20 right-6 z-50 transition-all duration-300 animate-in fade-in zoom-in-90"
      />

      {/* Global Interactive Enquiry Modal matching exact user screenshot */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        initialCourseTitle={course.title}
        initialCategory={categoryText}
      />
    </div>
  );
};
