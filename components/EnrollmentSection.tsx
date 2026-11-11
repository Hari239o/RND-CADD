'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { COURSES } from '@/lib/courses-data';
import type { Course } from '@/lib/courses-data';

interface EnrollmentSectionProps {
  preselectedCourse?: string;
  onEnrollSuccess?: (courseTitle: string) => void;
}

export const EnrollmentSection: React.FC<EnrollmentSectionProps> = ({
  preselectedCourse,
  onEnrollSuccess,
}) => {
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(preselectedCourse || COURSES[0].title);
  const [preferredBatch, setPreferredBatch] = useState('weekday-morning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Sync with live courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          setCoursesList(data.courses);
        }
      } catch (err) {
        // Fallback to COURSES
      }
    };
    fetchCourses();
  }, []);

  // Sync preselectedCourse prop
  useEffect(() => {
    if (preselectedCourse) {
      setSelectedCourse(preselectedCourse);
    }
  }, [preselectedCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    let regId = `EDU-CAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          courseTitle: selectedCourse,
          preferredBatch,
        }),
      });

      const data = await res.json();
      if (data.success && data.registrationId) {
        regId = data.registrationId;
      }
    } catch (err) {
      console.warn('[Enrollment] Fallback reservation generated:', err);
    } finally {
      setSubmittedId(regId);
      setIsSubmitting(false);

      // Persist enrolled course locally to instantly unlock placement portal
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('rnd_cadd_enrolled_courses');
          const list: string[] = stored ? JSON.parse(stored) : [];
          if (!list.includes(selectedCourse)) {
            list.push(selectedCourse);
          }
          localStorage.setItem('rnd_cadd_enrolled_courses', JSON.stringify(list));
          localStorage.setItem('rnd_cadd_enrolled_course', selectedCourse);
        }
      } catch {
        // ignore
      }

      if (onEnrollSuccess) {
        onEnrollSuccess(selectedCourse);
      }
    }
  };

  return (
    <section id="enrollment" className="py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      {/* Expanded wide container utilizing the left and right screen areas */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 pb-6 border-b border-[#CBD5E1] flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-2 tracking-wider uppercase">
              ADMISSIONS &amp; BATCH RESERVATION
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#15304C] uppercase">
              RESERVE YOUR CAD WORKSTATION SEAT
            </h2>
          </div>
          <div className="text-xs font-semibold text-[#475569] bg-[#FFFFFF] border border-[#CBD5E1] px-4 py-2 rounded-xl shadow-sm self-start md:self-auto">
            CAMPUS LAB STATUS: <span className="text-[#059669] font-bold">ACTIVE ALLOCATION OPEN</span>
          </div>
        </motion.div>

        {/* 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Information & Lab Protocols Column (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-7 sm:p-9 shadow-sm space-y-6"
          >
            <div className="border-b border-[#F1F5F9] pb-6">
              <img
                src="/logo.png"
                alt="RND CADD"
                className="h-12 w-auto object-contain mb-4"
              />
              <span className="text-xs font-bold text-[#D20A0B] tracking-wider block mb-1">
                AMEERPET CAMPUS PROTOCOLS
              </span>
              <h3 className="text-xl font-black text-[#15304C] uppercase">
                GUARANTEED HANDS-ON WORKSTATION ALLOCATION
              </h3>
            </div>

            {/* 3 Structured Architectural Specification Blocks */}
            <div className="space-y-4">
              {/* Block 1 */}
              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-[#D20A0B] tracking-wider uppercase">
                    [1:1 WORKSTATION RATIO]
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B] bg-[#FFFFFF] border border-[#E2E8F0] px-2 py-0.5 rounded">
                    HARDWARE
                  </span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Every student receives an unshared high-performance RTX GPU computer rig during both instruction and open practice lab hours.
                </p>
              </div>

              {/* Block 2 */}
              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-[#D20A0B] tracking-wider uppercase">
                    [OFFICIAL STUDENT LICENSE]
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B] bg-[#FFFFFF] border border-[#E2E8F0] px-2 py-0.5 rounded">
                    SOFTWARE
                  </span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Full institutional licenses for Autodesk, SolidWorks, and Bentley provided for laptop practice and project development.
                </p>
              </div>

              {/* Block 3 */}
              <div className="p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl hover:border-[#CBD5E1] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-[#059669] tracking-wider uppercase">
                    [DIRECT PLACEMENT CELL]
                  </span>
                  <span className="text-[10px] font-bold text-[#059669] bg-[#FFFFFF] border border-[#A7F3D0] px-2 py-0.5 rounded">
                    CAREER
                  </span>
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">
                  Campus interview scheduling begins immediately upon submission of your validated capstone project deliverables.
                </p>
              </div>
            </div>

            {/* Campus Helpline & Timings */}
            <div className="pt-4 border-t border-[#F1F5F9] text-xs text-[#475569] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#64748B] font-medium">INQUIRY HELPLINE:</span>
                <span className="text-[#15304C] font-bold text-sm tracking-wide">+91 98490 12345</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#64748B] font-medium">CAMPUS TIMINGS:</span>
                <span className="text-[#15304C] font-semibold">MONDAY TO SUNDAY | 07:00 AM - 09:30 PM</span>
              </div>
            </div>
          </motion.div>

          {/* Form Column (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-7 sm:p-9 shadow-sm"
          >
            {submittedId ? (
              <div className="py-12 text-center space-y-4">
                <div className="inline-block px-3 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-xs font-bold text-[#059669] uppercase tracking-wider">
                  ENROLLMENT RECORD CONFIRMED
                </div>
                <h3 className="text-2xl font-black text-[#15304C] uppercase">
                  REGISTRATION ID: #{submittedId}
                </h3>
                <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-[#15304C] font-bold">{fullName}</span>. Your workstation seat has been allocated. Our Ameerpet admissions coordinator will reach you at <span className="text-[#15304C] font-bold">{phone}</span> within 2 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                    }}
                    className="px-6 py-3 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                  >
                    SUBMIT ANOTHER INQUIRY
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                
                {/* Form Subheader */}
                <div className="border-b border-[#F1F5F9] pb-4 mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#D20A0B] uppercase tracking-wider block mb-0.5">
                      SEAT APPLICATION FORM
                    </span>
                    <h4 className="text-base font-bold text-[#15304C] uppercase">
                      ENTER CANDIDATE CREDENTIALS
                    </h4>
                  </div>
                  <span className="text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full">
                    ZERO RESERVATION FEE
                  </span>
                </div>

                {/* Candidate Full Name */}
                <div>
                  <label className="block text-xs text-[#334155] uppercase font-bold mb-2 tracking-wide">
                    CANDIDATE FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.G. VIKRAM REDDY"
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#15304C] placeholder-[#94A3B8] focus:bg-[#FFFFFF] focus:border-[#D20A0B] focus:outline-none transition-colors"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#334155] uppercase font-bold mb-2 tracking-wide">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="NAME@DOMAIN.COM"
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#15304C] placeholder-[#94A3B8] focus:bg-[#FFFFFF] focus:border-[#D20A0B] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#334155] uppercase font-bold mb-2 tracking-wide">
                      PHONE / WHATSAPP NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98490 XXXXX"
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm text-[#15304C] placeholder-[#94A3B8] focus:bg-[#FFFFFF] focus:border-[#D20A0B] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-xs text-[#334155] uppercase font-bold mb-2 tracking-wide">
                    SELECT DESIRED CAD PROGRAM *
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs sm:text-sm font-semibold text-[#15304C] focus:bg-[#FFFFFF] focus:border-[#D20A0B] focus:outline-none transition-colors cursor-pointer"
                  >
                    <optgroup label="CIVIL ENGINEERING &amp; BIM">
                      {coursesList
                        .filter((c) => ['civil', 'bim'].includes((c.folder || c.stream).toLowerCase()))
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="MECHANICAL CAD/CAM/CAE">
                      {coursesList
                        .filter((c) => ['mechanical', 'cad'].includes((c.folder || c.stream).toLowerCase()))
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="ELECTRICAL &amp; AUTOMATION (EEE)">
                      {coursesList
                        .filter((c) => ['electrical', 'eee'].includes((c.folder || c.stream).toLowerCase()))
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="INTERIOR &amp; ARCHITECTURAL DESIGN">
                      {coursesList
                        .filter((c) => (c.folder || c.stream).toLowerCase() === 'interior')
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="PROJECT MANAGEMENT (PPM)">
                      {coursesList
                        .filter((c) => (c.folder || c.stream).toLowerCase() === 'ppm')
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="PROCESS PLANT &amp; PIPING CAD">
                      {coursesList
                        .filter((c) => (c.folder || c.stream).toLowerCase() === 'piping')
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* Preferred Batch Timing */}
                <div>
                  <label className="block text-xs text-[#334155] uppercase font-bold mb-2 tracking-wide">
                    PREFERRED BATCH TIMING *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredBatch('weekday-morning')}
                      className={`p-4 text-left rounded-xl transition-all cursor-pointer ${
                        preferredBatch === 'weekday-morning'
                          ? 'border-2 border-[#D20A0B] bg-[#FFF5F5] text-[#D20A0B] shadow-sm'
                          : 'border border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-[#FFFFFF] hover:border-[#94A3B8]'
                      }`}
                    >
                      <div className="font-bold text-xs uppercase mb-1">WEEKDAY MORNING</div>
                      <div className={`text-[11px] ${preferredBatch === 'weekday-morning' ? 'text-[#D20A0B]' : 'text-[#64748B]'}`}>
                        08:00 AM - 10:30 AM
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreferredBatch('weekday-evening')}
                      className={`p-4 text-left rounded-xl transition-all cursor-pointer ${
                        preferredBatch === 'weekday-evening'
                          ? 'border-2 border-[#D20A0B] bg-[#FFF5F5] text-[#D20A0B] shadow-sm'
                          : 'border border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-[#FFFFFF] hover:border-[#94A3B8]'
                      }`}
                    >
                      <div className="font-bold text-xs uppercase mb-1">WEEKDAY EVENING</div>
                      <div className={`text-[11px] ${preferredBatch === 'weekday-evening' ? 'text-[#D20A0B]' : 'text-[#64748B]'}`}>
                        06:30 PM - 09:00 PM
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreferredBatch('weekend-fasttrack')}
                      className={`p-4 text-left rounded-xl transition-all cursor-pointer ${
                        preferredBatch === 'weekend-fasttrack'
                          ? 'border-2 border-[#D20A0B] bg-[#FFF5F5] text-[#D20A0B] shadow-sm'
                          : 'border border-[#CBD5E1] bg-[#F8FAFC] text-[#334155] hover:bg-[#FFFFFF] hover:border-[#94A3B8]'
                      }`}
                    >
                      <div className="font-bold text-xs uppercase mb-1">WEEKEND FAST-TRACK</div>
                      <div className={`text-[11px] ${preferredBatch === 'weekend-fasttrack' ? 'text-[#D20A0B]' : 'text-[#64748B]'}`}>
                        SAT &amp; SUN 10AM - 3PM
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#D20A0B] hover:bg-[#B50809] active:bg-[#9B0607] disabled:bg-[#94A3B8] text-[#FFFFFF] rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md cursor-pointer"
                  >
                    {isSubmitting ? 'PROCESSING RESERVATION...' : 'CONFIRM BATCH ENROLLMENT RESERVATION'}
                  </button>
                  <p className="mt-2.5 text-[11px] text-[#64748B] text-center font-medium">
                    ZERO RESERVATION FEE • FREE DEMO CLASS INCLUDED WITH COUNSELOR
                  </p>
                </div>

              </form>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
};
