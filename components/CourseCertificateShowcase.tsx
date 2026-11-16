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
    <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        
        {/* LEFT COLUMN: Narrative matching exact CAD DESK layout in user Image 1 */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase block">
              Certificate
            </span>
            <div className="w-8 h-1 bg-[#F59E0B] rounded-full mt-1 mb-3"></div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#15304C] leading-tight">
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

          <div className="pt-2 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-[#F59E0B] flex items-center justify-center font-bold text-xs flex-shrink-0">
                ★
              </span>
              <span className="font-semibold">ISO 9001:2015 Global Quality Certified</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                ✓
              </span>
              <span className="font-semibold">Lifetime Online QR Code Verifiable Credential</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-[#15304C] flex items-center justify-center font-bold text-xs flex-shrink-0">
                🏢
              </span>
              <span className="font-semibold">Direct Recruiter Acceptance Across 500+ MNCs</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Official Certificate Sample matching exact Image 1 visual */}
        <div className="lg:col-span-7">
          <div className="relative bg-white rounded-xl border-2 border-slate-300 shadow-xl overflow-hidden p-5 sm:p-7 select-none">
            
            {/* Background Security Border Guilloche Pattern */}
            <div className="absolute inset-1.5 border border-dashed border-slate-300 pointer-events-none rounded-lg"></div>

            {/* Top-Left Navy & Gold Arc Decorative Elements */}
            <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full border-[10px] border-[#15304C]/10 pointer-events-none"></div>
            <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full border-[8px] border-[#F59E0B]/15 pointer-events-none"></div>

            {/* Certificate Header Bar */}
            <div className="flex items-start justify-between relative z-10 border-b border-slate-200 pb-3">
              {/* Gold Medal Badge */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#15304C] border-2 border-amber-300 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[7px] text-amber-300 font-extrabold uppercase tracking-widest leading-none">
                      CERTIFIED
                    </span>
                    <span className="text-[9px] text-white font-black leading-none my-0.5">
                      COURSE
                    </span>
                    <span className="text-[6px] text-amber-200 uppercase tracking-tighter leading-none">
                      PROGRAM
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 block">
                    www.caddeskindia.com
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ISO 9001:2015 ACCREDITED
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="text-right">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-wider uppercase leading-none">
                  CERTIFICATE
                </h3>
                <span className="text-[10px] sm:text-xs font-serif italic text-slate-500 tracking-widest uppercase block mt-0.5">
                  OF COMPLETION
                </span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="py-4 relative z-10 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-base sm:text-lg font-serif italic font-bold text-slate-800">
                    Congratulations !
                  </span>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 leading-tight max-w-[280px] sm:max-w-[340px] mt-0.5">
                    The Course you have completed, was designed to meet your learning needs with professional instructors, relevant content, authorized courseware and ongoing evaluation by PTTS.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm sm:text-base font-serif italic font-bold text-slate-900 underline decoration-slate-400 underline-offset-4">
                    Rakesh Kumar Beniwal
                  </span>
                  <span className="text-[9px] text-slate-400 block font-mono mt-0.5">
                    Candidate Name
                  </span>
                </div>
              </div>

              {/* Certificate Metadata 2-Column Table */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10.5px] sm:text-xs pt-1 border-t border-slate-100">
                <div className="space-y-1.5">
                  <div>
                    <span className="text-slate-400 font-medium block text-[9.5px]">Father / Guardian Name:</span>
                    <span className="font-bold text-slate-800">Ram Ji Lal Beniwal</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[9.5px]">Course Program Stream:</span>
                    <span className="font-bold text-[#15304C]">{course.category || 'Civil / Mechanical Engineering'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[9.5px]">Authorized Software Covered:</span>
                    <span className="font-extrabold text-[#D20A0B] truncate block">{mainTool} &amp; CAD Standards</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <div>
                    <span className="text-slate-400 font-medium block text-[9.5px]">Certificate Reg. No:</span>
                    <span className="font-mono font-bold text-slate-800">5001/00768</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[9.5px]">Course Lab Duration:</span>
                    <span className="font-bold text-slate-800">{course.duration || '8-10 Weeks (80 Hours)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block text-[9.5px]">Performance Grade:</span>
                    <span className="font-bold text-emerald-600">Grade A+ (Distinction)</span>
                  </div>
                </div>
              </div>

              {/* Training Center & Award Date */}
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center justify-between text-[10px]">
                <div>
                  <span className="text-slate-500 font-medium">Authorized Training Center: </span>
                  <strong className="text-slate-900 font-bold">CAD DESK AMEERPET HYDERABAD</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Issue Date: </span>
                  <strong className="text-slate-800 font-mono font-bold">10-08-2026</strong>
                </div>
              </div>
            </div>

            {/* Bottom Row: Official Logos, Stamp, QR Code & Signature */}
            <div className="flex items-end justify-between pt-2 border-t border-slate-200 relative z-10">
              {/* CAD DESK Official Logo & Tagline */}
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.png"
                  alt="CAD DESK"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
                <div className="border-l border-slate-300 pl-2 text-[8px] text-slate-500 leading-tight">
                  <span className="font-bold text-slate-700 block">CAD DESK INDIA</span>
                  <span>Registered Trademark</span>
                </div>
              </div>

              {/* QR Code Validation */}
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 bg-slate-900 p-1 rounded border border-slate-700 flex items-center justify-center">
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm-2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-4h2v2H8v-2zm2 2h2v2h-2v-2zm-2 2h2v2H8v-2z" />
                  </svg>
                </div>

                {/* ISO Seal */}
                <div className="w-9 h-9 rounded-full border-2 border-amber-500 flex flex-col items-center justify-center text-[7px] font-black text-amber-700 leading-none">
                  <span>ISO</span>
                  <span>9001</span>
                </div>

                {/* Managing Director Signature */}
                <div className="text-center pl-2">
                  <span className="font-serif italic font-extrabold text-sm text-slate-800 tracking-tight block">
                    M.S. Beniwal
                  </span>
                  <div className="w-20 h-px bg-slate-400 mx-auto my-0.5"></div>
                  <span className="text-[7.5px] uppercase font-bold text-slate-500 tracking-wider block">
                    MANAGING DIRECTOR
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent Diagonal "SAMPLE" Watermark matching exact Image 1 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20">
              <span className="text-slate-400/25 font-black text-5xl sm:text-7xl lg:text-8xl tracking-[0.25em] -rotate-25 uppercase font-sans border-4 border-slate-400/20 px-6 py-2 rounded-2xl">
                SAMPLE
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
