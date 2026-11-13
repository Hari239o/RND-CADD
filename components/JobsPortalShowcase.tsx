'use client';

import React, { useState, useEffect } from 'react';
import type { JobPost } from '@/lib/jobs-data';
import { INITIAL_JOBS } from '@/lib/jobs-data';

interface JobsPortalShowcaseProps {
  enrolledCourses?: string[];
  studentStream?: string;
}

function getEnrolledDisciplines(courses?: string[], stream?: string): string[] {
  const result: string[] = [];
  const allTexts = [...(courses || [])];
  if (stream) allTexts.push(stream);

  allTexts.forEach((text) => {
    const lower = text.toLowerCase();
    if (lower.includes('civil') || lower.includes('bim') || lower.includes('revit') || lower.includes('staad')) {
      if (!result.includes('civil')) result.push('civil');
    }
    if (lower.includes('mech') || lower.includes('catia') || lower.includes('solidworks') || lower.includes('creo') || lower.includes('ansys') || lower.includes('cad/cam') || lower.includes('cad/cae') || lower.includes('mechanical')) {
      if (!result.includes('mechanical')) result.push('mechanical');
    }
    if (lower.includes('elec') || lower.includes('eee') || lower.includes('eplan') || lower.includes('automation') || lower.includes('scada')) {
      if (!result.includes('electrical')) result.push('electrical');
    }
    if (lower.includes('pipe') || lower.includes('piping') || lower.includes('sp3d') || lower.includes('caesar')) {
      if (!result.includes('piping')) result.push('piping');
    }
    if (lower.includes('interior') || lower.includes('3ds') || lower.includes('v-ray') || lower.includes('sketchup')) {
      if (!result.includes('interior')) result.push('interior');
    }
    if (lower.includes('ppm') || lower.includes('primavera') || lower.includes('project management') || lower.includes('msp')) {
      if (!result.includes('ppm')) result.push('ppm');
    }
  });

  return result;
}

