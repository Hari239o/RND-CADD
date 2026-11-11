'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';
import { CourseCard } from './CourseCard';

interface CourseCatalogProps {
  activeStream: 'all' | 'civil' | 'mechanical' | 'eee';
  onSelectStream: (stream: 'all' | 'civil' | 'mechanical' | 'eee') => void;
  onOpenCourseModal: (course: Course) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  activeStream,
  onSelectStream,
  onOpenCourseModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter courses based on active stream and search query
  const filteredCourses = COURSES.filter((course) => {
    const matchesStream = activeStream === 'all' || course.stream === activeStream;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStream;

    const matchesSearch =
      course.title.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.tools.some((t) => t.toLowerCase().includes(query)) ||
      course.overview.toLowerCase().includes(query);

    return matchesStream && matchesSearch;
  });

  return (
    <section id="courses-section" className="py-20 bg-[#F8FAFC]">
      <div className="cad-container">
        
        {/* Section Header - Zero Subheaders Content */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 pb-6 border-b border-[#CBD5E1] gap-6">
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-2 tracking-wider">
              INDUSTRY-CERTIFIED CURRICULUM
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] uppercase">
              PROFESSIONAL CAD COURSE CATALOG
            </h2>
          </div>

          {/* Search Box - Zero Icons */}
          <div className="w-full lg:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH SOFTWARE / SKILL (REVIT, CATIA, MATLAB)..."
                className="w-full px-4 py-2.5 bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:border-[#D20A0B] focus:outline-none transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#475569] hover:text-[#0F172A] bg-[#F1F5F9] border border-[#CBD5E1] px-1.5 py-0.5"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Switcher Tabs - Zero Icons */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => onSelectStream('all')}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border shadow-sm ${
              activeStream === 'all'
                ? 'bg-[#D20A0B] border-[#D20A0B] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            ALL PROGRAMS (18)
          </button>
          <button
            onClick={() => onSelectStream('civil')}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border shadow-sm ${
              activeStream === 'civil'
                ? 'bg-[#D20A0B] border-[#D20A0B] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            CIVIL &amp; BIM (6)
          </button>
          <button
            onClick={() => onSelectStream('mechanical')}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border shadow-sm ${
              activeStream === 'mechanical'
                ? 'bg-[#D20A0B] border-[#D20A0B] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            MECHANICAL CAD/CAE (6)
          </button>
          <button
            onClick={() => onSelectStream('eee')}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors border shadow-sm ${
              activeStream === 'eee'
                ? 'bg-[#D20A0B] border-[#D20A0B] text-[#FFFFFF]'
                : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            ELECTRICAL &amp; EEE (6)
          </button>
        </div>

        {/* Courses Grid with Course Images */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpenDetails={onOpenCourseModal}
              />
            ))}
          </div>
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
