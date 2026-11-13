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

      // Persist enrolled course strictly to this specific student (NOT globally shared)
      try {
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('rnd_cadd_user');
          const currentLoggedIn = userStr ? JSON.parse(userStr) : null;
          const targetEmail = (email || currentLoggedIn?.email || '').toLowerCase().trim();

          if (targetEmail) {
            const studentKey = `rnd_cadd_enrolled_${targetEmail}`;
            const studentStored = localStorage.getItem(studentKey);
            const studentList: string[] = studentStored ? JSON.parse(studentStored) : [];
            if (!studentList.includes(selectedCourse)) {
              studentList.push(selectedCourse);
            }
            localStorage.setItem(studentKey, JSON.stringify(studentList));
          }

          // If the logged-in student matches this enrollment, update their active profile
          if (currentLoggedIn && (!targetEmail || currentLoggedIn.email?.toLowerCase() === targetEmail)) {
            const userCourses = Array.isArray(currentLoggedIn.assignedCourses) ? currentLoggedIn.assignedCourses : [];
            if (!userCourses.includes(selectedCourse)) {
              userCourses.push(selectedCourse);
            }
            currentLoggedIn.assignedCourses = userCourses;
            localStorage.setItem('rnd_cadd_user', JSON.stringify(currentLoggedIn));
            window.dispatchEvent(new Event('storage'));
          }
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
    <section id="enrollment" className="py-16 sm:py-20 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border-t border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#EE2C3C] border border-red-200 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EE2C3C] animate-pulse" />
            Admissions Open • Batch 2026
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Reserve Your CAD Workstation Seat
          </h2>
          <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
            Get guaranteed 1:1 dedicated workstation access, official licensed software, and personalized mentorship at our Ameerpet campus.
          </p>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Campus Benefits & Workstation Promise (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
              <img
                src="/logo.png"
                alt="RND CADD"
                className="h-10 w-auto object-contain"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  Ameerpet Campus Lab
                </h3>
                <p className="text-xs text-slate-500">
                  Guaranteed Hands-on Workstation
                </p>
              </div>
            </div>

            {/* Feature Cards with Clean Modern Icons */}
            <div className="space-y-3.5">
              {/* Feature 1 */}
              <div className="flex items-start gap-3.5 p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-red-50 text-[#EE2C3C] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    1:1 Dedicated Workstation
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every trainee gets an unshared, high-performance RTX GPU rig for lectures and unlimited open lab practice hours.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3.5 p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    Official Student Licenses
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Genuine institutional licenses provided for Autodesk, SolidWorks, Bentley, and EPLAN for laptop and home project practice.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3.5 p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                    Direct Placement Assistance
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Interview drives begin right after capstone project completion with our 120+ EPC and CAD hiring partners.
                  </p>
                </div>
              </div>
            </div>

            {/* Campus Info & Direct Contact */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Admissions Helpline:
                </span>
                <span className="font-bold text-slate-900">+91 98490 12345</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Campus Lab Hours:
                </span>
                <span className="font-semibold text-slate-900">7:00 AM – 9:30 PM (7 Days)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Friendly Application Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
            {submittedId ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                  Reservation Confirmed
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Registration ID: #{submittedId}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Your workstation seat is reserved. Our counselor will contact you at <span className="font-bold text-slate-900">{phone}</span> within 2 business hours.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => {
                      setSubmittedId(null);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                    }}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold transition-all cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Form Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Candidate Application
                    </h4>
                    <p className="text-xs text-slate-500">
                      Enter your details to reserve a workstation seat
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Zero Reservation Fee
                  </span>
                </div>

                {/* Candidate Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Candidate Full Name <span className="text-[#EE2C3C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikram Reddy"
                    className="w-full px-4 py-2.5 sm:py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/15 focus:outline-none transition-all"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-[#EE2C3C]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full px-4 py-2.5 sm:py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/15 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone / WhatsApp Number <span className="text-[#EE2C3C]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98490 12345"
                      className="w-full px-4 py-2.5 sm:py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/15 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Desired CAD Program <span className="text-[#EE2C3C]">*</span>
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/15 focus:outline-none transition-all cursor-pointer"
                  >
                    <optgroup label="Civil & BIM Architecture">
                      {coursesList
                        .filter((c) => ['civil', 'bim'].includes((c.folder || c.stream).toLowerCase()))
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Mechanical CAD/CAM/CAE">
                      {coursesList
                        .filter((c) => ['mechanical', 'cad'].includes((c.folder || c.stream).toLowerCase()))
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Electrical & Automation (EEE)">
                      {coursesList
                        .filter((c) => ['electrical', 'eee'].includes((c.folder || c.stream).toLowerCase()))
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Interior Architecture & Design">
                      {coursesList
                        .filter((c) => (c.folder || c.stream).toLowerCase() === 'interior')
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Construction & Project Management (PPM)">
                      {coursesList
                        .filter((c) => (c.folder || c.stream).toLowerCase() === 'ppm')
                        .map((c) => (
                          <option key={c.id} value={c.title}>
                            {c.title} ({c.duration})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Process Plant & Piping CAD">
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

                {/* Preferred Batch Timing with Friendly Cards */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Preferred Batch Timing <span className="text-[#EE2C3C]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'weekday-morning', title: 'Weekday Morning', time: '08:00 AM – 10:30 AM' },
                      { id: 'weekday-evening', title: 'Weekday Evening', time: '06:30 PM – 09:00 PM' },
                      { id: 'weekend-fasttrack', title: 'Weekend Fast-Track', time: 'Sat & Sun 10 AM – 3 PM' },
                    ].map((b) => {
                      const isSelected = preferredBatch === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setPreferredBatch(b.id)}
                          className={`p-3 text-left rounded-xl transition-all cursor-pointer border ${
                            isSelected
                              ? 'border-[#EE2C3C] bg-red-50/70 shadow-xs'
                              : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${isSelected ? 'text-[#EE2C3C]' : 'text-slate-800'}`}>
                              {b.title}
                            </span>
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#EE2C3C] bg-[#EE2C3C]' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                          <div className={`text-[11px] font-medium ${isSelected ? 'text-red-700' : 'text-slate-500'}`}>
                            {b.time}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#EE2C3C] via-[#E01829] to-[#D20A0B] hover:from-[#D20A0B] hover:to-[#B50809] shadow-md hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span>Allocating Workstation Seat...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Workstation Reservation</span>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Sub-note */}
                <p className="text-[11px] text-center text-slate-500 pt-1">
                  Zero reservation fee • Free demo class and counseling included
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
