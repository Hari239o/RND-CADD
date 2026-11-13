'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, onEnroll }) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'capstone' | 'career'>('syllabus');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(true);

  if (!course) return null;

  // Safe Fallback Normalizations to guarantee rendering
  const toolsList: string[] = Array.isArray(course.tools) && course.tools.length > 0
    ? course.tools
    : typeof (course as any).software === 'string' && (course as any).software.trim()
    ? (course as any).software.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['AutoCAD 2026', 'Industry CAD Workstation'];

  const modulesList = Array.isArray(course.modules) && course.modules.length > 0
    ? course.modules
    : Array.isArray((course as any).syllabus) && (course as any).syllabus.length > 0
    ? (course as any).syllabus.map((s: string, idx: number) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: s,
        hours: 20,
        topics: [s, 'Practical lab drafting & validation'],
      }))
    : [
        {
          number: '01',
          title: `${course.title} - Core Fundamentals`,
          hours: 20,
          topics: ['2D drafting & 3D parametric foundations', 'Practical lab drafting & validation'],
        },
      ];

  const capstoneData = course.capstoneProject && course.capstoneProject.title
    ? course.capstoneProject
    : {
        title: `${course.title} Live Industry Project`,
        description: 'Real-world industrial drafting, modeling, and validation project with detailed bill of quantities.',
        deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
      };

  const careerList = Array.isArray(course.careerRoles) && course.careerRoles.length > 0
    ? course.careerRoles
    : ['CAD Design Engineer', 'Product Specialist', 'Project Engineer', 'Drafting Specialist'];

  const certificationText = course.certification || 'Autodesk & Dassault Certificate';
  const prerequisitesText = course.prerequisites || 'Diploma / B.Tech / Working Professional';
  const courseLevel = course.level || 'Professional';
  const totalHours = course.totalHours || (modulesList.reduce((acc: number, m: any) => acc + (m.hours || 0), 0) || 120);
  const streamText = course.stream || course.folder || 'ENGINEERING';
  const categoryText = course.category || 'PROFESSIONAL DIPLOMA';
  const feeAmount = Number(course.fee) || 32000;
  const recordingsCount = course.classes?.length || 4;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/85 backdrop-blur-md transition-all duration-200 overflow-hidden ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      }`}
    >
      {/* Modal Container */}
      <div
        className={`bg-[#FFFFFF] border border-[#CBD5E1] shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
          isFullscreen
            ? 'w-screen h-screen rounded-none border-none'
            : 'w-full max-w-[1600px] h-[94vh] rounded-2xl border-2 border-[#15304C]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#F1F5F9] border-b border-[#CBD5E1] px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-[#475569] flex-shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-6 w-auto object-contain flex-shrink-0"
            />
            <span className="font-bold text-[#15304C] truncate uppercase tracking-wider">
              COURSE BLUEPRINT SPECIFICATION
            </span>
            <span className="text-[#CBD5E1] hidden sm:inline">|</span>
            <span className="font-mono text-[#0284C7] font-bold hidden sm:inline">
              ID: {(course.code || course.id).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-2.5 flex-shrink-0">
            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[11px] font-bold text-[#15304C] flex items-center space-x-1.5 transition-colors"
              title={isFullscreen ? 'Exit Full Screen' : 'View Full Screen'}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M14 4h6m-6 0V1m0 3l7-3M4 10h6m0 0V4m0 6L3 3" />
                  </svg>
                  <span className="hidden md:inline">COMPACT</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="hidden md:inline">FULL SCREEN</span>
                </>
              )}
            </button>

            {/* Red Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FEF2F2] hover:bg-[#FEE2E2] active:scale-95 border-2 border-[#FECACA] hover:border-[#EF4444] text-[#DC2626] flex items-center justify-center transition-all shadow-sm flex-shrink-0 cursor-pointer"
              title="Close Blueprint"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8 space-y-6 bg-[#FFFFFF]">
          {/* Header Banner with Course-Specific Imagery */}
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-[#CBD5E1] border border-[#CBD5E1] rounded-xl shadow-inner">
            <img
              src={course.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase px-3 py-1 bg-[#D20A0B] text-[#FFFFFF] shadow-sm">
                  {streamText.toUpperCase()} ENGINEERING
                </span>
                <span className="text-xs uppercase px-3 py-1 bg-[#FFFFFF] border border-[#CBD5E1] text-[#0F172A] font-bold shadow-sm">
                  {categoryText}
                </span>
                <span className="text-xs uppercase px-3 py-1 bg-[#D20A0B] text-[#FFFFFF] font-black shadow-sm">
                  FEE: ₹{feeAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs uppercase px-3 py-1 bg-[#00873D] text-[#FFFFFF] font-bold shadow-sm">
                  {course.duration || '90 DAYS'} ({totalHours} HOURS)
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tight uppercase leading-tight drop-shadow-sm">
                {course.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm md:text-base text-[#E2E8F0] max-w-4xl leading-relaxed">
                {course.tagline || course.overview}
              </p>
            </div>
          </div>

          {/* Key Facts Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-[#F8FAFC] p-5 border border-[#E2E8F0] rounded-xl text-xs shadow-sm">
            <div>
              <span className="text-[#64748B] block font-semibold uppercase text-[11px]">TUITION FEE</span>
              <span className="text-[#D20A0B] font-black text-base sm:text-lg">₹{feeAmount.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[#64748B] block font-semibold uppercase text-[11px]">CERTIFICATION</span>
              <span className="text-[#0F172A] font-bold text-xs sm:text-sm block">{certificationText}</span>
            </div>
            <div>
              <span className="text-[#64748B] block font-semibold uppercase text-[11px]">PREREQUISITE</span>
              <span className="text-[#0F172A] font-bold text-xs sm:text-sm block">{prerequisitesText}</span>
            </div>
            <div>
              <span className="text-[#64748B] block font-semibold uppercase text-[11px]">CLASS RECORDINGS</span>
              <span className="text-[#00873D] font-bold text-xs sm:text-sm block">{recordingsCount} Lessons Included</span>
            </div>
            <div>
              <span className="text-[#64748B] block font-semibold uppercase text-[11px]">COURSE LEVEL</span>
              <span className="text-[#0F172A] font-bold text-xs sm:text-sm block">{courseLevel.toUpperCase()}</span>
            </div>
          </div>

          {/* Authorized Toolchain */}
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-2.5 tracking-wider uppercase">
              AUTHORIZED TOOLCHAIN
            </div>
            <div className="flex flex-wrap gap-2">
              {toolsList.map((tool: string) => (
                <div
                  key={tool}
                  className="px-3.5 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] text-xs text-[#0F172A] font-semibold rounded-md shadow-sm"
                >
                  <span className="text-[#D20A0B] font-bold mr-1.5">[+]</span>
                  {tool}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-[#CBD5E1] text-xs space-x-2 pt-2">
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`pb-3 px-5 font-bold uppercase transition-colors border-b-2 text-xs sm:text-sm ${
                activeTab === 'syllabus'
                  ? 'border-[#D20A0B] text-[#D20A0B]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              MODULE SYLLABUS ({modulesList.length} UNITS)
            </button>
            <button
              onClick={() => setActiveTab('capstone')}
              className={`pb-3 px-5 font-bold uppercase transition-colors border-b-2 text-xs sm:text-sm ${
                activeTab === 'capstone'
                  ? 'border-[#D20A0B] text-[#D20A0B]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              CAPSTONE PROJECT BLUEPRINT
            </button>
            <button
              onClick={() => setActiveTab('career')}
              className={`pb-3 px-5 font-bold uppercase transition-colors border-b-2 text-xs sm:text-sm ${
                activeTab === 'career'
                  ? 'border-[#D20A0B] text-[#D20A0B]'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              CAREER PATHWAYS
            </button>
          </div>

          {/* Tab Content 1: MODULE SYLLABUS */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              {modulesList.map((module) => (
                <div
                  key={module.number}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-xl shadow-sm hover:border-[#CBD5E1] transition-all"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-[#D20A0B] uppercase tracking-wide">
                      MODULE {module.number}
                    </span>
                    <span className="text-xs text-[#475569] border border-[#CBD5E1] px-2.5 py-1 bg-[#FFFFFF] font-bold rounded shadow-2xs">
                      {module.hours} LAB HOURS
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#0F172A] mb-3">
                    {module.title}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155]">
                    {(module.topics || []).map((topic, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-[#D20A0B] font-bold">-</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 2: CAPSTONE PROJECT BLUEPRINT */}
          {activeTab === 'capstone' && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-8 space-y-5 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-[#00873D] uppercase tracking-wider">
                MANDATORY PORTFOLIO PROJECT
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-[#0F172A]">
                {capstoneData.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed max-w-4xl">
                {capstoneData.description}
              </p>

              <div className="pt-4 border-t border-[#E2E8F0]">
                <div className="text-xs font-bold text-[#64748B] uppercase mb-3">
                  VERIFIED DELIVERABLES TO COMPLETE:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(capstoneData.deliverables || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#0F172A] flex items-center space-x-2.5 shadow-sm rounded-lg"
                    >
                      <span className="text-[#D20A0B] font-bold font-mono">[{idx + 1}]</span>
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: CAREER PATHWAYS */}
          {activeTab === 'career' && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-6 sm:p-8 space-y-5 rounded-xl shadow-sm">
              <div className="text-xs font-bold text-[#D20A0B] uppercase tracking-wider">
                JOB PLACEMENT TITLES
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {careerList.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] flex items-center justify-between shadow-sm rounded-lg"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{role}</span>
                    <span className="text-[11px] text-[#00873D] font-bold">[HIRING ACTIVE]</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer with Fast Enrollment CTA */}
        <div className="bg-[#F1F5F9] border-t border-[#CBD5E1] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div className="text-xs text-[#64748B]">
            <span className="text-[#0F172A] font-bold">TOTAL FEE:</span>{' '}
            <span className="text-[#D20A0B] font-black text-sm mr-2">₹{feeAmount.toLocaleString('en-IN')}</span>{' '}
            &bull; <span className="text-[#0F172A] font-bold ml-2">SCHEDULE:</span> WEEKDAY &amp; WEEKEND FAST-TRACK
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-[#FFFFFF] border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-bold uppercase transition-colors shadow-sm rounded-lg"
            >
              BACK TO CATALOG
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm rounded-lg"
            >
              ENROLL IN THIS PROGRAM -&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
