'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';

interface UpgradProgramsShowcaseProps {
  activeStream: string;
  onSelectStream: (stream: string) => void;
  onOpenCourseModal?: (course: Course) => void;
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
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('civil');
  const [activeCourseIndex, setActiveCourseIndex] = useState<number>(0);
  const [allCourses, setAllCourses] = useState<Course[]>(COURSES);
  const cardsScrollRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any timers on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // Fetch live courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          // Merge API courses with default COURSES so no domain is ever depleted
          const merged: Course[] = [...COURSES];
          data.courses.forEach((sc: any) => {
            const index = merged.findIndex(
              (c) =>
                c.id.toLowerCase() === sc.id?.toLowerCase() ||
                c.title.toLowerCase().trim() === sc.title?.toLowerCase().trim()
            );
            const streamVal = sc.folder === 'electrical' ? 'eee' : (sc.stream || sc.folder);

            const courseObj: any = {
              id: sc.id || `course-${sc.code || Math.random().toString(36).substring(7)}`,
              code: sc.code,
              folder: sc.folder,
              fee: Number(sc.fee || sc.price) || 35000,
              stream: streamVal,
              title: sc.title,
              category: sc.category || sc.domain || 'Engineering CAD',
              tagline: sc.tagline || sc.overview || 'Industrial certified CAD/BIM course',
              duration: sc.duration || '90 Days (180 Hours)',
              totalHours: Number(sc.totalHours) || 120,
              level: sc.level || 'Professional Diploma',
              rating: sc.rating || '4.9/5',
              enrolledStudents: sc.enrolledStudents || '450+ Trainees',
              tools: sc.tools || ['CAD Tools'],
              image:
                sc.image ||
                'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              overview: sc.overview || '',
              certification: sc.certification || 'Autodesk & Dassault Certificate',
              careerRoles: sc.careerRoles || ['CAD Design Engineer'],
              prerequisites: sc.prerequisites || 'Diploma / B.Tech',
              capstoneProject: sc.capstoneProject || {
                title: `${sc.title} Live Industry Project`,
                description: 'Real-world industrial drafting, modeling, and validation project.',
                deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
              },
              modules: sc.modules || [],
              classes: sc.classes || [],
            };

            if (index >= 0) {
              merged[index] = { ...merged[index], ...courseObj };
            } else {
              merged.push(courseObj);
            }
          });
          setAllCourses(merged);
        }
      } catch (e) {
        console.error('Failed to load courses in UpgradProgramsShowcase:', e);
      }
    };
    fetchCourses();
  }, []);

  const folders: FolderDefinition[] = [
    {
      id: 'civil',
      name: 'CIVIL CADD',
      stream: 'civil',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186244f?auto=format&fit=crop&w=1600&q=80',
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
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80',
      headline: 'EPLAN & Industrial Automation Control Center',
      partnerMonogram: 'ELEC',
    },
    {
      id: 'interior',
      name: 'INTERIOR',
      stream: 'interior',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      headline: 'Chaos Group & 3ds Max Architectural Studio',
      partnerMonogram: '3DS',
    },
    {
      id: 'piping',
      name: 'PIPING',
      stream: 'piping',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
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

  const currentFolder = folders.find((f) => f.id === selectedFolderId) || folders[0];

  // Filter actual courses belonging to the selected folder
  const folderCourses = allCourses.filter((c) => {
    const folderVal = (c.folder || '').toLowerCase();
    const streamVal = (c.stream || '').toLowerCase();
    if (selectedFolderId === 'civil') {
      return folderVal === 'civil' || (streamVal === 'civil' && !folderVal);
    }
    if (selectedFolderId === 'mechanical') {
      return folderVal === 'mechanical' || streamVal === 'mechanical';
    }
    if (selectedFolderId === 'electrical') {
      return folderVal === 'electrical' || streamVal === 'eee' || streamVal === 'electrical';
    }
    if (selectedFolderId === 'interior') {
      return folderVal === 'interior' || streamVal === 'interior';
    }
    if (selectedFolderId === 'piping') {
      return folderVal === 'piping' || streamVal === 'piping';
    }
    if (selectedFolderId === 'ppm') {
      return folderVal === 'ppm' || streamVal === 'ppm';
    }
    return false;
  });

  const totalFolderCourses = folderCourses.length;

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

  // When folder changes, reset scroll to start immediately
  useEffect(() => {
    setActiveCourseIndex(0);
    if (cardsScrollRef.current) {
      cardsScrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [selectedFolderId]);

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
  };

  const handleViewCourse = (course: Course) => {
    if (onOpenCourseModal) {
      onOpenCourseModal(course);
    } else {
      const el = document.getElementById('revealed-courses');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="upgrad-showcase" className="py-8 sm:py-10 bg-[#F8FAFC] border-t border-b border-[#E2E8F0]">
      {/* Container with compact balanced width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1560px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 pb-3 border-b border-slate-200 gap-3">
          <div>
            <span className="text-[11px] font-bold text-[#EE2C3C] tracking-wider uppercase">
              Global Certified Programs
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
              Explore Programs By Engineering Domain
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Move mouse over any discipline strip on the left to immediately switch domains and explore all accredited courses in that folder.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* EXACT IMAGE 2 LAYOUT: PERSISTENT STRIPS + ACTIVE SHOWCASE + BUTTONS       */}
        {/* ========================================================================= */}
        <div className="flex flex-row gap-2.5 sm:gap-3.5 items-stretch w-full min-h-[440px] sm:min-h-[470px] overflow-hidden">
          
          {/* LEFT SIDE: Discipline Strips (All 6 Folders: Civil, Mechanical, Electrical, Interior, Piping, PPM) */}
          <div className="flex flex-row gap-1.5 sm:gap-2 flex-shrink-0">
            {folders.map((folder) => {
              const isSelected = folder.id === selectedFolderId;
              const countInFolder = allCourses.filter((c) => {
                const folderVal = (c.folder || '').toLowerCase();
                const streamVal = (c.stream || '').toLowerCase();
                if (folder.id === 'civil') return folderVal === 'civil' || (streamVal === 'civil' && !folderVal);
                if (folder.id === 'mechanical') return folderVal === 'mechanical' || streamVal === 'mechanical';
                if (folder.id === 'electrical') return folderVal === 'electrical' || streamVal === 'eee' || streamVal === 'electrical';
                if (folder.id === 'interior') return folderVal === 'interior' || streamVal === 'interior';
                if (folder.id === 'piping') return folderVal === 'piping' || streamVal === 'piping';
                if (folder.id === 'ppm') return folderVal === 'ppm' || streamVal === 'ppm';
                return false;
              }).length;

              return (
                <button
                  key={folder.id}
                  type="button"
                  onMouseEnter={() => handleFolderActivate(folder.id, folder.stream)}
                  onClick={() => handleFolderActivate(folder.id, folder.stream)}
                  style={{
                    transition: 'width 0.35s cubic-bezier(0.25, 1, 0.5, 1), transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  className={`relative h-full rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between p-2.5 sm:p-3 group shadow-md hover:shadow-xl focus:outline-none select-none flex-shrink-0 text-left transition-all ${
                    isSelected
                      ? 'w-[68px] sm:w-[82px] xl:w-[94px] ring-2 ring-[#EE2C3C] shadow-lg'
                      : 'w-[48px] sm:w-[58px] xl:w-[68px] hover:w-[120px] sm:hover:w-[145px] xl:hover:w-[160px]'
                  }`}
                  title={`Open ${countInFolder} courses in ${folder.name}`}
                >
                  {/* Full-Height Real Photographic Background */}
                  <img
                    src={folder.image}
                    alt={folder.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                      isSelected ? 'scale-105' : 'group-hover:scale-110'
                    }`}
                  />
                  {/* Subtle Dark Gradient Overlay at bottom for text readability */}
                  <div
                    className={`absolute inset-0 transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-t from-black/90 via-black/35 to-black/15'
                        : 'bg-gradient-to-t from-black/95 via-black/50 to-black/30 group-hover:from-black/80'
                    }`}
                  />

                  {/* Top: Active indicator or count badge */}
                  <div className="relative z-10">
                    {isSelected ? (
                      <span className="text-[9px] font-extrabold text-white bg-[#EE2C3C] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-[9px] font-bold text-white bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/20 whitespace-nowrap">
                          {countInFolder} COURSES
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Vertical Text when slim, Horizontal Title when spread or active */}
                  <div className="relative z-10 w-full">
                    {/* Collapsed State: Vertical Text Running Along Bottom */}
                    <span
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                      className={`text-[11px] sm:text-xs font-black tracking-widest uppercase text-white/95 drop-shadow-md py-3 whitespace-nowrap block transition-all ${
                        isSelected ? 'hidden' : 'group-hover:hidden'
                      }`}
                    >
                      {folder.name}
                    </span>

                    {/* Spread State / Active State: Horizontal Title */}
                    <div className={`flex flex-col gap-0.5 transition-all ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}>
                      <span className="text-xs sm:text-[13px] font-black uppercase text-white drop-shadow-md leading-tight">
                        {folder.name}
                      </span>
                      <span className="text-[9px] font-extrabold text-[#EE2C3C] bg-white px-2 py-0.5 rounded-full w-fit shadow-md whitespace-nowrap">
                        {isSelected ? 'Viewing →' : 'Open →'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE: Main Active Showcase with Vibrant Landmark Background & Total Folder Courses */}
          <div
            className="flex-1 rounded-2xl overflow-hidden relative shadow-xl min-h-[440px] sm:min-h-[470px] flex flex-col justify-between p-4 sm:p-6 lg:p-7 bg-cover bg-center transition-all duration-700 ease-out min-w-0"
            style={{
              backgroundImage: `url('${currentFolder.bgImage}')`,
            }}
          >
            {/* Natural sunlight atmospheric overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20 pointer-events-none" />

            {/* Top Row: Stream Badge & Total Courses Counter */}
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EE2C3C] animate-pulse"></span>
                <span>{currentFolder.name} DISCIPLINE • {totalFolderCourses} TOTAL COURSES</span>
              </span>
              <span className="hidden md:inline-flex text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20">
                {currentFolder.headline}
              </span>
            </div>

            {/* Bottom Content Area: Counter & Arrows on Left, Total Courses in Folder on Right */}
            <div className="relative z-10 flex flex-col md:flex-row items-end justify-between gap-5 pt-4 w-full min-w-0">
              
              {/* Left: Counter 01/04 and Working Navigation Arrows (Exact Image 2 & 3) */}
              <div className="text-white mb-2 select-none flex-shrink-0">
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-none">
                  0{totalFolderCourses > 0 ? activeCourseIndex + 1 : 0}
                  <span className="text-xl sm:text-2xl font-light opacity-90 ml-1">
                    /{totalFolderCourses < 10 ? `0${totalFolderCourses}` : totalFolderCourses}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-1.5">
                  Total {totalFolderCourses} courses in this folder
                </p>

                {/* Navigation Circular Arrows with Reliable Click State */}
                <div className="flex items-center gap-2.5 mt-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous course"
                    className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl flex items-center justify-center transition-all active:scale-90 hover:scale-105 cursor-pointer select-none group border border-slate-100"
                    title="Previous course"
                  >
                    <svg
                      className="w-4 h-4 text-slate-800 transition-transform group-hover:-translate-x-0.5"
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
                    className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-xl flex items-center justify-center transition-all active:scale-90 hover:scale-105 cursor-pointer select-none group border border-slate-100"
                    title="Next course"
                  >
                    <svg
                      className="w-4 h-4 text-slate-800 transition-transform group-hover:translate-x-0.5"
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

              {/* Right: TOTAL COURSES IN FOLDER + Progress Indicator Track (Exact Image 2) */}
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
                {folderCourses.map((course, idx) => (
                  <div
                    key={`${course.id}-${idx}`}
                    className={`${
                      folderCourses.length === 1
                        ? 'w-full max-w-[340px] sm:max-w-[380px]'
                        : 'w-[230px] sm:w-[245px] xl:w-[255px]'
                    } flex-shrink-0 bg-white rounded-2xl border border-white/90 shadow-xl flex flex-col justify-between overflow-hidden group hover:-translate-y-1 transition-all duration-300 animate-fadeIn`}
                  >
                    {/* Top Image + Circular Partner Monogram Badge */}
                    <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Floating Overlapping Circular Partner Monogram Badge */}
                      <div className="absolute bottom-2 right-2.5 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center p-0.5 text-[10px] font-black text-[#EE2C3C] tracking-wider">
                        {currentFolder.partnerMonogram}
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
                            {course.tagline || `#1 Rated ${currentFolder.name} Program`}
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

                {/* Progress Bar Track (Exact Image 2 Style) */}
                {totalFolderCourses > 0 && (
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden mt-1 backdrop-blur-sm shadow-inner">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-300 ease-out shadow-sm"
                      style={{
                        width: `${Math.max(15, ((activeCourseIndex + 1) / totalFolderCourses) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
