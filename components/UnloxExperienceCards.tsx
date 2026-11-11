'use client';

import React, { useRef, useState, useEffect } from 'react';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';

interface UnloxExperienceCardsProps {
  activeStream: string;
  onSelectStream: (stream: any) => void;
  onOpenCourseModal?: (course: Course) => void;
}

interface ProgramItem {
  id: string;
  partner: string;
  partnerBadge: string;
  title: string;
  badge: string;
  tagline: string;
  credential: string;
  duration: string;
  image: string;
  targetCourseId: string;
  stream: 'civil' | 'mechanical' | 'eee';
}

export const UnloxExperienceCards: React.FC<UnloxExperienceCardsProps> = ({
  activeStream,
  onSelectStream,
  onOpenCourseModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerTrackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dynamicCourses, setDynamicCourses] = useState<Course[]>(COURSES);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          const mapped = data.courses.map((sc: any) => {
            const existing = COURSES.find(
              (c) =>
                c.id.toLowerCase() === sc.id?.toLowerCase() ||
                c.title.toLowerCase().trim() === sc.title?.toLowerCase().trim()
            );
            const streamVal = sc.folder === 'electrical' ? 'eee' : sc.folder;

            const toolsList = Array.isArray(sc.tools) && sc.tools.length > 0
              ? sc.tools
              : typeof sc.software === 'string' && sc.software.trim()
              ? sc.software.split(',').map((s: string) => s.trim()).filter(Boolean)
              : existing?.tools || ['CAD Tools'];

            const modulesList = Array.isArray(sc.modules) && sc.modules.length > 0
              ? sc.modules
              : Array.isArray(sc.syllabus) && sc.syllabus.length > 0
              ? sc.syllabus.map((s: string, i: number) => ({
                  number: String(i + 1).padStart(2, '0'),
                  title: s,
                  hours: 20,
                  topics: [s, 'Practical lab drafting & validation'],
                }))
              : existing?.modules || [
                  {
                    number: '01',
                    title: sc.title || 'Course Fundamentals',
                    hours: 20,
                    topics: ['2D drafting & 3D modeling', 'Practical lab drafting & validation'],
                  },
                ];

            return {
              id: sc.id || `course-${sc.code || Math.random().toString(36).substring(7)}`,
              code: sc.code,
              folder: sc.folder,
              fee: Number(sc.fee || sc.price) || existing?.fee || 35000,
              stream: streamVal,
              title: sc.title,
              category: sc.category || existing?.category || sc.domain || 'Engineering CAD',
              tagline: sc.tagline || existing?.tagline || sc.overview || 'Industrial certified CAD/BIM course',
              duration: sc.duration || existing?.duration || '90 Days (180 Hours)',
              totalHours: Number(sc.totalHours) || existing?.totalHours || 120,
              level: sc.level || existing?.level || 'Professional',
              rating: sc.rating || existing?.rating || '4.9/5',
              enrolledStudents: sc.enrolledStudents || existing?.enrolledStudents || '450+ Trainees',
              tools: toolsList,
              image:
                sc.image ||
                existing?.image ||
                'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              overview: sc.overview || existing?.overview || '',
              certification: sc.certification || existing?.certification || 'Autodesk & Dassault Certificate',
              careerRoles: Array.isArray(sc.careerRoles) && sc.careerRoles.length > 0
                ? sc.careerRoles
                : existing?.careerRoles || ['Design Engineer', 'CAD Specialist', 'Project Engineer'],
              prerequisites: sc.prerequisites || existing?.prerequisites || 'Diploma / B.Tech / Working Professional',
              capstoneProject: sc.capstoneProject && sc.capstoneProject.title
                ? sc.capstoneProject
                : existing?.capstoneProject || {
                    title: `${sc.title} Live Industry Project`,
                    description: 'Real-world industrial drafting, modeling, and validation project.',
                    deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
                  },
              modules: modulesList,
              classes: sc.classes || existing?.classes || [],
            } as any;
          });
          setDynamicCourses(mapped);
        }
      } catch (e) {
        console.error('Failed to load courses in UnloxExperienceCards:', e);
      }
    };
    fetchCourses();
    window.addEventListener('focus', fetchCourses);
    return () => window.removeEventListener('focus', fetchCourses);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 0.9)));
            setScrollProgress(progress);
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

  const handleViewCourse = (targetCourseId: string, stream: 'civil' | 'mechanical' | 'eee') => {
    onSelectStream(stream);
    if (onOpenCourseModal) {
      const course =
        dynamicCourses.find((c) => c.id === targetCourseId) ||
        COURSES.find((c) => c.id === targetCourseId) ||
        dynamicCourses[0] ||
        COURSES[0];
      onOpenCourseModal(course);
    } else {
      const element = document.getElementById('revealed-courses');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const programs: ProgramItem[] = [
    {
      id: 'mech-cadd',
      partner: 'Autodesk & Dassault Partner',
      partnerBadge: 'CAD',
      title: 'Master Diploma in Mechanical CADD & Product Design',
      badge: '360° Career Support & Placement',
      tagline: 'SolidWorks, CATIA, AutoCAD & GD&T',
      credential: 'Diploma',
      duration: '3 Months (180 Hrs)',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'mech-solidworks-prof',
      stream: 'mechanical',
    },
    {
      id: 'bim-architecture',
      partner: 'Autodesk Revit & BIM Institute',
      partnerBadge: 'BIM',
      title: 'Executive Program in BIM & Digital Architecture',
      badge: '#1 Rated BIM Industry Program',
      tagline: 'Revit Architecture, Navisworks & Dynamo',
      credential: 'Diploma',
      duration: '4 Months (200 Hrs)',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'civil-revit-bim',
      stream: 'civil',
    },
    {
      id: 'civil-cadd',
      partner: 'Bentley & CSI Structural Partner',
      partnerBadge: 'CIVIL',
      title: 'Professional Civil CADD & Structural Engineering',
      badge: 'High Industry Demand Track',
      tagline: 'AutoCAD, STAAD.Pro, ETABS & RC Detailing',
      credential: 'Diploma',
      duration: '3 Months (160 Hrs)',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'civil-autocad-adv',
      stream: 'civil',
    },
    {
      id: 'electrical-cadd',
      partner: 'AutoCAD Electrical & EPLAN Certified',
      partnerBadge: 'ELEC',
      title: 'Industrial Electrical CADD & Control Automation',
      badge: '100% Practical Lab Training',
      tagline: 'Schematics, Panel Layouts & SLD Design',
      credential: 'Certificate',
      duration: '2.5 Months (140 Hrs)',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'eee-autocad-elec',
      stream: 'eee',
    },
    {
      id: 'interior-design',
      partner: 'Chaos Group & Autodesk Partner',
      partnerBadge: '3DS',
      title: 'Master Certificate in Interior & 3D Visualisation',
      badge: 'Dedicated RTX GPU Studio',
      tagline: '3ds Max, V-Ray Next & Walkthroughs',
      credential: 'Master',
      duration: '3 Months (150 Hrs)',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'civil-3dsmax-vray',
      stream: 'civil',
    },
    {
      id: 'plant-piping',
      partner: 'Intergraph & AVEVA Certified',
      partnerBadge: 'PIPE',
      title: 'Advanced Plant Piping & Process Equipment Design',
      badge: 'EPC & Offshore Career Track',
      tagline: 'SP3D, PDMS, P&ID & Isometrics',
      credential: 'Specialist',
      duration: '4 Months (220 Hrs)',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'mech-solidworks-prof',
      stream: 'mechanical',
    },
    {
      id: 'ppm-planning',
      partner: 'Oracle Primavera Certified Center',
      partnerBadge: 'P6',
      title: 'Project Planning & Management (PPM) Executive Program',
      badge: 'Global PMP/CAPM Aligned',
      tagline: 'Primavera P6 & MS Project Scheduling',
      credential: 'Executive',
      duration: '2 Months (100 Hrs)',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'civil-autocad-adv',
      stream: 'civil',
    },
    {
      id: 'fea-ansys',
      partner: 'ANSYS Mechanical & CFD Center',
      partnerBadge: 'ANSYS',
      title: 'Finite Element Analysis (FEA) & Simulation Specialist',
      badge: 'High-Performance RTX Sim',
      tagline: 'Structural, Thermal & Flow Simulation',
      credential: 'Advanced',
      duration: '3 Months (160 Hrs)',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      targetCourseId: 'mech-solidworks-prof',
      stream: 'mechanical',
    },
  ];

  // Concatenate duplicated list for infinite seamless marquee
  const tickerPrograms = [...programs, ...programs];

  // Interpolations based on scroll progress (Unlox animation curves)
  const titleY = Math.max(0, (1 - Math.min(1, scrollProgress * 1.2)) * 40);
  const titleOpacity = Math.min(1, scrollProgress * 1.5);
  const domeY = Math.max(0, (1 - scrollProgress) * 60);

  return (
    <section
      ref={containerRef}
      id="experience-disciplines"
      className="relative w-full py-20 bg-[#FAFAFA] overflow-hidden border-t border-b border-[#E2E8F0]"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
        
        {/* Top Tagline from Unlox in Logo Red */}
        <div
          style={{
            transform: `translate3d(0, ${titleY}px, 0)`,
            opacity: titleOpacity,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
          }}
          className="text-center mb-3"
        >
          <span className="text-xs sm:text-sm font-bold text-[#D20A0B] tracking-wider uppercase">
            Why Choose RND CADD?
          </span>
        </div>

        {/* Main Header & Subtitle */}
        <div
          style={{
            transform: `translate3d(0, ${titleY}px, 0)`,
            opacity: titleOpacity,
            transition: 'transform 0.4s ease-out 0.1s, opacity 0.4s ease-out 0.1s',
          }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#15304C] leading-tight">
            Step Into Experience <br className="hidden sm:inline" />
            <span className="text-[#D20A0B] font-bold">Based Learning</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-[#414D60] text-opacity-80 max-w-xl mx-auto leading-relaxed">
            Live news ticker of industry-certified programs moving across disciplines. Hover any card to pause and explore blueprints.
          </p>
        </div>

        {/* Header Controls: Live Badge, Direction indicator & Pause/Resume */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EE2C3C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EE2C3C]"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
              Live Programs Stream
            </span>
            <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Moving Left → Right
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              08 Programs
            </span>
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
              title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            >
              {isPaused ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Pause</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HORIZONTAL CONTINUOUS TICKER STREAM (Moving Left to Right like News)     */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left and Right edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />

        {/* Ticker Track */}
        <div
          ref={tickerTrackRef}
          style={{
            animationPlayState: isPaused ? 'paused' : undefined,
          }}
          className="animate-marquee-ltr flex items-stretch gap-5 w-max px-4 py-2 hover:[animation-play-state:paused]"
        >
          {tickerPrograms.map((program, idx) => {
            return (
              <div
                key={`${program.id}-${idx}`}
                onClick={() => handleViewCourse(program.targetCourseId, program.stream)}
                className="w-[275px] sm:w-[290px] flex-shrink-0 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 cursor-pointer text-left"
              >
                {/* Card Top: Image + Floating Circular Partner Monogram Badge */}
                <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Floating Overlapping Circular Partner Monogram Badge (like Image 2 RIT badge) */}
                  <div className="absolute bottom-2.5 right-3 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1 text-[11px] font-black text-slate-800 tracking-wider">
                    {program.partnerBadge}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Partner Accreditation Sub-header */}
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate mb-1.5">
                      <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="truncate">{program.partner}</span>
                    </div>

                    {/* Program Title */}
                    <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-900 group-hover:text-[#EE2C3C] transition-colors line-clamp-2 leading-snug mb-2.5 min-h-[42px]">
                      {program.title}
                    </h3>

                    {/* Light Cyan Pill Tag (Image 2 style: #6 for Co-op... / 360° Career Support) */}
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#00838F] bg-[#E6F7F8] px-2.5 py-1 rounded-full mb-3.5 max-w-full">
                      <svg className="w-3 h-3 text-[#00838F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="truncate">{program.badge}</span>
                    </div>
                  </div>

                  <div>
                    {/* Specs Row: Credential & Duration with line icons */}
                    <div className="flex items-center gap-4 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 mb-3.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                        </svg>
                        <span>{program.credential}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{program.duration}</span>
                      </div>
                    </div>

                    {/* Red Rounded Button (Image 2 View Program style) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewCourse(program.targetCourseId, program.stream);
                      }}
                      className="w-full py-2.5 px-4 rounded-full bg-[#EE2C3C] hover:bg-[#D20A0B] text-white font-bold text-xs uppercase tracking-wider text-center shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>View Program</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNLOX SIGNATURE ORBITAL DOME & SCROLL DOWN PROMPT (In Logo Red & Navy)     */}
      {/* ========================================================================= */}
      <div
        style={{
          transform: `translate3d(0, ${domeY}px, 0)`,
          transition: 'transform 0.4s ease-out',
        }}
        className="relative w-full flex items-center justify-center mt-6 pointer-events-none"
      >
        {/* Concentric Expanding Unlox Ripples in Logo Red */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bottom-[-320px] sm:bottom-[-260px]">
          <div className="relative w-[1100px] h-[1100px] flex items-center justify-center">
            {/* Outermost Ripple */}
            <div className="absolute w-[1100px] h-[1100px] bg-[#D20A0B] bg-opacity-[4%] rounded-full border border-[#FFCDD2] animate-ripple" style={{ animationDelay: '900ms' }}></div>
            {/* Middle Ripple */}
            <div className="absolute w-[900px] h-[900px] bg-[#D20A0B] bg-opacity-[6%] rounded-full border border-[#EF9A9A] animate-ripple" style={{ animationDelay: '600ms' }}></div>
            {/* Inner Ripple */}
            <div className="absolute w-[680px] h-[680px] bg-[#D20A0B] bg-opacity-[9%] rounded-full border border-[#D20A0B]/30 animate-ripple" style={{ animationDelay: '300ms' }}></div>
            {/* Core Solid Red Dome */}
            <div className="absolute h-[460px] w-[460px] bg-[#D20A0B] bg-opacity-[50%] rounded-full animate-heartbeat"></div>
          </div>
        </div>

        {/* Floating Bouncing Scroll Down Prompt */}
        <div className="relative z-20 flex flex-col items-center justify-center animate-bounce py-6 pointer-events-auto">
          <p className="text-[#FFFFFF] font-bold text-sm tracking-wider uppercase drop-shadow-sm">
            Scroll Down to Explore Courses
          </p>
          <span className="text-[#FFFFFF] text-3xl font-black mt-1 leading-none drop-shadow-sm">
            &#8595;
          </span>
        </div>
      </div>
    </section>
  );
};
