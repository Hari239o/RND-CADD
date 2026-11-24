'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';
import type { ProgramsSectionContent } from '@/lib/site-content';

interface UpgradProgramsShowcaseProps {
  activeStream: string;
  onSelectStream: (stream: string) => void;
  onOpenCourseModal?: (course: Course) => void;
  content?: ProgramsSectionContent;
}

interface FolderDefinition {
  id: string;
  name: string;
  stream: string;
  image: string;
  bgImage: string;
  headline: string;
  partnerMonogram: string;
}

export const UpgradProgramsShowcase: React.FC<UpgradProgramsShowcaseProps> = ({
  activeStream,
  onSelectStream,
  onOpenCourseModal,
  content,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('civil');
  const [activeCourseIndex, setActiveCourseIndex] = useState<number>(0);
  const [allCourses, setAllCourses] = useState<Course[]>(COURSES);
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const mobileNavContainerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Fetch live courses from localStorage (instant cache) & API
  useEffect(() => {
    // 1. Instant check from localStorage
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('rnd_cadd_live_courses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllCourses(parsed);
          }
        }
      }
    } catch {}

    const fetchCourses = async () => {
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
              : auth?.modules || [];

            const courseObj: any = {
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
              level: sc.level || auth?.level || 'Professional Diploma',
              rating: sc.rating || auth?.rating || '4.9/5',
              enrolledStudents: sc.enrolledStudents || auth?.enrolledStudents || '450+ Trainees',
              tools: toolsList,
              image:
                (sc.image && !sc.image.includes('1541888946425') && !sc.image.includes('1581092335397') && !sc.image.includes('1504917599217'))
                  ? sc.image
                  : auth?.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              overview: sc.overview || auth?.overview || '',
              certification: sc.certification || auth?.certification || 'Autodesk & Dassault Certificate',
              careerRoles: sc.careerRoles || auth?.careerRoles || ['CAD Design Engineer'],
              prerequisites: sc.prerequisites || auth?.prerequisites || 'Diploma / B.Tech',
              capstoneProject: sc.capstoneProject || auth?.capstoneProject || {
                title: `${sc.title} Live Industry Project`,
                description: 'Real-world industrial drafting, modeling, and validation project.',
                deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
              },
              modules: modulesList,
              classes: sc.classes || auth?.classes || [],
              status: sc.status || 'Active',
            };

            return courseObj;
          });
          setAllCourses(mappedCourses);
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem('rnd_cadd_live_courses', JSON.stringify(mappedCourses));
            }
          } catch {}
        }
      } catch (e) {
        console.error('Failed to load courses in UpgradProgramsShowcase:', e);
      }
    };
    fetchCourses();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAllCourses(e.detail);
      } else {
        fetchCourses();
      }
    };

    const interval = setInterval(fetchCourses, 5000);
    window.addEventListener('rnd_cadd_courses_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('focus', fetchCourses);
    return () => {
      clearInterval(interval);
      window.removeEventListener('rnd_cadd_courses_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', fetchCourses);
    };
  }, []);

  const DEFAULT_FOLDERS: FolderDefinition[] = [
    {
      id: 'civil',
      name: 'CIVIL CADD',
      stream: 'civil',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80',
      headline: 'Autodesk & Bentley Civil Structural Excellence Lab',
      partnerMonogram: 'CIVIL',
    },
    {
      id: 'mechanical',
      name: 'MECHANICAL',
      stream: 'mechanical',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      headline: 'Dassault & SolidWorks Advanced Engineering Center',
      partnerMonogram: 'CAD',
    },
    {
      id: 'electrical',
      name: 'ELECTRICAL',
      stream: 'eee',
      image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80',
      headline: 'EPLAN & Industrial Automation Control Center',
      partnerMonogram: 'ELEC',
    },
    {
      id: 'interior',
      name: 'INTERIOR',
      stream: 'interior',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      headline: 'Chaos Group & 3ds Max Architectural Studio',
      partnerMonogram: '3DS',
    },
    {
      id: 'piping',
      name: 'PIPING',
      stream: 'piping',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80',
      headline: 'Process Plant Engineering & SP3D Simulation Lab',
      partnerMonogram: 'PIPE',
    },
    {
      id: 'ppm',
      name: 'PPM',
      stream: 'ppm',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
      headline: 'Oracle Primavera P6 Project Management Lab',
      partnerMonogram: 'P6',
    },
  ];

  const folders: FolderDefinition[] = DEFAULT_FOLDERS.map((def) => {
    const matched = content?.domains?.find(
      (d) =>
        d.id.toLowerCase() === def.id.toLowerCase() ||
        (def.id === 'electrical' && d.id.toLowerCase() === 'eee') ||
        d.name.toLowerCase().includes(def.id.toLowerCase())
    );
    if (!matched) return def;
    return {
      ...def,
      name: matched.name || def.name,
      headline: matched.headline || def.headline,
      image: matched.image || def.image,
      bgImage: matched.bgImage || def.bgImage,
    };
  });

  // Helper to retrieve courses for a given folder id
  const getFolderCourses = (folderId: string): Course[] => {
    return allCourses.filter((c) => {
      if ((c as any).status === 'Inactive') return false;
      const folderVal = (c.folder || '').toLowerCase();
      const streamVal = (c.stream || '').toLowerCase();
      if (folderId === 'civil') {
        return folderVal === 'civil' || (streamVal === 'civil' && !folderVal);
      }
      if (folderId === 'mechanical') {
        return folderVal === 'mechanical' || streamVal === 'mechanical';
      }
      if (folderId === 'electrical') {
        return folderVal === 'electrical' || streamVal === 'eee' || streamVal === 'electrical';
      }
      if (folderId === 'interior') {
        return folderVal === 'interior' || streamVal === 'interior';
      }
      if (folderId === 'piping') {
        return folderVal === 'piping' || streamVal === 'piping';
      }
      if (folderId === 'ppm') {
        return folderVal === 'ppm' || streamVal === 'ppm';
      }
      return false;
    });
  };

  const activeFolderCourses = getFolderCourses(selectedFolderId);
  const totalFolderCourses = activeFolderCourses.length;

  // Scroll to a specific card smoothly and lock onScroll feedback loop
  const scrollToCard = (index: number) => {
    if (!cardsScrollRef.current) return;
    const container = cardsScrollRef.current;
    const cards = container.children;
    if (!cards || cards.length === 0) return;

    const validIndex = Math.max(0, Math.min(index, cards.length - 1));
    const targetCard = cards[validIndex] as HTMLElement;
    const firstCard = cards[0] as HTMLElement;

    if (targetCard && firstCard) {
      isProgrammaticScrollRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      const targetOffset = targetCard.offsetLeft - firstCard.offsetLeft;
      container.scrollTo({
        left: targetOffset,
        behavior: 'smooth',
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    }
  };

  // Smooth auto-scroll for mobile category navbar tabs
  const scrollToFolderTab = (folderId: string) => {
    if (typeof window === 'undefined') return;
    const container = mobileNavContainerRef.current;
    if (!container) return;

    const button = container.querySelector(`[data-folder-id="${folderId}"]`) as HTMLElement;
    if (!button) return;

    const folderIndex = folders.findIndex((f) => f.id === folderId);
    if (folderIndex === 0) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    // Move the clicked tab towards the left side (with ~20px padding from container's left)
    // so that the right-side tabs that were offscreen come smoothly sliding into view!
    const buttonLeft = button.offsetLeft;
    const targetScroll = Math.max(0, buttonLeft - 20);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  // When folder changes, reset scroll to start immediately and slide mobile navbar tab into view
  useEffect(() => {
    setActiveCourseIndex(0);
    if (cardsScrollRef.current) {
      cardsScrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
    // Small timeout ensures DOM layout is updated before scrolling
    const t = setTimeout(() => {
      scrollToFolderTab(selectedFolderId);
    }, 50);
    return () => clearTimeout(t);
  }, [selectedFolderId]);

  // Sync with activeStream prop from parent
  useEffect(() => {
    if (activeStream) {
      const s = activeStream.toLowerCase();
      const match = folders.find(
        (f) =>
          f.stream.toLowerCase() === s ||
          f.id.toLowerCase() === s ||
          (s === 'eee' && f.id === 'elec')
      );
      if (match && match.id !== selectedFolderId) {
        setSelectedFolderId(match.id);
      }
    }
  }, [activeStream]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (totalFolderCourses <= 1) return;
    const nextIdx = activeCourseIndex > 0 ? activeCourseIndex - 1 : totalFolderCourses - 1;
    setActiveCourseIndex(nextIdx);
    scrollToCard(nextIdx);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (totalFolderCourses <= 1) return;
    const nextIdx = activeCourseIndex < totalFolderCourses - 1 ? activeCourseIndex + 1 : 0;
    setActiveCourseIndex(nextIdx);
    scrollToCard(nextIdx);
  };

  const handleScroll = () => {
    if (isProgrammaticScrollRef.current) return;
    if (!cardsScrollRef.current) return;

    const container = cardsScrollRef.current;
    const cards = container.children;
    if (!cards || cards.length === 0) return;

    const scrollLeft = container.scrollLeft;
    const firstCard = cards[0] as HTMLElement;
    const baseOffset = firstCard ? firstCard.offsetLeft : 0;

    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardOffset = card.offsetLeft - baseOffset;
      const diff = Math.abs(cardOffset - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    if (closestIndex !== activeCourseIndex && closestIndex >= 0 && closestIndex < totalFolderCourses) {
      setActiveCourseIndex(closestIndex);
    }
  };

  // Activate folder instantly on hover or click
  const handleFolderActivate = (folderId: string, stream: string) => {
    if (selectedFolderId !== folderId) {
      setSelectedFolderId(folderId);
      setActiveCourseIndex(0);
      onSelectStream(stream);
    }
    // Instantly initiate smooth slide of the mobile navbar
    scrollToFolderTab(folderId);
  };

  const handleViewCourse = (course: Course) => {
    if (onOpenCourseModal) {
      onOpenCourseModal(course);
    } else {
      const el = document.getElementById('revealed-courses');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (content?.hidden) return null;

  return (
    <section id="upgrad-showcase" className="py-4 sm:py-10 bg-[#F8FAFC] border-t border-b border-[#E2E8F0]">
      {/* Container with compact balanced width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1560px] mx-auto">
        
        {/* Section Header (Desktop Only - Hidden on Mobile as per request) */}
        <div className="hidden md:block mb-4 sm:mb-5 pb-3 border-b border-slate-200">
          <span className="text-[11px] font-bold text-[#EE2C3C] tracking-wider uppercase">
            {content?.badge || 'Global Certified Programs'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
            {content?.heading || 'Explore Programs By Engineering Domain'}
          </h2>
          {content?.subheading && (
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {content.subheading}
            </p>
          )}
        </div>

        {/* MOBILE & TABLET SWIPEABLE DOMAIN SELECTOR (< lg) */}
        <div className="relative w-full lg:hidden mb-3">
          <div
            ref={mobileNavContainerRef}
            className="flex relative items-center gap-2 overflow-x-auto no-scrollbar pb-3 pt-1 w-full -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth select-none"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {folders.map((folder) => {
              const isSelected = folder.id === selectedFolderId;
              const count = getFolderCourses(folder.id).length;
              return (
                <button
                  key={folder.id}
                  data-folder-id={folder.id}
                  type="button"
                  onClick={() => handleFolderActivate(folder.id, folder.stream)}
                  className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-black transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer whitespace-nowrap transform active:scale-95 ${
                    isSelected
                      ? 'bg-[#EE2C3C] text-white shadow-lg shadow-red-500/25 scale-[1.03] ring-2 ring-red-400/40 z-10'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{folder.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black transition-colors duration-300 ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* IN-PLACE ACCORDION: EACH SECTION EXPANDS RIGHT THERE WHERE IT SITS         */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row gap-2.5 sm:gap-3 items-stretch w-full min-h-0 lg:min-h-[500px]">
          {folders.map((folder) => {
            const isSelected = folder.id === selectedFolderId;
            const coursesInFolder = getFolderCourses(folder.id);
            const countInFolder = coursesInFolder.length;

            if (!isSelected) {
              // =====================================================================
              // COLLAPSED DISCIPLINE STRIP (Desktop only side-by-side accordion)
              // Sleek narrow width, no icons, ultra clean & attractive typography
              // =====================================================================
              return (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => handleFolderActivate(folder.id, folder.stream)}
                  onMouseEnter={() => handleFolderActivate(folder.id, folder.stream)}
                  className="hidden lg:flex relative rounded-2xl overflow-hidden cursor-pointer flex-col justify-between p-2.5 sm:p-3 xl:p-3.5 group shadow-sm hover:shadow-xl focus:outline-none select-none text-left transition-all duration-500 ease-in-out w-full lg:w-[72px] xl:w-[82px] 2xl:w-[90px] h-[76px] sm:h-[84px] lg:h-auto lg:min-h-[500px] flex-shrink-0 hover:lg:w-[80px] hover:xl:w-[90px] hover:2xl:w-[100px] bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-[#EE2C3C] hover:-translate-y-1"
                  title={`Open ${countInFolder} courses in ${folder.name}`}
                >
                  {/* Top Glowing Red Accent Indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 group-hover:bg-[#EE2C3C] transition-all duration-500" />

                  {/* DESKTOP TOP / MOBILE LEFT: Course Count Badge (NO ICONS) */}
                  <div className="relative z-10 flex lg:flex-col items-center justify-between lg:items-center w-full pt-1">
                    <span className="text-[9.5px] xl:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-[#EE2C3C] text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-transparent transition-all duration-500 whitespace-nowrap shadow-2xs">
                      {countInFolder} COURSES
                    </span>
                  </div>

                  {/* DESKTOP CENTER: Sleek, High-Contrast Vertical Typography */}
                  <div className="relative z-10 w-full hidden lg:flex flex-col items-center justify-center flex-1 my-3">
                    <span
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                      className="text-xs sm:text-[13px] xl:text-sm font-black tracking-[0.22em] uppercase text-slate-800 group-hover:text-[#EE2C3C] transition-colors duration-500 py-3 whitespace-nowrap block"
                    >
                      {folder.name}
                    </span>
                    <span className="text-[8.5px] font-bold text-slate-400 group-hover:text-slate-600 tracking-widest uppercase block mt-1 transition-colors duration-500">
                      DISCIPLINE
                    </span>
                  </div>

                  {/* MOBILE CENTER: Horizontal Title */}
                  <div className="relative z-10 lg:hidden flex-1 px-3">
                    <h3 className="text-sm font-black uppercase text-slate-900 group-hover:text-[#EE2C3C] transition-colors duration-500">
                      {folder.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate">
                      {folder.headline}
                    </p>
                  </div>

                  {/* DESKTOP BOTTOM / MOBILE RIGHT: Explore Action Prompt */}
                  <div className="relative z-10 w-full flex items-center justify-center pt-2 border-t border-slate-100 group-hover:border-red-100 transition-colors duration-500">
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#EE2C3C] flex items-center gap-1 transition-all duration-500">
                      <span className="hidden lg:inline text-[11px] font-bold">Explore</span>
                      <span className="lg:hidden text-[10px] bg-red-50 text-[#EE2C3C] px-2.5 py-1 rounded-full font-black">Open ↓</span>
                      <span className="hidden lg:inline transform group-hover:translate-x-0.5 transition-transform duration-300">→</span>
                    </span>
                  </div>
                </button>
              );
            }

            // =====================================================================
            // EXPANDED ACTIVE DISCIPLINE SHOWCASE (Opens right here in its position!)
            // Clean Light Background both on Mobile & Laptop/Desktop as requested
            // =====================================================================
            return (
              <div
                key={folder.id}
                className="flex-1 rounded-2xl overflow-hidden relative shadow-lg min-h-0 sm:min-h-[500px] flex flex-col justify-between p-3.5 sm:p-6 lg:p-7 bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]/60 border border-slate-200/90 ring-2 ring-[#EE2C3C]/80 transition-all duration-500 ease-in-out min-w-0 lg:min-w-[550px] xl:min-w-[650px] 2xl:min-w-[760px] animate-fadeIn"
              >
                {/* Top Row: Stream Badge & Headline (Desktop Only - Hidden on Mobile as circled) */}
                <div className="relative z-10 hidden md:flex items-center justify-between flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EE2C3C] animate-pulse"></span>
                    <span>{folder.name.toUpperCase()} • {countInFolder} TOTAL COURSES</span>
                  </span>
                  <span className="hidden md:inline-flex text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs">
                    {folder.headline}
                  </span>
                </div>

                {/* Bottom Content Area: Counter & Arrows on Left, Courses for THIS folder on Right */}
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-5 pt-1 sm:pt-4 w-full min-w-0">
                  
                  {/* Left: Counter 01/08 and Working Navigation Arrows */}
                  <div className="text-slate-900 mb-1 select-none flex md:flex-col items-center md:items-start justify-between md:justify-start w-full md:w-auto flex-shrink-0">
                    <div>
                      <div className="text-3xl sm:text-5xl font-black tracking-tight text-[#15304C] leading-none">
                        0{countInFolder > 0 ? activeCourseIndex + 1 : 0}
                        <span className="text-lg sm:text-2xl font-light text-slate-400 ml-1">
                          /{countInFolder < 10 ? `0${countInFolder}` : countInFolder}
                        </span>
                      </div>
                      <p className="hidden md:block text-[10px] sm:text-[11px] font-bold text-slate-500 mt-1">
                        Total {countInFolder} courses in this folder
                      </p>
                    </div>

                    {/* Navigation Circular Arrows (Desktop Only - Hidden on Mobile as circled) */}
                    <div className="hidden md:flex items-center gap-2 md:mt-3">
                      <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous course"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#EE2C3C] text-slate-700 hover:text-white shadow-md flex items-center justify-center transition-all active:scale-90 hover:scale-105 cursor-pointer select-none group border border-slate-200"
                        title="Previous course"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next course"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#EE2C3C] text-slate-700 hover:text-white shadow-md flex items-center justify-center transition-all active:scale-90 hover:scale-105 cursor-pointer select-none group border border-slate-200"
                        title="Next course"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right: COURSES IN THIS FOLDER + Progress Indicator Track */}
                  <div className="flex flex-col gap-2 max-w-full md:max-w-[calc(100%-180px)] w-full min-w-0">
                    <div
                      ref={cardsScrollRef}
                      onScroll={handleScroll}
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                      className="flex flex-row gap-3 items-stretch overflow-x-auto py-1.5 px-0.5 scroll-smooth min-w-0 [&::-webkit-scrollbar]:hidden"
                    >
                      {coursesInFolder.map((course, idx) => (
                        <div
                          key={`${selectedFolderId}-${course.id}-${idx}`}
                          className={`${
                            coursesInFolder.length === 1
                              ? 'w-full max-w-[340px] sm:max-w-[380px]'
                              : 'w-[230px] sm:w-[245px] xl:w-[255px]'
                          } flex-shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-md flex flex-col justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300 animate-fadeIn`}
                        >
                          {/* Top Image + Circular Partner Monogram Badge */}
                          <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-slate-100 flex-shrink-0">
                            <img
                              src={course.image}
                              alt={course.title}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  folder.image ||
                                  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80';
                              }}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Floating Overlapping Circular Partner Monogram Badge */}
                            <div className="absolute bottom-2 right-2.5 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center p-0.5 text-[10px] font-black text-[#EE2C3C] tracking-wider">
                              {folder.partnerMonogram}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
                            <div>
                              {/* Partner / Institution */}
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate mb-1">
                                <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="truncate">{course.certification || 'Autodesk & Dassault Partner'}</span>
                              </div>

                              {/* Title */}
                              <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#EE2C3C] transition-colors line-clamp-2 leading-snug mb-1.5 min-h-[34px]">
                                {course.title}
                              </h4>

                              {/* Cyan Pill Tag */}
                              <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#00838F] bg-[#E6F7F8] px-2 py-0.5 rounded-full mb-2 max-w-full">
                                <span className="truncate">
                                  {course.tagline || `#1 Rated ${folder.name} Program`}
                                </span>
                              </div>
                            </div>

                            <div>
                              {/* Specs Row: Credential & Duration */}
                              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 text-[10px] text-slate-600 mb-2.5">
                                <div className="flex items-center gap-1 font-medium">
                                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                                  </svg>
                                  <span>{course.level || 'Diploma'}</span>
                                </div>
                                <div className="flex items-center gap-1 font-medium">
                                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{course.duration}</span>
                                </div>
                              </div>

                              {/* Red Pill Button */}
                              <button
                                onClick={() => handleViewCourse(course)}
                                className="w-full py-2 px-3 rounded-full bg-[#EE2C3C] hover:bg-[#D20A0B] text-white font-bold text-xs uppercase tracking-wider text-center shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                              >
                                View Program
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar Track */}
                    {countInFolder > 0 && (
                      <div className="w-full bg-slate-200/90 h-1.5 rounded-full overflow-hidden mt-1 shadow-inner">
                        <div
                          className="bg-[#EE2C3C] h-full rounded-full transition-all duration-300 ease-out shadow-xs"
                          style={{
                            width: `${Math.max(15, ((activeCourseIndex + 1) / countInFolder) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
