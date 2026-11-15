'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({ '01': true, '02': false });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  
  // Apply Now Consultation form state
  const [applyName, setApplyName] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyBatch, setApplyBatch] = useState('Weekday Morning (08:00 AM - 10:30 AM)');
  const [applyMode, setApplyMode] = useState('Classroom (Ameerpet Lab)');
  const [isApplySubmitted, setIsApplySubmitted] = useState(false);

  if (!course) return null;

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
          `Introduction to ${s} & interface navigation`,
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
          hours: 25,
          topics: [
            'Standard PBR material library navigation & categorization',
            'Custom texture maps: Diffuse, Normal, Roughness & Displacement',
            'Glass, water, metal, foliage, emissive & transparent shaders',
            'Weathering, edge softening, moss effects & wear simulation'
          ],
        },
        {
          number: '05',
          title: 'Creating 3D World & Environments',
          hours: 20,
          topics: [
            'Atmospheric lighting: Sun position, Real Skies & HDRI maps',
            'Foliage placement: Paint mode, scatter tools & density control',
            'Populating scenes with animated people, vehicles & urban assets',
            'Landscape lighting, interior fixtures & volumetric point lights'
          ],
        },
        {
          number: '06',
          title: 'Lighting, Animation & Production Rendering',
          hours: 25,
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

  // Capstone Project normalizer
  const capstoneData = course.capstoneProject && course.capstoneProject.title
    ? {
        title: course.capstoneProject.title,
        description: course.capstoneProject.description || 'Comprehensive real-world industrial modeling, drafting, and validation project evaluated by senior corporate engineering leads.',
        deliverables: Array.isArray(course.capstoneProject.deliverables) && course.capstoneProject.deliverables.length > 0
          ? course.capstoneProject.deliverables
          : ['Production 2D Drawings (.dwg)', '3D Parametric Master Assembly', 'Automated Bill of Materials (BOM)', 'Engineering Verification Dossier'],
      }
    : {
        title: `${course.title} Comprehensive Industrial Project`,
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
  const feeAmount = Number(course.fee) || 32000;
  const trainingMode = course.mode || 'Classroom & Dedicated CAD Workstation Lab';

  // CAD DESK Hallmark: Training Highlights 6 items (Exact Image 2)
  const trainingHighlights = [
    {
      title: 'Instructor Led Training',
      icon: (
        <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      )
    },
    {
      title: 'Weekly Doubt clearing Session',
      icon: (
        <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'Lifetime Assistance for Revision',
      icon: (
        <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: 'Lifetime Login Access to Student Dashboard',
      icon: (
        <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'World-Wide Valid Certification',
      icon: (
        <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      title: 'Study Material, Assignments and Projects',
      icon: (
        <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  // Course Highlights items (Exact Image 3)
  const courseHighlights = [
    `Modeling for ${mainTool}`,
    `Learn to create a project in ${mainTool}`,
    'Creating realistic reflections & materials',
    `Introduction to ${mainTool} animation & walkthroughs`,
    'Parametric drafting, constraints & layer architectures',
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

  const scrollToApply = () => {
    const el = document.getElementById('apply-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyPhone.trim()) return;
    setIsApplySubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFFFF] w-screen h-screen flex flex-col overflow-hidden text-slate-800 animate-fadeIn">
      
      {/* 1. TOP STICKY BAR WITH BRANDING & CLOSE */}
      <div className="bg-[#FFFFFF] border-b border-slate-200 px-5 sm:px-10 py-3 flex items-center justify-between flex-shrink-0 z-30 shadow-xs">
        <div className="flex items-center space-x-4 overflow-hidden">
          <img
            src="/logo.png"
            alt="RND CADD"
            className="h-7 w-auto object-contain flex-shrink-0"
          />
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex items-center space-x-2 text-xs truncate">
            <span className="font-extrabold text-[#15304C] uppercase tracking-wider text-xs sm:text-sm">
              CAD DESK TRAINING INSTITUTE &bull; HYDERABAD CAMPUS
            </span>
            <span className="text-slate-300 hidden md:inline">&bull;</span>
            <span className="text-blue-600 font-mono font-bold hidden md:inline">
              CODE: {(course.code || course.id).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Close Button (Red Accent) */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-xs"
          title="Back to Catalog"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 2. FULL SCREEN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Right Floating "Enquiry Now" Vertical Tab (Matches Images 3, 4, 5) */}
        <button
          type="button"
          onClick={scrollToApply}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#D20A0B] hover:bg-[#B50809] text-white text-xs font-black uppercase tracking-wider py-3.5 px-2 rounded-l-lg shadow-xl transition-all cursor-pointer flex items-center justify-center writing-mode-vertical"
          style={{ writingMode: 'vertical-rl' }}
        >
          Enquiry Now
        </button>

        {/* Breadcrumb & Header Hero Banner */}
        <div className="bg-[#15304C] text-white px-5 sm:px-12 lg:px-20 py-8 border-b border-slate-700">
          <div className="max-w-6xl mx-auto space-y-3">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="hover:underline cursor-pointer" onClick={onClose}>Home</span>
              <span>&gt;</span>
              <span className="uppercase text-slate-300 font-bold">{streamText} Courses</span>
              <span>&gt;</span>
              <span className="text-white font-bold truncate">{course.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-0.5 rounded-full bg-[#D20A0B] text-white font-extrabold uppercase text-[10px] tracking-wider">
                {streamText} DISCIPLINE
              </span>
              <span className="px-3 py-0.5 rounded-full bg-white/10 text-slate-200 font-bold uppercase text-[10px]">
                {categoryText}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                ★ ISO 9001:2015 CERTIFIED TRAINING
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-snug">
              {course.title} Course in Hyderabad
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-4xl">
              {course.tagline || course.overview}
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs sm:text-sm text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <span>★</span>
                <span className="text-white font-black text-base">4.9</span>
                <span className="text-slate-400 font-normal">(1,840+ Ratings)</span>
              </div>
              <div>
                Duration: <span className="text-white font-bold">{course.duration || '8-10 Weeks'}</span> ({totalHours} Lab Hours)
              </div>
              <div>
                Mode: <span className="text-white font-bold">{trainingMode}</span>
              </div>
              <div className="text-emerald-400 font-bold">
                ✓ 100% Placement Assistance
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY CONTAINER */}
        <div className="max-w-6xl mx-auto px-5 sm:px-10 py-10 space-y-12">
          
          {/* ========================================================================= */}
          {/* 3. TRAINING HIGHLIGHTS (EXACT MATCH TO USER'S IMAGE 2)                    */}
          {/* ========================================================================= */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#15304C]">
                Training <span className="text-[#FF7700]">Highlights</span>
              </h2>
              <div className="w-16 h-1 bg-[#FF7700] mx-auto mt-2 rounded-full"></div>
            </div>

            <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {trainingHighlights.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-6 flex items-center space-x-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <span className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {trainingHighlights.slice(3, 6).map((item, idx) => (
                  <div key={idx} className="p-6 flex items-center space-x-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <span className="font-extrabold text-sm sm:text-base text-slate-800 leading-snug">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 4. COURSE HIGHLIGHTS BANNER (EXACT MATCH TO USER'S IMAGE 3)               */}
          {/* ========================================================================= */}
          <section className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Left Photo of Students Working in CAD Lab */}
              <div className="lg:col-span-6 relative min-h-[280px] bg-slate-900">
                <img
                  src={course.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-90"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-bold">
                  Ameerpet CAD Workstation Lab
                </div>
              </div>

              {/* Right Checklist Items with Green Checkmarks */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center bg-slate-50/50 space-y-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Course Highlights
                </h2>

                <div className="space-y-3">
                  {courseHighlights.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* ========================================================================= */}
          {/* 5. COURSE OVERVIEW (EXACT MATCH TO USER'S IMAGE 4)                        */}
          {/* ========================================================================= */}
          <section className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-[#15304C]">
              Course Overview
            </h2>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 font-normal">
              <p>
                {mainTool} is an incredible real-time 3D architectural, civil, and mechanical design &amp; visualization tool, widely trusted by architects, engineers, urban planners, and design firms globally. {mainTool} provides an intuitive, high-speed environment that seamlessly transforms raw 2D and 3D CAD models into photorealistic renders, production drawing sheets, and engineering-validated assemblies. CAD DESK&apos;s {course.title} Course in Hyderabad helps students acquire master-level software expertise and comprehensively master every commercial command, tool, and drafting standard.
              </p>
              <p>
                {mainTool} plays a critical role in drafting, modeling, and verifying designs with maximum accuracy. While learning at CAD DESK coaching classes, students also receive 100% Placement Assistance. Throughout the program, students receive complete study materials, e-books, parametric tutorials, family libraries, and real client capstone projects. Furthermore, students receive an official, completely verified certificate that guarantees recognized industry distinction.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-lg sm:text-xl font-black text-[#15304C] mb-2">
                {course.title} in Hyderabad &mdash; Real-Time Industrial Training
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                If you want to turn CAD drawings into production blueprints and photorealistic visualizations, CAD DESK&apos;s {course.title} classes in Ameerpet Hyderabad provide complete hands-on mastery. The training covers 2D drafting, 3D part modeling, assemblies, kinematics, clash resolution, and automated BOM extraction. This industrial training is beginner-friendly and ideal for anyone in mechanical, civil, interior design, or electrical engineering. On completion, you receive an ISO-verified certificate and 100% placement assistance.
              </p>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 6. COURSE CONTENTS & FOR MORE INFO APPLY NOW (EXACT MATCH TO IMAGE 5)     */}
          {/* ========================================================================= */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#15304C]">
              Course Contents
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Units Accordion List (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                {modulesList.map((mod) => {
                  const isExpanded = expandedModules[mod.number] ?? false;

                  return (
                    <div
                      key={mod.number}
                      className="border border-slate-200 rounded-xl bg-white shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(mod.number)}
                        className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-slate-100 text-[#D20A0B] font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {mod.number}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                            {mod.title}
                          </span>
                        </div>
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm flex-shrink-0">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Key Commands, Topics &amp; Practice Exercises:
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

              {/* Right Column: "For More Info Apply Now" Floating Form (5 cols) */}
              <div id="apply-form-section" className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 text-center">
                  For More Info Apply Now
                </h3>

                {isApplySubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                    <span className="text-emerald-700 font-bold text-sm block">✓ Application Received!</span>
                    <p className="text-xs text-emerald-600">
                      Our Ameerpet course counselor will contact you shortly with the syllabus PDF and demo schedule.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
                    <div>
                      <input
                        type="text"
                        required
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        placeholder="Enter Your Name"
                        className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        value={applyPhone}
                        onChange={(e) => setApplyPhone(e.target.value)}
                        placeholder="Enter Mobile number"
                        className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        placeholder="Enter Your Email Address"
                        className="w-full p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={applyBatch}
                        onChange={(e) => setApplyBatch(e.target.value)}
                        className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-[11px] focus:bg-white focus:outline-none"
                      >
                        <option value="Weekday Morning">Morning Batch</option>
                        <option value="Weekday Evening">Evening Batch</option>
                        <option value="Weekend Fast-Track">Weekend Batch</option>
                      </select>

                      <select
                        value={applyMode}
                        onChange={(e) => setApplyMode(e.target.value)}
                        className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-[11px] focus:bg-white focus:outline-none"
                      >
                        <option value="Classroom (Ameerpet Lab)">Classroom Lab</option>
                        <option value="Online Live">Online Live</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[#0070F3] hover:bg-[#0051CC] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      Apply Now
                    </button>

                    <p className="text-[10px] text-slate-400 text-center">
                      Zero Reservation Fee &bull; Free 1:1 Demo Class Included
                    </p>
                  </form>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Helpline:</span>
                  <a href="tel:+919849012345" className="font-extrabold text-[#D20A0B] hover:underline">
                    +91 98490 12345
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* ========================================================================= */}
          {/* 7. MANDATORY CAPSTONE PROJECT BLUEPRINT                                   */}
          {/* ========================================================================= */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                PORTFOLIO REQUIREMENT
              </span>
              <h2 className="text-xl font-black text-slate-900">
                {capstoneData.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {capstoneData.description}
            </p>
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Mandatory Verified Deliverables:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {capstoneData.deliverables.map((item: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#D20A0B] text-white flex items-center justify-center text-[10px]">
                      0{idx + 1}
                    </span>
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 8. CAREER OPPORTUNITIES & HIRING CLIENTS                                  */}
          {/* ========================================================================= */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[10px] font-black text-[#D20A0B] uppercase tracking-wider block">
                PLACEMENT CELL
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Career Opportunities After {course.title} In Hyderabad
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {careerList.map((role: string, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">{role}</span>
                    <span className="text-[11px] text-slate-400">Starting CTC: ₹4.5L &ndash; ₹9.2L PA</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Hiring
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Our Hiring Conglomerates:
              </span>
              <div className="flex flex-wrap gap-2">
                {hiringPartners.map((p, idx) => (
                  <span key={idx} className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ)                                       */}
          {/* ========================================================================= */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="text-xl font-black text-slate-900 mb-3">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-2.5">
              {faqList.map((faq, idx) => {
                const isFaqOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isFaqOpen ? null : idx)}
                      className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="font-mono text-slate-500 font-bold ml-2">
                        {isFaqOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isFaqOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 bg-slate-50/70 border-t border-slate-100 leading-relaxed font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* 10. STICKY BOTTOM ENROLLMENT BAR */}
        <div className="sticky bottom-0 bg-[#FFFFFF] border-t border-slate-200 px-6 sm:px-12 py-3.5 flex items-center justify-between gap-4 z-30 shadow-lg">
          <div className="text-xs sm:text-sm text-slate-600 truncate">
            <span className="font-bold text-slate-900">Total Program Fee: </span>
            <span className="text-[#D20A0B] font-black text-base sm:text-lg">₹{feeAmount.toLocaleString('en-IN')}</span>
            <span className="text-slate-400 hidden sm:inline"> &bull; Zero Reservation Fee &bull; 1:1 Dedicated RTX GPU Workstation</span>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="px-6 py-2.5 bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
            >
              Enroll In This Program &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