export const JobsPortalShowcase: React.FC<JobsPortalShowcaseProps> = ({
  enrolledCourses: propEnrolledCourses,
  studentStream: propStudentStream,
}) => {
  const [jobsList, setJobsList] = useState<JobPost[]>(INITIAL_JOBS);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobPost | null>(null);

  // Enrolled courses state (synced with props or localStorage)
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(propEnrolledCourses || []);
  const [studentStream, setStudentStream] = useState<string>(propStudentStream || '');

  // Detect enrolled courses from localStorage if not passed
  useEffect(() => {
    if (propEnrolledCourses && propEnrolledCourses.length > 0) {
      setEnrolledCourses(propEnrolledCourses);
    } else {
      try {
        if (typeof window !== 'undefined') {
          const list: string[] = [];
          const user = localStorage.getItem('rnd_cadd_user');
          if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role === 'student') {
              if (parsedUser.stream) setStudentStream(parsedUser.stream);
              if (Array.isArray(parsedUser.assignedCourses)) {
                parsedUser.assignedCourses.forEach((c: string) => {
                  if (!list.includes(c)) list.push(c);
                });
              }
              if (parsedUser.email) {
                const userStored = localStorage.getItem(`rnd_cadd_enrolled_${parsedUser.email.toLowerCase()}`);
                if (userStored) {
                  try {
                    const parsed = JSON.parse(userStored);
                    if (Array.isArray(parsed)) {
                      parsed.forEach((c: string) => {
                        if (!list.includes(c)) list.push(c);
                      });
                    }
                  } catch {}
                }
              }
            }
          }
          setEnrolledCourses(list);
        }
      } catch {
        // ignore
      }
    }
  }, [propEnrolledCourses, propStudentStream]);

  const enrolledDisciplines = React.useMemo(() => {
    return getEnrolledDisciplines(enrolledCourses, studentStream);
  }, [enrolledCourses, studentStream]);

  // Auto-focus directly on student's enrolled discipline
  useEffect(() => {
    if (enrolledDisciplines.length > 0) {
      setSelectedDiscipline(enrolledDisciplines[0]);
    }
  }, [enrolledDisciplines]);

  // Application form state
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantStream, setApplicantStream] = useState<string>('');
  const [applicantStudentId, setApplicantStudentId] = useState<string>('');
  const [applicantQualification, setApplicantQualification] = useState<string>('');
  const [applicantPortfolio, setApplicantPortfolio] = useState<string>('');
  const [applicantCoverNote, setApplicantCoverNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string>('');

  // Fetch live jobs from API with real-time polling
  const loadLiveJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        setJobsList(data.jobs);
      }
    } catch (err) {
      console.warn('Could not fetch live jobs, showing initial data:', err);
    }
  };

  useEffect(() => {
    loadLiveJobs();
    const interval = setInterval(loadLiveJobs, 4000);
    window.addEventListener('focus', loadLiveJobs);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', loadLiveJobs);
    };
  }, []);

  // Filter jobs based on discipline, work mode, and search query
  const filteredJobs = jobsList.filter((job) => {
    const status = (job.status || 'Active').toLowerCase();
    if (status === 'closed') return false;

    const jobDisc = (job.discipline || '').toLowerCase();
    const targetDisc = selectedDiscipline.toLowerCase();

    const matchesDiscipline =
      targetDisc === 'all' ||
      jobDisc === targetDisc ||
      jobDisc === 'all' ||
      (targetDisc === 'eee' && (jobDisc === 'electrical' || jobDisc === 'eee')) ||
      (targetDisc === 'electrical' && (jobDisc === 'electrical' || jobDisc === 'eee'));

    const matchesWorkMode =
      selectedWorkMode === 'all' ||
      (job.workMode || 'On-site').toLowerCase() === selectedWorkMode.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      (job.location || '').toLowerCase().includes(q) ||
      (job.tools || []).some((t) => t.toLowerCase().includes(q));

    return matchesDiscipline && matchesWorkMode && matchesSearch;
  });

  const handleOpenApplyModal = (job: JobPost) => {
    setSelectedJobForApply(job);
    setApplicantStream(job.discipline.toUpperCase());
    setApplySuccessMsg('');

    // Pre-fill from localStorage if student logged in
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('rnd_cadd_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed.name) setApplicantName(parsed.name);
          if (parsed.email) setApplicantEmail(parsed.email);
          if (parsed.phone) setApplicantPhone(parsed.phone || '');
          if (parsed.studentId) setApplicantStudentId(parsed.studentId);
          if (parsed.stream) setApplicantStream(parsed.stream);
        } catch {
          // ignore
        }
      }
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    if (!applicantName || !applicantEmail || !applicantPhone) {
      alert('Please fill in your Name, Email, and Phone Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJobForApply.id,
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone,
          stream: applicantStream || selectedJobForApply.discipline,
          studentId: applicantStudentId || 'DIRECT-APPLICANT',
          qualification: applicantQualification || 'B.Tech / Diploma in Engineering',
          portfolioUrl: applicantPortfolio,
          coverNote: applicantCoverNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApplySuccessMsg(data.message || 'Application successfully submitted!');
        loadLiveJobs();
        setTimeout(() => {
          setSelectedJobForApply(null);
          setApplySuccessMsg('');
        }, 2200);
      } else {
        alert(data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting job application:', err);
      alert('Submission error. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const disciplineTabs = [
    { id: 'all', label: 'All Openings' },
    { id: 'civil', label: 'Civil & BIM' },
    { id: 'mechanical', label: 'Mechanical CAD/CAE' },
    { id: 'electrical', label: 'Electrical & Automation' },
    { id: 'piping', label: 'Piping & Plant CAD' },
    { id: 'interior', label: 'Interior Architecture' },
    { id: 'ppm', label: 'Project Management (PPM)' },
  ];

  return (
    <section id="jobs-portal" className="py-20 sm:py-24 bg-[#FFFFFF] border-t border-b border-slate-200 relative overflow-hidden">
      {/* Background Decorative Ambient Blur */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-red-100/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-[1920px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#EE2C3C] animate-ping" />
              <span className="text-xs font-black text-[#EE2C3C] tracking-wider uppercase">
                ENGINEERING PLACEMENT PORTAL &bull; LIVE VACANCIES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Explore Verified Industry Openings
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Real-time engineering job vacancies directly from Autodesk &amp; Dassault authorized recruitment drives and Fortune 500 EPC partners.
            </p>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, tool, company..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:border-[#EE2C3C] focus:bg-white focus:outline-none transition-all rounded-xl shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enrolled Student Verified Placement Notice (Only Course-Related Openings) */}
        {enrolledCourses.length > 0 && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 via-white to-slate-50 border border-red-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-white flex items-center justify-center font-black shadow-md shadow-red-500/20 shrink-0 mt-0.5 sm:mt-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-[#EE2C3C] uppercase tracking-wider">
                    ENROLLED STUDENT EXCLUSIVE ACCESS
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                  Verified Openings Tailored For: <span className="text-[#EE2C3C]">{enrolledCourses.join(', ')}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filtered specifically to your enrolled CAD engineering stream. Campus interview drives are prioritized for enrolled students.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-red-200 text-[#EE2C3C] shadow-xs">
                {filteredJobs.length} Eligible Vacancies
              </span>
            </div>
          </div>
        )}

        {/* Filter Controls Row: Single Line Discipline Capsules (Exact Image 3 style without icons) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div
            className="flex flex-nowrap items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scrollbar-none pb-1 max-w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {disciplineTabs.map((tab) => {
              const activeJobs = jobsList.filter((j) => (j.status || 'Active').toLowerCase() !== 'closed');
              const count =
                tab.id === 'all'
                  ? activeJobs.length
                  : activeJobs.filter((j) => {
                      const d = (j.discipline || '').toLowerCase();
                      if (tab.id === 'electrical') return d === 'electrical' || d === 'eee' || d === 'all';
                      return d === tab.id || d === 'all';
                    }).length;

              const isSelected = selectedDiscipline === tab.id;
              const isEnrolledDomain = enrolledDisciplines.includes(tab.id);

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDiscipline(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 flex items-center gap-2 cursor-pointer select-none whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#EE2C3C] text-white border border-[#EE2C3C] shadow-md shadow-red-500/25 scale-105 font-bold'
                      : isEnrolledDomain
                      ? 'bg-red-50/60 text-slate-900 border-2 border-[#EE2C3C] hover:bg-red-50 hover:scale-105 shadow-xs font-semibold'
                      : 'bg-white text-slate-800 border border-[#EE2C3C] hover:bg-red-50/50 hover:scale-105 shadow-xs'
                  }`}
                >
                  {isEnrolledDomain && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EE2C3C] animate-pulse" />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-red-50 text-[#EE2C3C]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Work Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl flex-shrink-0 self-start sm:self-auto border border-slate-200">
            {['all', 'on-site', 'hybrid', 'remote'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedWorkMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedWorkMode === mode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode === 'all' ? 'All Modes' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Top Discipline Tag & Work Mode */}
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {job.discipline.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-500 capitalize">
                        {job.workMode}
                      </span>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#EE2C3C] transition-colors leading-snug mb-1.5">
                    {job.title}
                  </h3>

                  {/* Company & Location */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-3">
                    <span className="text-slate-900 font-extrabold">{job.company}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-500 font-normal">{job.location}</span>
                  </div>

                  {/* Salary & Experience Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-xs font-extrabold text-[#15803D] bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                      {job.salary}
                    </span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      {job.experience}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                      {job.vacancies} {job.vacancies === 1 ? 'Opening' : 'Openings'}
                    </span>
                  </div>

                  {/* Software / CAD Skills Badges */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      REQUIRED TOOLS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tools.slice(0, 4).map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2 py-0.5 rounded-md"
                        >
                          {tool}
                        </span>
                      ))}
                      {job.tools.length > 4 && (
                        <span className="text-[10px] font-bold text-slate-400 self-center">
                          +{job.tools.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brief Overview */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>
                </div>

                {/* Card Footer: Apply Action & Posted Date */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Posted {job.postedDate}
                  </div>
                  <button
                    onClick={() => handleOpenApplyModal(job)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#EE2C3C] hover:bg-[#D20A0B] shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    Quick Apply &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
            <div className="text-lg font-bold text-slate-800">No Job Openings Matched Your Filter</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try switching disciplines or searching for general tools like Revit, CATIA, or AutoCAD.
            </p>
            <button
              onClick={() => {
                setSelectedDiscipline('all');
                setSelectedWorkMode('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#EE2C3C] bg-red-50 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* CANDIDATE APPLICATION MODAL                                               */}
      {/* ========================================================================= */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedJobForApply(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-50 text-[#EE2C3C] border border-red-100">
                APPLICATION FORM
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                {selectedJobForApply.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedJobForApply.company} &bull; {selectedJobForApply.location} &bull; {selectedJobForApply.salary}
              </p>
            </div>

            {applySuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
                <span className="text-3xl block">🎉</span>
                <div className="text-base font-bold text-emerald-800">
                  Application Submitted Successfully!
                </div>
                <p className="text-xs text-emerald-600">
                  {applySuccessMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      placeholder="rahul@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      RND CADD Student ID / Roll
                    </label>
                    <input
                      type="text"
                      value={applicantStudentId}
                      onChange={(e) => setApplicantStudentId(e.target.value)}
                      placeholder="e.g. STU-HYD-8492"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Discipline / Stream
                    </label>
                    <input
                      type="text"
                      value={applicantStream}
                      onChange={(e) => setApplicantStream(e.target.value)}
                      placeholder="e.g. Civil & BIM"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Highest Educational Qualification
                  </label>
                  <input
                    type="text"
                    value={applicantQualification}
                    onChange={(e) => setApplicantQualification(e.target.value)}
                    placeholder="e.g. B.Tech Civil / Mechanical (2025/2026 Batch)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    CAD Drawing Portfolio / Resume URL (Drive / LinkedIn)
                  </label>
                  <input
                    type="url"
                    value={applicantPortfolio}
                    onChange={(e) => setApplicantPortfolio(e.target.value)}
                    placeholder="https://drive.google.com/your-cad-portfolio-or-resume"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Short Cover Note / Skills Summary
                  </label>
                  <textarea
                    rows={2}
                    value={applicantCoverNote}
                    onChange={(e) => setApplicantCoverNote(e.target.value)}
                    placeholder="Mention your certified CAD/BIM tools and why you are interested in this role..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#EE2C3C] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#EE2C3C] hover:bg-[#D20A0B] shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Confirm & Submit Application \u2192'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
