'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';
import { CourseCard } from './CourseCard';

interface DisciplineCourseHubProps {
  activeStream: string;
  onSelectStream: (stream: string) => void;
  onOpenCourseModal: (course: Course) => void;
}

export const DisciplineCourseHub: React.FC<DisciplineCourseHubProps> = ({
  activeStream,
  onSelectStream,
  onOpenCourseModal,
}) => {
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live courses from MongoDB to dynamically reflect additions, edits, moved folders, and price changes
  useEffect(() => {
    const loadDynamicCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          const merged: Course[] = [...COURSES];
          data.courses.forEach((sc: any) => {
            const index = merged.findIndex(
              (c) =>
                c.id.toLowerCase() === sc.id?.toLowerCase() ||
                c.title.toLowerCase().trim() === sc.title?.toLowerCase().trim()
            );

            const streamVal = sc.folder === 'electrical' ? 'eee' : (sc.stream || sc.folder);

            const toolsList = Array.isArray(sc.tools) && sc.tools.length > 0
              ? sc.tools
              : typeof sc.software === 'string' && sc.software.trim()
              ? sc.software.split(',').map((s: string) => s.trim()).filter(Boolean)
              : ['CAD Tools'];

            const modulesList = Array.isArray(sc.modules) && sc.modules.length > 0
              ? sc.modules
              : Array.isArray(sc.syllabus) && sc.syllabus.length > 0
              ? sc.syllabus.map((s: string, i: number) => ({
                  number: String(i + 1).padStart(2, '0'),
                  title: s,
                  hours: 20,
                  topics: [s, 'Practical lab drafting & validation'],
                }))
              : [
                  {
                    number: '01',
                    title: sc.title || 'Course Fundamentals',
                    hours: 20,
                    topics: ['2D drafting & 3D modeling', 'Practical lab drafting & validation'],
                  },
                ];

            const capstoneObj = sc.capstoneProject && sc.capstoneProject.title
              ? sc.capstoneProject
              : {
                  title: `${sc.title} Live Industry Project`,
                  description: 'Real-world industrial drafting, modeling, and validation project.',
                  deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
                };

            const careerList = Array.isArray(sc.careerRoles) && sc.careerRoles.length > 0
              ? sc.careerRoles
              : ['Design Engineer', 'CAD Specialist', 'Project Engineer'];

            const courseItem: Course = {
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
              level: sc.level || 'Professional',
              rating: sc.rating || '4.9/5',
              enrolledStudents: sc.enrolledStudents || '450+ Trainees',
              tools: toolsList,
              image:
                sc.image ||
                'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              overview: sc.overview || '',
              certification: sc.certification || 'Autodesk & Dassault Certificate',
              careerRoles: careerList,
              prerequisites: sc.prerequisites || 'Diploma / B.Tech / Working Professional',
              capstoneProject: capstoneObj,
              modules: modulesList,
              classes: sc.classes || [],
            };

            if (index >= 0) {
              merged[index] = { ...merged[index], ...courseItem };
            } else {
              merged.push(courseItem);
            }
          });

          setCoursesList(merged);
        }
      } catch (err) {
        console.error('Failed to load dynamic courses from API:', err);
      }
    };

    loadDynamicCourses();

    // Auto-sync whenever user focuses the tab or every 5 seconds so dashboard edits appear live
    const interval = setInterval(loadDynamicCourses, 5000);
    window.addEventListener('focus', loadDynamicCourses);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', loadDynamicCourses);
    };
  }, []);

  // Filter courses based on active stream and search query
  const filteredCourses = coursesList.filter((course) => {
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

  return (
    <section id="revealed-courses" className="py-24 bg-[#F8FAFC] border-t border-b border-[#CBD5E1]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto">
        {/* Section Header with Dynamic Domain Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 pb-6 border-b border-[#CBD5E1] gap-6">
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-2 tracking-wider uppercase">
              INDUSTRY-CERTIFIED COURSE CATALOG
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#15304C] uppercase">
              {getStreamTitle()}
            </h2>
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

        {/* Filter Switcher Tabs across all 6 main folders - Utilizing full width without clipping */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pb-2 mb-10 w-full">
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
                onClick={() => onSelectStream(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold tracking-tight transition-all duration-200 flex items-center gap-2.5 cursor-pointer select-none whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#D20A0B] text-white border border-[#D20A0B] shadow-md font-bold'
                    : 'bg-white text-[#15304C] border border-[#CBD5E1] hover:border-[#D20A0B] hover:text-[#D20A0B] hover:bg-[#FFF5F5] shadow-sm'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    isSelected ? 'bg-white text-[#D20A0B]' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Courses Grid with Course Images & Framer Motion Scroll Stagger */}
        {filteredCourses.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className={`grid gap-6 mx-auto ${
              filteredCourses.length === 1
                ? 'grid-cols-1 max-w-md'
                : filteredCourses.length === 2
                ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'
            }`}
          >
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <CourseCard
                  course={course}
                  onOpenDetails={onOpenCourseModal}
                />
              </motion.div>
            ))}
          </motion.div>
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
