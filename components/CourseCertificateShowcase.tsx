'use client';

import React from 'react';
import type { Course } from '@/lib/courses-data';

interface CourseCertificateShowcaseProps {
  course: Course;
}

export const CourseCertificateShowcase: React.FC<CourseCertificateShowcaseProps> = ({ course }) => {
  const toolsList: string[] = typeof (course as any).software === 'string' && (course as any).software.trim()
    ? (course as any).software.split(',').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(course.tools) && course.tools.length > 0
    ? course.tools
    : ['AutoCAD 2026', 'Industry CAD Workstation', 'Parametric 3D Suite'];

  const mainTool = toolsList[0] || course.title;

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 lg:p-9 shadow-sm space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-center">
        
        {/* LEFT COLUMN: Narrative matching exact CAD DESK layout */}
        <div className="lg:col-span-5 space-y-3.5">
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase block">
              Certificate
            </span>
            <div className="w-10 h-1 bg-[#EE2C3C] rounded-full mt-1.5 mb-2.5"></div>
            <h2 className="text-xl sm:text-2xl lg:text-[30px] font-bold text-slate-900 leading-tight">
              How will you get your certificate?
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
            CAD DESK is a pioneer in CAD/CAM/CAE training and most of the industries give great recognition to its certificate throughout India and abroad.{' '}
            <strong className="text-slate-900 font-bold">
              {course.title} Training Certificates
            </strong>{' '}
            are ISO verified which makes it highly reputed comparing to the other local brands and helps the student get prioritize while going for job opportunities in the industry. CAD DESK Software Training is conducted by highly knowledgeable trainers which help students to enhance their skill set by putting great emphasizes on project-based learning.
          </p>

          <div className="pt-1 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-slate-800 font-medium">
              <span className="w-4.5 h-4.5 rounded-full bg-amber-100 text-[#F59E0B] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                ★
              </span>
              <span>ISO 9001:2015 Global Quality Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-800 font-medium">
              <span className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                ✓
              </span>
              <span>Lifetime Online QR Code Verifiable Credential</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-800 font-medium">
              <span className="w-4.5 h-4.5 rounded-full bg-blue-100 text-[#15304C] flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                🏢
              </span>
              <span>Direct Recruiter Acceptance Across 500+ MNCs</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Official Compact Certificate Specimen */}
        <div className="lg:col-span-7">
          {(course as any).certificateImage ? (
            <div className="relative bg-white rounded-xl sm:rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden p-2 select-none group">
              <img
                src={(course as any).certificateImage}
                alt={`${course.title} Certificate of Completion`}
                className="w-full h-auto object-contain rounded-xl border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute bottom-3 right-3 bg-[#15304C]/95 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Verified Certificate Specimen</span>
              </div>
            </div>
          ) : (
            <div className="relative bg-[#FCFDFE] rounded-xl sm:rounded-2xl border-2 border-slate-200/90 shadow-lg overflow-hidden p-3 sm:p-5 lg:p-6 select-none max-w-full">
            
            {/* Background Security Border Double Guilloche Hairline */}
            <div className="absolute inset-1 sm:inset-1.5 border border-[#15304C]/25 pointer-events-none rounded-lg sm:rounded-xl"></div>
            <div className="absolute inset-2 sm:inset-3 border border-[#F59E0B]/35 pointer-events-none rounded-md sm:rounded-lg"></div>

            {/* Corner Decorative Accents */}
            <div className="absolute -top-10 -left-10 w-20 h-20 sm:w-28 sm:h-28 rounded-full border-[5px] sm:border-[8px] border-[#15304C]/10 pointer-events-none"></div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 sm:w-24 sm:h-24 rounded-full border-[5px] sm:border-[7px] border-[#F59E0B]/15 pointer-events-none"></div>

            {/* Certificate Header Bar */}
            <div className="flex items-start justify-between gap-2 sm:gap-4 relative z-10 border-b border-slate-200 pb-2 sm:pb-2.5">
              {/* Gold Medal Badge */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-[#15304C] border border-amber-300 sm:border-2 flex flex-col items-center justify-center text-center p-0.5">
                    <span className="text-[5px] sm:text-[6.5px] text-amber-300 font-extrabold uppercase tracking-widest leading-none">
                      CERTIFIED
                    </span>
                    <span className="text-[6.5px] sm:text-[8px] text-white font-black leading-none my-0.5">
                      COURSE
                    </span>
                    <span className="text-[4.5px] sm:text-[5.5px] text-amber-200 uppercase tracking-tighter leading-none">
                      PROGRAM
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[8px] sm:text-[9.5px] font-mono font-bold text-slate-500 block truncate">
                    www.caddeskindia.com
                  </span>
                  <span className="text-[7px] sm:text-[8.5px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block leading-none mt-0.5">
                    ISO 9001:2015 ACCREDITED
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="text-right">
                <h3 className="text-xs sm:text-lg lg:text-xl font-serif font-black text-slate-900 tracking-wide uppercase leading-none">
                  CERTIFICATE
                </h3>
                <span className="text-[7px] sm:text-[9.5px] font-serif italic text-slate-500 tracking-widest uppercase block mt-0.5">
                  OF COMPLETION
                </span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="py-2 sm:py-3 relative z-10 space-y-1.5 sm:space-y-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-base font-serif italic font-bold text-slate-800">
                    Congratulations !
                  </span>
                  <p className="text-[7.5px] sm:text-[9.5px] text-slate-500 leading-tight max-w-[320px] mt-0.5 line-clamp-1 sm:line-clamp-none">
                    Designed to meet industrial CAD standards with authorized courseware and evaluations.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] sm:text-sm font-serif italic font-bold text-slate-900 underline decoration-slate-400 underline-offset-2 block">
                    Rakesh Kumar Beniwal
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-slate-400 block font-mono">
                    Candidate Name
                  </span>
                </div>
              </div>

              {/* Certificate Metadata: 2-Column Grid on both Mobile and Desktop */}
              <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-1.5 text-[8px] sm:text-[10px] pt-1.5 border-t border-slate-100">
                <div className="space-y-0.5 sm:space-y-1">
                  <div>
                    <span className="text-slate-400 font-medium block text-[7px] sm:text-[8.5px]">Father / Guardian:</span>
                    <span className="font-bold text-slate-800 truncate block">Ram Ji Lal Beniwal</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[7px] sm:text-[8.5px]">Program Stream:</span>
                    <span className="font-bold text-[#15304C] truncate block">{course.category || 'Civil / Mechanical'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[7px] sm:text-[8.5px]">Software Covered:</span>
                    <span className="font-extrabold text-[#D20A0B] truncate block">{mainTool}</span>
                  </div>
                </div>

                <div className="space-y-0.5 sm:space-y-1 text-right">
                  <div>
                    <span className="text-slate-400 font-medium block text-[7px] sm:text-[8.5px]">Certificate Reg. No:</span>
                    <span className="font-mono font-bold text-slate-800">5001/00768</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[7px] sm:text-[8.5px]">Lab Duration:</span>
                    <span className="font-bold text-slate-800">{course.duration || '80 Hours'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[7px] sm:text-[8.5px]">Performance Grade:</span>
                    <span className="font-bold text-emerald-600">Grade A+ (Distinction)</span>
                  </div>
                </div>
              </div>

              {/* Training Center & Award Date */}
              <div className="bg-slate-50/90 rounded-md p-1.5 sm:p-2 border border-slate-200/80 flex items-center justify-between text-[7.5px] sm:text-[9px]">
                <div className="truncate mr-2">
                  <span className="text-slate-500">Center: </span>
                  <strong className="text-slate-900 font-bold">CAD DESK Ameerpet, Hyderabad</strong>
                </div>
                <div className="shrink-0">
                  <span className="text-slate-500">Date: </span>
                  <strong className="text-slate-800 font-mono font-bold">10-08-2026</strong>
                </div>
              </div>
            </div>

            {/* Bottom Row: Official Logos, Stamp, QR Code & Signature */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-3 pt-1.5 sm:pt-2 border-t border-slate-200 relative z-10">
              {/* CAD DESK Official Logo & Tagline */}
              <div className="flex items-center space-x-1.5">
                <img
                  src="/logo.png"
                  alt="CAD DESK"
                  className="h-5 sm:h-7 w-auto object-contain"
                />
                <div className="border-l border-slate-300 pl-1 sm:pl-1.5 text-[6.5px] sm:text-[7.5px] text-slate-500 leading-none">
                  <span className="font-bold text-slate-700 block">CAD DESK</span>
                  <span>Registered Trademark</span>
                </div>
              </div>

              {/* QR Code Validation, ISO Seal & Signature */}
              <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                {/* QR Code */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-slate-900 p-0.5 rounded border border-slate-700 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-4h2v2H8v-2zm2 2h2v2h-2v-2zm-2 2h2v2H8v-2z" />
                  </svg>
                </div>

                {/* ISO Seal */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-1.5 sm:border-2 border-amber-500 flex flex-col items-center justify-center text-[5px] sm:text-[6.5px] font-black text-amber-700 leading-none shrink-0 bg-amber-50/50">
                  <span>ISO</span>
                  <span>9001</span>
                </div>

                {/* Managing Director Signature */}
                <div className="text-center pl-1 shrink-0">
                  <span className="font-serif italic font-extrabold text-[10px] sm:text-xs text-slate-800 tracking-tight block leading-tight">
                    M.S. Beniwal
                  </span>
                  <div className="w-12 sm:w-16 h-px bg-slate-400 mx-auto my-0.5"></div>
                  <span className="text-[5.5px] sm:text-[6.5px] uppercase font-bold text-slate-500 tracking-wider block leading-none">
                    MANAGING DIRECTOR
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle Diagonal "SAMPLE" Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
              <span className="text-slate-400/15 font-black text-3xl sm:text-6xl lg:text-7xl tracking-[0.2em] -rotate-20 uppercase font-sans border border-slate-400/10 px-3 py-1 rounded-lg">
                SAMPLE
              </span>
            </div>

          </div>
          )}
        </div>

      </div>
    </section>
  );
};
