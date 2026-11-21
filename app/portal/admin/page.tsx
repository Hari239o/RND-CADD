'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { JobPost, JobApplicant } from '@/lib/jobs-data';
import { INITIAL_JOBS } from '@/lib/jobs-data';
import { COURSES } from '@/lib/courses-data';
import {
  DEFAULT_SITE_CONTENT,
  type SiteContent,
  type HeroSectionContent,
  type ProgramsSectionContent,
  type CatalogSectionContent,
  type PartnersSectionContent,
  type EnrollmentSectionContent,
  type FooterSectionContent,
  type ProgramDomainItem,
} from '@/lib/site-content';

interface StudentRecord {
  id: string;
  studentId: string;
  name: string;
  email: string;
  admissionDate: string;
  courseName: string;
  software: string;
  qualification: string;
  college: string;
  residence: string;
  officialMobile: string;
  mobile: string;
  courseFee: number;
  paidFee: number;
  balanceFee: number;
  accessStatus: 'active' | 'revoked';
  assignedCourses: string[];
  designs: string[];
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


export interface OfferItem {
  id: string;
  type: 'referral' | 'course_discount';
  title: string;
  code: string;
  targetCourse: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  referrerReward?: string;
  refereeReward?: string;
  shareUrl: string;
  expiryDate?: string;
  description?: string;
  status: 'Active' | 'Inactive' | 'Hidden';
  hidden?: boolean;
  redemptionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LiveClassSession {
  id: string;
  title: string;
  trainer: string;
  course: string;
  status: 'Live Now' | 'Scheduled' | 'Ended';
  isLive: boolean;
  streamUrl: string;
  platform: 'Virtual CAD Workstation' | 'Google Meet' | 'Zoom' | 'YouTube Live' | 'Microsoft Teams';
  timing: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseReview {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhoto?: string;
  courseName: string;
  rating: number;
  review: string;
  trainerFeedback?: string;
  status: 'Verified' | 'Pending';
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

interface CourseModuleItem {
  number: string;
  title: string;
  hours: number;
  topics: string[];
}

interface CourseCapstoneItem {
  title: string;
  description: string;
  deliverables: string[];
}

interface CareerPathwayStep {
  step: string;
  experience: string;
  role: string;
  ctc: string;
}

interface CourseFaqItem {
  question: string;
  answer: string;
}

interface TrainingHighlightItem {
  title: string;
  desc: string;
}

interface CourseItem {
  hiddenSections?: string[];
  id: string;
  code: string;
  title: string;
  folder: string;
  domain: string;
  stream?: string;
  category?: string;
  software: string;
  tools?: string[];
  duration: string;
  totalHours?: number;
  level?: string;
  rating?: string;
  enrolledStudents?: string;
  mode: string;
  fee: number;
  price?: number;
  status: 'Active' | 'Inactive';
  image?: string;
  labImage?: string;
  certificateImage?: string;
  tagline?: string;
  overview?: string;
  prerequisites?: string;
  certification?: string;
  awardedCredential?: string;
  highlights?: string[];
  trainingHighlights?: TrainingHighlightItem[];
  labGuarantees?: string[];
  careerRoles?: string[];
  careerPathways?: CareerPathwayStep[];
  faqs?: CourseFaqItem[];
  capstoneProject?: CourseCapstoneItem;
  modules?: CourseModuleItem[];
  syllabus: string[];
  classes?: CourseClass[];
}

const MAIN_FOLDERS = [
  {
    id: 'civil',
    name: 'Civil & Architectural Engineering',
    shortName: 'Civil & BIM',
    code: 'FOLDER 01',
    partner: 'Autodesk & Bentley Certified',
    credential: 'Executive Master Diploma',
    duration: '6 Months (120 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    logoText: 'BIM',
    description: 'Structural drafting, parametric BIM modeling, building analysis, and municipal layouts.',
    software: 'Autodesk Revit, AutoCAD 2D/3D, STAAD.Pro, ETABS, 3ds Max',
    badgeBg: 'bg-[#E0F2FE]',
    badgeText: 'text-[#0369A1]',
    accentColor: '#0284C7',
  },
  {
    id: 'mechanical',
    name: 'Mechanical & Automotive Design',
    shortName: 'Mechanical CAD/CAE',
    code: 'FOLDER 02',
    partner: 'Dassault & PTC Certified',
    credential: 'Executive CAD/CAE Diploma',
    duration: '6 Months (140 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    logoText: 'CAD',
    description: '3D parametric solid modeling, generative surface design, FEA stress analysis, and CNC machining.',
    software: 'SOLIDWORKS, CATIA V5, ANSYS, PTC Creo, Siemens NX',
    badgeBg: 'bg-[#FFEDD5]',
    badgeText: 'text-[#C2410C]',
    accentColor: '#EA580C',
  },
  {
    id: 'electrical',
    name: 'Electrical & Automation Engineering',
    shortName: 'Electrical CADD',
    code: 'FOLDER 03',
    partner: 'Siemens & EPLAN Certified',
    credential: 'Executive Electrical Diploma',
    duration: '6 Months (140 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1200&q=80',
    logoText: 'E-CAD',
    description: 'Industrial control schematics, substation SLDs, wiring harnesses, and PLC automation.',
    software: 'AutoCAD Electrical, Revit MEP, EPLAN, ETAP, MATLAB',
    badgeBg: 'bg-[#D1FAE5]',
    badgeText: 'text-[#047857]',
    accentColor: '#059669',
  },
  {
    id: 'interior',
    name: 'Interior Architecture & Space Planning',
    shortName: 'Interior & 3D Vis',
    code: 'FOLDER 04',
    partner: 'Chaos Group & Trimble Certified',
    credential: 'Executive Interior Diploma',
    duration: '4 Months (90 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    logoText: '3D-VIS',
    description: 'Space planning, SketchUp modular joinery, 3ds Max rendering, and V-Ray raytracing.',
    software: '3ds Max, V-Ray, SketchUp Pro, Lumion, AutoCAD',
    badgeBg: 'bg-[#EDE9FE]',
    badgeText: 'text-[#6D28D9]',
    accentColor: '#8B5CF6',
  },
  {
    id: 'ppm',
    name: 'Construction & EPC Project Management (PPM)',
    shortName: 'Project Management',
    code: 'FOLDER 05',
    partner: 'Oracle & Microsoft Certified',
    credential: 'PPM Specialist Certification',
    duration: '3 Months (60 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    logoText: 'PPM',
    description: 'Primavera P6, Microsoft Project, WBS, Gantt scheduling, and EVM cost control.',
    software: 'Oracle Primavera P6, Microsoft Project, EPC Suite',
    badgeBg: 'bg-[#CCFBF1]',
    badgeText: 'text-[#0F766E]',
    accentColor: '#0D9488',
  },
  {
    id: 'piping',
    name: 'Process Plant & Piping Engineering',
    shortName: 'Piping & Plant CAD',
    code: 'FOLDER 06',
    partner: 'Hexagon & Autodesk Certified',
    credential: 'Piping Specialist Certification',
    duration: '4 Months (80 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    logoText: 'PIPE',
    description: 'Piping & instrumentation (P&ID), equipment layouts, 3D pipe racks, and Caesar II flexibility.',
    software: 'SP3D, Caesar II, AutoCAD Plant 3D, Navisworks',
    badgeBg: 'bg-[#FEF3C7]',
    badgeText: 'text-[#B45309]',
    accentColor: '#B45309',
  },
] as const;

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

// Clean, useful UI icons strictly related to actions and specifications
const FolderIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const VideoPlayIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const EditIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const MoveIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const DeleteIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const BackArrowIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PlusIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ClockIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <polyline points="12 6 12 12 16 14" strokeWidth={2} />
  </svg>
);

const ToolsIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  </svg>
);

const CloudUploadIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const GoogleDriveIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 87.3 78" fill="currentColor">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3H1.05c0 1.6.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="M43.65 25 29.35 0c-1.3.8-2.4 1.9-3.2 3.3L1.2 55.45c-.8 1.4-1.2 2.9-1.2 4.5h25.05z" fill="#00ac47"/>
    <path d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l1.6-2.75 7.75-13.4c.8-1.4 1.2-2.9 1.2-4.5H62.25l5.65 9.8z" fill="#ea4335"/>
    <path d="M43.65 25h38.65c0-1.6-.4-3.1-1.2-4.5l-10.7-18.5c-.8-1.4-1.9-2.5-3.2-3.3z" fill="#00832d"/>
    <path d="m59.8 53.45-16.15-28-14.3 24.8 14.3 24.75h28.6z" fill="#2684fc"/>
    <path d="M73.55 76.8H26l12.3-21.3h38.65z" fill="#ffba00"/>
  </svg>
);


interface SectionHeaderActionsProps {
  secCoreId: string;
  isEditing: boolean;
  hiddenSections?: string[];
  onAdd: (secCoreId: string, isEditing: boolean) => void;
  onEdit: (secCoreId: string, isEditing: boolean) => void;
  onToggleHide: (secCoreId: string, isEditing: boolean) => void;
  onDelete: (secCoreId: string, isEditing: boolean) => void;
}

const SectionHeaderActions: React.FC<SectionHeaderActionsProps> = ({
  secCoreId,
  isEditing,
  hiddenSections = [],
  onAdd,
  onEdit,
  onToggleHide,
  onDelete,
}) => {
  const isHidden = hiddenSections.includes(secCoreId);

  return (
    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
      {/* + Add Button */}
      <button
        type="button"
        onClick={() => onAdd(secCoreId, isEditing)}
        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        title="Add item or activate this section"
      >
        <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add</span>
      </button>

      {/* ✎ Edit Button */}
      <button
        type="button"
        onClick={() => onEdit(secCoreId, isEditing)}
        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        title="Jump to edit this section"
      >
        <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span>Edit</span>
      </button>

      {/* 👁 Hide / Show Button */}
      <button
        type="button"
        onClick={() => onToggleHide(secCoreId, isEditing)}
        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer ${
          isHidden
            ? 'bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-300'
            : 'bg-slate-700 hover:bg-slate-800 text-white'
        }`}
        title={isHidden ? 'Unhide section on live website' : 'Hide section from live website'}
      >
        {isHidden ? (
          <>
            <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Show</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>
            <span>Hide</span>
          </>
        )}
      </button>

      {/* 🗑 Delete Button */}
      <button
        type="button"
        onClick={() => onDelete(secCoreId, isEditing)}
        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        title="Delete content and hide section"
      >
        <svg className="w-3.5 h-3.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>Delete</span>
      </button>
    </div>
  );
};

interface SectionHiddenNoticeProps {
  secCoreId: string;
  isEditing: boolean;
  hiddenSections?: string[];
  onToggleHide: (secCoreId: string, isEditing: boolean) => void;
}

const SectionHiddenNotice: React.FC<SectionHiddenNoticeProps> = ({
  secCoreId,
  isEditing,
  hiddenSections = [],
  onToggleHide,
}) => {
  if (!hiddenSections.includes(secCoreId)) return null;

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold shadow-xs">
      <div className="flex items-center space-x-2">
        <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black text-2xs uppercase tracking-wider">
          HIDDEN ON LIVE WEBSITE
        </span>
        <span>This section is currently hidden on the website popup modal. Students will not see it.</span>
      </div>
      <button
        type="button"
        onClick={() => onToggleHide(secCoreId, isEditing)}
        className="text-xs font-bold text-amber-800 underline hover:text-amber-950 ml-2 cursor-pointer whitespace-nowrap"
      >
        Unhide Now
      </button>
    </div>
  );
};

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


const DEFAULT_COURSES: CourseItem[] = COURSES.map((c, idx) => {
  const folder = (c.folder || (
    c.stream === 'mechanical' ? 'mechanical' :
    c.stream === 'eee' ? 'electrical' :
    c.stream === 'interior' ? 'interior' :
    c.stream === 'ppm' ? 'ppm' :
    c.stream === 'piping' ? 'piping' : 'civil'
  )) as any;

  const domain =
    folder === 'mechanical' ? 'Mechanical & Automotive Design' :
    folder === 'electrical' ? 'Electrical & Automation Engineering' :
    folder === 'interior' ? 'Interior Architecture & Space Planning' :
    folder === 'ppm' ? 'Construction & EPC Project Management (PPM)' :
    folder === 'piping' ? 'Process Plant & Piping Engineering' :
    'Civil & Architectural Engineering';

  const feeAmount = c.fee || (folder === 'ppm' ? 32000 : folder === 'civil' ? (c.id === 'civil-autocad' ? 22000 : c.id === 'civil-revit-bim' ? 32000 : 35000) : 34000);

  return {
    id: c.id,
    code: c.code || (c.id === 'civil-revit-bim' ? 'REV-BIM-12' : c.id === 'civil-autocad' ? 'CAD-CIV-2D' : `CAD-${folder.toUpperCase().slice(0, 3)}-${String(idx + 1).padStart(2, '0')}`),
    title: c.title,
    folder,
    domain,
    stream: c.stream || (folder === 'mechanical' || folder === 'piping' ? 'mechanical' : folder === 'electrical' ? 'eee' : 'civil'),
    category: c.category || 'Professional',
    software: Array.isArray(c.tools) && c.tools.length > 0 ? c.tools.join(', ') : (c as any).software || '',
    tools: Array.isArray(c.tools) ? c.tools : [],
    duration: c.duration || '90 Days (180 Hours)',
    totalHours: c.totalHours || 120,
    level: c.level || 'Professional',
    rating: c.rating || '4.9/5.0',
    enrolledStudents: c.enrolledStudents || '1,420+ Engineers Trained',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: feeAmount,
    price: feeAmount,
    status: 'Active',
    image: c.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    overview: c.overview || c.tagline || '',
    tagline: c.tagline || '',
    prerequisites: c.prerequisites || 'Diploma / B.Tech / Working Professional',
    certification: c.certification || 'Autodesk & Dassault Certificate',
    careerRoles: Array.isArray(c.careerRoles) ? c.careerRoles : ['Design Engineer', 'CAD Specialist'],
    capstoneProject: c.capstoneProject,
    modules: c.modules as any,
    syllabus: Array.isArray(c.modules) ? c.modules.map((m) => m.title) : ['Standard CAD Syllabus'],
    classes: (c as any).classes || [],
  };
});

export default function AdminPortalPage() {
  // Navigation State - Tab 01 "Student", Tab 02 "Courses" directly below
  const [activeTab, setActiveTab] = useState<string>('Student');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  // Website CMS Live Editor State
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [cmsActiveSection, setCmsActiveSection] = useState<'hero' | 'programs' | 'catalog' | 'partners' | 'enrollment' | 'footer'>('hero');
  const [cmsSaving, setCmsSaving] = useState<boolean>(false);
  const [cmsNotification, setCmsNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [newPartnerName, setNewPartnerName] = useState<string>('');
  const [newAccreditationName, setNewAccreditationName] = useState<string>('');

  // Load live site content
  const loadSiteContent = async () => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('rnd_cadd_site_content');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && typeof parsed === 'object') {
              setSiteContent((prev) => ({ ...prev, ...parsed }));
            }
          } catch {}
        }
      }
      const res = await fetch('/api/site-content');
      const data = await res.json();
      if (data.success && data.content) {
        setSiteContent(data.content);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_site_content', JSON.stringify(data.content));
        }
      }
    } catch (e) {
      console.error('Failed to load site content:', e);
    }
  };

  useEffect(() => {
    loadSiteContent();
  }, []);

  const handleSaveCmsSection = async (sectionKey: 'hero' | 'programs' | 'catalog' | 'partners' | 'enrollment' | 'footer') => {
    setCmsSaving(true);
    setCmsNotification(null);
    try {
      const sectionData = siteContent[sectionKey];
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_section',
          section: sectionKey,
          data: sectionData,
        }),
      });
      const result = await res.json();
      if (result.success && result.content) {
        setSiteContent(result.content);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_site_content', JSON.stringify(result.content));
          window.dispatchEvent(new CustomEvent('rnd_cadd_site_content_updated', { detail: { content: result.content } }));
        }
        setCmsNotification({ text: `Section "${sectionKey.toUpperCase()}" published to live website successfully.`, type: 'success' });
      } else {
        setCmsNotification({ text: result.message || 'Failed to update section', type: 'error' });
      }
    } catch (err: any) {
      setCmsNotification({ text: err.message || 'Error saving changes', type: 'error' });
    } finally {
      setCmsSaving(false);
    }
  };

  const handleToggleSectionVisibility = async (sectionKey: 'hero' | 'programs' | 'catalog' | 'partners' | 'enrollment' | 'footer') => {
    setCmsSaving(true);
    setCmsNotification(null);
    try {
      const currentHidden = !!siteContent[sectionKey]?.hidden;
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_visibility',
          section: sectionKey,
          hidden: !currentHidden,
        }),
      });
      const result = await res.json();
      if (result.success && result.content) {
        setSiteContent(result.content);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_site_content', JSON.stringify(result.content));
          window.dispatchEvent(new CustomEvent('rnd_cadd_site_content_updated', { detail: { content: result.content } }));
        }
        const stateWord = !currentHidden ? 'HIDDEN' : 'VISIBLE';
        setCmsNotification({ text: `Section "${sectionKey.toUpperCase()}" is now ${stateWord} on the live website.`, type: 'success' });
      } else {
        setCmsNotification({ text: result.message || 'Failed to toggle visibility', type: 'error' });
      }
    } catch (err: any) {
      setCmsNotification({ text: err.message || 'Error toggling visibility', type: 'error' });
    } finally {
      setCmsSaving(false);
    }
  };

  const handleResetCmsSection = async (sectionKey: 'hero' | 'programs' | 'catalog' | 'partners' | 'enrollment' | 'footer') => {
    if (!confirm(`Are you sure you want to reset "${sectionKey.toUpperCase()}" back to default content? All custom edits will be reverted.`)) {
      return;
    }
    setCmsSaving(true);
    setCmsNotification(null);
    try {
      const res = await fetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_section',
          section: sectionKey,
        }),
      });
      const result = await res.json();
      if (result.success && result.content) {
        setSiteContent(result.content);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_site_content', JSON.stringify(result.content));
          window.dispatchEvent(new CustomEvent('rnd_cadd_site_content_updated', { detail: { content: result.content } }));
        }
        setCmsNotification({ text: `Section "${sectionKey.toUpperCase()}" reset to defaults successfully.`, type: 'success' });
      } else {
        setCmsNotification({ text: result.message || 'Failed to reset section', type: 'error' });
      }
    } catch (err: any) {
      setCmsNotification({ text: err.message || 'Error resetting section', type: 'error' });
    } finally {
      setCmsSaving(false);
    }
  };

  const handleCmsFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant local preview and fallback using FileReader (guaranteed to work across all devices & Vercel)
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUploaded(dataUrl);
        setCmsNotification({ text: `Image loaded: ${file.name}`, type: 'success' });
      }
    };
    reader.readAsDataURL(file);

    // 2. Upload to server API (which supports both disk uploads and serverless base64)
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onUploaded(data.url);
        setCmsNotification({ text: `Image uploaded successfully: ${file.name}`, type: 'success' });
      }
    } catch (err) {
      console.warn('API upload fallback warning:', err);
      // FileReader already set the image successfully
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const [adminUser, setAdminUser] = useState({
    name: 'Hari Kishore Reddy',
    email: 'harikishorereddy9908@gmail.com',
    role: 'admin',
    branch: 'Hyderabad Ameerpet Main Campus',
  });

  // Live Students State loaded from MongoDB API (ZERO dummy records)
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(true);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'revoked'>('all');

  // Interactive Courses Catalog State (loaded dynamically from /api/courses)
  const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [foldersList, setFoldersList] = useState<any[]>([...MAIN_FOLDERS]);
  const [showAddFolderModal, setShowAddFolderModal] = useState<boolean>(false);
  const [newFolderForm, setNewFolderForm] = useState({
    name: '',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    logoText: 'CAD',
    partner: 'Autodesk & Industry Certified',
  });
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [currentFolderView, setCurrentFolderView] = useState<string | null>(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(true);

  // Course Modal States (Add / Edit)
  const [selectedCourseForStudents, setSelectedCourseForStudents] = useState<CourseItem | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isSavingCourse, setIsSavingCourse] = useState<boolean>(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);

  // Classwise Video & PDF Manager State
  const [managingClassesCourse, setManagingClassesCourse] = useState<CourseItem | null>(null);
  const [currentClasses, setCurrentClasses] = useState<CourseClass[]>([]);
  const [newClassForm, setNewClassForm] = useState<{
    id: string;
    classNumber: string;
    title: string;
    duration: string;
    videoType: 'drive' | 'file';
    videoUrl: string;
    description: string;
    pdfUrl: string;
    pdfName: string;
    pdfSize: string;
  }>({
    id: '',
    classNumber: '',
    title: '',
    duration: '45 mins',
    videoType: 'drive',
    videoUrl: '',
    description: '',
    pdfUrl: '',
    pdfName: '',
    pdfSize: '',
  });
  const [editingClassIndex, setEditingClassIndex] = useState<number | null>(null);
  const [testingVideoClass, setTestingVideoClass] = useState<CourseClass | null>(null);
  const [isSavingClasses, setIsSavingClasses] = useState<boolean>(false);
  const [classFormTab, setClassFormTab] = useState<'class' | 'notes'>('class');
  const [adminPreviewTab, setAdminPreviewTab] = useState<'video' | 'notes'>('video');

  // Quick Move Folder Modal State
  const [movingCourse, setMovingCourse] = useState<CourseItem | null>(null);
  const [targetMoveFolder, setTargetMoveFolder] = useState<string>('civil');
  const [isMovingCourse, setIsMovingCourse] = useState<boolean>(false);

  // New Course Template State
  const [newCourse, setNewCourse] = useState({
    hiddenSections: [] as string[],
    code: '',
    title: '',
    folder: 'civil' as string,
    domain: 'Civil & Architectural Engineering',
    category: 'PARAMETRIC BIM',
    level: 'Professional',
    software: '',
    duration: '90 Days (180 Hours)',
    totalHours: 180,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 35000,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    labImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    certificateImage: '',
    tagline: 'Comprehensive Industry CAD/BIM Program with 4D Scheduling & Portfolios',
    overview: 'Comprehensive industry CAD program with live labs, capstone project, and portfolio preparation.',
    prerequisites: 'Diploma / B.Tech / Working Professional',
    certification: 'Autodesk & Dassault Certificate',
    awardedCredential: 'Autodesk Certified Professional: Revit Architecture & BIM Specialist',
    careerRolesText: 'BIM Modeler, CAD Design Engineer, Architectural Draftsman, Project Coordinator',
    trainingHighlights: [
      { title: 'Instructor Led Training', desc: 'Expert CAD trainers with 10+ years EPC project experience.' },
      { title: 'Weekly Doubt Clearing Session', desc: 'One-on-one lab guidance for complex modeling problems.' },
      { title: 'Lifetime Assistance for Revision', desc: 'Repeat any module or tool training anytime at zero cost.' },
      { title: 'Lifetime Login to Student Dashboard', desc: '24/7 access to video recordings, project files & e-books.' },
      { title: 'World-Wide Valid Certification', desc: 'Official accredited certificate verifiable online with QR code.' },
      { title: 'Study Material, Assignments & Projects', desc: 'Real industrial CAD drawing dossiers & portfolio capstones.' },
    ] as TrainingHighlightItem[],
    labGuarantees: [
      'Dedicated NVIDIA RTX GPU Workstation',
      '1:1 Lab Seat • No Computer Sharing',
      'Lab Open 7 Days: 07:00 AM to 09:30 PM',
      'Continuous High-Speed Fiber Internet',
    ],
    highlights: [
      '3D Modeling & Parametric Assembly in Industrial Toolsuite',
      'Learn to create live industrial projects with real-scale models',
      'Drafting standards, GD&T tolerances & multi-sheet production sets',
      'Dynamic motion simulation, animations & design validation',
      'Clash detection, interference check & parametric design tables',
      'Automated Bill of Quantities / Materials (BOM) extraction',
    ],
    careerPathways: [
      { step: '01', experience: '0 – 2 Yrs', role: 'BIM Architectural Modeler', ctc: '₹4.5L – ₹9.0L PA' },
      { step: '02', experience: '2 – 4 Yrs', role: 'Revit Family Specialist', ctc: '₹5.5L – ₹10.5L PA' },
      { step: '03', experience: '4 – 6 Yrs', role: 'Lead BIM Coordinator', ctc: '₹7.0L – ₹13.5L PA' },
      { step: '04', experience: '6 – 8 Yrs', role: 'Clash & 4D Simulation Lead', ctc: '₹9.5L – ₹17.0L PA' },
    ] as CareerPathwayStep[],
    faqs: [
      {
        question: 'Is there any prerequisite for this course in Hyderabad?',
        answer: 'No strict prerequisite. Diploma / B.Tech / Working Professional / Mechanical / Civil / Electrical Graduate can join. Training starts from software fundamentals.',
      },
      {
        question: 'Will I get practical hands-on computer lab training?',
        answer: 'Yes, 100% guaranteed. Every student gets an unshared, high-performance RTX GPU computer rig during both instruction and practice lab hours.',
      },
      {
        question: 'How does the placement assistance support work?',
        answer: 'Upon submission and evaluation of your Capstone Project, our placement team schedules technical CAD interviews and lines up direct interviews with top EPC and MNC recruiters.',
      },
      {
        question: 'How will I receive my course completion certificate?',
        answer: 'You will receive a world-wide verifiable certificate accredited with official QR code verification and Autodesk & Dassault authorization.',
      },
      {
        question: 'Can I access lecture recordings if I miss any class?',
        answer: 'Yes, every enrolled student receives lifetime student portal login credentials where recorded classes, practice datasets, family libraries, and PDF manuals are accessible 24/7.',
      },
    ] as CourseFaqItem[],
    capstoneTitle: 'Commercial Complex 5-Story BIM Model with Multi-Trade Clash Report',
    capstoneDescription: 'Real-world industrial drafting, modeling, and validation project with detailed bill of quantities.',
    capstoneDeliverablesText: 'Central BIM Model (.rvt), Automated Bill of Quantities, Navisworks Clash Matrix, 4D Construction Timeline Animation',
    syllabusText: 'Core BIM Concepts & Revit User Interface\nAdvanced Parametric Families & Geometry\nSchedules, Material Take-off & Documentation\nNavisworks Coordination & Clash Detection',
    modules: [
      {
        number: '01',
        title: 'Core BIM Concepts & Revit User Interface',
        hours: 20,
        topics: ['Levels, Grids & Datum Elements', 'Basic Wall Systems & Compounds', 'Doors, Windows & Floor Slabs', 'Practical lab drafting & validation'],
      },
      {
        number: '02',
        title: 'Advanced Parametric Families & Geometry',
        hours: 30,
        topics: ['Parametric Family Editor', 'Curtain Wall Grids & Custom Mullions', 'Stairs, Railings & Ramp Formations', 'Practical lab drafting & validation'],
      },
    ] as CourseModuleItem[],
    status: 'Active' as 'Active' | 'Inactive',
  });

  // Course Assignment Modal State
  const [assignModalStudent, setAssignModalStudent] = useState<StudentRecord | null>(null);
  const [selectedCourseAssignments, setSelectedCourseAssignments] = useState<string[]>([]);
  const [modalAccessStatus, setModalAccessStatus] = useState<'active' | 'revoked'>('active');
  const [modalCourseSearch, setModalCourseSearch] = useState('');
  const [modalDomainFilter, setModalDomainFilter] = useState('all');
  const [isSavingAssignment, setIsSavingAssignment] = useState<boolean>(false);

  // Student Designs Modal State
  const [selectedStudentForDesign, setSelectedStudentForDesign] = useState<StudentRecord | null>(null);

  // New Admission Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [isSubmittingAdmission, setIsSubmittingAdmission] = useState(false);
  const [admissionAssignedCourses, setAdmissionAssignedCourses] = useState<string[]>(['AutoCAD Civil 2D Drafting & 3D Planning']);
  const [admissionFolderFilter, setAdmissionFolderFilter] = useState<string>('all');
  const [admissionCourseSearch, setAdmissionCourseSearch] = useState<string>('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    courseName: 'AutoCAD Civil 2D Drafting & 3D Planning',
    qualification: '',
    college: '',
    residence: 'Hyderabad',
    mobile: '',
    courseFee: 35000,
    paidFee: 0,
  });

  const handleToggleAdmissionCourse = (courseTitle: string) => {
    setAdmissionAssignedCourses((prev) => {
      if (prev.includes(courseTitle)) {
        if (prev.length === 1) return prev; // keep at least 1 course
        return prev.filter((t) => t !== courseTitle);
      } else {
        return [...prev, courseTitle];
      }
    });
  };

  // Certificate Management State (Real-time DB synced student-wise)
  const [certificates, setCertificates] = useState<StudentCertificate[]>([]);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState<boolean>(false);
  const [certStudentId, setCertStudentId] = useState<string>('');
  const [certCourse, setCertCourse] = useState('Autodesk Revit & Civil BIM Specialist');
  const [certGrade, setCertGrade] = useState('Grade A+ (Distinction)');
  const [certCustomId, setCertCustomId] = useState<string>('');
  const [certIssueDate, setCertIssueDate] = useState<string>('');
  const [certMode, setCertMode] = useState<'upload' | 'generate'>('upload');
  const [certFileUrl, setCertFileUrl] = useState<string>('');
  const [certFileName, setCertFileName] = useState<string>('');
  const [certFileSize, setCertFileSize] = useState<string>('');
  const [isUploadingCertFile, setIsUploadingCertFile] = useState<boolean>(false);
  const [certNotes, setCertNotes] = useState<string>('');
  const [isSubmittingCert, setIsSubmittingCert] = useState<boolean>(false);
  const [certSearchQuery, setCertSearchQuery] = useState<string>('');
  const [viewingCertificate, setViewingCertificate] = useState<StudentCertificate | null>(null);
  const [issuedCert, setIssuedCert] = useState<StudentCertificate | null>(null);
  const [uploadingCertStudentId, setUploadingCertStudentId] = useState<string | null>(null);

  // E-Book Management State (Live MongoDB synced)
  const [ebooks, setEbooks] = useState<EbookItem[]>([]);
  const [isLoadingEbooks, setIsLoadingEbooks] = useState<boolean>(false);
  const [ebookSearchQuery, setEbookSearchQuery] = useState<string>('');
  const [ebookFilterAccess, setEbookFilterAccess] = useState<'all' | 'free' | 'locked'>('all');
  const [newEbookTitle, setNewEbookTitle] = useState<string>('');
  const [newEbookCourse, setNewEbookCourse] = useState<string>('Civil CADD & Master BIM');
  const [newEbookPages, setNewEbookPages] = useState<string>('300 Pages');
  const [newEbookDesc, setNewEbookDesc] = useState<string>('');
  const [newEbookFileUrl, setNewEbookFileUrl] = useState<string>('');
  const [newEbookFileName, setNewEbookFileName] = useState<string>('');
  const [newEbookFileSize, setNewEbookFileSize] = useState<string>('');
  const [newEbookAccessType, setNewEbookAccessType] = useState<'free' | 'locked'>('free');
  const [newEbookTargetAudience, setNewEbookTargetAudience] = useState<'all' | 'course' | 'particular'>('all');
  const [newEbookTargetCourse, setNewEbookTargetCourse] = useState<string>('Civil CADD & Master BIM');
  const [newEbookAllowedStudents, setNewEbookAllowedStudents] = useState<string[]>([]);
  const [isUploadingEbookPdf, setIsUploadingEbookPdf] = useState<boolean>(false);
  const [isSubmittingEbook, setIsSubmittingEbook] = useState<boolean>(false);
  const [viewingEbook, setViewingEbook] = useState<EbookItem | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Job Placement Management State (Real-time DB synced with RND CADD Jobs Portal)
  const [adminJobs, setAdminJobs] = useState<JobPost[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(false);
  const [jobSearchQuery, setJobSearchQuery] = useState<string>('');
  const [jobFilterStatus, setJobFilterStatus] = useState<'all' | 'Active' | 'Closed' | 'WithApplicants'>('all');
  const [jobFilterStream, setJobFilterStream] = useState<string>('all');
  const [showAddJobModal, setShowAddJobModal] = useState<boolean>(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<JobPost | null>(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState<boolean>(false);
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    company: '',
    companyLogo: '',
    stream: 'Mechanical' as 'Mechanical' | 'Civil' | 'Electrical' | 'Architectural' | 'Piping' | 'All Streams',
    workMode: 'On-site' as 'On-site' | 'Hybrid' | 'Remote',
    jobType: 'Full-time' as 'Full-time' | 'Internship' | 'Contract' | 'Fresher Drive',
    experience: '0-2 Yrs (Freshers & CADDESK Trainees Eligible)',
    location: 'Hyderabad Ameerpet / PAN India',
    salary: '₹3.6 - ₹5.5 LPA',
    vacancies: 2,
    skills: 'AutoCAD, SolidWorks, GD&T, 3D Modeling',
    description: '',
    requirements: 'B.Tech / Diploma in Engineering\nProficiency in CAD/BIM tools\nCertification from RND CADD / CADDESK\nAvailable for immediate joining',
    deadline: 'Immediate / Next 15 Days',
    broadcastToStudents: true,
  });

  // Interactive States with ZERO hardcoded/dummy entries
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Support Tickets Management State (Real-time DB synced with /api/tickets)
  const [adminTickets, setAdminTickets] = useState<SupportTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState<boolean>(true);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [ticketSearchQuery, setTicketSearchQuery] = useState<string>('');
  const [selectedTicketForReply, setSelectedTicketForReply] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replyStatus, setReplyStatus] = useState<'In Progress' | 'Resolved'>('Resolved');
  const [replyFaculty, setReplyFaculty] = useState<string>('Er. Swamy Naidu (Director / Chief Architect)');
  const [isSubmittingTicketReply, setIsSubmittingTicketReply] = useState<boolean>(false);

  // Assignments Management State (Real-time DB synced with /api/assignments)
  const [adminAssignments, setAdminAssignments] = useState<AssignmentItem[]>([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState<boolean>(true);
  const [assignmentSearchQuery, setAssignmentSearchQuery] = useState<string>('');
  const [assignmentCourseFilter, setAssignmentCourseFilter] = useState<string>('all');
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState<boolean>(false);
  const [selectedAssignmentForView, setSelectedAssignmentForView] = useState<AssignmentItem | null>(null);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState<string>('');
  const [newAssignmentCourse, setNewAssignmentCourse] = useState<string>('Civil CADD & Master BIM');
  const [newAssignmentDescription, setNewAssignmentDescription] = useState<string>('');
  const [newAssignmentPdfUrl, setNewAssignmentPdfUrl] = useState<string>('');
  const [newAssignmentPdfName, setNewAssignmentPdfName] = useState<string>('');
  const [newAssignmentPdfSize, setNewAssignmentPdfSize] = useState<string>('2.5 MB');
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState<string>('');
  const [newAssignmentMaxScore, setNewAssignmentMaxScore] = useState<number>(100);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState<boolean>(false);
  const [isUploadingAssignmentPdf, setIsUploadingAssignmentPdf] = useState<boolean>(false);

  // Course Ratings & Student Reviews State (Live Synced with /api/reviews)
  const [adminReviews, setAdminReviews] = useState<CourseReview[]>([]);
  const [isLoadingAdminReviews, setIsLoadingAdminReviews] = useState<boolean>(true);
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>('');
  const [reviewCourseFilter, setReviewCourseFilter] = useState<string>('all');
  const [reviewRatingFilter, setReviewRatingFilter] = useState<string>('all');
  const [isDeletingReviewId, setIsDeletingReviewId] = useState<string | null>(null);

    // Live Classes Management State (Enterprise Table & Real-Time Broadcast Pattern)
  
  // Offers & Discounts Management State (Dynamic DB + Student Portal Sync)
  const [adminOffers, setAdminOffers] = useState<OfferItem[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState<boolean>(false);
  const [offersSearchQuery, setOffersSearchQuery] = useState<string>('');
  const [offersTypeFilter, setOffersTypeFilter] = useState<'all' | 'referral' | 'course_discount' | 'active' | 'inactive'>('all');
  const [showOfferModal, setShowOfferModal] = useState<boolean>(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerFormType, setOfferFormType] = useState<'referral' | 'course_discount'>('course_discount');
  const [offerFormTitle, setOfferFormTitle] = useState<string>('');
  const [offerFormCode, setOfferFormCode] = useState<string>('');
  const [offerFormCourse, setOfferFormCourse] = useState<string>('All Engineering Courses');
  const [offerFormDiscountType, setOfferFormDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [offerFormDiscountValue, setOfferFormDiscountValue] = useState<number>(15);
  const [offerFormReferrerReward, setOfferFormReferrerReward] = useState<string>('Rs 1,500 Voucher');
  const [offerFormRefereeReward, setOfferFormRefereeReward] = useState<string>('15% Course Fee Waiver');
  const [offerFormExpiry, setOfferFormExpiry] = useState<string>('2026-12-31');
  const [offerFormDescription, setOfferFormDescription] = useState<string>('');
  const [isSubmittingOffer, setIsSubmittingOffer] = useState<boolean>(false);
  const [copiedOfferId, setCopiedOfferId] = useState<string | null>(null);

  const [liveSession, setLiveSession] = useState<LiveClassSession | null>(null);
  const [liveHistory, setLiveHistory] = useState<LiveClassSession[]>([]);
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>('');
  const [liveStatusFilter, setLiveStatusFilter] = useState<'all' | 'live' | 'scheduled' | 'ended'>('all');
  const [showLiveModal, setShowLiveModal] = useState<boolean>(false);
  const [editingLiveId, setEditingLiveId] = useState<string | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [liveFormTitle, setLiveFormTitle] = useState<string>('Parametric Family Creation in Autodesk Revit');
  const [liveFormTrainer, setLiveFormTrainer] = useState<string>('Er. Swamy Naidu');
  const [liveFormCourse, setLiveFormCourse] = useState<string>('Civil CADD & Master BIM');
  const [liveFormUrl, setLiveFormUrl] = useState<string>('https://meet.google.com/new');
  const [liveFormPlatform, setLiveFormPlatform] = useState<'Virtual CAD Workstation' | 'Google Meet' | 'Zoom' | 'YouTube Live' | 'Microsoft Teams'>('Virtual CAD Workstation');
  const [liveFormTiming, setLiveFormTiming] = useState<string>('Live Broadcast Active (Lab Session)');
  const [liveFormDescription, setLiveFormDescription] = useState<string>('Trainer Er. Swamy Naidu is currently live demonstrating Parametric Family Creation in Autodesk Revit. Connect to your dedicated CAD workstation screen.');


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Persist live courses locally for instant real-time sync with website
  const persistLiveCourses = (updatedList: CourseItem[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rnd_cadd_live_courses', JSON.stringify(updatedList));
        window.dispatchEvent(new CustomEvent('rnd_cadd_courses_updated', { detail: updatedList }));
      }
    } catch (e) {
      console.error('Failed to persist live courses:', e);
    }
  };

  // Fetch real students from API
  const fetchStudents = async (silent = false) => {
    if (!silent) setIsLoadingStudents(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        setStudents(data.students);
        if (data.students.length > 0 && !certStudentId) {
          setCertStudentId(data.students[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      if (!silent) setIsLoadingStudents(false);
    }
  };

  // Fetch live courses from API
  const fetchCourses = async (silent = false) => {
    if (!silent) setIsLoadingCourses(true);
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        const hydrated = data.courses.map((c: CourseItem) => {
          const auth = COURSES.find(
            (def) => def.id.toLowerCase() === c.id.toLowerCase() || def.title.toLowerCase().trim() === c.title?.toLowerCase().trim()
          );
          if (!auth) return c;
          const isBrokenImage = !c.image || c.image.includes('1541888946425') || c.image.includes('1581092335397') || c.image.includes('1504917599217');
          const hasRichModules = Array.isArray(c.modules) && c.modules.length > 1;
          const hasRichCapstone = c.capstoneProject && c.capstoneProject.title && !c.capstoneProject.title.endsWith('Live Industry Project');
          return {
            ...c,
            image: isBrokenImage ? auth.image : c.image,
            modules: hasRichModules ? c.modules : (auth.modules || c.modules),
            syllabus: hasRichModules ? (c.syllabus || c.modules.map((m: any) => m.title)) : (auth.modules?.map((m) => m.title) || c.syllabus),
            capstoneProject: hasRichCapstone ? c.capstoneProject : (auth.capstoneProject || c.capstoneProject),
            careerRoles: Array.isArray(c.careerRoles) && c.careerRoles.length > 0 ? c.careerRoles : auth.careerRoles,
            certification: c.certification || auth.certification,
            prerequisites: c.prerequisites || auth.prerequisites,
            tagline: c.tagline || auth.tagline,
            totalHours: c.totalHours || auth.totalHours,
            duration: c.duration || auth.duration,
          };
        });
        setCourses(hydrated);
        persistLiveCourses(hydrated);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      if (!silent) setIsLoadingCourses(false);
    }
  };

  // Sync folders from localStorage
  const syncFolders = () => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('rnd_cadd_admin_folders');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFoldersList(parsed);
          }
        }
      }
    } catch {
      // ignore
    }
  };

  // Create lightweight folder (Image-3 button action: Folder Name, Image only)
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderForm.name.trim()) {
      alert('Please enter a folder name.');
      return;
    }

    const folderId = newFolderForm.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');

    const codeNum = foldersList.length + 1;
    const newFolderObj = {
      id: folderId,
      name: newFolderForm.name.trim(),
      shortName: newFolderForm.name.trim().split(' ')[0],
      code: `FOLDER ${codeNum < 10 ? '0' + codeNum : codeNum}`,
      partner: newFolderForm.partner.trim() || 'Certified Training Center',
      credential: 'Executive CAD/CAM Diploma',
      duration: '4-6 Months',
      badgeLabel: '360° Career Support',
      image: newFolderForm.image.trim() || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      logoText: newFolderForm.logoText.trim() || 'CAD',
      description: 'Comprehensive industry CAD program with live labs.',
      software: 'Industry Standard CAD Tools',
      badgeBg: 'bg-[#E0F2FE]',
      badgeText: 'text-[#0369A1]',
      accentColor: '#0284C7',
    };

    const updated = [...foldersList, newFolderObj];
    setFoldersList(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('rnd_cadd_admin_folders', JSON.stringify(updated));
      }
    } catch {
      // ignore
    }

    showToast(`📁 Folder "${newFolderObj.name}" created successfully!`);
    setShowAddFolderModal(false);
    setNewFolderForm({
      name: '',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      logoText: 'CAD',
      partner: 'Autodesk & Industry Certified',
    });
  };

  // Fetch student certificates from API
  const fetchCertificates = async (silent = false) => {
    if (!silent) setIsLoadingCertificates(true);
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      if (data.success && Array.isArray(data.certificates)) {
        setCertificates(data.certificates);
      }
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      if (!silent) setIsLoadingCertificates(false);
    }
  };

  // Fetch ebooks from API (Live DB synced)
  const fetchEbooks = async (silent = false) => {
    if (!silent) setIsLoadingEbooks(true);
    try {
      const res = await fetch('/api/ebooks');
      const data = await res.json();
      if (data.success && Array.isArray(data.ebooks)) {
        setEbooks(data.ebooks);
      }
    } catch (err) {
      console.error('Failed to load ebooks:', err);
    } finally {
      if (!silent) setIsLoadingEbooks(false);
    }
  };

  // Fetch live jobs & applicants from API
  const fetchJobs = async (silent = false) => {
    if (!silent) setIsLoadingJobs(true);
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setAdminJobs(data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs in admin portal:', err);
    } finally {
      if (!silent) setIsLoadingJobs(false);
    }
  };

  // Fetch support tickets from API
  const fetchAdminTickets = async (silent = false) => {
    if (!silent) setIsLoadingTickets(true);
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setAdminTickets(data.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets in admin:', err);
    } finally {
      if (!silent) setIsLoadingTickets(false);
    }
  };

  // Fetch course assignments from API
  const fetchAdminAssignments = async (silent = false) => {
    if (!silent) setIsLoadingAssignments(true);
    try {
      const res = await fetch('/api/assignments');
      const data = await res.json();
      if (data.success && Array.isArray(data.assignments)) {
        setAdminAssignments(data.assignments);
      }
    } catch (err) {
      console.error('Failed to load assignments in admin:', err);
    } finally {
      if (!silent) setIsLoadingAssignments(false);
    }
  };

  // Fetch course reviews from API (Live DB synced)
  const fetchAdminReviews = async (silent = false) => {
    if (!silent) setIsLoadingAdminReviews(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setAdminReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews in admin:', err);
    } finally {
      if (!silent) setIsLoadingAdminReviews(false);
    }
  };

  // Delete review by ID
  
  
  // Offers & Discounts CRUD Operations
  const fetchAdminOffers = async (silent = false) => {
    if (!silent) setIsLoadingOffers(true);
    try {
      const res = await fetch('/api/offers?t=' + Date.now());
      const data = await res.json();
      if (data.success && Array.isArray(data.offers)) {
        setAdminOffers(data.offers);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_offers', JSON.stringify(data.offers));
        }
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      if (!silent) setIsLoadingOffers(false);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerFormTitle.trim() || !offerFormCode.trim()) {
      alert('Please provide an offer title and promo/referral code.');
      return;
    }

    setIsSubmittingOffer(true);
    try {
      const payload = {
        id: editingOfferId || undefined,
        type: offerFormType,
        title: offerFormTitle.trim(),
        code: offerFormCode.trim().toUpperCase(),
        targetCourse: offerFormCourse,
        discountType: offerFormDiscountType,
        discountValue: Number(offerFormDiscountValue) || 10,
        referrerReward: offerFormType === 'referral' ? offerFormReferrerReward : '',
        refereeReward: offerFormRefereeReward,
        expiryDate: offerFormExpiry,
        description: offerFormDescription,
        status: 'Active',
      };

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminOffers(true);
        setShowOfferModal(false);
        setEditingOfferId(null);
        showToast('Offer campaign created & referral link generated successfully!');
      } else {
        alert(data.message || 'Failed to save offer');
      }
    } catch (err) {
      console.error('Save offer error:', err);
      alert('Network error saving offer.');
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  const handleToggleOfferHide = async (id: string, currentlyHidden: boolean) => {
    const nextHidden = !currentlyHidden;
    const nextStatus = nextHidden ? 'Hidden' : 'Active';
    try {
      setAdminOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, hidden: nextHidden, status: nextStatus as any } : o))
      );
      const res = await fetch('/api/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, hidden: nextHidden, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(nextHidden ? 'Offer hidden from students' : 'Offer unhidden and live for students');
      }
    } catch (err) {
      console.error('Toggle offer hide error:', err);
    }
  };

  const handleToggleOfferStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch('/api/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: nextStatus as any } : o)));
        showToast(`Offer marked as ${nextStatus}`);
      }
    } catch (err) {
      console.error('Toggle offer status error:', err);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer campaign?')) return;
    try {
      const res = await fetch(`/api/offers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminOffers((prev) => prev.filter((o) => o.id !== id));
        showToast('Offer deleted successfully.');
      }
    } catch (err) {
      console.error('Delete offer error:', err);
    }
  };

  const handleCopyOfferLink = (link: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedOfferId(id);
      setTimeout(() => setCopiedOfferId(null), 2500);
      showToast('Referral / Promo link copied to clipboard!');
    }
  };

  // Live Classes Fetcher & Broadcaster
  const fetchLiveSession = async (silent = false) => {
    if (!silent) setIsLoadingLive(true);
    try {
      const res = await fetch('/api/live-classes?t=' + Date.now());
      const data = await res.json();
      if (data.success) {
        if (data.liveClass) {
          setLiveSession(data.liveClass);
          if (typeof window !== 'undefined') {
            localStorage.setItem('rnd_cadd_live_session', JSON.stringify(data.liveClass));
          }
        }
        if (Array.isArray(data.history) && data.history.length > 0) {
          setLiveHistory(data.history);
        } else if (data.liveClass) {
          setLiveHistory([data.liveClass]);
        }
      }
    } catch (err) {
      console.warn('Failed to load live class details:', err);
    } finally {
      if (!silent) setIsLoadingLive(false);
    }
  };

  const handleBroadcastLive = async (status: 'Live Now' | 'Scheduled') => {
    if (!liveFormTitle.trim()) {
      alert('Please enter a session title.');
      return;
    }
    setIsBroadcasting(true);
    try {
      const payload = {
        id: editingLiveId || undefined,
        title: liveFormTitle,
        trainer: liveFormTrainer,
        course: liveFormCourse,
        streamUrl: liveFormUrl,
        platform: liveFormPlatform,
        timing: liveFormTiming,
        description: liveFormDescription,
        status,
      };
      const res = await fetch('/api/live-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setLiveSession(data.liveClass);
        if (Array.isArray(data.history)) setLiveHistory(data.history);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_live_session', JSON.stringify(data.liveClass));
          window.dispatchEvent(new Event('storage'));
        }
        setShowLiveModal(false);
        setEditingLiveId(null);
        showToast(status === 'Live Now' ? '🚀 Live class broadcast is active on Student Portal!' : '📅 Upcoming class scheduled successfully!');
      } else {
        alert(data.message || 'Failed to update live class.');
      }
    } catch (err) {
      console.error('Broadcast error:', err);
      alert('Failed to connect to live classes server.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleEndLiveSession = async (sessionId?: string) => {
    if (!confirm('Are you sure you want to END the live broadcast? Students will see session ended immediately.')) return;
    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/live-classes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Ended', id: sessionId || liveSession?.id }),
      });
      const data = await res.json();
      if (data.success) {
        setLiveSession(data.liveClass);
        if (Array.isArray(data.history)) setLiveHistory(data.history);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_live_session', JSON.stringify(data.liveClass));
          window.dispatchEvent(new Event('storage'));
        }
        showToast('Live stream has ended. Student portal is now offline.');
      }
    } catch (err) {
      console.error('End session error:', err);
      alert('Network error ending live session.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleDeleteLiveSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live session record?')) return;
    try {
      const res = await fetch(`/api/live-classes?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (data.liveClass) setLiveSession(data.liveClass);
        if (Array.isArray(data.history)) setLiveHistory(data.history);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_live_session', JSON.stringify(data.liveClass));
          window.dispatchEvent(new Event('storage'));
        }
        showToast('Live session deleted.');
      }
    } catch (err) {
      console.error('Delete live session error:', err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this course review?')) return;
    setIsDeletingReviewId(reviewId);
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(reviewId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setAdminReviews((prev) => prev.filter((r) => r.id !== reviewId));
        showToast('Review deleted successfully');
      } else {
        alert(data.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Network error deleting review');
    } finally {
      setIsDeletingReviewId(null);
    }
  };

  // Admin solves/replies to a student ticket
  const handleResolveTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketForReply) return;
    if (!replyText.trim()) {
      showToast('⚠️ Please enter the resolution guidance for the student.');
      return;
    }
    setIsSubmittingTicketReply(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTicketForReply.id,
          status: replyStatus,
          adminReply: replyText.trim(),
          resolvedBy: replyFaculty.trim() || 'Er. Swamy Naidu (Director / Chief Architect)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          replyStatus === 'Resolved'
            ? `Ticket ${selectedTicketForReply.ticketNumber} marked as Resolved! Sent to student.`
            : `Ticket ${selectedTicketForReply.ticketNumber} updated with In-Progress notes.`
        );
        fetchAdminTickets();
        setSelectedTicketForReply(null);
        setReplyText('');
      } else {
        alert(data.message || 'Failed to update ticket');
      }
    } catch (err: any) {
      alert(`Error updating ticket: ${err.message}`);
    } finally {
      setIsSubmittingTicketReply(false);
    }
  };

  // Admin deletes a ticket
  const handleDeleteTicket = async (ticket: SupportTicket) => {
    if (!confirm(`Are you sure you want to delete ticket ${ticket.ticketNumber} from ${ticket.studentName}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/tickets?id=${ticket.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Ticket ${ticket.ticketNumber} deleted.`);
        fetchAdminTickets();
      } else {
        alert(data.message || 'Failed to delete ticket');
      }
    } catch (err: any) {
      alert(`Error deleting ticket: ${err.message}`);
    }
  };

  // Direct PDF Upload for Assignments (File System Upload)
  const handleAssignmentPdfUpload = async (file: File) => {
    setIsUploadingAssignmentPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNewAssignmentPdfUrl(data.url);
        setNewAssignmentPdfName(file.name);
        const sizeStr = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;
        setNewAssignmentPdfSize(sizeStr);
        showToast(`Assignment PDF "${file.name}" uploaded successfully!`);
      } else {
        alert(data.message || 'File upload failed.');
      }
    } catch (err) {
      console.error('Assignment file upload error:', err);
      alert('Network error while uploading assignment PDF file.');
    } finally {
      setIsUploadingAssignmentPdf(false);
    }
  };

  // Admin creates a course assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim() || !newAssignmentCourse || !newAssignmentPdfUrl.trim()) {
      showToast('Please enter Assignment Title, Course, and select a PDF file to upload');
      return;
    }
    setIsSubmittingAssignment(true);
    try {
      const payload = {
        title: newAssignmentTitle.trim(),
        course: newAssignmentCourse.trim(),
        description: newAssignmentDescription.trim(),
        pdfUrl: newAssignmentPdfUrl.trim(),
        pdfName: newAssignmentPdfName.trim() || `${newAssignmentTitle.trim().replace(/\s+/g, '-')}.pdf`,
        pdfSize: newAssignmentPdfSize.trim() || '2.5 MB',
        dueDate: newAssignmentDueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        maxScore: Number(newAssignmentMaxScore) || 100,
      };

      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Assignment created and assigned to students of "${newAssignmentCourse}"!`);
        fetchAdminAssignments();
        setShowAddAssignmentModal(false);
        setNewAssignmentTitle('');
        setNewAssignmentDescription('');
        setNewAssignmentPdfUrl('');
        setNewAssignmentPdfName('');
        setNewAssignmentDueDate('');
      } else {
        alert(data.message || 'Failed to publish assignment');
      }
    } catch (err: any) {
      alert(`Error publishing assignment: ${err.message}`);
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  // Admin deletes an assignment
  const handleDeleteAssignment = async (assignment: AssignmentItem) => {
    if (!confirm(`Are you sure you want to delete assignment "${assignment.title}" for ${assignment.course}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/assignments?id=${assignment.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Assignment "${assignment.title}" deleted.`);
        fetchAdminAssignments();
      } else {
        alert(data.message || 'Failed to delete assignment');
      }
    } catch (err: any) {
      alert(`Error deleting assignment: ${err.message}`);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobForm.title.trim() || !newJobForm.company.trim()) {
      showToast('⚠️ Please enter both Job Title and Company Name');
      return;
    }
    setIsSubmittingJob(true);
    try {
      const payload = {
        title: newJobForm.title.trim(),
        company: newJobForm.company.trim(),
        companyLogo: newJobForm.companyLogo.trim() || undefined,
        stream: newJobForm.stream,
        workMode: newJobForm.workMode,
        jobType: newJobForm.jobType,
        experience: newJobForm.experience.trim(),
        location: newJobForm.location.trim(),
        salary: newJobForm.salary.trim(),
        vacancies: Number(newJobForm.vacancies) || 1,
        skills: newJobForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        description:
          newJobForm.description.trim() ||
          `Exciting core engineering opportunity for ${newJobForm.title} at ${newJobForm.company}. Candidates with CAD/BIM industry certifications from RND CADD / CADDESK are highly preferred.`,
        requirements: newJobForm.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
        deadline: newJobForm.deadline.trim() || 'Immediate / 15 Days',
        broadcastToStudents: newJobForm.broadcastToStudents,
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Job vacancy published & alert broadcasted to students!');
        setShowAddJobModal(false);
        setNewJobForm({
          title: '',
          company: '',
          companyLogo: '',
          stream: 'Mechanical',
          workMode: 'On-site',
          jobType: 'Full-time',
          experience: '0-2 Yrs (Freshers & CADDESK Trainees Eligible)',
          location: 'Hyderabad Ameerpet / PAN India',
          salary: '₹3.6 - ₹5.5 LPA',
          vacancies: 2,
          skills: 'AutoCAD, SolidWorks, GD&T, 3D Modeling',
          description: '',
          requirements: 'B.Tech / Diploma in Engineering\nProficiency in CAD/BIM tools\nCertification from RND CADD / CADDESK\nAvailable for immediate joining',
          deadline: 'Immediate / Next 15 Days',
          broadcastToStudents: true,
        });
        await fetchJobs();
      } else {
        showToast(`❌ Error: ${data.message || 'Failed to post job'}`);
      }
    } catch (err: any) {
      showToast(`❌ Network error: ${err.message}`);
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const handleToggleJobStatus = async (job: JobPost) => {
    const nextStatus = job.status === 'Active' ? 'Closed' : 'Active';
    try {
      const res = await fetch('/api/jobs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: job.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Job status updated to ${nextStatus}`);
        setAdminJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: nextStatus } : j))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to remove job vacancy: "${jobTitle}"?`)) return;
    try {
      const res = await fetch(`/api/jobs?id=${encodeURIComponent(jobId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('🗑️ Job vacancy removed');
        setAdminJobs((prev) => prev.filter((j) => j.id !== jobId));
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  useEffect(() => {
    syncFolders();
    fetchStudents();
    fetchCourses();
    fetchCertificates();
    fetchEbooks();
    fetchJobs();
    fetchAdminTickets();
    fetchAdminAssignments();
    fetchAdminReviews();
    fetchLiveSession();
    fetchAdminOffers();

    if (typeof window !== 'undefined') {
      let savedUser: any = null;
      try {
        const sessionRaw = sessionStorage.getItem('rnd_cadd_user');
        if (sessionRaw) savedUser = JSON.parse(sessionRaw);
      } catch {}

      if (!savedUser) {
        try {
          const localRaw = localStorage.getItem('rnd_cadd_user');
          if (localRaw) savedUser = JSON.parse(localRaw);
        } catch {}
      }

      // Only accept admin sessions, never let a student session overwrite the admin portal
      if (savedUser && (savedUser.role === 'admin' || savedUser.email?.includes('admin') || savedUser.email?.includes('harikishore'))) {
        setAdminUser((prev) => ({
          ...prev,
          name: savedUser.name || 'Hari Kishore Reddy',
          email: savedUser.email || 'harikishorereddy9908@gmail.com',
        }));
        sessionStorage.setItem('rnd_cadd_user', JSON.stringify({
          name: savedUser.name || 'Hari Kishore Reddy',
          email: savedUser.email || 'harikishorereddy9908@gmail.com',
          role: 'admin',
        }));
        sessionStorage.setItem('rnd_cadd_role', 'admin');
      } else {
        // Default clean admin session for this window
        sessionStorage.setItem('rnd_cadd_user', JSON.stringify({
          name: 'Hari Kishore Reddy',
          email: 'harikishorereddy9908@gmail.com',
          role: 'admin',
        }));
        sessionStorage.setItem('rnd_cadd_role', 'admin');
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('rnd_cadd_user');
      sessionStorage.removeItem('rnd_cadd_role');
      sessionStorage.removeItem('rnd_cadd_admin_session');
      try {
        const local = localStorage.getItem('rnd_cadd_user');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.role === 'admin' || parsed.email?.includes('admin') || parsed.email?.includes('harikishore')) {
            localStorage.removeItem('rnd_cadd_user');
            localStorage.removeItem('rnd_cadd_role');
          }
        }
      } catch {}
      window.location.href = '/signin';
    }
  };

  // Give or Revoke Access
  const handleToggleAccess = async (student: StudentRecord) => {
    const newStatus: 'active' | 'revoked' = student.accessStatus === 'active' ? 'revoked' : 'active';
    const actionLabel = newStatus === 'active' ? 'Granted access to' : 'Revoked access for';

    // Optimistic UI update
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, accessStatus: newStatus } : s))
    );

    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: student.id,
          accessStatus: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${actionLabel} ${student.name} successfully.`);
      } else {
        fetchStudents();
        alert(`Failed to update access: ${data.message}`);
      }
    } catch (err) {
      console.error('Access toggle failed:', err);
      fetchStudents();
    }
  };

  // Delete Student
  const handleDeleteStudent = async (student: StudentRecord) => {
    if (!confirm(`Are you sure you want to remove ${student.name} (${student.studentId}) from the student registry?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/students?id=${student.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        showToast(`Deleted student ${student.name} successfully.`);
      } else {
        alert(data.message || 'Failed to delete student.');
      }
    } catch (err) {
      console.error('Delete student error:', err);
      alert('Network error while deleting student.');
    }
  };

  // Open Course Assignment Modal
  const handleOpenAssignModal = (student: StudentRecord) => {
    setAssignModalStudent(student);
    setSelectedCourseAssignments(
      Array.isArray(student.assignedCourses) && student.assignedCourses.length > 0
        ? student.assignedCourses
        : [student.courseName || 'Civil CADD & Master BIM']
    );
    setModalAccessStatus(student.accessStatus === 'revoked' ? 'revoked' : 'active');
    setModalCourseSearch('');
    setModalDomainFilter('all');
  };

  // Toggle course assignment in modal
  const handleToggleCourseInAssignment = (courseTitle: string) => {
    if (selectedCourseAssignments.includes(courseTitle)) {
      setSelectedCourseAssignments(selectedCourseAssignments.filter((c) => c !== courseTitle));
    } else {
      setSelectedCourseAssignments([...selectedCourseAssignments, courseTitle]);
    }
  };

  // Save Course Assignments
  const handleSaveAssignments = async () => {
    if (!assignModalStudent) return;
    if (selectedCourseAssignments.length === 0) {
      alert('Please select at least one course for the student.');
      return;
    }

    setIsSavingAssignment(true);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assignModalStudent.id,
          assignedCourses: selectedCourseAssignments,
          accessStatus: modalAccessStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === assignModalStudent.id
              ? {
                  ...s,
                  assignedCourses: selectedCourseAssignments,
                  accessStatus: modalAccessStatus,
                }
              : s
          )
        );
        showToast(`Assigned ${selectedCourseAssignments.length} course(s) to ${assignModalStudent.name}.`);
        setAssignModalStudent(null);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error('Course assignment error:', err);
      alert('Failed to save course assignments.');
    } finally {
      setIsSavingAssignment(false);
    }
  };

  // Add New Admission
  const handleAddNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;

    setIsSubmittingAdmission(true);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudent.name.trim(),
          email: newStudent.email.trim(),
          courseName: admissionAssignedCourses[0] || newStudent.courseName,
          qualification: newStudent.qualification || '-',
          college: newStudent.college || '-',
          residence: newStudent.residence || 'Hyderabad',
          mobile: newStudent.mobile || '-',
          courseFee: Number(newStudent.courseFee) || 0,
          paidFee: Number(newStudent.paidFee) || 0,
          assignedCourses: admissionAssignedCourses.length > 0 ? admissionAssignedCourses : [newStudent.courseName],
        }),
      });
      const data = await res.json();
      if (data.success && data.student) {
        setStudents((prev) => [data.student, ...prev]);
        setShowAddStudentModal(false);
        showToast(`Student ${newStudent.name} admitted successfully. Admission confirmation email sent to ${newStudent.email || 'student'}.`);
        setNewStudent({
          name: '',
          email: '',
          courseName: 'AutoCAD Civil 2D Drafting & 3D Planning',
          qualification: '',
          college: '',
          residence: 'Hyderabad',
          mobile: '',
          courseFee: 35000,
          paidFee: 0,
        });
        setAdmissionAssignedCourses(['AutoCAD Civil 2D Drafting & 3D Planning']);
      } else {
        alert(data.message || 'Could not save student admission.');
      }
    } catch (err) {
      console.error('Admission submit error:', err);
      alert('Failed to connect to server for student admission.');
    } finally {
      setIsSubmittingAdmission(false);
    }
  };

  // Initialize course for editing with all full-blueprint specs matching the website
  const handleStartEditCourse = (course: CourseItem) => {
    const liveSource = COURSES.find(
      (c) =>
        c.id.toLowerCase() === course.id.toLowerCase() ||
        c.title.toLowerCase().trim() === course.title.toLowerCase().trim() ||
        (course.code && c.code && c.code.toLowerCase() === course.code.toLowerCase())
    );

    const toolsList = Array.isArray(course.tools) && course.tools.length > 0
      ? course.tools
      : (liveSource && Array.isArray(liveSource.tools) && liveSource.tools.length > 0)
      ? liveSource.tools
      : course.software
      ? course.software.split(',').map((s) => s.trim()).filter(Boolean)
      : ['CAD Tools'];

    const hasRichModules = Array.isArray(course.modules) &&
      course.modules.length > 1 &&
      course.modules.some((m) => Array.isArray(m.topics) && m.topics.length > 1);

    const modulesList: CourseModuleItem[] = hasRichModules
      ? (course.modules as CourseModuleItem[])
      : (liveSource?.modules && liveSource.modules.length > 0)
      ? (liveSource.modules as CourseModuleItem[])
      : Array.isArray(course.modules) && course.modules.length > 0
      ? course.modules
      : (course.syllabus || []).map((s, idx) => ({
          number: String(idx + 1).padStart(2, '0'),
          title: s,
          hours: 20,
          topics: [s, 'Practical lab drafting & validation'],
        }));

    const hasRichCapstone = course.capstoneProject &&
      course.capstoneProject.title &&
      !course.capstoneProject.title.endsWith('Live Industry Project') &&
      Array.isArray(course.capstoneProject.deliverables) &&
      course.capstoneProject.deliverables.length > 0;

    const capstoneObj: CourseCapstoneItem = hasRichCapstone
      ? course.capstoneProject
      : liveSource?.capstoneProject || course.capstoneProject || {
          title: `${course.title} Live Industry Project`,
          description: 'Real-world industrial drafting, modeling, and validation project with detailed engineering dossier.',
          deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
        };

    const careerList = Array.isArray(course.careerRoles) && course.careerRoles.length > 0
      ? course.careerRoles
      : (liveSource && Array.isArray(liveSource.careerRoles) && liveSource.careerRoles.length > 0)
      ? liveSource.careerRoles
      : ['CAD Design Engineer', 'Product Specialist', 'Project Engineer', 'Drafting Specialist'];

    const validImage = course.image &&
      !course.image.includes('1541888946425') &&
      !course.image.includes('1581092335397') &&
      !course.image.includes('1504917599217')
      ? course.image
      : liveSource?.image || course.image;

    const prereq = course.prerequisites || liveSource?.prerequisites || 'Diploma / B.Tech / Working Professional';
    const cert = course.certification || liveSource?.certification || 'Autodesk & Dassault Certificate';
    const tagline = course.tagline || liveSource?.tagline || course.overview || '';
    const overview = course.overview || liveSource?.overview || '';
    const duration = course.duration || liveSource?.duration || '90 Days (180 Hours)';
    const totalHours = Number(course.totalHours) || liveSource?.totalHours || 180;
    const category = course.category || liveSource?.category || (course.folder === 'civil' ? 'PARAMETRIC BIM' : course.folder === 'mechanical' ? 'MECHANICAL CAE' : 'ENGINEERING CAD');
    const level = course.level || liveSource?.level || 'Professional';

    const defaultHighlights = [
      `3D Modeling & Parametric Assembly in ${toolsList[0] || course.title}`,
      `Learn to create live industrial projects using ${toolsList[0] || course.title}`,
      'Drafting standards, GD&T tolerances & multi-sheet production sets',
      'Dynamic motion simulation, animations & design validation',
      'Clash detection, interference check & parametric design tables',
      'Automated Bill of Quantities / Materials (BOM) extraction',
    ];

    const defaultCareerPathways: CareerPathwayStep[] = careerList.slice(0, 4).map((r, i) => {
      const exps = ['0 – 2 Yrs', '2 – 4 Yrs', '4 – 6 Yrs', '6 – 8 Yrs'];
      const ctcs = ['₹4.5L – ₹9.0L PA', '₹5.5L – ₹10.5L PA', '₹7.5L – ₹14.0L PA', '₹10.0L – ₹18.0L+ PA'];
      return {
        step: String(i + 1).padStart(2, '0'),
        experience: exps[i] || `${i * 2}+ Yrs`,
        role: r,
        ctc: ctcs[i] || '₹12.0L – ₹22.0L PA',
      };
    });

    const defaultFaqs: CourseFaqItem[] = [
      {
        question: `Is there any prerequisite for the ${course.title} Course in Hyderabad?`,
        answer: `No strict prerequisite. ${prereq}. Anyone from an engineering, diploma, architecture, or design background can join. The training begins from software fundamentals and advances to complex industrial projects.`,
      },
      {
        question: 'Will I get practical hands-on computer lab training?',
        answer: 'Yes, 100% guaranteed. Every student gets an unshared, high-performance RTX GPU computer rig during both instruction and practice lab hours. Our lab is open 7 days a week from 07:00 AM to 09:30 PM.',
      },
      {
        question: 'How does the placement assistance support work?',
        answer: 'Upon submission and evaluation of your Capstone Project, our placement team schedules 3 rounds of technical CAD interviews, polishes your resume, and lines up direct interviews with top EPC and MNC recruiters.',
      },
      {
        question: 'How will I receive my course completion certificate?',
        answer: `You will receive a world-wide verifiable certificate accredited with official QR code verification and ${cert} authorization, accepted across top engineering enterprises in India and abroad.`,
      },
      {
        question: 'Can I access lecture recordings if I miss any class?',
        answer: 'Yes, every enrolled student receives lifetime student portal login credentials where recorded classes, practice datasets, family libraries, and PDF manuals are accessible 24/7.',
      },
    ];

    const labImage = course.labImage || (liveSource as any)?.labImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
    const certificateImage = course.certificateImage || (liveSource as any)?.certificateImage || '';
    const awardedCredential = course.awardedCredential || (liveSource as any)?.awardedCredential || cert;
    const defaultTrainingHighlights: TrainingHighlightItem[] = [
      { title: 'Instructor Led Training', desc: 'Expert CAD trainers with 10+ years EPC project experience.' },
      { title: 'Weekly Doubt Clearing Session', desc: 'One-on-one lab guidance for complex modeling problems.' },
      { title: 'Lifetime Assistance for Revision', desc: 'Repeat any module or tool training anytime at zero cost.' },
      { title: 'Lifetime Login to Student Dashboard', desc: '24/7 access to video recordings, project files & e-books.' },
      { title: 'World-Wide Valid Certification', desc: 'Official accredited certificate verifiable online with QR code.' },
      { title: 'Study Material, Assignments & Projects', desc: 'Real industrial CAD drawing dossiers & portfolio capstones.' },
    ];
    const defaultLabGuarantees: string[] = [
      'Dedicated NVIDIA RTX GPU Workstation',
      '1:1 Lab Seat • No Computer Sharing',
      'Lab Open 7 Days: 07:00 AM to 09:30 PM',
      'Continuous High-Speed Fiber Internet',
    ];
    const trainingHighlights = Array.isArray(course.trainingHighlights) && course.trainingHighlights.length > 0 ? course.trainingHighlights : (liveSource as any)?.trainingHighlights || defaultTrainingHighlights;
    const labGuarantees = Array.isArray(course.labGuarantees) && course.labGuarantees.length > 0 ? course.labGuarantees : (liveSource as any)?.labGuarantees || defaultLabGuarantees;
    const highlights = Array.isArray(course.highlights) && course.highlights.length > 0 ? course.highlights : (liveSource as any)?.highlights || defaultHighlights;
    const careerPathways = Array.isArray(course.careerPathways) && course.careerPathways.length > 0 ? course.careerPathways : (liveSource as any)?.careerPathways || defaultCareerPathways;
    const faqs = Array.isArray(course.faqs) && course.faqs.length > 0 ? course.faqs : (liveSource as any)?.faqs || defaultFaqs;

    setEditingCourse({
      ...course,
      image: validImage,
      labImage,
      certificateImage,
      tools: toolsList,
      software: course.software || toolsList.join(', '),
      category,
      level,
      duration,
      totalHours,
      mode: course.mode || 'Classroom & Dedicated CAD Workstation Lab',
      prerequisites: prereq,
      certification: cert,
      awardedCredential,
      tagline,
      overview,
      highlights,
      trainingHighlights,
      labGuarantees,
      careerPathways,
      faqs,
      capstoneProject: capstoneObj,
      careerRoles: careerList,
      modules: modulesList,
      syllabus: course.syllabus && course.syllabus.length > 0 ? course.syllabus : modulesList.map((m) => m.title),
    });
  };

  // Add New Course to MongoDB & live sync to website
  
  // Section action handlers for both Add Modal and Edit Modal
  const handleSectionAdd = (secCoreId: string, isEditing: boolean) => {
    // Unhide the section if it was hidden
    if (isEditing) {
      if (editingCourse?.hiddenSections?.includes(secCoreId)) {
        setEditingCourse(prev => prev ? {
          ...prev,
          hiddenSections: (prev.hiddenSections || []).filter(s => s !== secCoreId)
        } : null);
      }
    } else {
      if (newCourse.hiddenSections?.includes(secCoreId)) {
        setNewCourse(prev => ({
          ...prev,
          hiddenSections: (prev.hiddenSections || []).filter(s => s !== secCoreId)
        }));
      }
    }

    if (secCoreId === 'sec-4') {
      const newCard = {
        title: 'New Training Highlight',
        desc: 'Comprehensive practical training and mentor guidance for industry readiness.'
      };
      if (isEditing) {
        setEditingCourse(prev => prev ? {
          ...prev,
          trainingHighlights: [...(prev.trainingHighlights || []), newCard]
        } : null);
      } else {
        setNewCourse(prev => ({
          ...prev,
          trainingHighlights: [...(prev.trainingHighlights || []), newCard]
        }));
      }
    } else if (secCoreId === 'sec-5') {
      const newGuarantee = 'Dedicated 1:1 High-Performance Workstation Rig';
      if (isEditing) {
        setEditingCourse(prev => prev ? {
          ...prev,
          labGuarantees: [...(prev.labGuarantees || []), newGuarantee]
        } : null);
      } else {
        setNewCourse(prev => ({
          ...prev,
          labGuarantees: [...(prev.labGuarantees || []), newGuarantee]
        }));
      }
    } else if (secCoreId === 'sec-6') {
      if (isEditing) {
        const nextNum = String((editingCourse?.modules?.length || 0) + 1).padStart(2, '0');
        const newMod: CourseModuleItem = {
          number: nextNum,
          title: `Unit ${nextNum}: Advanced Application & Industrial Workflows`,
          hours: 20,
          topics: ['Core architectural concepts', 'Practical lab hands-on drafting', 'Industry documentation']
        };
        setEditingCourse(prev => prev ? {
          ...prev,
          modules: [...(prev.modules || []), newMod]
        } : null);
      } else {
        const nextNum = String((newCourse.modules?.length || 0) + 1).padStart(2, '0');
        const newMod: CourseModuleItem = {
          number: nextNum,
          title: `Unit ${nextNum}: Advanced Application & Industrial Workflows`,
          hours: 20,
          topics: ['Core architectural concepts', 'Practical lab hands-on drafting', 'Industry documentation']
        };
        setNewCourse(prev => ({
          ...prev,
          modules: [...(prev.modules || []), newMod]
        }));
      }
    } else if (secCoreId === 'sec-7') {
      if (isEditing) {
        const nextIdx = (editingCourse?.careerPathways?.length || 0) + 1;
        const newStep: CareerPathwayStep = {
          step: `Step 0${nextIdx}`,
          experience: '2 - 4 Years',
          role: 'Senior Project Design Specialist',
          ctc: '₹8.0 - 12.0 LPA'
        };
        setEditingCourse(prev => prev ? {
          ...prev,
          careerPathways: [...(prev.careerPathways || []), newStep]
        } : null);
      } else {
        const nextIdx = (newCourse.careerPathways?.length || 0) + 1;
        const newStep: CareerPathwayStep = {
          step: `Step 0${nextIdx}`,
          experience: '2 - 4 Years',
          role: 'Senior Project Design Specialist',
          ctc: '₹8.0 - 12.0 LPA'
        };
        setNewCourse(prev => ({
          ...prev,
          careerPathways: [...(prev.careerPathways || []), newStep]
        }));
      }
    } else if (secCoreId === 'sec-9') {
      const newDeliv = 'Comprehensive Multi-Disciplinary Drawing & BIM Coordination Dossier';
      if (isEditing) {
        setEditingCourse(prev => {
          if (!prev) return null;
          const cp = prev.capstoneProject || { title: 'Industrial Capstone Portfolio', description: '', deliverables: [] };
          return {
            ...prev,
            capstoneProject: {
              ...cp,
              deliverables: [...(cp.deliverables || []), newDeliv]
            }
          };
        });
      } else {
        setNewCourse(prev => ({
          ...prev,
          capstoneDeliverablesText: prev.capstoneDeliverablesText
            ? `${prev.capstoneDeliverablesText}, ${newDeliv}`
            : newDeliv
        }));
      }
    } else if (secCoreId === 'sec-10') {
      const newFaq: CourseFaqItem = {
        question: 'What career and placement support is provided after course completion?',
        answer: 'Students receive 100% placement support including mock technical interviews, resume preparation, and direct placement drives.'
      };
      if (isEditing) {
        setEditingCourse(prev => prev ? {
          ...prev,
          faqs: [...(prev.faqs || []), newFaq]
        } : null);
      } else {
        setNewCourse(prev => ({
          ...prev,
          faqs: [...(prev.faqs || []), newFaq]
        }));
      }
    }

    handleSectionEdit(secCoreId, isEditing);
  };

  const handleSectionEdit = (secCoreId: string, isEditing: boolean) => {
    const elId = `${isEditing ? 'edit-' : 'add-'}${secCoreId}`;
    const el = document.getElementById(elId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea, select');
      if (input) {
        setTimeout(() => input.focus(), 250);
      }
    }
  };

  const handleSectionToggleHide = (secCoreId: string, isEditing: boolean) => {
    if (isEditing) {
      setEditingCourse(prev => {
        if (!prev) return null;
        const currentHidden = prev.hiddenSections || [];
        const isHidden = currentHidden.includes(secCoreId);
        const nextHidden = isHidden
          ? currentHidden.filter(s => s !== secCoreId)
          : [...currentHidden, secCoreId];
        return { ...prev, hiddenSections: nextHidden };
      });
    } else {
      setNewCourse(prev => {
        const currentHidden = prev.hiddenSections || [];
        const isHidden = currentHidden.includes(secCoreId);
        const nextHidden = isHidden
          ? currentHidden.filter(s => s !== secCoreId)
          : [...currentHidden, secCoreId];
        return { ...prev, hiddenSections: nextHidden };
      });
    }
  };

  const handleSectionDelete = (secCoreId: string, isEditing: boolean) => {
    const secLabels: Record<string, string> = {
      'sec-1': '1. Hero & Basics',
      'sec-2': '2. Academic Facts',
      'sec-3': '3. Overview',
      'sec-4': '4. Training Highlights',
      'sec-5': '5. Lab & Guarantees',
      'sec-6': '6. Syllabus Units',
      'sec-7': '7. Career Path',
      'sec-8': '8. Certificate',
      'sec-9': '9. Capstone Project',
      'sec-10': '10. FAQs',
    };
    const label = secLabels[secCoreId] || secCoreId;
    if (!window.confirm(`Are you sure you want to delete and hide Section [${label}]? This will reset its contents and remove it from the live website.`)) {
      return;
    }

    if (isEditing) {
      setEditingCourse(prev => {
        if (!prev) return null;
        const currentHidden = prev.hiddenSections || [];
        const nextHidden = currentHidden.includes(secCoreId) ? currentHidden : [...currentHidden, secCoreId];
        const updated = { ...prev, hiddenSections: nextHidden };
        if (secCoreId === 'sec-3') updated.overview = '';
        if (secCoreId === 'sec-4') updated.trainingHighlights = [];
        if (secCoreId === 'sec-5') updated.labGuarantees = [];
        if (secCoreId === 'sec-6') { updated.modules = []; updated.syllabus = []; }
        if (secCoreId === 'sec-7') { updated.careerPathways = []; updated.careerRoles = []; }
        if (secCoreId === 'sec-8') updated.certificateImage = '';
        if (secCoreId === 'sec-9') updated.capstoneProject = { title: '', description: '', deliverables: [] };
        if (secCoreId === 'sec-10') updated.faqs = [];
        return updated;
      });
    } else {
      setNewCourse(prev => {
        const currentHidden = prev.hiddenSections || [];
        const nextHidden = currentHidden.includes(secCoreId) ? currentHidden : [...currentHidden, secCoreId];
        const updated = { ...prev, hiddenSections: nextHidden };
        if (secCoreId === 'sec-3') updated.overview = '';
        if (secCoreId === 'sec-4') updated.trainingHighlights = [];
        if (secCoreId === 'sec-5') updated.labGuarantees = [];
        if (secCoreId === 'sec-6') { updated.modules = []; updated.syllabusText = ''; }
        if (secCoreId === 'sec-7') { updated.careerPathways = []; updated.careerRolesText = ''; }
        if (secCoreId === 'sec-8') updated.certificateImage = '';
        if (secCoreId === 'sec-9') { updated.capstoneTitle = ''; updated.capstoneDescription = ''; updated.capstoneDeliverablesText = ''; }
        if (secCoreId === 'sec-10') updated.faqs = [];
        return updated;
      });
    }
  };

  const handleAddNewCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;

    const matchedFolder = foldersList.find((f) => f.id === newCourse.folder) || foldersList[0] || MAIN_FOLDERS[0];
    const tools = newCourse.software.trim()
      ? newCourse.software.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Industry Standard CAD Tools'];

    const modules: CourseModuleItem[] = newCourse.modules && newCourse.modules.length > 0
      ? newCourse.modules
      : newCourse.syllabusText
      ? newCourse.syllabusText
          .split('\n')
          .map((s, idx) => ({
            number: String(idx + 1).padStart(2, '0'),
            title: s.trim(),
            hours: 20,
            topics: [s.trim(), 'Practical lab drafting & validation'],
          }))
          .filter((m) => m.title)
      : [
          {
            number: '01',
            title: `${newCourse.title.trim()} Core Modeling`,
            hours: 20,
            topics: ['2D drafting & 3D parametric foundations', 'Practical lab drafting & validation'],
          },
        ];

    const syllabus = modules.map((m) => m.title);

    const deliverables = newCourse.capstoneDeliverablesText
      ? newCourse.capstoneDeliverablesText.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Design Drawings', '3D CAD Model', 'Project Dossier'];

    const careerRoles = newCourse.careerRolesText
      ? newCourse.careerRolesText.split(',').map((s) => s.trim()).filter(Boolean)
      : ['CAD Design Engineer', 'Product Specialist', 'Project Engineer'];

    const coursePayload: CourseItem = {
      id: `CRS-${Date.now().toString().slice(-6)}`,
      code: newCourse.code.trim() || `CAD-${Math.floor(10 + Math.random() * 89)}`,
      title: newCourse.title.trim(),
      folder: newCourse.folder,
      domain: matchedFolder.name,
      stream:
        newCourse.folder === 'mechanical' || newCourse.folder === 'piping'
          ? 'mechanical'
          : newCourse.folder === 'electrical'
          ? 'eee'
          : 'civil',
      category: newCourse.category || 'PROFESSIONAL DIPLOMA',
      level: newCourse.level || 'Professional',
      software: newCourse.software.trim() || tools.join(', '),
      tools,
      duration: newCourse.duration,
      totalHours: Number(newCourse.totalHours) || 180,
      mode: newCourse.mode,
      fee: Number(newCourse.fee) || 30000,
      price: Number(newCourse.fee) || 30000,
      image: newCourse.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      labImage: newCourse.labImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      certificateImage: newCourse.certificateImage || '',
      hiddenSections: newCourse.hiddenSections || [],
      tagline: newCourse.tagline || newCourse.overview || 'Comprehensive engineering CAD curriculum with live lab exercises.',
      overview: newCourse.overview || 'Comprehensive engineering CAD curriculum with live lab exercises.',
      prerequisites: newCourse.prerequisites || 'Diploma / B.Tech / Working Professional',
      certification: newCourse.certification || 'Autodesk & Dassault Certificate',
      awardedCredential: newCourse.awardedCredential || newCourse.certification || 'Autodesk Certified Professional: Revit Architecture & BIM Specialist',
      highlights: newCourse.highlights || [],
      trainingHighlights: newCourse.trainingHighlights || [],
      labGuarantees: newCourse.labGuarantees || [],
      careerRoles,
      careerPathways: newCourse.careerPathways || [],
      faqs: newCourse.faqs || [],
      capstoneProject: {
        title: newCourse.capstoneTitle || `${newCourse.title.trim()} Live Industry Project`,
        description: newCourse.capstoneDescription || 'Real-world industrial drafting, modeling, and validation project.',
        deliverables,
      },
      modules,
      syllabus,
      status: newCourse.status || 'Active',
      classes: [
        {
          id: `cls-${Date.now()}-1`,
          classNumber: 'Class 01',
          title: `${newCourse.title.trim()} - Fundamentals & Workspace`,
          duration: '45 mins',
          videoType: 'drive',
          videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
          description: 'Engineering standards, GUI navigation, and drafting templates setup.',
        },
      ],
    };

    setIsSavingCourse(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coursePayload),
      });
      const data = await res.json();
      if (data.success && data.course) {
        const nextList = [data.course, ...courses];
        setCourses(nextList);
        persistLiveCourses(nextList);
        setShowAddCourseModal(false);
        showToast(`Course "${coursePayload.title}" created and synced live to website.`);
        setNewCourse({
          code: '',
          title: '',
          folder: 'civil',
          domain: 'Civil & Architectural Engineering',
          category: 'PARAMETRIC BIM',
          level: 'Professional',
          software: '',
          duration: '90 Days (180 Hours)',
          totalHours: 180,
          mode: 'Classroom & Dedicated CAD Workstation Lab',
          fee: 35000,
          image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
          tagline: 'Comprehensive Industry CAD/BIM Program with 4D Scheduling & Portfolios',
          overview: 'Comprehensive industry CAD program with live labs, capstone project, and portfolio preparation.',
          prerequisites: 'Diploma / B.Tech / Working Professional',
          certification: 'Autodesk & Dassault Certificate',
          careerRolesText: 'BIM Modeler, CAD Design Engineer, Architectural Draftsman, Project Coordinator',
          capstoneTitle: 'Commercial Complex 5-Story BIM Model with Multi-Trade Clash Report',
          capstoneDescription: 'Real-world industrial drafting, modeling, and validation project with detailed bill of quantities.',
          capstoneDeliverablesText: 'Central BIM Model (.rvt), Automated Bill of Quantities, Navisworks Clash Matrix, 4D Construction Timeline Animation',
          syllabusText: 'Core BIM Concepts & Revit User Interface\nAdvanced Parametric Families & Geometry\nSchedules, Material Take-off & Documentation\nNavisworks Coordination & Clash Detection',
          modules: [
            {
              number: '01',
              title: 'Core BIM Concepts & Revit User Interface',
              hours: 20,
              topics: ['Levels, Grids & Datum Elements', 'Basic Wall Systems & Compounds', 'Doors, Windows & Floor Slabs', 'Practical lab drafting & validation'],
            },
            {
              number: '02',
              title: 'Advanced Parametric Families & Geometry',
              hours: 30,
              topics: ['Parametric Family Editor', 'Curtain Wall Grids & Custom Mullions', 'Stairs, Railings & Ramp Formations', 'Practical lab drafting & validation'],
            },
          ],
          status: 'Active',
        });
      } else {
        alert(data.message || 'Failed to create course');
      }
    } catch (err) {
      console.error('Create course error:', err);
      alert('Server connection error while saving course.');
    } finally {
      setIsSavingCourse(false);
    }
  };

  // Edit Existing Course Submit
  const handleEditCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setIsSavingCourse(true);
    try {
      const matchedFolder = foldersList.find((f) => f.id === editingCourse.folder) || foldersList[0] || MAIN_FOLDERS[0];
      const tools = editingCourse.software
        ? editingCourse.software.split(',').map((s) => s.trim()).filter(Boolean)
        : editingCourse.tools || ['CAD Tools'];

      const modules = editingCourse.modules && editingCourse.modules.length > 0
        ? editingCourse.modules
        : (editingCourse.syllabus || []).map((s, idx) => ({
            number: String(idx + 1).padStart(2, '0'),
            title: s,
            hours: 20,
            topics: [s, 'Practical lab drafting & validation'],
          }));

      const syllabus = modules.map((m) => m.title);

      const updatedPayload: CourseItem = {
        hiddenSections: editingCourse.hiddenSections || [],
        ...editingCourse,
        domain: matchedFolder.name,
        stream:
          editingCourse.folder === 'mechanical' || editingCourse.folder === 'piping'
            ? 'mechanical'
            : editingCourse.folder === 'electrical'
            ? 'eee'
            : 'civil',
        tools,
        trainingHighlights: editingCourse.trainingHighlights || [],
        labGuarantees: editingCourse.labGuarantees || [],
        modules,
        syllabus,
        fee: Number(editingCourse.fee) || 30000,
        price: Number(editingCourse.fee) || 30000,
        totalHours: Number(editingCourse.totalHours) || 180,
      };

      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });
      const data = await res.json();
      if (data.success && data.course) {
        const nextList = courses.map((c) => (c.id === updatedPayload.id ? data.course : c));
        setCourses(nextList);
        persistLiveCourses(nextList);
        setEditingCourse(null);
        showToast(`Course "${updatedPayload.title}" updated and synced live to website.`);
      } else {
        alert(data.message || 'Failed to update course.');
      }
    } catch (err) {
      console.error('Update course error:', err);
      alert('Server connection error while updating course.');
    } finally {
      setIsSavingCourse(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (course: CourseItem) => {
    if (!confirm(`Are you sure you want to permanently delete "${course.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/courses?id=${course.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        const nextList = courses.filter((c) => c.id !== course.id);
        setCourses(nextList);
        persistLiveCourses(nextList);
        showToast(`Course "${course.title}" deleted.`);
      } else {
        alert(data.message || 'Failed to delete course.');
      }
    } catch (err) {
      console.error('Delete course error:', err);
      alert('Server error while deleting course.');
    }
  };

  // Move Course to Another Folder
  const handleConfirmMoveCourse = async () => {
    if (!movingCourse) return;
    const targetFolder = foldersList.find((f) => f.id === targetMoveFolder) || MAIN_FOLDERS.find((f) => f.id === targetMoveFolder);
    if (!targetFolder) return;

    setIsMovingCourse(true);
    try {
      const updatedCourse: CourseItem = {
        ...movingCourse,
        folder: targetFolder.id as any,
        domain: targetFolder.name,
        stream:
          targetFolder.id === 'mechanical' || targetFolder.id === 'piping'
            ? 'mechanical'
            : targetFolder.id === 'electrical'
            ? 'eee'
            : 'civil',
      };

      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });
      const data = await res.json();
      if (data.success && data.course) {
        const nextList = courses.map((c) => (c.id === updatedCourse.id ? data.course : c));
        setCourses(nextList);
        persistLiveCourses(nextList);
        showToast(`Moved "${movingCourse.title}" to ${targetFolder.shortName} folder.`);
        setMovingCourse(null);
      } else {
        alert(data.message || 'Failed to move course');
      }
    } catch (err) {
      console.error('Move course error:', err);
      alert('Failed to connect to server to move course.');
    } finally {
      setIsMovingCourse(false);
    }
  };

  // Class Manager Handlers
  const handleOpenClassesManager = (course: CourseItem) => {
    setManagingClassesCourse(course);
    const existing = course.classes || [];
    setCurrentClasses(existing);
    setTestingVideoClass(existing.length > 0 ? existing[0] : null);
    setEditingClassIndex(null);
    setNewClassForm({
      id: '',
      classNumber: `Class 0${existing.length + 1}`,
      title: '',
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: '',
      description: '',
      pdfUrl: '',
      pdfName: '',
      pdfSize: '',
    });
  };

  const handleAddOrUpdateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.title.trim()) {
      alert('Please provide a class title / topic.');
      return;
    }
    if (!newClassForm.videoUrl.trim() && !newClassForm.pdfUrl.trim()) {
      alert('Please provide either a video link/file in the Class section or attach PDF notes in the Notes section.');
      return;
    }

    const trimmedUrl = newClassForm.videoUrl.trim();
    const isDrive = newClassForm.videoType === 'drive' || trimmedUrl.includes('drive.google.com');
    const isYouTube = trimmedUrl.includes('youtube.com') || trimmedUrl.includes('youtu.be');

    let formattedUrl = trimmedUrl;
    if (trimmedUrl) {
      if (isDrive) {
        formattedUrl = formatGoogleDriveUrl(trimmedUrl);
      } else if (isYouTube) {
        formattedUrl = formatYouTubeEmbedUrl(trimmedUrl);
      }
    }

    const classItem: CourseClass = {
      id: newClassForm.id || `cls-${Date.now()}`,
      classNumber: newClassForm.classNumber.trim() || `Class 0${currentClasses.length + 1}`,
      title: newClassForm.title.trim(),
      duration: newClassForm.duration.trim() || '45 mins',
      videoType: isDrive ? 'drive' : (newClassForm.videoType || 'file'),
      videoUrl: formattedUrl,
      description: newClassForm.description.trim(),
      pdfUrl: newClassForm.pdfUrl.trim(),
      pdfName: newClassForm.pdfName.trim() || (newClassForm.pdfUrl ? `${newClassForm.classNumber || 'Class'}-Study-Notes.pdf` : ''),
      pdfSize: newClassForm.pdfSize.trim() || (newClassForm.pdfUrl ? 'PDF Document' : ''),
    };

    let updated: CourseClass[];
    if (editingClassIndex !== null && editingClassIndex >= 0) {
      updated = [...currentClasses];
      updated[editingClassIndex] = classItem;
    } else {
      updated = [...currentClasses, classItem];
    }

    setCurrentClasses(updated);
    setTestingVideoClass(classItem);
    setEditingClassIndex(null);
    setNewClassForm({
      id: '',
      classNumber: `Class 0${updated.length + 1}`,
      title: '',
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: '',
      description: '',
      pdfUrl: '',
      pdfName: '',
      pdfSize: '',
    });
    showToast(`Class staged. Click "SAVE & SYNC TO DATABASE" to finalize.`);
  };

  const handleDeleteClass = (idx: number) => {
    const updated = currentClasses.filter((_, i) => i !== idx);
    setCurrentClasses(updated);
    if (testingVideoClass && !updated.some((c) => c.id === testingVideoClass.id)) {
      setTestingVideoClass(updated.length > 0 ? updated[0] : null);
    }
    showToast('Class removed. Remember to click "SAVE & SYNC TO DATABASE".');
  };

  const handleSaveAllClassesToDb = async () => {
    if (!managingClassesCourse) return;
    setIsSavingClasses(true);
    try {
      const updatedPayload: CourseItem = {
        ...managingClassesCourse,
        classes: currentClasses,
      };

      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });
      const data = await res.json();
      if (data.success && data.course) {
        setCourses((prev) => prev.map((c) => (c.id === updatedPayload.id ? data.course : c)));
        setManagingClassesCourse(data.course);
        showToast(`Successfully saved ${currentClasses.length} class(es) for "${managingClassesCourse.title}".`);
      } else {
        alert(data.message || 'Failed to save classes.');
      }
    } catch (err) {
      console.error('Save classes error:', err);
      alert('Server connection error while saving classes.');
    } finally {
      setIsSavingClasses(false);
    }
  };

  // Format bytes for display
  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Upload PDF Notes for a class
  const handlePdfUpload = async (file: File) => {
    setIsUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNewClassForm((prev) => ({
          ...prev,
          pdfUrl: data.url,
          pdfName: file.name,
          pdfSize: formatFileSize(file.size),
        }));
        showToast(`PDF Notes "${file.name}" uploaded successfully!`);
      } else {
        alert(data.message || 'PDF upload failed.');
      }
    } catch (err) {
      console.error('PDF upload error:', err);
      alert('Network error while uploading PDF notes.');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Upload Media (Images & Videos)
  const handleFileUpload = async (file: File, target: 'courseImage' | 'labImage' | 'certificateImage' | 'classVideo') => {
    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (target === 'courseImage') {
          if (editingCourse) {
            setEditingCourse({ ...editingCourse, image: data.url });
          } else {
            setNewCourse((prev) => ({ ...prev, image: data.url }));
          }
          showToast('Course banner image uploaded successfully.');
        } else if (target === 'labImage') {
          if (editingCourse) {
            setEditingCourse({ ...editingCourse, labImage: data.url });
          } else {
            setNewCourse((prev) => ({ ...prev, labImage: data.url }));
          }
          showToast('Workstation lab image uploaded successfully.');
        } else if (target === 'certificateImage') {
          if (editingCourse) {
            setEditingCourse({ ...editingCourse, certificateImage: data.url });
          } else {
            setNewCourse((prev) => ({ ...prev, certificateImage: data.url }));
          }
          showToast('Certificate specimen image uploaded successfully.');
        } else if (target === 'classVideo') {
          setNewClassForm((prev) => ({
            ...prev,
            videoType: 'file',
            videoUrl: data.url,
          }));
          showToast('Video uploaded successfully.');
        }
      } else {
        alert(data.message || 'File upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Network error while uploading file.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // Auto-generate serial certificate ID
  const generateSerialCertId = () => {
    const id = `RND-AUTODESK-${Math.floor(100000 + Math.random() * 900000)}`;
    setCertCustomId(id);
    return id;
  };

  // Upload student certificate file (PDF, PNG, JPG)
  const handleCertFileUpload = async (file: File) => {
    setIsUploadingCertFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setCertFileUrl(data.url);
        setCertFileName(file.name);
        setCertFileSize(formatFileSize(file.size));
        showToast(`Certificate "${file.name}" uploaded successfully!`);
      } else {
        alert(data.message || 'Certificate upload failed.');
      }
    } catch (err) {
      console.error('Certificate upload error:', err);
      alert('Network error while uploading certificate.');
    } finally {
      setIsUploadingCertFile(false);
    }
  };

  // Direct 1-Click Upload Certificate PDF for a student
  const handleDirectUploadForStudent = async (
    student: { id: string; studentId: string; name: string; email?: string; course?: string },
    file: File
  ) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please select an official PDF certificate document (.pdf).');
      return;
    }

    const targetKey = student.studentId || student.id;
    setUploadingCertStudentId(targetKey);
    try {
      let fileUrl = '';
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          fileUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn('API upload fallback to data URL:', uploadErr);
      }

      // If API upload didn't return url, fallback to FileReader
      if (!fileUrl) {
        fileUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.readAsDataURL(file);
        });
      }

      const certId = `RND-AUTODESK-${Math.floor(100000 + Math.random() * 900000)}`;
      const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      const payload = {
        studentId: student.studentId || student.id,
        studentName: student.name,
        studentEmail: student.email || '',
        course: student.course || 'Civil CADD & Master BIM',
        track: student.course || 'Autodesk Revit & Civil BIM Specialist',
        grade: 'Grade A+ (Distinction)',
        certId,
        issueDate,
        fileUrl,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: 'pdf',
        notes: `Official certificate PDF uploaded directly for ${student.name}.`,
      };

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.certificate) {
        setCertificates((prev) => [
          data.certificate,
          ...prev.filter(
            (c) =>
              c.studentId !== (student.studentId || student.id) &&
              (!student.email || c.studentEmail.toLowerCase() !== student.email.toLowerCase())
          ),
        ]);
        showToast(`Official Certificate PDF uploaded & sent directly to ${student.name}!`);
      } else {
        alert(data.message || 'Failed to save certificate.');
      }
    } catch (err) {
      console.error('Direct certificate upload error:', err);
      alert('Error uploading certificate PDF.');
    } finally {
      setUploadingCertStudentId(null);
    }
  };

  // Unified student rows for Certificate Management (Student list + certificates synced)
  const certStudentRows = useMemo(() => {
    const list: Array<{
      id: string;
      studentId: string;
      name: string;
      email: string;
      course: string;
      certificate?: StudentCertificate;
    }> = [];

    students.forEach((s) => {
      const sId = (s.studentId || s.id || '').toLowerCase();
      const sEmail = (s.email || '').toLowerCase();

      const matchingCert = certificates.find(
        (c) =>
          (c.studentId && c.studentId.toLowerCase() === sId) ||
          (c.studentEmail && sEmail && c.studentEmail.toLowerCase() === sEmail)
      );

      list.push({
        id: s.id,
        studentId: s.studentId || s.id,
        name: s.name,
        email: s.email || '',
        course: s.courseName || (s.assignedCourses && s.assignedCourses[0]) || 'Civil CADD & Master BIM',
        certificate: matchingCert,
      });
    });

    // Also include any certificates issued to students not in the students array
    certificates.forEach((c) => {
      const cId = (c.studentId || '').toLowerCase();
      const cEmail = (c.studentEmail || '').toLowerCase();
      const alreadyPresent = list.some(
        (item) =>
          (cId && item.studentId.toLowerCase() === cId) ||
          (cEmail && item.email.toLowerCase() === cEmail && item.name.toLowerCase() === c.studentName.toLowerCase())
      );

      if (!alreadyPresent) {
        list.push({
          id: c.id,
          studentId: c.studentId,
          name: c.studentName,
          email: c.studentEmail,
          course: c.course || c.track || 'CAD Specialist',
          certificate: c,
        });
      }
    });

    return list;
  }, [students, certificates]);

  // Issue & Upload Certificate to Student (Persists to MongoDB & reflects in real-time)
  const handleIssueAndSaveCertificate = async () => {
    const selected = students.find((s) => s.id === certStudentId) || students[0];
    if (!selected) {
      alert('No student selected. Please admit a student first.');
      return;
    }

    if (!certFileUrl.trim()) {
      alert('Please upload a student certificate PDF file first, or paste a valid direct PDF URL.');
      return;
    }

    setIsSubmittingCert(true);
    try {
      const finalCertId = certCustomId.trim() || `RND-AUTODESK-${Math.floor(100000 + Math.random() * 900000)}`;
      const finalIssueDate = certIssueDate.trim() || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      const payload = {
        studentId: selected.studentId || selected.id,
        studentName: selected.name,
        studentEmail: selected.email || '',
        course: certCourse,
        track: certCourse,
        grade: certGrade,
        certId: finalCertId,
        issueDate: finalIssueDate,
        fileUrl: certFileUrl.trim(),
        fileName: certFileName.trim() || `${selected.name.replace(/\s+/g, '_')}_Certificate.pdf`,
        fileSize: certFileSize.trim() || 'PDF Document',
        fileType: 'pdf',
        notes: certNotes.trim(),
      };

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.certificate) {
        setCertificates((prev) => [data.certificate, ...prev.filter((c) => c.id !== data.certificate.id && c.certId !== data.certificate.certId)]);
        setIssuedCert(data.certificate);
        showToast(`Official Certificate PDF uploaded & synced for ${selected.name}!`);
        // Reset file inputs but leave course/student selected
        setCertFileUrl('');
        setCertFileName('');
        setCertFileSize('');
        setCertNotes('');
        setCertCustomId('');
      } else {
        alert(data.message || 'Failed to issue certificate.');
      }
    } catch (err) {
      console.error('Issue certificate error:', err);
      alert('Server error while saving certificate.');
    } finally {
      setIsSubmittingCert(false);
    }
  };

  // Revoke / Delete Certificate
  const handleDeleteCertificate = async (cert: StudentCertificate) => {
    if (!confirm(`Are you sure you want to revoke and delete Certificate ${cert.certId} issued to ${cert.studentName}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/certificates?id=${cert.id || cert.certId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setCertificates((prev) => prev.filter((c) => c.id !== cert.id && c.certId !== cert.certId));
        if (issuedCert && (issuedCert.id === cert.id || issuedCert.certId === cert.certId)) {
          setIssuedCert(null);
        }
        showToast(`Certificate ${cert.certId} revoked.`);
      } else {
        alert(data.message || 'Failed to revoke certificate.');
      }
    } catch (err) {
      console.error('Delete certificate error:', err);
      alert('Network error while revoking certificate.');
    }
  };

  // Backward compatibility local generator preview
  const handleGenerateCertificate = () => {
    handleIssueAndSaveCertificate();
  };

  // Upload E-Book PDF File
  const handleEbookPdfUpload = async (file: File) => {
    setIsUploadingEbookPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNewEbookFileUrl(data.url);
        setNewEbookFileName(file.name);
        setNewEbookFileSize(formatFileSize(file.size));
        if (!newEbookTitle.trim()) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setNewEbookTitle(autoTitle);
        }
        showToast(`E-Book PDF "${file.name}" uploaded successfully!`);
      } else {
        alert(data.message || 'E-Book upload failed.');
      }
    } catch (err) {
      console.error('E-Book upload error:', err);
      alert('Network error while uploading E-Book PDF.');
    } finally {
      setIsUploadingEbookPdf(false);
    }
  };

  // Publish & Save New E-Book to MongoDB & reflect to students
  const handlePublishEbook = async () => {
    if (!newEbookTitle.trim()) {
      alert('Please enter an E-Book Title.');
      return;
    }
    if (!newEbookFileUrl.trim()) {
      alert('Please upload a PDF file or provide a PDF URL.');
      return;
    }

    setIsSubmittingEbook(true);
    try {
      const allowedEmails = students
        .filter((s) => newEbookAllowedStudents.includes(s.id) || newEbookAllowedStudents.includes(s.studentId))
        .map((s) => s.email)
        .filter(Boolean);

      const payload = {
        title: newEbookTitle.trim(),
        course: newEbookCourse,
        pdfUrl: newEbookFileUrl.trim(),
        pdfName: newEbookFileName.trim() || `${newEbookTitle.trim()}.pdf`,
        pdfSize: newEbookFileSize.trim() || 'Document',
        pages: newEbookPages.trim() || '150 Pages',
        description: newEbookDesc.trim() || 'Comprehensive CAD Reference Manual & Technical Specification Guide.',
        accessType: newEbookAccessType,
        targetAudience: 'all',
        targetCourse: newEbookTargetAudience === 'course' ? newEbookTargetCourse : newEbookCourse,
        allowedStudentIds: newEbookTargetAudience === 'particular' ? newEbookAllowedStudents : [],
        allowedEmails: newEbookTargetAudience === 'particular' ? allowedEmails : [],
      };

      const res = await fetch('/api/ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.ebook) {
        setEbooks((prev) => [data.ebook, ...prev.filter((b) => b.id !== data.ebook.id)]);
        showToast(`E-Book "${data.ebook.title}" published & synced to students!`);
        // Reset form
        setNewEbookTitle('');
        setNewEbookFileUrl('');
        setNewEbookFileName('');
        setNewEbookFileSize('');
        setNewEbookDesc('');
        setNewEbookPages('300 Pages');
        setNewEbookAllowedStudents([]);
      } else {
        alert(data.message || 'Failed to publish E-Book.');
      }
    } catch (err) {
      console.error('Publish ebook error:', err);
      alert('Server error while saving E-Book.');
    } finally {
      setIsSubmittingEbook(false);
    }
  };

  // Toggle Free vs. Locked Access for E-Book
  const handleToggleEbookAccess = async (ebook: EbookItem) => {
    const newAccess = ebook.accessType === 'free' ? 'locked' : 'free';
    try {
      const res = await fetch('/api/ebooks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ebook.id, accessType: newAccess }),
      });
      const data = await res.json();
      if (data.success) {
        setEbooks((prev) =>
          prev.map((b) => (b.id === ebook.id ? { ...b, accessType: newAccess } : b))
        );
        showToast(`E-Book access changed to: ${newAccess === 'free' ? 'FREE ACCESS' : 'LOCKED'}`);
      } else {
        alert(data.message || 'Failed to update access status.');
      }
    } catch (err) {
      console.error('Toggle access error:', err);
      alert('Network error updating E-Book access.');
    }
  };

  // Delete E-Book
  const handleDeleteEbook = async (ebook: EbookItem) => {
    if (!confirm(`Are you sure you want to permanently remove "${ebook.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/ebooks?id=${ebook.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setEbooks((prev) => prev.filter((b) => b.id !== ebook.id));
        showToast(`E-Book "${ebook.title}" deleted.`);
      } else {
        alert(data.message || 'Failed to delete E-Book.');
      }
    } catch (err) {
      console.error('Delete ebook error:', err);
      alert('Server error while deleting E-Book.');
    }
  };

  // Navigation Items - Clean 9 Core Management Modules with Dedicated Professional Icons
  const adminNavItems = [
    {
      id: 'Student',
      label: 'Student',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      id: 'Courses',
      label: 'Courses',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-5.25 6.557q0 .408.06.812m5.19-7.369a55.378 55.378 0 015.25 2.882V15a.75.75 0 110 1.5.75.75 0 010-1.5z" />
        </svg>
      ),
    },
    {
      id: 'Certificate',
      label: 'Certificate',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    
    {
      id: 'Ebook',
      label: 'Ebook',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      id: 'Jobs',
      label: 'Jobs',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
    },
    {
      id: 'Offers',
      label: 'Offers & Discounts',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
    },
    {
      id: 'Live',
      label: 'Live Classes',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
    },
    {
      id: 'Support',
      label: 'Support',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      id: 'Assignments',
      label: 'Assignments',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-10.5-9h10.5m-10.5 3h10.5m-10.5 3h6.75" />
        </svg>
      ),
    },
    {
      id: 'Reviews',
      label: 'Course Ratings',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      id: 'CMS',
      label: 'Website CMS',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
      ),
    },
  ];

  // Filter students dynamically
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.mobile.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.accessStatus === 'active') ||
      (statusFilter === 'revoked' && s.accessStatus === 'revoked');

    return matchesSearch && matchesStatus;
  });

  // Calculate dynamic stats from REAL students (zero dummy numbers)
  const totalStudentsCount = students.length;
  const activeStudentsCount = students.filter((s) => s.accessStatus === 'active').length;
  const revokedStudentsCount = students.filter((s) => s.accessStatus === 'revoked').length;
  const totalFeesCollected = students.reduce((acc, s) => acc + (s.paidFee || 0), 0);
  const totalPendingFees = students.reduce((acc, s) => acc + (s.balanceFee || 0), 0);

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
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#131313] text-[#FFFFFF] px-5 py-3 rounded-xl shadow-2xl border-2 border-[#EE2C3C] flex items-center space-x-3 transition-all">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* MOBILE STICKY TOP BAR (< md) */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b-2 border-[#E2E8F0] px-3.5 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="RND CADD" className="h-8 w-auto object-contain" />
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EE2C3C] text-white tracking-wider uppercase">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-2.5 py-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Site
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center border border-slate-200 cursor-pointer"
            aria-label="Toggle Admin Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE HORIZONTAL SWIPEABLE TAB PILLS (< md) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto py-2 px-3 bg-white border-b border-slate-200 no-scrollbar whitespace-nowrap scrollbar-none z-30">
        {adminNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#131313] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MOBILE DRAWER (< md) */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full z-10 flex flex-col justify-between p-5 overflow-y-auto safe-pb shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="RND CADD" className="h-9 w-auto object-contain" />
                  <div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight">ADMIN CONTROL</h3>
                    <span className="text-[10px] text-slate-500 font-medium">Ameerpet Campus</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>

              {/* Admin Info */}
              <div className="p-3 my-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-extrabold text-slate-900">{adminUser.name}</h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{adminUser.email}</p>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mt-1">
                  Executive Admin
                </span>
              </div>

              {/* Nav links */}
              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-[#131313] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      {isActive && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6 space-y-2">
              <Link
                href="/"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 block text-center hover:bg-slate-50"
              >
                Back to Main Website
              </Link>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#EE2C3C] hover:bg-[#D71E2E] block text-center"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR - FIXED & IMMOBILE (Pointers locked to viewport, does not move when scrolling) */}
      <aside className="hidden md:flex w-full md:w-80 md:fixed md:top-0 md:left-0 md:bottom-0 md:h-screen bg-[#FFFFFF] border-r-2 border-[#E2E8F0] flex-col justify-between shadow-md z-30 flex-shrink-0">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Top Logo Container */}
          <div className="p-4 sm:p-5 border-b-2 border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-between flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="RND CADD"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#EE2C3C] text-white tracking-wider uppercase shadow-2xs">ADMIN</span>
          </div>

          {/* Admin Identity */}
          <div className="px-5 py-3 border-b-2 border-[#E2E8F0] bg-[#F8FAFC] flex-shrink-0">
            <h2 className="text-lg font-black text-[#131313] truncate">{adminUser.name}</h2>
            <span className="text-sm font-semibold text-[#64748B] block truncate mt-0.5">{adminUser.email}</span>
            <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-md bg-[#F1F5F9] border border-[#CBD5E1] text-sm font-semibold font-bold text-[#131313]">
              Ameerpet Main Campus
            </div>
          </div>

          {/* Sidebar Navigation Items - Perfectly proportioned, clean layout */}
          <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
            {adminNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#131313] text-[#FFFFFF] shadow-sm'
                      : 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]'
                          : 'bg-[#F1F5F9] text-[#334155]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.id === 'Student' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#DCFCE7] text-[#166534]'
                    }`}>
                      {students.length}
                    </span>
                  )}
                  {item.id === 'Courses' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#E0E7FF] text-[#1E1B4B]'
                    }`}>
                      {courses.length}
                    </span>
                  )}
                  {item.id === 'Certificate' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}>
                      {certificates.length}
                    </span>
                  )}
                  {item.id === 'Ebook' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FEE2E2] text-[#991B1B]'
                    }`}>
                      {ebooks.length}
                    </span>
                  )}
                  {item.id === 'Jobs' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#E0E7FF] text-[#3730A3]'
                    }`}>
                      {adminJobs.filter((j) => j.status === 'Active').length}
                    </span>
                  )}
                  {item.id === 'Support' && adminTickets.filter((t) => t.status !== 'Resolved').length > 0 && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FEF3C7] text-[#B45309]'
                    }`}>
                      {adminTickets.filter((t) => t.status !== 'Resolved').length}
                    </span>
                  )}
                  {item.id === 'Assignments' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#DCFCE7] text-[#166534]'
                    }`}>
                      {adminAssignments.length}
                    </span>
                  )}
                                    {item.id === 'Offers' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}>
                      {adminOffers.filter((o) => o.status === 'Active').length}
                    </span>
                  )}
                  {item.id === 'Live' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-bold ${
                      liveSession?.status === 'Live Now'
                        ? 'bg-emerald-500 text-white animate-pulse'
                        : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {liveSession?.status === 'Live Now' ? 'LIVE' : (liveSession?.status === 'Scheduled' ? 'SOON' : '0')}
                    </span>
                  )}
                  {item.id === 'Reviews' && (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-black ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}>
                      {adminReviews.length}
                    </span>
                  )}
                  {item.id === 'CMS' && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black tracking-wider uppercase ${
                      isActive ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]' : 'bg-[#EE2C3C] text-white'
                    }`}>
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Professional Sign Out Button */}
        <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm sm:text-base font-semibold text-[#2B2B2B] bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 shadow-2xs transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA - SCROLLS INDEPENDENTLY */}
      <main className="flex-1 md:ml-80 flex flex-col min-h-0 md:h-screen overflow-y-auto">
        {/* Top Header Bar - Clean & Professional */}
        {activeTab !== 'Courses' && activeTab !== 'CMS' && (
          <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-medium text-[#666666] mb-1">
                <span>Admin Console</span>
                <span>/</span>
                <span className="text-[#131313] font-semibold">{activeTab}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                {activeTab === 'CMS' ? 'Website CMS & Live Editor' : `${activeTab} Management`}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {activeTab === 'Offers' && (
                <button
                  onClick={() => {
                    setEditingOfferId(null);
                    setOfferFormType('course_discount');
                    setOfferFormTitle('');
                    setOfferFormCode('CAD' + Math.floor(1000 + Math.random() * 9000));
                    setOfferFormCourse('All Engineering Courses');
                    setOfferFormDiscountType('percentage');
                    setOfferFormDiscountValue(20);
                    setOfferFormReferrerReward('Rs 1,500 Voucher');
                    setOfferFormRefereeReward('20% Fee Waiver');
                    setOfferFormExpiry('2026-12-31');
                    setOfferFormDescription('');
                    setShowOfferModal(true);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>+</span>
                  <span>Create New Offer / Referral</span>
                </button>
              )}
              {activeTab === 'Live' && (
                <button
                  onClick={() => {
                    setEditingLiveId(null);
                    setLiveFormTitle('');
                    setLiveFormTrainer('Er. Swamy Naidu');
                    setLiveFormCourse('Civil CADD & Master BIM');
                    setLiveFormUrl('https://meet.google.com/new');
                    setLiveFormPlatform('Virtual CAD Workstation');
                    setLiveFormTiming('Live Broadcast Active (Lab Session)');
                    setLiveFormDescription('');
                    setShowLiveModal(true);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>+</span>
                  <span>Broadcast / Schedule Live Class</span>
                </button>
              )}
              {activeTab === 'Student' && (
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm transition-all cursor-pointer"
                >
                  + New Admission
                </button>
              )}
              {activeTab === 'Assignments' && (
                <button
                  onClick={() => {
                    setNewAssignmentCourse(courses[0]?.title || 'Civil CADD & Master BIM');
                    setShowAddAssignmentModal(true);
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm transition-all cursor-pointer"
                >
                  Upload Assignment
                </button>
              )}
              <Link
                href="/"
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#2B2B2B] border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Main Site &rarr;
              </Link>
            </div>
          </header>
        )}

        {/* Dynamic Body Content */}
        <div className="p-3.5 sm:p-8 flex-1 space-y-5 sm:space-y-6">

          {/* TAB 1: STUDENT (Clean Enterprise Data Table, Stats & Pleasant Buttons) */}
          {activeTab === 'Student' && (
            <div className="space-y-6">
              {/* Dynamic Live Statistics Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Total Students
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#131313] block mt-1">
                    {totalStudentsCount}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Registered Trainees
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Active Access
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 block mt-1">
                    {activeStudentsCount}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Live Workstations
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Revoked Access
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-rose-600 block mt-1">
                    {revokedStudentsCount}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Access Suspended
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Fees Collected
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#131313] block mt-1">
                    Rs {totalFeesCollected.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Verified Invoices
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Balance Due
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 block mt-1">
                    Rs {totalPendingFees.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Pending Dues
                  </span>
                </div>
              </div>

              {/* Student Registry Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Search & Filter Controls Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#131313]">
                      Student Directory ({students.length})
                    </h3>
                    
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search box */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student, ID, course..."
                      className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-slate-500 text-[#131313]"
                    />

                    {/* Filter buttons */}
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs sm:text-sm font-medium">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                          statusFilter === 'all'
                            ? 'bg-[#131313] text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        All ({students.length})
                      </button>
                      <button
                        onClick={() => setStatusFilter('active')}
                        className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                          statusFilter === 'active'
                            ? 'bg-[#131313] text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Active ({activeStudentsCount})
                      </button>
                      <button
                        onClick={() => setStatusFilter('revoked')}
                        className={`px-3.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                          statusFilter === 'revoked'
                            ? 'bg-[#131313] text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Revoked ({revokedStudentsCount})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 text-[#2B2B2B] font-bold uppercase text-xs sm:text-sm tracking-wider border-b border-slate-200">
                        <th className="py-3.5 px-5">Student</th>
                        <th className="py-3.5 px-5">Phone Number</th>
                        <th className="py-3.5 px-5">Assigned Courses</th>
                        <th className="py-3.5 px-5">College &amp; Education</th>
                        <th className="py-3.5 px-5">Fees Details</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isLoadingStudents ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-sm sm:text-base font-medium text-[#666666]">
                            Loading students from database...
                          </td>
                        </tr>
                      ) : filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            <div className="text-base sm:text-lg font-semibold text-[#131313]">No students registered yet.</div>
                            <p className="text-sm text-[#666666] mt-1">
                              Click &quot;+ New Admission&quot; above to enroll a student, or have trainees register via the portal.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((stu) => {
                          const isActive = stu.accessStatus === 'active';
                          const sId = (stu.studentId || stu.id || '').toLowerCase();
                          const sEmail = (stu.email || '').toLowerCase();
                          const hasCert = certificates.some(
                            (c) =>
                              (c.studentId && c.studentId.toLowerCase() === sId) ||
                              (c.studentEmail && sEmail && c.studentEmail.toLowerCase() === sEmail)
                          );

                          return (
                            <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Student Name & ID */}
                              <td className="py-4 px-5">
                                <div className="font-bold text-[#131313] text-base sm:text-lg">{stu.name}</div>
                                <div className="text-xs sm:text-sm font-mono text-[#666666] mt-0.5 font-medium">
                                  {stu.studentId} &bull; Adm: {stu.admissionDate}
                                </div>
                                <div className="text-xs sm:text-sm text-[#666666] mt-0.5">
                                  {stu.email}
                                </div>
                              </td>

                              {/* Phone Number (Fetched from Signup / Profile) */}
                              <td className="py-4 px-5 whitespace-nowrap">
                                <div className="font-mono text-sm sm:text-base font-bold text-slate-800">
                                  {stu.officialMobile && stu.officialMobile !== '-'
                                    ? stu.officialMobile
                                    : (stu.mobile && stu.mobile !== '-' ? stu.mobile : '-')}
                                </div>
                                <span className="text-xs text-slate-400 block mt-0.5 font-medium">
                                  Official Contact
                                </span>
                              </td>

                              {/* Assigned Courses */}
                              <td className="py-4 px-5 max-w-xs">
                                <div className="flex flex-wrap gap-1.5">
                                  {(stu.assignedCourses && stu.assignedCourses.length > 0
                                    ? stu.assignedCourses
                                    : [stu.courseName]
                                  ).map((course, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block px-3 py-1 rounded-md text-xs sm:text-sm font-semibold bg-slate-100 text-[#131313] border border-slate-200"
                                    >
                                      {course}
                                    </span>
                                  ))}
                                </div>
                              </td>

                              {/* College & Education */}
                              <td className="py-4 px-5">
                                <div className="text-[#131313] text-sm sm:text-base font-semibold">
                                  {stu.college && stu.college !== '-' ? stu.college : 'Engineering College'}
                                </div>
                                <div className="text-[#666666] text-xs sm:text-sm mt-0.5">
                                  {stu.qualification && stu.qualification !== '-' ? stu.qualification : 'CAD Trainee'} &bull; {stu.residence && stu.residence !== '-' ? stu.residence : 'Hyderabad'}
                                </div>
                              </td>

                              {/* Fees */}
                              <td className="py-4 px-5">
                                <div className="font-bold text-[#131313] text-sm sm:text-base">
                                  Paid: Rs {stu.paidFee.toLocaleString()}
                                </div>
                                {stu.balanceFee > 0 ? (
                                  <div className="text-xs sm:text-sm text-amber-600 font-semibold mt-0.5">
                                    Due: Rs {stu.balanceFee.toLocaleString()}
                                  </div>
                                ) : (
                                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                                    Paid in Full
                                  </span>
                                )}
                              </td>

                              {/* Pleasant Actions (Edit Course on right, Certificate auto-hides when uploaded, Designs removed) */}
                              <td className="py-4 px-5 text-right whitespace-nowrap space-x-2">
                                {/* Edit Course Button at the right side */}
                                <button
                                  onClick={() => handleOpenAssignModal(stu)}
                                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#2B2B2B] border border-slate-300 rounded-lg bg-white hover:bg-slate-50 hover:text-[#131313] transition-colors shadow-2xs cursor-pointer"
                                >
                                  Edit Course
                                </button>

                                {/* Certificate Button: HIDES AUTOMATICALLY IF CERTIFICATE IS UPLOADED */}
                                {!hasCert && (
                                  <button
                                    onClick={() => {
                                      setCertStudentId(stu.id);
                                      setActiveTab('Certificate');
                                    }}
                                    className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#2B2B2B] border border-slate-300 rounded-lg bg-white hover:bg-slate-50 hover:text-[#131313] transition-colors shadow-2xs cursor-pointer"
                                  >
                                    Certificate
                                  </button>
                                )}

                                {/* Delete Action */}
                                <button
                                  onClick={() => handleDeleteStudent(stu)}
                                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-rose-600 border border-transparent hover:border-rose-200 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES (6 Main Folders Cards View -> Click to Drill-down to Courses) */}
          {activeTab === 'Courses' && (
            <div className="space-y-6">
              {/* LEVEL 1: FOLDER CARDS DIRECTORY VIEW (When currentFolderView is null) */}
              {currentFolderView === null ? (
                <div className="space-y-6">
                  {/* Directory Header with Quick Actions */}
                  <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border-2 border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#131313]">Courses &amp; Curriculum</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setCurrentFolderView('all');
                          setCourseSearchQuery('');
                        }}
                        className="px-4 py-2.5 rounded-xl border-2 border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#131313] text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center space-x-2"
                      >
                        
                        <span>VIEW ALL ({courses.length}) COURSES</span>
                      </button>
                      <button
                        onClick={() => setShowAddFolderModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-[#FFFFFF] text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <span>+ CREATE FOLDER</span>
                      </button>
                      <Link
                        href="/"
                        target="_blank"
                        className="px-4 py-2.5 rounded-xl border-2 border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-xs font-bold text-[#131313] transition-all"
                      >
                        View Live Site &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Discipline Folder Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foldersList.map((folder) => {
                      const folderCourses = courses.filter((c) => c.folder === folder.id);
                      const count = folderCourses.length;

                      return (
                        <div
                          key={folder.id}
                          className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                        >
                          <div>
                            {/* Card Banner Image with Floating Circular Badge */}
                            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                              <img
                                src={folder.image}
                                alt={folder.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Floating Circular Badge Overlapping Bottom Right */}
                              <div className="absolute -bottom-5 right-5 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1 z-10">
                                <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-[#131313] tracking-tighter">
                                  {folder.logoText || 'CADD'}
                                </div>
                              </div>
                            </div>

                            {/* Card Content Body */}
                            <div className="p-6 pt-5 space-y-3.5">
                              {/* Sub-heading / Partner Info */}
                              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                {folder.partner}
                              </div>

                              {/* Folder / Discipline Title */}
                              <h4 className="text-lg font-bold text-[#131313] leading-snug group-hover:text-[#EE2C3C] transition-colors line-clamp-2">
                                {folder.name}
                              </h4>

                              {/* Discipline Status & Course Count */}
                              <div className="pt-1 flex items-center justify-between text-xs font-semibold text-slate-500">
                                <span className="flex items-center space-x-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                  <span>{folder.shortName || folder.name}</span>
                                </span>
                                <span className="font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-bold">
                                  📁 {count} {count === 1 ? 'Course' : 'Courses'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Bottom: Only "View Courses" Visible */}
                          <div className="p-6 pt-0">
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentFolderView(folder.id);
                                setCourseSearchQuery('');
                              }}
                              className="w-full py-2.5 px-4 rounded-full border border-slate-300 hover:border-[#EE2C3C] bg-white hover:bg-red-50/50 text-slate-800 hover:text-[#EE2C3C] text-xs sm:text-sm font-bold text-center transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                            >
                              <span>View Courses &rarr;</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* LEVEL 2: COURSES INSIDE SELECTED FOLDER (Drill-down view) */
                <div className="space-y-6">
                  {/* Folder Sub-Header with Back Button & Breadcrumbs */}
                  <div className="bg-[#FFFFFF] p-6 rounded-2xl border-2 border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setCurrentFolderView(null)}
                        className="px-4 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#131313] text-[#131313] hover:text-[#FFFFFF] border-2 border-[#CBD5E1] text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 shadow-sm"
                        title="Back to All Folders"
                      >
                        
                        <span>ALL FOLDERS</span>
                      </button>
                      <div>
                        {(() => {
                          const currentFolderObj =
                            currentFolderView === 'all'
                              ? null
                              : foldersList.find((f) => f.id === currentFolderView) || MAIN_FOLDERS.find((f) => f.id === currentFolderView);
                          return (
                            <>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-black px-2 py-0.5 rounded bg-[#131313] text-[#FFFFFF] font-mono">
                                  {currentFolderObj?.code || 'CATALOG'}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-[#131313] uppercase">
                                  {currentFolderObj?.name || 'All Certified Engineering Programs'}
                                </h3>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          const activeFolderObj =
                            currentFolderView !== 'all'
                              ? foldersList.find((f) => f.id === currentFolderView) || MAIN_FOLDERS.find((f) => f.id === currentFolderView)
                              : foldersList[0] || MAIN_FOLDERS[0];
                          setNewCourse((prev) => ({
                            ...prev,
                            folder: (currentFolderView !== 'all' ? currentFolderView : (foldersList[0]?.id || 'civil')) as string,
                            domain: activeFolderObj?.name || prev.domain,
                          }));
                          setShowAddCourseModal(true);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-[#FFFFFF] text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <span>+ CREATE NEW COURSE</span>
                      </button>
                      <Link
                        href="/"
                        target="_blank"
                        className="px-4 py-2.5 rounded-xl border-2 border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-xs font-bold text-[#131313] transition-all"
                      >
                        Live Site &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Course Search & Filter Bar */}
                  <div className="bg-[#FFFFFF] p-4 rounded-2xl border-2 border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#64748B]">
                      
                      <span className="text-[#131313] font-black uppercase">
                        {currentFolderView === 'all'
                          ? 'ALL TRACKS'
                          : (foldersList.find((f) => f.id === currentFolderView) || MAIN_FOLDERS.find((f) => f.id === currentFolderView))?.shortName}
                      </span>
                      <span>&bull;</span>
                      <span className="font-mono text-[#EE2C3C]">
                        {
                          courses.filter(
                            (c) =>
                              (currentFolderView === 'all' || c.folder === currentFolderView) &&
                              (!courseSearchQuery ||
                                c.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                                c.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                                c.software.toLowerCase().includes(courseSearchQuery.toLowerCase()))
                          ).length
                        }{' '}
                        Programs
                      </span>
                    </div>

                    <div className="w-full sm:w-80">
                      <input
                        type="text"
                        value={courseSearchQuery}
                        onChange={(e) => setCourseSearchQuery(e.target.value)}
                        placeholder="Search courses by title, code, software..."
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-[#CBD5E1] text-sm sm:text-base font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>
                  </div>

                  {/* Sleek Course Cards Grid - IMAGE 2 UPGRAD STYLE CARDS WITH SIMPLE BORDER */}
                  <div>
                    {isLoadingCourses ? (
                      <div className="py-16 text-center text-base font-bold text-[#64748B] bg-[#FFFFFF] rounded-2xl border border-slate-200">
                        Loading courses from database...
                      </div>
                    ) : courses.filter(
                        (c) =>
                          (currentFolderView === 'all' || c.folder === currentFolderView) &&
                          (!courseSearchQuery ||
                            c.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                            c.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                            c.software.toLowerCase().includes(courseSearchQuery.toLowerCase()))
                      ).length === 0 ? (
                      <div className="py-16 text-center bg-[#FFFFFF] rounded-2xl border border-slate-200 p-8 space-y-3">
                        <div className="text-lg font-black text-[#131313]">No Courses Found in this Folder</div>
                        <p className="text-sm sm:text-base text-[#64748B] max-w-md mx-auto">
                          There are currently no programs matching your search. Click &quot;ADD COURSE HERE&quot; to create one, or return to folders.
                        </p>
                        <button
                          onClick={() => {
                            setNewCourse((prev) => ({
                              ...prev,
                              folder: (currentFolderView !== 'all' ? currentFolderView : 'civil') as any,
                            }));
                            setShowAddCourseModal(true);
                          }}
                          className="px-6 py-2.5 rounded-full bg-[#EE2C3C] text-[#FFFFFF] text-sm font-bold uppercase shadow-sm hover:bg-[#D71E2E] cursor-pointer"
                        >
                          ADD COURSE TO THIS FOLDER
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses
                          .filter(
                            (c) =>
                              (currentFolderView === 'all' || c.folder === currentFolderView) &&
                              (!courseSearchQuery ||
                                c.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                                c.code.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
                                c.software.toLowerCase().includes(courseSearchQuery.toLowerCase()))
                          )
                          .map((course) => {
                            const enrolledCount = students.filter((s) =>
                              s.assignedCourses?.some(
                                (c) => c.toLowerCase().trim() === course.title.toLowerCase().trim()
                              )
                            ).length;

                            const classCount = course.classes?.length || 0;

                            return (
                              <div
                                key={course.id}
                                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                              >
                                <div>
                                  {/* Card Banner Image with Floating Circular Badge */}
                                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                                    <img
                                      src={
                                        (course.image && !course.image.includes('1541888946425') && !course.image.includes('1581092335397') && !course.image.includes('1504917599217'))
                                          ? course.image
                                          : (COURSES.find((c) => c.id.toLowerCase() === course.id.toLowerCase() || c.title.toLowerCase().trim() === course.title.toLowerCase().trim())?.image
                                            || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80')
                                      }
                                      alt={course.title}
                                      onError={(e) => {
                                        const fallback = COURSES.find((c) => c.id.toLowerCase() === course.id.toLowerCase() || c.title.toLowerCase().trim() === course.title.toLowerCase().trim())?.image
                                          || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80';
                                        if (e.currentTarget.src !== fallback) {
                                          e.currentTarget.src = fallback;
                                        }
                                      }}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Floating Circular Badge Overlapping Bottom Right */}
                                    <div className="absolute -bottom-5 right-5 w-12 h-12 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-1 z-10">
                                      <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-[#131313] tracking-tighter">
                                        {course.code.slice(0, 5)}
                                      </div>
                                    </div>
                                    {/* Top Left Tags */}
                                    <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                                      <span className="px-2.5 py-1 rounded-full bg-white/95 border border-slate-200 text-[#131313] text-[10px] font-bold shadow-xs">
                                        {(course.folder || 'ENGINEERING').toUpperCase()}
                                      </span>
                                      <span className="px-2.5 py-1 rounded-full bg-[#EE2C3C] text-white text-[10px] font-bold shadow-xs">
                                        ₹{(course.fee || 25000).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Card Content Body */}
                                  <div className="p-6 pt-5 space-y-3.5">
                                    {/* Sub-heading / Domain */}
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                      {course.domain || 'Certified Engineering Program'}
                                    </div>

                                    {/* Program Title */}
                                    <h4 className="text-lg font-bold text-[#131313] leading-snug group-hover:text-[#EE2C3C] transition-colors line-clamp-2">
                                      {course.title}
                                    </h4>

                                    {/* Light Cyan Pill Badge */}
                                    <div>
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F7F8] text-[#00838F]">
                                        360° Career Support
                                      </span>
                                    </div>

                                    {/* Key Specs with Clean Outlines */}
                                    <div className="space-y-2 pt-1 text-xs text-slate-600 font-medium">
                                      <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l9-5-9-5-9 5 9 5z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        </svg>
                                        <span className="text-[#131313] font-semibold">{course.level || 'Executive Diploma'}</span>
                                        <span className="text-slate-400">&bull;</span>
                                        <span className="text-slate-500 font-medium">{classCount} Classes</span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{course.duration || '60 Days (120 Hours)'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Card Bottom Buttons Row */}
                                <div className="p-6 pt-0 space-y-3">
                                  <div className="flex items-center gap-2.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenClassesManager(course)}
                                      className="flex-1 py-2.5 px-3 rounded-full border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-xs font-semibold text-center transition-colors shadow-2xs hover:bg-slate-50 cursor-pointer"
                                    >
                                      Classes ({classCount})
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditCourse(course)}
                                      className="flex-1 py-2.5 px-3 rounded-full bg-[#131313] hover:bg-[#262626] text-white text-xs font-bold text-center transition-colors shadow-2xs cursor-pointer"
                                    >
                                      Edit Course
                                    </button>
                                  </div>
                                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedCourseForStudents(course)}
                                      className="text-slate-600 hover:text-[#EE2C3C] font-semibold cursor-pointer"
                                    >
                                      Enrolled ({enrolledCount}) &rarr;
                                    </button>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setMovingCourse(course);
                                          setTargetMoveFolder(course.folder);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                                      >
                                        Move
                                      </button>
                                      <span className="text-slate-300">|</span>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCourse(course)}
                                        className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </div>
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
            </div>
          )}

          {/* TAB 3: STUDENT-WISE CERTIFICATE PDF UPLOADER */}
          {activeTab === 'Certificate' && (
            <div className="space-y-6">
              {/* Stat Counters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Total Students
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#131313] block mt-1">
                    {certStudentRows.length}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    PDF Uploaded
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 block mt-1">
                    {certStudentRows.filter((r) => !!r.certificate).length}
                  </span>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Pending Upload
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 block mt-1">
                    {certStudentRows.filter((r) => !r.certificate).length}
                  </span>
                </div>
              </div>

              {/* Certificate Directory Table / List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Search & Fast Controls Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-[#131313]">
                    Certificates ({certStudentRows.length})
                  </h3>

                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={certSearchQuery}
                      onChange={(e) => setCertSearchQuery(e.target.value)}
                      placeholder="Search student by name, ID, or course..."
                      className="px-3.5 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-slate-500 text-[#131313]"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        fetchStudents();
                        fetchCertificates();
                        showToast('Refreshed student registry & certificates.');
                      }}
                      className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm font-medium text-[#2B2B2B] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Students List */}
                {certStudentRows.length === 0 ? (
                  <div className="p-10 text-center space-y-2">
                    <div className="text-base font-bold text-[#131313]">No Students Found in Academy Registry</div>
                    <p className="text-sm text-[#666666]">
                      Please admit students in the Student tab first to upload certificates.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {certStudentRows
                      .filter((item) => {
                        if (!certSearchQuery.trim()) return true;
                        const q = certSearchQuery.toLowerCase();
                        return (
                          item.name.toLowerCase().includes(q) ||
                          item.studentId.toLowerCase().includes(q) ||
                          item.email.toLowerCase().includes(q) ||
                          item.course.toLowerCase().includes(q) ||
                          (item.certificate && item.certificate.certId.toLowerCase().includes(q))
                        );
                      })
                      .map((item) => {
                        const isUploadingThis = uploadingCertStudentId === (item.studentId || item.id);
                        return (
                          <div
                            key={item.studentId || item.id}
                            className="p-5 hover:bg-slate-50/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors"
                          >
                            {/* Student & Course Details */}
                            <div className="flex items-center space-x-3.5 min-w-0">
                              <div className="w-10 h-10 rounded-full bg-[#131313] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-base sm:text-lg font-bold text-[#131313] truncate">
                                    {item.name}
                                  </h4>
                                  <span className="px-2 py-0.5 rounded text-xs sm:text-sm font-mono font-medium bg-slate-100 text-[#2B2B2B]">
                                    {item.studentId}
                                  </span>
                                  {item.certificate ? (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      PDF Attached
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                      Pending PDF
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-[#666666] truncate mt-0.5">
                                  {item.course} {item.email ? `• ${item.email}` : ''}
                                </p>
                              </div>
                            </div>

                            {/* Certificate Details & Actions */}
                            <div className="flex items-center space-x-3 flex-shrink-0 self-end lg:self-center">
                              {item.certificate ? (
                                <>
                                  {/* Uploaded Certificate Info */}
                                  <div className="text-right hidden sm:block">
                                    <div className="flex items-center justify-end space-x-1.5 text-xs font-medium text-emerald-700">
                                      <span className="font-mono truncate max-w-[180px]">{item.certificate.fileName}</span>
                                      <span className="text-slate-400">({item.certificate.fileSize || 'PDF'})</span>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium block">
                                      {item.certificate.certId} &bull; Issued {item.certificate.issueDate}
                                    </span>
                                  </div>

                                  {/* View PDF Button */}
                                  <button
                                    type="button"
                                    onClick={() => setViewingCertificate(item.certificate!)}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#2B2B2B] text-xs font-medium transition-all shadow-2xs cursor-pointer"
                                    title="View certificate PDF in browser"
                                  >
                                    View PDF
                                  </button>

                                  {/* Download PDF Button */}
                                  <a
                                    href={item.certificate.fileUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#2B2B2B] text-xs font-medium transition-all shadow-2xs cursor-pointer inline-flex items-center space-x-1"
                                    title="Download certificate PDF"
                                  >
                                    <span>Download</span>
                                  </a>

                                  {/* Replace PDF Button with Hidden Input */}
                                  <label
                                    className={`px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[#2B2B2B] text-xs font-medium transition-all shadow-2xs cursor-pointer inline-flex items-center space-x-1 ${
                                      isUploadingThis ? 'cursor-wait opacity-60' : ''
                                    }`}
                                    title="Replace with updated PDF"
                                  >
                                    <span>{isUploadingThis ? 'Replacing...' : 'Replace PDF'}</span>
                                    <input
                                      type="file"
                                      accept=".pdf"
                                      className="hidden"
                                      disabled={isUploadingThis}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleDirectUploadForStudent(item, file);
                                        e.target.value = '';
                                      }}
                                    />
                                  </label>

                                  {/* Delete / Revoke Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCertificate(item.certificate!)}
                                    className="px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-all shadow-2xs cursor-pointer"
                                    title="Revoke and delete certificate"
                                  >
                                    Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  {/* Upload PDF Certificate Button with Hidden Input */}
                                  <label
                                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm transition-all cursor-pointer ${
                                      isUploadingThis ? 'cursor-wait opacity-60' : ''
                                    }`}
                                  >
                                    <span>{isUploadingThis ? 'Uploading...' : 'Upload Certificate PDF'}</span>
                                    <input
                                      type="file"
                                      accept=".pdf"
                                      className="hidden"
                                      disabled={isUploadingThis}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleDirectUploadForStudent(item, file);
                                        e.target.value = '';
                                      }}
                                    />
                                  </label>
                                </>
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

          {/* TAB 5: EBOOK (Clean & Professional Enterprise Data Table & Simple Form) */}
          {activeTab === 'Ebook' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-[#131313]">E-Books</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="px-3 py-1 bg-slate-100 text-[#2B2B2B] rounded-lg font-medium">
                    Total: {ebooks.length}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium">
                    Free: {ebooks.filter((b) => b.accessType === 'free').length}
                  </span>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-medium">
                    Locked: {ebooks.filter((b) => b.accessType === 'locked').length}
                  </span>
                </div>
              </div>

              {/* Simple Clean Form */}
              <div className="bg-[#FFFFFF] p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-semibold text-[#131313]">Add New E-Book</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] mb-1.5">
                      Book Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newEbookTitle}
                      onChange={(e) => setNewEbookTitle(e.target.value)}
                      placeholder="e.g. AutoCAD 2026 Complete Civil Drafting Handbook"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-[#131313] focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] mb-1.5">
                      Related Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newEbookCourse}
                      onChange={(e) => setNewEbookCourse(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-[#131313] focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                      <option value="Civil CADD & Master BIM">Civil CADD &amp; Master BIM</option>
                      <option value="Mechanical CAD/CAM/CAE Diploma">Mechanical CAD/CAM/CAE Diploma</option>
                      <option value="Electrical CADD & Power Distribution">Electrical CADD &amp; Power Distribution</option>
                      <option value="Architectural BIM & Revit">Architectural BIM &amp; Revit</option>
                      <option value="General CAD Engineering & Drafting">General CAD Engineering &amp; Drafting</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] mb-1.5">
                      Access Mode
                    </label>
                    <div className="flex items-center space-x-6 h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <label className="inline-flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="ebookAccess"
                          checked={newEbookAccessType === 'free'}
                          onChange={() => setNewEbookAccessType('free')}
                          className="w-4 h-4 text-[#131313] border-slate-300"
                        />
                        <span className="font-medium">Free Access</span>
                      </label>
                      <label className="inline-flex items-center space-x-2 text-sm text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="ebookAccess"
                          checked={newEbookAccessType === 'locked'}
                          onChange={() => setNewEbookAccessType('locked')}
                          className="w-4 h-4 text-[#131313] border-slate-300"
                        />
                        <span className="font-medium">Locked (Enrolled Only)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2B2B2B] mb-1.5">
                      PDF Document <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-3">
                      <label className="inline-flex items-center px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-[#2B2B2B] bg-white hover:bg-slate-50 cursor-pointer shadow-sm transition-colors">
                        <span>{isUploadingEbookPdf ? 'Uploading PDF...' : 'Choose PDF File'}</span>
                        <input
                          type="file"
                          accept=".pdf"
                          disabled={isUploadingEbookPdf}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleEbookPdfUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>

                      {newEbookFileName ? (
                        <div className="flex items-center space-x-2 text-sm text-[#2B2B2B] truncate bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                          <span className="font-medium truncate max-w-[200px]">{newEbookFileName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setNewEbookFileUrl('');
                              setNewEbookFileName('');
                              setNewEbookFileSize('');
                            }}
                            className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-0.5 rounded cursor-pointer font-medium ml-1 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 truncate">No file chosen (.pdf up to 50MB)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Small direct URL option */}
                <div className="flex items-center space-x-2 pt-1 text-xs text-[#666666]">
                  <span className="whitespace-nowrap">Or Direct PDF URL:</span>
                  <input
                    type="text"
                    value={newEbookFileUrl}
                    onChange={(e) => {
                      setNewEbookFileUrl(e.target.value);
                      if (!newEbookFileName && e.target.value) {
                        setNewEbookFileName('Direct-Book.pdf');
                        setNewEbookFileSize('Direct Link');
                      }
                    }}
                    placeholder="Paste direct PDF URL or Google Drive link"
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isSubmittingEbook || isUploadingEbookPdf}
                    onClick={handlePublishEbook}
                    className="px-6 py-2.5 bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingEbook ? 'Publishing...' : 'Upload & Publish Book'}
                  </button>
                </div>
              </div>

              {/* Clean Professional Data Table (Replaces the chunky cards in Image 2) */}
              <div className="bg-[#FFFFFF] rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-[#131313]">
                    Uploaded Books ({ebooks.length})
                  </h3>

                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={ebookSearchQuery}
                      onChange={(e) => setEbookSearchQuery(e.target.value)}
                      placeholder="Search books..."
                      className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-500 w-44 sm:w-60 text-[#131313]"
                    />

                    <div className="inline-flex border border-slate-200 rounded-lg overflow-hidden text-xs font-medium bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setEbookFilterAccess('all')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer ${
                          ebookFilterAccess === 'all'
                            ? 'bg-[#131313] text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => setEbookFilterAccess('free')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer border-l border-slate-200 ${
                          ebookFilterAccess === 'free'
                            ? 'bg-[#131313] text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() => setEbookFilterAccess('locked')}
                        className={`px-3 py-1.5 transition-colors cursor-pointer border-l border-slate-200 ${
                          ebookFilterAccess === 'locked'
                            ? 'bg-[#131313] text-white font-semibold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Locked
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => fetchEbooks()}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-[#2B2B2B] hover:bg-slate-50 cursor-pointer"
                    >
                      {isLoadingEbooks ? '...' : 'Refresh'}
                    </button>
                  </div>
                </div>

                {/* Table Body */}
                {ebooks.length === 0 ? (
                  <div className="p-8 text-center text-[#666666] text-sm">
                    No e-books uploaded yet. Use the form above to add your first book.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                          <th className="px-5 py-3">Book Title</th>
                          <th className="px-5 py-3">Subject</th>
                          <th className="px-5 py-3">Access</th>
                          <th className="px-5 py-3">File Size</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ebooks
                          .filter((b) => {
                            if (ebookFilterAccess === 'free' && b.accessType !== 'free') return false;
                            if (ebookFilterAccess === 'locked' && b.accessType !== 'locked') return false;
                            if (!ebookSearchQuery.trim()) return true;
                            const q = ebookSearchQuery.toLowerCase();
                            return (
                              b.title.toLowerCase().includes(q) ||
                              b.course.toLowerCase().includes(q)
                            );
                          })
                          .map((book) => (
                            <tr key={book.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="px-5 py-3.5 font-medium text-[#131313]">
                                {book.title}
                              </td>
                              <td className="px-5 py-3.5 text-slate-600 font-medium">
                                {book.course}
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    book.accessType === 'free'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {book.accessType === 'free' ? 'Free' : 'Locked'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-[#666666] text-xs">
                                {book.pdfSize || 'Document'}
                              </td>
                              <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setViewingEbook(book)}
                                  className="px-2.5 py-1 text-xs font-medium text-[#2B2B2B] border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                                >
                                  View PDF
                                </button>
                                <a
                                  href={book.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="inline-block px-2.5 py-1 text-xs font-medium text-[#2B2B2B] border border-slate-200 rounded-md hover:bg-slate-50 cursor-pointer"
                                >
                                  Download
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleToggleEbookAccess(book)}
                                  className="px-3 py-1.5 text-xs font-medium text-[#2B2B2B] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                                >
                                  {book.accessType === 'free' ? 'Make Locked' : 'Make Free'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEbook(book)}
                                  className="px-3 py-1.5 text-xs font-medium text-rose-600 border border-transparent hover:border-rose-200 hover:bg-rose-50 rounded-lg transition-colors shadow-2xs cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: JOBS & PLACEMENT BOARD (Full real-time management synced to live website & student notifications) */}
          {activeTab === 'Jobs' && (
            <div className="space-y-6">
              {/* Top Banner & Header */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Live Website Sync Active
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Reflects instantly on <span className="font-mono text-slate-700 font-semibold">/#jobs-portal</span> &amp; Student Portal
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Placement &amp; Core Engineering Job Board
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Manage core CAD/BIM hiring openings from partner EPC companies, view candidate applications, and broadcast instant alerts.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => fetchJobs()}
                    disabled={isLoadingJobs}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                    title="Refresh Job Vacancies"
                  >
                    <svg
                      className={`w-4 h-4 text-slate-500 ${isLoadingJobs ? 'animate-spin' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>{isLoadingJobs ? 'Syncing...' : 'Refresh'}</span>
                  </button>

                  <a
                    href="/#jobs-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <span>View Live Website</span>
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>

                  <button
                    onClick={() => setShowAddJobModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-[#15304C] hover:bg-[#0F2038] text-white text-sm font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-lg leading-none font-bold">+</span>
                    <span>Post New Job Vacancy</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Summary Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Active Openings
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {adminJobs.filter((j) => j.status === 'Active').length}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Live on Site
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 block font-medium">
                    Total positions currently accepting applications
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Total Applications
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-indigo-700 font-mono">
                      {adminJobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0)}
                    </span>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Candidates
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 block font-medium">
                    Applied students &amp; engineers with CAD portfolios
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Hiring EPC Partners
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {new Set(adminJobs.map((j) => j.company)).size}
                    </span>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      Verified
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 block font-medium">
                    L&amp;T, Tata Tech, Worley, Siemens Energy, Jacobs
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Fresher / Drives
                  </span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {adminJobs.filter((j) => j.jobType === 'Fresher Drive' || j.jobType === 'Internship').length}
                    </span>
                    <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                      Fresh Talent
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 mt-2 block font-medium">
                    Entry level roles for newly certified CADD batches
                  </span>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="Search by job title, company, skills, or city..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C] bg-slate-50/50"
                  />
                  <svg
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {jobSearchQuery && (
                    <button
                      onClick={() => setJobSearchQuery('')}
                      className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Status Tabs & Stream filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                    {(
                      [
                        { id: 'all', label: 'All Openings', count: adminJobs.length },
                        {
                          id: 'Active',
                          label: 'Active',
                          count: adminJobs.filter((j) => j.status === 'Active').length,
                        },
                        {
                          id: 'WithApplicants',
                          label: 'With Applicants',
                          count: adminJobs.filter((j) => (j.applicants?.length || 0) > 0).length,
                        },
                        {
                          id: 'Closed',
                          label: 'Closed',
                          count: adminJobs.filter((j) => j.status === 'Closed').length,
                        },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setJobFilterStatus(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          jobFilterStatus === tab.id
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                            jobFilterStatus === tab.id
                              ? 'bg-slate-100 text-slate-900 font-bold'
                              : 'bg-slate-200/60 text-slate-600'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Stream Dropdown */}
                  <select
                    value={jobFilterStream}
                    onChange={(e) => setJobFilterStream(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#15304C]"
                  >
                    <option value="all">All Engineering Streams</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil / Structural</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Architectural">Architectural / BIM</option>
                    <option value="Piping">Piping &amp; Plant Design</option>
                  </select>
                </div>
              </div>

              {/* Jobs List Grid */}
              {(() => {
                const q = jobSearchQuery.toLowerCase();
                const filtered = adminJobs.filter((job) => {
                  const jobSkills = job.skills || job.tools || [];
                  const jobStream = job.stream || job.discipline || 'All Streams';
                  const matchesSearch =
                    !q ||
                    job.title.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q) ||
                    job.location.toLowerCase().includes(q) ||
                    jobSkills.some((s) => s.toLowerCase().includes(q));

                  const matchesStatus =
                    jobFilterStatus === 'all'
                      ? true
                      : jobFilterStatus === 'Active'
                      ? job.status === 'Active'
                      : jobFilterStatus === 'Closed'
                      ? job.status === 'Closed'
                      : jobFilterStatus === 'WithApplicants'
                      ? (job.applicants?.length || 0) > 0
                      : true;

                  const matchesStream =
                    jobFilterStream === 'all' ||
                    jobStream.toLowerCase() === jobFilterStream.toLowerCase() ||
                    jobStream === 'All Streams';

                  return matchesSearch && matchesStatus && matchesStream;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl text-slate-400">
                        💼
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">No Job Openings Found</h4>
                      <p className="text-sm text-slate-500 max-w-md mx-auto">
                        No vacancies match your current search or filter criteria. Try resetting the filters or post a new vacancy.
                      </p>
                      <button
                        onClick={() => {
                          setJobSearchQuery('');
                          setJobFilterStatus('all');
                          setJobFilterStream('all');
                          setShowAddJobModal(true);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#15304C] hover:bg-[#0F2038] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
                      >
                        + Post a New Vacancy Now
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filtered.map((job) => {
                      const applicantsCount = job.applicants?.length || 0;
                      const isClosed = job.status === 'Closed';
                      const jobSkills = job.skills || job.tools || [];
                      const jobStream = job.stream || job.discipline || 'Mechanical';

                      // Stream pill styling
                      const streamColors: Record<string, string> = {
                        Mechanical: 'bg-amber-50 text-amber-800 border-amber-200',
                        Civil: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                        Electrical: 'bg-sky-50 text-sky-800 border-sky-200',
                        Architectural: 'bg-violet-50 text-violet-800 border-violet-200',
                        Piping: 'bg-rose-50 text-rose-800 border-rose-200',
                      };
                      const streamStyle =
                        streamColors[jobStream] || 'bg-slate-50 text-slate-800 border-slate-200';

                      return (
                        <div
                          key={job.id}
                          className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-2xs hover:shadow-md ${
                            isClosed
                              ? 'border-slate-200 bg-slate-50/60 opacity-80'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Left: Company & Title */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-[#15304C] text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-2xs">
                                {job.companyLogo ? (
                                  <img
                                    src={job.companyLogo}
                                    alt={job.company}
                                    className="w-full h-full object-contain p-1 rounded-xl"
                                    onError={(e) => {
                                      // Fallback to text initials
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  job.company.substring(0, 2).toUpperCase()
                                )}
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                    {job.title}
                                  </h3>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${streamStyle}`}
                                  >
                                    {jobStream}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                                    {job.workMode}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                    {job.jobType}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                      job.status === 'Active'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-slate-200 text-slate-700'
                                    }`}
                                  >
                                    {job.status === 'Active' ? '● Active' : '✕ Closed'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                                  <span className="font-bold text-slate-800 flex items-center gap-1">
                                    <span>🏢</span> {job.company}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span>📍</span> {job.location}
                                  </span>
                                  <span className="font-semibold text-slate-700 flex items-center gap-1 font-mono">
                                    <span>💰</span> {job.salary}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span>🎯</span> {job.vacancies} {job.vacancies === 1 ? 'Opening' : 'Openings'}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span>🎓</span> {job.experience}
                                  </span>
                                </div>

                                {/* Skills Pills */}
                                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                  {jobSkills.map((skill: string, sIdx: number) => (
                                    <span
                                      key={sIdx}
                                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions & Applicants */}
                            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                              {/* View Applicants button */}
                              <button
                                onClick={() => setSelectedJobForApplicants(job)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                                  applicantsCount > 0
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>
                                  {applicantsCount > 0
                                    ? `${applicantsCount} Applied`
                                    : '0 Candidates'}
                                </span>
                              </button>

                              {/* Toggle Active / Closed */}
                              <button
                                onClick={() => handleToggleJobStatus(job)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                  job.status === 'Active'
                                    ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                }`}
                                title={job.status === 'Active' ? 'Close job' : 'Re-open job'}
                              >
                                {job.status === 'Active' ? 'Close Vacancy' : 'Reactivate'}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteJob(job.id, job.title)}
                                className="p-2 rounded-xl border border-transparent hover:border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                                title="Delete Vacancy"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* MODAL 1: POST NEW JOB VACANCY */}
              {showAddJobModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    {/* Modal Header */}
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                          Direct Job Placement Publisher
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">
                          Post New Engineering Job Vacancy
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Directly appears on the live website and triggers student alerts
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddJobModal(false)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-lg font-bold"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Modal Form */}
                    <form onSubmit={handleCreateJob} className="p-6 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Job Title */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Job Designation / Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={newJobForm.title}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, title: e.target.value }))
                            }
                            placeholder="e.g. Senior Mechanical Design Engineer - SolidWorks & GD&T"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Company Name */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Hiring Company *
                          </label>
                          <input
                            type="text"
                            required
                            value={newJobForm.company}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, company: e.target.value }))
                            }
                            placeholder="e.g. Larsen & Toubro / Tata Technologies"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Company Logo URL (Optional) */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Company Logo URL (Optional)
                          </label>
                          <input
                            type="url"
                            value={newJobForm.companyLogo}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, companyLogo: e.target.value }))
                            }
                            placeholder="https://... (Leave blank for auto monogram)"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Stream */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Engineering Stream *
                          </label>
                          <select
                            value={newJobForm.stream}
                            onChange={(e) =>
                              setNewJobForm((p) => ({
                                ...p,
                                stream: e.target.value as any,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C] bg-white"
                          >
                            <option value="Mechanical">Mechanical Engineering</option>
                            <option value="Civil">Civil / Structural Engineering</option>
                            <option value="Electrical">Electrical Engineering</option>
                            <option value="Architectural">Architectural / BIM</option>
                            <option value="Piping">Piping &amp; Plant Design</option>
                            <option value="All Streams">All Streams Eligible</option>
                          </select>
                        </div>

                        {/* Work Mode */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Work Mode *
                          </label>
                          <select
                            value={newJobForm.workMode}
                            onChange={(e) =>
                              setNewJobForm((p) => ({
                                ...p,
                                workMode: e.target.value as any,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C] bg-white"
                          >
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                          </select>
                        </div>

                        {/* Job Type */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Job Type *
                          </label>
                          <select
                            value={newJobForm.jobType}
                            onChange={(e) =>
                              setNewJobForm((p) => ({
                                ...p,
                                jobType: e.target.value as any,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C] bg-white"
                          >
                            <option value="Full-time">Full-time Permanent</option>
                            <option value="Internship">Paid Internship</option>
                            <option value="Fresher Drive">Fresher Placement Drive</option>
                            <option value="Contract">Contract / Project Basis</option>
                          </select>
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Job Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={newJobForm.location}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, location: e.target.value }))
                            }
                            placeholder="e.g. Hyderabad Ameerpet / Bengaluru"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Salary CTC */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Salary Package (CTC) *
                          </label>
                          <input
                            type="text"
                            required
                            value={newJobForm.salary}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, salary: e.target.value }))
                            }
                            placeholder="e.g. ₹4.5 - ₹6.5 LPA"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Vacancies */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Open Vacancies Count *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            required
                            value={newJobForm.vacancies}
                            onChange={(e) =>
                              setNewJobForm((p) => ({
                                ...p,
                                vacancies: parseInt(e.target.value) || 1,
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Experience */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Experience Required *
                          </label>
                          <input
                            type="text"
                            required
                            value={newJobForm.experience}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, experience: e.target.value }))
                            }
                            placeholder="e.g. 0-2 Yrs (Freshers & CADDESK Trainees Eligible)"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Deadline */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Application Deadline *
                          </label>
                          <input
                            type="text"
                            required
                            value={newJobForm.deadline}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, deadline: e.target.value }))
                            }
                            placeholder="e.g. Immediate / Next 15 Days"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Skills */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Key CAD/BIM Skills (comma separated) *
                          </label>
                          <input
                            type="text"
                            required
                            value={newJobForm.skills}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, skills: e.target.value }))
                            }
                            placeholder="e.g. AutoCAD, SolidWorks, CATIA V5, GD&T, 3D Modeling"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Job Role &amp; Responsibilities Overview
                          </label>
                          <textarea
                            rows={3}
                            value={newJobForm.description}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, description: e.target.value }))
                            }
                            placeholder="Briefly describe the CAD design scope, plant modeling tasks, or engineering deliverables..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C]"
                          />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Eligibility &amp; Mandatory Requirements (one per line)
                          </label>
                          <textarea
                            rows={3}
                            value={newJobForm.requirements}
                            onChange={(e) =>
                              setNewJobForm((p) => ({ ...p, requirements: e.target.value }))
                            }
                            placeholder="B.Tech / Diploma in Engineering&#10;Proficiency in CAD/BIM tools&#10;Certification from RND CADD / CADDESK"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#15304C] font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* Broadcast Checkbox */}
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="broadcastCheck"
                          checked={newJobForm.broadcastToStudents}
                          onChange={(e) =>
                            setNewJobForm((p) => ({
                              ...p,
                              broadcastToStudents: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <label
                          htmlFor="broadcastCheck"
                          className="text-xs font-medium text-emerald-900 cursor-pointer"
                        >
                          <span className="font-bold block">
                            📢 Broadcast instant alert notification to students &amp; reflect immediately on live website
                          </span>
                          Students will receive a real-time notification badge on their student portal and this vacancy will be instantly searchable at{' '}
                          <span className="font-mono font-semibold">/#jobs-portal</span>.
                        </label>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setShowAddJobModal(false)}
                          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingJob}
                          className="px-6 py-2.5 rounded-xl bg-[#15304C] hover:bg-[#0F2038] text-white text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingJob ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Publishing Vacancy...</span>
                            </>
                          ) : (
                            <span>🚀 Publish &amp; Broadcast Vacancy</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* MODAL 2: VIEW APPLICANTS FOR A SPECIFIC JOB */}
              {selectedJobForApplicants && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                            Candidate Applications
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {selectedJobForApplicants.applicants?.length || 0} Candidates
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {selectedJobForApplicants.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {selectedJobForApplicants.company} &bull; {selectedJobForApplicants.location} &bull; {selectedJobForApplicants.salary}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedJobForApplicants(null)}
                        className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 text-lg font-bold"
                      >
                        &times;
                      </button>
                    </div>

                    {/* Applicants List */}
                    <div className="p-6 flex-1 space-y-4">
                      {(!selectedJobForApplicants.applicants ||
                        selectedJobForApplicants.applicants.length === 0) ? (
                        <div className="p-10 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
                          <div className="text-2xl text-slate-400">📄</div>
                          <div className="text-base font-bold text-slate-800">
                            No Candidate Applications Yet
                          </div>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            When students or external engineering candidates apply via the live website or student portal, their profiles and CAD portfolios will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(selectedJobForApplicants.applicants || []).map((app, idx) => (
                            <div
                              key={app.id || idx}
                              className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base font-bold text-slate-900">
                                      {app.name}
                                    </span>
                                    {app.studentId && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        RND CADD STUDENT: {app.studentId}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {app.email} &bull; {app.phone}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-xs font-semibold text-slate-400 block font-mono">
                                    Applied: {new Date(app.appliedAt).toLocaleDateString('en-IN', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                    })}
                                  </span>
                                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                    {app.stream}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                                <div>
                                  <span className="font-bold text-slate-700">College / Qualification:</span>{' '}
                                  {app.college || app.qualification || 'B.Tech Mechanical Engineering'}
                                </div>
                                {app.portfolioUrl && (
                                  <div>
                                    <span className="font-bold text-slate-700">CAD Portfolio:</span>{' '}
                                    <a
                                      href={app.portfolioUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
                                    >
                                      View CAD Portfolio &rarr;
                                    </a>
                                  </div>
                                )}
                              </div>

                              {app.coverNote && (
                                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 italic">
                                  &ldquo;{app.coverNote}&rdquo;
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">
                        Showing {selectedJobForApplicants.applicants?.length || 0} candidate submissions
                      </span>
                      <button
                        onClick={() => setSelectedJobForApplicants(null)}
                        className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SUPPORT & HELPDESK TICKETS */}
          {(activeTab === 'Support' || activeTab === 'CADDESK Channel') && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#EE2C3C] text-white uppercase tracking-wider">
                      Faculty Resolution Desk
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Live Student Helpdesk</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#131313] tracking-tight">
                    Student Support &amp; Doubt Clearance Tickets
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Incoming technical queries regarding software licenses, workstation errors, and design projects. Review problem details, provide official solutions, and mark as resolved.
                  </p>
                </div>
              </div>

              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Raised Tickets
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#131313]">{adminTickets.length}</span>
                    <span className="text-xs text-slate-500">All submissions</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                    Pending / Under Review
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-600">
                      {adminTickets.filter((t) => t.status !== 'Resolved').length}
                    </span>
                    <span className="text-xs text-amber-700">Requires attention</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                    Solved &amp; Resolved
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-600">
                      {adminTickets.filter((t) => t.status === 'Resolved').length}
                    </span>
                    <span className="text-xs text-emerald-700">Published to students</span>
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setTicketStatusFilter('all')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      ticketStatusFilter === 'all'
                        ? 'bg-[#131313] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All Tickets ({adminTickets.length})
                  </button>
                  <button
                    onClick={() => setTicketStatusFilter('open')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      ticketStatusFilter === 'open'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Pending ({adminTickets.filter((t) => t.status !== 'Resolved').length})
                  </button>
                  <button
                    onClick={() => setTicketStatusFilter('resolved')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      ticketStatusFilter === 'resolved'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Resolved ({adminTickets.filter((t) => t.status === 'Resolved').length})
                  </button>
                </div>

                <div className="w-full md:w-80">
                  <input
                    type="text"
                    value={ticketSearchQuery}
                    onChange={(e) => setTicketSearchQuery(e.target.value)}
                    placeholder="Search by ticket #, student name, ID, or subject..."
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-[#131313] focus:outline-none focus:border-[#EE2C3C] bg-white"
                  />
                </div>
              </div>

              {/* Tickets Cards List */}
              {isLoadingTickets ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <div className="w-8 h-8 border-3 border-[#EE2C3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">Syncing student support tickets...</p>
                </div>
              ) : (
                (() => {
                  const filtered = adminTickets.filter((t) => {
                    const matchFilter =
                      ticketStatusFilter === 'all' ||
                      (ticketStatusFilter === 'open' && t.status !== 'Resolved') ||
                      (ticketStatusFilter === 'resolved' && t.status === 'Resolved');

                    const q = ticketSearchQuery.toLowerCase();
                    const matchQuery =
                      !q ||
                      t.ticketNumber.toLowerCase().includes(q) ||
                      t.studentName.toLowerCase().includes(q) ||
                      t.studentId.toLowerCase().includes(q) ||
                      t.course.toLowerCase().includes(q) ||
                      t.subject.toLowerCase().includes(q) ||
                      t.category.toLowerCase().includes(q);

                    return matchFilter && matchQuery;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h4 className="text-base font-bold text-[#131313]">No tickets found</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          There are currently no student support tickets matching the selected filters.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {filtered.map((t) => {
                        const isResolved = t.status === 'Resolved';
                        const isInProgress = t.status === 'In Progress';

                        return (
                          <div
                            key={t.id}
                            className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs hover:border-slate-300 transition-all"
                          >
                            {/* Card Top Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
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
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : t.priority === 'High'
                                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {t.priority} Priority
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium">
                                  Created: {new Date(t.createdAt).toLocaleDateString()}
                                </span>
                                {isResolved ? (
                                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Resolved
                                  </span>
                                ) : isInProgress ? (
                                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    In Progress
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                    Open
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Student Metadata */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                              <div>
                                <span className="font-bold text-[#131313]">{t.studentName}</span>{' '}
                                <span className="font-mono text-slate-500">({t.studentId})</span>
                              </div>
                              <span className="text-slate-300">&bull;</span>
                              <div className="font-medium text-slate-700">{t.course}</div>
                              <span className="text-slate-300">&bull;</span>
                              <div className="text-slate-500">{t.studentEmail}</div>
                            </div>

                            {/* Subject & Description */}
                            <div className="space-y-1.5">
                              <h4 className="text-base font-bold text-[#131313] leading-snug">{t.subject}</h4>
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-slate-100">
                                {t.description}
                              </p>
                            </div>

                            {/* Official Resolution Response Box (if exists) */}
                            {t.adminReply && (
                              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Official Resolution from {t.resolvedBy || 'Faculty Mentor'}
                                  </span>
                                  {t.resolvedAt && (
                                    <span className="text-emerald-700/80 font-medium">
                                      {new Date(t.resolvedAt).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-800 whitespace-pre-line leading-relaxed font-normal">
                                  {t.adminReply}
                                </p>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                              <div className="text-xs text-slate-500">
                                {isResolved ? 'Student has received this solution' : 'Student waiting for faculty answer'}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDeleteTicket(t)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTicketForReply(t);
                                    setReplyText(t.adminReply || '');
                                    setReplyStatus(isResolved ? 'Resolved' : 'Resolved');
                                    setReplyFaculty(t.resolvedBy || 'Er. Swamy Naidu (Director / Chief Architect)');
                                  }}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                                    isResolved
                                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                                      : 'bg-[#16A34A] hover:bg-[#15803D] text-white'
                                  }`}
                                >
                                  {isResolved ? 'Update Resolution' : 'Solve & Resolve Ticket &rarr;'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}

              {/* Collapsible Campus Broadcast Container */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#131313]">Campus Broadcast Announcements</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Send batch-wide urgent notices to all active student portal dashboards
                    </p>
                  </div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/70 space-y-3">
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Broadcast Title: e.g. Autodesk Certified Professional Exam Slots Announced..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-[#EE2C3C]"
                  />
                  <textarea
                    rows={2}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Announcement message for all Civil, Mechanical, and Electrical students..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:border-[#EE2C3C]"
                  />
                  <button
                    onClick={() => {
                      if (!broadcastTitle) {
                        alert('Please provide an announcement title.');
                        return;
                      }
                      setBroadcastSent(true);
                      showToast('Broadcast published to active student portals!');
                      setBroadcastTitle('');
                      setBroadcastMessage('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer"
                  >
                    Broadcast to Students &rarr;
                  </button>
                  {broadcastSent && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                      Broadcast live! Displayed on active student portal dashboards.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: ASSIGNMENTS MANAGEMENT */}
          {activeTab === 'Assignments' && (
            <div className="space-y-6">
              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Total Assignments
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#131313] block mt-1">
                    {adminAssignments.length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Published PDF Tasks
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Civil &amp; BIM Assignments
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#131313] block mt-1">
                    {adminAssignments.filter((a) => a.course.toLowerCase().includes('civil')).length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Drawing Projects
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Mechanical / Other
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#131313] block mt-1">
                    {adminAssignments.filter((a) => !a.course.toLowerCase().includes('civil')).length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Discipline Modules
                  </span>
                </div>
              </div>

              {/* Enterprise Data Table Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-[#131313]">Course:</span>
                    <select
                      value={assignmentCourseFilter}
                      onChange={(e) => setAssignmentCourseFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold text-[#131313] bg-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                    >
                      <option value="all">All Courses ({adminAssignments.length})</option>
                      <option value="Civil CADD & Master BIM">Civil CADD &amp; Master BIM</option>
                      <option value="Mechanical CAD/CAM/CAE Diploma">Mechanical CAD/CAM/CAE Diploma</option>
                      <option value="Electrical CADD & Power Distribution">Electrical CADD &amp; Power Distribution</option>
                      <option value="Interior Architecture & 3D Visualization">Interior Architecture &amp; 3D</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.title}>{c.title}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={assignmentSearchQuery}
                      onChange={(e) => setAssignmentSearchQuery(e.target.value)}
                      placeholder="Search assignment title, topic, or file..."
                      className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-medium bg-white w-48 sm:w-72 focus:outline-none focus:ring-1 focus:ring-slate-500 text-[#131313]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setNewAssignmentCourse(courses[0]?.title || 'Civil CADD & Master BIM');
                        setShowAddAssignmentModal(true);
                      }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm transition-all cursor-pointer"
                    >
                      Upload Assignment
                    </button>
                  </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 text-[#2B2B2B] font-bold uppercase text-xs sm:text-sm tracking-wider border-b border-slate-200">
                        <th className="py-3.5 px-5">Assignment Title &amp; Brief</th>
                        <th className="py-3.5 px-5">Target Course</th>
                        <th className="py-3.5 px-5">Due Date</th>
                        <th className="py-3.5 px-5">PDF Document</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {isLoadingAssignments ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-sm sm:text-base font-medium text-[#666666]">
                            Loading course assignments...
                          </td>
                        </tr>
                      ) : (() => {
                        const filtered = adminAssignments.filter((a) => {
                          const matchCourse =
                            assignmentCourseFilter === 'all' ||
                            a.course.toLowerCase() === assignmentCourseFilter.toLowerCase() ||
                            a.course === 'All Courses';

                          const q = assignmentSearchQuery.toLowerCase();
                          const matchQuery =
                            !q ||
                            a.title.toLowerCase().includes(q) ||
                            a.course.toLowerCase().includes(q) ||
                            a.description.toLowerCase().includes(q);

                          return matchCourse && matchQuery;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={5} className="py-12 text-center">
                                <div className="text-base sm:text-lg font-semibold text-[#131313]">No assignments found</div>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                  Click &quot;Upload Assignment&quot; to publish drawing sheets and project tasks to students.
                                </p>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-5">
                              <div className="font-bold text-[#131313] text-sm sm:text-base">{a.title}</div>
                              {a.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2 max-w-lg">
                                  {a.description}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                                {a.course}
                              </span>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap font-mono text-xs text-slate-600">
                              {a.dueDate || 'Open'}
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-800 text-xs max-w-[200px] truncate" title={a.pdfName}>
                                  {a.pdfName || 'assignment.pdf'}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {a.pdfSize || 'PDF'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-5 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <a
                                  href={a.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#131313] bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
                                >
                                  Download
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setSelectedAssignmentForView(a)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#131313] hover:bg-slate-800 transition-all cursor-pointer"
                                >
                                  View
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAssignment(a)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 09: COURSE RATINGS & STUDENT REVIEWS */}
          {activeTab === 'Reviews' && (
            <div className="space-y-6">
              {/* TOP METRIC CARDS */}
              {(() => {
                const total = adminReviews.length;
                const avgRating = total > 0 ? (adminReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '5.0';
                const fiveStars = adminReviews.filter((r) => r.rating === 5).length;
                const positiveCount = adminReviews.filter((r) => r.rating >= 4).length;
                const positivePct = total > 0 ? Math.round((positiveCount / total) * 100) : 100;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
                        <span className="text-amber-500 text-lg">★</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-[#131313] tracking-tight">{avgRating}</span>
                        <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Aggregated across all courses</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Submissions</span>
                        <span className="text-slate-400 text-sm font-mono font-bold">#</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-[#131313] tracking-tight">{total}</span>
                        <span className="text-xs font-semibold text-slate-500">Reviews</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Verified student feedback</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">5-Star Excellence</span>
                        <span className="text-amber-500 text-sm font-bold">★★★★★</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-amber-600 tracking-tight">{fiveStars}</span>
                        <span className="text-xs font-semibold text-slate-500">Perfect scores</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Top tier training satisfaction</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider">Positive Satisfaction</span>
                        <span className="text-emerald-600 text-sm font-bold">✓</span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-emerald-600 tracking-tight">{positivePct}%</span>
                        <span className="text-xs font-semibold text-slate-500">Rate 4★ &amp; 5★</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Curriculum &amp; mentor rating</p>
                    </div>
                  </div>
                );
              })()}

              {/* CONTROLS: SEARCH & FILTERS */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search reviews by student name, ID, or feedback..."
                      value={reviewSearchQuery}
                      onChange={(e) => setReviewSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] transition-all bg-slate-50/50"
                    />
                    <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
                  </div>

                  <select
                    value={reviewCourseFilter}
                    onChange={(e) => setReviewCourseFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#EE2C3C]"
                  >
                    <option value="all">All Courses</option>
                    {Array.from(new Set(adminReviews.map((r) => r.courseName))).map((cName) => (
                      <option key={cName} value={cName}>
                        {cName}
                      </option>
                    ))}
                  </select>

                  <select
                    value={reviewRatingFilter}
                    onChange={(e) => setReviewRatingFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-[#EE2C3C]"
                  >
                    <option value="all">All Star Ratings</option>
                    <option value="5">5 Stars Only</option>
                    <option value="4">4 Stars Only</option>
                    <option value="3">3 Stars Only</option>
                    <option value="2">2 Stars Only</option>
                    <option value="1">1 Star Only</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchAdminReviews()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>↻</span>
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* REVIEWS LIST */}
              {(() => {
                const filtered = adminReviews.filter((r) => {
                  const q = reviewSearchQuery.toLowerCase();
                  const matchesQuery =
                    !q ||
                    r.studentName.toLowerCase().includes(q) ||
                    r.studentId.toLowerCase().includes(q) ||
                    r.studentEmail.toLowerCase().includes(q) ||
                    r.courseName.toLowerCase().includes(q) ||
                    r.review.toLowerCase().includes(q) ||
                    (r.trainerFeedback && r.trainerFeedback.toLowerCase().includes(q));

                  const matchesCourse = reviewCourseFilter === 'all' || r.courseName === reviewCourseFilter;
                  const matchesRating = reviewRatingFilter === 'all' || r.rating === Number(reviewRatingFilter);

                  return matchesQuery && matchesCourse && matchesRating;
                });

                if (isLoadingAdminReviews) {
                  return (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-slate-500">
                      Loading student course reviews...
                    </div>
                  );
                }

                if (filtered.length === 0) {
                  return (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-2">
                      <p className="text-base font-bold text-slate-700">No course reviews match your filter</p>
                      <p className="text-xs text-slate-400">When students submit ratings in their portal, they will appear here in real-time.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-4">
                    {filtered.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-center space-x-3.5">
                            {rev.studentPhoto ? (
                              <img
                                src={rev.studentPhoto}
                                alt={rev.studentName}
                                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-[#131313] text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                                {rev.studentName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="text-base font-bold text-[#131313]">{rev.studentName}</h4>
                                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {rev.studentId}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 font-medium block">{rev.studentEmail}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#131313] text-white font-mono">
                              {rev.courseName}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                              {rev.status || 'Verified'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Star Rating Display */}
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-800 font-mono">
                            {rev.rating}.0 / 5.0
                          </span>
                        </div>

                        {/* Written Review */}
                        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 text-sm text-slate-700 leading-relaxed font-medium">
                          {rev.review}
                        </div>

                        {/* Trainer Feedback (if provided) */}
                        {rev.trainerFeedback && (
                          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 flex items-start space-x-2">
                            <span className="font-bold text-amber-800 flex-shrink-0">Mentor Guidance:</span>
                            <span className="font-medium">{rev.trainerFeedback}</span>
                          </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="text-slate-400 font-mono text-[11px]">
                            Review Ref ID: {rev.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.id)}
                            disabled={isDeletingReviewId === rev.id}
                            className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold border border-transparent hover:border-rose-200 transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isDeletingReviewId === rev.id ? 'Deleting...' : 'Delete Review'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          
          {/* TAB: OFFERS & DISCOUNTS MANAGEMENT (Enterprise Directory & Referral Generator) */}
          {activeTab === 'Offers' && (
            <div className="space-y-6">
              {/* Dynamic Statistics Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Active Offers
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#131313]">
                      {adminOffers.filter((o) => o.status === 'Active').length}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Live Promos &amp; Referrals
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Course Discounts
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#131313] block mt-1">
                    {adminOffers.filter((o) => o.type === 'course_discount').length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Tuition Fee Waivers
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Student Referrals
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#131313] block mt-1">
                    {adminOffers.filter((o) => o.type === 'referral').length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Peer Invite Links
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Max Discount
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 block mt-1">
                    {(() => {
                      const maxPct = Math.max(0, ...adminOffers.filter((o) => o.discountType === 'percentage').map((o) => o.discountValue));
                      return maxPct > 0 ? `${maxPct}% OFF` : 'Flat Rs 1,500';
                    })()}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Best Active Value
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Total Redemptions
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#131313] block mt-1">
                    {adminOffers.reduce((acc, o) => acc + (o.redemptionsCount || 0), 0)}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Claimed by Trainees
                  </span>
                </div>
              </div>

              {/* Table Directory Controls (Filters + Search + Sync) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {[
                    { id: 'all', label: 'All Offers', count: adminOffers.length },
                    { id: 'course_discount', label: 'Course Discounts', count: adminOffers.filter((o) => o.type === 'course_discount').length },
                    { id: 'referral', label: 'Student Referrals', count: adminOffers.filter((o) => o.type === 'referral').length },
                    { id: 'active', label: 'Active', count: adminOffers.filter((o) => o.status === 'Active').length },
                    { id: 'inactive', label: 'Inactive', count: adminOffers.filter((o) => o.status === 'Inactive').length },
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      onClick={() => setOffersTypeFilter(filterTab.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        offersTypeFilter === filterTab.id
                          ? 'bg-[#131313] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filterTab.label} ({filterTab.count})
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      value={offersSearchQuery}
                      onChange={(e) => setOffersSearchQuery(e.target.value)}
                      placeholder="Search offers or coupon code..."
                      className="w-full px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                    />
                  </div>
                  <button
                    onClick={() => fetchAdminOffers(false)}
                    disabled={isLoadingOffers}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                  >
                    ↻ Sync
                  </button>
                </div>
              </div>

              {/* Offers Enterprise Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[#666666] font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-4 sm:px-6">Campaign / Offer &amp; Code</th>
                        <th className="py-3.5 px-4">Offer Type</th>
                        <th className="py-3.5 px-4">Discount / Benefit</th>
                        <th className="py-3.5 px-4">Target Course</th>
                        <th className="py-3.5 px-4">Generated Referral / Promo Link</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = adminOffers.filter((o) => {
                          const matchesQuery =
                            o.title.toLowerCase().includes(offersSearchQuery.toLowerCase()) ||
                            o.code.toLowerCase().includes(offersSearchQuery.toLowerCase()) ||
                            o.targetCourse.toLowerCase().includes(offersSearchQuery.toLowerCase());
                          if (!matchesQuery) return false;
                          if (offersTypeFilter === 'course_discount') return o.type === 'course_discount';
                          if (offersTypeFilter === 'referral') return o.type === 'referral';
                          if (offersTypeFilter === 'active') return o.status === 'Active';
                          if (offersTypeFilter === 'inactive') return o.status === 'Inactive';
                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-400">
                                <div className="max-w-sm mx-auto space-y-2">
                                  <p className="font-semibold text-slate-600">No offers found</p>
                                  <p className="text-xs">Click &quot;Create New Offer / Referral&quot; above to launch a discount code or student referral link.</p>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((offer) => {
                          const isCopied = copiedOfferId === offer.id;
                          return (
                            <tr key={offer.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-4 px-4 sm:px-6">
                                <div className="space-y-1">
                                  <span className="font-bold text-[#131313] block leading-snug">
                                    {offer.title}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-black tracking-wider text-[#EE2C3C] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                                      {offer.code}
                                    </span>
                                    {offer.expiryDate && (
                                      <span className="text-[11px] text-slate-500 font-medium">
                                        Valid till: {offer.expiryDate}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-4">
                                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md border ${
                                  offer.type === 'referral'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-sky-50 text-sky-700 border-sky-200'
                                }`}>
                                  {offer.type === 'referral' ? 'Peer Referral' : 'Course Discount'}
                                </span>
                              </td>

                              <td className="py-4 px-4">
                                <span className="font-bold text-slate-900 block">
                                  {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `Rs ${offer.discountValue.toLocaleString()} Flat`}
                                </span>
                                {offer.type === 'referral' && offer.referrerReward && (
                                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                                    Referrer: {offer.referrerReward}
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-4">
                                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 truncate max-w-[180px]">
                                  {offer.targetCourse}
                                </span>
                              </td>

                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-[11px] text-slate-600 truncate max-w-[200px]" title={offer.shareUrl}>
                                    {offer.shareUrl}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyOfferLink(offer.shareUrl, offer.id)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                                      isCopied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#EE2C3C] hover:bg-[#D71E2E] text-white'
                                    }`}
                                  >
                                    {isCopied ? 'Copied!' : 'Copy'}
                                  </button>
                                </div>
                              </td>

                              <td className="py-4 px-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleOfferStatus(offer.id, offer.status)}
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                                    offer.status === 'Active'
                                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                      : 'text-slate-500 bg-slate-100 border-slate-200 hover:bg-slate-200'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${offer.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                  <span>{offer.status}</span>
                                </button>
                              </td>

                              <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingOfferId(offer.id);
                                      setOfferFormType(offer.type);
                                      setOfferFormTitle(offer.title);
                                      setOfferFormCode(offer.code);
                                      setOfferFormCourse(offer.targetCourse);
                                      setOfferFormDiscountType(offer.discountType);
                                      setOfferFormDiscountValue(offer.discountValue);
                                      setOfferFormReferrerReward(offer.referrerReward || '');
                                      setOfferFormRefereeReward(offer.refereeReward || '');
                                      setOfferFormExpiry(offer.expiryDate || '');
                                      setOfferFormDescription(offer.description || '');
                                      setShowOfferModal(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOffer(offer.id)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE CLASSES MANAGEMENT (Enterprise Directory & Broadcast Pattern) */}
          {activeTab === 'Live' && (
            <div className="space-y-6">
              {/* Dynamic Live Statistics Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Active Broadcast
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`w-3 h-3 rounded-full ${liveSession?.status === 'Live Now' && liveSession?.isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className={`text-xl sm:text-2xl font-extrabold ${liveSession?.status === 'Live Now' && liveSession?.isLive ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {liveSession?.status === 'Live Now' && liveSession?.isLive ? 'LIVE NOW' : 'OFFLINE'}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Real-time Workstation
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Total Broadcasts
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#131313] block mt-1">
                    {liveHistory.length}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Session Records
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Current / Next Topic
                  </span>
                  <span className="text-sm font-bold text-[#131313] block mt-1 truncate" title={liveSession?.title || 'No Session'}>
                    {liveSession?.title || 'No Active Topic'}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Curriculum Unit
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Lead Trainer
                  </span>
                  <span className="text-sm font-bold text-[#131313] block mt-1 truncate">
                    {liveSession?.trainer || 'Er. Swamy Naidu'}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    Faculty Mentor
                  </span>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
                  <span className="text-xs sm:text-sm font-bold text-[#666666] uppercase tracking-wider block">
                    Platform
                  </span>
                  <span className="text-sm font-bold text-[#131313] block mt-1 truncate">
                    {liveSession?.platform || 'Virtual CAD Workstation'}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 block mt-0.5 font-medium">
                    CAD Lab Stream
                  </span>
                </div>
              </div>

              {/* Active Emergency Broadcast Alert Banner (Shown when Live) */}
              {liveSession?.status === 'Live Now' && liveSession?.isLive && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center space-x-4">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                          BROADCAST CURRENTLY LIVE ON STUDENT PORTAL
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">
                          {liveSession.platform}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {liveSession.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Trainer: <span className="font-bold text-slate-900">{liveSession.trainer}</span> &bull; Audience: {liveSession.course}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <a
                      href={liveSession.streamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all shadow-2xs inline-flex items-center space-x-1.5"
                    >
                      <span>Join Screen</span>
                      <span>↗</span>
                    </a>
                    <button
                      onClick={() => handleEndLiveSession(liveSession.id)}
                      disabled={isBroadcasting}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
                    >
                      <span>⏹</span>
                      <span>{isBroadcasting ? 'Ending...' : 'End Live Stream Immediately'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Table Directory Controls (Search + Filters + Sync) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {[
                    { id: 'all', label: 'All Sessions', count: liveHistory.length },
                    { id: 'live', label: 'Live Now', count: liveHistory.filter((s) => s.status === 'Live Now' && s.isLive).length },
                    { id: 'scheduled', label: 'Scheduled', count: liveHistory.filter((s) => s.status === 'Scheduled' && !s.isLive).length },
                    { id: 'ended', label: 'Ended / Offline', count: liveHistory.filter((s) => s.status === 'Ended' || !s.isLive).length },
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      onClick={() => setLiveStatusFilter(filterTab.id as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        liveStatusFilter === filterTab.id
                          ? 'bg-[#131313] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filterTab.label} ({filterTab.count})
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <input
                      type="text"
                      value={liveSearchQuery}
                      onChange={(e) => setLiveSearchQuery(e.target.value)}
                      placeholder="Search live sessions..."
                      className="w-full px-3.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                    />
                  </div>
                  <button
                    onClick={() => fetchLiveSession(false)}
                    disabled={isLoadingLive}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
                  >
                    ↻ Sync
                  </button>
                </div>
              </div>

              {/* Live Sessions Enterprise Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[#666666] font-bold text-[11px] sm:text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-4 sm:px-6">Session Topic &amp; Platform</th>
                        <th className="py-3.5 px-4">Instructor</th>
                        <th className="py-3.5 px-4">Target Course</th>
                        <th className="py-3.5 px-4">Timing &amp; Schedule</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        const filtered = liveHistory.filter((s) => {
                          const matchesQuery =
                            s.title.toLowerCase().includes(liveSearchQuery.toLowerCase()) ||
                            s.trainer.toLowerCase().includes(liveSearchQuery.toLowerCase()) ||
                            s.course.toLowerCase().includes(liveSearchQuery.toLowerCase());
                          if (!matchesQuery) return false;
                          if (liveStatusFilter === 'live') return s.status === 'Live Now' && s.isLive;
                          if (liveStatusFilter === 'scheduled') return s.status === 'Scheduled' && !s.isLive;
                          if (liveStatusFilter === 'ended') return s.status === 'Ended' || !s.isLive;
                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-400">
                                <div className="max-w-sm mx-auto space-y-2">
                                  <p className="font-semibold text-slate-600">No live sessions found</p>
                                  <p className="text-xs">Click &quot;Broadcast / Schedule Live Class&quot; above to create an active workstation stream.</p>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((session) => {
                          const isCurrentlyLive = session.status === 'Live Now' && session.isLive;
                          return (
                            <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-4 px-4 sm:px-6">
                                <div className="space-y-1">
                                  <span className="font-bold text-[#131313] block leading-snug">
                                    {session.title}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                      {session.platform}
                                    </span>
                                    <a
                                      href={session.streamUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] text-[#EE2C3C] hover:underline font-medium truncate max-w-[200px] inline-block"
                                    >
                                      {session.streamUrl}
                                    </a>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-4 font-semibold text-slate-800">
                                {session.trainer}
                              </td>

                              <td className="py-4 px-4">
                                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                                  {session.course}
                                </span>
                              </td>

                              <td className="py-4 px-4 font-mono text-xs text-slate-600">
                                {session.timing}
                              </td>

                              <td className="py-4 px-4">
                                {isCurrentlyLive ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Live Now</span>
                                  </span>
                                ) : session.status === 'Scheduled' ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                                    <span>Scheduled</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                                    <span>Ended</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                  {isCurrentlyLive ? (
                                    <button
                                      type="button"
                                      onClick={() => handleEndLiveSession(session.id)}
                                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer"
                                    >
                                      End Stream
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingLiveId(session.id);
                                        setLiveFormTitle(session.title);
                                        setLiveFormTrainer(session.trainer);
                                        setLiveFormCourse(session.course);
                                        setLiveFormUrl(session.streamUrl);
                                        setLiveFormPlatform(session.platform);
                                        setLiveFormTiming('Live Broadcast Active');
                                        setLiveFormDescription(session.description);
                                        handleBroadcastLive('Live Now');
                                      }}
                                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
                                    >
                                      Go Live
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingLiveId(session.id);
                                      setLiveFormTitle(session.title);
                                      setLiveFormTrainer(session.trainer);
                                      setLiveFormCourse(session.course);
                                      setLiveFormUrl(session.streamUrl);
                                      setLiveFormPlatform(session.platform);
                                      setLiveFormTiming(session.timing);
                                      setLiveFormDescription(session.description);
                                      setShowLiveModal(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
                                  >
                                    Edit
                                  </button>

                                   <button
                                     type="button"
                                     onClick={() => handleDeleteLiveSession(session.id)}
                                     className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                                   >
                                     Delete
                                   </button>
                                 </div>
                               </td>
                             </tr>
                           );
                         });
                       })()}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           )}

          {/* TAB: CMS (LIVE WEBSITE CONTENT, IMAGES, SECTIONS & VISIBILITY CONTROLLER) */}
          {activeTab === 'CMS' && (
            <div className="space-y-5">
              
              {/* Horizontal Sub-Navigation Tabs across the 6 Website Sections */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-3 overflow-x-auto no-scrollbar whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'hero', label: '1. Hero Section', isHidden: siteContent.hero.hidden },
                    { id: 'programs', label: '2. Domain Programs', isHidden: siteContent.programs.hidden },
                    { id: 'catalog', label: '3. Course Catalog', isHidden: siteContent.catalog.hidden },
                    { id: 'partners', label: '4. Hiring Partners', isHidden: siteContent.partners.hidden },
                    { id: 'enrollment', label: '5. Workstation Booking', isHidden: siteContent.enrollment.hidden },
                    { id: 'footer', label: '6. Footer & Contact', isHidden: siteContent.footer.hidden },
                  ].map((tab) => {
                    const isActive = cmsActiveSection === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setCmsActiveSection(tab.id as any);
                          setCmsNotification(null);
                        }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? 'bg-[#15304C] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.isHidden && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                            isActive ? 'bg-[#EE2C3C] text-white' : 'bg-rose-100 text-rose-700'
                          }`}>
                            HIDDEN
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0"
                >
                  View Live Site
                </Link>
              </div>

              {/* Status & Notification Alert Box */}
              {cmsNotification && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm font-bold border-2 flex items-center justify-between ${
                    cmsNotification.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <span>{cmsNotification.text}</span>
                  <button
                    type="button"
                    onClick={() => setCmsNotification(null)}
                    className="text-xs font-bold uppercase underline cursor-pointer ml-4"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* SECTION 1: HERO SECTION */}
              {cmsActiveSection === 'hero' && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
                  {/* Section Control Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#15304C]">
                        Hero Section
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility('hero')}
                        disabled={cmsSaving}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          siteContent.hero.hidden
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {siteContent.hero.hidden ? 'Show on Website' : 'Hide from Website'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetCmsSection('hero')}
                        disabled={cmsSaving}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Reset to Default
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsSection('hero')}
                        disabled={cmsSaving}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#EE2C3C] text-white hover:bg-[#D71E2E] shadow-xs transition-colors cursor-pointer"
                      >
                        {cmsSaving ? 'Publishing...' : 'Save & Publish Hero'}
                      </button>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Top Badge Pill
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.badge}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, badge: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold focus:border-[#15304C] focus:outline-none"
                          placeholder="Industry 4.0 CAD & BIM Academy"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Main Headline (First Part)
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.title}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, title: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold focus:border-[#15304C] focus:outline-none"
                          placeholder="Master Industrial CAD."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Headline Highlight (Red Colored Part)
                        </label>
                        <input
                          type="text"
                          value={siteContent.hero.highlight}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, highlight: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-[#EE2C3C] font-bold focus:border-[#15304C] focus:outline-none"
                          placeholder="Build Your Future."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Hero Paragraph Description
                        </label>
                        <textarea
                          rows={3}
                          value={siteContent.hero.description}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              hero: { ...siteContent.hero, description: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-medium focus:border-[#15304C] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Hero Image Management */}
                      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-3">
                        <label className="block text-xs font-bold text-[#15304C] uppercase tracking-wider">
                          Hero Section Image / Logo Mark
                        </label>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-xl border-2 border-slate-300 bg-white p-2 flex items-center justify-center shrink-0">
                            {siteContent.hero.heroImage ? (
                              <img
                                src={siteContent.hero.heroImage}
                                alt="Hero"
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">No Image</span>
                            )}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                id="hero-img-upload"
                                className="hidden"
                                onChange={(e) =>
                                  handleCmsFileUpload(e, (url) => {
                                    setSiteContent({
                                      ...siteContent,
                                      hero: { ...siteContent.hero, heroImage: url },
                                    });
                                  })
                                }
                              />
                              <label
                                htmlFor="hero-img-upload"
                                className="inline-block px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#15304C] text-white hover:bg-[#0E2033] cursor-pointer"
                              >
                                {isUploadingImage ? 'Uploading...' : 'Upload Image File'}
                              </label>
                            </div>

                            <input
                              type="text"
                              value={siteContent.hero.heroImage}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  hero: { ...siteContent.hero, heroImage: e.target.value },
                                })
                              }
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 font-mono"
                              placeholder="/logo_mark.png or https://..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Primary CTA */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Primary Button Text
                          </label>
                          <input
                            type="text"
                            value={siteContent.hero.primaryCtaText}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                hero: { ...siteContent.hero, primaryCtaText: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Primary Button Link
                          </label>
                          <input
                            type="text"
                            value={siteContent.hero.primaryCtaLink}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                hero: { ...siteContent.hero, primaryCtaLink: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                          />
                        </div>
                      </div>

                      {/* Secondary CTA */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Secondary Button Text
                          </label>
                          <input
                            type="text"
                            value={siteContent.hero.secondaryCtaText}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                hero: { ...siteContent.hero, secondaryCtaText: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Secondary Button Link
                          </label>
                          <input
                            type="text"
                            value={siteContent.hero.secondaryCtaLink}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                hero: { ...siteContent.hero, secondaryCtaLink: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: PROGRAMS SHOWCASE */}
              {cmsActiveSection === 'programs' && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#15304C]">
                        Engineering Programs Showcase
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility('programs')}
                        disabled={cmsSaving}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          siteContent.programs.hidden
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {siteContent.programs.hidden ? 'Show on Website' : 'Hide from Website'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetCmsSection('programs')}
                        disabled={cmsSaving}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Reset to Default
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsSection('programs')}
                        disabled={cmsSaving}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#EE2C3C] text-white hover:bg-[#D71E2E] shadow-xs transition-colors cursor-pointer"
                      >
                        {cmsSaving ? 'Publishing...' : 'Save & Publish Programs'}
                      </button>
                    </div>
                  </div>

                  {/* Section Headings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Badge Text
                      </label>
                      <input
                        type="text"
                        value={siteContent.programs.badge}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            programs: { ...siteContent.programs, badge: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Main Heading
                      </label>
                      <input
                        type="text"
                        value={siteContent.programs.heading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            programs: { ...siteContent.programs, heading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Subheading
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.programs.subheading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            programs: { ...siteContent.programs, subheading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Domain Cards & Media */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-black text-[#15304C] uppercase tracking-wider">
                      Engineering Domain Cards &amp; Images
                    </h4>
                    
                    <div className="space-y-4">
                      {siteContent.programs.domains.map((dom, index) => (
                        <div key={dom.id || index} className="p-4 rounded-xl border-2 border-slate-200 bg-slate-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[#15304C] uppercase tracking-wider">
                              Domain {index + 1}: {dom.name} ({dom.id})
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                Domain Name
                              </label>
                              <input
                                type="text"
                                value={dom.name}
                                onChange={(e) => {
                                  const updated = [...siteContent.programs.domains];
                                  updated[index].name = e.target.value;
                                  setSiteContent({
                                    ...siteContent,
                                    programs: { ...siteContent.programs, domains: updated },
                                  });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                Domain Subtitle / Headline
                              </label>
                              <input
                                type="text"
                                value={dom.headline}
                                onChange={(e) => {
                                  const updated = [...siteContent.programs.domains];
                                  updated[index].headline = e.target.value;
                                  setSiteContent({
                                    ...siteContent,
                                    programs: { ...siteContent.programs, domains: updated },
                                  });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                              />
                            </div>
                          </div>

                          {/* Domain Foreground Image */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Card Foreground Image
                              </label>
                              <div className="flex items-center gap-3">
                                <img
                                  src={dom.image}
                                  alt={dom.name}
                                  className="w-16 h-12 rounded object-cover border border-slate-300 shrink-0"
                                />
                                <div className="flex-1 space-y-1">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`dom-img-${index}`}
                                    className="hidden"
                                    onChange={(e) =>
                                      handleCmsFileUpload(e, (url) => {
                                        const updated = [...siteContent.programs.domains];
                                        updated[index].image = url;
                                        setSiteContent({
                                          ...siteContent,
                                          programs: { ...siteContent.programs, domains: updated },
                                        });
                                      })
                                    }
                                  />
                                  <label
                                    htmlFor={`dom-img-${index}`}
                                    className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-[#15304C] text-white cursor-pointer"
                                  >
                                    Upload Image
                                  </label>
                                  <input
                                    type="text"
                                    value={dom.image}
                                    onChange={(e) => {
                                      const updated = [...siteContent.programs.domains];
                                      updated[index].image = e.target.value;
                                      setSiteContent({
                                        ...siteContent,
                                        programs: { ...siteContent.programs, domains: updated },
                                      });
                                    }}
                                    className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-mono bg-white"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                                Background Hero Image
                              </label>
                              <div className="flex items-center gap-3">
                                <img
                                  src={dom.bgImage}
                                  alt={dom.name}
                                  className="w-16 h-12 rounded object-cover border border-slate-300 shrink-0"
                                />
                                <div className="flex-1 space-y-1">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id={`dom-bg-${index}`}
                                    className="hidden"
                                    onChange={(e) =>
                                      handleCmsFileUpload(e, (url) => {
                                        const updated = [...siteContent.programs.domains];
                                        updated[index].bgImage = url;
                                        setSiteContent({
                                          ...siteContent,
                                          programs: { ...siteContent.programs, domains: updated },
                                        });
                                      })
                                    }
                                  />
                                  <label
                                    htmlFor={`dom-bg-${index}`}
                                    className="inline-block px-2.5 py-1 rounded text-[11px] font-bold bg-[#15304C] text-white cursor-pointer"
                                  >
                                    Upload Background
                                  </label>
                                  <input
                                    type="text"
                                    value={dom.bgImage}
                                    onChange={(e) => {
                                      const updated = [...siteContent.programs.domains];
                                      updated[index].bgImage = e.target.value;
                                      setSiteContent({
                                        ...siteContent,
                                        programs: { ...siteContent.programs, domains: updated },
                                      });
                                    }}
                                    className="w-full px-2 py-1 rounded border border-slate-300 text-[11px] font-mono bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: COURSE CATALOG */}
              {cmsActiveSection === 'catalog' && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#15304C]">
                        Course Catalog Section
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility('catalog')}
                        disabled={cmsSaving}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          siteContent.catalog.hidden
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {siteContent.catalog.hidden ? 'Show on Website' : 'Hide from Website'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetCmsSection('catalog')}
                        disabled={cmsSaving}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Reset to Default
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsSection('catalog')}
                        disabled={cmsSaving}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#EE2C3C] text-white hover:bg-[#D71E2E] shadow-xs transition-colors cursor-pointer"
                      >
                        {cmsSaving ? 'Publishing...' : 'Save & Publish Catalog'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Catalog Section Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.catalog.badge}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            catalog: { ...siteContent.catalog, badge: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Catalog Section Heading
                      </label>
                      <input
                        type="text"
                        value={siteContent.catalog.heading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            catalog: { ...siteContent.catalog, heading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Catalog Section Subheading
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.catalog.subheading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            catalog: { ...siteContent.catalog, subheading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Quick Shortcut to Courses Management */}
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#15304C] uppercase tracking-wider block">
                        Manage Individual Courses &amp; Modules
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Course cards, syllabi, software lists, and pricing can be managed in the &quot;Courses&quot; tab of the Admin Console.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('Courses')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#15304C] text-white hover:bg-[#0E2033] shrink-0 cursor-pointer"
                    >
                      Open Courses Tab
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION 4: HIRING PARTNERS */}
              {cmsActiveSection === 'partners' && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#15304C]">
                        Hiring Partners
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility('partners')}
                        disabled={cmsSaving}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          siteContent.partners.hidden
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {siteContent.partners.hidden ? 'Show on Website' : 'Hide from Website'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetCmsSection('partners')}
                        disabled={cmsSaving}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Reset to Default
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsSection('partners')}
                        disabled={cmsSaving}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#EE2C3C] text-white hover:bg-[#D71E2E] shadow-xs transition-colors cursor-pointer"
                      >
                        {cmsSaving ? 'Publishing...' : 'Save & Publish Partners'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Partners Section Badge
                      </label>
                      <input
                        type="text"
                        value={siteContent.partners.badge}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            partners: { ...siteContent.partners, badge: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Main Heading
                      </label>
                      <input
                        type="text"
                        value={siteContent.partners.heading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            partners: { ...siteContent.partners, heading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Subheading
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.partners.subheading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            partners: { ...siteContent.partners, subheading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  {/* Add and Manage Partners List */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Partner Company Names ({siteContent.partners.partners.length} Total)
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPartnerName}
                        onChange={(e) => setNewPartnerName(e.target.value)}
                        placeholder="Enter company name (e.g. Larsen & Toubro, Tata Projects)..."
                        className="flex-1 px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newPartnerName.trim()) {
                            setSiteContent({
                              ...siteContent,
                              partners: {
                                ...siteContent.partners,
                                partners: [...siteContent.partners.partners, newPartnerName.trim()],
                              },
                            });
                            setNewPartnerName('');
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#15304C] text-white hover:bg-[#0E2033] cursor-pointer"
                      >
                        Add Partner
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {siteContent.partners.partners.map((partner, pIdx) => (
                        <div
                          key={pIdx}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-2"
                        >
                          <span>{partner}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = siteContent.partners.partners.filter((_, i) => i !== pIdx);
                              setSiteContent({
                                ...siteContent,
                                partners: { ...siteContent.partners, partners: updated },
                              });
                            }}
                            className="text-rose-600 hover:text-rose-800 text-xs font-black cursor-pointer"
                            title="Delete Partner"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 5: ADMISSIONS & WORKSTATION RESERVATION */}
              {cmsActiveSection === 'enrollment' && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#15304C]">
                        Admissions &amp; Workstation Booking
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility('enrollment')}
                        disabled={cmsSaving}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          siteContent.enrollment.hidden
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {siteContent.enrollment.hidden ? 'Show on Website' : 'Hide from Website'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetCmsSection('enrollment')}
                        disabled={cmsSaving}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Reset to Default
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsSection('enrollment')}
                        disabled={cmsSaving}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#EE2C3C] text-white hover:bg-[#D71E2E] shadow-xs transition-colors cursor-pointer"
                      >
                        {cmsSaving ? 'Publishing...' : 'Save & Publish Section'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Badge Text
                      </label>
                      <input
                        type="text"
                        value={siteContent.enrollment.badge}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            enrollment: { ...siteContent.enrollment, badge: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={siteContent.enrollment.heading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            enrollment: { ...siteContent.enrollment, heading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Section Subheading
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.enrollment.subheading}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            enrollment: { ...siteContent.enrollment, subheading: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Admissions Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={siteContent.enrollment.helplinePhone}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            enrollment: { ...siteContent.enrollment, helplinePhone: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Lab Working Hours
                      </label>
                      <input
                        type="text"
                        value={siteContent.enrollment.labHours}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            enrollment: { ...siteContent.enrollment, labHours: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Guarantee Badge / Fee Status
                      </label>
                      <input
                        type="text"
                        value={siteContent.enrollment.guaranteeBadge}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            enrollment: { ...siteContent.enrollment, guaranteeBadge: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 6: FOOTER & ACCREDITATIONS */}
              {cmsActiveSection === 'footer' && (
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-7 space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                    <div>
                      <h3 className="text-xl font-black text-[#15304C]">
                        Footer &amp; Campus Contact
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleSectionVisibility('footer')}
                        disabled={cmsSaving}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          siteContent.footer.hidden
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800 hover:bg-slate-900 text-white'
                        }`}
                      >
                        {siteContent.footer.hidden ? 'Show on Website' : 'Hide from Website'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetCmsSection('footer')}
                        disabled={cmsSaving}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Reset to Default
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSaveCmsSection('footer')}
                        disabled={cmsSaving}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#EE2C3C] text-white hover:bg-[#D71E2E] shadow-xs transition-colors cursor-pointer"
                      >
                        {cmsSaving ? 'Publishing...' : 'Save & Publish Footer'}
                      </button>
                    </div>
                  </div>

                  {/* Pre-Footer Action Banner */}
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-4">
                    <span className="text-xs font-black text-[#15304C] uppercase tracking-wider block">
                      Pre-Footer Action Banner
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Banner Badge
                        </label>
                        <input
                          type="text"
                          value={siteContent.footer.bannerBadge}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              footer: { ...siteContent.footer, bannerBadge: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Banner Heading
                        </label>
                        <input
                          type="text"
                          value={siteContent.footer.bannerHeading}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              footer: { ...siteContent.footer, bannerHeading: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={siteContent.footer.bannerButtonText}
                          onChange={(e) =>
                            setSiteContent({
                              ...siteContent,
                              footer: { ...siteContent.footer, bannerButtonText: e.target.value },
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact & Brand Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        About Institute Description
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.footer.aboutText}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            footer: { ...siteContent.footer, aboutText: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Campus Physical Address
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.footer.address}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            footer: { ...siteContent.footer, address: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={siteContent.footer.phone}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            footer: { ...siteContent.footer, phone: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={siteContent.footer.email}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            footer: { ...siteContent.footer, email: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={siteContent.footer.whatsapp}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            footer: { ...siteContent.footer, whatsapp: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Copyright Notice
                      </label>
                      <input
                        type="text"
                        value={siteContent.footer.copyright}
                        onChange={(e) =>
                          setSiteContent({
                            ...siteContent,
                            footer: { ...siteContent.footer, copyright: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Accreditations List */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Accreditation &amp; Partner Software Badges
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAccreditationName}
                        onChange={(e) => setNewAccreditationName(e.target.value)}
                        placeholder="Enter badge title (e.g. Autodesk, Dassault, Siemens)..."
                        className="flex-1 px-3.5 py-2 rounded-xl border-2 border-slate-200 text-xs text-slate-900 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newAccreditationName.trim()) {
                            setSiteContent({
                              ...siteContent,
                              footer: {
                                ...siteContent.footer,
                                accreditations: [...siteContent.footer.accreditations, newAccreditationName.trim()],
                              },
                            });
                            setNewAccreditationName('');
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#15304C] text-white hover:bg-[#0E2033] cursor-pointer"
                      >
                        Add Badge
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {siteContent.footer.accreditations.map((acc, aIdx) => (
                        <div
                          key={aIdx}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-2"
                        >
                          <span>{acc}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = siteContent.footer.accreditations.filter((_, i) => i !== aIdx);
                              setSiteContent({
                                ...siteContent,
                                footer: { ...siteContent.footer, accreditations: updated },
                              });
                            }}
                            className="text-rose-600 hover:text-rose-800 text-xs font-black cursor-pointer"
                            title="Delete Badge"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* MODAL 1: FULL-SCREEN EDIT COURSE & ACCESS MODAL */}
      {assignModalStudent && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden w-screen h-screen">
          
          {/* Modal Header - Full Screen */}
          <div className="px-6 lg:px-10 py-4 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl lg:text-2xl font-bold text-[#131313]">
                  Edit Course &amp; Student Access
                </h3>
              </div>
              <p className="text-sm text-[#666666] mt-0.5">
                {assignModalStudent.name} &bull; ID: <span className="font-mono font-medium text-[#131313]">{assignModalStudent.studentId}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAssignModalStudent(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer flex items-center space-x-2"
              title="Close Full Screen"
            >
              <span>Close</span>
              <span className="text-lg font-bold leading-none">&times;</span>
            </button>
          </div>

          {/* Modal Body: Left & Right Full-Screen Panels */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* LEFT PANEL: Student Details, Access Toggle, Assigned List (4 cols) */}
            <div className="lg:col-span-4 p-6 lg:p-8 bg-[#F9FAFB] flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-5">
                {/* Student Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="font-bold text-lg text-[#131313]">
                    {assignModalStudent.name}
                  </div>
                  <div className="text-sm text-[#666666] space-y-2">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span>Student ID:</span>
                      <span className="font-mono font-semibold text-[#131313]">{assignModalStudent.studentId}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span>Mobile:</span>
                      <span className="font-mono font-bold text-[#131313]">
                        {assignModalStudent.officialMobile && assignModalStudent.officialMobile !== '-'
                          ? assignModalStudent.officialMobile
                          : (assignModalStudent.mobile && assignModalStudent.mobile !== '-' ? assignModalStudent.mobile : '-')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>Email:</span>
                      <span className="font-medium text-[#131313] truncate max-w-[220px]">{assignModalStudent.email}</span>
                    </div>
                  </div>
                </div>

                {/* Access Status Toggle */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#131313] uppercase tracking-wider">
                      Account Access
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      modalAccessStatus === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {modalAccessStatus === 'active' ? 'Active' : 'Suspended'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setModalAccessStatus('active')}
                      className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        modalAccessStatus === 'active'
                          ? 'bg-[#131313] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Active Access
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalAccessStatus('revoked')}
                      className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        modalAccessStatus === 'revoked'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Revoke Access
                    </button>
                  </div>
                </div>

                {/* Currently Assigned Courses List */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#131313] uppercase tracking-wider">
                      Assigned ({selectedCourseAssignments.length})
                    </span>
                    {selectedCourseAssignments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedCourseAssignments([])}
                        className="text-xs text-rose-600 hover:text-rose-800 cursor-pointer font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {selectedCourseAssignments.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No courses assigned yet. Select courses from the right.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {selectedCourseAssignments.map((title) => (
                        <div
                          key={title}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                        >
                          <span className="font-medium text-[#131313] truncate max-w-[240px]">{title}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleCourseInAssignment(title)}
                            className="text-sm text-rose-600 hover:text-rose-800 px-2 py-0.5 rounded hover:bg-rose-50 cursor-pointer font-bold ml-2"
                            title="Remove course"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: Available Course Catalog (8 cols) - IMAGE 2 TYPE COURSES */}
            <div className="lg:col-span-8 p-6 lg:p-8 bg-white flex flex-col space-y-4 overflow-hidden min-h-0">
              {/* Search Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 flex-shrink-0">
                <div>
                  <h4 className="text-base font-bold text-[#131313] uppercase tracking-wider">
                    Courses Inside Folders ({courses.length})
                  </h4>
                  <p className="text-xs text-[#666666] mt-0.5">
                    Click any course card or &lsquo;+ Add Course&rsquo; to assign or revoke access.
                  </p>
                </div>
                <input
                  type="text"
                  value={modalCourseSearch}
                  onChange={(e) => setModalCourseSearch(e.target.value)}
                  placeholder="Search course title, software, or code..."
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#EE2C3C] text-[#131313]"
                />
              </div>

              {/* Folder Filter Tabs (Matches Image 2 Website Discipline Hub) */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 flex-shrink-0">
                {[
                  { id: 'all', label: `ALL PROGRAMS (${courses.length})` },
                  { id: 'civil', label: `CIVIL & BIM (${courses.filter(c => c.folder === 'civil').length})` },
                  { id: 'mechanical', label: `MECHANICAL CAD/CAE (${courses.filter(c => c.folder === 'mechanical').length})` },
                  { id: 'electrical', label: `ELECTRICAL & AUTOMATION (${courses.filter(c => c.folder === 'electrical').length})` },
                  { id: 'interior', label: `INTERIOR ARCHITECTURE (${courses.filter(c => c.folder === 'interior').length})` },
                  { id: 'ppm', label: `PROJECT MANAGEMENT (PPM) (${courses.filter(c => c.folder === 'ppm').length})` },
                  { id: 'piping', label: `PIPING & PLANT CAD (${courses.filter(c => c.folder === 'piping').length})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalDomainFilter(tab.id)}
                    className={`px-3.5 py-2 text-xs font-bold tracking-wider uppercase transition-colors border shadow-2xs whitespace-nowrap cursor-pointer rounded-lg ${
                      modalDomainFilter === tab.id
                        ? 'bg-[#EE2C3C] border-[#EE2C3C] text-white'
                        : 'bg-white border-slate-200 text-[#131313] hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Courses Grid with Image-2 Style Cards */}
              <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-max pb-4">
                {courses
                  .filter((c) => {
                    if (modalDomainFilter !== 'all' && c.folder !== modalDomainFilter) return false;
                    if (!modalCourseSearch.trim()) return true;
                    const q = modalCourseSearch.toLowerCase();
                    return (
                      c.title.toLowerCase().includes(q) ||
                      c.code.toLowerCase().includes(q) ||
                      (c.software && c.software.toLowerCase().includes(q)) ||
                      (c.domain && c.domain.toLowerCase().includes(q))
                    );
                  })
                  .map((course) => {
                    const isAssigned = selectedCourseAssignments.includes(course.title);
                    const toolList = Array.isArray(course.tools) && course.tools.length > 0
                      ? course.tools
                      : typeof course.software === 'string' && course.software
                      ? course.software.split(',').map((s: string) => s.trim())
                      : ['CAD Suite'];

                    return (
                      <div
                        key={course.id}
                        onClick={() => handleToggleCourseInAssignment(course.title)}
                        className={`bg-white border rounded-xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                          isAssigned
                            ? 'border-[#131313] ring-2 ring-[#131313]'
                            : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div>
                          {/* Course Thumbnail Image Banner (Exact Image 2 Structure) */}
                          <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                            <img
                              src={course.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Stream & Category Badges */}
                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-[#131313]">
                                {(course.folder || 'ENGINEERING').toUpperCase()}
                              </span>
                              <span className="text-[10px] uppercase px-2 py-0.5 bg-white/95 border border-slate-200 text-slate-700 rounded shadow-xs">
                                {course.category || course.code}
                              </span>
                            </div>

                            {/* Fee & Duration Badges */}
                            <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1.5">
                              <span className="bg-[#EE2C3C] text-white px-2 py-0.5 text-[11px] font-bold rounded shadow-xs">
                                ₹{(course.fee || 30000).toLocaleString('en-IN')}
                              </span>
                              <span className="bg-white/95 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-800 font-bold rounded shadow-xs">
                                {course.duration || '8 Weeks'}
                              </span>
                            </div>
                          </div>

                          {/* Course Info */}
                          <div className="p-4">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                              <span>LEVEL: {(course.level || 'PROFESSIONAL').toUpperCase()}</span>
                              {(() => {
                                const revs = adminReviews.filter((r) => r.courseName.toLowerCase().trim() === course.title.toLowerCase().trim());
                                if (revs.length > 0) {
                                  const avg = (revs.reduce((acc, r) => acc + r.rating, 0) / revs.length).toFixed(1);
                                  return (
                                    <span className="text-amber-600 font-bold flex items-center space-x-1">
                                      <span>★ {avg}</span>
                                      <span className="text-slate-400 font-normal">({revs.length})</span>
                                    </span>
                                  );
                                }
                                return <span className="text-emerald-700 font-bold">RATING: {course.rating || '4.9/5.0'}</span>;
                              })()}
                            </div>

                            <h4 className="text-sm font-bold text-[#131313] line-clamp-2 leading-snug group-hover:text-[#EE2C3C] transition-colors">
                              {course.title}
                            </h4>

                            <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                              {course.overview || course.tagline || 'Comprehensive engineering CAD curriculum.'}
                            </p>

                            {/* Software Tools Pills */}
                            <div className="mt-3 flex flex-wrap gap-1">
                              {toolList.slice(0, 3).map((tool: string) => (
                                <span
                                  key={tool}
                                  className="text-[10px] uppercase px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded"
                                >
                                  {tool}
                                </span>
                              ))}
                              {toolList.length > 3 && (
                                <span className="text-[10px] uppercase px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded">
                                  +{toolList.length - 3} MORE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Button */}
                        <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <span className="text-xs text-slate-500 font-mono font-medium">
                            {course.code}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCourseInAssignment(course.title);
                            }}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isAssigned
                                ? 'bg-[#131313] text-white shadow-2xs'
                                : 'bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-2xs'
                            }`}
                          >
                            {isAssigned ? 'Assigned ✓' : '+ Add Course'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Modal Footer - Full Screen Sticky Bottom */}
          <div className="px-6 lg:px-10 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
            <span className="text-sm text-[#666666]">
              <strong className="text-[#131313]">{selectedCourseAssignments.length}</strong> course(s) selected
            </span>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setAssignModalStudent(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingAssignment}
                onClick={handleSaveAssignments}
                className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                {isSavingAssignment ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* MODAL 2: VIEW ENROLLED STUDENTS IN A COURSE */}
      {selectedCourseForStudents && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border-2 border-[#131313]">
            <div className="flex justify-between items-start pb-4 border-b-2 border-[#E2E8F0]">
              <div>
                <span className="text-xs font-black text-[#EE2C3C] uppercase tracking-wider block">
                  COURSE ENROLLMENT LIST
                </span>
                <h3 className="text-xl font-black text-[#131313]">
                  {selectedCourseForStudents.title}
                </h3>
                <span className="text-xs font-mono font-bold text-[#64748B]">
                  {selectedCourseForStudents.code} &bull; {selectedCourseForStudents.domain}
                </span>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedCourseForStudents(null)} />
            </div>

            {/* Students taking this course */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {(() => {
                const enrolled = students.filter((s) =>
                  s.assignedCourses?.some(
                    (c) => c.toLowerCase().trim() === selectedCourseForStudents.title.toLowerCase().trim()
                  )
                );

                if (enrolled.length === 0) {
                  return (
                    <div className="py-8 text-center text-sm font-bold text-[#64748B]">
                      No students currently assigned to this course track.
                    </div>
                  );
                }

                return enrolled.map((stu) => (
                  <div
                    key={stu.id}
                    className="p-4 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center"
                  >
                    <div>
                      <span className="text-sm font-black text-[#131313] block">{stu.name}</span>
                      <span className="text-xs text-[#64748B] font-semibold">
                        {stu.studentId} &bull; {stu.college} &bull; {stu.officialMobile}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        stu.accessStatus === 'active'
                          ? 'bg-[#DCFCE7] text-[#166534]'
                          : 'bg-[#FEE2E2] text-[#991B1B]'
                      }`}
                    >
                      {stu.accessStatus === 'active' ? '[ACTIVE]' : '[REVOKED]'}
                    </span>
                  </div>
                ));
              })()}
            </div>

            <div className="pt-2 flex justify-end border-t-2 border-[#E2E8F0]">
              <button
                onClick={() => setSelectedCourseForStudents(null)}
                className="px-6 py-2.5 rounded-xl bg-[#131313] text-[#FFFFFF] text-sm sm:text-base font-bold"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW STUDENT DESIGNS */}
      {selectedStudentForDesign && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border-2 border-[#131313]">
            <div className="flex justify-between items-center pb-3 border-b-2 border-[#E2E8F0]">
              <div>
                <h3 className="text-lg font-black text-[#131313]">
                  {selectedStudentForDesign.name}'s CAD Designs
                </h3>
                <span className="text-xs text-[#64748B] font-semibold">{selectedStudentForDesign.courseName}</span>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedStudentForDesign(null)} />
            </div>

            <div className="space-y-2">
              {selectedStudentForDesign.designs && selectedStudentForDesign.designs.length > 0 ? (
                selectedStudentForDesign.designs.map((des, idx) => (
                  <div key={idx} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex justify-between items-center">
                    <span className="text-sm sm:text-base font-semibold text-[#131313]">{des}</span>
                    <button
                      onClick={() => showToast(`Inspecting CAD 3D layers for ${des}...`)}
                      className="px-3 py-1.5 rounded bg-[#2563EB] text-[#FFFFFF] text-xs font-bold"
                    >
                      INSPECT 3D
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-[#64748B]">No CAD files submitted yet.</div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentForDesign(null)}
                className="px-5 py-2.5 rounded-xl bg-[#131313] text-[#FFFFFF] text-sm sm:text-base font-bold"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD NEW STUDENT ADMISSION - FULL-SCREEN EDGE-TO-EDGE UTILIZING LEFT & RIGHT SPACES */}
      {showAddStudentModal && (() => {
        const calculatedBalance = Math.max(0, (Number(newStudent.courseFee) || 0) - (Number(newStudent.paidFee) || 0));

        const filteredAdmissionCourses = courses.filter((c) => {
          if (admissionFolderFilter !== 'all' && c.folder !== admissionFolderFilter) return false;
          if (!admissionCourseSearch.trim()) return true;
          const q = admissionCourseSearch.toLowerCase();
          return (
            c.title.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.software.toLowerCase().includes(q) ||
            (c.domain && c.domain.toLowerCase().includes(q))
          );
        });

        return (
          <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden w-screen h-screen">
            {/* Modal Header - Full Screen Edge-to-Edge */}
            <div className="px-6 lg:px-10 py-4 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-[#131313]">
                  Add New Student Admission
                </h3>
                <p className="text-sm text-[#666666] mt-0.5">
                  Enter student information and assign courses from the folders below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer flex items-center space-x-2"
                title="Close Full Screen"
              >
                <span>Close</span>
                <span className="text-lg font-bold leading-none">&times;</span>
              </button>
            </div>

            {/* Modal Body: Left (4 cols) & Right (8 cols) Full-Screen Panels */}
            <form onSubmit={handleAddNewStudent} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                
                {/* LEFT PANEL: Student Personal Details, Fees & Assigned Courses (4 cols) */}
                <div className="lg:col-span-4 xl:col-span-4 p-6 lg:p-8 bg-[#F9FAFB] flex flex-col justify-between space-y-5 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold text-[#131313] uppercase tracking-wider block">
                        Student Information
                      </span>
                      <p className="text-xs text-[#666666] mt-0.5">
                        Official enrollment profile and credentials.
                      </p>
                    </div>

                    {/* Student Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#131313] mb-1">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2C3C] bg-white text-[#131313]"
                      />
                    </div>

                    {/* Student Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-[#131313] mb-1">
                        Student Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        placeholder="e.g. rahul.sharma@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2C3C] bg-white text-[#131313]"
                      />
                      <p className="text-xs text-[#666666] mt-1">
                        Admission confirmation &amp; login credentials will be emailed here.
                      </p>
                    </div>

                    {/* Mobile & College in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#131313] mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newStudent.mobile}
                          onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })}
                          placeholder="+91 98490 12345"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2C3C] bg-white text-[#131313]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#131313] mb-1">
                          College / Institute
                        </label>
                        <input
                          type="text"
                          value={newStudent.college}
                          onChange={(e) => setNewStudent({ ...newStudent, college: e.target.value })}
                          placeholder="e.g. Osmania / JNTU"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2C3C] bg-white text-[#131313]"
                        />
                      </div>
                    </div>

                    {/* Fees Breakdown Card */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                      <span className="text-xs font-bold text-[#131313] uppercase tracking-wider block">
                        Fee Breakdown (INR)
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Total Fee (Rs)</label>
                          <input
                            type="number"
                            min="0"
                            value={newStudent.courseFee}
                            onChange={(e) => setNewStudent({ ...newStudent, courseFee: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white text-[#131313]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">Paid Fee (Rs)</label>
                          <input
                            type="number"
                            min="0"
                            value={newStudent.paidFee}
                            onChange={(e) => setNewStudent({ ...newStudent, paidFee: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white text-[#131313]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500 font-medium">Balance Due:</span>
                        <span className={`font-mono font-bold ${calculatedBalance > 0 ? 'text-[#EE2C3C]' : 'text-emerald-700'}`}>
                          Rs. {calculatedBalance.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Currently Assigned Courses List */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#131313] uppercase tracking-wider">
                          Assigned Courses ({admissionAssignedCourses.length})
                        </span>
                        {admissionAssignedCourses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setAdmissionAssignedCourses([])}
                            className="text-xs text-rose-600 hover:text-rose-800 cursor-pointer font-medium"
                          >
                            Clear All
                          </button>
                        )}
                      </div>

                      {admissionAssignedCourses.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                          No courses assigned yet. Select from the catalog on the right.
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {admissionAssignedCourses.map((title) => (
                            <div
                              key={title}
                              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                            >
                              <span className="font-medium text-[#131313] truncate max-w-[210px]">{title}</span>
                              <button
                                type="button"
                                onClick={() => handleToggleAdmissionCourse(title)}
                                className="text-xs text-rose-600 hover:text-rose-800 px-1.5 py-0.5 rounded hover:bg-rose-50 cursor-pointer font-bold ml-1"
                                title="Remove course"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL: Courses inside Folders (8 cols - IMAGE 2 TYPE CARDS) */}
                <div className="lg:col-span-8 xl:col-span-8 p-6 lg:p-8 bg-white flex flex-col space-y-4 overflow-hidden min-h-0">
                  {/* Header & Search */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 flex-shrink-0">
                    <div>
                      <h4 className="text-base font-bold text-[#131313] uppercase tracking-wider block">
                        Courses Catalog ({courses.length})
                      </h4>
                      <p className="text-xs text-[#666666] mt-0.5">
                        Select courses inside the folders to assign to this student:
                      </p>
                    </div>
                    <input
                      type="text"
                      value={admissionCourseSearch}
                      onChange={(e) => setAdmissionCourseSearch(e.target.value)}
                      placeholder="Search courses or software..."
                      className="px-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#EE2C3C] text-[#131313]"
                    />
                  </div>

                  {/* Folder Filter Tabs (Matches Image 2 Website Discipline Hub) */}
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1 flex-shrink-0">
                    {[
                      { id: 'all', label: `ALL PROGRAMS (${courses.length})` },
                      { id: 'civil', label: `CIVIL & BIM (${courses.filter(c => c.folder === 'civil').length})` },
                      { id: 'mechanical', label: `MECHANICAL CAD/CAE (${courses.filter(c => c.folder === 'mechanical').length})` },
                      { id: 'electrical', label: `ELECTRICAL & AUTOMATION (${courses.filter(c => c.folder === 'electrical').length})` },
                      { id: 'interior', label: `INTERIOR ARCHITECTURE (${courses.filter(c => c.folder === 'interior').length})` },
                      { id: 'ppm', label: `PROJECT MANAGEMENT (PPM) (${courses.filter(c => c.folder === 'ppm').length})` },
                      { id: 'piping', label: `PIPING & PLANT CAD (${courses.filter(c => c.folder === 'piping').length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setAdmissionFolderFilter(tab.id)}
                        className={`px-3.5 py-2 text-xs font-bold tracking-wider uppercase transition-colors border shadow-2xs whitespace-nowrap cursor-pointer rounded-lg ${
                          admissionFolderFilter === tab.id
                            ? 'bg-[#EE2C3C] border-[#EE2C3C] text-white'
                            : 'bg-white border-slate-200 text-[#131313] hover:bg-slate-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Course Cards Grid (Exact Image 2 Presentation - 3 to 4 columns filling full screen width) */}
                  <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-max pb-4">
                    {filteredAdmissionCourses.map((c) => {
                      const isAssigned = admissionAssignedCourses.includes(c.title);
                      const toolList = Array.isArray(c.tools) && c.tools.length > 0
                        ? c.tools
                        : typeof c.software === 'string' && c.software
                        ? c.software.split(',').map((s: string) => s.trim())
                        : ['CAD Suite'];

                      return (
                        <div
                          key={c.id}
                          onClick={() => handleToggleAdmissionCourse(c.title)}
                          className={`bg-white border rounded-xl overflow-hidden transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                            isAssigned
                              ? 'border-[#131313] ring-2 ring-[#131313]'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div>
                            {/* Thumbnail Image Banner */}
                            <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                              <img
                                src={c.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'}
                                alt={c.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-white border border-slate-300 rounded shadow-xs text-[#131313]">
                                  {(c.folder || 'ENGINEERING').toUpperCase()}
                                </span>
                                <span className="text-[9px] uppercase px-1.5 py-0.5 bg-white/95 border border-slate-200 text-slate-700 rounded shadow-xs">
                                  {c.code}
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-2 flex items-center space-x-1">
                                <span className="bg-[#EE2C3C] text-white px-1.5 py-0.5 text-[10px] font-bold rounded shadow-xs">
                                  ₹{(c.fee || 25000).toLocaleString('en-IN')}
                                </span>
                                <span className="bg-white/95 border border-slate-200 px-1.5 py-0.5 text-[9px] text-slate-800 font-bold rounded shadow-xs">
                                  {c.duration || '8 Weeks'}
                                </span>
                              </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-3.5">
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                                <span>LEVEL: {(c.level || 'PROFESSIONAL').toUpperCase()}</span>
                                {(() => {
                                  const revs = adminReviews.filter((r) => r.courseName.toLowerCase().trim() === c.title.toLowerCase().trim());
                                  if (revs.length > 0) {
                                    const avg = (revs.reduce((acc, r) => acc + r.rating, 0) / revs.length).toFixed(1);
                                    return (
                                      <span className="text-amber-600 font-bold flex items-center space-x-1">
                                        <span>★ {avg}</span>
                                        <span className="text-slate-400 font-normal">({revs.length})</span>
                                      </span>
                                    );
                                  }
                                  return <span className="text-emerald-700 font-bold">RATING: {c.rating || '4.9/5.0'}</span>;
                                })()}
                              </div>

                              <h5 className="text-xs sm:text-sm font-bold text-[#131313] line-clamp-1 leading-snug group-hover:text-[#EE2C3C] transition-colors">
                                {c.title}
                              </h5>

                              <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                {c.overview || c.tagline || 'Comprehensive engineering CAD curriculum.'}
                              </p>

                              {/* Tools */}
                              <div className="mt-2.5 flex flex-wrap gap-1">
                                {toolList.slice(0, 2).map((t: string) => (
                                  <span
                                    key={t}
                                    className="text-[9px] uppercase px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded"
                                  >
                                    {t}
                                  </span>
                                ))}
                                {toolList.length > 2 && (
                                  <span className="text-[9px] uppercase px-1 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded">
                                    +{toolList.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Card Footer Button */}
                          <div className="p-3 pt-1.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <span className="text-[11px] text-slate-500 font-mono">
                              {c.code}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleAdmissionCourse(c.title);
                              }}
                              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                                isAssigned
                                  ? 'bg-[#131313] text-white'
                                  : 'bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-2xs'
                              }`}
                            >
                              {isAssigned ? 'Assigned ✓' : '+ Add Course'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Full Screen Sticky Bottom */}
              <div className="px-6 lg:px-10 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center space-x-3 text-sm text-[#666666]">
                  <span>
                    <strong className="text-[#131313]">{admissionAssignedCourses.length}</strong> course(s) assigned
                  </span>
                  <span>&bull;</span>
                  <span>
                    Credentials will be emailed to <strong className="text-[#131313]">{newStudent.email || 'student email'}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAdmission}
                    className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmittingAdmission ? 'SAVING...' : 'SAVE ADMISSION & SEND EMAIL'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      })()}

      {/* MODAL: CREATE DISCIPLINE FOLDER (Lightweight: Folder Name & Image only) */}
      {showAddFolderModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] w-full max-w-xl rounded-2xl shadow-2xl border-2 border-[#CBD5E1] overflow-hidden flex flex-col my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#FFFFFF] border-b-2 border-[#E2E8F0]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-white flex items-center justify-center shadow-md font-black text-lg">
                  📁
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#131313]">Create New Folder</h3>
                  <p className="text-xs text-slate-500 font-medium">Add a discipline / stream folder to organize courses</p>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setShowAddFolderModal(false)} />
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateFolder} className="p-6 space-y-5 bg-[#F8FAFC]">
              {/* Folder Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Folder / Discipline Name <span className="text-[#EE2C3C]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newFolderForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const logo = name.trim().split(' ')[0]?.slice(0, 5).toUpperCase() || 'CAD';
                    setNewFolderForm({
                      ...newFolderForm,
                      name,
                      logoText: newFolderForm.logoText === 'CAD' || !newFolderForm.logoText ? logo : newFolderForm.logoText,
                    });
                  }}
                  placeholder="e.g. Robotics & Automation, Civil Engineering, Piping & Pipeline"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-semibold text-slate-900 bg-white focus:outline-none focus:border-[#131313] transition-colors"
                />
              </div>

              {/* Folder Image / Banner */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Folder Banner Image <span className="text-[#EE2C3C]">*</span>
                  </label>
                  <label className="text-xs text-[#EE2C3C] font-bold hover:underline cursor-pointer flex items-center space-x-1">
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setNewFolderForm((prev) => ({ ...prev, image: reader.result as string }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={newFolderForm.image}
                  onChange={(e) => setNewFolderForm({ ...newFolderForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 font-medium text-xs text-slate-800 bg-white focus:outline-none focus:border-[#131313] transition-colors"
                />
              </div>

              {/* Quick Image Presets */}
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Or pick a preset discipline image:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Civil / BIM', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80' },
                    { label: 'Mechanical', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80' },
                    { label: 'Electrical', url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1200&q=80' },
                    { label: 'Architecture', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewFolderForm({ ...newFolderForm, image: preset.url })}
                      className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                        newFolderForm.image === preset.url
                          ? 'border-[#EE2C3C] ring-2 ring-red-200 bg-red-50/50'
                          : 'border-slate-200 bg-white hover:border-slate-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover rounded mb-1" />
                      <span className="block text-[10px] font-bold text-slate-700 truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Box */}
              {newFolderForm.image && (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs p-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Folder Card Preview:
                  </div>
                  <div className="relative h-28 w-full rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={newFolderForm.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/75 text-white text-[10px] font-bold uppercase tracking-wider">
                      {newFolderForm.name.trim() || 'New Discipline'}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddFolderModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD NEW COURSE (Full Screen Responsive Blueprint Builder) */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200">
          <div className="w-full h-full bg-[#FFFFFF] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 sm:px-10 py-4 bg-[#FFFFFF] border-b-2 border-[#E2E8F0] shadow-sm flex-shrink-0">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-[#FFFFFF] flex items-center justify-center shadow-md font-black text-xl">
                  +
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-[#EE2C3C] uppercase tracking-wider block">
                    CURRICULUM SPECIFICATION BUILDER &bull; REAL-TIME LIVE SYNC
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Create New CAD Course Blueprint
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setShowAddCourseModal(false)} />
            </div>

            {/* Sticky Order-Wise Quick Jump Navigation Bar (10 Sections) */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 sm:px-10 py-2.5 flex items-center space-x-2 overflow-x-auto no-scrollbar flex-shrink-0">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap mr-2">
                Order-Wise Sections:
              </span>
              {[
                { id: 'add-sec-1', coreId: 'sec-1', label: '1. Hero & Basics' },
                { id: 'add-sec-2', coreId: 'sec-2', label: '2. Academic Facts' },
                { id: 'add-sec-3', coreId: 'sec-3', label: '3. Overview' },
                { id: 'add-sec-4', coreId: 'sec-4', label: '4. Training Highlights' },
                { id: 'add-sec-5', coreId: 'sec-5', label: '5. Lab & Guarantees' },
                { id: 'add-sec-6', coreId: 'sec-6', label: '6. Syllabus Units' },
                { id: 'add-sec-7', coreId: 'sec-7', label: '7. Career Path' },
                { id: 'add-sec-8', coreId: 'sec-8', label: '8. Certificate' },
                { id: 'add-sec-9', coreId: 'sec-9', label: '9. Capstone Project' },
                { id: 'add-sec-10', coreId: 'sec-10', label: '10. FAQs' },
              ].map((sec) => {
                const isHidden = (newCourse.hiddenSections || []).includes(sec.coreId);
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                      isHidden
                        ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 ring-1 ring-amber-300'
                        : 'bg-white border-slate-300 hover:border-slate-800 text-slate-800 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    <span>{sec.label}</span>
                    {isHidden && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-black uppercase">
                        HIDDEN
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Form Body - Single Column Logical Website Order with High Visibility */}
            <form onSubmit={handleAddNewCourse} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#F8FAFC]">
              <div className="max-w-[1440px] mx-auto space-y-8">
                
                {/* 1. HERO & BASIC COURSE IDENTIFICATION */}
                <div id="add-sec-1" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-[#EE2C3C] text-white flex items-center justify-center font-mono font-black text-sm">
                        01
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Course Identification, Commercials &amp; Hero Banner
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Controls the course card on catalog pages, sticky header, and top hero banner on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-1"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-1"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  {/* Title & Tagline */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Course Title <span className="text-[#EE2C3C]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newCourse.title}
                        onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                        placeholder="e.g. Mechanical CAD/CAM/CAE Diploma"
                        className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-300 font-bold text-base sm:text-lg text-slate-900 bg-white focus:outline-none focus:border-slate-900 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Tagline / Hero Subtitle <span className="text-slate-400 font-normal">(Shown directly under title)</span>
                      </label>
                      <input
                        type="text"
                        value={newCourse.tagline || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, tagline: e.target.value })}
                        placeholder="e.g. Autodesk Authorized Revit BIM Professional Certification"
                        className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-300 font-semibold text-base text-slate-900 bg-white focus:outline-none focus:border-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Folder, Code, Category, Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Discipline / Folder *</label>
                      <select
                        value={newCourse.folder}
                        onChange={(e) => {
                          const chosenFolderId = e.target.value;
                          const chosenFolderObj = foldersList.find((f) => f.id === chosenFolderId);
                          setNewCourse({
                            ...newCourse,
                            folder: chosenFolderId,
                            domain: chosenFolderObj?.name || newCourse.domain,
                          });
                        }}
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      >
                        {foldersList.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.code || 'FOLDER'} - {folder.shortName || folder.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Course Code</label>
                      <input
                        type="text"
                        value={newCourse.code}
                        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                        placeholder="e.g. CAD-MEC-90"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold font-mono text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Category Badge</label>
                      <input
                        type="text"
                        value={newCourse.category || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                        placeholder="e.g. PARAMETRIC BIM"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Course Level</label>
                      <select
                        value={newCourse.level || 'Professional'}
                        onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Master Program">Master Program</option>
                        <option value="Certification">Certification</option>
                      </select>
                    </div>
                  </div>

                  {/* Commercial Stats Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Standard Tuition Fee (₹) *</label>
                      <input
                        type="number"
                        required
                        value={newCourse.fee}
                        onChange={(e) => setNewCourse({ ...newCourse, fee: Number(e.target.value) })}
                        className="w-full p-3.5 rounded-xl border-2 border-emerald-300 font-black text-lg text-emerald-700 bg-emerald-50/20 focus:outline-none focus:border-emerald-600 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Duration Label</label>
                      <input
                        type="text"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                        placeholder="e.g. 12 Weeks (120 Hours)"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Total Lab Hours</label>
                      <input
                        type="number"
                        value={newCourse.totalHours || 120}
                        onChange={(e) => setNewCourse({ ...newCourse, totalHours: Number(e.target.value) || 120 })}
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Course Visibility Status</label>
                      <select
                        value={newCourse.status}
                        onChange={(e) =>
                          setNewCourse({ ...newCourse, status: e.target.value as 'Active' | 'Inactive' })
                        }
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white"
                      >
                        <option value="Active">Active (Visible on Website)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* Primary Course Banner Image */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm sm:text-base font-bold text-slate-800">
                        Primary Course Banner Image (Hero Banner &amp; Catalog) <span className="text-[#EE2C3C]">*</span>
                      </label>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                        High-Resolution Architectural/Engineering Specimen
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newCourse.image || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white focus:outline-none focus:border-slate-900 shadow-2xs"
                      />
                      <label className="px-6 py-3.5 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm transition-all">
                        <span>{isUploadingMedia ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'courseImage');
                          }}
                        />
                      </label>
                    </div>

                    {newCourse.image && (
                      <div className="mt-3 h-48 w-full rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-950 relative shadow-inner">
                        <img
                          src={newCourse.image}
                          alt="Primary Course Banner"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg font-mono">
                          Live Hero Banner Preview
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. ACADEMIC FACTS & 4 PILLARS */}
                <div id="add-sec-2" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        02
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Academic Facts &amp; Eligibility (4 Live Pillars)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section A &ldquo;Course Academic Facts &amp; Eligibility&rdquo; 4-pillar cards on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-2"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-2"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 1: Eligibility &amp; Prerequisites
                      </label>
                      <input
                        type="text"
                        value={newCourse.prerequisites || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, prerequisites: e.target.value })}
                        placeholder="e.g. Basic understanding of architectural floor plans and building layouts"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 2: Awarded Credential Title
                      </label>
                      <input
                        type="text"
                        value={newCourse.awardedCredential || newCourse.certification || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, awardedCredential: e.target.value })}
                        placeholder="e.g. Autodesk Certified Professional: Revit Architecture (ACP)"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 3: Training Mode &amp; Lab Access
                      </label>
                      <input
                        type="text"
                        value={newCourse.mode || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, mode: e.target.value })}
                        placeholder="e.g. Classroom & Dedicated CAD Workstation Lab"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 4: Software Tools &amp; Authorized Toolchain
                      </label>
                      <input
                        type="text"
                        value={newCourse.software}
                        onChange={(e) => setNewCourse({ ...newCourse, software: e.target.value })}
                        placeholder="e.g. Autodesk Revit 2026, Navisworks Manage, BIM 360, Enscape"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. COURSE OVERVIEW & LEARNING OBJECTIVES */}
                <div id="add-sec-3" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-mono font-black text-sm">
                        03
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Course Overview &amp; Learning Objectives
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches the dedicated narrative card with the red indicator pill on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-3"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-3"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Comprehensive Syllabus Overview &amp; Project Description
                    </label>
                    <textarea
                      rows={4}
                      value={newCourse.overview || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, overview: e.target.value })}
                      placeholder="Master end-to-end architectural BIM workflows from parametric floor layout generation, structural walls, and curtain systems to multi-disciplinary clash detection and construction sequencing."
                      className="w-full p-4 rounded-xl border-2 border-slate-300 font-medium text-base text-slate-900 bg-white focus:outline-none focus:border-slate-900 leading-relaxed shadow-2xs"
                    />
                  </div>
                </div>

                {/* 4. TRAINING HIGHLIGHTS (6 CARDS: TITLE & DESCRIPTION) */}
                <div id="add-sec-4" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        04
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Training Highlights (Hallmark Value Props &bull; {newCourse.trainingHighlights?.length || 0} Cards)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section B &ldquo;Training Highlights&rdquo; 6-card grid with red indicator pill on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-4"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-4"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(newCourse.trainingHighlights || []).map((thItem, thIdx) => (
                      <div key={thIdx} className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 font-mono font-bold text-xs">
                            CARD 0{thIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const list = (newCourse.trainingHighlights || []).filter((_, i) => i !== thIdx);
                              setNewCourse({ ...newCourse, trainingHighlights: list });
                            }}
                            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Remove Card
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={thItem.title}
                            onChange={(e) => {
                              const list = [...(newCourse.trainingHighlights || [])];
                              list[thIdx] = { ...list[thIdx], title: e.target.value };
                              setNewCourse({ ...newCourse, trainingHighlights: list });
                            }}
                            placeholder="e.g. Instructor Led Training"
                            className="w-full p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border border-slate-300 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                            Card Description
                          </label>
                          <textarea
                            rows={3}
                            value={thItem.desc}
                            onChange={(e) => {
                              const list = [...(newCourse.trainingHighlights || [])];
                              list[thIdx] = { ...list[thIdx], desc: e.target.value };
                              setNewCourse({ ...newCourse, trainingHighlights: list });
                            }}
                            placeholder="e.g. Expert CAD trainers with 10+ years EPC project experience."
                            className="w-full p-3 text-xs sm:text-sm font-medium text-slate-700 bg-white rounded-xl border border-slate-300 shadow-2xs leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. WORKSTATION LAB PHOTO, LAB GUARANTEES & CORE COMPETENCIES */}
                <div id="add-sec-5" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        05
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Workstation Lab Photo, Lab Guarantees &amp; Core Competencies
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section C split card (Ameerpet Lab Workstation Photo &amp; Core Competencies) and the &ldquo;Lab &amp; Workstation Guarantee&rdquo; sidebar card.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-5"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-5"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  {/* Part A: Secondary Workstation Lab Photo */}
                  <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm sm:text-base font-bold text-slate-800">
                        Secondary Lab Image (Ameerpet Workstation Lab Photo)
                      </label>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                        Workstation Showcase
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newCourse.labImage || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, labImage: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                        className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                      />
                      <label className="px-6 py-3.5 bg-[#15304C] hover:bg-[#0f2338] text-white text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm transition-all">
                        <span>{isUploadingMedia ? 'Uploading...' : 'Upload Lab Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'labImage');
                          }}
                        />
                      </label>
                    </div>

                    {newCourse.labImage && (
                      <div className="mt-2 h-44 w-full rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-900 relative shadow-inner">
                        <img
                          src={newCourse.labImage}
                          alt="Ameerpet Workstation Lab"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 bg-[#15304C]/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                          Ameerpet Workstation Lab Photo Preview
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part B: Lab & Workstation Guarantee (Sidebar 4 Key Points) */}
                  <div className="p-5 bg-emerald-50/50 rounded-2xl border-2 border-emerald-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-emerald-200 gap-3">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-emerald-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          Lab &amp; Workstation Guarantee ({newCourse.labGuarantees?.length || 0} Checkpoints)
                        </span>
                        <p className="text-xs text-emerald-700">
                          These items render in the &ldquo;Lab &amp; Workstation Guarantee&rdquo; card on the live website sidebar.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const cur = newCourse.labGuarantees || [];
                          setNewCourse({
                            ...newCourse,
                            labGuarantees: [...cur, 'Dedicated RTX Workstation & High-Speed Internet'],
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold uppercase transition-all shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        + Add Guarantee Point
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(newCourse.labGuarantees || []).map((guarantee, gIdx) => (
                        <div key={gIdx} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-200">
                          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                            ✓
                          </span>
                          <input
                            type="text"
                            value={guarantee}
                            onChange={(e) => {
                              const list = [...(newCourse.labGuarantees || [])];
                              list[gIdx] = e.target.value;
                              setNewCourse({ ...newCourse, labGuarantees: list });
                            }}
                            className="flex-1 p-2.5 sm:p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = (newCourse.labGuarantees || []).filter((_, i) => i !== gIdx);
                              setNewCourse({ ...newCourse, labGuarantees: list });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part C: Core Competencies Checklist Builder */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-slate-800">
                          Core Competencies Checklist ({newCourse.highlights?.length || 0} Items)
                        </span>
                        <p className="text-xs text-slate-500">
                          These items render with green checkmarks (✓) next to the lab workstation photo on the live website.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const cur = newCourse.highlights || [];
                          setNewCourse({
                            ...newCourse,
                            highlights: [...cur, `Live industrial modeling with ${newCourse.software?.split(',')[0] || 'CAD Suite'}`],
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold uppercase transition-all shadow-sm cursor-pointer"
                      >
                        + Add Core Competency
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(newCourse.highlights || []).map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-center space-x-3 bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200">
                          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                            ✓
                          </span>
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => {
                              const list = [...(newCourse.highlights || [])];
                              list[hIdx] = e.target.value;
                              setNewCourse({ ...newCourse, highlights: list });
                            }}
                            className="flex-1 p-2.5 sm:p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = (newCourse.highlights || []).filter((_, i) => i !== hIdx);
                              setNewCourse({ ...newCourse, highlights: list });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. COURSE CONTENTS & MODULE SYLLABUS BREAKDOWN */}
                <div id="add-sec-6" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-[#EE2C3C] text-white flex items-center justify-center font-mono font-black text-sm">
                        06
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Course Contents &amp; Units Breakdown ({newCourse.modules?.length || 0} Units)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section D interactive syllabus accordions with lab hours and bullet topics.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-6"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-6"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(newCourse.modules || []).map((mod, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-lg bg-[#EE2C3C] text-white font-mono font-black text-sm">
                            MODULE {mod.number}
                          </span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={mod.hours}
                              onChange={(e) => {
                                const updated = [...(newCourse.modules || [])];
                                updated[idx] = { ...updated[idx], hours: Number(e.target.value) || 20 };
                                setNewCourse({ ...newCourse, modules: updated });
                              }}
                              className="w-20 p-2 border-2 border-slate-300 rounded-lg text-sm text-center font-black bg-white"
                              title="Lab Hours"
                            />
                            <span className="text-xs font-bold text-slate-700">LAB HRS</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (newCourse.modules || []).filter((_, i) => i !== idx);
                                setNewCourse({
                                  ...newCourse,
                                  modules: updated,
                                  syllabusText: updated.map((m) => m.title).join('\n'),
                                });
                              }}
                              className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer ml-2 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Module / Unit Title</label>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => {
                              const updated = [...(newCourse.modules || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setNewCourse({
                                ...newCourse,
                                modules: updated,
                                syllabusText: updated.map((m) => m.title).join('\n'),
                              });
                            }}
                            placeholder="Module Title"
                            className="w-full p-3 rounded-xl border-2 border-slate-300 text-sm sm:text-base font-bold text-slate-900 bg-white shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Topics Covered (Comma Separated)</label>
                          <input
                            type="text"
                            value={(mod.topics || []).join(', ')}
                            onChange={(e) => {
                              const updated = [...(newCourse.modules || [])];
                              updated[idx] = {
                                ...updated[idx],
                                topics: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              };
                              setNewCourse({ ...newCourse, modules: updated });
                            }}
                            placeholder="Topics separated by comma"
                            className="w-full p-3 rounded-xl border-2 border-slate-300 text-sm font-medium text-slate-800 bg-white shadow-2xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. CAREER PROGRESSION PATH (FAN INFOGRAPHIC STEP BUILDER) */}
                <div id="add-sec-7" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        07
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Career Progression Path ({newCourse.careerPathways?.length || 0} Steps)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section E Career Infographic Fan Cards (Experience Range, Job Role, and Expected Compensation CTC).
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-7"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-7"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="space-y-4">
                    {(newCourse.careerPathways || []).map((stepItem, sIdx) => (
                      <div key={sIdx} className="p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-lg bg-[#15304C] text-white font-mono font-black text-sm">
                            STEP {stepItem.step || String(sIdx + 1).padStart(2, '0')}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = (newCourse.careerPathways || []).filter((_, i) => i !== sIdx);
                              setNewCourse({ ...newCourse, careerPathways: cur });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Remove Step
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">
                              Experience Range
                            </label>
                            <input
                              type="text"
                              value={stepItem.experience}
                              onChange={(e) => {
                                const cur = [...(newCourse.careerPathways || [])];
                                cur[sIdx] = { ...cur[sIdx], experience: e.target.value };
                                setNewCourse({ ...newCourse, careerPathways: cur });
                              }}
                              placeholder="e.g. 0 – 2 Yrs"
                              className="w-full p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border-2 border-slate-300 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">
                              Job Role Title
                            </label>
                            <input
                              type="text"
                              value={stepItem.role}
                              onChange={(e) => {
                                const cur = [...(newCourse.careerPathways || [])];
                                cur[sIdx] = { ...cur[sIdx], role: e.target.value };
                                setNewCourse({ ...newCourse, careerPathways: cur });
                              }}
                              placeholder="e.g. BIM Architectural Modeler"
                              className="w-full p-3 text-sm sm:text-base font-black text-slate-900 bg-white rounded-xl border-2 border-slate-300 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider mb-1">
                              Expected CTC Range
                            </label>
                            <input
                              type="text"
                              value={stepItem.ctc}
                              onChange={(e) => {
                                const cur = [...(newCourse.careerPathways || [])];
                                cur[sIdx] = { ...cur[sIdx], ctc: e.target.value };
                                setNewCourse({ ...newCourse, careerPathways: cur });
                              }}
                              placeholder="e.g. ₹4.5L – ₹9.0L PA"
                              className="w-full p-3 text-sm sm:text-base font-black text-emerald-700 bg-emerald-50/50 rounded-xl border-2 border-emerald-300 shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. OFFICIAL CERTIFICATE OF COMPLETION */}
                <div id="add-sec-8" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        08
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Official Certificate of Completion Specimen
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section F &ldquo;How will you get your certificate?&rdquo; on the live website. Leave blank to show the ISO certificate specimen, or upload custom.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-8"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-8"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Certificate Sample Specimen Image URL / File Upload
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={newCourse.certificateImage || ''}
                        onChange={(e) => setNewCourse({ ...newCourse, certificateImage: e.target.value })}
                        placeholder="Leave blank to use generated official ISO certificate specimen, or paste image URL"
                        className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                      />
                      <label className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm transition-all">
                        <span>{isUploadingMedia ? 'Uploading...' : 'Upload Certificate'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'certificateImage');
                          }}
                        />
                      </label>
                    </div>

                    {newCourse.certificateImage && (
                      <div className="mt-3 h-52 w-full rounded-2xl overflow-hidden border-2 border-amber-300 bg-white relative shadow-inner flex items-center justify-center p-2">
                        <img
                          src={newCourse.certificateImage}
                          alt="Certificate Specimen"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-3 right-3 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md font-mono">
                          Live Certificate Specimen Preview
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 9. DUAL CERTIFICATION & INDUSTRY CAPSTONE PROJECT */}
                <div id="add-sec-9" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        09
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Dual Certification &amp; Industry Capstone Project (Mandatory Portfolio)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section G &ldquo;Dual Certification &amp; Industry Capstone Project&rdquo; on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-9"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-9"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Portfolio Project Title
                    </label>
                    <input
                      type="text"
                      value={newCourse.capstoneTitle || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, capstoneTitle: e.target.value })}
                      placeholder="e.g. Commercial Complex 5-Story BIM Model with Multi-Trade Clash Report"
                      className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-base text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Project Description
                    </label>
                    <textarea
                      rows={3}
                      value={newCourse.capstoneDescription || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, capstoneDescription: e.target.value })}
                      placeholder="Detailed project requirements, scope of work, and engineering criteria."
                      className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-medium text-base text-slate-900 bg-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Verified Deliverables (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={newCourse.capstoneDeliverablesText || ''}
                      onChange={(e) => setNewCourse({ ...newCourse, capstoneDeliverablesText: e.target.value })}
                      placeholder="e.g. Central BIM Model (.rvt), Automated Bill of Quantities, Navisworks Clash Matrix"
                      className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                    />
                  </div>
                </div>

                {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION BUILDER) */}
                <div id="add-sec-10" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        10
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Frequently Asked Questions (FAQ) ({newCourse.faqs?.length || 0} Questions)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section H expandable FAQ accordions at the bottom of the live website modal.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-10"
                      isEditing={false}
                      hiddenSections={newCourse.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-10"
                    isEditing={false}
                    hiddenSections={newCourse.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="space-y-4">
                    {(newCourse.faqs || []).map((faqItem, fIdx) => (
                      <div key={fIdx} className="p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">
                            FAQ #{fIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = (newCourse.faqs || []).filter((_, i) => i !== fIdx);
                              setNewCourse({ ...newCourse, faqs: cur });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Remove FAQ
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Question</label>
                          <input
                            type="text"
                            value={faqItem.question}
                            onChange={(e) => {
                              const cur = [...(newCourse.faqs || [])];
                              cur[fIdx] = { ...cur[fIdx], question: e.target.value };
                              setNewCourse({ ...newCourse, faqs: cur });
                            }}
                            placeholder="e.g. Is there any prerequisite for this course in Hyderabad?"
                            className="w-full p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border-2 border-slate-300 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Counseling Answer</label>
                          <textarea
                            rows={3}
                            value={faqItem.answer}
                            onChange={(e) => {
                              const cur = [...(newCourse.faqs || [])];
                              cur[fIdx] = { ...cur[fIdx], answer: e.target.value };
                              setNewCourse({ ...newCourse, faqs: cur });
                            }}
                            placeholder="Enter detailed counseling answer"
                            className="w-full p-3 text-sm sm:text-base font-medium text-slate-800 bg-white rounded-xl border-2 border-slate-300 shadow-2xs leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Sticky Modal Actions */}
              <div className="max-w-[1440px] mx-auto pt-6 flex justify-end space-x-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-8 py-3.5 rounded-xl border-2 border-slate-300 text-sm sm:text-base font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCourse}
                  className="px-10 py-3.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm sm:text-base font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  {isSavingCourse ? 'PUBLISHING...' : 'PUBLISH & SYNC TO WEBSITE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EDIT EXISTING COURSE (Full Screen Responsive Blueprint Builder) */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200">
          <div className="w-full h-full bg-[#FFFFFF] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 sm:px-10 py-4 bg-[#FFFFFF] border-b-2 border-[#E2E8F0] shadow-sm flex-shrink-0">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-[#FFFFFF] flex items-center justify-center shadow-md font-black text-lg">
                  ✎
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-[#2563EB] uppercase tracking-wider block">
                    COURSE MANAGEMENT EDITOR &bull; REAL-TIME LIVE SYNC
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Edit Course: {editingCourse.title}
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setEditingCourse(null)} />
            </div>

            {/* Sticky Order-Wise Quick Jump Navigation Bar (10 Sections) */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 sm:px-10 py-2.5 flex items-center space-x-2 overflow-x-auto no-scrollbar flex-shrink-0">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap mr-2">
                Order-Wise Sections:
              </span>
              {[
                { id: 'edit-sec-1', coreId: 'sec-1', label: '1. Hero & Basics' },
                { id: 'edit-sec-2', coreId: 'sec-2', label: '2. Academic Facts' },
                { id: 'edit-sec-3', coreId: 'sec-3', label: '3. Overview' },
                { id: 'edit-sec-4', coreId: 'sec-4', label: '4. Training Highlights' },
                { id: 'edit-sec-5', coreId: 'sec-5', label: '5. Lab & Guarantees' },
                { id: 'edit-sec-6', coreId: 'sec-6', label: '6. Syllabus Units' },
                { id: 'edit-sec-7', coreId: 'sec-7', label: '7. Career Path' },
                { id: 'edit-sec-8', coreId: 'sec-8', label: '8. Certificate' },
                { id: 'edit-sec-9', coreId: 'sec-9', label: '9. Capstone Project' },
                { id: 'edit-sec-10', coreId: 'sec-10', label: '10. FAQs' },
              ].map((sec) => {
                const isHidden = (editingCourse?.hiddenSections || []).includes(sec.coreId);
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                      isHidden
                        ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 ring-1 ring-amber-300'
                        : 'bg-white border-slate-300 hover:border-slate-800 text-slate-800 shadow-2xs hover:shadow-xs'
                    }`}
                  >
                    <span>{sec.label}</span>
                    {isHidden && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-black uppercase">
                        HIDDEN
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Form Body - Single Column Logical Website Order with High Visibility */}
            <form onSubmit={handleEditCourseSubmit} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#F8FAFC]">
              <div className="max-w-[1440px] mx-auto space-y-8">
                
                {/* 1. HERO & BASIC COURSE IDENTIFICATION */}
                <div id="edit-sec-1" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-mono font-black text-sm">
                        01
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Course Identification, Commercials &amp; Hero Banner
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Controls the course card on catalog pages, sticky header, and top hero banner on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-1"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-1"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  {/* Title & Tagline */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Course Title <span className="text-[#EE2C3C]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCourse.title}
                        onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                        className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-300 font-bold text-base sm:text-lg text-slate-900 bg-white focus:outline-none focus:border-slate-900 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Tagline / Hero Subtitle <span className="text-slate-400 font-normal">(Shown directly under title)</span>
                      </label>
                      <input
                        type="text"
                        value={editingCourse.tagline || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, tagline: e.target.value })}
                        placeholder="e.g. Autodesk Authorized Revit BIM Professional Certification"
                        className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-slate-300 font-semibold text-base text-slate-900 bg-white focus:outline-none focus:border-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Folder, Code, Category, Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Discipline / Folder *</label>
                      <select
                        value={editingCourse.folder}
                        onChange={(e) => {
                          const chosenFolderId = e.target.value;
                          const chosenFolderObj = foldersList.find((f) => f.id === chosenFolderId);
                          setEditingCourse({
                            ...editingCourse,
                            folder: chosenFolderId,
                            domain: chosenFolderObj?.name || editingCourse.domain,
                          });
                        }}
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      >
                        {foldersList.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.code || 'FOLDER'} - {folder.shortName || folder.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Course Code</label>
                      <input
                        type="text"
                        value={editingCourse.code}
                        onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold font-mono text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Category Badge</label>
                      <input
                        type="text"
                        value={editingCourse.category || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                        placeholder="e.g. PARAMETRIC BIM"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Course Level</label>
                      <select
                        value={editingCourse.level || 'Professional'}
                        onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white focus:outline-none focus:border-slate-900"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Master Program">Master Program</option>
                        <option value="Certification">Certification</option>
                      </select>
                    </div>
                  </div>

                  {/* Commercial Stats Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Standard Tuition Fee (₹) *</label>
                      <input
                        type="number"
                        required
                        value={editingCourse.fee}
                        onChange={(e) => setEditingCourse({ ...editingCourse, fee: Number(e.target.value) })}
                        className="w-full p-3.5 rounded-xl border-2 border-emerald-300 font-black text-lg text-emerald-700 bg-emerald-50/20 focus:outline-none focus:border-emerald-600 shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Duration Label</label>
                      <input
                        type="text"
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        placeholder="e.g. 12 Weeks (120 Hours)"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Total Lab Hours</label>
                      <input
                        type="number"
                        value={editingCourse.totalHours || 120}
                        onChange={(e) => setEditingCourse({ ...editingCourse, totalHours: Number(e.target.value) || 120 })}
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base text-slate-900 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">Course Visibility Status</label>
                      <select
                        value={editingCourse.status}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, status: e.target.value as 'Active' | 'Inactive' })
                        }
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base bg-white"
                      >
                        <option value="Active">Active (Visible on Website)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* Primary Course Banner Image */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm sm:text-base font-bold text-slate-800">
                        Primary Course Banner Image (Hero Banner &amp; Catalog) <span className="text-[#EE2C3C]">*</span>
                      </label>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                        High-Resolution Architectural/Engineering Specimen
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editingCourse.image || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white focus:outline-none focus:border-slate-900 shadow-2xs"
                      />
                      <label className="px-6 py-3.5 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm transition-all">
                        <span>{isUploadingMedia ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'courseImage');
                          }}
                        />
                      </label>
                    </div>

                    {editingCourse.image && (
                      <div className="mt-3 h-48 w-full rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-950 relative shadow-inner">
                        <img
                          src={editingCourse.image}
                          alt="Primary Course Banner"
                          onError={(e) => {
                            const fallback = COURSES.find((c) => c.id.toLowerCase() === editingCourse.id.toLowerCase() || c.title.toLowerCase().trim() === editingCourse.title.toLowerCase().trim())?.image
                              || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80';
                            if (e.currentTarget.src !== fallback) {
                              e.currentTarget.src = fallback;
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg font-mono">
                          Live Hero Banner Preview
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. ACADEMIC FACTS & 4 PILLARS */}
                <div id="edit-sec-2" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        02
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Academic Facts &amp; Eligibility (4 Live Pillars)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section A &ldquo;Course Academic Facts &amp; Eligibility&rdquo; 4-pillar cards on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-2"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-2"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 1: Eligibility &amp; Prerequisites
                      </label>
                      <input
                        type="text"
                        value={editingCourse.prerequisites || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, prerequisites: e.target.value })}
                        placeholder="e.g. Basic understanding of architectural floor plans and building layouts"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 2: Awarded Credential Title
                      </label>
                      <input
                        type="text"
                        value={editingCourse.awardedCredential || editingCourse.certification || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, awardedCredential: e.target.value })}
                        placeholder="e.g. Autodesk Certified Professional: Revit Architecture (ACP)"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 3: Training Mode &amp; Lab Access
                      </label>
                      <input
                        type="text"
                        value={editingCourse.mode || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, mode: e.target.value })}
                        placeholder="e.g. Classroom & Dedicated CAD Workstation Lab"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        Pillar 4: Software Tools &amp; Authorized Toolchain
                      </label>
                      <input
                        type="text"
                        value={editingCourse.software}
                        onChange={(e) => setEditingCourse({ ...editingCourse, software: e.target.value })}
                        placeholder="e.g. Autodesk Revit 2026, Navisworks Manage, BIM 360, Enscape"
                        className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. COURSE OVERVIEW & LEARNING OBJECTIVES */}
                <div id="edit-sec-3" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-mono font-black text-sm">
                        03
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Course Overview &amp; Learning Objectives
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches the dedicated narrative card with the red indicator pill on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-3"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-3"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Comprehensive Syllabus Overview &amp; Project Description
                    </label>
                    <textarea
                      rows={4}
                      value={editingCourse.overview || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, overview: e.target.value })}
                      placeholder="Master end-to-end architectural BIM workflows from parametric floor layout generation, structural walls, and curtain systems to multi-disciplinary clash detection and construction sequencing."
                      className="w-full p-4 rounded-xl border-2 border-slate-300 font-medium text-base text-slate-900 bg-white focus:outline-none focus:border-slate-900 leading-relaxed shadow-2xs"
                    />
                  </div>
                </div>

                {/* 4. TRAINING HIGHLIGHTS (6 CARDS: TITLE & DESCRIPTION) */}
                <div id="edit-sec-4" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        04
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Training Highlights (Hallmark Value Props &bull; {editingCourse.trainingHighlights?.length || 0} Cards)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section B &ldquo;Training Highlights&rdquo; 6-card grid with red indicator pill on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-4"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-4"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(editingCourse.trainingHighlights || []).map((thItem, thIdx) => (
                      <div key={thIdx} className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 font-mono font-bold text-xs">
                            CARD 0{thIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const list = (editingCourse.trainingHighlights || []).filter((_, i) => i !== thIdx);
                              setEditingCourse({ ...editingCourse, trainingHighlights: list });
                            }}
                            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Remove Card
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={thItem.title}
                            onChange={(e) => {
                              const list = [...(editingCourse.trainingHighlights || [])];
                              list[thIdx] = { ...list[thIdx], title: e.target.value };
                              setEditingCourse({ ...editingCourse, trainingHighlights: list });
                            }}
                            placeholder="e.g. Instructor Led Training"
                            className="w-full p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border border-slate-300 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                            Card Description
                          </label>
                          <textarea
                            rows={3}
                            value={thItem.desc}
                            onChange={(e) => {
                              const list = [...(editingCourse.trainingHighlights || [])];
                              list[thIdx] = { ...list[thIdx], desc: e.target.value };
                              setEditingCourse({ ...editingCourse, trainingHighlights: list });
                            }}
                            placeholder="e.g. Expert CAD trainers with 10+ years EPC project experience."
                            className="w-full p-3 text-xs sm:text-sm font-medium text-slate-700 bg-white rounded-xl border border-slate-300 shadow-2xs leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. WORKSTATION LAB PHOTO, LAB GUARANTEES & CORE COMPETENCIES */}
                <div id="edit-sec-5" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        05
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Workstation Lab Photo, Lab Guarantees &amp; Core Competencies
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section C split card (Ameerpet Lab Workstation Photo &amp; Core Competencies) and the &ldquo;Lab &amp; Workstation Guarantee&rdquo; sidebar card.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-5"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-5"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  {/* Part A: Secondary Workstation Lab Photo */}
                  <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm sm:text-base font-bold text-slate-800">
                        Secondary Lab Image (Ameerpet Workstation Lab Photo)
                      </label>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                        Workstation Showcase
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editingCourse.labImage || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, labImage: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                        className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                      />
                      <label className="px-6 py-3.5 bg-[#15304C] hover:bg-[#0f2338] text-white text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm transition-all">
                        <span>{isUploadingMedia ? 'Uploading...' : 'Upload Lab Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'labImage');
                          }}
                        />
                      </label>
                    </div>

                    {editingCourse.labImage && (
                      <div className="mt-2 h-44 w-full rounded-xl overflow-hidden border-2 border-slate-300 bg-slate-900 relative shadow-inner">
                        <img
                          src={editingCourse.labImage}
                          alt="Ameerpet Workstation Lab"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 bg-[#15304C]/95 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md">
                          Ameerpet Workstation Lab Photo Preview
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Part B: Lab & Workstation Guarantee (Sidebar 4 Key Points) */}
                  <div className="p-5 bg-emerald-50/50 rounded-2xl border-2 border-emerald-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-emerald-200 gap-3">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-emerald-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                          Lab &amp; Workstation Guarantee ({editingCourse.labGuarantees?.length || 0} Checkpoints)
                        </span>
                        <p className="text-xs text-emerald-700">
                          These items render in the &ldquo;Lab &amp; Workstation Guarantee&rdquo; card on the live website sidebar.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const cur = editingCourse.labGuarantees || [];
                          setEditingCourse({
                            ...editingCourse,
                            labGuarantees: [...cur, 'Dedicated RTX Workstation & High-Speed Internet'],
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold uppercase transition-all shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        + Add Guarantee Point
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingCourse.labGuarantees || []).map((guarantee, gIdx) => (
                        <div key={gIdx} className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-emerald-200">
                          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                            ✓
                          </span>
                          <input
                            type="text"
                            value={guarantee}
                            onChange={(e) => {
                              const list = [...(editingCourse.labGuarantees || [])];
                              list[gIdx] = e.target.value;
                              setEditingCourse({ ...editingCourse, labGuarantees: list });
                            }}
                            className="flex-1 p-2.5 sm:p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = (editingCourse.labGuarantees || []).filter((_, i) => i !== gIdx);
                              setEditingCourse({ ...editingCourse, labGuarantees: list });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part C: Core Competencies Checklist Builder */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="text-sm sm:text-base font-bold text-slate-800">
                          Core Competencies Checklist ({editingCourse.highlights?.length || 0} Items)
                        </span>
                        <p className="text-xs text-slate-500">
                          These items render with green checkmarks (✓) next to the lab workstation photo on the live website.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const cur = editingCourse.highlights || [];
                          setEditingCourse({
                            ...editingCourse,
                            highlights: [...cur, `Live industrial modeling with ${editingCourse.software?.split(',')[0] || 'CAD Suite'}`],
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold uppercase transition-all shadow-sm cursor-pointer"
                      >
                        + Add Core Competency
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingCourse.highlights || []).map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-center space-x-3 bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200">
                          <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm flex-shrink-0">
                            ✓
                          </span>
                          <input
                            type="text"
                            value={highlight}
                            onChange={(e) => {
                              const list = [...(editingCourse.highlights || [])];
                              list[hIdx] = e.target.value;
                              setEditingCourse({ ...editingCourse, highlights: list });
                            }}
                            className="flex-1 p-2.5 sm:p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = (editingCourse.highlights || []).filter((_, i) => i !== hIdx);
                              setEditingCourse({ ...editingCourse, highlights: list });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. COURSE CONTENTS & MODULE SYLLABUS BREAKDOWN */}
                <div id="edit-sec-6" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-[#EE2C3C] text-white flex items-center justify-center font-mono font-black text-sm">
                        06
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Course Contents &amp; Units Breakdown ({editingCourse.modules?.length || 0} Units)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section D interactive syllabus accordions with lab hours and bullet topics.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-6"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-6"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(editingCourse.modules || []).map((mod, idx) => (
                      <div key={idx} className="p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="px-3 py-1 rounded-lg bg-[#EE2C3C] text-white font-mono font-black text-sm">
                            MODULE {mod.number}
                          </span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={mod.hours}
                              onChange={(e) => {
                                const updated = [...(editingCourse.modules || [])];
                                updated[idx] = { ...updated[idx], hours: Number(e.target.value) || 20 };
                                setEditingCourse({ ...editingCourse, modules: updated });
                              }}
                              className="w-20 p-2 border-2 border-slate-300 rounded-lg text-sm text-center font-black bg-white"
                              title="Lab Hours"
                            />
                            <span className="text-xs font-bold text-slate-700">LAB HRS</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (editingCourse.modules || []).filter((_, i) => i !== idx);
                                setEditingCourse({
                                  ...editingCourse,
                                  modules: updated,
                                  syllabus: updated.map((m) => m.title),
                                });
                              }}
                              className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer ml-2 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Module / Unit Title</label>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => {
                              const updated = [...(editingCourse.modules || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setEditingCourse({
                                ...editingCourse,
                                modules: updated,
                                syllabus: updated.map((m) => m.title),
                              });
                            }}
                            placeholder="Module Title"
                            className="w-full p-3 rounded-xl border-2 border-slate-300 text-sm sm:text-base font-bold text-slate-900 bg-white shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Topics Covered (Comma Separated)</label>
                          <input
                            type="text"
                            value={(mod.topics || []).join(', ')}
                            onChange={(e) => {
                              const updated = [...(editingCourse.modules || [])];
                              updated[idx] = {
                                ...updated[idx],
                                topics: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                              };
                              setEditingCourse({ ...editingCourse, modules: updated });
                            }}
                            placeholder="Topics separated by comma"
                            className="w-full p-3 rounded-xl border-2 border-slate-300 text-sm font-medium text-slate-800 bg-white shadow-2xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7. CAREER PROGRESSION PATH (FAN INFOGRAPHIC STEP BUILDER) */}
                <div id="edit-sec-7" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        07
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Career Progression Path ({editingCourse.careerPathways?.length || 0} Steps)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section E Career Infographic Fan Cards (Experience Range, Job Role, and Expected Compensation CTC).
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-7"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-7"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="space-y-4">
                    {(editingCourse.careerPathways || []).map((stepItem, sIdx) => (
                      <div key={sIdx} className="p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-lg bg-[#15304C] text-white font-mono font-black text-sm">
                            STEP {stepItem.step || String(sIdx + 1).padStart(2, '0')}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = (editingCourse.careerPathways || []).filter((_, i) => i !== sIdx);
                              setEditingCourse({ ...editingCourse, careerPathways: cur });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Remove Step
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">
                              Experience Range
                            </label>
                            <input
                              type="text"
                              value={stepItem.experience}
                              onChange={(e) => {
                                const cur = [...(editingCourse.careerPathways || [])];
                                cur[sIdx] = { ...cur[sIdx], experience: e.target.value };
                                setEditingCourse({ ...editingCourse, careerPathways: cur });
                              }}
                              placeholder="e.g. 0 – 2 Yrs"
                              className="w-full p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border-2 border-slate-300 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">
                              Job Role Title
                            </label>
                            <input
                              type="text"
                              value={stepItem.role}
                              onChange={(e) => {
                                const cur = [...(editingCourse.careerPathways || [])];
                                cur[sIdx] = { ...cur[sIdx], role: e.target.value };
                                setEditingCourse({ ...editingCourse, careerPathways: cur });
                              }}
                              placeholder="e.g. BIM Architectural Modeler"
                              className="w-full p-3 text-sm sm:text-base font-black text-slate-900 bg-white rounded-xl border-2 border-slate-300 shadow-2xs"
                            />
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider mb-1">
                              Expected CTC Range
                            </label>
                            <input
                              type="text"
                              value={stepItem.ctc}
                              onChange={(e) => {
                                const cur = [...(editingCourse.careerPathways || [])];
                                cur[sIdx] = { ...cur[sIdx], ctc: e.target.value };
                                setEditingCourse({ ...editingCourse, careerPathways: cur });
                              }}
                              placeholder="e.g. ₹4.5L – ₹9.0L PA"
                              className="w-full p-3 text-sm sm:text-base font-black text-emerald-700 bg-emerald-50/50 rounded-xl border-2 border-emerald-300 shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 8. OFFICIAL CERTIFICATE OF COMPLETION */}
                <div id="edit-sec-8" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        08
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Official Certificate of Completion Specimen
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section F &ldquo;How will you get your certificate?&rdquo; on the live website. Leave blank to show the ISO certificate specimen, or upload custom.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-8"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-8"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Certificate Sample Specimen Image URL / File Upload
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editingCourse.certificateImage || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, certificateImage: e.target.value })}
                        placeholder="Leave blank to use generated official ISO certificate specimen, or paste image URL"
                        className="flex-1 p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                      />
                      <label className="px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm transition-all">
                        <span>{isUploadingMedia ? 'Uploading...' : 'Upload Certificate'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'certificateImage');
                          }}
                        />
                      </label>
                    </div>

                    {editingCourse.certificateImage && (
                      <div className="mt-3 h-52 w-full rounded-2xl overflow-hidden border-2 border-amber-300 bg-white relative shadow-inner flex items-center justify-center p-2">
                        <img
                          src={editingCourse.certificateImage}
                          alt="Certificate Specimen"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-3 right-3 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md font-mono">
                          Live Certificate Specimen Preview
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 9. DUAL CERTIFICATION & INDUSTRY CAPSTONE PROJECT */}
                <div id="edit-sec-9" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-slate-200">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        09
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Dual Certification &amp; Industry Capstone Project (Mandatory Portfolio)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section G &ldquo;Dual Certification &amp; Industry Capstone Project&rdquo; on the live website.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-9"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-9"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Portfolio Project Title
                    </label>
                    <input
                      type="text"
                      value={editingCourse.capstoneProject?.title || ''}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          capstoneProject: {
                            ...(editingCourse.capstoneProject || {
                              description: 'Real-world industrial drafting, modeling, and validation project.',
                              deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
                            }),
                            title: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Commercial Complex 5-Story BIM Model with Multi-Trade Clash Report"
                      className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-bold text-base text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Project Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingCourse.capstoneProject?.description || ''}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          capstoneProject: {
                            ...(editingCourse.capstoneProject || {
                              title: `${editingCourse.title} Live Industry Project`,
                              deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
                            }),
                            description: e.target.value,
                          },
                        })
                      }
                      placeholder="Detailed project requirements, scope of work, and engineering criteria."
                      className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-medium text-base text-slate-900 bg-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                      Verified Deliverables (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={editingCourse.capstoneProject?.deliverables?.join(', ') || ''}
                      onChange={(e) => {
                        const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setEditingCourse({
                          ...editingCourse,
                          capstoneProject: {
                            ...(editingCourse.capstoneProject || {
                              title: `${editingCourse.title} Live Industry Project`,
                              description: 'Real-world industrial drafting, modeling, and validation project.',
                            }),
                            deliverables: list,
                          },
                        });
                      }}
                      placeholder="e.g. Central BIM Model (.rvt), Automated Bill of Quantities, Navisworks Clash Matrix"
                      className="w-full p-3.5 rounded-xl border-2 border-slate-300 font-semibold text-sm sm:text-base text-slate-900 bg-white"
                    />
                  </div>
                </div>

                {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION BUILDER) */}
                <div id="edit-sec-10" className="p-6 sm:p-8 bg-white rounded-2xl border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-slate-200 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-black text-sm">
                        10
                      </span>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          Frequently Asked Questions (FAQ) ({editingCourse.faqs?.length || 0} Questions)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          Matches Section H expandable FAQ accordions at the bottom of the live website modal.
                        </p>
                      </div>
                    </div>
                    <SectionHeaderActions
                      secCoreId="sec-10"
                      isEditing={true}
                      hiddenSections={editingCourse?.hiddenSections}
                      onAdd={handleSectionAdd}
                      onEdit={handleSectionEdit}
                      onToggleHide={handleSectionToggleHide}
                      onDelete={handleSectionDelete}
                    />
                  </div>
                  <SectionHiddenNotice
                    secCoreId="sec-10"
                    isEditing={true}
                    hiddenSections={editingCourse?.hiddenSections}
                    onToggleHide={handleSectionToggleHide}
                  />

                  <div className="space-y-4">
                    {(editingCourse.faqs || []).map((faqItem, fIdx) => (
                      <div key={fIdx} className="p-4 sm:p-5 bg-slate-50 border-2 border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">
                            FAQ #{fIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = (editingCourse.faqs || []).filter((_, i) => i !== fIdx);
                              setEditingCourse({ ...editingCourse, faqs: cur });
                            }}
                            className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Remove FAQ
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Question</label>
                          <input
                            type="text"
                            value={faqItem.question}
                            onChange={(e) => {
                              const cur = [...(editingCourse.faqs || [])];
                              cur[fIdx] = { ...cur[fIdx], question: e.target.value };
                              setEditingCourse({ ...editingCourse, faqs: cur });
                            }}
                            placeholder="e.g. Is there any prerequisite for this course in Hyderabad?"
                            className="w-full p-3 text-sm sm:text-base font-bold text-slate-900 bg-white rounded-xl border-2 border-slate-300 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Counseling Answer</label>
                          <textarea
                            rows={3}
                            value={faqItem.answer}
                            onChange={(e) => {
                              const cur = [...(editingCourse.faqs || [])];
                              cur[fIdx] = { ...cur[fIdx], answer: e.target.value };
                              setEditingCourse({ ...editingCourse, faqs: cur });
                            }}
                            placeholder="Enter detailed counseling answer"
                            className="w-full p-3 text-sm sm:text-base font-medium text-slate-800 bg-white rounded-xl border-2 border-slate-300 shadow-2xs leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Sticky Modal Actions */}
              <div className="max-w-[1440px] mx-auto pt-6 flex justify-end space-x-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-8 py-3.5 rounded-xl border-2 border-slate-300 text-sm sm:text-base font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCourse}
                  className="px-10 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white text-sm sm:text-base font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  {isSavingCourse ? 'SAVING CHANGES...' : 'SAVE & SYNC TO WEBSITE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: CLASSWISE VIDEO & PDF TRAINING STUDIO (Full Screen Executive Studio) */}
      {managingClassesCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200">
          <div className="w-full h-full bg-white flex flex-col overflow-hidden">
            {/* Executive Studio Header - Clean Professional Theme (No harsh black or red) */}
            <div className="bg-white border-b border-slate-200 px-6 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0 shadow-xs">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                      CAD Lab &amp; Video Studio
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold">
                      {managingClassesCourse.code}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-slate-600 font-medium">
                      {managingClassesCourse.domain || managingClassesCourse.folder.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {managingClassesCourse.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-slate-600">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    {currentClasses.length} Lessons Scheduled
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                    {currentClasses.filter((c) => c.pdfUrl).length} PDF Notes
                  </span>
                </div>
                <RedCrossCloseButton onClick={() => setManagingClassesCourse(null)} />
              </div>
            </div>

            {/* Main Content: 2-Column Side-by-Side Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-7 bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-[1800px] mx-auto">
                {/* Left Column (7 cols): Cinema CAD Workstation Preview Deck & Curriculum Playlist */}
                <div className="lg:col-span-7 space-y-5">
                  {/* High-Tech Cinema Player Bezel */}
                  <div className="bg-slate-950 rounded-2xl p-3 text-white shadow-lg border border-slate-800 space-y-2.5">
                    {/* Bezel Top Status Bar - Minimal & Clean */}
                    <div className="flex items-center justify-between px-2 py-1 text-xs border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                        <span className="font-semibold text-slate-200 truncate text-xs">
                          {testingVideoClass
                            ? `${testingVideoClass.classNumber} - ${testingVideoClass.title}`
                            : 'Select a lesson to preview video'}
                        </span>
                      </div>
                      {testingVideoClass?.duration && (
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono font-medium flex-shrink-0">
                          {testingVideoClass.duration}
                        </span>
                      )}
                    </div>

                    {/* Viewport Screen - Removed All Unwanted Text Clutter as Highlighted in Image 4 */}
                    <div className="relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
                      {testingVideoClass && testingVideoClass.videoUrl && !isPlaceholderOrBrokenDriveUrl(testingVideoClass.videoUrl) ? (
                        (testingVideoClass.videoType === 'drive' || testingVideoClass.videoUrl.includes('drive.google.com')) ? (
                          <>
                            <iframe
                              src={formatGoogleDriveUrl(testingVideoClass.videoUrl)}
                              className="w-full h-full border-0"
                              allow="autoplay; encrypted-media; fullscreen"
                              allowFullScreen
                              title={testingVideoClass.title}
                            />
                            {/* Top-Right Shield: Hides Google Drive pop-out & external window button */}
                            <div
                              className="absolute top-0 right-0 w-28 h-16 bg-black z-30 pointer-events-auto select-none"
                              aria-hidden="true"
                            />
                          </>
                        ) : (testingVideoClass.videoUrl.includes('youtube.com') || testingVideoClass.videoUrl.includes('youtu.be')) ? (
                          <>
                            <iframe
                              src={formatYouTubeEmbedUrl(testingVideoClass.videoUrl)}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              title={testingVideoClass.title}
                            />
                            {/* Top-Right Shield */}
                            <div
                              className="absolute top-0 right-0 w-28 h-16 bg-black z-30 pointer-events-auto select-none"
                              aria-hidden="true"
                            />
                          </>
                        ) : (
                          <video
                            controls
                            src={testingVideoClass.videoUrl}
                            className="w-full h-full object-contain"
                          />
                        )
                      ) : (
                        /* Clean Minimalist Cinema Viewport with Professional Play Button (No Text Clutter) */
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-10 pointer-events-none"
                            style={{
                              backgroundImage:
                                'radial-gradient(circle at 50% 50%, #38BDF8 1px, transparent 1px)',
                              backgroundSize: '24px 24px',
                            }}
                          />
                          {/* Visible, High-Resolution Play Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (testingVideoClass?.videoUrl) {
                                // If drive url, format and play
                              }
                            }}
                            className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer relative z-10"
                            title="Play Video"
                          >
                            <svg className="w-7 h-7 fill-current ml-1 text-white" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Dedicated Class PDF Study Material Inspector Deck */}
                    {testingVideoClass?.pdfUrl ? (
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shadow flex-shrink-0 border border-blue-400/30">
                            PDF
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                                Verified Study Notes
                              </span>
                              <span className="text-xs font-mono text-slate-400">
                                {testingVideoClass.pdfSize || 'Official PDF'}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-slate-200 block mt-0.5 truncate">
                              {testingVideoClass.pdfName || `${testingVideoClass.title} - Notes.pdf`}
                            </span>
                          </div>
                        </div>

                        <a
                          href={testingVideoClass.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow transition-all flex-shrink-0 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>View PDF</span>
                        </a>
                      </div>
                    ) : (
                      <div className="px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                        <span className="text-[11px] italic">
                          ℹ️ No PDF notes attached for this class yet. Attach notes in the right panel to show to students.
                        </span>
                        <span className="text-[10px] font-mono text-blue-400 font-bold">[PDF READY]</span>
                      </div>
                    )}
                  </div>

                  {/* Scheduled Classes Playlist */}
                  <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Course Curriculum Classes ({currentClasses.length})
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          Click any class to stream preview &amp; inspect notes
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                        {currentClasses.filter((c) => c.pdfUrl).length}/{currentClasses.length} Have Notes
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {currentClasses.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
                          No video classes added yet. Use the form on the right to upload or link Google Drive videos and PDF notes.
                        </div>
                      ) : (
                        currentClasses.map((cls, idx) => {
                          const isCurrent = testingVideoClass?.id === cls.id;
                          return (
                            <div
                              key={cls.id || idx}
                              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isCurrent
                                  ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                                  : 'bg-white border-slate-200 hover:bg-slate-50/80 hover:border-slate-300'
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => setTestingVideoClass(cls)}
                                className="text-left flex-1 min-w-0 cursor-pointer"
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-[11px] font-mono font-bold flex-shrink-0">
                                    {cls.classNumber}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                    {cls.title}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                                  <span className="font-medium text-slate-600">
                                    ⏱ {cls.duration}
                                  </span>
                                  <span className="text-slate-300">&bull;</span>
                                  <span className="font-medium text-slate-500">
                                    {cls.videoType === 'drive' ? 'Google Drive Stream' : 'Local MP4'}
                                  </span>

                                  {/* PDF Notes Badge */}
                                  {cls.pdfUrl ? (
                                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                                      <span>PDF: {cls.pdfName || 'Notes'}</span>
                                      {cls.pdfSize && <span>({cls.pdfSize})</span>}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] text-slate-400 italic">
                                      [No PDF attached]
                                    </span>
                                  )}
                                </div>
                              </button>

                              {/* Visible, Clearly Styled Action Buttons (Image 2 Fix) */}
                              <div className="flex items-center space-x-1.5 flex-shrink-0 self-end sm:self-center">
                                {/* Visible Blue Play Button */}
                                <button
                                  type="button"
                                  onClick={() => setTestingVideoClass(cls)}
                                  className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
                                  title="Play / Preview Class Video"
                                >
                                  <VideoPlayIcon className="w-3.5 h-3.5 text-white ml-0.5" />
                                </button>

                                {/* Visible Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingClassIndex(idx);
                                    setNewClassForm({
                                      id: cls.id,
                                      classNumber: cls.classNumber,
                                      title: cls.title,
                                      duration: cls.duration,
                                      videoType: cls.videoType,
                                      videoUrl: cls.videoUrl,
                                      description: cls.description || '',
                                      pdfUrl: cls.pdfUrl || '',
                                      pdfName: cls.pdfName || '',
                                      pdfSize: cls.pdfSize || '',
                                    });
                                  }}
                                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                                  title="Edit Class &amp; Notes"
                                >
                                  <EditIcon className="w-3.5 h-3.5 text-slate-700" />
                                </button>

                                {/* Visible Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClass(idx)}
                                  className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                                  title="Delete Class"
                                >
                                  <DeleteIcon className="w-3.5 h-3.5 text-rose-600" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column (5 cols): Executive Class & PDF Notes Builder (No harsh black or red) */}
                <div className="lg:col-span-5 p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                        Curriculum Session Builder
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900">
                        {editingClassIndex !== null ? `Edit Lesson: ${newClassForm.classNumber}` : '+ Add New Class Session'}
                      </h4>
                    </div>
                    {editingClassIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingClassIndex(null);
                          setNewClassForm({
                            id: '',
                            classNumber: `Class 0${currentClasses.length + 1}`,
                            title: '',
                            duration: '45 mins',
                            videoType: 'drive',
                            videoUrl: '',
                            description: '',
                            pdfUrl: '',
                            pdfName: '',
                            pdfSize: '',
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 text-xs text-slate-700 font-semibold border border-slate-200 hover:bg-slate-200"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleAddOrUpdateClass} className="space-y-4 text-sm">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 text-xs mb-1">Class Number *</label>
                        <input
                          type="text"
                          required
                          value={newClassForm.classNumber}
                          onChange={(e) => setNewClassForm({ ...newClassForm, classNumber: e.target.value })}
                          placeholder="e.g. Class 01"
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 text-xs mb-1">Duration *</label>
                        <input
                          type="text"
                          required
                          value={newClassForm.duration}
                          onChange={(e) => setNewClassForm({ ...newClassForm, duration: e.target.value })}
                          placeholder="e.g. 45 mins"
                          className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 text-xs mb-1">Class Title / Topic *</label>
                      <input
                        type="text"
                        required
                        value={newClassForm.title}
                        onChange={(e) => setNewClassForm({ ...newClassForm, title: e.target.value })}
                        placeholder="e.g. AutoCAD 2D Drafting Standards &amp; BIS Code"
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    {/* Clean Segmented Form Switcher: Class Video vs Class Notes */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-slate-700 text-xs uppercase tracking-wide">
                          Session Content Mode *
                        </label>
                        <span className="text-xs text-slate-500 font-medium">
                          Toggle between Video &amp; Notes
                        </span>
                      </div>

                      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl gap-1 border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setClassFormTab('class')}
                          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                            classFormTab === 'class'
                              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Class Video</span>
                          {newClassForm.videoUrl ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Video configured" />
                          ) : null}
                        </button>

                        <button
                          type="button"
                          onClick={() => setClassFormTab('notes')}
                          className={`py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                            classFormTab === 'notes'
                              ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Notes &amp; PDF</span>
                          {newClassForm.pdfUrl ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="PDF Attached" />
                          ) : null}
                        </button>
                      </div>
                    </div>

                    {/* TAB 1: CLASS VIDEO */}
                    {classFormTab === 'class' && (
                      <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                        {/* Video Source Option Switcher */}
                        <div>
                          <label className="block font-bold text-slate-700 text-xs mb-1.5">Video Source Type *</label>
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setNewClassForm({ ...newClassForm, videoType: 'drive' })}
                              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                                newClassForm.videoType === 'drive'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span>Google Drive Link</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewClassForm({ ...newClassForm, videoType: 'file' })}
                              className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                                newClassForm.videoType === 'file'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span>Upload Video (.mp4)</span>
                            </button>
                          </div>
                        </div>

                        {/* Video Input fields */}
                        {newClassForm.videoType === 'drive' ? (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block font-bold text-slate-700 text-xs">
                                Google Drive Share Link *
                              </label>
                              {newClassForm.videoUrl && (
                                <span className="text-xs text-blue-600 font-semibold">
                                  Auto-converted to Stream
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={newClassForm.videoUrl}
                                onChange={(e) => setNewClassForm({ ...newClassForm, videoUrl: e.target.value })}
                                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                                className="flex-1 p-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-white focus:outline-none focus:border-blue-600"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newClassForm.videoUrl.trim()) {
                                    alert('Please paste a Google Drive link first');
                                    return;
                                  }
                                  const formatted = formatGoogleDriveUrl(newClassForm.videoUrl);
                                  setTestingVideoClass({
                                    id: 'preview-drive-now',
                                    classNumber: newClassForm.classNumber || 'Preview',
                                    title: newClassForm.title || 'Drive Stream Test',
                                    duration: newClassForm.duration || '45 mins',
                                    videoType: 'drive',
                                    videoUrl: formatted,
                                    pdfUrl: newClassForm.pdfUrl,
                                    pdfName: newClassForm.pdfName,
                                    pdfSize: newClassForm.pdfSize,
                                  });
                                  showToast('Streaming Google Drive video preview on the left player.');
                                }}
                                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                                title="Test Preview on Player"
                              >
                                <span>Preview</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block font-bold text-slate-700 text-xs">
                                Upload Video File (.mp4) or Direct URL *
                              </label>
                              {newClassForm.videoUrl && newClassForm.videoUrl.startsWith('/uploads/') && (
                                <span className="text-xs text-emerald-600 font-bold">
                                  Video File Ready
                                </span>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newClassForm.videoUrl}
                                  onChange={(e) => setNewClassForm({ ...newClassForm, videoUrl: e.target.value })}
                                  placeholder="/uploads/sample.mp4 or https://..."
                                  className="flex-1 p-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-white focus:outline-none focus:border-blue-600"
                                />
                                <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center space-x-1.5 whitespace-nowrap shadow-xs transition-all">
                                  <span>{isUploadingMedia ? 'Uploading...' : 'Browse MP4'}</span>
                                  <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileUpload(file, 'classVideo');
                                    }}
                                  />
                                </label>
                                {newClassForm.videoUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTestingVideoClass({
                                        id: 'preview-file-now',
                                        classNumber: newClassForm.classNumber || 'Preview',
                                        title: newClassForm.title || 'Video File Test',
                                        duration: newClassForm.duration || '45 mins',
                                        videoType: 'file',
                                        videoUrl: newClassForm.videoUrl,
                                        pdfUrl: newClassForm.pdfUrl,
                                        pdfName: newClassForm.pdfName,
                                        pdfSize: newClassForm.pdfSize,
                                      });
                                      showToast('Playing uploaded video on the left player.');
                                    }}
                                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap"
                                    title="Test Play on Player"
                                  >
                                    <span>Preview</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Lesson Topics & Objectives */}
                        <div>
                          <label className="block font-bold text-slate-700 text-xs mb-1">
                            Lesson Topics &amp; Lab Instructions
                          </label>
                          <textarea
                            rows={2}
                            value={newClassForm.description}
                            onChange={(e) => setNewClassForm({ ...newClassForm, description: e.target.value })}
                            placeholder="Key concepts, practice DWG instructions, or assignment criteria..."
                            className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-xs bg-white focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        {/* Status bar to Notes */}
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-blue-700 font-semibold truncate">
                              {newClassForm.pdfUrl ? `PDF Notes Attached: ${newClassForm.pdfName || 'Class Notes'}` : 'No PDF attached for this class yet'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setClassFormTab('notes')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all whitespace-nowrap cursor-pointer shadow-xs"
                          >
                            {newClassForm.pdfUrl ? 'Edit Notes &rarr;' : '+ Upload Notes &rarr;'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: NOTES & PDF (SHOWN DIRECTLY TO STUDENTS) */}
                    {classFormTab === 'notes' && (
                      <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                        <div className="p-4 bg-slate-50/60 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                            <div className="flex items-center space-x-2.5">
                              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200">
                                PDF
                              </span>
                              <div>
                                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                                  Class Notes &amp; PDF Materials
                                </h5>
                                <span className="text-xs text-slate-500 font-medium block">
                                  Uploaded materials appear directly in the student portal under this class
                                </span>
                              </div>
                            </div>
                            {newClassForm.pdfUrl && (
                              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex-shrink-0">
                                Live
                              </span>
                            )}
                          </div>

                          {/* PDF Document Name / Title */}
                          <div>
                            <label className="block font-bold text-slate-700 text-xs mb-1">
                              PDF Document Title / Subject *
                            </label>
                            <input
                              type="text"
                              value={newClassForm.pdfName}
                              onChange={(e) => setNewClassForm({ ...newClassForm, pdfName: e.target.value })}
                              placeholder={`e.g. ${newClassForm.classNumber || 'Class 01'} - ${newClassForm.title || 'Engineering Notes & Blueprint'}.pdf`}
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:border-blue-600"
                            />
                          </div>

                          {/* Display attached file badge if present */}
                          {newClassForm.pdfUrl && (
                            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="truncate">
                                  <span className="text-xs sm:text-sm font-bold text-slate-800 block truncate">
                                    {newClassForm.pdfName || 'Class-Study-Notes.pdf'}
                                  </span>
                                  <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-500 mt-0.5">
                                    <span className="font-mono">{newClassForm.pdfSize || 'Verified PDF'}</span>
                                    <span>&bull;</span>
                                    <span className="text-emerald-600 font-bold">Visible to Enrolled Students</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                <a
                                  href={newClassForm.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold shadow-xs cursor-pointer"
                                >
                                  Test Open
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewClassForm((prev) => ({
                                      ...prev,
                                      pdfUrl: '',
                                      pdfName: '',
                                      pdfSize: '',
                                    }));
                                    showToast('PDF attachment removed.');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Upload and Link Options */}
                          <div className="space-y-2.5">
                            <label className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold cursor-pointer flex items-center justify-center space-x-2 transition-all shadow-xs active:scale-[0.99]">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span>{isUploadingPdf ? 'Uploading PDF Document...' : 'Browse & Upload Class PDF / Drawing'}</span>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,.dwg,.dxf,.zip"
                                className="hidden"
                                disabled={isUploadingPdf}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handlePdfUpload(file);
                                }}
                              />
                            </label>

                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">OR LINK:</span>
                              <input
                                type="text"
                                value={newClassForm.pdfUrl}
                                onChange={(e) =>
                                  setNewClassForm({
                                    ...newClassForm,
                                    pdfUrl: e.target.value,
                                    pdfName: newClassForm.pdfName || (e.target.value ? `${newClassForm.classNumber || 'Class'}-Notes.pdf` : ''),
                                    pdfSize: newClassForm.pdfSize || (e.target.value ? 'Online PDF' : ''),
                                  })
                                }
                                placeholder="Paste Google Drive doc link or direct PDF URL..."
                                className="flex-1 p-2 rounded-xl border border-slate-300 text-xs font-mono bg-white focus:outline-none focus:border-blue-600"
                              />
                            </div>
                          </div>

                          {/* Instructions for Students regarding this PDF */}
                          <div>
                            <label className="block font-bold text-slate-700 text-xs mb-1">
                              Study Guide Instructions (Shown to Students)
                            </label>
                            <textarea
                              rows={2}
                              value={newClassForm.description}
                              onChange={(e) => setNewClassForm({ ...newClassForm, description: e.target.value })}
                              placeholder="Study notes or instructions (e.g. refer to page 12 for drafting exercises)..."
                              className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-xs bg-white focus:outline-none focus:border-blue-600"
                            />
                          </div>
                        </div>

                        {/* Status bar back to Video */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 truncate">
                            <span className="text-slate-600 font-medium truncate">
                              {newClassForm.videoUrl ? `Video Set: ${newClassForm.videoType === 'drive' ? 'Google Drive' : 'MP4'}` : 'Video not yet linked'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setClassFormTab('class')}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 whitespace-nowrap cursor-pointer"
                          >
                            &larr; Configure Video
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Stage Button */}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>{editingClassIndex !== null ? 'UPDATE THIS CLASS LESSON' : '+ STAGE CLASS TO CURRICULUM'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>
                  {currentClasses.length} lesson(s) configured &bull;{' '}
                  <span className="text-emerald-700 font-bold">
                    {currentClasses.filter((c) => c.pdfUrl).length} with downloadable PDF notes
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setManagingClassesCourse(null)}
                  className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingClasses}
                  onClick={handleSaveAllClassesToDb}
                  className="w-1/2 sm:w-auto px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isSavingClasses ? 'SAVING CHANGES...' : 'SAVE & SYNC TO DATABASE'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: MOVE COURSE TO RELATED FOLDER (Visual 6-Folder Selection) */}
      {movingCourse && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/70 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#131313]">
            <div className="flex justify-between items-center pb-3 border-b-2 border-[#E2E8F0]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-[#FFFFFF] flex items-center justify-center shadow-md">
                  
                </div>
                <div>
                  <span className="text-sm font-semibold font-black text-[#2563EB] uppercase tracking-wider block">
                    RELOCATE DISCIPLINE FOLDER
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#131313]">
                    Move Course to Engineering Folder
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setMovingCourse(null)} />
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border-2 border-[#E2E8F0] space-y-1">
              <span className="text-xs font-mono font-bold text-[#EE2C3C] block">{movingCourse.code}</span>
              <h4 className="text-base font-black text-[#131313]">{movingCourse.title}</h4>
              <p className="text-xs text-[#64748B] font-semibold">
                Current Folder:{' '}
                <span className="text-[#131313] font-bold">
                  {foldersList.find((f) => f.id === movingCourse.folder)?.name || MAIN_FOLDERS.find((f) => f.id === movingCourse.folder)?.name || movingCourse.domain}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-[#334155] mb-2 uppercase tracking-wide">
                Select Destination Folder:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {foldersList.map((folder) => {
                  const isSelected = targetMoveFolder === folder.id;
                  return (
                    <button
                      key={folder.id}
                      type="button"
                      onClick={() => setTargetMoveFolder(folder.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-sm'
                          : 'border-[#CBD5E1] bg-[#FFFFFF] hover:border-[#131313]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono font-bold text-[#64748B]">
                          {folder.code}
                        </span>
                        {isSelected && (
                          <span className="text-xs font-bold text-[#2563EB]">&check;</span>
                        )}
                      </div>
                      <span className="text-xs font-black text-[#131313] mt-1 block">
                        {folder.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 flex justify-end space-x-3 border-t-2 border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setMovingCourse(null)}
                className="px-5 py-2.5 rounded-xl border-2 border-[#CBD5E1] text-sm sm:text-base font-bold hover:bg-[#F8FAFC] transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isMovingCourse}
                onClick={handleConfirmMoveCourse}
                className="px-7 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-[#FFFFFF] text-sm sm:text-base font-black uppercase tracking-wider shadow-md transition-all flex items-center space-x-2"
              >
                
                <span>{isMovingCourse ? 'MOVING...' : 'CONFIRM MOVE'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: PREVIEW ISSUED CERTIFICATE (PDF / IMAGE / TEMPLATE) */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] w-full max-w-4xl rounded-2xl border-2 border-[#131313] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#131313] text-[#FFFFFF] flex items-center justify-between border-b-2 border-[#262626] flex-shrink-0">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded bg-[#EE2C3C] text-[#FFFFFF] font-mono text-xs font-black">
                  {viewingCertificate.certId}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#FFFFFF]">
                    {viewingCertificate.studentName} &bull; Verified CAD Certificate
                  </h3>
                  <span className="text-xs text-[#CBD5E1] font-semibold">
                    {viewingCertificate.course} &bull; {viewingCertificate.grade} &bull; Issued {viewingCertificate.issueDate}
                  </span>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setViewingCertificate(null)} />
            </div>

            {/* Modal Body - Pure PDF Reader */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#F8FAFC]">
              <div className="w-full h-[620px] rounded-xl overflow-hidden border-2 border-[#CBD5E1] bg-[#1E293B] shadow-inner">
                <iframe
                  src={viewingCertificate.fileUrl || ''}
                  title="Certificate PDF"
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#FFFFFF] border-t-2 border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-[#64748B]">
                Student ID: <span className="text-[#131313] font-black">{viewingCertificate.studentId}</span>
                {viewingCertificate.fileSize ? ` &bull; ${viewingCertificate.fileSize}` : ''}
              </span>
              <div className="flex items-center space-x-3">
                <a
                  href={viewingCertificate.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-[#FFFFFF] text-sm sm:text-base font-black uppercase tracking-wider shadow-md transition-all inline-flex items-center space-x-2"
                >
                  <span>Download Certificate PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setViewingCertificate(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#131313] text-[#FFFFFF] text-sm sm:text-base font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: IN-BROWSER E-BOOK READER MODAL */}
      {viewingEbook && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#FFFFFF] w-full max-w-5xl rounded-2xl border-2 border-[#131313] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden my-auto animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#131313] text-[#FFFFFF] flex items-center justify-between border-b-2 border-[#262626] flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-[#DC2626] text-[#FFFFFF] font-black flex items-center justify-center text-sm shadow flex-shrink-0">
                  PDF
                </span>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    {viewingEbook.accessType === 'free' ? (
                      <span className="px-2 py-0.5 rounded text-xs font-bold font-black bg-[#DCFCE7] text-[#166534]">
                        FREE ACCESS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-bold font-black bg-[#FEF2F2] text-[#991B1B]">
                        LOCKED REFERENCE
                      </span>
                    )}
                    <span className="text-xs text-[#CBD5E1] font-semibold truncate">
                      {viewingEbook.course} &bull; {viewingEbook.pages || 'Handbook'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#FFFFFF] truncate mt-0.5">
                    {viewingEbook.title}
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setViewingEbook(null)} />
            </div>

            {/* Modal Body: Embedded In-Browser PDF Reader */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#F8FAFC]">
              <div className="w-full h-[680px] rounded-xl overflow-hidden border-2 border-[#CBD5E1] bg-[#1E293B] shadow-inner">
                <iframe
                  src={viewingEbook.pdfUrl}
                  title={viewingEbook.title}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#FFFFFF] border-t-2 border-[#E2E8F0] flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-[#64748B]">
                File: <span className="text-[#131313] font-black">{viewingEbook.pdfName}</span> ({viewingEbook.pdfSize || 'Document'})
              </span>
              <div className="flex items-center space-x-3">
                <a
                  href={viewingEbook.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-[#FFFFFF] text-sm sm:text-base font-black uppercase tracking-wider shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setViewingEbook(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#131313] text-[#FFFFFF] text-sm sm:text-base font-bold cursor-pointer hover:bg-[#262626]"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SOLVE & RESOLVE STUDENT SUPPORT TICKET */}
      {selectedTicketForReply && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {selectedTicketForReply.ticketNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {selectedTicketForReply.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#131313]">
                  Solve &amp; Resolve Student Ticket
                </h3>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedTicketForReply(null)} />
            </div>

            {/* Modal Body */}
            <form onSubmit={handleResolveTicket} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Student Context Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-[#131313]">{selectedTicketForReply.studentName}</span>{' '}
                    <span className="text-slate-500 font-mono">({selectedTicketForReply.studentId})</span>
                  </div>
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedTicketForReply.course}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#131313] mt-1">{selectedTicketForReply.subject}</h4>
                  <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {selectedTicketForReply.description}
                  </p>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Resolution Status:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReplyStatus('Resolved')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      replyStatus === 'Resolved'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Solved &amp; Resolved
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplyStatus('In Progress')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      replyStatus === 'In Progress'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Keep In Progress (Investigation)
                  </button>
                </div>
              </div>

              {/* Faculty / Solver Authority */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Answering Faculty / Mentor Authority:
                </label>
                <input
                  type="text"
                  value={replyFaculty}
                  onChange={(e) => setReplyFaculty(e.target.value)}
                  placeholder="e.g. Er. Swamy Naidu (Director / Chief Architect)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  required
                />
              </div>

              {/* Official Resolution Guidance */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Official Resolution &amp; Step-by-Step Guidance:
                </label>
                <textarea
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type clear CAD software solution, troubleshooting steps, lab workstation instructions, or design command advice..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-normal text-[#131313] leading-relaxed bg-white focus:outline-none focus:border-[#EE2C3C]"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This resolution note will immediately appear on the student&apos;s portal with a verified solution badge.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedTicketForReply(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTicketReply}
                  className="px-6 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingTicketReply ? (
                    <span>Saving Resolution...</span>
                  ) : (
                    <span>Publish Solution to Student &rarr;</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD NEW COURSE ASSIGNMENT */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
              <div>
                <span className="text-[11px] font-bold text-[#EE2C3C] uppercase tracking-wider block">
                  New Project Assignment
                </span>
                <h3 className="text-xl font-bold text-[#131313] mt-0.5">
                  Upload Assignment PDF &amp; Select Target Course
                </h3>
              </div>
              <RedCrossCloseButton onClick={() => setShowAddAssignmentModal(false)} />
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Assignment Title:
                </label>
                <input
                  type="text"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  placeholder="e.g. AutoCAD 2D Working Plan & Sectional Elevation"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  required
                />
              </div>

              {/* Target Course Selector */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Target Course (Students of this course only will receive this):
                </label>
                <select
                  value={newAssignmentCourse}
                  onChange={(e) => setNewAssignmentCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  required
                >
                  <option value="Civil CADD & Master BIM">Civil CADD &amp; Master BIM</option>
                  <option value="Mechanical CAD/CAM/CAE Diploma">Mechanical CAD/CAM/CAE Diploma</option>
                  <option value="Electrical CADD & Power Distribution">Electrical CADD &amp; Power Distribution</option>
                  <option value="Interior Architecture & 3D Visualization">Interior Architecture &amp; 3D Visualization</option>
                  <option value="All Courses">All Courses (Campus Wide)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enrolled students will see this assignment only if their enrolled course matches.
                </p>
              </div>

              {/* Due Date & Max Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                    Submission Due Date:
                  </label>
                  <input
                    type="date"
                    value={newAssignmentDueDate}
                    onChange={(e) => setNewAssignmentDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                    Max Marks:
                  </label>
                  <input
                    type="number"
                    value={newAssignmentMaxScore}
                    onChange={(e) => setNewAssignmentMaxScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  />
                </div>
              </div>

              {/* Direct PDF File Upload */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Assignment PDF Document (Direct Upload):
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-slate-50 hover:bg-slate-100/70 transition-all text-center">
                  <input
                    type="file"
                    id="assignment-pdf-upload-input"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAssignmentPdfUpload(file);
                    }}
                    className="hidden"
                  />
                  <label
                    htmlFor="assignment-pdf-upload-input"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <div className="px-5 py-2.5 rounded-xl bg-[#131313] hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all">
                      {isUploadingAssignmentPdf ? 'Uploading PDF Document...' : 'Choose PDF File from Device'}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Select local assignment PDF file (AutoCAD/Revit/BIM drawing sheets)
                    </p>
                  </label>

                  {newAssignmentPdfUrl && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-emerald-300 text-xs flex items-center justify-between shadow-2xs">
                      <div className="truncate text-left font-semibold text-emerald-800">
                        Uploaded: <span className="font-bold text-[#131313]">{newAssignmentPdfName || 'assignment.pdf'}</span>
                        <span className="text-[11px] text-slate-500 font-mono ml-2">({newAssignmentPdfSize})</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Uploaded &amp; Ready
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PDF File Name & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                    PDF File Name:
                  </label>
                  <input
                    type="text"
                    value={newAssignmentPdfName}
                    onChange={(e) => setNewAssignmentPdfName(e.target.value)}
                    placeholder="e.g. AutoCAD-2D-Working-Plan.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                    File Size:
                  </label>
                  <input
                    type="text"
                    value={newAssignmentPdfSize}
                    onChange={(e) => setNewAssignmentPdfSize(e.target.value)}
                    placeholder="e.g. 3.2 MB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C]"
                  />
                </div>
              </div>

              {/* Task Brief / Instructions */}
              <div>
                <label className="block text-xs font-bold text-[#131313] uppercase tracking-wider mb-1.5">
                  Assignment Instructions &amp; Drawing Deliverables:
                </label>
                <textarea
                  rows={4}
                  value={newAssignmentDescription}
                  onChange={(e) => setNewAssignmentDescription(e.target.value)}
                  placeholder="Specify drafting requirements, NBC standard layers, dimensions, required views (floor plan, elevations, 3D render)..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-[#131313] leading-relaxed bg-white focus:outline-none focus:border-[#EE2C3C]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAssignment || isUploadingAssignmentPdf}
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAssignment ? 'Publishing...' : 'Publish Assignment to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ASSIGNMENT PDF */}
      {selectedAssignmentForView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedAssignmentForView.course}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Due: {selectedAssignmentForView.dueDate}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#131313] truncate">
                  {selectedAssignmentForView.title}
                </h3>
              </div>
              <RedCrossCloseButton onClick={() => setSelectedAssignmentForView(null)} />
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
              <div className="w-full h-[620px] rounded-xl overflow-hidden border border-slate-300 bg-slate-800 shadow-inner">
                <iframe
                  src={selectedAssignmentForView.pdfUrl}
                  title={selectedAssignmentForView.title}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-semibold text-slate-600">
                Document: <span className="text-[#131313] font-bold">{selectedAssignmentForView.pdfName}</span> ({selectedAssignmentForView.pdfSize || 'PDF'})
              </span>
              <div className="flex items-center space-x-3">
                <a
                  href={selectedAssignmentForView.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="px-5 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Download PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentForView(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#131313] hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {/* MODAL: CREATE / EDIT OFFER & REFERRAL PROGRAM */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#131313]">
                  {editingOfferId ? 'Edit Offer Campaign' : 'Create New Offer / Referral Program'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate promotional discount codes and peer referral links that sync dynamically to the student portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowOfferModal(false);
                  setEditingOfferId(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-lg font-bold cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveOffer}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Offer Type Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Campaign / Offer Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOfferFormType('course_discount');
                        setOfferFormRefereeReward(`${offerFormDiscountValue}% Course Fee Waiver`);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        offerFormType === 'course_discount'
                          ? 'border-[#EE2C3C] bg-rose-50/50 text-[#EE2C3C] ring-2 ring-[#EE2C3C]/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm block">Course Discount Offer</span>
                      <span className="text-[11px] text-slate-500">Promotional % or flat tuition discount</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOfferFormType('referral');
                        setOfferFormReferrerReward('Rs 1,500 Voucher');
                        setOfferFormRefereeReward('Rs 1,500 Discount');
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        offerFormType === 'referral'
                          ? 'border-[#EE2C3C] bg-rose-50/50 text-[#EE2C3C] ring-2 ring-[#EE2C3C]/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm block">Student Referral Link</span>
                      <span className="text-[11px] text-slate-500">Peer reward voucher &amp; enrollee benefit</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Campaign / Offer Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={offerFormTitle}
                    onChange={(e) => setOfferFormTitle(e.target.value)}
                    placeholder="e.g. BIM Specialist Early Bird Scholarship or Engineering Peer Referral"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                  />
                </div>

                {/* Promo Code & Auto-Generate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Coupon / Referral Code *
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        required
                        value={offerFormCode}
                        onChange={(e) => setOfferFormCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))}
                        placeholder="e.g. BIM20, CADDPEER"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold uppercase focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setOfferFormCode('CAD' + Math.floor(1000 + Math.random() * 9000))}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0 cursor-pointer"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Applicable Course / Audience
                    </label>
                    <select
                      value={offerFormCourse}
                      onChange={(e) => setOfferFormCourse(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                    >
                      <option value="All Engineering Courses">All Engineering Courses</option>
                      {courses.map((c) => (
                        <option key={c.id || c.code} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Discount Calculation Model
                    </label>
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOfferFormDiscountType('percentage')}
                        className={`flex-1 py-2 text-xs font-bold transition-all ${
                          offerFormDiscountType === 'percentage'
                            ? 'bg-[#131313] text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        % Percentage Off
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferFormDiscountType('flat')}
                        className={`flex-1 py-2 text-xs font-bold transition-all ${
                          offerFormDiscountType === 'flat'
                            ? 'bg-[#131313] text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Flat Rs Amount
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Discount Value ({offerFormDiscountType === 'percentage' ? '%' : 'Rs'}) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={offerFormDiscountType === 'percentage' ? 100 : 50000}
                      value={offerFormDiscountValue}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setOfferFormDiscountValue(val);
                        if (offerFormType === 'course_discount') {
                          setOfferFormRefereeReward(offerFormDiscountType === 'percentage' ? `${val}% Fee Waiver` : `Rs ${val} Discount`);
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                    />
                  </div>
                </div>

                {/* Referral Specific Inputs */}
                {offerFormType === 'referral' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                    <div>
                      <label className="text-xs font-bold text-purple-900 block mb-1">
                        Existing Student Reward (Referrer)
                      </label>
                      <input
                        type="text"
                        value={offerFormReferrerReward}
                        onChange={(e) => setOfferFormReferrerReward(e.target.value)}
                        placeholder="e.g. Rs 1,500 Voucher"
                        className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-purple-900 block mb-1">
                        New Trainee Benefit (Referee)
                      </label>
                      <input
                        type="text"
                        value={offerFormRefereeReward}
                        onChange={(e) => setOfferFormRefereeReward(e.target.value)}
                        placeholder="e.g. Rs 1,500 Enrollment Discount"
                        className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                )}

                {/* Expiry Date */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Offer Expiry Date
                  </label>
                  <input
                    type="date"
                    value={offerFormExpiry}
                    onChange={(e) => setOfferFormExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Offer Description &amp; Terms
                  </label>
                  <textarea
                    rows={2}
                    value={offerFormDescription}
                    onChange={(e) => setOfferFormDescription(e.target.value)}
                    placeholder="e.g. Applicable on all professional certification programs. Valid on one-time fee payment."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs resize-none"
                  />
                </div>

                {/* Live Link Preview */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Live Generated Share Link Preview:
                  </span>
                  <div className="font-mono text-xs text-[#EE2C3C] break-all font-semibold">
                    {`https://rnd-cadd.vercel.app/enroll?${offerFormType === 'referral' ? 'ref=' : 'coupon='}${offerFormCode || 'PROMO'}`}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setShowOfferModal(false);
                    setEditingOfferId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingOffer}
                  className="px-6 py-2.5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
                >
                  <span>{isSubmittingOffer ? 'Saving...' : 'Save & Publish Offer →'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BROADCAST / SCHEDULE LIVE CLASS */}
      {showLiveModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#131313]">
                  {editingLiveId ? 'Edit Live Class Details' : 'Broadcast / Schedule Live Class'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure real-time workstation screen broadcasting directly to the student portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowLiveModal(false);
                  setEditingLiveId(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-lg font-bold cursor-pointer transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Live Class Topic / Session Title *
                </label>
                <input
                  type="text"
                  value={liveFormTitle}
                  onChange={(e) => setLiveFormTitle(e.target.value)}
                  placeholder="e.g. Parametric Family Creation in Autodesk Revit"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Instructor / Lead Trainer *
                  </label>
                  <input
                    type="text"
                    value={liveFormTrainer}
                    onChange={(e) => setLiveFormTrainer(e.target.value)}
                    placeholder="e.g. Er. Swamy Naidu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Course / Audience
                  </label>
                  <select
                    value={liveFormCourse}
                    onChange={(e) => setLiveFormCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                  >
                    <option value="All Enrolled Students">All Enrolled Students</option>
                    {courses.map((c) => (
                      <option key={c.id || c.code} value={c.title}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Stream / Meeting Link (URL) *
                  </label>
                  <input
                    type="url"
                    value={liveFormUrl}
                    onChange={(e) => setLiveFormUrl(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] font-mono shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Streaming Platform
                  </label>
                  <select
                    value={liveFormPlatform}
                    onChange={(e) => setLiveFormPlatform(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                  >
                    <option value="Virtual CAD Workstation">Virtual CAD Workstation</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="YouTube Live">YouTube Live</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Timing / Schedule Display Label
                </label>
                <input
                  type="text"
                  value={liveFormTiming}
                  onChange={(e) => setLiveFormTiming(e.target.value)}
                  placeholder="e.g. Today, 10:00 AM - 12:30 PM (Lab Session)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Student Guidelines &amp; Lab Instructions
                </label>
                <textarea
                  rows={3}
                  value={liveFormDescription}
                  onChange={(e) => setLiveFormDescription(e.target.value)}
                  placeholder="e.g. Trainer Er. Swamy Naidu is demonstrating Parametric Revit Families. Connect to workstation screen."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#EE2C3C] shadow-2xs resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setShowLiveModal(false);
                  setEditingLiveId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleBroadcastLive('Scheduled')}
                disabled={isBroadcasting}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
              >
                Schedule for Later
              </button>

              <button
                type="button"
                onClick={() => handleBroadcastLive('Live Now')}
                disabled={isBroadcasting}
                className="px-5 py-2 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>{isBroadcasting ? 'Broadcasting...' : '🔴 Start Live Broadcast Now →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

