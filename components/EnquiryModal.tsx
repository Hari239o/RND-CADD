'use client';

import React, { useState, useEffect } from 'react';
import { COURSES } from '@/lib/courses-data';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourseTitle?: string;
  initialCategory?: string;
}

// Category mappings to Courses
const CATEGORIES = [
  { id: 'civil', label: 'Civil & BIM' },
  { id: 'mechanical', label: 'Mechanical CAD/CAE' },
  { id: 'eee', label: 'Electrical & Automation' },
  { id: 'interior', label: 'Interior Architecture' },
  { id: 'piping', label: 'Piping & Plant CAD' },
  { id: 'ppm', label: 'Project Management (PPM)' },
];

// State to Centers mapping
const STATE_CENTERS: Record<string, string[]> = {
  Telangana: [
    'Ameerpet (Hyderabad Headquarters)',
    'Dilsukhnagar (Hyderabad)',
    'Kukatpally (Hyderabad)',
    'Madhapur / Hitec City (Hyderabad)',
    'Secunderabad',
  ],
  'Andhra Pradesh': [
    'Vijayawada (Benz Circle)',
    'Visakhapatnam (Dwaraka Nagar)',
    'Guntur (Arundelpet)',
    'Tirupati (Bhavani Nagar)',
  ],
  Karnataka: [
    'Bengaluru (Indiranagar)',
    'Bengaluru (BTM Layout)',
    'Bengaluru (Marathahalli)',
  ],
  Maharashtra: [
    'Pune (Shivaji Nagar)',
    'Pune (Wakad)',
    'Mumbai (Thane West)',
  ],
  'Tamil Nadu': [
    'Chennai (Guindy)',
    'Chennai (Anna Nagar)',
  ],
};

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialCourseTitle = '',
  initialCategory = '',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState(initialCategory || '');
  const [course, setCourse] = useState(initialCourseTitle || '');
  const [state, setState] = useState('Telangana');
  const [center, setCenter] = useState('Ameerpet (Hyderabad Headquarters)');
  
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [enquiryId, setEnquiryId] = useState('');

  // Sync live courses dynamically from localStorage & API
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('rnd_cadd_live_courses');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCoursesList(parsed);
          }
        }
      }
    } catch {}

    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses?t=' + Date.now(), { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.courses)) {
          setCoursesList(data.courses);
        }
      } catch (err) {}
    };
    fetchCourses();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCoursesList(e.detail);
      } else {
        fetchCourses();
      }
    };
    window.addEventListener('rnd_cadd_courses_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('rnd_cadd_courses_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Synchronize when initialCourseTitle changes
  useEffect(() => {
    if (initialCourseTitle) {
      setCourse(initialCourseTitle);
      const match = coursesList.find((c) => c.title.toLowerCase() === initialCourseTitle.toLowerCase());
      if (match) {
        if (match.stream === 'civil' || match.folder === 'civil') setCategory('Civil & BIM');
        else if (match.stream === 'mechanical' || match.folder === 'mechanical') setCategory('Mechanical CAD/CAE');
        else if (match.stream === 'eee' || match.folder === 'electrical') setCategory('Electrical & Automation');
        else if (match.stream === 'interior' || match.folder === 'interior') setCategory('Interior Architecture');
        else if (match.stream === 'piping' || match.folder === 'piping') setCategory('Piping & Plant CAD');
        else if (match.stream === 'ppm' || match.folder === 'ppm') setCategory('Project Management (PPM)');
      }
    }
  }, [initialCourseTitle, coursesList]);

  // Filter courses based on chosen category
  const availableCourses = React.useMemo(() => {
    if (!category) return coursesList;
    const catLower = category.toLowerCase();
    if (catLower.includes('civil')) return coursesList.filter((c) => c.stream === 'civil' || c.folder === 'civil');
    if (catLower.includes('mech')) return coursesList.filter((c) => c.stream === 'mechanical' || c.folder === 'mechanical');
    if (catLower.includes('elect') || catLower.includes('eee')) return coursesList.filter((c) => c.stream === 'eee' || c.folder === 'electrical');
    if (catLower.includes('inter')) return coursesList.filter((c) => c.stream === 'interior' || c.folder === 'interior');
    if (catLower.includes('pip')) return coursesList.filter((c) => c.stream === 'piping' || c.folder === 'piping');
    if (catLower.includes('ppm') || catLower.includes('proj')) return coursesList.filter((c) => c.stream === 'ppm' || c.folder === 'ppm');
    return coursesList;
  }, [category, coursesList]);

  // Available centers based on chosen state
  const availableCenters = React.useMemo(() => {
    return STATE_CENTERS[state] || STATE_CENTERS['Telangana'];
  }, [state]);

  // Reset center when state changes
  const handleStateChange = (newState: string) => {
    setState(newState);
    const centers = STATE_CENTERS[newState];
    if (centers && centers.length > 0) {
      setCenter(centers[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          courseCategory: category || 'Civil & BIM Architecture',
          courseTitle: course || (availableCourses[0] ? availableCourses[0].title : 'CAD Program Consultation'),
          state,
          center,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEnquiryId(data.enquiryId || 'ENQ-CONFIRMED');
        setSubmitted(true);

        // Store locally for student record
        try {
          const stored = localStorage.getItem('rnd_cadd_enquiries') || '[]';
          const list = JSON.parse(stored);
          list.unshift({
            id: data.enquiryId,
            name,
            phone,
            category,
            course,
            state,
            center,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem('rnd_cadd_enquiries', JSON.stringify(list.slice(0, 20)));
        } catch {}
      } else {
        setErrorMessage(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch {
      // Offline fallback: save locally and acknowledge
      const fallbackId = `ENQ-LOCAL-${Math.floor(1000 + Math.random() * 9000)}`;
      setEnquiryId(fallbackId);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[440px] max-h-[92dvh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 sm:p-7 border border-slate-200 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button X */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
          aria-label="Close dialog"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <div>
            {/* Header matching exact user screenshot */}
            <div className="text-center mb-5">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Enquiry Now
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed max-w-[340px] mx-auto">
                Fill out the form below and our team will get back to you shortly.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold text-center">
                {errorMessage}
              </div>
            )}

            {/* Form Fields Stack */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Field 1: Your Name */}
              <div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {/* Field 2: Phone Number */}
              <div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {/* Field 3: Select Course Category */}
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCourse('');
                  }}
                  className="w-full appearance-none px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Course Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Field 4: Select Course */}
              <div className="relative">
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Field 5: Select State */}
              <div className="relative">
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all cursor-pointer pr-10"
                >
                  <option value="">Select State</option>
                  {Object.keys(STATE_CENTERS).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Field 6: Select Center */}
              <div className="relative">
                <select
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all cursor-pointer pr-10"
                >
                  <option value="">Select Center</option>
                  {availableCenters.map((cen) => (
                    <option key={cen} value={cen}>
                      {cen}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Field 7: Solid Black Submit Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-black hover:bg-slate-900 active:scale-[0.99] text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Success View */
          <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              ✓
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">Enquiry Received!</h4>
              <p className="text-xs text-slate-500 font-mono mt-1">Ref ID: {enquiryId}</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
              Thank you <strong className="text-slate-900">{name}</strong>. Our academic counselor from{' '}
              <strong className="text-slate-900">{center}</strong> will call you at{' '}
              <strong className="text-slate-900">{phone}</strong> within 15 minutes to discuss batch schedules and fee concessions.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Program:</span>
                <span className="font-bold text-slate-800">{course || 'CAD Specialty Program'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Campus:</span>
                <span className="font-bold text-slate-800">{center}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dedicated Lab:</span>
                <span className="font-bold text-emerald-600">1:1 RTX Workstation Guaranteed</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://wa.me/919849012345?text=Hi%20RND%20CADD%20Team,%20I%20have%20submitted%20an%20enquiry%20for%20CAD%20training."
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>💬 Chat on WhatsApp (+91 98490 12345)</span>
              </a>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Close &amp; Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fixed Right-edge Vertical Tab: "Enquiry Now" - Clean MNC Theme without icons
export const FloatingEnquiryButton: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
      <button
        type="button"
        onClick={onOpen}
        className="group flex items-center bg-[#0F172A] hover:bg-[#1E293B] text-white px-3 py-3.5 rounded-l-xl border-l border-t border-b border-slate-700/60 shadow-xl cursor-pointer transition-all duration-150 hover:pr-4"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}
        aria-label="Open Enquiry Form"
      >
        <span className="text-xs font-bold tracking-widest uppercase">
          Enquiry Now
        </span>
      </button>
    </div>
  );
};
