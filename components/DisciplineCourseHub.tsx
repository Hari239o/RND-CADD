'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';
import { CourseCard } from './CourseCard';
import type { CatalogSectionContent } from '@/lib/site-content';

interface DisciplineCourseHubProps {
  activeStream: string;
  onSelectStream: (stream: string) => void;
  onOpenCourseModal: (course: Course) => void;
  onEnroll?: (course: Course) => void;
  content?: CatalogSectionContent;
}

export const DisciplineCourseHub: React.FC<DisciplineCourseHubProps> = ({
  activeStream,
  onSelectStream,
  onOpenCourseModal,
  onEnroll,
  content,
}) => {
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCourses, setShowAllCourses] = useState(false);
  const mobileTabsRef = useRef<HTMLDivElement>(null);

  // Smooth auto-scroll for category tabs on mobile
  const scrollToStreamTab = (tabId: string) => {
    if (typeof window === 'undefined') return;
    const container = mobileTabsRef.current;
    if (!container) return;

    const button = container.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement;
    if (!button) return;

    const tabIndex = folderTabs.findIndex((t) => t.id === tabId);
    if (tabIndex === 0) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    const buttonLeft = button.offsetLeft;
    const targetScroll = Math.max(0, buttonLeft - 20);
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  // Sync scroll position when activeStream changes
  useEffect(() => {
    const t = setTimeout(() => {
      scrollToStreamTab(activeStream);
    }, 50);
    return () => clearTimeout(t);
  }, [activeStream]);

  // Reset showAllCourses whenever active stream or search query changes
  useEffect(() => {
    setShowAllCourses(false);
  }, [activeStream, searchQuery]);

  // Fetch live courses from localStorage (instant cache) & API
  useEffect(() => {
    // 1. Instant check from localStorage
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('rnd_cadd_live_courses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCoursesList(parsed);
          }
        }
      }
    } catch {}

    const loadDynamicCourses = async () => {
      try {
        const res = await fetch('/api/courses?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          const mappedCourses: Course[] = data.courses.map((sc: any) => {
            const auth = COURSES.find(
              (c) =>
                c.id.toLowerCase() === sc.id?.toLowerCase() ||
                c.title.toLowerCase().trim() === sc.title?.toLowerCase().trim()
            );

            const streamVal = sc.folder === 'electrical' ? 'eee' : (sc.stream || sc.folder);

            const toolsList = Array.isArray(sc.tools) && sc.tools.length > 0
              ? sc.tools
              : typeof sc.software === 'string' && sc.software.trim()
              ? sc.software.split(',').map((s: string) => s.trim()).filter(Boolean)
              : auth?.tools || ['CAD Tools'];

            const modulesList = Array.isArray(sc.modules) && sc.modules.length > 0
              ? sc.modules
              : Array.isArray(sc.syllabus) && sc.syllabus.length > 0
              ? sc.syllabus.map((s: string, i: number) => ({
                  number: String(i + 1).padStart(2, '0'),
                  title: s,
                  hours: 20,
                  topics: [s, 'Practical lab drafting & validation'],
                }))
              : auth?.modules || [
                  {
                    number: '01',
                    title: sc.title || 'Course Fundamentals',
                    hours: 20,
                    topics: ['2D drafting & 3D modeling', 'Practical lab drafting & validation'],
                  },
                ];

            const capstoneObj = sc.capstoneProject && sc.capstoneProject.title
              ? sc.capstoneProject
              : auth?.capstoneProject || {
                  title: `${sc.title} Live Industry Project`,
                  description: 'Real-world industrial drafting, modeling, and validation project.',
                  deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
                };

            const careerList = Array.isArray(sc.careerRoles) && sc.careerRoles.length > 0
              ? sc.careerRoles
              : auth?.careerRoles || ['Design Engineer', 'CAD Specialist', 'Project Engineer'];

            const courseItem: Course = {
              id: sc.id || auth?.id || `course-${sc.code || Math.random().toString(36).substring(7)}`,
              code: sc.code || auth?.code || 'CAD-PRO',
              folder: sc.folder || auth?.folder,
              fee: Number(sc.fee || sc.price) || auth?.fee || 35000,
              stream: streamVal,
              title: sc.title,
              category: sc.category || auth?.category || sc.domain || 'Engineering CAD',
              tagline: sc.tagline || auth?.tagline || sc.overview || 'Industrial certified CAD/BIM course',
              duration: sc.duration || auth?.duration || '90 Days (180 Hours)',
              totalHours: Number(sc.totalHours) || auth?.totalHours || 120,
              level: sc.level || auth?.level || 'Professional',
              rating: sc.rating || auth?.rating || '4.9/5',
              enrolledStudents: sc.enrolledStudents || auth?.enrolledStudents || '450+ Trainees',
              tools: toolsList,
              image:
                (sc.image && !sc.image.includes('1541888946425') && !sc.image.includes('1581092335397') && !sc.image.includes('1504917599217'))
                  ? sc.image
                  : auth?.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              overview: sc.overview || auth?.overview || '',
              certification: sc.certification || auth?.certification || 'Autodesk & Dassault Certificate',
              careerRoles: careerList,
              prerequisites: sc.prerequisites || auth?.prerequisites || 'Diploma / B.Tech / Working Professional',
              capstoneProject: capstoneObj,
              modules: modulesList,
              classes: sc.classes || auth?.classes || [],
              status: sc.status || 'Active',
            };

            return courseItem;
          });

          setCoursesList(mappedCourses);
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem('rnd_cadd_live_courses', JSON.stringify(mappedCourses));
            }
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load dynamic courses from API:', err);
      }
    };

    loadDynamicCourses();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCoursesList(e.detail);
      } else {
        loadDynamicCourses();
      }
    };

    // Auto-sync whenever user focuses the tab or when admin dispatches course updates
    const interval = setInterval(loadDynamicCourses, 5000);
    window.addEventListener('rnd_cadd_courses_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', loadDynamicCourses);
    return () => {
      clearInterval(interval);
      window.removeEventListener('rnd_cadd_courses_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', loadDynamicCourses);
    };
  }, []);

  // Filter courses based on active stream and search query
  const filteredCourses = coursesList.filter((course) => {
    if ((course as any).status === 'Inactive') return false;
    const courseFolder = (course.folder || course.stream || '').toLowerCase();
    const active = activeStream.toLowerCase();

    const matchesStream =
      active === 'all' ||
      courseFolder === active ||
      (active === 'eee' && (courseFolder === 'electrical' || courseFolder === 'eee')) ||
      (active === 'electrical' && (courseFolder === 'electrical' || courseFolder === 'eee'));

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStream;

    return (
      matchesStream &&
      (course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.tools.some((t) => t.toLowerCase().includes(query)) ||
        course.overview.toLowerCase().includes(query))
    );
  });

  const getStreamTitle = () => {
    const active = activeStream.toLowerCase();
    switch (active) {
      case 'civil':
        return `CIVIL & BIM ARCHITECTURE PROGRAMS (${coursesList.filter((c) => (c.folder || c.stream) === 'civil').length})`;
      case 'mechanical':
        return `MECHANICAL DESIGN & SIMULATION PROGRAMS (${coursesList.filter((c) => (c.folder || c.stream) === 'mechanical').length})`;
      case 'eee':
      case 'electrical':
        return `ELECTRICAL & AUTOMATION ENGINEERING PROGRAMS (${coursesList.filter((c) => ['electrical', 'eee'].includes((c.folder || c.stream).toLowerCase())).length})`;
      case 'interior':
        return `INTERIOR ARCHITECTURE & 3D VISUALIZATION (${coursesList.filter((c) => (c.folder || c.stream) === 'interior').length})`;
      case 'ppm':
        return `CONSTRUCTION & EPC PROJECT MANAGEMENT (PPM) (${coursesList.filter((c) => (c.folder || c.stream) === 'ppm').length})`;
      case 'piping':
        return `PROCESS PLANT & PIPING ENGINEERING (${coursesList.filter((c) => (c.folder || c.stream) === 'piping').length})`;
      default:
        return `ALL CERTIFIED ENGINEERING PROGRAMS (${coursesList.length})`;
    }
  };

  const folderTabs = [
    { id: 'all', label: 'All Programs' },
    { id: 'civil', label: 'Civil & BIM' },
    { id: 'mechanical', label: 'Mechanical CAD/CAE' },
    { id: 'eee', label: 'Electrical & Automation' },
    { id: 'interior', label: 'Interior Architecture' },
    { id: 'ppm', label: 'Project Management (PPM)' },
    { id: 'piping', label: 'Piping & Plant CAD' },
  ];

  if (content?.hidden) return null;

  return (
    <section id="revealed-courses" className="py-6 sm:py-16 bg-[#F8FAFC] border-t border-b border-[#CBD5E1]">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1560px] mx-auto">
        {/* Section Header with Dynamic Domain Title (Desktop Only - Hidden on Mobile as circled) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-4 sm:mb-8 pb-3 sm:pb-5 border-b border-[#CBD5E1] gap-3 sm:gap-6">
          <div className="hidden md:block">
            <div className="text-xs font-bold text-[#D20A0B] mb-2 tracking-wider uppercase">
              {content?.badge || 'INDUSTRY-CERTIFIED COURSE CATALOG'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#15304C] uppercase">
              {getStreamTitle()}
            </h2>
            {content?.subheading && (
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                {content.subheading}
              </p>
            )}
          </div>

          {/* Software Search Bar */}
          <div className="w-full lg:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH SOFTWARE (REVIT, CATIA, MATLAB)..."
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#D20A0B] focus:outline-none transition-colors shadow-sm rounded-xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#475569] hover:text-[#0F172A] bg-[#F1F5F9] border border-[#CBD5E1] px-1.5 py-0.5 rounded"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Switcher Tabs across all 6 main folders - Smooth Swipeable Bar on Mobile, Clean Wrap on Desktop */}
        <div
          ref={mobileTabsRef}
          className="flex relative items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 sm:mb-10 w-full -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:gap-2.5 sm:overflow-visible scroll-smooth select-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {folderTabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? coursesList.length
                : tab.id === 'eee'
                ? coursesList.filter((c) => ['electrical', 'eee'].includes((c.folder || c.stream).toLowerCase())).length
                : coursesList.filter((c) => (c.folder || c.stream).toLowerCase() === tab.id).length;

            const isSelected =
              activeStream === tab.id ||
              (tab.id === 'eee' && activeStream === 'electrical') ||
              (tab.id === 'electrical' && activeStream === 'eee');

            return (
              <button
                key={tab.id}
                data-tab-id={tab.id}
                onClick={() => {
                  onSelectStream(tab.id);
                  scrollToStreamTab(tab.id);
                }}
                className={`shrink-0 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-semibold tracking-tight transition-all duration-300 ease-out flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none whitespace-nowrap transform active:scale-95 ${
                  isSelected
                    ? 'bg-[#D20A0B] text-white border border-[#D20A0B] shadow-md font-bold scale-[1.02]'
                    : 'bg-white text-[#15304C] border border-[#CBD5E1] hover:border-[#D20A0B] hover:text-[#D20A0B] hover:bg-[#FFF5F5] shadow-sm'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full transition-colors duration-300 ${
                    isSelected ? 'bg-white text-[#D20A0B]' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Courses Grid with Course Images & Framer Motion Scroll Stagger (4 per row on desktop, 2 rows visible initially) */}
        {filteredCourses.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mx-auto w-full"
            >
              {(showAllCourses ? filteredCourses : filteredCourses.slice(0, 8)).map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex"
                >
                  <CourseCard
                    course={course}
                    onOpenDetails={onOpenCourseModal}
                    onEnroll={onEnroll}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* "View More" Button (reveals all courses when clicked) */}
            {filteredCourses.length > 8 && (
              <div className="flex flex-col items-center justify-center pt-10 pb-2">
                {!showAllCourses ? (
                  <button
                    type="button"
                    onClick={() => setShowAllCourses(true)}
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#15304C] hover:bg-[#D20A0B] text-white text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-red-500/20 active:scale-95 cursor-pointer group"
                  >
                    <span>View More Programs ({filteredCourses.length - 8} More)</span>
                    <svg className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllCourses(false);
                      const el = document.getElementById('revealed-courses');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <span>Show Less</span>
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#CBD5E1] p-12 text-center shadow-sm">
            <div className="text-sm text-[#64748B] mb-4">
              NO PROGRAMS MATCH YOUR SEARCH CRITERIA
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectStream('all');
              }}
              className="px-6 py-2.5 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs font-bold uppercase shadow-sm"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
