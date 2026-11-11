'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';

interface CourseCardProps {
  course: Course;
  onOpenDetails: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onOpenDetails }) => {
  const [imageError, setImageError] = useState(false);

  const getPartnerInfo = (stream: string) => {
    const s = (stream || '').toLowerCase();
    switch (s) {
      case 'civil':
        return {
          partner: 'Autodesk & Bentley Systems',
          logoText: 'BIM',
          fallbackImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        };
      case 'mechanical':
        return {
          partner: 'Dassault Systèmes & PTC',
          logoText: 'CAD',
          fallbackImg: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        };
      case 'eee':
      case 'electrical':
        return {
          partner: 'Siemens & EPLAN Automation',
          logoText: 'E-CAD',
          fallbackImg: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1200&q=80',
        };
      case 'interior':
        return {
          partner: 'Chaos Group & Trimble',
          logoText: '3D-VIS',
          fallbackImg: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
        };
      case 'ppm':
        return {
          partner: 'Oracle Primavera & Microsoft',
          logoText: 'PPM',
          fallbackImg: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
        };
      case 'piping':
        return {
          partner: 'Hexagon SP3D & Plant 3D',
          logoText: 'PIPE',
          fallbackImg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
        };
      default:
        return {
          partner: 'Autodesk Certified Partner',
          logoText: 'CADD',
          fallbackImg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        };
    }
  };

  const partnerInfo = getPartnerInfo(course.stream || course.folder || '');
  const courseImage = imageError || !course.image ? partnerInfo.fallbackImg : course.image;

  return (
    <div
      onClick={() => onOpenDetails(course)}
      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
    >
      <div>
        {/* Course Banner Image with Floating Circular Partner Badge */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 rounded-t-3xl">
          <img
            src={courseImage}
            alt={course.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Floating Circular Badge Overlapping Bottom Right */}
          <div className="absolute -bottom-5 right-5 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1 z-10">
            <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-[#131313] tracking-tighter">
              {partnerInfo.logoText}
            </div>
          </div>

          {/* Top-Left Category & Stream Pills */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5">
            <span className="px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-[#131313] text-[10px] font-bold shadow-xs uppercase">
              {course.stream || 'ENGINEERING'}
            </span>
            {course.fee && (
              <span className="px-2.5 py-1 rounded-full bg-[#EE2C3C] text-white text-[10px] font-bold shadow-xs">
                ₹{course.fee.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-6 pt-5 space-y-3.5">
          {/* Sub-heading / Partner Info in Gray */}
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {partnerInfo.partner}
          </div>

          {/* Program Title */}
          <h4 className="text-base sm:text-lg font-bold text-[#131313] leading-snug group-hover:text-[#EE2C3C] transition-colors line-clamp-2">
            {course.title}
          </h4>

          {/* Key Specs with Clean Outlines (Matches Image 2) */}
          <div className="space-y-2 pt-1 text-xs text-slate-600 font-medium">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span className="text-[#131313] font-semibold">
                {course.certification || course.level || 'Executive Diploma'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{course.duration || '12 Weeks (120 Hours)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Bottom Buttons Row (Matches Image 2: "View Program" & "↓ Syllabus") */}
      <div className="p-6 pt-0 flex items-center gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(course);
          }}
          className="flex-1 py-2.5 px-4 rounded-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs sm:text-sm font-semibold text-center transition-colors shadow-2xs hover:bg-slate-50 cursor-pointer"
        >
          View Program
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(course);
          }}
          className="flex-1 py-2.5 px-4 rounded-full bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold text-center transition-colors shadow-sm flex items-center justify-center space-x-1 cursor-pointer"
        >
          <span>&darr; Syllabus</span>
        </button>
      </div>
    </div>
  );
};
