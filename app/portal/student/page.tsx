'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import type { JobPost, JobNotification } from '@/lib/jobs-data';

interface CourseClass {
  id: string;
  classNumber: string;
  title: string;
  duration: string;
  videoType: 'drive' | 'file';
  videoUrl: string;
  description?: string;
  resourcesUrl?: string;
  pdfUrl?: string;
  pdfName?: string;
  pdfSize?: string;
}

interface StoredCourse {
  id: string;
  code: string;
  title: string;
  folder: string;
  domain: string;
  software: string;
  duration: string;
  mode: string;
  fee: number;
  image?: string;
  overview?: string;
  syllabus: string[];
  classes?: CourseClass[];
}

export interface StudentCertificate {
  id: string;
  certId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  track?: string;
  grade: string;
  issueDate: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: 'pdf' | 'image' | 'template';
  isVerified: boolean;
  issuer: string;
  notes?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  adminReply?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  description: string;
  pdfUrl: string;
  pdfName: string;
  pdfSize?: string;
  dueDate: string;
  maxScore?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentReceipt {
  receiptId: string;
  date: string;
  amount: number;
  paymentMode: string;
  refNumber: string;
  status: string;
  remarks?: string;
}

export interface EbookItem {
  id: string;
  title: string;
  course: string;
  pdfUrl: string;
  pdfName: string;
  pdfSize?: string;
  pages?: string | number;
  description?: string;
  coverImage?: string;
  accessType: 'free' | 'locked';
  targetAudience: 'all' | 'course' | 'particular';
  targetCourse?: string;
  allowedStudentIds?: string[];
  allowedEmails?: string[];
  createdAt: string;
  updatedAt?: string;
  isUnlocked?: boolean;
}

const RedCrossCloseButton = ({ onClick, title = 'Close' }: { onClick: () => void; title?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FEF2F2] hover:bg-[#FEE2E2] active:scale-95 border-2 border-[#FECACA] hover:border-[#EF4444] text-[#DC2626] flex items-center justify-center transition-all shadow-sm flex-shrink-0 cursor-pointer"
    title={title}
  >
    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#DC2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

function formatGoogleDriveUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('/preview')) return trimmed;
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return `https://drive.google.com/file/d/${trimmed}/preview`;
  }
  return trimmed;
}

function isPlaceholderOrBrokenDriveUrl(url?: string): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview') {
    return true;
  }
  if (trimmed.includes('1w8o19vH1M9hP2nE5G4aBcDef') || trimmed.includes('placeholder') || trimmed.includes('sample.mp4')) {
    return true;
  }
  return false;
}

function formatYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}`;
  }
  return trimmed;
}

function formatVideoTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const mStr = mins < 10 ? `0${mins}` : `${mins}`;
  const sStr = secs < 10 ? `0${secs}` : `${secs}`;
  return `${mStr}:${sStr}`;
}

const DEFAULT_COURSE_CLASSES: Record<string, CourseClass[]> = {
  'civil cadd & master bim': [
    {
      id: 'cls-civ-1',
      classNumber: 'Class 01',
      title: 'AutoCAD 2D Drafting Standards & Project Setup',
      duration: '45 mins',
      videoType: 'file',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Industry-standard DWG setup, BIS title block standards, layer architecture, and precision snap tools.',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'AutoCAD 2D Drafting Standards Handbook.pdf',
      pdfSize: '3.4 MB',
    },
    {
      id: 'cls-civ-2',
      classNumber: 'Class 02',
      title: 'Parametric Wall Assemblies, Slabs & Grids in Revit',
      duration: '55 mins',
      videoType: 'file',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Modeling structural compound walls, core layers, elevation datum levels, and structural grid alignments.',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Revit Architectural Modeling Guide.pdf',
      pdfSize: '5.1 MB',
    },
    {
      id: 'cls-civ-3',
      classNumber: 'Class 03',
      title: 'Custom Family Creation & Curtain Glazing Systems',
      duration: '60 mins',
      videoType: 'file',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Creating parametric window/door families, curtain wall mullion layout, and reference planes.',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Parametric BIM Families & Curtain Walls.pdf',
      pdfSize: '4.2 MB',
    },
    {
      id: 'cls-civ-4',
      classNumber: 'Class 04',
      title: 'Navisworks Clash Matrix & Enscape 4K Walkthrough',
      duration: '50 mins',
      videoType: 'file',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      description: 'Multi-trade hard clash detection, 4D construction schedule simulation, and GPU real-time daylight rendering.',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Clash Coordination & 4K Visualization.pdf',
      pdfSize: '6.8 MB',
    },
  ],
  'interior architecture & 3d visualization': [
    {
      id: 'cls-int-1',
      classNumber: 'Class 01',
      title: 'Ergonomic Space Planning & CAD Interior Layouts',
      duration: '45 mins',
      videoType: 'file',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Anthropometric dimensions, circulation corridors, furniture clearance standards, and false ceiling grids.',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Interior Space Planning Standards.pdf',
      pdfSize: '3.8 MB',
    },
    {
      id: 'cls-int-2',
      classNumber: 'Class 02',
      title: 'SketchUp Modular Cabinetry & Hardware Fitting Details',
      duration: '50 mins',
      videoType: 'file',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Tandem drawer mechanisms, carcass panels, shutter finishes, edge-banding, and hardware specifications.',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'Modular Kitchen & Millwork Joinery.pdf',
      pdfSize: '4.6 MB',
    },
    {
      id: 'cls-int-3',
      classNumber: 'Class 03',
      title: '3ds Max Physically-Based Lighting & V-Ray 6 Materials',
      duration: '65 mins',
      videoType: 'file',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'IES photometric spotlights, dome HDRI environment lighting, PBR reflection glossiness, and normal bump maps.',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      pdfName: 'V-Ray 6 Photorealistic Interior Rendering.pdf',
      pdfSize: '7.2 MB',
    },
  ],
};

function getClassesForCourse(courseTitle: string, matchedClasses?: CourseClass[]): CourseClass[] {
  if (matchedClasses && matchedClasses.length > 0) {
    return matchedClasses;
  }
  const cleanTitle = (courseTitle || '').toLowerCase().trim();
  if (DEFAULT_COURSE_CLASSES[cleanTitle]) {
    return DEFAULT_COURSE_CLASSES[cleanTitle];
  }
  if (cleanTitle.includes('interior') || cleanTitle.includes('3d') || cleanTitle.includes('arch')) {
    return DEFAULT_COURSE_CLASSES['interior architecture & 3d visualization'];
  }
  return DEFAULT_COURSE_CLASSES['civil cadd & master bim'];
}

const BookCoverGraphic = ({ book, onClick }: { book: EbookItem; onClick?: () => void }) => {
  const isPaid = book.accessType !== 'free';

  return (
    <div
      onClick={onClick}
      className="relative w-full h-52 rounded-xl overflow-hidden bg-[#FFFFFF] border-2 border-slate-200 p-4 flex flex-col justify-between shadow-xs transition-all duration-200 cursor-pointer select-none hover:border-slate-300"
    >
      {/* Decorative Spine Accent */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-slate-200 to-slate-100 border-r border-slate-300 pointer-events-none" />

      {/* Top Imprint & Access Status (Clean Text, No Emojis) */}
      <div className="relative z-10 pl-2 flex items-start justify-between gap-2">
        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
          RND CADD ACADEMY
        </span>

        {isPaid ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-[#EE2C3C] border border-rose-200">
            Paid Edition
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Free Access
          </span>
        )}
      </div>

      {/* Center: Book Title & Subject */}
      <div className="relative z-10 pl-2 my-auto py-1">
        <span className="inline-block text-[11px] font-bold text-[#EE2C3C] uppercase tracking-wider mb-1">
          {book.course}
        </span>
        <h4 className="text-[#131313] text-sm sm:text-base font-bold leading-snug line-clamp-2">
          {book.title}
        </h4>
      </div>

      {/* Bottom Specifications Bar */}
      <div className="relative z-10 pl-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span className="font-mono text-slate-600">{book.pages || 'Handbook'}</span>
        <span className="text-[10px] text-slate-500">Er. Swamy Naidu (Dir.)</span>
      </div>
    </div>
  );
};

export default function StudentPortalPage() {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [studentUser, setStudentUser] = useState({
    name: 'Ram.g',
    email: 'student1@gmail.com',
    role: 'student',
    stream: 'Civil & Architectural BIM',
    id: 'STU-HYD-8492',
    accessStatus: 'active' as 'active' | 'revoked',
    phone: '+91 99080 12345',
    college: 'JNTU Hyderabad (College of Engineering)',
    nativePlace: 'Ameerpet, Hyderabad',
    qualification: 'B.Tech in Civil Engineering',
    admissionDate: '12 Jan 2026',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    courseFee: 35000,
    paidFee: 20000,
    balanceFee: 15000,
    labWorkstation: 'Seat #04 - BIM Modeling Lab 2',
    leadInstructor: 'Er. Swamy Naidu (Senior BIM Architect)',
    campusLocation: 'R&D CADD Center, Metro Pillar 1042, Ameerpet, Hyderabad',
    assignedCourses: ['Civil CADD & Master BIM', 'Interior Architecture & 3D Visualization'] as string[],
    paymentReceipts: [
      {
        receiptId: 'REC-RND-2026-081',
        date: '12 Jan 2026',
        amount: 20000,
        paymentMode: 'UPI / Net Banking',
        refNumber: 'UTR-99081238472',
        status: 'Verified & Credited',
        remarks: 'First Installment - Admission & Courseware Pack',
      },
    ] as PaymentReceipt[],
  });

  // Profile Edit & Security States
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('Ram.g');
  const [editPhone, setEditPhone] = useState<string>('+91 99080 12345');
  const [editCollege, setEditCollege] = useState<string>('JNTU Hyderabad (College of Engineering)');
  const [editNativePlace, setEditNativePlace] = useState<string>('Ameerpet, Hyderabad');
  const [editQualification, setEditQualification] = useState<string>('B.Tech in Civil Engineering');
  const [editPhoto, setEditPhoto] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [profileSaveMsg, setProfileSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security / Password Change State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fee Receipt Slip Modal State
  const [selectedReceiptForModal, setSelectedReceiptForModal] = useState<PaymentReceipt | null>(null);

  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [allCourses, setAllCourses] = useState<StoredCourse[]>([]);
  const [playerCourse, setPlayerCourse] = useState<StoredCourse | null>(null);
  const [activePlayerClass, setActivePlayerClass] = useState<CourseClass | null>(null);
  const [studentViewerMode, setStudentViewerMode] = useState<'video' | 'notes'>('video');

  // Dynamic Course Progress & Video Player Functional States
  const [watchedClassIds, setWatchedClassIds] = useState<string[]>(['cls-auto-1']);
  const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState<number>(1);
  const [videoQuality, setVideoQuality] = useState<string>('1080p HD');
  const [videoVolume, setVideoVolume] = useState<number>(1);
  const [videoIsMuted, setVideoIsMuted] = useState<boolean>(false);
  const [videoToast, setVideoToast] = useState<string | null>(null);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [settingsActiveSubmenu, setSettingsActiveSubmenu] = useState<'main' | 'speed' | 'quality'>('main');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState<boolean>(false);
  const [showControlsOverlay, setShowControlsOverlay] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Real-time Student Certificates State (Dynamic DB Synced)
  const [studentCertificates, setStudentCertificates] = useState<StudentCertificate[]>([]);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState<boolean>(true);
  const [selectedCertificateForView, setSelectedCertificateForView] = useState<StudentCertificate | null>(null);

  // Real-time Student E-Books State (Dynamic DB Synced)
  const [studentEbooks, setStudentEbooks] = useState<EbookItem[]>([]);
  const [isLoadingEbooks, setIsLoadingEbooks] = useState<boolean>(true);
  const [selectedEbookForRead, setSelectedEbookForRead] = useState<EbookItem | null>(null);
  const [selectedBookCoverForView, setSelectedBookCoverForView] = useState<EbookItem | null>(null);
  const [selectedEbookForPurchase, setSelectedEbookForPurchase] = useState<EbookItem | null>(null);
  const [ebookFilterTab, setEbookFilterTab] = useState<'all' | 'free' | 'paid'>('all');
  const [ebookSearchQuery, setEbookSearchQuery] = useState<string>('');

  // Real-time Student Jobs & Notifications State (Live Synced with Admin Postings)
  const [studentJobs, setStudentJobs] = useState<JobPost[]>([]);
  const [jobNotifications, setJobNotifications] = useState<JobNotification[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);
  const [jobSearchQuery, setJobSearchQuery] = useState<string>('');
  const [jobStreamFilter, setJobStreamFilter] = useState<string>('all');
  const [jobModeFilter, setJobModeFilter] = useState<string>('all');
  const [applyingJob, setApplyingJob] = useState<JobPost | null>(null);
  const [applyStudentPhone, setApplyStudentPhone] = useState<string>('9908123456');
  const [applyPortfolioUrl, setApplyPortfolioUrl] = useState<string>('');
  const [applyCoverNote, setApplyCoverNote] = useState<string>('');
  const [isSubmittingApplication, setIsSubmittingApplication] = useState<boolean>(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);

  // Real-time Support & Doubt Tickets State (Live Synced with Admin Helpdesk)
  const [studentTickets, setStudentTickets] = useState<SupportTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState<boolean>(true);
  const [isRaiseTicketModalOpen, setIsRaiseTicketModalOpen] = useState<boolean>(false);
  const [ticketCategory, setTicketCategory] = useState<string>('Coursework & Project Doubts');
  const [ticketPriority, setTicketPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDescription, setTicketDescription] = useState<string>('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState<boolean>(false);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState<string | null>(null);
  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [ticketSearchQuery, setTicketSearchQuery] = useState<string>('');

  // Course-specific Assignments State (Live Synced with Admin Assignments by Course)
  const [studentAssignments, setStudentAssignments] = useState<AssignmentItem[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState<boolean>(true);

  // Fetch live student details from API to reflect give/revoke access and course assignments
  const fetchStudentStatus = async (userEmail: string, silent = false) => {
    if (!silent) setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        const matching = data.students.find(
          (s: any) => s.email?.toLowerCase() === userEmail?.toLowerCase()
        ) || data.students.find((s: any) => s.email === 'student1@gmail.com');

        if (matching) {
          setStudentUser((prev) => ({
            ...prev,
            name: matching.name || prev.name,
            email: matching.email || prev.email,
            id: matching.studentId || prev.id,
            stream: matching.courseName || prev.stream,
            phone: matching.officialMobile && matching.officialMobile !== '-' ? matching.officialMobile : (matching.mobile && matching.mobile !== '-' ? matching.mobile : prev.phone),
            college: matching.college && matching.college !== '-' ? matching.college : prev.college,
            nativePlace: matching.residence && matching.residence !== '-' ? matching.residence : prev.nativePlace,
            qualification: matching.qualification && matching.qualification !== '-' ? matching.qualification : prev.qualification,
            courseFee: matching.courseFee ? Number(matching.courseFee) : prev.courseFee,
            paidFee: matching.paidFee !== undefined ? Number(matching.paidFee) : prev.paidFee,
            balanceFee: matching.balanceFee !== undefined ? Number(matching.balanceFee) : prev.balanceFee,
            accessStatus: matching.accessStatus || 'active',
            assignedCourses: Array.isArray(matching.assignedCourses) && matching.assignedCourses.length > 0 ? matching.assignedCourses : prev.assignedCourses,
          }));
          // Fetch certificates with verified student ID
          fetchStudentCertificates(matching.email || userEmail, matching.studentId || matching.id);
          // Fetch e-books matching verified student enrollment
          fetchStudentEbooks(matching.email || userEmail, matching.studentId || matching.id, matching.assignedCourses);
          // Fetch real-time support tickets
          fetchStudentTickets(matching.email || userEmail, matching.studentId || matching.id);
          // Fetch assignments for student's enrolled courses silently in background
          fetchStudentAssignments(matching.assignedCourses || (matching.courseName ? [matching.courseName] : undefined), true);
          // Fetch full student profile details and fee receipts
          fetchStudentProfile(matching.email || userEmail);
        }
      }
    } catch (err) {
      console.error('Failed to sync student live status:', err);
    } finally {
      if (!silent) setIsLoadingStatus(false);
    }
  };

  // Fetch detailed student profile, fee breakdown, and receipts from API
  const fetchStudentProfile = async (userEmail?: string) => {
    try {
      const email = userEmail || studentUser.email;
      const res = await fetch(`/api/student/profile?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.profile) {
        const p = data.profile;
        setStudentUser((prev) => ({
          ...prev,
          name: p.name || prev.name,
          email: p.email || prev.email,
          id: p.studentId || prev.id,
          stream: p.stream || prev.stream,
          phone: p.phone || prev.phone,
          college: p.college || prev.college,
          nativePlace: p.nativePlace || prev.nativePlace,
          qualification: p.qualification || prev.qualification,
          admissionDate: p.admissionDate || prev.admissionDate,
          photo: p.photo || prev.photo,
          courseFee: p.courseFee !== undefined ? Number(p.courseFee) : prev.courseFee,
          paidFee: p.paidFee !== undefined ? Number(p.paidFee) : prev.paidFee,
          balanceFee: p.balanceFee !== undefined ? Number(p.balanceFee) : prev.balanceFee,
          labWorkstation: p.labWorkstation || prev.labWorkstation,
          leadInstructor: p.leadInstructor || prev.leadInstructor,
          campusLocation: p.campusLocation || prev.campusLocation,
          assignedCourses: Array.isArray(p.assignedCourses) && p.assignedCourses.length > 0 ? p.assignedCourses : prev.assignedCourses,
          paymentReceipts: Array.isArray(p.paymentReceipts) ? p.paymentReceipts : prev.paymentReceipts,
        }));
        if (!isEditingProfile) {
          setEditName(p.name || 'Ram.g');
          setEditPhone(p.phone || '+91 99080 12345');
          setEditCollege(p.college || 'JNTU Hyderabad (College of Engineering)');
          setEditNativePlace(p.nativePlace || 'Ameerpet, Hyderabad');
          setEditQualification(p.qualification || 'B.Tech in Civil Engineering');
          setEditPhoto(p.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
        }
      }
    } catch (err) {
      console.error('Failed to load detailed student profile:', err);
    }
  };

  // Handle saving edited personal details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveMsg(null);
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          email: studentUser.email,
          name: editName,
          phone: editPhone,
          college: editCollege,
          nativePlace: editNativePlace,
          qualification: editQualification,
          photo: editPhoto,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStudentUser((prev) => ({
          ...prev,
          name: editName.trim() || prev.name,
          phone: editPhone.trim() || prev.phone,
          college: editCollege.trim() || prev.college,
          nativePlace: editNativePlace.trim() || prev.nativePlace,
          qualification: editQualification.trim() || prev.qualification,
          photo: editPhoto.trim() || prev.photo,
        }));
        setProfileSaveMsg({ type: 'success', text: 'Student details updated and saved successfully.' });
        setIsEditingProfile(false);
        setTimeout(() => setProfileSaveMsg(null), 4000);
      } else {
        setProfileSaveMsg({ type: 'error', text: data.message || 'Failed to update student details.' });
      }
    } catch (err: any) {
      setProfileSaveMsg({ type: 'error', text: err.message || 'Error saving student details.' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle student password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatusMsg(null);

    if (!currentPassword.trim()) {
      setPasswordStatusMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (!newPassword.trim()) {
      setPasswordStatusMsg({ type: 'error', text: 'Please enter a new password.' });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordStatusMsg({ type: 'error', text: 'New password must be at least 4 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatusMsg({ type: 'error', text: 'New password and confirmation password do not match.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          email: studentUser.email,
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordStatusMsg({ type: 'success', text: data.message || 'Password updated successfully! Keep this for subsequent logins.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordStatusMsg(null), 5000);
      } else {
        setPasswordStatusMsg({ type: 'error', text: data.message || 'Password update failed. Please check current password.' });
      }
    } catch (err: any) {
      setPasswordStatusMsg({ type: 'error', text: err.message || 'Error processing password change request.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Fetch student certificates in real-time from API
  const fetchStudentCertificates = async (userEmail?: string, stuId?: string) => {
    try {
      const email = userEmail || studentUser.email;
      const id = stuId || studentUser.id;
      const params = new URLSearchParams();
      if (id) params.append('studentId', id);
      if (email) params.append('email', email);

      const res = await fetch(`/api/certificates?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.certificates)) {
        setStudentCertificates(data.certificates);
      }
    } catch (err) {
      console.error('Failed to load student certificates:', err);
    } finally {
      setIsLoadingCertificates(false);
    }
  };

  // Fetch student e-books in real-time from API
  const fetchStudentEbooks = async (userEmail?: string, stuId?: string, assigned?: string[]) => {
    try {
      const email = userEmail || studentUser.email;
      const id = stuId || studentUser.id;
      const courses = assigned || studentUser.assignedCourses;
      const params = new URLSearchParams();
      if (id) params.append('studentId', id);
      if (email) params.append('email', email);
      if (courses && courses.length > 0) {
        params.append('courses', courses.join(','));
      }

      const res = await fetch(`/api/ebooks?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.ebooks)) {
        setStudentEbooks(data.ebooks);
      }
    } catch (err) {
      console.error('Failed to load student ebooks:', err);
    } finally {
      setIsLoadingEbooks(false);
    }
  };

  // Fetch courses catalog to link classwise videos
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setAllCourses(data.courses);
      }
    } catch (err) {
      console.error('Failed to load courses in student portal:', err);
    }
  };

  // Fetch live engineering jobs & real-time notification alerts
  const fetchStudentJobs = async (silent = false) => {
    if (!silent) setIsLoadingJobs(true);
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setStudentJobs(data.jobs);
        if (Array.isArray(data.notifications)) {
          setJobNotifications(data.notifications);
        }
      }
    } catch (err) {
      console.error('Failed to load jobs in student portal:', err);
    } finally {
      if (!silent) setIsLoadingJobs(false);
    }
  };

  const handleApplyToJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    setIsSubmittingApplication(true);
    setApplySuccessMsg(null);
    try {
      const payload = {
        jobId: applyingJob.id,
        name: studentUser.name,
        email: studentUser.email,
        phone: applyStudentPhone,
        studentId: studentUser.id,
        stream: studentUser.stream || applyingJob.stream,
        college: 'RND CADD / CADDESK Ameerpet Certified',
        qualification: 'B.Tech / Diploma Graduate',
        portfolioUrl: applyPortfolioUrl.trim() || undefined,
        coverNote: applyCoverNote.trim() || undefined,
      };

      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setApplySuccessMsg(
          data.message || 'Application submitted successfully! Your CAD credentials have been forwarded to the HR team.'
        );
        fetchStudentJobs();
        setTimeout(() => {
          setApplyingJob(null);
          setApplySuccessMsg(null);
          setApplyPortfolioUrl('');
          setApplyCoverNote('');
        }, 2500);
      } else {
        alert(data.message || 'Failed to submit application');
      }
    } catch (err: any) {
      alert(`Error submitting application: ${err.message}`);
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  // Fetch real-time support tickets raised by student
  const fetchStudentTickets = async (userEmail?: string, stuId?: string) => {
    try {
      const email = userEmail || studentUser.email;
      const id = stuId || studentUser.id;
      const params = new URLSearchParams();
      if (id) params.append('studentId', id);
      if (email) params.append('email', email);

      const res = await fetch(`/api/tickets?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setStudentTickets(data.tickets);
      }
    } catch (err) {
      console.error('Failed to load student tickets:', err);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // Student raises a technical or academic support ticket
  const handleRaiseTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      alert('Please provide both ticket subject and problem description.');
      return;
    }
    setIsSubmittingTicket(true);
    setTicketSuccessMsg(null);
    try {
      const payload = {
        studentId: studentUser.id,
        studentName: studentUser.name,
        studentEmail: studentUser.email,
        course: studentUser.assignedCourses?.[0] || studentUser.stream || 'Civil CADD & Master BIM',
        category: ticketCategory,
        priority: ticketPriority,
        subject: ticketSubject.trim(),
        description: ticketDescription.trim(),
      };

      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSuccessMsg(
          data.message || 'Support ticket submitted! Faculty mentor team will review and reply.'
        );
        fetchStudentTickets();
        setTimeout(() => {
          setIsRaiseTicketModalOpen(false);
          setTicketSubject('');
          setTicketDescription('');
          setTicketSuccessMsg(null);
        }, 2200);
      } else {
        alert(data.message || 'Failed to submit ticket');
      }
    } catch (err: any) {
      alert(`Error raising ticket: ${err.message}`);
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // Fetch assignments targeted specifically to the student's enrolled course(s)
  const fetchStudentAssignments = async (courses?: string[], silent = false) => {
    if (!silent) setIsLoadingAssignments(true);
    try {
      const courseList = courses || studentUser.assignedCourses || [studentUser.stream];
      const params = new URLSearchParams();
      if (courseList && courseList.length > 0) {
        params.append('courses', courseList.join(','));
      }

      const res = await fetch(`/api/assignments?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.assignments)) {
        setStudentAssignments(data.assignments);
      }
    } catch (err) {
      console.error('Failed to load student assignments:', err);
    } finally {
      if (!silent) setIsLoadingAssignments(false);
    }
  };

  useEffect(() => {
    let emailToUse = 'student1@gmail.com';
    let idToUse = 'STU-HYD-8492';
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rnd_cadd_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.email) {
            emailToUse = parsed.email;
            if (parsed.studentId) idToUse = parsed.studentId;
            setStudentUser((prev) => ({
              ...prev,
              name: parsed.name || prev.name,
              email: parsed.email,
              stream: parsed.stream || prev.stream,
              id: parsed.studentId || prev.id,
              assignedCourses: Array.isArray(parsed.assignedCourses) && parsed.assignedCourses.length > 0 ? parsed.assignedCourses : prev.assignedCourses,
            }));
          }
        } catch {
          // ignore
        }
      }
    }

    fetchStudentStatus(emailToUse);
    fetchCourses();
    fetchStudentJobs();
  }, []);

  // Load and persist watched classes for the current student
  useEffect(() => {
    if (typeof window !== 'undefined' && studentUser.email) {
      try {
        const saved = localStorage.getItem(`rnd_cadd_watched_${studentUser.email}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setWatchedClassIds(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load watched class IDs:', e);
      }
    }
  }, [studentUser.email]);

  // Compute Enrolled Courses with Classes & Live Progress
  const enrolledCoursesData = useMemo(() => {
    return studentUser.assignedCourses.map((cName) => {
      const matched = allCourses.find(
        (c) =>
          c.title.toLowerCase().trim() === cName.toLowerCase().trim() ||
          c.code.toLowerCase().trim() === cName.toLowerCase().trim()
      );
      const classes: CourseClass[] = getClassesForCourse(cName, matched?.classes);
      const watchedCount = classes.filter((cls) => watchedClassIds.includes(cls.id)).length;
      const progressPercent =
        classes.length > 0 ? Math.round((watchedCount / classes.length) * 100) : 0;
      return {
        name: cName,
        matched,
        classes,
        watchedCount,
        totalCount: classes.length,
        progressPercent,
      };
    });
  }, [studentUser.assignedCourses, allCourses, watchedClassIds]);

  const totalClassesCount = useMemo(() => {
    return enrolledCoursesData.reduce((acc, curr) => acc + curr.totalCount, 0);
  }, [enrolledCoursesData]);

  const watchedClassesCount = useMemo(() => {
    return enrolledCoursesData.reduce((acc, curr) => acc + curr.watchedCount, 0);
  }, [enrolledCoursesData]);

  const overallSyllabusProgress = useMemo(() => {
    return totalClassesCount > 0
      ? Math.round((watchedClassesCount / totalClassesCount) * 100)
      : 0;
  }, [totalClassesCount, watchedClassesCount]);

  const filteredPlaylistClasses = useMemo(() => {
    if (!playerCourse?.classes) return [];
    if (!playlistSearchQuery.trim()) return playerCourse.classes;
    const q = playlistSearchQuery.toLowerCase().trim();
    return playerCourse.classes.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.classNumber.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [playerCourse?.classes, playlistSearchQuery]);

  const isDriveVideo = useMemo(() => {
    if (!activePlayerClass?.videoUrl) return false;
    return (
      activePlayerClass.videoType === 'drive' ||
      activePlayerClass.videoUrl.includes('drive.google.com')
    );
  }, [activePlayerClass]);

  const isYouTubeVideo = useMemo(() => {
    if (!activePlayerClass?.videoUrl) return false;
    return (
      activePlayerClass.videoUrl.includes('youtube.com') ||
      activePlayerClass.videoUrl.includes('youtu.be')
    );
  }, [activePlayerClass]);

  const currentClassIndex = useMemo(() => {
    if (!playerCourse?.classes || !activePlayerClass) return -1;
    return playerCourse.classes.findIndex((c) => c.id === activePlayerClass.id);
  }, [playerCourse?.classes, activePlayerClass]);

  // Window focus listener for instant course updates when switching from Admin tab
  useEffect(() => {
    const handleWindowFocus = () => {
      fetchCourses();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleWindowFocus);
      return () => window.removeEventListener('focus', handleWindowFocus);
    }
  }, []);

  const showVideoToast = (msg: string) => {
    setVideoToast(msg);
    setTimeout(() => {
      setVideoToast((current) => (current === msg ? null : current));
    }, 1500);
  };

  const handleToggleClassWatched = (classId: string) => {
    setWatchedClassIds((prev) => {
      const updated = prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            `rnd_cadd_watched_${studentUser.email}`,
            JSON.stringify(updated)
          );
        } catch (e) {
          console.error(e);
        }
      }
      return updated;
    });
  };

  const handleOpenStudio = (course: StoredCourse, targetClass?: CourseClass | null) => {
    // 1. Immediately launch studio with current course data
    const courseClasses = getClassesForCourse(course.title, course.classes);
    const resolvedCourse: StoredCourse = {
      ...course,
      classes: courseClasses,
    };
    const defaultClass =
      targetClass || (courseClasses.length > 0 ? courseClasses[0] : null);
    setPlayerCourse(resolvedCourse);
    setActivePlayerClass(defaultClass);
    setVideoCurrentTime(0);
    setVideoIsPlaying(false);
    setPlaylistSearchQuery('');
    if (typeof window !== 'undefined') {
      window.history.pushState(
        { rndStudio: true, courseId: course.id },
        '',
        window.location.pathname
      );
    }

    // 2. Fetch fresh courses in background so any class newly added by Admin appears immediately
    fetch('/api/courses')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.courses)) {
          setAllCourses(data.courses);
          const fresh = data.courses.find(
            (c: StoredCourse) =>
              c.id === course.id ||
              c.title.toLowerCase().trim() === course.title.toLowerCase().trim() ||
              c.code.toLowerCase().trim() === course.code.toLowerCase().trim()
          );
          if (fresh && Array.isArray(fresh.classes) && fresh.classes.length > 0) {
            setPlayerCourse(fresh);
            if (targetClass) {
              const matchedFresh = fresh.classes.find(
                (fc: CourseClass) => fc.id === targetClass.id || fc.title === targetClass.title
              );
              if (matchedFresh) setActivePlayerClass(matchedFresh);
            } else if (!defaultClass || !fresh.classes.some((fc: CourseClass) => fc.id === defaultClass.id)) {
              setActivePlayerClass(fresh.classes[0]);
            }
          }
        }
      })
      .catch((e) => console.warn('Background courses sync notice:', e));
  };

  const handleCloseStudio = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setVideoIsPlaying(false);
    setPlayerCourse(null);
    setActivePlayerClass(null);
    if (typeof window !== 'undefined' && window.history.state?.rndStudio) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (playerCourse) {
        if (videoRef.current) {
          videoRef.current.pause();
        }
        setVideoIsPlaying(false);
        setPlayerCourse(null);
        setActivePlayerClass(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [playerCourse]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setVideoIsPlaying(true);
          showVideoToast('Playing ▶');
        })
        .catch((e) => {
          console.log('Playback error:', e);
          setVideoIsPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setVideoIsPlaying(false);
      showVideoToast('Paused ⏸');
    }
  };

  const handleSkipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    setVideoCurrentTime(videoRef.current.currentTime);
    showVideoToast('↺ -10s');
  };

  const handleSkipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      videoRef.current.duration || 99999,
      videoRef.current.currentTime + 10
    );
    setVideoCurrentTime(videoRef.current.currentTime);
    showVideoToast('↻ +10s');
  };

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
    setVideoCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setVideoPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    showVideoToast(`Speed: ${speed}x`);
  };

  const handleQualityChange = (quality: string) => {
    setVideoQuality(quality);
    setShowQualityMenu(false);
    showVideoToast(`Quality: ${quality}`);
  };

  const handleVolumeChange = (vol: number) => {
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
    setVideoVolume(vol);
    setVideoIsMuted(vol === 0);
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoIsMuted;
    videoRef.current.muted = nextMuted;
    setVideoIsMuted(nextMuted);
    showVideoToast(nextMuted ? 'Muted 🔇' : 'Unmuted 🔊');
  };

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleUserActivity = () => {
    setShowControlsOverlay(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (videoIsPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControlsOverlay(false);
        setShowSettingsMenu(false);
      }, 3500);
    }
  };

  const handleTogglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        showVideoToast('PiP Closed');
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        showVideoToast('Picture-in-Picture');
      } else {
        showVideoToast('PiP Not Supported');
      }
      setShowSettingsMenu(false);
    } catch (e) {
      console.log('PiP error:', e);
      showVideoToast('PiP Unavailable');
    }
  };

  const handleToggleCC = () => {
    const next = !subtitlesEnabled;
    setSubtitlesEnabled(next);
    showVideoToast(next ? 'Subtitles: English (Auto)' : 'Subtitles: Off');
  };

  const handleVideoEnded = () => {
    setVideoIsPlaying(false);
    if (activePlayerClass && !watchedClassIds.includes(activePlayerClass.id)) {
      handleToggleClassWatched(activePlayerClass.id);
      showVideoToast('✓ Class Completed!');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rnd_cadd_user');
      localStorage.removeItem('rnd_cadd_role');
      window.location.href = '/signin';
    }
  };

  const navItems = [
    { id: 'Home', label: 'Home', tag: '01' },
    { id: 'Profile', label: 'Profile', tag: '02' },
    { id: 'Jobs', label: 'Jobs & Placements', tag: 'JOBS' },
    { id: 'Certificates', label: 'Certificates', tag: 'CERT' },
    { id: 'Assignments', label: 'Assignments', tag: 'TASK' },
    { id: 'E-Books', label: 'E-Books', tag: 'BOOK' },
    { id: 'Live', label: 'Live', tag: 'LIVE' },
    { id: 'Chat', label: 'Support & Tickets', tag: 'HELP' },
    { id: 'Refer & Earn', label: 'Refer & Earn', tag: '04' },
    { id: 'Rate', label: 'Rate', tag: '05' },
    { id: 'Share', label: 'Share', tag: '06' },
  ];

  const isAccessRevoked = studentUser.accessStatus === 'revoked';

  return (
    <div
      className="min-h-screen md:h-screen md:overflow-hidden bg-[#F9FAFB] text-[#000000] flex flex-col md:flex-row text-base upgrad-admin-theme"
      style={{
        fontFamily: '__localCircularXXTTFont_d44498, __localCircularXXTTFont_Fallback_d44498, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 400,
        fontStyle: 'normal',
        letterSpacing: 'normal',
        color: '#000000',
      }}
    >
      {/* LEFT SIDEBAR - FIXED & IMMOBILE (Pointers locked to viewport, does not move when scrolling) */}
      <aside className="w-full md:w-80 md:fixed md:top-0 md:left-0 md:bottom-0 md:h-screen bg-[#FFFFFF] border-r border-slate-200 flex flex-col justify-between shadow-xs z-30 flex-shrink-0">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Student Profile Identity */}
          <div className="px-5 py-4 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-[#131313] text-[#FFFFFF] font-bold flex items-center justify-center text-base shadow-xs flex-shrink-0">
                {studentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-base font-bold text-[#131313] truncate">
                  {studentUser.name}
                </h2>
                <span className="text-xs font-mono font-medium text-slate-500 block truncate">
                  ID: {studentUser.id}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Items - UpGrad Admin Portal Design */}
          <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#131313] text-[#FFFFFF] shadow-xs font-bold'
                      : 'text-[#334155] hover:bg-slate-100 hover:text-[#0F172A]'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'Jobs' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {studentJobs.filter((j) => j.status === 'Active').length}
                    </span>
                  )}
                  {item.id === 'Certificates' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {studentCertificates.length}
                    </span>
                  )}
                  {item.id === 'Assignments' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {studentAssignments.length}
                    </span>
                  )}
                  {item.id === 'E-Books' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {studentEbooks.length}
                    </span>
                  )}
                  {item.id === 'Live' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  )}
                  {item.id === 'Chat' && studentTickets.filter((t) => t.status === 'Resolved').length > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {studentTickets.filter((t) => t.status === 'Resolved').length} Solved
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Sign Out Only */}
        <div className="p-3.5 border-t border-slate-200 bg-white flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#EE2C3C] hover:bg-[#D71E2E] transition-all text-center cursor-pointer shadow-xs tracking-wide"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA - SCROLLS INDEPENDENTLY */}
      <main className="flex-1 md:ml-80 flex flex-col min-h-0 md:h-screen overflow-y-auto bg-[#F9FAFB]">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
              {activeTab === 'Home' && `Welcome back, ${studentUser.name}`}
              {activeTab === 'Profile' && 'Student Academic Profile'}
              {activeTab === 'Jobs' && 'Core Engineering Placement & Job Board'}
              {activeTab === 'Certificates' && 'Autodesk & Dassault Verified Academic Certificates'}
              {activeTab === 'Assignments' && 'Course Project & CAD Drafting Assignments'}
              {activeTab === 'Live' && 'Active Virtual CAD Lab & Live Sessions'}
              {activeTab === 'Chat' && 'Helpdesk Support & Faculty Resolution Tickets'}
              {activeTab === 'Refer & Earn' && 'Refer Engineering Colleagues'}
              {activeTab === 'Rate' && 'Rate Course & Trainer Review'}
              {activeTab === 'Share' && 'Share Academic Certification'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              RND CADD Student Workstation &bull; Industrial Engineering Portal
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {activeTab === 'Chat' && (
              <button
                onClick={() => setIsRaiseTicketModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Raise Support Ticket
              </button>
            )}
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#131313] border border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Main Website</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </header>

        {/* REAL-TIME JOB NOTIFICATION ALERT BANNER */}
        {(() => {
          const unread = jobNotifications.filter((n) => !dismissedNotificationIds.includes(n.id));
          if (unread.length === 0) return null;
          const latest = unread[0];
          return (
            <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-xs">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      New Placement Opening
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-medium">
                      {latest.time}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#131313] block mt-0.5">
                    {latest.message}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setActiveTab('Jobs')}
                  className="px-4 py-2 rounded-xl bg-[#131313] hover:bg-[#EE2C3C] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Vacancies &amp; Apply</span>
                  <span>&rarr;</span>
                </button>
                <button
                  onClick={() =>
                    setDismissedNotificationIds((prev) => [...prev, ...unread.map((u) => u.id)])
                  }
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })()}

        {/* REVOKED ACCESS NOTIFICATION BANNER */}
        {isAccessRevoked && (
          <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block flex-shrink-0" />
              <div>
                <span className="text-sm sm:text-base font-bold block">
                  Workstation Access Revoked By Administrator
                </span>
                <span className="text-xs sm:text-sm font-medium text-rose-700">
                  Your CAD lab workstation privileges and software license access are currently suspended. Please contact Er. Swamy Naidu or Ameerpet center administration to reactivate your access.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold">
              Suspended
            </span>
          </div>
        )}

        {/* Dynamic Body Content */}
        <div className="p-6 sm:p-8 flex-1 space-y-6">
          {/* TAB 1: HOME */}
          {activeTab === 'Home' && (
            <div className="space-y-6">
              {/* Quick Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Syllabus Progress
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {watchedClassesCount}/{totalClassesCount} Classes
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-extrabold text-[#EE2C3C]">
                      {overallSyllabusProgress}%
                    </span>
                    <span className="text-xs text-emerald-600 font-semibold">
                      {overallSyllabusProgress === 100 ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="bg-[#EE2C3C] h-full rounded-full transition-all duration-500"
                      style={{ width: `${overallSyllabusProgress}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Lab Attendance
                  </span>
                  <span className="text-3xl font-extrabold text-[#131313]">94.2%</span>
                  <span className="text-xs text-emerald-600 font-medium block mt-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Ameerpet Campus &bull; Regular
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    CAD Designs Submitted
                  </span>
                  <span className="text-3xl font-extrabold text-[#131313]">3 Models</span>
                  <span className="text-xs text-slate-500 font-medium block mt-1.5">
                    BIM, 3D Piping &amp; Floor Plans
                  </span>
                </div>

                <div
                  onClick={() => setActiveTab('Certificates')}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-400 transition-all cursor-pointer"
                  title="Click to view official verified certificates"
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Verified Credentials
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {studentCertificates.length > 0 ? `Issued (${studentCertificates.length})` : 'Eligible'}
                  </span>
                  <span className="text-xs text-slate-600 font-medium block mt-1.5 flex items-center gap-1">
                    View Certificate &rarr;
                  </span>
                </div>
              </div>

              {/* Dynamic Assigned Courses by Admin - Professional LMS Course Cards (Image-2 Fix) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#131313]">
                      Assigned Engineering Programs
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Accredited training programs and video lectures active on your student profile
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        fetchCourses();
                        showVideoToast('Syllabus updated from database ↻');
                      }}
                      className="px-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                      title="Sync latest classes added by Admin"
                    >
                      <span>↻ Sync Classes</span>
                    </button>
                    <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                      {studentUser.assignedCourses.length} Enrolled {studentUser.assignedCourses.length === 1 ? 'Program' : 'Programs'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCoursesData.map((courseData, idx) => {
                    const matched = courseData.matched;
                    const cName = courseData.name;
                    const classCount = courseData.totalCount;
                    const courseImage =
                      matched?.image ||
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80';

                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                      >
                        {/* Course Banner Image with Guaranteed Fallback */}
                        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                          <img
                            src={courseImage}
                            alt={cName}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80';
                            }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                          {/* Top Left Tags */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-full bg-white/95 text-[#131313] text-xs font-mono font-bold shadow-xs">
                              {matched?.code || `COURSE #${idx + 1}`}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
                                isAccessRevoked
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isAccessRevoked ? 'Suspended' : 'Active'}
                            </span>
                          </div>

                          {/* Bottom Right Class Count Pill */}
                          <div className="absolute bottom-3 right-3">
                            <span className="px-3 py-1 rounded-full bg-white/95 text-[#131313] text-xs font-bold shadow-xs flex items-center gap-1.5">
                              <span className="text-[#EE2C3C]">▶</span>
                              <span>{classCount} Class Videos</span>
                            </span>
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              {matched?.domain || 'Industrial Engineering CAD'}
                            </div>
                            <h4 className="text-lg font-bold text-[#131313] group-hover:text-[#EE2C3C] transition-colors leading-snug">
                              {cName}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                              {matched?.overview ||
                                'Full industrial syllabus with live lab exercises, 3D modeling, and capstone project submission.'}
                            </p>

                            {/* Dynamic Course Progress Bar */}
                            <div className="pt-2 space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-600">Course Progress</span>
                                <span className="font-bold text-[#EE2C3C]">
                                  {courseData.progressPercent}% ({courseData.watchedCount}/{courseData.totalCount} Classes)
                                </span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#EE2C3C] h-full rounded-full transition-all duration-500"
                                  style={{ width: `${courseData.progressPercent}%` }}
                                />
                              </div>
                            </div>

                            {/* Software Tools Pills */}
                            {matched?.software && (
                              <div className="pt-2 flex flex-wrap gap-1.5">
                                {matched.software.split(',').map((tool, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                                  >
                                    {tool.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Card Action Footer */}
                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-500 font-medium">
                              Ameerpet Campus Lab
                            </span>
                            <button
                              onClick={() => {
                                const targetCourse = matched || {
                                  id: `course-${idx}`,
                                  code: `CAD-${idx + 1}`,
                                  title: cName,
                                  folder: 'civil',
                                  domain: 'Engineering CAD',
                                  software: 'CAD Suite',
                                  duration: '60 Days',
                                  mode: 'Classroom & Lab',
                                  fee: 30000,
                                  syllabus: [],
                                  classes: courseData.classes,
                                };
                                handleOpenStudio(targetCourse, courseData.classes[0]);
                              }}
                              className="px-5 py-2.5 rounded-xl bg-[#131313] hover:bg-[#EE2C3C] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                            >
                              <span>View Classes</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE - EXECUTIVE STUDENT DOSSIER & FINANCIAL LEDGER */}
          {activeTab === 'Profile' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
              {/* LEFT / MAIN COLUMN: DOSSIER & FINANCIAL LEDGER (8 Columns) */}
              <div className="xl:col-span-8 space-y-6">

                {/* 1. TOP HEADER & IDENTITY DOSSIER */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div className="flex items-start sm:items-center space-x-5">
                      {/* Student Photo / Avatar */}
                      <div className="relative flex-shrink-0">
                        {studentUser.photo ? (
                          <img
                            src={studentUser.photo}
                            alt={studentUser.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#131313] text-white font-bold flex items-center justify-center text-3xl border-2 border-slate-200 shadow-sm">
                            {studentUser.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#131313] text-white shadow-2xs">
                          ID
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-2xl font-bold text-[#131313] tracking-tight">{studentUser.name}</h2>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              isAccessRevoked
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {isAccessRevoked ? 'STATUS: ACCESS SUSPENDED' : 'STATUS: ENROLLED & ACTIVE'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                          Student Registration: <span className="font-mono font-bold text-[#131313]">{studentUser.id}</span> &bull; Admitted: <span className="font-semibold text-slate-800">{studentUser.admissionDate}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Primary Discipline: <span className="font-semibold text-slate-800">{studentUser.stream}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Button: Edit Profile Details Toggle */}
                    <div className="flex items-center space-x-3">
                      {isEditingProfile ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingProfile(false);
                            setProfileSaveMsg(null);
                          }}
                          className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditName(studentUser.name);
                            setEditPhone(studentUser.phone);
                            setEditCollege(studentUser.college);
                            setEditNativePlace(studentUser.nativePlace);
                            setEditQualification(studentUser.qualification);
                            setEditPhoto(studentUser.photo);
                            setIsEditingProfile(true);
                            setProfileSaveMsg(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#131313] text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                        >
                          Edit Profile Details
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Profile Edit Feedback Alert */}
                  {profileSaveMsg && (
                    <div
                      className={`mt-4 p-3.5 rounded-xl text-xs font-semibold border ${
                        profileSaveMsg.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {profileSaveMsg.type === 'success' ? 'CONFIRMATION: ' : 'ERROR: '}
                      {profileSaveMsg.text}
                    </div>
                  )}

                  {/* EDIT PROFILE FORM or CLEAN KEY-VALUE SUMMARY (NO BOXES) */}
                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="pt-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Contact Phone / Mobile
                          </label>
                          <input
                            type="text"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            required
                            placeholder="+91 99080 12345"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            College / University
                          </label>
                          <input
                            type="text"
                            value={editCollege}
                            onChange={(e) => setEditCollege(e.target.value)}
                            required
                            placeholder="e.g. JNTU Hyderabad / Osmania University"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Native Place / Hometown
                          </label>
                          <input
                            type="text"
                            value={editNativePlace}
                            onChange={(e) => setEditNativePlace(e.target.value)}
                            required
                            placeholder="e.g. Ameerpet, Hyderabad / Vijayawada"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Highest Qualification &amp; Branch
                          </label>
                          <input
                            type="text"
                            value={editQualification}
                            onChange={(e) => setEditQualification(e.target.value)}
                            required
                            placeholder="e.g. B.Tech Civil Engineering / Diploma Mech"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Profile Photo URL
                          </label>
                          <input
                            type="url"
                            value={editPhoto}
                            onChange={(e) => setEditPhoto(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                          />
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            Paste any image URL or leave blank to display initials.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer shadow-sm hover:shadow-md transition-all"
                        >
                          Discard Changes
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm hover:shadow-md transition-all disabled:opacity-50 active:scale-[0.98]"
                        >
                          {isSavingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* REFINED KEY-VALUE PROFILE INFORMATION (NO BOX-IN-A-BOX) */
                    <div className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                        <div className="pb-3 border-b border-slate-100 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Email Address
                          </span>
                          <span className="text-sm font-bold text-[#131313] mt-1 break-all">
                            {studentUser.email}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Primary Login Identifier
                          </span>
                        </div>

                        <div className="pb-3 border-b border-slate-100 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Contact Phone / Mobile
                          </span>
                          <span className="text-sm font-bold text-[#131313] mt-1">
                            {studentUser.phone || '+91 99080 12345'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Verified Student Contact
                          </span>
                        </div>

                        <div className="pb-3 border-b border-slate-100 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            College / University
                          </span>
                          <span className="text-sm font-bold text-[#131313] mt-1">
                            {studentUser.college || 'JNTU Hyderabad'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Academic Institution
                          </span>
                        </div>

                        <div className="pb-3 border-b border-slate-100 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Native Place / Hometown
                          </span>
                          <span className="text-sm font-bold text-[#131313] mt-1">
                            {studentUser.nativePlace || 'Hyderabad'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Permanent Residence
                          </span>
                        </div>

                        <div className="pb-3 border-b border-slate-100 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Highest Qualification
                          </span>
                          <span className="text-sm font-bold text-[#131313] mt-1">
                            {studentUser.qualification || 'B.Tech Civil Engineering'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Degree / Specialization
                          </span>
                        </div>

                        <div className="pb-3 border-b border-slate-100 flex flex-col justify-between">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Campus Main Location
                          </span>
                          <span className="text-sm font-bold text-[#131313] mt-1">
                            {studentUser.campusLocation || 'Ameerpet Main Center, Hyderabad'}
                          </span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Hyderabad Headquarters
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. FINANCIAL LEDGER & FEE PAYMENT SUMMARY */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Institutional Accounts &amp; Billing
                      </span>
                      <h3 className="text-xl font-bold text-[#131313]">Fee Summary &amp; Payment Ledger</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          studentUser.balanceFee === 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {studentUser.balanceFee === 0 ? 'STATUS: FULLY PAID' : 'STATUS: PARTIAL PAYMENT (BALANCE DUE)'}
                      </span>
                    </div>
                  </div>

                  {/* 3 Metric Cards (Refined with subtle border radius and shadow) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total Course Fee */}
                    <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-sm transition-all">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                        Total Course Fee
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-[#131313] font-mono">
                        ₹{studentUser.courseFee.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Courseware &amp; Evaluation Package Included
                      </span>
                    </div>

                    {/* How Much They Paid */}
                    <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-2xs hover:shadow-sm transition-all">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                        Total Amount Paid
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                        ₹{studentUser.paidFee.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                        Verified &amp; Deposited in Institute Account
                      </span>
                    </div>

                    {/* Remaining Balance */}
                    <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-2xs hover:shadow-sm transition-all">
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block mb-1">
                        Remaining Balance Due
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-amber-700 font-mono">
                        ₹{studentUser.balanceFee.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[11px] text-amber-700 font-medium block mt-1">
                        Payable before final project certification
                      </span>
                    </div>
                  </div>

                  {/* Solid Progress Bar (Zero Gradients) */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 uppercase tracking-wider">Fee Clearance Progress</span>
                      <span className="text-[#131313] font-mono">
                        {studentUser.courseFee > 0
                          ? `${Math.min(100, Math.round((studentUser.paidFee / studentUser.courseFee) * 100))}% Cleared`
                          : '100% Cleared'}
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-[#16A34A] transition-all duration-300 rounded-full"
                        style={{
                          width: `${
                            studentUser.courseFee > 0
                              ? Math.min(100, Math.round((studentUser.paidFee / studentUser.courseFee) * 100))
                              : 100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Paid: ₹{studentUser.paidFee.toLocaleString('en-IN')}</span>
                      <span>Balance: ₹{studentUser.balanceFee.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Verified Payment Receipts Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#131313]">
                        Verified Payment Receipts ({studentUser.paymentReceipts.length})
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        OFFICIAL R&amp;D CADD FINANCIAL RECORDS
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="px-4 py-3">Receipt No</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Amount Paid</th>
                            <th className="px-4 py-3">Payment Mode</th>
                            <th className="px-4 py-3">Ref / UTR Number</th>
                            <th className="px-4 py-3">Verification</th>
                            <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {studentUser.paymentReceipts.map((r, idx) => (
                            <tr key={r.receiptId || idx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-[#131313]">{r.receiptId}</td>
                              <td className="px-4 py-3 text-slate-700">{r.date}</td>
                              <td className="px-4 py-3 font-mono font-bold text-emerald-700">₹{r.amount.toLocaleString('en-IN')}</td>
                              <td className="px-4 py-3 text-slate-700">{r.paymentMode}</td>
                              <td className="px-4 py-3 font-mono text-slate-600">{r.refNumber}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  {r.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedReceiptForModal(r)}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#131313] hover:bg-slate-800 text-white text-[11px] font-semibold cursor-pointer shadow-xs hover:shadow-sm transition-all"
                                >
                                  View Receipt
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE PANEL: SECURITY, WORKSTATION & SUPPORT (4 Columns) */}
              <div className="xl:col-span-4 space-y-6">

                {/* 3. ACCOUNT SECURITY & PASSWORD CHANGE */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5 hover:shadow-md transition-shadow">
                  <div className="pb-4 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Student Security
                    </span>
                    <h3 className="text-lg font-bold text-[#131313]">Security &amp; Password</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Update your account password to secure your workstation &amp; student portal.
                    </p>
                  </div>

                  {/* Password Feedback Alert */}
                  {passwordStatusMsg && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-semibold border ${
                        passwordStatusMsg.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      {passwordStatusMsg.type === 'success' ? 'SUCCESS: ' : 'ERROR: '}
                      {passwordStatusMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="Current password (default: 9908)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Minimum 4 characters"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="w-full py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm hover:shadow-md transition-all disabled:opacity-50 active:scale-[0.98]"
                      >
                        {isChangingPassword ? 'Updating Password...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* 4. ACADEMIC ENROLLMENT & WORKSTATION ALLOCATION (Key-Value, No Boxes) */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-4 hover:shadow-md transition-shadow">
                  <div className="pb-3 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                      Campus Lab Allotment
                    </span>
                    <h3 className="text-lg font-bold text-[#131313]">Workstation &amp; Mentor</h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="pb-3 border-b border-slate-100">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block text-[11px]">
                        Designated CAD Workstation
                      </span>
                      <span className="font-mono font-bold text-sm text-[#131313] block mt-0.5">
                        {studentUser.labWorkstation || 'Seat #04 - BIM Modeling Lab 2'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Equipped with NVIDIA Quadro CAD Rig
                      </span>
                    </div>

                    <div className="pb-3 border-b border-slate-100">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block text-[11px]">
                        Assigned Lead Instructor
                      </span>
                      <span className="font-bold text-sm text-[#131313] block mt-0.5">
                        {studentUser.leadInstructor || 'Er. Swamy Naidu'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Senior BIM Architect &amp; Technical Director
                      </span>
                    </div>

                    <div className="pb-3 border-b border-slate-100">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block text-[11px]">
                        Campus Support Helpline
                      </span>
                      <span className="font-mono font-bold text-sm text-[#131313] block mt-0.5">
                        +91 99080 12345
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Metro Pillar 1042, Ameerpet, Hyderabad
                      </span>
                    </div>
                  </div>

                  {/* Certifications Link */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#131313] block">
                        Certifications ({studentCertificates.length})
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Autodesk &amp; Dassault credentials
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('Certificates')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#131313] hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* 5. QUICK CAMPUS SUPPORT CARD */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Student Help &amp; Grievances
                  </span>
                  <h4 className="text-sm font-bold text-[#131313]">
                    Have an issue or need fee receipt assistance?
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Raise an official academic ticket or reach out directly to the Ameerpet campus coordinator.
                  </p>
                  <button
                    onClick={() => setActiveTab('Help')}
                    className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-[#131313] text-xs font-bold uppercase tracking-wider shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                  >
                    Open Support &amp; Tickets &rarr;
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB: JOBS & PLACEMENTS (Real-Time Synced with jobs.unlox.com styling) */}
          {activeTab === 'Jobs' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                      Core Engineering Job Openings &amp; Verified Placement Drives
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      All vacancies are verified with corporate EPC partners. Apply with 1-click using your certified RND CADD student profile.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {studentJobs.filter((j) => j.status === 'Active').length} Active Vacancies
                    </span>
                    <button
                      onClick={fetchStudentJobs}
                      disabled={isLoadingJobs}
                      className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#131313] border border-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{isLoadingJobs ? 'Syncing...' : '↻ Refresh Openings'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="Search by role, company, CAD software, or city..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#EE2C3C] bg-slate-50/50"
                  />
                  <svg className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {jobSearchQuery && (
                    <button
                      onClick={() => setJobSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Stream Filter */}
                  <select
                    value={jobStreamFilter}
                    onChange={(e) => setJobStreamFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#131313] focus:outline-none focus:border-[#EE2C3C]"
                  >
                    <option value="all">All Engineering Disciplines</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil / Structural</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Architectural">Architectural / BIM</option>
                    <option value="Piping">Piping &amp; Plant Design</option>
                  </select>

                  {/* Mode Filter */}
                  <select
                    value={jobModeFilter}
                    onChange={(e) => setJobModeFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#131313] focus:outline-none focus:border-[#EE2C3C]"
                  >
                    <option value="all">All Work Modes</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              {/* Jobs List */}
              {(() => {
                const q = jobSearchQuery.toLowerCase();
                const filtered = studentJobs.filter((job) => {
                  const jobSkills = job.skills || job.tools || [];
                  const jobStream = job.stream || job.discipline || 'All Streams';
                  const matchesSearch =
                    !q ||
                    job.title.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q) ||
                    job.location.toLowerCase().includes(q) ||
                    jobSkills.some((s) => s.toLowerCase().includes(q));

                  const matchesStream =
                    jobStreamFilter === 'all' ||
                    jobStream.toLowerCase() === jobStreamFilter.toLowerCase() ||
                    jobStream === 'All Streams';

                  const matchesMode =
                    jobModeFilter === 'all' || job.workMode === jobModeFilter;

                  return matchesSearch && matchesStream && matchesMode;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-[#131313]">No Matching Job Vacancies</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        There are currently no active vacancies matching your search or filters. Check back soon or reset filters.
                      </p>
                      <button
                        onClick={() => {
                          setJobSearchQuery('');
                          setJobStreamFilter('all');
                          setJobModeFilter('all');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#131313] text-white text-xs font-bold hover:bg-[#EE2C3C] transition-all cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filtered.map((job) => {
                      const hasApplied = job.applicants?.some(
                        (a) =>
                          a.studentId === studentUser.id ||
                          a.email?.toLowerCase() === studentUser.email?.toLowerCase()
                      );
                      const isClosed = job.status === 'Closed';

                      const streamColors: Record<string, string> = {
                        Mechanical: 'bg-amber-50 text-amber-800 border-amber-200',
                        Civil: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        Electrical: 'bg-sky-50 text-sky-800 border-sky-200',
                        Architectural: 'bg-violet-50 text-violet-800 border-violet-200',
                        Piping: 'bg-rose-50 text-rose-800 border-rose-200',
                      };
                      const streamStyle =
                        streamColors[job.stream] || 'bg-slate-50 text-slate-800 border-slate-200';

                      return (
                        <div
                          key={job.id}
                          className={`p-6 rounded-2xl border transition-all bg-white shadow-xs hover:shadow-md ${
                            hasApplied
                              ? 'border-emerald-300 bg-emerald-50/20'
                              : isClosed
                              ? 'border-slate-200 opacity-75'
                              : 'border-slate-200/90 hover:border-slate-400'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                            {/* Left Section */}
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-[#131313] text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-xs">
                                {job.companyLogo ? (
                                  <img
                                    src={job.companyLogo}
                                    alt={job.company}
                                    className="w-full h-full object-contain p-1 rounded-xl"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  job.company.substring(0, 2).toUpperCase()
                                )}
                              </div>

                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-lg sm:text-xl font-bold text-[#131313] tracking-tight">
                                    {job.title}
                                  </h3>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${streamStyle}`}
                                  >
                                    {job.stream}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                                    {job.workMode}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                    {job.jobType}
                                  </span>
                                   {hasApplied && (
                                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                                      <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span>Applied</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                                  <span className="font-semibold text-slate-900">{job.company}</span>
                                  <span>&bull;</span>
                                  <span>{job.location}</span>
                                  <span>&bull;</span>
                                  <span className="font-semibold text-[#131313] font-mono">{job.salary}</span>
                                  <span>&bull;</span>
                                  <span>{job.vacancies} {job.vacancies === 1 ? 'Opening' : 'Openings'}</span>
                                  <span>&bull;</span>
                                  <span>Exp: {job.experience}</span>
                                </div>

                                {/* Skills */}
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                  {(job.skills || job.tools || []).map((skill: string, sIdx: number) => (
                                    <span
                                      key={sIdx}
                                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>

                                {/* Description */}
                                {job.description && (
                                  <p className="text-xs text-slate-600 leading-relaxed pt-1 font-normal">
                                    {job.description}
                                  </p>
                                )}

                                {/* Requirements bullets */}
                                {job.requirements && job.requirements.length > 0 && (
                                  <div className="pt-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                      Key Requirements:
                                    </span>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600">
                                      {job.requirements.map((req, rIdx) => (
                                        <li key={rIdx} className="flex items-center gap-1.5">
                                          <span className="text-emerald-600 font-bold">&bull;</span>
                                          <span>{req}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Section: Apply Action */}
                            <div className="flex flex-col items-end justify-between gap-3 flex-shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 min-w-[200px]">
                              <div className="text-right text-xs text-slate-500">
                                <div>Deadline: <span className="font-semibold text-slate-700">{job.deadline}</span></div>
                                <div className="text-[11px] text-slate-400 mt-0.5">Posted: {job.postedDate}</div>
                              </div>

                              {hasApplied ? (
                                <div className="w-full text-center p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                  <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Application Submitted</span>
                                  </span>
                                  <span className="text-[11px] text-emerald-600 font-medium">
                                    Forwarded to HR Team
                                  </span>
                                </div>
                              ) : isClosed ? (
                                <div className="w-full text-center p-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold">
                                  Position Closed
                                </div>
                              ) : (
                                <button
                                  onClick={() => setApplyingJob(job)}
                                  className="w-full px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                  <span>Quick Apply</span>
                                  <span>&rarr;</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* QUICK APPLY MODAL */}
              {applyingJob && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#EE2C3C] block mb-1">
                          Direct Placement Application
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-[#131313]">
                          Apply for {applyingJob.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {applyingJob.company} &bull; {applyingJob.location} &bull; {applyingJob.salary}
                        </p>
                      </div>
                      <RedCrossCloseButton onClick={() => setApplyingJob(null)} />
                    </div>

                    {/* Success Notice */}
                    {applySuccessMsg && (
                      <div className="m-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
                        {applySuccessMsg}
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleApplyToJob} className="p-6 space-y-4">
                      {/* Read-Only Pre-filled Info */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-[#131313] block">
                          Verified Student Profile Data
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500">Student Name:</span>{' '}
                            <span className="font-bold text-slate-900">{studentUser.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Student ID:</span>{' '}
                            <span className="font-mono font-bold text-slate-900">{studentUser.id}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Email:</span>{' '}
                            <span className="font-bold text-slate-900">{studentUser.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Track:</span>{' '}
                            <span className="font-bold text-slate-900">{studentUser.stream}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Mobile */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Contact Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={applyStudentPhone}
                          onChange={(e) => setApplyStudentPhone(e.target.value)}
                          placeholder="e.g. +91 9908123456"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C]"
                        />
                      </div>

                      {/* Portfolio URL */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          CAD / BIM Project Portfolio Link (Google Drive / LinkedIn / Behance)
                        </label>
                        <input
                          type="url"
                          value={applyPortfolioUrl}
                          onChange={(e) => setApplyPortfolioUrl(e.target.value)}
                          placeholder="https://drive.google.com/... or https://linkedin.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C]"
                        />
                        <span className="text-[11px] text-slate-500">
                          Candidates providing project drawings or 3D CAD models receive 3x higher interview shortlist rates.
                        </span>
                      </div>

                      {/* Cover Note */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          CAD Software Expertise &amp; Note to Hiring Team
                        </label>
                        <textarea
                          rows={3}
                          value={applyCoverNote}
                          onChange={(e) => setApplyCoverNote(e.target.value)}
                          placeholder="Highlight your hands-on CAD software proficiency (e.g. SolidWorks GD&T, Revit BIM modeling, AutoCAD 2D detailings)..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C]"
                        />
                      </div>

                      {/* Modal Actions */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setApplyingJob(null)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingApplication}
                          className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingApplication ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Submitting Application...</span>
                            </>
                          ) : (
                            <span>Submit Application &rarr;</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CERTIFICATES & CREDENTIALS (Real-Time Synced) */}
          {activeTab === 'Certificates' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                      Official Student Certificates &amp; Credentials
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Verified industrial CAD credentials issued student-wise by RND CADD Academy Ameerpet Campus.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {studentCertificates.length} {studentCertificates.length === 1 ? 'Verified Certificate' : 'Verified Certificates'}
                    </span>
                  </div>
                </div>

                {studentCertificates.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#EE2C3C] flex items-center justify-center mx-auto border border-rose-200 shadow-2xs">
                      <svg className="w-8 h-8 text-[#EE2C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-[#131313]">
                      No Official Certificates Uploaded Yet
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
                      Your official Autodesk &amp; Dassault Systemes certificates are uploaded here by Academic Director Er. Swamy Naidu upon course completion and capstone evaluation.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab('Home')}
                        className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#131313] border border-slate-300 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                      >
                        Back to Dashboard &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {studentCertificates.map((cert) => {
                      return (
                        <div
                          key={cert.id || cert.certId}
                          className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400 hover:shadow-md p-6 flex flex-col justify-between space-y-5 transition-all shadow-xs"
                        >
                          <div className="space-y-4">
                            {/* Badges row */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center space-x-1">
                                <svg className="w-3 h-3 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Verified Credential</span>
                              </span>
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-rose-50 text-[#EE2C3C] border border-rose-200">
                                {cert.certId}
                              </span>
                            </div>

                            {/* Course Title & Track */}
                            <div>
                              <h4 className="text-lg font-bold text-[#131313] leading-snug">
                                {cert.course}
                              </h4>
                              {cert.track && (
                                <span className="text-xs font-semibold text-[#EE2C3C] block mt-1">
                                  Track: {cert.track}
                                </span>
                              )}
                            </div>

                            {/* Recipient Details */}
                            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-500">Student:</span>
                                <span className="font-bold text-[#131313]">{cert.studentName} ({cert.studentId})</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-500">Performance:</span>
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{cert.grade}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-500">Issued On:</span>
                                <span className="font-medium text-slate-700">{cert.issueDate}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-500">Issuer:</span>
                                <span className="font-medium text-slate-700 truncate max-w-[170px]">{cert.issuer || 'Academic Director'}</span>
                              </div>
                            </div>

                            {/* Document Info */}
                            <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
                              <span>{cert.fileName || `${cert.certId}.pdf`}</span>
                              <span>&bull;</span>
                              <span>{cert.fileSize || 'Verified PDF'}</span>
                            </div>

                            {/* Remarks if any */}
                            {cert.notes && (
                              <p className="text-xs text-slate-600 font-normal italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
                                &ldquo;{cert.notes}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Action Buttons: View Certificate & Download */}
                          <div className="pt-3 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-2.5">
                              <button
                                type="button"
                                onClick={() => setSelectedCertificateForView(cert)}
                                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#131313] border border-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                              >
                                <svg className="w-4 h-4 text-[#131313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>View</span>
                              </button>

                              <a
                                href={cert.fileUrl || '/sample-certificate.pdf'}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={cert.fileName || `${cert.certId || 'Certificate'}.pdf`}
                                className="w-full py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                              >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <span>Download</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: E-BOOKS & CAD REFERENCE LIBRARY (Real-Time Synced) */}
          {activeTab === 'E-Books' && (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                      Official CAD Reference Manuals &amp; E-Books
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Official Autodesk, Dassault, and IS-Code technical manuals distributed to your student workstation.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {studentEbooks.filter((b) => b.accessType === 'free').length} Free Books
                    </span>
                    <span className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                      {studentEbooks.filter((b) => b.accessType !== 'free').length} Paid Books
                    </span>
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold">
                      {studentEbooks.length} Total Books
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setEbookFilterTab('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        ebookFilterTab === 'all'
                          ? 'bg-[#131313] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#131313]'
                      }`}
                    >
                      All Books ({studentEbooks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEbookFilterTab('free')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        ebookFilterTab === 'free'
                          ? 'bg-[#131313] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#131313]'
                      }`}
                    >
                      Free Books ({studentEbooks.filter((b) => b.accessType === 'free').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEbookFilterTab('paid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        ebookFilterTab === 'paid'
                          ? 'bg-[#131313] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#131313]'
                      }`}
                    >
                      Paid Books ({studentEbooks.filter((b) => b.accessType !== 'free').length})
                    </button>
                  </div>

                  <input
                    type="text"
                    value={ebookSearchQuery}
                    onChange={(e) => setEbookSearchQuery(e.target.value)}
                    placeholder="Search e-books by title or course..."
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-[#EE2C3C] w-full sm:w-64"
                  />
                </div>

                {/* E-Books Content */}
                {studentEbooks.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#EE2C3C] flex items-center justify-center mx-auto border border-rose-200 shadow-2xs">
                      <svg className="w-8 h-8 text-[#EE2C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-[#131313]">
                      No CAD E-Books Available Yet
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
                      Official CAD technical handbooks, command guides, and engineering workbooks will be uploaded here by academy instructors.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {studentEbooks
                      .filter((b) => {
                        if (ebookFilterTab === 'free' && b.accessType !== 'free') return false;
                        if (ebookFilterTab === 'paid' && b.accessType === 'free') return false;
                        if (!ebookSearchQuery.trim()) return true;
                        const q = ebookSearchQuery.toLowerCase();
                        return (
                          b.title.toLowerCase().includes(q) ||
                          b.course.toLowerCase().includes(q) ||
                          (b.description && b.description.toLowerCase().includes(q))
                        );
                      })
                      .map((book) => {
                        const isFree = book.accessType === 'free';
                        const isPaid = !isFree;

                        return (
                          <div
                            key={book.id}
                            className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all shadow-xs ${
                              isFree
                                ? 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-md'
                                : 'bg-white border-slate-200/90 hover:border-amber-300 hover:shadow-md'
                            }`}
                          >
                            <div className="space-y-3">
                              {/* PROMINENT BOOK COVER IMAGE (Student can see the book image) */}
                              <div
                                onClick={() => setSelectedBookCoverForView(book)}
                                className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer group"
                              >
                                {book.coverImage ? (
                                  <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
                                    <img
                                      src={book.coverImage}
                                      alt={book.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                ) : (
                                  <BookCoverGraphic book={book} />
                                )}
                              </div>

                              {/* Header Badges */}
                              <div className="flex items-center justify-between gap-2 pt-1">
                                {isFree ? (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Free Access
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                    Paid E-Book
                                  </span>
                                )}

                                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-700">
                                  {isFree ? 'All Students' : 'Preview Only'}
                                </span>
                              </div>

                              {/* Title & Course */}
                              <div>
                                <h4 className="text-base font-bold text-[#131313] leading-snug line-clamp-2">
                                  {book.title}
                                </h4>
                                <span className="text-xs font-semibold text-[#EE2C3C] block mt-1 truncate">
                                  {book.course}
                                </span>
                              </div>

                              {/* Pages & Size */}
                              <div className="flex items-center space-x-3 text-xs font-medium text-slate-500">
                                <span>{book.pages || 'Handbook'}</span>
                                <span>&bull;</span>
                                <span>{book.pdfSize || 'Verified PDF'}</span>
                              </div>

                              {/* Description */}
                              {book.description && (
                                <p className="text-xs text-slate-600 font-normal line-clamp-2">
                                  {book.description}
                                </p>
                              )}
                            </div>

                            {/* Actions / Routing based on Free vs Paid */}
                            <div className="pt-2 border-t border-slate-100">
                              {isFree ? (
                                /* Free E-Book: Open and download for all students */
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedEbookForRead(book)}
                                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#131313] border border-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                                  >
                                    <span>Read PDF</span>
                                  </button>

                                  <a
                                    href={book.pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={book.pdfName || `${book.title}.pdf`}
                                    className="w-full py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs text-center"
                                  >
                                    <span>Download</span>
                                  </a>
                                </div>
                              ) : (
                                /* Paid E-Book: Students NOT able to open PDF, just see book image, with proper routing */
                                <div className="space-y-2.5">
                                  <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                      <span className="font-bold block">Paid CAD Handbook</span>
                                      <span className="text-[11px] text-amber-800 leading-tight">
                                        Student can view cover image &amp; syllabus preview only. Full PDF is locked.
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedBookCoverForView(book)}
                                      className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#131313] border border-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                                    >
                                      <svg className="w-4 h-4 text-[#131313]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span>View Image</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedEbookForPurchase(book)}
                                      className="w-full py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                                    >
                                      <span>Buy / Unlock &rarr;</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE */}
          {activeTab === 'Live' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                  Active Virtual CAD Lab &amp; Live Sessions
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Trainer Er. Swamy Naidu is currently live demonstrating Parametric Family Creation in Autodesk Revit.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-slate-50/70 border border-slate-200 text-center space-y-4">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wide">CAD Workstation Stream Ready</span>
                <button
                  disabled={isAccessRevoked}
                  className={`px-8 py-3.5 rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer ${
                    isAccessRevoked
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#EE2C3C] hover:bg-[#D71E2E] text-white'
                  }`}
                >
                  {isAccessRevoked ? 'Workstation Access Suspended' : 'Connect to Live Workstation Screen →'}
                </button>
              </div>
            </div>
          )}

          {/* TAB: ASSIGNMENTS (Direct Download Only) */}
          {activeTab === 'Assignments' && (
            <div className="space-y-6">
              {isLoadingAssignments ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <div className="w-8 h-8 border-3 border-[#EE2C3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">Loading assignments...</p>
                </div>
              ) : (
                (() => {
                  const filtered = studentAssignments;

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
                        <h4 className="text-base font-bold text-[#131313]">No assignments available</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          There are currently no assignments assigned for your enrolled course.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filtered.map((a) => (
                        <div
                          key={a.id}
                          className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-2xs hover:border-slate-300 transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                {a.course}
                              </span>
                              <span className="text-xs font-semibold text-slate-500 font-mono">
                                Due: {a.dueDate}
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-[#131313] leading-snug">
                              {a.title}
                            </h4>

                            <p className="text-xs text-slate-600 leading-relaxed">
                              {a.description}
                            </p>

                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                              <span className="font-semibold text-slate-800 truncate">{a.pdfName}</span>
                              <span className="text-[11px] font-mono text-slate-500 flex-shrink-0 ml-2">
                                {a.pdfSize || 'PDF'}
                              </span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100">
                            <a
                              href={a.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              className="w-full py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold uppercase tracking-wider text-center block transition-all shadow-xs cursor-pointer"
                            >
                              Download Assignment
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* TAB 6: SUPPORT & TICKETS (Doubt Clearance Channel) */}
          {/* TAB 6: SUPPORT & TICKETS (Doubt Clearance Channel) */}
          {activeTab === 'Chat' && (
            <div className="space-y-6">
              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Total Tickets
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#131313] block mt-1">
                    {studentTickets.length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    All Helpdesk Inquiries
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wider block">
                    Under Review
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 block mt-1">
                    {studentTickets.filter((t) => t.status !== 'Resolved').length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Awaiting Faculty Reply
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider block">
                    Solved &amp; Resolved
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 block mt-1">
                    {studentTickets.filter((t) => t.status === 'Resolved').length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Solutions Published
                  </span>
                </div>
              </div>

              {/* Enterprise Tickets Container */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                {/* Filter Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
                      <button
                        onClick={() => setTicketFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          ticketFilter === 'all'
                            ? 'bg-[#131313] text-white shadow-2xs font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        All ({studentTickets.length})
                      </button>
                      <button
                        onClick={() => setTicketFilter('open')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          ticketFilter === 'open'
                            ? 'bg-amber-600 text-white shadow-2xs font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Pending ({studentTickets.filter((t) => t.status !== 'Resolved').length})
                      </button>
                      <button
                        onClick={() => setTicketFilter('resolved')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                          ticketFilter === 'resolved'
                            ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Resolved ({studentTickets.filter((t) => t.status === 'Resolved').length})
                      </button>
                    </div>

                    <input
                      type="text"
                      value={ticketSearchQuery}
                      onChange={(e) => setTicketSearchQuery(e.target.value)}
                      placeholder="Search ticket #, subject, or query..."
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs text-[#131313] focus:outline-none focus:border-[#EE2C3C] bg-white w-48 sm:w-64 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsRaiseTicketModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                    >
                      Raise Support Ticket
                    </button>
                  </div>
                </div>

                {/* Tickets Content List */}
                {isLoadingTickets ? (
                  <div className="p-12 text-center text-sm font-medium text-slate-500">
                    Syncing your support tickets...
                  </div>
                ) : (
                  (() => {
                    const filtered = studentTickets.filter((t) => {
                      const matchFilter =
                        ticketFilter === 'all' ||
                        (ticketFilter === 'open' && t.status !== 'Resolved') ||
                        (ticketFilter === 'resolved' && t.status === 'Resolved');

                      const q = ticketSearchQuery.toLowerCase();
                      const matchQuery =
                        !q ||
                        t.ticketNumber.toLowerCase().includes(q) ||
                        t.subject.toLowerCase().includes(q) ||
                        t.category.toLowerCase().includes(q) ||
                        t.description.toLowerCase().includes(q);

                      return matchFilter && matchQuery;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-12 text-center space-y-2">
                          <h4 className="text-base font-bold text-[#131313]">No support tickets found</h4>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Need help with software errors, workstation access, or design doubts? Click &quot;Raise Support Ticket&quot; to contact faculty mentors.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="divide-y divide-slate-100">
                        {filtered.map((t) => {
                          const isResolved = t.status === 'Resolved';
                          const isInProgress = t.status === 'In Progress';

                          return (
                            <div
                              key={t.id}
                              className="p-6 hover:bg-slate-50/60 transition-colors space-y-3"
                            >
                              {/* Ticket Header Meta */}
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                                    {t.ticketNumber}
                                  </span>
                                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                    {t.category}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                      t.priority === 'Urgent'
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : t.priority === 'High'
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                                    }`}
                                  >
                                    {t.priority} Priority
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400 font-medium">
                                    Raised on {new Date(t.createdAt).toLocaleDateString()}
                                  </span>
                                  {isResolved ? (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      Resolved
                                    </span>
                                  ) : isInProgress ? (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                      Under Review
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                      Open
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Ticket Subject & Problem Query */}
                              <div>
                                <h4 className="text-base font-bold text-[#131313] leading-snug">
                                  {t.subject}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1.5 whitespace-pre-line">
                                  {t.description}
                                </p>
                              </div>

                              {/* Official Resolution from Faculty */}
                              {t.adminReply ? (
                                <div className="mt-3 p-4 rounded-xl bg-slate-50 border-l-4 border-emerald-500 space-y-1.5">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-emerald-900">
                                      Official Resolution &bull; {t.resolvedBy || 'Er. Swamy Naidu (Director / Chief Architect)'}
                                    </span>
                                    {t.resolvedAt && (
                                      <span className="text-[11px] font-mono text-slate-400">
                                        Resolved: {new Date(t.resolvedAt).toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                                    {t.adminReply}
                                  </p>
                                </div>
                              ) : (
                                <div className="mt-2.5 p-3 rounded-xl bg-amber-50/60 border-l-4 border-amber-400 text-xs text-amber-800 font-medium">
                                  Your query is assigned to the CAD faculty desk. Expected resolution within 2-4 lab hours.
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          )}

          {/* TAB 7: REFER & EARN */}
          {activeTab === 'Refer & Earn' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                  Refer Engineering Peers &amp; Earn Benefits
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Share your unique student referral link with friends enrolling in Civil, Mechanical, or Electrical CADD. You both receive Rs 1,500 software voucher credit.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-mono text-sm font-semibold text-[#131313]">
                  https://rndcadd.com/enroll?ref=RAMG8492
                </span>
                <button className="px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto">
                  Copy Link
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: RATE */}
          {activeTab === 'Rate' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                  Rate Your Training Experience
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Your feedback helps us continuously improve our lab workstations, curriculum, and placement assistance.
                </p>
              </div>
              <div className="flex space-x-1.5 text-amber-400 cursor-pointer">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <textarea
                rows={4}
                placeholder="Write your review about the trainers and lab workstations..."
                className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C]"
              />
              <button className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm font-bold shadow-xs transition-all cursor-pointer">
                Submit Review &rarr;
              </button>
            </div>
          )}

          {/* TAB 9: SHARE */}
          {activeTab === 'Share' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                  Share Your Verified Academic Credential
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Add your verified Autodesk &amp; Dassault certification credentials directly to your LinkedIn and resume.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button className="px-5 py-2.5 rounded-xl bg-[#0077B5] hover:bg-[#005E93] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer">
                  Add to LinkedIn Profile
                </button>
                <button className="px-5 py-2.5 rounded-xl bg-[#131313] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer">
                  Download Badge PNG
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FULL-SCREEN LMS STUDIO & VIDEO LEARNING WORKSPACE (Image 2 & 5) */}
      {playerCourse && (
        <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200 select-none">
          {/* Studio Top Navigation Bar (Pleasant Light UI Theme - No Black Color) */}
          <div className="px-5 sm:px-7 py-3.5 bg-white text-slate-800 flex items-center justify-between border-b border-slate-200 shadow-xs flex-shrink-0 z-20">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <button
                type="button"
                onClick={handleCloseStudio}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-[#EE2C3C] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <span>&larr;</span>
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Exit</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block flex-shrink-0" />
              <span className="px-2.5 py-1 rounded-md bg-[#EE2C3C]/10 text-[#EE2C3C] font-mono text-xs font-bold border border-[#EE2C3C]/20 flex-shrink-0">
                {playerCourse.code || 'COURSE'}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {playerCourse.title}
                </h3>
                <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
                  Interactive CAD Lecture Studio &bull; Ameerpet Main Campus Lab
                </span>
              </div>
            </div>

            {/* Top Right: Dynamic Progress & Close Button */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {(() => {
                const currentClasses = playerCourse.classes || [];
                const courseWatched = currentClasses.filter((c) => watchedClassIds.includes(c.id)).length;
                const coursePct = currentClasses.length > 0 ? Math.round((courseWatched / currentClasses.length) * 100) : 0;
                return (
                  <div className="hidden sm:flex items-center space-x-2 bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-[#EE2C3C]" />
                    <span>{courseWatched} / {currentClasses.length} Classes ({coursePct}%)</span>
                  </div>
                );
              })()}

              <button
                type="button"
                onClick={handleCloseStudio}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer font-bold text-sm"
                title="Close Studio (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* If Access is Revoked */}
          {isAccessRevoked ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
              <div className="p-8 bg-white border border-rose-200 rounded-2xl max-w-lg w-full text-center shadow-lg space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 text-2xl font-bold">
                  !
                </div>
                <h4 className="text-xl font-bold text-rose-800">
                  Video Lectures &amp; Workstation Access Revoked
                </h4>
                <p className="text-sm text-slate-600 font-medium">
                  Your access to online class recordings and laboratory sessions has been suspended by the administrator. Please contact Er. Swamy Naidu or Ameerpet branch front desk to reactivate your credentials.
                </p>
                <button
                  type="button"
                  onClick={handleCloseStudio}
                  className="px-6 py-2.5 rounded-xl bg-[#131313] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
              {/* MAIN PLAYER COLUMN (Left / Center) - REDUCED COMFORTABLE CINEMA SCREEN SIZE */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-slate-100/60 p-3 sm:p-5 lg:p-6 space-y-4">
                {activePlayerClass ? (
                  <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto space-y-4">
                    {/* MODE 1: CLASS VIDEO STREAM WITH IN-VIDEO OVERLAY CONTROLS (Images 2, 3, 4) */}
                    {studentViewerMode === 'video' && (
                      <div className="w-full flex flex-col items-center space-y-4">
                        {isDriveVideo ? (
                          /* Interactive Google Drive Video Stream */
                          <div className="relative aspect-video w-full max-h-[78vh] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                            <iframe
                              src={formatGoogleDriveUrl(activePlayerClass.videoUrl)}
                              className="w-full h-full border-0 rounded-2xl"
                              allow="autoplay; encrypted-media; fullscreen"
                              allowFullScreen
                              title={activePlayerClass.title}
                            />
                          </div>
                        ) : isYouTubeVideo ? (
                          /* YouTube Stream */
                          <div className="relative aspect-video w-full max-h-[78vh] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                            <iframe
                              src={formatYouTubeEmbedUrl(activePlayerClass.videoUrl)}
                              className="w-full h-full border-0 rounded-2xl"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              title={activePlayerClass.title}
                            />
                          </div>
                        ) : (
                          /* Direct MP4 / Video File with In-Video Floating Controls */
                          <div
                            ref={playerContainerRef}
                            onMouseMove={handleUserActivity}
                            onMouseEnter={() => setShowControlsOverlay(true)}
                            onMouseLeave={() => {
                              if (videoIsPlaying) {
                                setShowControlsOverlay(false);
                                setShowSettingsMenu(false);
                              }
                            }}
                            className="relative aspect-video w-full max-h-[78vh] bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group select-none"
                          >
                          <video
                            ref={videoRef}
                            src={
                              !activePlayerClass.videoUrl || isPlaceholderOrBrokenDriveUrl(activePlayerClass.videoUrl)
                                ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
                                : activePlayerClass.videoUrl
                            }
                            className="w-full h-full object-contain cursor-pointer"
                            playsInline
                            onTimeUpdate={() => {
                              if (videoRef.current) {
                                setVideoCurrentTime(videoRef.current.currentTime);
                              }
                            }}
                            onLoadedMetadata={() => {
                              if (videoRef.current) {
                                setVideoDuration(videoRef.current.duration);
                              }
                            }}
                            onEnded={handleVideoEnded}
                            onClick={handlePlayPause}
                          />

                          {/* Temporary Toast Indicator (Play, Pause, Skip, Speed) */}
                          {videoToast && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-black/85 text-white text-xs font-semibold backdrop-blur-md shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-150 border border-white/10">
                              {videoToast}
                            </div>
                          )}

                          {/* Center Big Play Button Overlay When Paused */}
                          {!videoIsPlaying && (
                            <button
                              type="button"
                              onClick={handlePlayPause}
                              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-[#EE2C3C] text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl backdrop-blur-md group-hover:scale-110 active:scale-95 z-20 border border-white/10"
                              title="Play Video (Space)"
                            >
                              <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            </button>
                          )}

                          {/* Subtitles Overlay */}
                          {subtitlesEnabled && videoIsPlaying && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 bg-black/80 text-white text-xs sm:text-sm font-medium rounded-lg text-center max-w-lg pointer-events-none backdrop-blur-xs border border-white/10">
                              [Instructor]: Precision snaps, layer architecture, and title block drafting standards.
                            </div>
                          )}

                          {/* IN-VIDEO SETTINGS POPOVER MENU (Images 3 & 4) */}
                          {showSettingsMenu && (
                            <div className="absolute bottom-16 right-3 sm:right-4 w-64 bg-[#212121]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2 z-40 text-white animate-in fade-in zoom-in-95 duration-150 select-none">
                              {/* Main Settings Submenu (Image 3) */}
                              {settingsActiveSubmenu === 'main' && (
                                <div className="space-y-0.5 text-xs font-medium">
                                  {/* Picture in picture */}
                                  <button
                                    type="button"
                                    onClick={handleTogglePiP}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={1.8} />
                                        <rect x="11" y="11" width="8" height="6" rx="1" fill="currentColor" stroke="none" />
                                      </svg>
                                      <span>Picture-in-picture</span>
                                    </div>
                                  </button>

                                  {/* Subtitles/CC */}
                                  <button
                                    type="button"
                                    onClick={handleToggleCC}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="w-4 h-4 flex items-center justify-center font-bold text-[9px] border border-white/70 rounded">
                                        CC
                                      </span>
                                      <span>Subtitles/CC</span>
                                    </div>
                                    <span className="text-[11px] text-white/50">
                                      {subtitlesEnabled ? 'English' : 'Off'}
                                    </span>
                                  </button>

                                  {/* Quality */}
                                  <button
                                    type="button"
                                    onClick={() => setSettingsActiveSubmenu('quality')}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                      </svg>
                                      <span>Quality</span>
                                    </div>
                                    <span className="text-[11px] text-white/50 flex items-center gap-1">
                                      <span>{videoQuality}</span>
                                      <span>&rsaquo;</span>
                                    </span>
                                  </button>

                                  {/* Playback speed */}
                                  <button
                                    type="button"
                                    onClick={() => setSettingsActiveSubmenu('speed')}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-left"
                                  >
                                    <div className="flex items-center gap-3">
                                      <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
                                        <polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none" />
                                      </svg>
                                      <span>Playback speed</span>
                                    </div>
                                    <span className="text-[11px] text-white/50 flex items-center gap-1">
                                      <span>{videoPlaybackSpeed === 1 ? '1x' : `${videoPlaybackSpeed}x`}</span>
                                      <span>&rsaquo;</span>
                                    </span>
                                  </button>

                                  {/* Transcript / Notes */}
                                  {activePlayerClass.pdfUrl && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setStudentViewerMode('notes');
                                        setShowSettingsMenu(false);
                                      }}
                                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-left border-t border-white/10 mt-1 pt-1.5"
                                    >
                                      <div className="flex items-center gap-3">
                                        <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Transcript / Notes</span>
                                      </div>
                                      <span className="text-[10px] text-emerald-400 font-bold uppercase">PDF</span>
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* Quality Submenu */}
                              {settingsActiveSubmenu === 'quality' && (
                                <div className="space-y-0.5 text-xs font-medium">
                                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/10 text-white/70 font-bold">
                                    <button
                                      type="button"
                                      onClick={() => setSettingsActiveSubmenu('main')}
                                      className="hover:text-white cursor-pointer"
                                    >
                                      &larr; Back
                                    </button>
                                    <span>Video Quality</span>
                                  </div>
                                  {['1080p HD', '720p HD', '480p', 'Auto'].map((q) => (
                                    <button
                                      key={q}
                                      type="button"
                                      onClick={() => {
                                        handleQualityChange(q);
                                        setShowSettingsMenu(false);
                                        setSettingsActiveSubmenu('main');
                                      }}
                                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                                        videoQuality === q
                                          ? 'bg-white/20 text-white font-bold'
                                          : 'text-white/80 hover:bg-white/10'
                                      }`}
                                    >
                                      <span>{q}</span>
                                      {videoQuality === q && <span className="font-bold">✓</span>}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Playback Speed Submenu (Image 4 Exact Replica) */}
                              {settingsActiveSubmenu === 'speed' && (
                                <div className="space-y-0.5 text-xs font-medium max-h-72 overflow-y-auto">
                                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/10 text-white/70 font-bold">
                                    <button
                                      type="button"
                                      onClick={() => setSettingsActiveSubmenu('main')}
                                      className="hover:text-white cursor-pointer"
                                    >
                                      &larr; Back
                                    </button>
                                    <span>Playback Speed</span>
                                  </div>
                                  {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((spd) => (
                                    <button
                                      key={spd}
                                      type="button"
                                      onClick={() => {
                                        handleSpeedChange(spd);
                                        setShowSettingsMenu(false);
                                        setSettingsActiveSubmenu('main');
                                      }}
                                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                                        videoPlaybackSpeed === spd
                                          ? 'bg-white/25 text-white font-bold'
                                          : 'text-white/80 hover:bg-white/10'
                                      }`}
                                    >
                                      <span>{spd === 1 ? '1 (Normal)' : spd}</span>
                                      {videoPlaybackSpeed === spd && <span className="font-bold">✓</span>}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* IN-VIDEO FLOATING OVERLAY CONTROLS BAR (Image 2 Exact Layout) */}
                          <div
                            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-12 pb-3 px-3 sm:px-4 flex flex-col justify-end gap-2.5 z-30 transition-opacity duration-300 ${
                              showControlsOverlay || !videoIsPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                          >
                            {/* Scrubber Timeline Bar with Vertical White Thumb (Image 2) */}
                            <div className="relative group/timeline w-full flex items-center cursor-pointer py-1.5">
                              <div className="w-full h-1 group-hover/timeline:h-1.5 bg-white/25 rounded-full overflow-hidden transition-all relative">
                                <div
                                  className="bg-white h-full transition-all relative"
                                  style={{
                                    width: `${videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                              {/* Vertical white thumb handle (Image 2) */}
                              <div
                                className="absolute w-1 h-3.5 bg-white rounded-xs shadow-md -translate-x-1/2 pointer-events-none"
                                style={{
                                  left: `${videoDuration ? (videoCurrentTime / videoDuration) * 100 : 0}%`,
                                }}
                              />
                              <input
                                type="range"
                                min={0}
                                max={videoDuration || 100}
                                step={0.5}
                                value={videoCurrentTime}
                                onChange={(e) => handleSeek(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>

                            {/* Floating Bottom Control Pills (Image 2) */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              {/* Left Side: Play/Pause, [ ↺10 ] [ ↻10 ] [ 0:00 / 5:51 ], Chapters */}
                              <div className="flex items-center gap-2">
                                {/* Pill 1: Play / Pause */}
                                <button
                                  type="button"
                                  onClick={handlePlayPause}
                                  className="h-9 px-3.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 border border-white/10 shadow-md"
                                  title={videoIsPlaying ? 'Pause' : 'Play'}
                                >
                                  {videoIsPlaying ? (
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                                      <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                  )}
                                </button>

                                {/* Pill 2: [ ↺10 ] [ ↻10 ] [ 0:00 / 5:51 ] */}
                                <div className="h-9 px-3 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center gap-2.5 text-xs font-mono border border-white/10 shadow-md select-none">
                                  {/* ↺ 10 */}
                                  <button
                                    type="button"
                                    onClick={handleSkipBackward}
                                    className="hover:text-[#EE2C3C] transition-colors cursor-pointer flex items-center"
                                    title="Rewind 10s"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                    </svg>
                                    <span className="text-[10px] ml-0.5 font-sans font-bold">10</span>
                                  </button>

                                  {/* ↻ 10 */}
                                  <button
                                    type="button"
                                    onClick={handleSkipForward}
                                    className="hover:text-[#EE2C3C] transition-colors cursor-pointer flex items-center"
                                    title="Forward 10s"
                                  >
                                    <span className="text-[10px] mr-0.5 font-sans font-bold">10</span>
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 005 8v8a1 1 0 001.6.8l5.334-4zM19.934 12.8a1 1 0 000-1.6l-5.334-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" />
                                    </svg>
                                  </button>

                                  {/* Elapsed / Duration */}
                                  <span className="text-white/90 font-medium pl-1 text-[11px] sm:text-xs">
                                    {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration || (activePlayerClass ? 2700 : 0))}
                                  </span>
                                </div>

                                {/* Pill 3: Chapters */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    showVideoToast(`${activePlayerClass.classNumber}: ${activePlayerClass.title}`);
                                  }}
                                  className="h-9 px-3.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-white/10 shadow-md active:scale-95 transition-all"
                                  title="View Chapters / Lessons"
                                >
                                  <span>Chapters</span>
                                </button>
                              </div>

                              {/* Right Side: Volume, CC, Speed pill, Settings Gear, Fullscreen */}
                              <div className="h-9 px-3 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center gap-3 border border-white/10 shadow-md">
                                {/* Volume button with slider */}
                                <div className="flex items-center space-x-1.5 group/vol">
                                  <button
                                    type="button"
                                    onClick={handleToggleMute}
                                    className="hover:text-white/80 transition-all cursor-pointer"
                                    title={videoIsMuted ? 'Unmute' : 'Mute'}
                                  >
                                    {videoIsMuted || videoVolume === 0 ? (
                                      <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                      </svg>
                                    )}
                                  </button>
                                  <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={videoIsMuted ? 0 : videoVolume}
                                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                    className="w-14 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white hidden sm:inline-block"
                                  />
                                </div>

                                {/* Subtitles [CC] */}
                                <button
                                  type="button"
                                  onClick={handleToggleCC}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                    subtitlesEnabled
                                      ? 'bg-white text-black border-white'
                                      : 'border-white/60 text-white/80 hover:text-white hover:border-white'
                                  }`}
                                  title="Subtitles/CC"
                                >
                                  CC
                                </button>

                                {/* Speed Indicator [1x] */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowSettingsMenu(true);
                                    setSettingsActiveSubmenu('speed');
                                  }}
                                  className="text-xs font-semibold hover:text-[#EE2C3C] transition-colors cursor-pointer"
                                  title="Playback Speed"
                                >
                                  {videoPlaybackSpeed === 1 ? '1x' : `${videoPlaybackSpeed}x`}
                                </button>

                                {/* Settings Gear [⚙] (Images 3 & 4) */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowSettingsMenu(!showSettingsMenu);
                                    setSettingsActiveSubmenu('main');
                                  }}
                                  className="hover:text-white/80 transition-all cursor-pointer"
                                  title="Settings"
                                >
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
                                  </svg>
                                </button>

                                {/* Fullscreen [⛶] */}
                                <button
                                  type="button"
                                  onClick={handleToggleFullscreen}
                                  className="hover:text-white/80 transition-all cursor-pointer"
                                  title="Toggle Fullscreen"
                                >
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                        {/* Clean LMS Lesson Header & Quick Navigation Bar */}
                        <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono font-bold text-[11px] uppercase tracking-wider">
                                {activePlayerClass.classNumber}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                {activePlayerClass.duration}
                              </span>
                              {isDriveVideo && (
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                                  Google Drive Stream
                                </span>
                              )}
                              {watchedClassIds.includes(activePlayerClass.id) && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center gap-1">
                                  <span>✓</span>
                                  <span>Completed</span>
                                </span>
                              )}
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                              {activePlayerClass.title}
                            </h3>
                            {activePlayerClass.description && (
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {activePlayerClass.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                            {/* Prev / Next navigation */}
                            <button
                              type="button"
                              disabled={currentClassIndex <= 0}
                              onClick={() => {
                                if (playerCourse?.classes && currentClassIndex > 0) {
                                  setActivePlayerClass(playerCourse.classes[currentClassIndex - 1]);
                                  setVideoCurrentTime(0);
                                  setVideoIsPlaying(false);
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                            >
                              &larr; Prev Lesson
                            </button>
                            <button
                              type="button"
                              disabled={!playerCourse?.classes || currentClassIndex >= playerCourse.classes.length - 1}
                              onClick={() => {
                                if (playerCourse?.classes && currentClassIndex < playerCourse.classes.length - 1) {
                                  setActivePlayerClass(playerCourse.classes[currentClassIndex + 1]);
                                  setVideoCurrentTime(0);
                                  setVideoIsPlaying(false);
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                            >
                              Next Lesson &rarr;
                            </button>

                            {/* Mark Watched Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleClassWatched(activePlayerClass.id)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                                watchedClassIds.includes(activePlayerClass.id)
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300'
                              }`}
                            >
                              <span>{watchedClassIds.includes(activePlayerClass.id) ? '✓ Completed' : '○ Mark Completed'}</span>
                            </button>

                            {/* PDF Notes if available */}
                            {activePlayerClass.pdfUrl && (
                              <button
                                type="button"
                                onClick={() => setStudentViewerMode('notes')}
                                className="px-3.5 py-2 rounded-xl bg-rose-50 text-[#EE2C3C] border border-rose-200 hover:bg-rose-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <span>PDF Notes</span>
                              </button>
                            )}

                            {/* Open in Google Drive in new tab */}
                            {isDriveVideo && (
                              <a
                                href={activePlayerClass.videoUrl.replace('/preview', '/view')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                                title="Open video in Google Drive"
                              >
                                <span>Open in Drive</span>
                                <span>&nearr;</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MODE 2: FULL NOTES & PDF READER STUDIO */}
                    {studentViewerMode === 'notes' && (
                      <div className="space-y-4 animate-in fade-in duration-150 w-full">
                        {activePlayerClass.pdfUrl ? (
                          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                              <div className="flex items-center space-x-3.5 min-w-0">
                                <div className="w-12 h-12 rounded-xl bg-[#EE2C3C] text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                                  PDF
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wide">
                                      Official Class Notes &amp; Blueprint
                                    </span>
                                    <span className="text-xs font-mono font-medium text-slate-500">
                                      {activePlayerClass.pdfSize || 'Verified PDF Document'}
                                    </span>
                                  </div>
                                  <h4 className="text-base sm:text-lg font-bold text-[#131313] mt-1 truncate">
                                    {activePlayerClass.pdfName || `${activePlayerClass.title} - Lecture Notes.pdf`}
                                  </h4>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => setStudentViewerMode('video')}
                                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#131313] border border-slate-300 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                                >
                                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                  </svg>
                                  <span>Watch Video</span>
                                </button>
                                <a
                                  href={activePlayerClass.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                                >
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                  <span>Download Full PDF</span>
                                </a>
                              </div>
                            </div>

                            {/* Embedded PDF Viewer Frame */}
                            <div className="w-full h-[620px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                              <iframe
                                src={activePlayerClass.pdfUrl}
                                title={activePlayerClass.pdfName || 'Class Notes'}
                                className="w-full h-full border-0"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3 w-full">
                            <div className="w-14 h-14 rounded-full bg-rose-50 text-[#EE2C3C] flex items-center justify-center mx-auto border border-rose-200">
                              <svg className="w-7 h-7 text-[#EE2C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h4 className="text-base font-bold text-[#131313]">
                              No Separate PDF Notes Attached For This Class
                            </h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                              The instructor has not uploaded a standalone document for {activePlayerClass.classNumber} yet. Please switch to the Class Video to watch the live lab session.
                            </p>
                            <button
                              type="button"
                              onClick={() => setStudentViewerMode('video')}
                              className="px-5 py-2.5 rounded-xl bg-[#131313] text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer inline-flex items-center space-x-1.5"
                            >
                              <span>▶ Switch to Class Video</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center my-auto">
                    <span className="text-xs font-bold text-slate-500 block mb-2">
                      No Class Selected
                    </span>
                    <p className="text-sm font-semibold text-[#131313]">
                      Select a class lesson from the playlist on the right to start watching.
                    </p>
                  </div>
                )}
              </div>

              {/* PLAYLIST SIDEBAR (Right Column: Image 2 added above 3rd Image, Easy Real-Time LMS Style) */}
              <div className="w-full lg:w-96 xl:w-[400px] flex flex-col min-h-0 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 shadow-xs flex-shrink-0">
                {/* 1. TOP ACTION CONTROLS */}
                {activePlayerClass && (
                  <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex-shrink-0">
                    {/* Prominent Mark Current Class Completed Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleClassWatched(activePlayerClass.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                        watchedClassIds.includes(activePlayerClass.id)
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-[#EE2C3C] hover:text-[#EE2C3C]'
                      }`}
                    >
                      {watchedClassIds.includes(activePlayerClass.id) ? (
                        <>
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                          <span>Class Completed (Click to Unmark)</span>
                        </>
                      ) : (
                        <>
                          <span className="w-4 h-4 rounded-full border border-slate-400 text-slate-400 flex items-center justify-center text-[10px]">○</span>
                          <span>Mark Current Class Completed</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 2. Playlist Header & Syllabus Progress */}
                <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 space-y-2 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                        Course Playlist &amp; Syllabus
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {playerCourse.classes?.length || 0} Video Lessons Available
                      </span>
                    </div>
                    {(() => {
                      const currentClasses = playerCourse.classes || [];
                      const courseWatched = currentClasses.filter((c) => watchedClassIds.includes(c.id)).length;
                      const coursePct = currentClasses.length > 0 ? Math.round((courseWatched / currentClasses.length) * 100) : 0;
                      return (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                          {courseWatched}/{currentClasses.length} ({coursePct}%)
                        </span>
                      );
                    })()}
                  </div>

                  {/* Progress Bar inside Playlist */}
                  {(() => {
                    const currentClasses = playerCourse.classes || [];
                    const courseWatched = currentClasses.filter((c) => watchedClassIds.includes(c.id)).length;
                    const coursePct = currentClasses.length > 0 ? Math.round((courseWatched / currentClasses.length) * 100) : 0;
                    return (
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#EE2C3C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${coursePct}%` }}
                        />
                      </div>
                    );
                  })()}

                  {/* Real-time Search Box */}
                  <div className="relative pt-1">
                    <input
                      type="text"
                      value={playlistSearchQuery}
                      onChange={(e) => setPlaylistSearchQuery(e.target.value)}
                      placeholder="Search lessons & topics..."
                      className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:outline-none transition-all"
                    />
                    <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {playlistSearchQuery && (
                      <button
                        onClick={() => setPlaylistSearchQuery('')}
                        className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Real-Time LMS Playlist Items (Easy, intuitive click-to-play) */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2.5 space-y-1.5">
                  {filteredPlaylistClasses.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 font-medium space-y-2">
                      <p>No lessons match "{playlistSearchQuery}".</p>
                      <button
                        type="button"
                        onClick={() => setPlaylistSearchQuery('')}
                        className="text-[#EE2C3C] font-bold underline cursor-pointer"
                      >
                        Show all lessons
                      </button>
                    </div>
                  ) : (
                    filteredPlaylistClasses.map((cls, cIdx) => {
                      const isCurrent = activePlayerClass?.id === cls.id;
                      const isWatched = watchedClassIds.includes(cls.id);
                      return (
                        <div
                          key={cls.id || cIdx}
                          onClick={() => {
                            setActivePlayerClass(cls);
                            setVideoCurrentTime(0);
                            setVideoIsPlaying(false);
                          }}
                          className={`w-full rounded-xl transition-all p-3 flex items-start gap-3 cursor-pointer select-none border ${
                            isCurrent
                              ? 'bg-rose-50/80 border-[#EE2C3C] shadow-xs ring-1 ring-[#EE2C3C]/20'
                              : 'bg-white hover:bg-slate-50 border-slate-200/80'
                          }`}
                        >
                          {/* Round 1-Click Watched Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleClassWatched(cls.id);
                            }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer flex-shrink-0 mt-0.5 ${
                              isWatched
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'border-2 border-slate-300 hover:border-[#EE2C3C] text-slate-400 bg-white'
                            }`}
                            title={isWatched ? 'Mark as Unwatched' : 'Mark as Completed'}
                          >
                            {isWatched ? '✓' : cIdx + 1}
                          </button>

                          {/* Class Meta */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[11px] font-mono font-bold uppercase ${
                                  isCurrent ? 'text-[#EE2C3C]' : 'text-slate-500'
                                }`}
                              >
                                {cls.classNumber || `Class ${cIdx + 1}`}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {cls.duration}
                              </span>
                            </div>

                            <h5
                              className={`text-xs sm:text-sm font-bold truncate mt-0.5 ${
                                isCurrent ? 'text-[#EE2C3C]' : 'text-slate-900'
                              }`}
                            >
                              {cls.title}
                            </h5>

                            <div className="flex items-center gap-1.5 mt-1.5">
                              {isCurrent ? (
                                <span className="px-2 py-0.5 rounded-md bg-[#EE2C3C] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>Now Playing</span>
                                </span>
                              ) : isWatched ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                  ✓ Watched
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                                  Unwatched
                                </span>
                              )}

                              {cls.pdfUrl && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                  PDF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* IN-BROWSER STUDENT E-BOOK READER MODAL */}
      {selectedEbookForRead && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white text-[#131313] flex items-center justify-between border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
                  PDF
                </span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Unlocked CAD Handbook
                    </span>
                    <span className="text-xs text-slate-500 font-medium truncate">
                      {selectedEbookForRead.course} &bull; {selectedEbookForRead.pages || 'Handbook'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#131313] truncate mt-0.5">
                    {selectedEbookForRead.title}
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedEbookForRead(null)} />
            </div>

            {/* Modal Body: Embedded In-Browser PDF Reader */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/60">
              <div className="w-full h-[680px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                <iframe
                  src={selectedEbookForRead.pdfUrl}
                  title={selectedEbookForRead.title}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                Document: <span className="text-[#131313] font-bold">{selectedEbookForRead.pdfName}</span> ({selectedEbookForRead.pdfSize || 'Verified PDF'})
              </span>
              <div className="flex items-center space-x-3">
                <a
                  href={selectedEbookForRead.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedEbookForRead(null)}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IN-BROWSER STUDENT CERTIFICATE VIEWER MODAL */}
      {selectedCertificateForView && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white text-[#131313] flex items-center justify-between border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-white font-bold flex items-center justify-center text-xs shadow-xs flex-shrink-0">
                  CERT
                </span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#EE2C3C] text-white">
                      {selectedCertificateForView.certId}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                      Verified Credential
                    </span>
                    <span className="text-xs text-slate-500 font-medium truncate">
                      Issued: {selectedCertificateForView.issueDate}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#131313] truncate mt-0.5">
                    {selectedCertificateForView.course}
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedCertificateForView(null)} />
            </div>

            {/* Modal Body: Embedded In-Browser PDF/Certificate Viewer */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/60">
              <div className="w-full h-[650px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
                <iframe
                  src={selectedCertificateForView.fileUrl || '/sample-certificate.pdf'}
                  title={selectedCertificateForView.fileName || 'Official Certificate'}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <div className="text-xs font-semibold text-slate-500">
                Accredited to <span className="text-[#131313] font-bold">{selectedCertificateForView.studentName}</span> ({selectedCertificateForView.studentId}) &bull; Grade: <span className="font-bold text-emerald-700">{selectedCertificateForView.grade}</span>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={selectedCertificateForView.fileUrl || '/sample-certificate.pdf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={selectedCertificateForView.fileName || `${selectedCertificateForView.certId || 'Certificate'}.pdf`}
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Certificate PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedCertificateForView(null)}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT BOOK COVER & SYNOPSIS PREVIEW MODAL (IMAGE ONLY - NO PDF VIEWER) */}
      {selectedBookCoverForView && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white text-[#131313] flex items-center justify-between border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-white font-bold flex items-center justify-center text-xs shadow-xs flex-shrink-0">
                  COVER
                </span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    {selectedBookCoverForView.accessType === 'free' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Free Handbook
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Paid Premium Edition
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-medium truncate">
                      {selectedBookCoverForView.course}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#131313] truncate mt-0.5">
                    {selectedBookCoverForView.title}
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedBookCoverForView(null)} />
            </div>

            {/* Modal Body: High Resolution Book Cover Image & Overview */}
            <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/60">
              {/* Prominent Book Cover View */}
              <div className="max-w-md mx-auto rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {selectedBookCoverForView.coverImage ? (
                  <img
                    src={selectedBookCoverForView.coverImage}
                    alt={selectedBookCoverForView.title}
                    className="w-full h-80 object-cover"
                  />
                ) : (
                  <BookCoverGraphic book={selectedBookCoverForView} />
                )}
              </div>

              {/* Book Details Box */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Engineering Curriculum &amp; Manual Subject
                  </span>
                  <h4 className="text-base font-bold text-[#131313] mt-0.5">
                    {selectedBookCoverForView.title}
                  </h4>
                  <span className="text-xs font-semibold text-[#EE2C3C]">
                    {selectedBookCoverForView.course}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {selectedBookCoverForView.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                  <span>Extent: {selectedBookCoverForView.pages || 'Handbook'}</span>
                  <span>&bull;</span>
                  <span>Academy: RND CADD Ameerpet Campus</span>
                  <span>&bull;</span>
                  <span>Format: {selectedBookCoverForView.pdfSize || 'Verified PDF'}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer with Proper Routing */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                {selectedBookCoverForView.accessType === 'free' ? 'Free to read and download for all students.' : 'Paid Reference: Cover & summary only.'}
              </span>
              <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                {selectedBookCoverForView.accessType === 'free' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const bk = selectedBookCoverForView;
                      setSelectedBookCoverForView(null);
                      setSelectedEbookForRead(bk);
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                  >
                    Open &amp; Read PDF &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const bk = selectedBookCoverForView;
                      setSelectedBookCoverForView(null);
                      setSelectedEbookForPurchase(bk);
                    }}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                  >
                    Buy / Unlock E-Book &rarr;
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedBookCoverForView(null)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED E-BOOK PURCHASE & PROPER ROUTING MODAL */}
      {selectedEbookForPurchase && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white text-[#131313] flex items-center justify-between border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-white font-bold flex items-center justify-center text-xs shadow-xs flex-shrink-0">
                  BUY
                </span>
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Premium CAD Handbook
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#131313] truncate mt-0.5">
                    Purchase &amp; Unlock Handbook
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedEbookForPurchase(null)} />
            </div>

            {/* Modal Body: Book Overview & Proper Routing Paths */}
            <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/60">
              {/* Book Summary Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center space-x-4 shadow-2xs">
                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {selectedEbookForPurchase.coverImage ? (
                    <img
                      src={selectedEbookForPurchase.coverImage}
                      alt={selectedEbookForPurchase.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 p-1.5 flex flex-col justify-between text-[7px] text-slate-800 font-bold border border-slate-200">
                      <span className="text-[#EE2C3C]">CAD</span>
                      <span className="line-clamp-2 leading-tight">{selectedEbookForPurchase.title}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#EE2C3C] block truncate">
                    {selectedEbookForPurchase.course}
                  </span>
                  <h4 className="text-sm font-bold text-[#131313] line-clamp-2 mt-0.5">
                    {selectedEbookForPurchase.title}
                  </h4>
                  <span className="text-xs font-medium text-slate-500 mt-1 block">
                    {selectedEbookForPurchase.pages || 'Handbook'} &bull; Industrial Reference Standard
                  </span>
                </div>
              </div>

              {/* Proper Routing Options */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Choose How You Would Like to Unlock:
                </span>

                {/* ROUTE 1: Route to Main Website Course Enrollment */}
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = '/#enrollment';
                  }}
                  className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-[#EE2C3C] hover:shadow-sm text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#131313] group-hover:text-[#EE2C3C] transition-colors">
                        1. Enroll in Full Course Program
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        All Books Included
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Full course enrollment unlocks all official Autodesk &amp; Dassault reference books for free.
                    </p>
                  </div>
                  <span className="text-slate-400 group-hover:text-[#EE2C3C] group-hover:translate-x-1 transition-all text-sm font-bold">
                    &rarr;
                  </span>
                </button>

                {/* ROUTE 2: Instant WhatsApp / Campus Desk Contact */}
                <a
                  href={`https://wa.me/919908123456?text=${encodeURIComponent(`Hello RND CADD Academy, I am student ${studentUser.name} (${studentUser.id}). I want to purchase and unlock the handbook: "${selectedEbookForPurchase.title}". Please share the payment QR code / invoice details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:shadow-sm text-left transition-all flex items-center justify-between group cursor-pointer block"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#131313] group-hover:text-emerald-600 transition-colors">
                        2. WhatsApp Admissions Desk Directly
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">
                        Instant QR
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Message Academic Director Er. Swamy Naidu for instant handbook unlock and receipt.
                    </p>
                  </div>
                  <span className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all text-sm font-bold">
                    &rarr;
                  </span>
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                Campus Desk: <strong className="text-[#131313]">+91 99081 23456</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedEbookForPurchase(null)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RAISE NEW SUPPORT TICKET */}
      {isRaiseTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <span className="text-[11px] font-bold text-[#EE2C3C] uppercase tracking-wider block">
                  Student Helpdesk
                </span>
                <h3 className="text-xl font-bold text-[#131313] mt-0.5">
                  Raise Support &amp; Faculty Doubt Ticket
                </h3>
              </div>
              <RedCrossCloseButton onClick={() => setIsRaiseTicketModalOpen(false)} />
            </div>

            {/* Modal Body */}
            <form onSubmit={handleRaiseTicket} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Student Identification Pill */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-[#131313]">{studentUser.name}</span>{' '}
                  <span className="text-slate-500 font-mono">({studentUser.id})</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {studentUser.assignedCourses?.[0] || studentUser.stream || 'Civil CADD'}
                </span>
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                    Problem Category:
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  >
                    <option value="Coursework & Project Doubts">Coursework &amp; Project Doubts</option>
                    <option value="Software & License">Software &amp; License Activation</option>
                    <option value="Lab Workstation & Hardware">Lab Workstation &amp; Hardware</option>
                    <option value="Certificate & Credential">Certificate &amp; Credential</option>
                    <option value="Placement & Career">Placement &amp; Job Guidance</option>
                    <option value="General Query">General Administration Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                    Priority Level:
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  >
                    <option value="Medium">Medium (Standard Review)</option>
                    <option value="Low">Low (General Discussion)</option>
                    <option value="High">High (Class Project Blocker)</option>
                    <option value="Urgent">Urgent (Workstation Down / Exam)</option>
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Ticket Subject / Issue Summary:
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Wall Join error on Level 2 in Autodesk Revit 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  required
                />
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Detailed Problem Description:
                </label>
                <textarea
                  rows={5}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Describe the exact error message, workstation desktop number, command step, or project file you need guidance with..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-[#131313] leading-relaxed bg-white focus:outline-none focus:border-[#EE2C3C]"
                  required
                />
              </div>

              {/* Success Notification */}
              {ticketSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{ticketSuccessMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsRaiseTicketModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingTicket ? 'Submitting Ticket...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: OFFICIAL FEE RECEIPT & PAYMENT SLIP (Zero Gradients, Zero Icons) */}
      {selectedReceiptForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#EE2C3C] block">
                  Official Accounts Document
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#131313]">
                  Student Fee Receipt &amp; Clearance Voucher
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptForModal(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-6 sm:p-8 space-y-6 bg-white overflow-y-auto max-h-[75vh]">
              {/* Institution Letterhead */}
              <div className="border-b-2 border-slate-300 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="text-lg font-black text-[#131313] tracking-tight">
                    R&amp;D CADD CENTRE &amp; CADDESK
                  </h4>
                  <p className="text-slate-600 font-medium">
                    Ameerpet Main Campus, Metro Pillar 1042, Hyderabad - 500038
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Helpline: +91 99080 12345 | Web: educadd.org
                  </p>
                </div>
                <div className="text-left sm:text-right font-mono">
                  <div className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 inline-block font-bold text-slate-800 text-[11px]">
                    RECEIPT: {selectedReceiptForModal.receiptId}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Date: {selectedReceiptForModal.date}
                  </div>
                </div>
              </div>

              {/* Student Dossier Information */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Student Name</span>
                  <span className="font-bold text-[#131313]">{studentUser.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Student ID</span>
                  <span className="font-mono font-bold text-[#131313]">{studentUser.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Contact Phone</span>
                  <span className="font-bold text-[#131313]">{studentUser.phone || '+91 99080 12345'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">College / University</span>
                  <span className="font-semibold text-[#131313]">{studentUser.college || 'JNTU Hyderabad'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Native Place</span>
                  <span className="font-semibold text-[#131313]">{studentUser.nativePlace || 'Hyderabad'}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Enrolled Course</span>
                  <span className="font-bold text-[#131313]">{studentUser.stream}</span>
                </div>
              </div>

              {/* Financial Calculation Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Billing Item Description</th>
                      <th className="px-4 py-2.5 text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-3">
                        <div className="font-bold text-[#131313]">Course Tuition &amp; Evaluation Package</div>
                        <div className="text-[11px] text-slate-500">{selectedReceiptForModal.remarks || 'Standard Enrollment Fee'}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#131313]">
                        ₹{studentUser.courseFee.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-emerald-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-emerald-800">Amount Paid on This Receipt</div>
                        <div className="text-[11px] text-emerald-700 font-mono">
                          Payment Mode: {selectedReceiptForModal.paymentMode} | Ref: {selectedReceiptForModal.refNumber}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-emerald-700 text-sm">
                        ₹{selectedReceiptForModal.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-700">Total Cumulative Paid to Date</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                        ₹{studentUser.paidFee.toLocaleString('en-IN')}
                      </td>
                    </tr>
                    <tr className="bg-amber-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-amber-800">Remaining Balance Pending</div>
                        <div className="text-[11px] text-amber-700">Due before capstone submission and final certification</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black text-amber-800 text-sm">
                        ₹{studentUser.balanceFee.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Verification & Signatory Stamp */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold uppercase text-[10px]">
                    VERIFIED &amp; CREDITED TO INSTITUTE ACCOUNT
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    System Generated Voucher. No manual signature required.
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-bold text-[#131313]">Er. Swamy Naidu</div>
                  <div className="text-[11px] text-slate-500">Director &amp; Chief BIM Architect</div>
                  <div className="text-[10px] text-slate-400 font-mono">R&amp;D CADD CENTRE HYDERABAD</div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                STATUS: OFFICIAL LEDGER ENTRY
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#131313] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Print / Save Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceiptForModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
