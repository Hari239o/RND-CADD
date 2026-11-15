'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';
import { CareerInfographic } from './CareerInfographic';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

// Dynamic software-accurate high-resolution engineering imagery
export const getCourseDynamicImage = (c: Course): string => {
  const query = `${c.id || ''} ${c.title || ''} ${c.stream || ''} ${c.folder || ''} ${c.category || ''} ${Array.isArray(c.tools) ? c.tools.join(' ') : ''} ${typeof (c as any).software === 'string' ? (c as any).software : ''}`.toLowerCase();

  // ANSYS / FEA / CFD / Multiphysics simulation
  if (query.includes('ansys') || query.includes('fea') || query.includes('cfd') || query.includes('fluent') || query.includes('simulation') || query.includes('multiphysics')) {
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  }
  // CATIA V5 / Surface modeling / Aerospace / Automotive
  if (query.includes('catia') || query.includes('aerospace') || query.includes('automotive') || query.includes('surfacing')) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80';
  }
  // SOLIDWORKS / Mechanical CAD / Creo / Machine Design
  if (query.includes('solidworks') || query.includes('creo') || query.includes('inventor') || query.includes('cimatron') || query.includes('mechanical')) {
    return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80';
  }
  // STAAD.Pro / ETABS / High-rise Structural Engineering
  if (query.includes('staad') || query.includes('etabs') || query.includes('structural') || query.includes('seismic')) {
    return 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80';
  }
  // REVIT / Architectural BIM / BIM Coordinator / Navisworks
  if (query.includes('revit') || query.includes('bim') || query.includes('navisworks')) {
    return 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80';
  }
  // AUTOCAD CIVIL / 2D Drafting / Survey Planning
  if (query.includes('autocad') || query.includes('civil') || query.includes('drafting')) {
    return 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80';
  }
  // LUMION / 3ds Max / V-Ray / Enscape / Walkthroughs
  if (query.includes('lumion') || query.includes('3ds max') || query.includes('v-ray') || query.includes('vray') || query.includes('enscape')) {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  }
  // SKETCHUP / Interior Architecture / Joinery
  if (query.includes('sketchup') || query.includes('interior') || query.includes('joinery') || query.includes('modular')) {
    return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
  }
  // ELECTRICAL / EPLAN / Industrial Automation / PLC
  if (query.includes('eplan') || query.includes('electrical') || query.includes('automation') || query.includes('plc') || query.includes('scada')) {
    return 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80';
  }
  // ETAP / Power Systems / Substation Distribution
  if (query.includes('etap') || query.includes('power system') || query.includes('substation') || query.includes('grid')) {
    return 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80';
  }
  // MATLAB / Simulink
  if (query.includes('matlab') || query.includes('simulink')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
  }
  // PIPING / SP3D / Plant CAD / Caesar II
  if (query.includes('piping') || query.includes('sp3d') || query.includes('plant') || query.includes('caesar') || query.includes('pipeline')) {
    return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80';
  }
  // PRIMAVERA P6 / PPM / Project Management
  if (query.includes('primavera') || query.includes('ppm') || query.includes('project management') || query.includes('schedule')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80';
  }

  // Fallback to custom course image if valid and not the generic electrical breadboard
  if (c.image && !c.image.includes('1581092160607')) {
    return c.image;
  }

  return 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80';
};

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({ '01': true, '02': false });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  
  // Quick Enquiry Form State
  const [applyName, setApplyName] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyBatch, setApplyBatch] = useState('Weekday Morning (08:00 AM - 10:30 AM)');
  const [isApplySubmitted, setIsApplySubmitted] = useState(false);

  if (!course) return null;

  const dynamicImage = getCourseDynamicImage(course);

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

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyPhone.trim()) return;
    setIsApplySubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] w-screen h-screen flex flex-col overflow-hidden text-[#0F172A] animate-fadeIn">
      
      {/* 1. TOP STICKY BAR: CLEAN BRANDING & CLOSE */}
      <header className="bg-white border-b border-[#CBD5E1] py-3 px-4 sm:px-6 lg:px-8 flex-shrink-0 z-30 shadow-xs">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 overflow-hidden">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-8 sm:h-9 w-auto object-contain flex-shrink-0"
            />
            <div className="h-5 w-px bg-[#CBD5E1]"></div>
            <div className="flex items-center space-x-2 text-xs truncate">
              <span className="font-extrabold text-[#15304C] uppercase tracking-wider text-xs sm:text-sm">
                CAD DESK TRAINING INSTITUTE &bull; AMEERPET HYDERABAD
              </span>
              <span className="text-slate-300 hidden md:inline">&bull;</span>
              <span className="text-[#D20A0B] font-mono font-bold hidden md:inline">
                CODE: {(course.code || course.id).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200"
            title="Back to Catalog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. FULL SCREEN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
        
        {/* Right Floating "Enquiry Now" Vertical Tab */}
        <button
          type="button"
          onClick={scrollToApply}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#D20A0B] hover:bg-[#B50809] text-white text-xs font-black uppercase tracking-wider py-3.5 px-2.5 rounded-l-md shadow-xl transition-all cursor-pointer flex items-center justify-center"
          style={{ writingMode: 'vertical-rl' }}
        >
          Enquiry Now
        </button>

        {/* 3. HERO BANNER: 2-COLUMN SPLIT UTILIZING BOTH LEFT AND RIGHT SIDES */}
        <div className="bg-[#15304C] text-white py-10 sm:py-12 border-b border-[#0F2038]">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
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
                  <span className="px-3 py-1 rounded-md bg-[#D20A0B] text-white font-extrabold uppercase text-[11px] tracking-wider">
                    {streamText} DISCIPLINE
                  </span>
                  <span className="px-3 py-1 rounded-md bg-white/15 text-white font-bold uppercase text-[11px] border border-white/20">
                    {categoryText}
                  </span>
                  <span className="px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-bold">
                    ★ ISO 9001:2015 CERTIFIED TRAINING
                  </span>
                </div>

                {/* Main Program Title */}
                <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight uppercase leading-tight">
                  {course.title} Course in Hyderabad
                </h1>

                {/* Tagline / Subtitle */}
                <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-3xl">
                  {course.tagline || course.overview}
                </p>

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
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-5 text-slate-800 space-y-4">
                  {/* Dynamic High-Res Course Image */}
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={dynamicImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#15304C]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded">
                      {mainTool}
                    </div>
                  </div>

                  {/* Fee & Batch Info */}
                  <div className="flex items-baseline justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase block">Standard Tuition Fee</span>
                      <span className="text-2xl font-black text-[#D20A0B]">₹{feeAmount.toLocaleString('en-IN')}</span>
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
                      className="w-full py-3 bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>Enroll In This Program &rarr;</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={scrollToApply}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors cursor-pointer"
                    >
                      Enquire for Free Demo Class &darr;
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

        {/* 4. MAIN BODY CONTAINER (2-COLUMN BALANCED LAYOUT) */}
        <main className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN (8 COLS): Full Detailed Course Walkthrough */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* SECTION A: Key Course Metrics Grid */}
              <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-[#15304C] uppercase tracking-wide">
                  Course Academic Facts &amp; Eligibility
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Eligibility / Prerequisite</span>
                    <span className="font-semibold text-slate-800">{prerequisitesText}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Awarded Credential</span>
                    <span className="font-semibold text-slate-800">{certificationText}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Training Mode</span>
                    <span className="font-semibold text-slate-800">{trainingMode}</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Authorized Software Tools</span>
                    <span className="font-semibold text-slate-800">{toolsList.join(', ')}</span>
                  </div>
                </div>
              </section>

              {/* SECTION B: TRAINING HIGHLIGHTS (EXACT CAD DESK 6-BOX GRID) */}
              <section className="space-y-4">
                <div className="border-b border-[#CBD5E1] pb-3">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#15304C]">
                    Training <span className="text-[#D20A0B]">Highlights</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Industry benchmark technical training standards guaranteed for every enrolled student.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trainingHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-[#CBD5E1] rounded-xl p-5 hover:border-[#D20A0B] hover:shadow-md transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                        <h4 className="font-bold text-sm text-[#15304C] leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION C: COURSE HIGHLIGHTS (SPLIT BANNER WITH SOFTWARE-ACCURATE IMAGE) */}
              <section className="bg-white border border-[#CBD5E1] rounded-2xl overflow-hidden shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                  
                  {/* Left: Dynamic Course Image */}
                  <div className="md:col-span-5 relative min-h-[260px] bg-slate-100">
                    <img
                      src={dynamicImage}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#15304C]/90 text-white px-2.5 py-1 rounded text-[11px] font-bold">
                      Ameerpet Workstation Lab
                    </div>
                  </div>

                  {/* Right: Checklist Items */}
                  <div className="md:col-span-7 p-6 flex flex-col justify-center space-y-3">
                    <h3 className="text-xl font-black text-[#15304C]">
                      Course Highlights &amp; Core Competencies
                    </h3>

                    <div className="space-y-2.5 pt-1">
                      {courseHighlights.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                            ✓
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </section>

              {/* SECTION D: INTERACTIVE SYLLABUS & ROADMAP (ACCORDIONS) */}
              <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#15304C]">
                      Course Contents &amp; Units Breakdown
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {modulesList.length} Units &bull; {totalHours} Practical Workstation Hours
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        const allOpen: { [k: string]: boolean } = {};
                        modulesList.forEach((m) => { allOpen[m.number] = true; });
                        setExpandedModules(allOpen);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                    >
                      Expand All
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedModules({})}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer"
                    >
                      Collapse All
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {modulesList.map((mod) => {
                    const isOpen = !!expandedModules[mod.number];
                    return (
                      <div
                        key={mod.number}
                        className="border border-[#CBD5E1] rounded-xl overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleModule(mod.number)}
                          className={`w-full p-4 text-left flex items-center justify-between transition-colors cursor-pointer ${
                            isOpen ? 'bg-slate-50 border-b border-slate-200' : 'bg-white hover:bg-slate-50/70'
                          }`}
                        >
                          <div className="flex items-center space-x-3 pr-4">
                            <span className="w-8 h-8 rounded-lg bg-[#15304C] text-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                              {mod.number}
                            </span>
                            <span className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                              {mod.title}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 flex-shrink-0">
                            <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md hidden sm:inline-block">
                              {mod.hours} Lab Hours
                            </span>
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {isOpen ? '−' : '+'}
                            </span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="p-4 bg-white space-y-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                              Topics Covered:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                              {mod.topics.map((topic: string, tIdx: number) => (
                                <li key={tIdx} className="flex items-start space-x-2">
                                  <span className="text-[#D20A0B] font-bold text-sm leading-none mt-0.5">&bull;</span>
                                  <span>{topic}</span>
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

              {/* SECTION F: DUAL CERTIFICATION & CAPSTONE PROJECT */}
              <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-xl sm:text-2xl font-black text-[#15304C]">
                    Dual Certification &amp; Industry Capstone
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Graduates receive accredited certificates accepted worldwide across EPC contractors.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-xs font-black text-[#D20A0B] uppercase tracking-wider">
                      1. Course Completion Certificate
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Certified {course.title} Associate
                    </h4>
                    <p className="text-xs text-slate-600">
                      Accredited by {certificationText} with online QR verification.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <span className="text-xs font-black text-[#15304C] uppercase tracking-wider">
                      2. Project Verification Certificate
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Live Industrial Capstone Project Dossier
                    </h4>
                    <p className="text-xs text-slate-600">
                      Proof of hands-on model creation and drawings verified by Ameerpet senior mentors.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Placement Drives with Top Recruiters:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {hiringPartners.map((p, idx) => (
                      <span key={idx} className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION F: FREQUENTLY ASKED QUESTIONS */}
              <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 sm:p-7 shadow-xs space-y-3">
                <h2 className="text-xl font-black text-[#15304C] mb-3">
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
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-600 bg-slate-50/70 border-t border-slate-100 leading-relaxed">
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
              <div id="enquiry-form-card" className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-md space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D20A0B] bg-red-50 px-2 py-0.5 rounded">
                    ADMISSIONS OPEN
                  </span>
                  <h3 className="text-lg font-black text-[#15304C] mt-1.5">
                    Book A Free Demo Class
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Speak with a senior engineering counselor today.
                  </p>
                </div>

                {isApplySubmitted ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <span className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base mx-auto">
                      ✓
                    </span>
                    <h4 className="font-bold text-sm text-emerald-900">Enquiry Submitted!</h4>
                    <p className="text-xs text-emerald-700">
                      Our Ameerpet counselor will call you within 30 minutes with batch timings.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#D20A0B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile Number (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        value={applyPhone}
                        onChange={(e) => setApplyPhone(e.target.value)}
                        placeholder="e.g. 98490 12345"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#D20A0B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#D20A0B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Preferred Batch Timing</label>
                      <select
                        value={applyBatch}
                        onChange={(e) => setApplyBatch(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#D20A0B] focus:outline-none font-semibold text-slate-700"
                      >
                        <option>Weekday Morning (08:00 AM - 10:30 AM)</option>
                        <option>Weekday Evening (06:00 PM - 08:30 PM)</option>
                        <option>Weekend Fast-Track (Saturday &amp; Sunday)</option>
                        <option>Online Live Interactive Batch</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer mt-1"
                    >
                      Request Free Call Back &rarr;
                    </button>
                  </form>
                )}

                {/* Direct Helpline */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Counselor Helpline:</span>
                  <a href="tel:+919849012345" className="font-black text-[#15304C] hover:text-[#D20A0B]">
                    +91 98490 12345
                  </a>
                </div>
              </div>

              {/* Card 2: Workstation Lab & Batch Status */}
              <div className="bg-white border border-[#CBD5E1] rounded-2xl p-5 shadow-xs space-y-3 text-xs">
                <h4 className="font-black text-[#15304C] uppercase tracking-wide">
                  Lab &amp; Workstation Guarantee
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Dedicated NVIDIA RTX GPU Workstation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>1:1 Lab Seat &bull; No Computer Sharing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Lab Open 7 Days: 07:00 AM to 09:30 PM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Continuous High-Speed Fiber Internet</span>
                  </div>
                </div>
              </div>

            </aside>

          </div>
        </main>

        {/* 5. STICKY BOTTOM ENROLLMENT BAR */}
        <div className="sticky bottom-0 bg-white border-t border-[#CBD5E1] py-3 z-30 shadow-lg">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-700 truncate">
              <span className="font-bold text-[#15304C]">Total Tuition Fee: </span>
              <span className="text-[#D20A0B] font-black text-base sm:text-lg">₹{feeAmount.toLocaleString('en-IN')}</span>
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
                className="px-5 py-2 bg-[#D20A0B] hover:bg-[#B50809] active:scale-98 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer"
              >
                Enroll In This Program &rarr;
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
