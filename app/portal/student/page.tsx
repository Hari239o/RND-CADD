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

function formatGoogleDriveUrl(url?: string): string {
  const FALLBACK_DRIVE_RECORDING = 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview';
  if (!url) return FALLBACK_DRIVE_RECORDING;
  const trimmed = url.trim();
  if (isPlaceholderOrBrokenDriveUrl(trimmed)) {
    return FALLBACK_DRIVE_RECORDING;
  }
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
  if (
    trimmed === '' ||
    trimmed === 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview' ||
    trimmed.includes('1w8o19vH1M9hP2nE5G4aBcDef') ||
    trimmed.includes('placeholder') ||
    trimmed.includes('sample.mp4') ||
    trimmed.includes('commondatastorage.googleapis.com')
  ) {
    return true;
  }
  return false;
}

function formatGoogleDriveDirectStreamUrl(url?: string): string {
  if (!url || isPlaceholderOrBrokenDriveUrl(url)) {
    return '/api/video-stream?id=1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c';
  }
  const trimmed = url.trim();
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `/api/video-stream?id=${fileMatch[1]}`;
  }
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `/api/video-stream?id=${idMatch[1]}`;
  }
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return `/api/video-stream?id=${trimmed}`;
  }
  return trimmed.startsWith('http') || trimmed.startsWith('/')
    ? trimmed
    : `/api/video-stream?id=${trimmed}`;
}

function formatYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  let videoId = '';
  const match = trimmed.match(/(?:youtu\.be\/|(?:www\.|m\.)?youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    videoId = match[1];
  } else if (trimmed.includes('youtube.com/embed/')) {
    const parts = trimmed.split('youtube.com/embed/')[1]?.split('?')[0]?.split('/')[0];
    if (parts) videoId = parts;
  }
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&playsinline=1&controls=1&rel=0&modestbranding=1`;
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

function parseDurationSeconds(durationStr?: string): number {
  if (!durationStr) return 351; // default ~5:51
  const trimmed = durationStr.trim().toLowerCase();
  const minMatch = trimmed.match(/^([\d.]+)\s*(?:min|mins|minute|minutes)$/);
  if (minMatch) return Math.round(parseFloat(minMatch[1]) * 60);
  const hrMatch = trimmed.match(/^([\d.]+)\s*(?:hr|hrs|hour|hours)$/);
  if (hrMatch) return Math.round(parseFloat(hrMatch[1]) * 3600);
  const parts = trimmed.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 351;
}

const DEFAULT_COURSE_CLASSES: Record<string, CourseClass[]> = {
  'civil cadd & master bim': [
    {
      id: 'cls-civ-1',
      classNumber: 'Class 01',
      title: 'AutoCAD 2D Drafting Standards & Project Setup',
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Industry-standard DWG setup, BIS title block standards, layer architecture, and precision snap tools.',
    },
    {
      id: 'cls-civ-2',
      classNumber: 'Class 02',
      title: 'Parametric Wall Assemblies, Slabs & Grids in Revit',
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Modeling structural compound walls, core layers, elevation datum levels, and structural grid alignments.',
    },
    {
      id: 'cls-civ-3',
      classNumber: 'Class 03',
      title: 'Custom Family Creation & Curtain Glazing Systems',
      duration: '50 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Creating parametric window/door families, curtain wall mullion layout, and reference planes.',
    },
    {
      id: 'cls-civ-4',
      classNumber: 'Class 04',
      title: 'Navisworks Clash Matrix & Enscape 4K Walkthrough',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Multi-trade hard clash detection, 4D construction schedule simulation, and GPU real-time daylight rendering.',
    },
  ],
  'mechanical cad/cam/cae diploma': [
    {
      id: 'cls-mec-1',
      classNumber: 'Class 01',
      title: 'SolidWorks 3D Parametric Sketching & Constraints',
      duration: '50 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Fully constrained 2D sketches, geometric relations, boss-extrude, cut-extrude, and thin features.',
    },
    {
      id: 'cls-mec-2',
      classNumber: 'Class 02',
      title: 'Sheet Metal Unfolding, K-Factor & Welded Structures',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Edge flanges, miter flanges, sheet metal gauge tables, flat pattern development, and structural weldments.',
    },
    {
      id: 'cls-mec-3',
      classNumber: 'Class 03',
      title: 'CATIA V5 Generative Shape Design & Wireframe Tools',
      duration: '65 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Splines, boundary curves, sweep surfaces, blend surfaces, multi-section surfaces, and curvature continuity.',
    },
    {
      id: 'cls-mec-4',
      classNumber: 'Class 04',
      title: 'ANSYS Static Structural Stress & Deflection Simulation',
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Material library assignment, adaptive tetrahedral meshing, boundary conditions, and Von-Mises stress analysis.',
    },
  ],
  'solidworks master professional': [
    {
      id: 'cls-sw-1',
      classNumber: 'Class 01',
      title: 'SolidWorks 3D Parametric Part & Assembly Engineering',
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Precision sketches, top-down and bottom-up assemblies, mate references, and interference checks.',
    },
    {
      id: 'cls-sw-2',
      classNumber: 'Class 02',
      title: 'Sheet Metal Design, Forming Tools & Weldments',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Base flanges, gauge tables, flat patterns, cut lists, weld beads, and structural steel frames.',
    },
    {
      id: 'cls-sw-3',
      classNumber: 'Class 03',
      title: 'Industrial Surfacing, Mold Design & Tooling Splits',
      duration: '65 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Draft analysis, parting lines, shut-off surfaces, core and cavity block extraction for injection molding.',
    },
  ],
  'ansys fea & cfd multiphysics simulation': [
    {
      id: 'cls-ans-1',
      classNumber: 'Class 01',
      title: 'ANSYS Static Structural Stress & Deflection Analysis',
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Material assignments, boundary supports, structural loads, adaptive tetrahedral meshing, and Von-Mises results.',
    },
    {
      id: 'cls-ans-2',
      classNumber: 'Class 02',
      title: 'Steady-State Thermal & Modal Vibration Simulation',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Heat flux, thermal conductivity, natural frequency extraction, mode shapes, and resonance prevention.',
    },
  ],
  'electrical cadd & switchgear design': [
    {
      id: 'cls-ele-1',
      classNumber: 'Class 01',
      title: 'Single Line Diagram (SLD) Drafting & IEC Standards',
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'IEC 60617 graphical symbols, feeder sizing, busbar arrangements, and incoming HT/LT panel architecture.',
    },
    {
      id: 'cls-ele-2',
      classNumber: 'Class 02',
      title: 'Motor Control Center (MCC) & Control Logic Schematics',
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'DOL, Star-Delta power & control wiring, interlocking circuits, terminal blocks, and cable routing.',
    },
    {
      id: 'cls-ele-3',
      classNumber: 'Class 03',
      title: 'ETAP Balanced Load Flow & Short Circuit Calculations',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Bus voltage profiles, branch loading, symmetrical short circuit currents, and breaker breaking capacity.',
    },
  ],
  'interior architecture & 3d visualization': [
    {
      id: 'cls-int-1',
      classNumber: 'Class 01',
      title: 'Ergonomic Space Planning & CAD Interior Layouts',
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Anthropometric dimensions, circulation corridors, furniture clearance standards, and false ceiling grids.',
    },
    {
      id: 'cls-int-2',
      classNumber: 'Class 02',
      title: 'SketchUp Modular Cabinetry & Hardware Fitting Details',
      duration: '50 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Tandem drawer mechanisms, carcass panels, shutter finishes, edge-banding, and hardware specifications.',
    },
    {
      id: 'cls-int-3',
      classNumber: 'Class 03',
      title: '3ds Max Physically-Based Lighting & V-Ray 6 Materials',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'IES photometric spotlights, dome HDRI environment lighting, PBR reflection glossiness, and normal bump maps.',
    },
  ],
  'piping & plant engineering cadd': [
    {
      id: 'cls-pip-1',
      classNumber: 'Class 01',
      title: 'P&ID Process Drafting & Instrumentation Standards',
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Piping & Instrumentation Diagrams, ISA 5.1 symbology, line designation tables, and valve schedules.',
    },
    {
      id: 'cls-pip-2',
      classNumber: 'Class 02',
      title: '3D Equipment Modeling & Pipe Rack Routing',
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Nozzle orientations, pipe specifications, insulation thickness, pipe rack tier spacing, and valve access.',
    },
    {
      id: 'cls-pip-3',
      classNumber: 'Class 03',
      title: 'Automated Isometrics, BOM & Caesar II Flexibility',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Isometric drawing extraction, cut-length bill of materials, thermal expansion stress loops, and spring hanger loads.',
    },
  ],
  'project planning & management (ppm)': [
    {
      id: 'cls-ppm-1',
      classNumber: 'Class 01',
      title: 'Enterprise Project Structure (EPS) & WBS Hierarchy',
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Creating multi-tier EPS nodes, organizational breakdown structures (OBS), and 100% rule WBS decomposition.',
    },
    {
      id: 'cls-ppm-2',
      classNumber: 'Class 02',
      title: 'Activity Logic Ties, Critical Path (CPM) & Float Tracking',
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'FS, SS, FF, SF relationships, lead/lag times, total float, free float, and early/late date scheduling.',
    },
    {
      id: 'cls-ppm-3',
      classNumber: 'Class 03',
      title: 'Resource Allocation, Leveling & Earned Value (EVA)',
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: 'Labor/non-labor resource rate curves, peak leveling, Planned Value (PV), Earned Value (EV), and SPI/CPI tracking.',
    },
  ],
};

function findCourseInCatalog(nameOrId: string, catalog: StoredCourse[]): StoredCourse | undefined {
  if (!nameOrId || !catalog || catalog.length === 0) return undefined;
  const target = nameOrId.toLowerCase().trim();

  // 1. Exact ID or Title or Code match
  const exact = catalog.find(
    (c) =>
      c.id.toLowerCase() === target ||
      c.title.toLowerCase().trim() === target ||
      c.code?.toLowerCase().trim() === target
  );
  if (exact) return exact;

  // 2. Substring / contains match
  const containsMatch = catalog.find((c) => {
    const cTitle = c.title.toLowerCase().trim();
    return cTitle.includes(target) || target.includes(cTitle);
  });
  if (containsMatch) return containsMatch;

  // 3. Keyword / software match
  const keywords = target.split(/[\s&,/+-]+/).filter((w) => w.length > 3);
  for (const kw of keywords) {
    const kwMatch = catalog.find(
      (c) =>
        c.title.toLowerCase().includes(kw) ||
        c.software?.toLowerCase().includes(kw) ||
        (Array.isArray(c.tools) && c.tools.some((t: string) => t.toLowerCase().includes(kw)))
    );
    if (kwMatch) return kwMatch;
  }

  // 4. Domain match
  if (target.includes('mech') || target.includes('solidworks') || target.includes('ansys') || target.includes('catia') || target.includes('creo')) {
    const mech = catalog.find((c) => c.folder === 'mechanical' || c.stream === 'mechanical');
    if (mech) return mech;
  }
  if (target.includes('elec') || target.includes('eplan') || target.includes('etap') || target.includes('altium')) {
    const elec = catalog.find((c) => c.folder === 'electrical' || c.stream === 'eee');
    if (elec) return elec;
  }
  if (target.includes('pip') || target.includes('plant') || target.includes('sp3d')) {
    const pip = catalog.find((c) => c.folder === 'piping');
    if (pip) return pip;
  }
  if (target.includes('ppm') || target.includes('primavera') || target.includes('project')) {
    const ppm = catalog.find((c) => c.folder === 'ppm');
    if (ppm) return ppm;
  }
  if (target.includes('interior') || target.includes('sketchup')) {
    const intc = catalog.find((c) => c.folder === 'interior');
    if (intc) return intc;
  }

  return undefined;
}

function getClassesForCourse(courseTitle: string, matchedClasses?: CourseClass[]): CourseClass[] {
  if (matchedClasses && matchedClasses.length > 0) {
    return matchedClasses;
  }
  const cleanTitle = (courseTitle || '').toLowerCase().trim();

  // Check exact dictionary match
  if (DEFAULT_COURSE_CLASSES[cleanTitle]) {
    return DEFAULT_COURSE_CLASSES[cleanTitle];
  }

  // Match by domain/discipline - STRICT ISOLATION so Civil never leaks into Mechanical
  if (cleanTitle.includes('mech') || cleanTitle.includes('solidworks') || cleanTitle.includes('ansys') || cleanTitle.includes('catia') || cleanTitle.includes('creo') || cleanTitle.includes('cam') || cleanTitle.includes('cae') || cleanTitle.includes('nx') || cleanTitle.includes('cnc')) {
    return DEFAULT_COURSE_CLASSES['mechanical cad/cam/cae diploma'];
  }

  if (cleanTitle.includes('elec') || cleanTitle.includes('eplan') || cleanTitle.includes('etap') || cleanTitle.includes('altium') || cleanTitle.includes('matlab') || cleanTitle.includes('circuit') || cleanTitle.includes('switchgear') || cleanTitle.includes('panel')) {
    return DEFAULT_COURSE_CLASSES['electrical cadd & switchgear design'];
  }

  if (cleanTitle.includes('pip') || cleanTitle.includes('plant') || cleanTitle.includes('sp3d') || cleanTitle.includes('caesar') || cleanTitle.includes('p&id')) {
    return DEFAULT_COURSE_CLASSES['piping & plant engineering cadd'];
  }

  if (cleanTitle.includes('ppm') || cleanTitle.includes('primavera') || cleanTitle.includes('project') || cleanTitle.includes('msp') || cleanTitle.includes('estimation') || cleanTitle.includes('surveying')) {
    return DEFAULT_COURSE_CLASSES['project planning & management (ppm)'];
  }

  if (cleanTitle.includes('interior') || cleanTitle.includes('sketchup') || cleanTitle.includes('space') || cleanTitle.includes('furniture')) {
    return DEFAULT_COURSE_CLASSES['interior architecture & 3d visualization'];
  }

  if (cleanTitle.includes('civil') || cleanTitle.includes('bim') || cleanTitle.includes('revit') || cleanTitle.includes('etabs') || cleanTitle.includes('staad') || cleanTitle.includes('arch') || cleanTitle.includes('drafting')) {
    return DEFAULT_COURSE_CLASSES['civil cadd & master bim'];
  }

  // Dynamic isolated classes tailored specifically for this course title
  const safeSlug = (cleanTitle || 'cad-course').replace(/[^a-z0-9]+/g, '-');
  return [
    {
      id: `cls-${safeSlug}-1`,
      classNumber: 'Class 01',
      title: `${courseTitle} - Industry CAD Standards & Interface`,
      duration: '45 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: `Introduction to ${courseTitle} core interface, shortcuts, and industrial drafting standards.`,
    },
    {
      id: `cls-${safeSlug}-2`,
      classNumber: 'Class 02',
      title: `${courseTitle} - Advanced Modeling & Lab Drafting`,
      duration: '55 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: `Hands-on practical workflows and modeling techniques for ${courseTitle}.`,
    },
    {
      id: `cls-${safeSlug}-3`,
      classNumber: 'Class 03',
      title: `${courseTitle} - Capstone Project Dossier & Final Portfolio`,
      duration: '60 mins',
      videoType: 'drive',
      videoUrl: 'https://drive.google.com/file/d/1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c/preview',
      description: `Industrial capstone project validation and drawing sheet generation for ${courseTitle}.`,
    },
  ];
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


const DEFAULT_STUDENT_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
];

const getStudentAvatar = (photo?: string | null, name?: string, email?: string, id?: string): string => {
  if (photo && typeof photo === 'string' && photo.trim().length > 0) {
    const trimmed = photo.trim();
    // Allow all real dynamic images (Google OAuth photos, base64 data, uploads)
    if (!trimmed.includes('ui-avatars.com') && !trimmed.includes('dicebear.com/initials')) {
      return trimmed;
    }
  }

  // Dynamic fallback: Check client-side storage for active student user photo
  if (typeof window !== 'undefined') {
    try {
      const emailKey = (email || '').toLowerCase().trim();
      const stored = localStorage.getItem(`rnd_cadd_student_photo_${emailKey}`) ||
                     localStorage.getItem('rnd_cadd_student_photo_custom');
      if (stored && stored.trim().length > 0) return stored.trim();

      const sessionRaw = sessionStorage.getItem('rnd_cadd_user');
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed?.photo && typeof parsed.photo === 'string' && parsed.photo.trim().length > 0) return parsed.photo.trim();
        if (parsed?.image && typeof parsed.image === 'string' && parsed.image.trim().length > 0) return parsed.image.trim();
      }

      const localRaw = localStorage.getItem('rnd_cadd_user');
      if (localRaw) {
        const parsed = JSON.parse(localRaw);
        if (parsed?.photo && typeof parsed.photo === 'string' && parsed.photo.trim().length > 0) return parsed.photo.trim();
        if (parsed?.image && typeof parsed.image === 'string' && parsed.image.trim().length > 0) return parsed.image.trim();
      }
    } catch {}
  }

  const key = (email || id || name || 'student').toLowerCase();
  if (key.includes('student2') || key.includes('stu-002')) return DEFAULT_STUDENT_AVATARS[1];
  if (key.includes('student3') || key.includes('stu-003')) return DEFAULT_STUDENT_AVATARS[2];

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_STUDENT_AVATARS.length;
  return DEFAULT_STUDENT_AVATARS[index] || DEFAULT_STUDENT_AVATARS[0];
};

export default function StudentPortalPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [studentUser, setStudentUser] = useState({
    name: 'Student',
    email: '',
    role: 'student',
    stream: 'Engineering CAD',
    id: 'STU-001',
    accessStatus: 'active' as 'active' | 'revoked',
    phone: '',
    college: '',
    nativePlace: '',
    qualification: '',
    admissionDate: '11 Nov 2026',
    photo: '',
    courseFee: 0,
    paidFee: 0,
    balanceFee: 0,
    labWorkstation: '',
    leadInstructor: '',
    campusLocation: 'R&D CADD Center, Metro Pillar 1042, Ameerpet, Hyderabad',
    assignedCourses: [] as string[],
    paymentReceipts: [] as PaymentReceipt[],
    attendance: 0,
    designs: [] as any[],
  });

  // Profile Edit & Security States
  
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const raw = e.target?.result as string;
        if (!raw) return resolve('');
        const img = new Image();
        img.onload = () => {
          const maxDim = 500;
          let { width, height } = img;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.88));
          } else {
            resolve(raw);
          }
        };
        img.onerror = () => resolve(raw);
        img.src = raw;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleDirectPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImage(file);
      if (dataUrl) {
        setStudentUser((prev) => ({ ...prev, photo: dataUrl }));
        setEditPhoto(dataUrl);

        if (typeof window !== 'undefined') {
          try {
            const emailKey = (studentUser.email || 'student').toLowerCase().trim();
            localStorage.setItem(`rnd_cadd_student_photo_${emailKey}`, dataUrl);
            localStorage.setItem('rnd_cadd_student_photo_custom', dataUrl);
            const saved = sessionStorage.getItem('rnd_cadd_user') || localStorage.getItem('rnd_cadd_user');
            const parsed = saved ? JSON.parse(saved) : {};
            parsed.photo = dataUrl;
            sessionStorage.setItem('rnd_cadd_user', JSON.stringify(parsed));
            localStorage.setItem('rnd_cadd_user', JSON.stringify(parsed));
          } catch {}
        }

        if (studentUser.email) {
          fetch('/api/student/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_profile', email: studentUser.email, photo: dataUrl }),
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Photo upload compression error:', err);
    }
  };

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('Student');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editCollege, setEditCollege] = useState<string>('');
  const [editNativePlace, setEditNativePlace] = useState<string>('');
  const [editQualification, setEditQualification] = useState<string>('');
  const [editPhoto, setEditPhoto] = useState<string>('');
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
  const [watchedClassIds, setWatchedClassIds] = useState<string[]>([]);
  const [classDurations, setClassDurations] = useState<Record<string, number>>({});
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
  const [useIframeFallback, setUseIframeFallback] = useState<boolean>(false);

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
  const [applyStudentPhone, setApplyStudentPhone] = useState<string>('');
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

  // Course Rating & Trainer Review State (Synced with Admin Course Ratings)
  const [rateCourseName, setRateCourseName] = useState<string>('');
  const [rateScore, setRateScore] = useState<number>(5);
  const [rateHoverScore, setRateHoverScore] = useState<number>(0);
  const [rateReviewText, setRateReviewText] = useState<string>('');
  const [rateTrainerFeedback, setRateTrainerFeedback] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [mySubmittedReviews, setMySubmittedReviews] = useState<CourseReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);

  
  // Dynamic Offers & Referral State from Admin
  const [studentOffers, setStudentOffers] = useState<OfferItem[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState<boolean>(false);
  const [copiedReferral, setCopiedReferral] = useState<boolean>(false);
  const [copiedOfferCode, setCopiedOfferCode] = useState<string | null>(null);

  const fetchStudentOffers = async () => {
    setIsLoadingOffers(true);
    try {
      const res = await fetch('/api/offers?status=Active&t=' + Date.now());
      const data = await res.json();
      if (data && data.success && Array.isArray(data.offers)) {
        setStudentOffers(data.offers);
      }
    } catch (err) {
      console.error('Failed to load student offers:', err);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  // Dynamic Live Class State from Admin Broadcast
  const [liveClass, setLiveClass] = useState<LiveClassSession | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);

  // Fetch live class broadcast from admin
  const fetchLiveClass = async (silent = false) => {
    if (!silent) setIsLoadingLive(true);
    try {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('rnd_cadd_live_session');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (parsed && typeof parsed === 'object') {
              setLiveClass(parsed);
            }
          } catch {}
        }
      }

      const res = await fetch('/api/live-classes?t=' + Date.now());
      const data = await res.json();
      if (data && data.success && data.liveClass) {
        setLiveClass(data.liveClass);
        if (typeof window !== 'undefined') {
          localStorage.setItem('rnd_cadd_live_session', JSON.stringify(data.liveClass));
        }
      } else {
        setLiveClass(null);
      }
    } catch (err) {
      console.error('Failed to fetch live class session:', err);
    } finally {
      if (!silent) setIsLoadingLive(false);
    }
  };


  // Fetch reviews submitted by this student
  const fetchStudentReviews = async (userEmail?: string) => {
    setIsLoadingReviews(true);
    try {
      const email = userEmail || studentUser.email;
      const res = await fetch(`/api/reviews?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setMySubmittedReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load student reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Submit new course rating and trainer review directly to Administration
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseToSubmit =
      rateCourseName ||
      studentUser.assignedCourses?.[0] ||
      studentUser.stream ||
      'Civil CADD & Master BIM';

    if (!rateReviewText.trim()) {
      alert('Please enter your written review about the course and trainers.');
      return;
    }

    setIsSubmittingReview(true);
    setReviewSuccessMsg(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentUser.id,
          studentName: studentUser.name,
          studentEmail: studentUser.email,
          studentPhoto: studentUser.photo,
          courseName: courseToSubmit,
          rating: rateScore,
          review: rateReviewText,
          trainerFeedback: rateTrainerFeedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccessMsg('Your course rating and review have been submitted successfully to Administration!');
        setRateReviewText('');
        setRateTrainerFeedback('');
        fetchStudentReviews(studentUser.email);
        setTimeout(() => setReviewSuccessMsg(null), 5000);
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (err: any) {
      console.error('Submit review error:', err);
      alert('Network error submitting review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Fetch live student details from API to reflect give/revoke access and course assignments
  const fetchStudentStatus = async (userEmail: string, silent = false) => {
    if (!silent) setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/admin/students');
      const data = await res.json();
      if (data.success && Array.isArray(data.students)) {
        const matching = data.students.find(
          (s: any) => s.email?.toLowerCase().trim() === userEmail?.toLowerCase().trim()
        );

        if (matching) {
          // Read this specific student's enrolled courses from student-specific storage
          let perStudentCourses: string[] = [];
          if (typeof window !== 'undefined') {
            const studentKey = `rnd_cadd_enrolled_${userEmail.toLowerCase().trim()}`;
            const localStored = localStorage.getItem(studentKey);
            if (localStored) {
              try {
                const parsed = JSON.parse(localStored);
                if (Array.isArray(parsed)) perStudentCourses = parsed;
              } catch {}
            }
          }

          const resolvedCourses = Array.isArray(matching.assignedCourses) && matching.assignedCourses.length > 0
            ? Array.from(new Set([...matching.assignedCourses, ...perStudentCourses]))
            : (perStudentCourses.length > 0 ? perStudentCourses : []);

          setStudentUser((prev) => ({
            ...prev,
            name: matching.name || prev.name,
            email: matching.email || prev.email,
            id: matching.studentId || matching.id || prev.id,
            photo: matching.photo || matching.image || prev.photo,
            stream: matching.courseName || prev.stream,
            phone: matching.officialMobile && matching.officialMobile !== '-' ? matching.officialMobile : (matching.mobile && matching.mobile !== '-' ? matching.mobile : prev.phone),
            college: matching.college && matching.college !== '-' ? matching.college : prev.college,
            nativePlace: matching.residence && matching.residence !== '-' ? matching.residence : prev.nativePlace,
            qualification: matching.qualification && matching.qualification !== '-' ? matching.qualification : prev.qualification,
            courseFee: matching.courseFee ? Number(matching.courseFee) : prev.courseFee,
            paidFee: matching.paidFee !== undefined ? Number(matching.paidFee) : prev.paidFee,
            balanceFee: matching.balanceFee !== undefined ? Number(matching.balanceFee) : prev.balanceFee,
            accessStatus: matching.accessStatus || 'active',
            assignedCourses: resolvedCourses,
            attendance: typeof matching.attendance === 'number' ? matching.attendance : (matching.attendance ? Number(matching.attendance) : 0),
            designs: Array.isArray(matching.designs) ? matching.designs : [],
          }));
          // Fetch certificates with verified student ID
          fetchStudentCertificates(matching.email || userEmail, matching.studentId || matching.id);
          // Fetch e-books matching verified student enrollment
          fetchStudentEbooks(matching.email || userEmail, matching.studentId || matching.id, resolvedCourses);
          // Fetch real-time support tickets
          fetchStudentTickets(matching.email || userEmail, matching.studentId || matching.id);
          // Fetch assignments for student's enrolled courses silently in background
          fetchStudentAssignments(resolvedCourses, true);
          // Fetch full student profile details and fee receipts
          fetchStudentProfile(matching.email || userEmail);
          // Fetch student course & trainer reviews
          fetchStudentReviews(matching.email || userEmail);
        } else {
          // If this registered student is in local session, load their own per-student enrolled courses
          if (typeof window !== 'undefined') {
            const studentKey = `rnd_cadd_enrolled_${userEmail.toLowerCase().trim()}`;
            const localStored = localStorage.getItem(studentKey);
            if (localStored) {
              try {
                const parsed = JSON.parse(localStored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setStudentUser((prev) => ({
                    ...prev,
                    assignedCourses: Array.from(new Set([...prev.assignedCourses, ...parsed])),
                  }));
                }
              } catch {}
            }
          }
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
        const localCustomPhoto = typeof window !== 'undefined'
          ? (localStorage.getItem(`rnd_cadd_student_photo_${(p.email || email).toLowerCase().trim()}`) ||
             localStorage.getItem('rnd_cadd_student_photo_custom'))
          : null;
        const resolvedPhoto = (localCustomPhoto && localCustomPhoto.trim().length > 0)
          ? localCustomPhoto
          : (p.photo || prev.photo);

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
          photo: resolvedPhoto,
          courseFee: p.courseFee !== undefined ? Number(p.courseFee) : prev.courseFee,
          paidFee: p.paidFee !== undefined ? Number(p.paidFee) : prev.paidFee,
          balanceFee: p.balanceFee !== undefined ? Number(p.balanceFee) : prev.balanceFee,
          labWorkstation: p.labWorkstation || prev.labWorkstation,
          leadInstructor: p.leadInstructor || prev.leadInstructor,
          campusLocation: p.campusLocation || prev.campusLocation,
          assignedCourses: Array.isArray(p.assignedCourses) && p.assignedCourses.length > 0 ? p.assignedCourses : prev.assignedCourses,
          paymentReceipts: Array.isArray(p.paymentReceipts) ? p.paymentReceipts : prev.paymentReceipts,
          attendance: typeof p.attendance === 'number' ? p.attendance : prev.attendance,
          designs: Array.isArray(p.designs) ? p.designs : prev.designs,
        }));
        if (!isEditingProfile) {
          setEditName(p.name || 'Student');
          setEditPhone(p.phone || '');
          setEditCollege(p.college || '');
          setEditNativePlace(p.nativePlace || '');
          setEditQualification(p.qualification || '');
          setEditPhoto(resolvedPhoto);
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
        const updatedName = editName.trim() || studentUser.name;
        const updatedPhone = editPhone.trim();
        const updatedCollege = editCollege.trim();
        const updatedNativePlace = editNativePlace.trim();
        const updatedQualification = editQualification.trim();
        const updatedPhoto = editPhoto.trim();

        setStudentUser((prev) => ({
          ...prev,
          name: updatedName,
          phone: updatedPhone,
          college: updatedCollege,
          nativePlace: updatedNativePlace,
          qualification: updatedQualification,
          photo: updatedPhoto,
        }));

        // Persist to localStorage so student name and photo update globally across header, sidebar & portal
        if (typeof window !== 'undefined') {
          try {
            const emailKey = (studentUser.email || '').toLowerCase().trim();
            if (updatedPhoto) {
              localStorage.setItem(`rnd_cadd_student_photo_${emailKey}`, updatedPhoto);
              localStorage.setItem('rnd_cadd_student_photo_custom', updatedPhoto);
            }
            const saved = localStorage.getItem('rnd_cadd_user');
            const parsed = saved ? JSON.parse(saved) : {};
            parsed.name = updatedName;
            parsed.photo = updatedPhoto;
            parsed.phone = updatedPhone;
            parsed.college = updatedCollege;
            parsed.residence = updatedNativePlace;
            parsed.qualification = updatedQualification;
            localStorage.setItem('rnd_cadd_user', JSON.stringify(parsed));
          } catch {
            // ignore
          }
        }

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
      const res = await fetch('/api/courses?t=' + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) {
        setAllCourses(data.courses);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('rnd_cadd_cached_courses', JSON.stringify(data.courses));
          } catch (e) {}
        }
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
    setMounted(true);
    let emailToUse = '';
    let idToUse = '';
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('rnd_cadd_cached_courses');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) setAllCourses(parsed);
        }
      } catch (e) {
        // ignore
      }

      // 1. Check URL query params first (e.g. /portal/student?email=student2@gmail.com)
      const urlParams = new URLSearchParams(window.location.search);
      const queryEmail = urlParams.get('email')?.toLowerCase().trim();
      const queryId = urlParams.get('id')?.trim();

      // 2. Check window-isolated sessionStorage!
      let sessionUser: any = null;
      try {
        const sessionRaw = sessionStorage.getItem('rnd_cadd_user');
        if (sessionRaw) sessionUser = JSON.parse(sessionRaw);
      } catch {}

      // Filter out admin users from student portal if not viewing student mode
      if (sessionUser && sessionUser.role === 'admin' && !queryEmail && !sessionUser.email?.includes('student')) {
        // Allow session if actively on student portal page
      }

      // 3. Fallback to localStorage only if sessionStorage is empty AND queryEmail is not provided
      let localUser: any = null;
      if (!sessionUser && !queryEmail) {
        try {
          const localRaw = localStorage.getItem('rnd_cadd_user');
          if (localRaw) {
            const parsed = JSON.parse(localRaw);
            if (parsed) {
              localUser = parsed;
            }
          }
        } catch {}
      }

      let activeUser = queryEmail
        ? (sessionUser?.email?.toLowerCase().trim() === queryEmail ? sessionUser : null)
        : (sessionUser || localUser);

      // Resolve standard predefined student accounts if matching query or session
      let targetEmail = queryEmail || activeUser?.email || 'student1@gmail.com';

      if (!activeUser || activeUser.email?.toLowerCase().trim() !== targetEmail) {
        if (targetEmail === 'student2@gmail.com') {
          activeUser = {
            name: 'Student 2',
            email: 'student2@gmail.com',
            role: 'student',
            id: 'STU-002',
            studentId: 'STU-002',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            stream: 'Mechanical CAD & SolidWorks Expert',
            assignedCourses: ['Mechanical CAD & SolidWorks Expert', 'Ansys Simulation & FEA'],
          };
        } else if (targetEmail === 'student3@gmail.com') {
          activeUser = {
            name: 'Student 3',
            email: 'student3@gmail.com',
            role: 'student',
            id: 'STU-003',
            studentId: 'STU-003',
            photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
            stream: 'Electrical CADD & Control Systems',
            assignedCourses: ['Electrical CADD & Control Systems', 'AutoCAD Electrical & Panel Design'],
          };
        } else if (targetEmail === 'student1@gmail.com') {
          activeUser = {
            name: 'Student 1',
            email: 'student1@gmail.com',
            role: 'student',
            id: 'STU-001',
            studentId: 'STU-001',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            stream: 'Civil CADD & Master BIM',
            assignedCourses: ['Civil CADD & Master BIM', 'Interior Architecture & 3D Visualization'],
          };
        } else {
          activeUser = {
            name: targetEmail.split('@')[0],
            email: targetEmail,
            role: 'student',
            id: queryId || 'STU-NEW',
            studentId: queryId || 'STU-NEW',
            stream: 'Civil CADD & Master BIM',
            assignedCourses: ['Civil CADD & Master BIM'],
          };
        }
      }

      if (activeUser && activeUser.email) {
        emailToUse = activeUser.email.toLowerCase().trim();
        idToUse = activeUser.studentId || activeUser.id || 'STU-001';

        // Isolate this window's session exclusively
        sessionStorage.setItem('rnd_cadd_user', JSON.stringify(activeUser));
        sessionStorage.setItem('rnd_cadd_role', 'student');

        // Load this specific student's enrolled courses from per-student storage
        let studentLocalCourses: string[] = [];
        const studentKey = `rnd_cadd_enrolled_${emailToUse}`;
        const localStored = localStorage.getItem(studentKey);
        if (localStored) {
          try {
            const parsedList = JSON.parse(localStored);
            if (Array.isArray(parsedList)) studentLocalCourses = parsedList;
          } catch {}
        }

        const initialCourses = Array.isArray(activeUser.assignedCourses) && activeUser.assignedCourses.length > 0
          ? activeUser.assignedCourses
          : (studentLocalCourses.length > 0 ? studentLocalCourses : (activeUser.stream ? [activeUser.stream] : []));

        const savedPhoto = typeof window !== 'undefined'
          ? (localStorage.getItem(`rnd_cadd_student_photo_${emailToUse}`) ||
             localStorage.getItem('rnd_cadd_student_photo_custom') ||
             activeUser.photo ||
             activeUser.image ||
             sessionUser?.photo ||
             sessionUser?.image ||
             localUser?.photo ||
             localUser?.image || '')
          : (activeUser.photo || activeUser.image || '');

        setStudentUser((prev) => ({
          ...prev,
          name: activeUser.name || activeUser.fullName || prev.name,
          email: emailToUse,
          stream: activeUser.stream || (initialCourses[0] || prev.stream),
          id: idToUse,
          photo: savedPhoto || activeUser.photo || activeUser.image || prev.photo,
          assignedCourses: initialCourses,
        }));
      }
    }

    fetchStudentStatus(emailToUse);
    fetchCourses();
    fetchStudentJobs();
    fetchStudentReviews(emailToUse);
    fetchLiveClass();
    fetchStudentOffers();
  }, []);

  // Real-time live classes sync & cross-tab storage listener
  useEffect(() => {
    fetchLiveClass(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'rnd_cadd_live_session' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setLiveClass(parsed);
        } catch {}
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
    }

    const interval = setInterval(() => {
      fetchLiveClass(true);
    }, activeTab === 'Live' ? 4000 : 15000);

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
      clearInterval(interval);
    };
  }, [activeTab]);

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
      const matched = findCourseInCatalog(cName, allCourses);
      const classes: CourseClass[] = getClassesForCourse(matched?.title || cName, matched?.classes);
      const watchedCount = classes.filter((cls, cIdx) => {
        const numMatch = (cls.classNumber || '').match(/\d+/);
        const num = numMatch ? parseInt(numMatch[0], 10) : cIdx + 1;
        const normalizedKeys = [
          cls.id,
          cls.classNumber,
          cls.title,
          `Class ${num}`,
          `Class 0${num}`,
          `Class - ${num}`,
          `Class - 0${num}`,
          `${cName}_${cls.id}`,
          `${cName}_${cls.classNumber}`,
          `${cName}_Class ${num}`,
          `${cName}_Class 0${num}`,
          `${cName}_Class - ${num}`,
          `${cName}_0`,
          `${cName}_${cIdx}`,
          matched?.title ? `${matched.title}_${cls.id}` : '',
          matched?.title ? `${matched.title}_${cls.classNumber}` : '',
          matched?.title ? `${matched.title}_Class ${num}` : '',
          matched?.title ? `${matched.title}_Class 0${num}` : '',
          matched?.title ? `${matched.title}_Class - ${num}` : '',
          matched?.title ? `${matched.title}_0` : '',
          matched?.title ? `${matched.title}_${cIdx}` : '',
        ].filter(Boolean);
        return normalizedKeys.some((k) => watchedClassIds.includes(k));
      }).length;
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

  const markClassAsWatched = (classId: string, courseTitle?: string, classNumber?: string) => {
    setWatchedClassIds((prev) => {
      const idsToAdd = [classId];
      if (classNumber) {
        idsToAdd.push(classNumber);
        const numMatch = classNumber.match(/\d+/);
        if (numMatch) {
          const num = parseInt(numMatch[0], 10);
          idsToAdd.push(`Class ${num}`);
          idsToAdd.push(`Class 0${num}`);
          idsToAdd.push(`Class - ${num}`);
          idsToAdd.push(`Class - 0${num}`);
          if (courseTitle) {
            idsToAdd.push(`${courseTitle}_Class ${num}`);
            idsToAdd.push(`${courseTitle}_Class 0${num}`);
            idsToAdd.push(`${courseTitle}_Class - ${num}`);
            idsToAdd.push(`${courseTitle}_0`);
            idsToAdd.push(`${courseTitle}_${num - 1}`);
          }
        }
      }
      if (courseTitle) {
        idsToAdd.push(`${courseTitle}_${classId}`);
        if (classNumber) {
          idsToAdd.push(`${courseTitle}_${classNumber}`);
        }
      }
      const newIds = idsToAdd.filter((id) => !prev.includes(id));
      if (newIds.length === 0) return prev;
      const updated = [...prev, ...newIds];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`rnd_cadd_watched_${studentUser.email}`, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
      }
      return updated;
    });
  };

  const handleToggleClassWatched = (classId: string, courseTitle?: string, classNumber?: string) => {
    setWatchedClassIds((prev) => {
      const isAlready = prev.includes(classId) || (classNumber ? prev.includes(classNumber) : false);
      const keysToRemove = [classId, classNumber || '', courseTitle && classNumber ? `${courseTitle}_${classNumber}` : ''].filter(Boolean);
      const updated = isAlready
        ? prev.filter((id) => !keysToRemove.includes(id))
        : [...prev, classId, ...(classNumber ? [classNumber] : []), ...(courseTitle && classNumber ? [`${courseTitle}_${classNumber}`] : [])];
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
    // 1. Immediately match existing course data from allCourses or fallback
    const catalogMatch = findCourseInCatalog(course.title, allCourses) || findCourseInCatalog(course.id, allCourses);
    const candidateClasses =
      (catalogMatch?.classes && catalogMatch.classes.length > 0)
        ? catalogMatch.classes
        : (course.classes && course.classes.length > 0 ? course.classes : undefined);

    const courseClasses = getClassesForCourse(catalogMatch?.title || course.title, candidateClasses);
    const resolvedCourse: StoredCourse = {
      ...(catalogMatch || course),
      classes: courseClasses,
    };
    const defaultClass =
      targetClass || (courseClasses.length > 0 ? courseClasses[0] : null);
    setPlayerCourse(resolvedCourse);
    setActivePlayerClass(defaultClass);
    setVideoCurrentTime(0);
    setVideoIsPlaying(false);
    setPlaylistSearchQuery('');
    setStudentViewerMode('video');

    if (typeof window !== 'undefined') {
      window.history.pushState(
        { rndStudio: true, courseId: course.id },
        '',
        window.location.pathname
      );
    }

    // 2. Fetch fresh courses in background so any class newly added by Admin appears immediately
    fetch('/api/courses?t=' + Date.now(), { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.courses)) {
          setAllCourses(data.courses);
          const fresh = findCourseInCatalog(course.title, data.courses) || findCourseInCatalog(course.id, data.courses);
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

  // Preload video durations dynamically for all playlist classes
  useEffect(() => {
    if (playerCourse?.classes && typeof window !== 'undefined') {
      playerCourse.classes.forEach((cls) => {
        if (cls.videoUrl && !classDurations[cls.id]) {
          try {
            const probe = document.createElement('video');
            probe.src = cls.videoUrl;
            probe.preload = 'metadata';
            probe.onloadedmetadata = () => {
              if (probe.duration && !isNaN(probe.duration) && isFinite(probe.duration)) {
                setClassDurations((prev) => ({ ...prev, [cls.id]: probe.duration }));
              }
            };
          } catch (e) {
            // ignore
          }
        }
      });
    }
  }, [playerCourse?.classes]);

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

  // Sync active class duration and reset playback when switching classes
  useEffect(() => {
    if (activePlayerClass) {
      const dur = parseDurationSeconds(activePlayerClass.duration);
      setVideoDuration(dur);
      setVideoCurrentTime(0);
      setVideoIsPlaying(false);
      setShowControlsOverlay(true);
      setShowSpeedMenu(false);
      setShowSettingsMenu(false);
      setUseIframeFallback(false);
    }
  }, [activePlayerClass]);

  // Video progress timer interval for simulated & cross-origin playback
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (videoIsPlaying && !videoRef.current) {
      interval = setInterval(() => {
        setVideoCurrentTime((prev) => {
          const next = prev + 1 * videoPlaybackSpeed;
          if (videoDuration > 0 && next >= videoDuration) {
            setVideoIsPlaying(false);
            return videoDuration;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [videoIsPlaying, videoPlaybackSpeed, videoDuration]);

  const handlePlayPause = () => {
    if (videoRef.current) {
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
    } else {
      const next = !videoIsPlaying;
      setVideoIsPlaying(next);
      showVideoToast(next ? 'Playing ▶' : 'Paused ⏸');
      const iframe = playerContainerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: next ? 'playVideo' : 'pauseVideo', args: [] }),
            '*'
          );
        } catch {}
      }
    }
  };

  const handleSkipBackward = () => {
    if (videoRef.current) {
      const nextTime = Math.max(0, videoRef.current.currentTime - 10);
      videoRef.current.currentTime = nextTime;
      setVideoCurrentTime(nextTime);
    } else {
      const nextTime = Math.max(0, videoCurrentTime - 10);
      setVideoCurrentTime(nextTime);
      const iframe = playerContainerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'seekTo', args: [nextTime, true] }),
            '*'
          );
        } catch {}
      }
    }
    showVideoToast('↺ -10s');
  };

  const handleSkipForward = () => {
    if (videoRef.current) {
      const nextTime = Math.min(
        videoRef.current.duration || 99999,
        videoRef.current.currentTime + 10
      );
      videoRef.current.currentTime = nextTime;
      setVideoCurrentTime(nextTime);
    } else {
      const nextTime = videoCurrentTime + 10;
      setVideoCurrentTime(nextTime);
      const iframe = playerContainerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'seekTo', args: [nextTime, true] }),
            '*'
          );
        } catch {}
      }
    }
    showVideoToast('↻ +10s');
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    } else {
      const iframe = playerContainerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'seekTo', args: [newTime, true] }),
            '*'
          );
        } catch {}
      }
    }
    setVideoCurrentTime(newTime);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetDuration = videoDuration > 0 ? videoDuration : parseDurationSeconds(activePlayerClass?.duration);
    const newTime = Math.round(pct * targetDuration);
    handleSeek(newTime);
    showVideoToast(`Seek: ${formatVideoTime(newTime)}`);
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    } else {
      const iframe = playerContainerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [speed] }),
            '*'
          );
        } catch {}
      }
    }
    setVideoPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    showVideoToast(`⚡ Speed: ${speed}x`);
  };

  const handleQualityChange = (quality: string) => {
    setVideoQuality(quality);
    setShowQualityMenu(false);
    showVideoToast(`⚙ Quality: ${quality}`);
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
    const nextMuted = !videoIsMuted;
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    } else {
      const iframe = playerContainerRef.current?.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: nextMuted ? 'mute' : 'unMute', args: [] }),
            '*'
          );
        } catch {}
      }
    }
    setVideoIsMuted(nextMuted);
    showVideoToast(nextMuted ? 'Muted 🔇' : 'Unmuted 🔊');
  };

  // Synchronize YouTube Iframe Player state, time, and duration
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            setVideoCurrentTime(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            setVideoDuration(data.info.duration);
          }
          if (typeof data.info.playerState === 'number') {
            setVideoIsPlaying(data.info.playerState === 1);
          }
        }
      } catch {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen().catch(() => {});
      } else if ((playerContainerRef.current as any).webkitRequestFullscreen) {
        (playerContainerRef.current as any).webkitRequestFullscreen();
      } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
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
      sessionStorage.removeItem('rnd_cadd_user');
      sessionStorage.removeItem('rnd_cadd_role');
      sessionStorage.removeItem('rnd_cadd_student_session');
      try {
        const local = localStorage.getItem('rnd_cadd_user');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.email === studentUser.email) {
            localStorage.removeItem('rnd_cadd_user');
            localStorage.removeItem('rnd_cadd_role');
          }
        }
      } catch {}
      window.location.href = '/signin';
    }
  };

  const navItems = [
    {
      id: 'Home',
      label: 'Home',
      tag: '01',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      id: 'Profile',
      label: 'Profile',
      tag: '02',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      id: 'Jobs',
      label: 'Jobs & Placements',
      tag: 'JOBS',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
    },
    {
      id: 'Certificates',
      label: 'Certificates',
      tag: 'CERT',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
    {
      id: 'Assignments',
      label: 'Assignments',
      tag: 'TASK',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-10.5-9h10.5m-10.5 3h10.5m-10.5 3h6.75" />
        </svg>
      ),
    },
    {
      id: 'E-Books',
      label: 'E-Books',
      tag: 'BOOK',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      id: 'Live',
      label: 'Live',
      tag: 'LIVE',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
    },
    {
      id: 'Chat',
      label: 'Support & Tickets',
      tag: 'HELP',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      id: 'Refer & Earn',
      label: 'Refer & Earn',
      tag: '04',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
    {
      id: 'Rate',
      label: 'Rate Training & Feedback',
      tag: '05',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
  ];

  // MNC Dashboard Menu Helpers for Student Portal
  const getStudentNavBadge = (id: string, isActive: boolean) => {
    const badgeClass = (colorClass: string) =>
      `text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
        isActive ? 'bg-slate-900 text-white shadow-2xs' : colorClass
      }`;

    switch (id) {
      case 'Home':
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>{studentUser.assignedCourses?.length || 0}</span>;
      case 'Profile':
        return <span className={badgeClass('bg-emerald-50 text-emerald-700')}>Active</span>;
      case 'Jobs':
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>{studentJobs.filter((j) => j.status === 'Active').length}</span>;
      case 'Certificates':
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>{studentCertificates.length}</span>;
      case 'Assignments':
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>{studentAssignments.length}</span>;
      case 'E-Books':
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>{studentEbooks.length}</span>;
      case 'Live':
        return (
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
            liveClass?.status === 'Live Now' && liveClass?.isLive
              ? 'bg-emerald-500 text-white animate-pulse'
              : isActive
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {liveClass?.status === 'Live Now' && liveClass?.isLive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            {liveClass?.status === 'Live Now' && liveClass?.isLive ? 'LIVE' : 'Online'}
          </span>
        );
      case 'Chat': {
        const openTickets = studentTickets.filter((t) => t.status !== 'Resolved').length;
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>{openTickets}</span>;
      }
      case 'Refer & Earn':
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>Offers</span>;
      case 'Rate':
        return <span className={badgeClass('bg-slate-100 text-slate-800')}>★</span>;
      default:
        return null;
    }
  };

  const getStudentIconBg = (id: string, isActive: boolean) => {
    return 'w-6 h-6 flex items-center justify-center shrink-0 text-slate-900';
  };

  // Grouped Navigation Sections for Student Portal
  const studentNavSections = [
    {
      category: 'ACADEMIC CURRICULUM',
      items: navItems.filter((item) => ['Home', 'Profile', 'Certificates', 'Assignments'].includes(item.id)),
    },
    {
      category: 'RESOURCES & LAB SESSIONS',
      items: navItems.filter((item) => ['E-Books', 'Live', 'Jobs'].includes(item.id)),
    },
    {
      category: 'SERVICES & SUPPORT',
      items: navItems.filter((item) => ['Chat', 'Refer & Earn', 'Rate'].includes(item.id)),
    },
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
      {/* MOBILE STICKY TOP BAR (< md) */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div
            onClick={() => setActiveTab('Profile')}
            className="w-9 h-9 min-w-[36px] min-h-[36px] max-w-[36px] max-h-[36px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 cursor-pointer shadow-2xs aspect-square"
            style={{ width: '36px', height: '36px', minWidth: '36px', minHeight: '36px' }}
            title="Profile"
          >
            <img
              src={getStudentAvatar(studentUser.photo, studentUser.name, studentUser.email, studentUser.id)}
              alt={studentUser.name}
              className="w-full h-full object-cover aspect-square"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const customPhoto = typeof window !== 'undefined'
                  ? (localStorage.getItem(`rnd_cadd_student_photo_${(studentUser.email || '').toLowerCase().trim()}`) ||
                     localStorage.getItem('rnd_cadd_student_photo_custom'))
                  : null;
                if (customPhoto && target.src !== customPhoto) {
                  target.src = customPhoto;
                } else if (target.src !== DEFAULT_STUDENT_AVATARS[0]) {
                  target.src = DEFAULT_STUDENT_AVATARS[0];
                }
              }}
            />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-black text-slate-900 block truncate leading-tight">
              {studentUser.name}
            </span>
            <span className="text-xs font-mono font-bold text-slate-500 block truncate">
              ID: {studentUser.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 transition-all"
            aria-label={isMobileNavOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileNavOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              {isMobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth={2.2} />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3v18" stroke="currentColor" strokeWidth={2.2} />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER (< md) - MNC Executive Student Drawer with Border Radius */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative w-full max-w-[320px] sm:max-w-xs bg-white h-full z-10 flex flex-col justify-between p-4 pt-3.5 overflow-y-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden safe-pb shadow-2xl rounded-r-3xl border-r border-slate-200/90 animate-in slide-in-from-left duration-300">
            {/* Minimal Close Button in Top-Right */}
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm active:scale-95 transition-all cursor-pointer shadow-2xs"
              aria-label="Close Menu"
            >
              &times;
            </button>

            <div>
              {/* Student Info - MNC Executive Profile Card (Pushed right to top) */}
              <div
                onClick={() => {
                  setActiveTab('Profile');
                  setIsMobileNavOpen(false);
                }}
                className="p-3 pr-8 mb-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3.5 cursor-pointer hover:border-slate-300 transition-all active:scale-[0.99]"
              >
                <div
                  className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl overflow-hidden border-2 border-slate-200 shrink-0 shadow-2xs relative aspect-square"
                  style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', maxWidth: '56px', maxHeight: '56px' }}
                >
                  <img
                    src={getStudentAvatar(studentUser.photo, studentUser.name, studentUser.email, studentUser.id)}
                    alt={studentUser.name}
                    className="w-full h-full object-cover aspect-square"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const customPhoto = typeof window !== 'undefined'
                        ? (localStorage.getItem(`rnd_cadd_student_photo_${(studentUser.email || '').toLowerCase().trim()}`) ||
                           localStorage.getItem('rnd_cadd_student_photo_custom'))
                        : null;
                      if (customPhoto && target.src !== customPhoto) {
                        target.src = customPhoto;
                      } else if (target.src !== DEFAULT_STUDENT_AVATARS[0]) {
                        target.src = DEFAULT_STUDENT_AVATARS[0];
                      }
                    }}
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate tracking-tight">{studentUser.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 truncate font-semibold">ID: {studentUser.id}</p>
                  <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">{studentUser.stream || 'Certified CAD Trainee'}</p>
                </div>
              </div>

              {/* Categorized MNC Navigation Items */}
              <div className="space-y-4">
                {studentNavSections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>{sec.category}</span>
                      <span className="w-8 h-px bg-slate-200" />
                    </div>
                    {sec.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                            isActive
                              ? 'bg-white text-slate-950 font-extrabold shadow-xs border border-slate-200/90 ring-1 ring-slate-100'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 active:bg-slate-100/70 font-semibold'
                          }`}
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <span className="w-6 h-6 flex items-center justify-center shrink-0 text-slate-900">
                              {item.icon}
                            </span>
                            <span className="truncate text-sm font-bold text-slate-900">{item.label}</span>
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStudentNavBadge(item.id, isActive)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
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

      {/* LEFT SIDEBAR - FIXED & IMMOBILE (MNC Grouped Design) */}
      <aside className="hidden md:flex w-full md:w-80 md:fixed md:top-0 md:left-0 md:bottom-0 md:h-screen bg-[#FFFFFF] border-r border-slate-200 flex-col justify-between shadow-xs z-30 flex-shrink-0">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Student Profile Identity */}
          <div className="px-5 pt-7 pb-5 sm:pt-8 sm:pb-5 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex items-center space-x-3.5">
              <div
                onClick={() => setActiveTab('Profile')}
                className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 relative group cursor-pointer aspect-square"
                style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px' }}
                title="Click to view & customize student profile"
              >
                <img
                  src={getStudentAvatar(studentUser.photo, studentUser.name, studentUser.email, studentUser.id)}
                  alt={studentUser.name}
                  className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const customPhoto = typeof window !== 'undefined'
                      ? (localStorage.getItem(`rnd_cadd_student_photo_${(studentUser.email || '').toLowerCase().trim()}`) ||
                         localStorage.getItem('rnd_cadd_student_photo_custom'))
                      : null;
                    if (customPhoto && target.src !== customPhoto) {
                      target.src = customPhoto;
                    } else if (target.src !== DEFAULT_STUDENT_AVATARS[0]) {
                      target.src = DEFAULT_STUDENT_AVATARS[0];
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-4 h-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <div className="overflow-hidden min-w-0">
                <h2
                  onClick={() => setActiveTab('Profile')}
                  className="text-lg sm:text-xl font-extrabold text-[#131313] truncate tracking-tight cursor-pointer hover:text-[#EE2C3C] transition-colors"
                  title="Click to view/edit profile"
                >
                  {studentUser.name}
                </h2>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-500 block truncate mt-0.5">
                  ID: {studentUser.id}
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Items - MNC Corporate Grouped Design */}
          <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {studentNavSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>{sec.category}</span>
                  <span className="w-10 h-px bg-slate-200" />
                </div>
                {sec.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-950 font-extrabold shadow-xs border border-slate-200/90 ring-1 ring-slate-100'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 active:bg-slate-100/70 font-semibold'
                      }`}
                    >
                      <span className="flex items-center space-x-3 min-w-0">
                        <span className="w-6 h-6 flex items-center justify-center shrink-0 text-slate-900">
                          {item.icon}
                        </span>
                        <span className="truncate text-sm font-bold text-slate-900">{item.label}</span>
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStudentNavBadge(item.id, isActive)}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
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
                      {latest.timestamp}
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
          <div className="mx-3.5 sm:mx-8 mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            <span className="self-start sm:self-center px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold">
              Suspended
            </span>
          </div>
        )}

        {/* Dynamic Body Content */}
        <div className="px-3.5 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-8 flex-1 space-y-5 sm:space-y-6">
          {/* TAB 1: HOME */}
          {activeTab === 'Home' && (
            <div className="space-y-6">
              {/* Quick Stat Metric Cards - MNC Compact 2x2 Responsive Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {/* 1. Syllabus Progress */}
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1 gap-1">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                        Syllabus
                      </span>
                      <span suppressHydrationWarning className="text-[10px] sm:text-[11px] font-bold text-slate-500 shrink-0">
                        {watchedClassesCount}/{totalClassesCount}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span suppressHydrationWarning className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#EE2C3C]">
                        {overallSyllabusProgress}%
                      </span>
                      <span className="text-[10px] sm:text-xs text-emerald-600 font-semibold truncate">
                        {overallSyllabusProgress === 100 ? 'Done' : 'Active'}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#EE2C3C] h-full rounded-full transition-all duration-500"
                      style={{ width: `${overallSyllabusProgress}%` }}
                    />
                  </div>
                </div>

                {/* 2. Lab Attendance */}
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 truncate">
                      Attendance
                    </span>
                    <span suppressHydrationWarning className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#131313]">
                      {studentUser.attendance && Number(studentUser.attendance) > 0 ? `${studentUser.attendance}%` : '0%'}
                    </span>
                  </div>
                  <span suppressHydrationWarning className="text-[10px] sm:text-xs text-slate-500 font-medium block mt-1.5 truncate flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${studentUser.attendance && Number(studentUser.attendance) > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="truncate">{studentUser.attendance && Number(studentUser.attendance) > 0 ? 'Regular' : 'No records yet'}</span>
                  </span>
                </div>

                {/* 3. CAD Designs Submitted */}
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 truncate">
                      CAD Models
                    </span>
                    <span suppressHydrationWarning className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#131313]">
                      {Array.isArray(studentUser.designs) && studentUser.designs.length > 0
                        ? `${studentUser.designs.length}`
                        : '0'}
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 ml-1">Models</span>
                    </span>
                  </div>
                  <span suppressHydrationWarning className="text-[10px] sm:text-xs text-slate-500 font-medium block mt-1.5 truncate">
                    {Array.isArray(studentUser.designs) && studentUser.designs.length > 0
                      ? `${studentUser.designs.length} submitted`
                      : 'None submitted'}
                  </span>
                </div>

                {/* 4. Credentials */}
                <div
                  onClick={() => setActiveTab('Certificates')}
                  className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-400 transition-all cursor-pointer flex flex-col justify-between"
                  title="Click to view official verified certificates"
                >
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 truncate">
                      Credentials
                    </span>
                    <span suppressHydrationWarning className="text-lg sm:text-2xl font-extrabold text-emerald-600 truncate block">
                      {studentCertificates.length > 0 ? `Issued (${studentCertificates.length})` : (overallSyllabusProgress === 100 ? 'Eligible' : '0 Issued')}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-600 font-medium block mt-1.5 truncate flex items-center gap-1">
                    <span className="truncate">{studentCertificates.length > 0 ? 'View Cert →' : (overallSyllabusProgress === 100 ? 'Claim Cert →' : 'Complete course')}</span>
                  </span>
                </div>
              </div>

              {/* Dynamic Assigned Courses by Admin - Professional LMS Course Cards (Image-2 Fix) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-7 space-y-5 sm:space-y-6">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-[#131313]">
                    Assigned Engineering Programs
                  </h3>
                </div>

                {enrolledCoursesData.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center shadow-xs">
                    <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3.5">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      No Enrolled Programs Yet
                    </h3>
                    <div className="mt-5 flex justify-center gap-3">
                      <Link
                        href="/#programs"
                        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#EE2C3C] hover:bg-[#DC2626] transition-all shadow-sm"
                      >
                        <span>Explore Certified Programs</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                ) : (
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
              )}
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
                      <div className="relative flex-shrink-0 group">
                        <img
                          src={getStudentAvatar(studentUser.photo, studentUser.name, studentUser.email, studentUser.id)}
                          alt={studentUser.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-sm aspect-square"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const customPhoto = typeof window !== 'undefined'
                              ? (localStorage.getItem(`rnd_cadd_student_photo_${(studentUser.email || '').toLowerCase().trim()}`) ||
                                 localStorage.getItem('rnd_cadd_student_photo_custom'))
                              : null;
                            if (customPhoto && target.src !== customPhoto) {
                              target.src = customPhoto;
                            } else if (target.src !== DEFAULT_STUDENT_AVATARS[0]) {
                              target.src = DEFAULT_STUDENT_AVATARS[0];
                            }
                          }}
                        />
                        <label
                          htmlFor="student-profile-photo-upload"
                          className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#131313] hover:bg-[#EE2C3C] text-white shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center"
                          title="Change Profile Photo"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                        <input
                          id="student-profile-photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleDirectPhotoUpload}
                        />
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
                            placeholder="e.g. +91 98765 43210"
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
                            placeholder="e.g. Osmania University / JNTU / GITAM"
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
                            placeholder="e.g. B.Tech Mechanical / Diploma Civil / B.Arch"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-3 pt-2 border-t border-slate-100">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                            Student Profile Picture
                          </label>

                          {/* Direct Upload & Avatar Presets */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <label
                              htmlFor="edit-student-file-upload"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all active:scale-95 shadow-sm"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span>Upload Photo from Device</span>
                            </label>
                            <input
                              id="edit-student-file-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleDirectPhotoUpload}
                            />

                            <span className="text-xs text-slate-400 font-medium">or pick a default avatar:</span>

                            <div className="flex items-center gap-2 flex-wrap">
                              {DEFAULT_STUDENT_AVATARS.map((avatarUrl, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setEditPhoto(avatarUrl)}
                                  className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                    editPhoto === avatarUrl ? 'border-[#EE2C3C] ring-2 ring-red-400/30 scale-105' : 'border-slate-200 hover:border-slate-400'
                                  }`}
                                  title={`Avatar ${idx + 1}`}
                                >
                                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-1">
                            <input
                              type="url"
                              value={editPhoto}
                              onChange={(e) => setEditPhoto(e.target.value)}
                              placeholder="Or paste custom image URL: https://example.com/photo.jpg"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-[#131313] focus:border-[#EE2C3C] focus:outline-none shadow-2xs"
                            />
                          </div>
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
                            {studentUser.phone ? (
                              studentUser.phone
                            ) : (
                              <span className="text-slate-400 font-normal italic">Not provided</span>
                            )}
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
                            {studentUser.college ? (
                              studentUser.college
                            ) : (
                              <span className="text-slate-400 font-normal italic">Not specified</span>
                            )}
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
                            {studentUser.nativePlace ? (
                              studentUser.nativePlace
                            ) : (
                              <span className="text-slate-400 font-normal italic">Not specified</span>
                            )}
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
                            {studentUser.qualification ? (
                              studentUser.qualification
                            ) : (
                              <span className="text-slate-400 font-normal italic">Not specified</span>
                            )}
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
                            {studentUser.campusLocation || 'R&D CADD Center, Metro Pillar 1042, Ameerpet, Hyderabad'}
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
                          studentUser.courseFee > 0 && studentUser.balanceFee === 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : studentUser.courseFee > 0
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}
                      >
                        {studentUser.courseFee > 0
                          ? studentUser.balanceFee === 0
                            ? 'STATUS: FULLY PAID'
                            : 'STATUS: PARTIAL PAYMENT (BALANCE DUE)'
                          : 'STATUS: ENROLLED'}
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

                    {studentUser.paymentReceipts && studentUser.paymentReceipts.length > 0 ? (
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
                    ) : (
                      <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                          ₹
                        </div>
                        <p className="text-xs font-bold text-slate-700">No payment receipts issued yet</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                          Official digital receipts will appear here once registered and verified by the accounts department.
                        </p>
                      </div>
                    )}
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
                        {studentUser.labWorkstation || 'Allotted during practical lab sessions'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {studentUser.labWorkstation ? 'Equipped with NVIDIA Quadro CAD Rig' : 'Available on campus workstation desk'}
                      </span>
                    </div>

                    <div className="pb-3 border-b border-slate-100">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block text-[11px]">
                        Assigned Lead Instructor
                      </span>
                      <span className="font-bold text-sm text-[#131313] block mt-0.5">
                        {studentUser.leadInstructor || 'Course Lead / Faculty Mentor'}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {studentUser.leadInstructor ? 'Senior BIM Architect & Technical Director' : 'Assigned based on enrolled engineering stream'}
                      </span>
                    </div>

                    <div className="pb-3 border-b border-slate-100">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block text-[11px]">
                        Campus Support Helpline
                      </span>
                      <span className="font-mono font-bold text-sm text-[#131313] block mt-0.5">
                        +91 99080 87345
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

          {/* TAB: JOBS & PLACEMENTS (Real-Time Synced) */}
          {activeTab === 'Jobs' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                      Core Engineering Job Openings &amp; Verified Placement Drives
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      {studentJobs.filter((j) => j.status === 'Active').length} Active Vacancies
                    </span>
                    <button
                      onClick={() => fetchStudentJobs()}
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
                        (job.stream && streamColors[job.stream]) || 'bg-slate-50 text-slate-800 border-slate-200';

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
                                href={cert.fileUrl || '#'}
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

          {/* TAB 3: LIVE (Dynamic sync with Admin Broadcast) */}
          {activeTab === 'Live' && (
            <div className="space-y-6">
              {isLoadingLive ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-[#EE2C3C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600">Connecting to live workstation session...</p>
                </div>
              ) : liveClass && liveClass.status === 'Live Now' && liveClass.isLive ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
                  {/* Active Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Live Streaming Now
                        </span>
                        <span className="text-xs font-semibold text-slate-500 font-mono">
                          {liveClass.platform}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                        {liveClass.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Trainer: <span className="text-slate-900 font-bold">{liveClass.trainer}</span> &bull; {liveClass.course}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-mono font-bold text-slate-600 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 inline-block">
                        {liveClass.timing}
                      </span>
                    </div>
                  </div>

                  {/* Agenda / Instructions */}
                  {liveClass.description && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="font-bold text-slate-900 block mb-1">Session Agenda &amp; Guidelines:</span>
                      {liveClass.description}
                    </div>
                  )}

                  {/* Live Stream Action Box */}
                  <div className="p-8 sm:p-10 rounded-2xl bg-slate-50/70 border border-slate-200 text-center space-y-4">
                    <span className="text-xs font-bold text-slate-500 block uppercase tracking-wide">
                      CAD Workstation Stream Ready
                    </span>
                    <a
                      href={liveClass.streamUrl || 'https://meet.google.com/new'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-[#EE2C3C] hover:bg-[#D71E2E] text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>Connect to Live Workstation Screen</span>
                      <span>&rarr;</span>
                    </a>
                  </div>

                  {/* Quick Refresh */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => fetchLiveClass(false)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      ↻ Check for stream updates
                    </button>
                  </div>
                </div>
              ) : liveClass && liveClass.status === 'Scheduled' && !liveClass.isLive ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                      Upcoming Class Scheduled
                    </span>
                    <h3 className="text-xl font-bold text-[#131313] mt-2">
                      {liveClass.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Trainer: <span className="text-slate-900 font-bold">{liveClass.trainer}</span> &bull; {liveClass.course}
                    </p>
                    <span className="inline-block mt-2 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                      {liveClass.timing}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Faculty mentors will start the live stream at the scheduled time. Return to this screen to join the workstation session.
                  </p>
                  <button
                    onClick={() => fetchLiveClass(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    ↻ Check if Live Stream has Started
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-[#131313]">
                    No Live Class in Session
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Faculty mentors broadcast live CAD workstation classes according to the batch schedule. Check back at your scheduled lab timing or contact administration for private workstation access.
                  </p>
                  <button
                    onClick={() => fetchLiveClass(false)}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    ↻ Check for Live Stream
                  </button>
                </div>
              )}
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

          {/* TAB 7: REFER & EARN (Dynamic Admin Synced Referral & Course Offers) */}
          {activeTab === 'Refer & Earn' && (() => {
            const activeStudentOffers = studentOffers.filter(
              (o) => (o.status === 'Active' || !o.status) && !o.hidden
            );
            const studentRefCode = studentUser.id ? `REF-${studentUser.id.replace(/[^A-Z0-9]/gi, '').toUpperCase()}` : 'RAMG8492';
            const referralProgram = activeStudentOffers.find((o) => o.type === 'referral');
            const referralLink = `https://rnd-cadd.vercel.app/enroll?ref=${studentRefCode}`;
            const courseDiscounts = activeStudentOffers.filter((o) => o.type === 'course_discount');

            return (
              <div className="space-y-6">
                {/* Main Student Referral Card (shown only if not hidden by Admin) */}
                {referralProgram ? (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block mb-2">
                          Official Student Referral Program
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                          {referralProgram.title || 'Refer Engineering Peers & Earn Benefits'}
                        </h3>
                      </div>

                      {referralProgram.referrerReward && (
                        <div className="bg-slate-50 rounded-xl p-3.5 sm:text-right border border-slate-200 shrink-0">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Your Benefit</span>
                          <span className="text-sm font-extrabold text-[#131313] font-mono">
                            {referralProgram.referrerReward}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Referral Link Box with Working 1-Click Copy */}
                    <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                      <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                        Your Unique Referral Link:
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
                        <span className="font-mono text-xs sm:text-sm font-bold text-[#131313] break-all select-all">
                          {referralLink}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                              navigator.clipboard.writeText(referralLink);
                              setCopiedReferral(true);
                              setTimeout(() => setCopiedReferral(false), 3000);
                            }
                          }}
                          className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto ${
                            copiedReferral
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#EE2C3C] hover:bg-[#D71E2E] text-white'
                          }`}
                        >
                          {copiedReferral ? 'Copied to Clipboard! ✓' : 'Copy Link'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Your referral code is embedded as <span className="font-mono font-bold text-slate-800">{studentRefCode}</span>. When friends enroll through this link, benefits are credited to your student ledger.
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Active Promotional Discounts & Course Offers (only active, unhidden offers) */}
                {courseDiscounts.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-[#131313]">
                        Active Course Offers &amp; Discounts You Can Share
                      </h4>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        {courseDiscounts.length} Active {courseDiscounts.length === 1 ? 'Discount' : 'Discounts'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courseDiscounts.map((offer) => {
                        const isCopied = copiedOfferCode === offer.code;
                        return (
                          <div
                            key={offer.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                                  {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `Rs ${offer.discountValue} Flat Discount`}
                                </span>
                                {offer.expiryDate && (
                                  <span className="text-[11px] font-mono text-slate-500">
                                    Till {offer.expiryDate}
                                  </span>
                                )}
                              </div>
                              <h5 className="text-base font-bold text-[#131313] leading-snug">
                                {offer.title}
                              </h5>
                              <p className="text-xs text-slate-600 font-medium mt-1">
                                Course: <span className="font-bold text-slate-800">{offer.targetCourse}</span>
                              </p>
                              {offer.description && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                  {offer.description}
                                </p>
                              )}
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Coupon:</span>
                                <span className="font-mono text-xs font-black text-[#EE2C3C] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                                  {offer.code}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                                    navigator.clipboard.writeText(offer.shareUrl);
                                    setCopiedOfferCode(offer.code);
                                    setTimeout(() => setCopiedOfferCode(null), 2500);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap ${
                                  isCopied
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {isCopied ? 'Link Copied! ✓' : 'Copy Offer Link'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* If all offers & referral are hidden by Admin */}
                {!referralProgram && courseDiscounts.length === 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center space-y-2">
                    <p className="text-base font-bold text-slate-700">No active offers or referral campaigns right now.</p>
                    <p className="text-xs text-slate-400">Please check back later or contact your training coordinator.</p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 8: RATE */}
          {activeTab === 'Rate' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#131313] tracking-tight">
                  Rate Your Training Experience
                </h3>
              </div>

              {reviewSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">✓</span>
                    <span>{reviewSuccessMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewSuccessMsg(null)}
                    className="text-emerald-700 hover:text-emerald-950 text-xs font-bold uppercase tracking-wider ml-3 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-5 bg-slate-50/60 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
                {/* Course Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Course to Rate &amp; Review <span className="text-[#EE2C3C]">*</span>
                  </label>
                  <select
                    value={rateCourseName || (studentUser.assignedCourses?.[0] || studentUser.stream || 'Civil CADD & Master BIM')}
                    onChange={(e) => setRateCourseName(e.target.value)}
                    className="w-full sm:w-96 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#131313] bg-white focus:outline-none focus:border-[#EE2C3C] shadow-2xs transition-all"
                  >
                    {studentUser.assignedCourses && studentUser.assignedCourses.length > 0 ? (
                      studentUser.assignedCourses.map((cName) => (
                        <option key={cName} value={cName}>
                          {cName}
                        </option>
                      ))
                    ) : (
                      <option value={studentUser.stream || 'Civil CADD & Master BIM'}>
                        {studentUser.stream || 'Civil CADD & Master BIM'}
                      </option>
                    )}
                  </select>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Course Rating Score
                    </label>
                    <span className="text-xs font-extrabold text-amber-600 font-mono bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/80">
                      ★ {rateHoverScore || rateScore}.0 / 5.0 Rating
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (rateHoverScore || rateScore) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRateScore(star)}
                            onMouseEnter={() => setRateHoverScore(star)}
                            onMouseLeave={() => setRateHoverScore(0)}
                            className="p-1 hover:scale-110 active:scale-95 transition-transform focus:outline-none cursor-pointer"
                            title={`Rate ${star} Star${star > 1 ? 's' : ''}`}
                          >
                            <svg
                              className={`w-8 h-8 transition-colors ${
                                isFilled ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                              }`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-sm font-bold text-slate-700 ml-2">
                      {(rateHoverScore || rateScore) === 5 && 'Outstanding Experience'}
                      {(rateHoverScore || rateScore) === 4 && 'Very Good Quality'}
                      {(rateHoverScore || rateScore) === 3 && 'Good & Informative'}
                      {(rateHoverScore || rateScore) === 2 && 'Average / Needs Improvement'}
                      {(rateHoverScore || rateScore) === 1 && 'Poor Experience'}
                    </span>
                  </div>
                </div>

                {/* Review Textarea */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Detailed Review &amp; Lab Workstation Experience <span className="text-[#EE2C3C]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={rateReviewText}
                    onChange={(e) => setRateReviewText(e.target.value)}
                    placeholder="Write your review about the syllabus, hands-on CAD exercises, speed of workstations, and support..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] bg-white transition-all shadow-2xs"
                    required
                  />
                </div>

                {/* Trainer / Faculty Feedback */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Trainer &amp; Faculty Feedback (Optional)
                  </label>
                  <input
                    type="text"
                    value={rateTrainerFeedback}
                    onChange={(e) => setRateTrainerFeedback(e.target.value)}
                    placeholder="e.g. Er. Swamy Naidu explained BIM coordinates and multi-storey structural layout clearly"
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#EE2C3C] bg-white transition-all shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-3 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmittingReview ? (
                    <span>Submitting Review to Admin...</span>
                  ) : (
                    <>
                      <span>Submit Review to Admin</span>
                      <span>&rarr;</span>
                    </>
                  )}
                </button>
              </form>

              {/* Submitted Reviews History for this Student */}
              <div className="pt-6 border-t border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#131313]">Your Submitted Ratings &amp; Reviews</h4>
                    <p className="text-xs text-slate-500">Live feedback synced with R&amp;D CADD Administration</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {mySubmittedReviews.length} Recorded
                  </span>
                </div>

                {isLoadingReviews ? (
                  <div className="p-6 text-center text-xs text-slate-400">Loading your reviews...</div>
                ) : mySubmittedReviews.length === 0 ? (
                  <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                    You haven't submitted any course reviews yet. Select your course above and submit your rating!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {mySubmittedReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#131313] text-white font-mono">
                              {rev.courseName}
                            </span>
                            <div className="flex items-center space-x-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="text-xs font-bold text-slate-700 ml-1">{rev.rating}.0</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                              {rev.status}
                            </span>
                            <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">{rev.review}</p>
                        {rev.trainerFeedback && (
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <strong className="text-slate-700">Trainer Feedback:</strong> {rev.trainerFeedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* FULL-SCREEN LMS STUDIO & VIDEO LEARNING WORKSPACE (Image 2 & 5) */}
      {playerCourse && (
        <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col w-screen h-screen overflow-hidden animate-in fade-in duration-200 select-none">
          {/* Studio Top Navigation Bar (Clean Minimalist LMS Header) */}
          <div className="px-5 sm:px-7 py-3.5 bg-white text-slate-800 flex items-center justify-between border-b border-slate-200 shadow-xs flex-shrink-0 z-20">
            <div className="min-w-0">
              {(() => {
                const currentClassLabel = activePlayerClass?.classNumber
                  ? activePlayerClass.classNumber.replace(/Class\s*0?(\d+)/i, 'Class - $1')
                  : 'Class - 1';
                return (
                  <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 truncate tracking-tight">
                    {currentClassLabel} ( {playerCourse.title} )
                  </h2>
                );
              })()}
            </div>

            {/* Top Right: Prominent Larger Red Close Button (Image 2) */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleCloseStudio}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white flex items-center justify-center transition-all cursor-pointer font-bold shadow-sm hover:shadow-md active:scale-95"
                title="Close Studio (Esc)"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
              {/* MAIN PLAYER COLUMN (Left / Center) - EXPANDED ON MOBILE TO UTILIZE DOWN SPACE */}
              <div className={`w-full ${studentViewerMode === 'notes' ? 'flex-1 min-h-0 overflow-y-auto' : 'flex-shrink-0'} lg:flex-1 lg:min-h-0 lg:overflow-y-auto bg-slate-100/80 p-1.5 sm:p-5 lg:p-6 space-y-2 sm:space-y-4`}>
                {activePlayerClass ? (
                  <div className="w-full max-w-6xl 2xl:max-w-7xl mx-auto space-y-2 sm:space-y-4">
                    {/* MODE 1: PERMANENT CLASS VIDEO STREAM (Image 2 - Google Drive Recording Stream) */}
                    {studentViewerMode === 'video' && (() => {
                      const isCurrentClassWatched = Boolean(
                        activePlayerClass && (
                          watchedClassIds.includes(activePlayerClass.id) ||
                          (activePlayerClass.classNumber && watchedClassIds.includes(activePlayerClass.classNumber)) ||
                          (playerCourse && activePlayerClass.classNumber && watchedClassIds.includes(`${playerCourse.title}_${activePlayerClass.classNumber}`))
                        )
                      );

                      return (
                        <div className="w-full flex flex-col items-center">
                          {/* RESPONSIVE LMS PLAYER CONTAINER (Expanded on mobile to utilize down space) */}
                          <div
                            ref={playerContainerRef}
                            onMouseMove={handleUserActivity}
                            onTouchStart={handleUserActivity}
                            className="relative w-full h-[38vh] min-h-[260px] max-h-[50vh] sm:h-auto sm:aspect-video sm:max-h-[78vh] bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center select-none group"
                          >
                            {/* Video Stream: Clean HTML5 Native Stream for Drive/Files, or YouTube Embed */}
                            {isYouTubeVideo ? (
                              <iframe
                                src={formatYouTubeEmbedUrl(activePlayerClass.videoUrl)}
                                className="w-full h-full border-0 pointer-events-auto"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title={activePlayerClass.title}
                                onLoad={(e) => {
                                  try {
                                    e.currentTarget.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*');
                                  } catch {}
                                }}
                              />
                            ) : !useIframeFallback ? (
                              <video
                                key={activePlayerClass?.id || 'class-video'}
                                ref={videoRef}
                                src={formatGoogleDriveDirectStreamUrl(activePlayerClass.videoUrl)}
                                className="w-full h-full object-contain cursor-pointer bg-black"
                                playsInline
                                preload="auto"
                                onTimeUpdate={(e) => {
                                  setVideoCurrentTime(e.currentTarget.currentTime);
                                }}
                                onLoadedMetadata={(e) => {
                                  const dur = e.currentTarget.duration;
                                  if (dur && !isNaN(dur) && dur > 0 && isFinite(dur)) {
                                    setVideoDuration(Math.round(dur));
                                  }
                                }}
                                onDurationChange={(e) => {
                                  const dur = e.currentTarget.duration;
                                  if (dur && !isNaN(dur) && dur > 0 && isFinite(dur)) {
                                    setVideoDuration(Math.round(dur));
                                  }
                                }}
                                onPlay={() => setVideoIsPlaying(true)}
                                onPause={() => setVideoIsPlaying(false)}
                                onEnded={() => {
                                  setVideoIsPlaying(false);
                                  handleToggleClassWatched(activePlayerClass.id, playerCourse.title, activePlayerClass.classNumber);
                                }}
                                onClick={handlePlayPause}
                                onError={(e) => {
                                  console.warn('Direct stream fallback to iframe:', e);
                                  setUseIframeFallback(true);
                                }}
                              />
                            ) : (
                              <div className="relative w-full h-full overflow-hidden">
                                <iframe
                                  src={formatGoogleDriveUrl(activePlayerClass.videoUrl)}
                                  className="w-full h-[calc(100%+52px)] -mt-[52px] border-0 pointer-events-auto"
                                  allow="autoplay; encrypted-media; fullscreen"
                                  allowFullScreen
                                  title={activePlayerClass.title}
                                />
                                {/* Top-Right Shield preventing popout redirect */}
                                <div
                                  className="absolute top-0 right-0 w-28 h-16 z-30 pointer-events-auto select-none"
                                  aria-hidden="true"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                />
                              </div>
                            )}

                            {/* TOAST MESSAGE NOTIFICATION */}
                            {videoToast && (
                              <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-2xl pointer-events-none z-50 animate-in fade-in duration-200">
                                {videoToast}
                              </div>
                            )}

                            {/* SPEED SELECTION MENU */}
                            {showSpeedMenu && (
                              <div
                                className="absolute bottom-16 sm:bottom-20 right-2 sm:right-6 w-48 sm:w-56 bg-[#1f1f1f]/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 z-50 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="px-3.5 py-2 flex items-center justify-between border-b border-white/10">
                                  <span className="text-xs font-bold text-white/90">Playback Speed</span>
                                  <button
                                    type="button"
                                    onClick={() => setShowSpeedMenu(false)}
                                    className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="max-h-52 overflow-y-auto py-1">
                                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => {
                                    const isSelected = videoPlaybackSpeed === s;
                                    return (
                                      <button
                                        key={s}
                                        type="button"
                                        onClick={() => handleSpeedChange(s)}
                                        className={`w-full px-3.5 py-1.5 text-left text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                                          isSelected ? 'bg-white/15 text-white font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                      >
                                        <span>{s === 1 ? 'Normal (1x)' : `${s}x`}</span>
                                        {isSelected && <span>✓</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* ROUNDED FEATURES FLOATING CONTROLS:
                                - On mobile (< sm:): ALWAYS VISIBLE so the student has clear rounded controls!
                                - On desktop (sm:): ONLY for non-YouTube streams on hover/pause. For YouTube on desktop, sm:hidden prevents duplicate controls!
                            */}
                            <div
                              className={`absolute bottom-0 inset-x-0 z-40 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-8 pb-3 px-3 sm:px-4 transition-all duration-300 ${
                                isYouTubeVideo
                                  ? 'flex sm:hidden opacity-100 pointer-events-auto'
                                  : showControlsOverlay || !videoIsPlaying || showSpeedMenu
                                  ? 'opacity-100 pointer-events-auto'
                                  : 'opacity-0 sm:pointer-events-none'
                              }`}
                            >
                              {/* Scrubber Timeline Bar with high-precision drag & click */}
                              {(() => {
                                const totalDurationSecs = videoDuration > 0 ? videoDuration : parseDurationSeconds(activePlayerClass?.duration);
                                const progressPct =
                                  totalDurationSecs > 0
                                    ? Math.min(100, Math.max(0, (videoCurrentTime / totalDurationSecs) * 100))
                                    : 0;

                                return (
                                  <div
                                    className="relative w-full h-5 flex items-center cursor-pointer group/scrub select-none px-0.5"
                                    onClick={handleScrubberClick}
                                    onTouchMove={(e) => {
                                      const touch = e.touches[0];
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const clickX = touch.clientX - rect.left;
                                      const pct = Math.max(0, Math.min(1, clickX / rect.width));
                                      handleSeek(Math.round(pct * totalDurationSecs));
                                    }}
                                  >
                                    {/* Background track */}
                                    <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden transition-all group-hover/scrub:h-1.5">
                                      {/* Played progress fill */}
                                      <div
                                        className="h-full bg-[#EE2C3C] transition-all rounded-full"
                                        style={{ width: `${progressPct}%` }}
                                      />
                                    </div>
                                    {/* Scrubber Thumb Indicator */}
                                    <div
                                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg border-2 border-[#EE2C3C] pointer-events-none transition-transform"
                                      style={{ left: `${progressPct}%` }}
                                    />
                                  </div>
                                );
                              })()}

                              {/* CONTROLS ROW (Neat, Balanced, Mobile-Engineered Capsule Bar) */}
                              <div className="w-full flex items-center justify-between gap-1.5 sm:gap-3 mt-1">
                                {/* LEFT GROUP: High-Contrast White Pill Play/Pause Button + Dark Frosted Glass Capsule with [ ⟲10 | ⟳10 | Timer ] */}
                                <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                                  {/* Prominent White Pill Play/Pause Button */}
                                  <button
                                    type="button"
                                    onClick={handlePlayPause}
                                    className="h-8.5 sm:h-9 px-4 sm:px-5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer shrink-0"
                                    title={videoIsPlaying ? 'Pause (k)' : 'Play (k)'}
                                  >
                                    {videoIsPlaying ? (
                                      <svg className="w-4 h-4 fill-slate-950" viewBox="0 0 24 24">
                                        <rect x="6" y="4" width="4" height="16" rx="1.5" />
                                        <rect x="14" y="4" width="4" height="16" rx="1.5" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4 fill-slate-950 translate-x-0.5" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    )}
                                  </button>

                                  {/* Dark Capsule: [ ⟲10 | ⟳10 | Live Timer ] */}
                                  <div className="bg-[#18181b]/95 hover:bg-[#18181b] backdrop-blur-xl rounded-full border border-white/15 px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2.5 text-white shadow-xl shrink-0">
                                    {/* Rewind 10s Button */}
                                    <button
                                      type="button"
                                      onClick={handleSkipBackward}
                                      className="w-7 h-7 rounded-full hover:bg-white/15 active:scale-85 text-white/90 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0 relative"
                                      title="Rewind 10s"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 4.5A8.5 8.5 0 1 0 21 13" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 1.5v6l-4-3 4-3z" />
                                      </svg>
                                      <span className="absolute text-[6.5px] font-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-0.5">10</span>
                                    </button>

                                    {/* Forward 10s Button */}
                                    <button
                                      type="button"
                                      onClick={handleSkipForward}
                                      className="w-7 h-7 rounded-full hover:bg-white/15 active:scale-85 text-white/90 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0 relative"
                                      title="Forward 10s"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 4.5A8.5 8.5 0 1 1 3 13" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 1.5v6l4-3-4-3z" />
                                      </svg>
                                      <span className="absolute text-[6.5px] font-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-0.5">10</span>
                                    </button>

                                    {/* Subtle Divider */}
                                    <div className="w-[1px] h-3.5 bg-white/20 mx-0.5" />

                                    {/* Live Dynamic Time Display */}
                                    {(() => {
                                      const totalDurationSecs = videoDuration > 0 ? videoDuration : parseDurationSeconds(activePlayerClass?.duration);
                                      return (
                                        <div className="text-[10px] sm:text-xs font-mono font-semibold text-white/95 select-none tracking-tight whitespace-nowrap">
                                          <span className="text-white font-bold">{formatVideoTime(videoCurrentTime)}</span>
                                          <span className="text-white/40 mx-0.5">/</span>
                                          <span className="text-white/70">{formatVideoTime(totalDurationSecs)}</span>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </div>

                                {/* RIGHT GROUP: Dark Capsule with [ 🔊 | 1x | ⛶ ] */}
                                <div className="bg-[#18181b]/95 hover:bg-[#18181b] backdrop-blur-xl rounded-full border border-white/15 px-2 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 text-white shadow-xl shrink-0">
                                  {/* Mute / Unmute Button */}
                                  <button
                                    type="button"
                                    onClick={handleToggleMute}
                                    className="w-7 h-7 rounded-full hover:bg-white/15 active:scale-85 text-white/90 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                                    title={videoIsMuted ? 'Unmute' : 'Mute'}
                                  >
                                    {videoIsMuted ? (
                                      <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                      </svg>
                                    ) : (
                                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                      </svg>
                                    )}
                                  </button>

                                  {/* Speed Pill (Tap to cycle speeds on mobile with instant feedback!) */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const speeds = [1, 1.25, 1.5, 2, 0.75];
                                      const nextIdx = (speeds.indexOf(videoPlaybackSpeed) + 1) % speeds.length;
                                      handleSpeedChange(speeds[nextIdx]);
                                    }}
                                    className="px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 text-[10px] sm:text-xs font-mono font-bold text-white transition-all cursor-pointer"
                                    title="Tap to cycle playback speed"
                                  >
                                    {videoPlaybackSpeed === 1 ? '1x' : `${videoPlaybackSpeed}x`}
                                  </button>

                                  {/* Fullscreen Button */}
                                  <button
                                    type="button"
                                    onClick={handleToggleFullscreen}
                                    className="w-7 h-7 rounded-full hover:bg-white/15 active:scale-85 text-white/90 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                                    title="Full screen"
                                  >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* MOBILE STUDENT ACTION STRIP (Utilizes down space with quick-tap controls - Matching User Screenshot e8d67f65.jpg) */}
                          <div className="w-full flex sm:hidden items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs mt-2.5">
                            <button
                              type="button"
                              onClick={handleToggleFullscreen}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs cursor-pointer"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                              </svg>
                              <span>Full Screen</span>
                            </button>

                            {activePlayerClass.pdfUrl && (
                              <button
                                type="button"
                                onClick={() => setStudentViewerMode('notes')}
                                className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#EE2C3C] text-xs font-bold flex items-center gap-1.5 border border-rose-200 active:scale-95 transition-all cursor-pointer"
                                title="Open Class Notes & PDF"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Notes PDF</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleToggleClassWatched(activePlayerClass.id, playerCourse.title, activePlayerClass.classNumber)}
                              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 border cursor-pointer ${
                                isCurrentClassWatched
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                              }`}
                            >
                              <span>{isCurrentClassWatched ? '✓ Done' : 'Mark Done'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

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

              {/* PLAYLIST SIDEBAR (MNC Corporate LMS Layout - Seamless on Mobile) */}
              <div className={`w-full lg:w-96 xl:w-[400px] ${studentViewerMode === 'notes' ? 'hidden lg:flex' : 'flex-1'} lg:flex-initial flex flex-col min-h-0 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 shadow-xs`}>
                {/* Clean MNC Playlist Header */}
                <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EE2C3C]"></span>
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Course Curriculum
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {playerCourse.classes?.length || 0} Lessons
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>
                      {
                        playerCourse.classes?.filter((c) =>
                          watchedClassIds.includes(c.id) ||
                          watchedClassIds.includes(c.classNumber) ||
                          watchedClassIds.includes(`${playerCourse.title}_${c.classNumber}`)
                        ).length || 0
                      }/{playerCourse.classes?.length || 0} Done
                    </span>
                  </div>
                </div>

                {/* Real-Time LMS Playlist Items */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-0 sm:p-2.5 sm:space-y-1.5">
                  {(!playerCourse.classes || playerCourse.classes.length === 0) ? (
                    <div className="p-6 text-center text-xs text-slate-500 font-medium">
                      No lessons available in this course playlist.
                    </div>
                  ) : (
                    playerCourse.classes.map((cls, cIdx) => {
                      const isCurrent = activePlayerClass?.id === cls.id;
                      const isWatched =
                        watchedClassIds.includes(cls.id) ||
                        watchedClassIds.includes(cls.classNumber) ||
                        watchedClassIds.includes(`${playerCourse.title}_${cls.classNumber}`);
                      const classLabel = cls.classNumber
                        ? cls.classNumber.replace(/Class\s*0?(\d+)/i, 'Class - $1')
                        : `Class - ${cIdx + 1}`;
                      const classDurSeconds =
                        classDurations[cls.id] ||
                        (isCurrent && videoDuration > 0 ? videoDuration : 0);
                      const displayDuration =
                        classDurSeconds > 0
                          ? formatVideoTime(classDurSeconds)
                          : (cls.duration && cls.duration !== '45 mins' ? cls.duration : (videoDuration > 0 ? formatVideoTime(videoDuration) : ''));

                      return (
                        <div key={cls.id || cIdx}>
                          {/* MOBILE MNC-STYLE ROW (block lg:hidden) - High-Density Premium Curriculum Pattern */}
                          <div
                            onClick={() => {
                              setActivePlayerClass(cls);
                              setVideoCurrentTime(0);
                              setVideoIsPlaying(false);
                              setStudentViewerMode('video');
                            }}
                            className={`block lg:hidden w-full p-3.5 transition-all select-none border-b border-slate-100 cursor-pointer ${
                              isCurrent
                                ? 'bg-gradient-to-r from-rose-50/80 via-red-50/30 to-white border-l-4 border-l-[#EE2C3C]'
                                : 'bg-white hover:bg-slate-50/90 active:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* Left: MNC Animated Soundwave / Checkmark / 2-Digit Number */}
                              {isCurrent ? (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EE2C3C] to-[#C91827] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                                  <div className="flex items-end gap-[3px] h-3.5">
                                    <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" />
                                    <span className="w-0.5 h-3.5 bg-white rounded-full animate-bounce" />
                                    <span className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" />
                                  </div>
                                </div>
                              ) : isWatched ? (
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/90 flex items-center justify-center flex-shrink-0 shadow-2xs">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/80 flex items-center justify-center text-xs font-extrabold font-mono flex-shrink-0">
                                  {String(cIdx + 1).padStart(2, '0')}
                                </div>
                              )}

                              {/* Middle: Title, Topic & Metadata */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-bold tracking-tight truncate ${isCurrent ? 'text-[#EE2C3C]' : 'text-slate-900'}`}>
                                    {classLabel}
                                  </span>
                                  {isCurrent && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-rose-100 text-[#EE2C3C]">
                                      <span className="w-1 h-1 rounded-full bg-[#EE2C3C] animate-ping" />
                                      Playing
                                    </span>
                                  )}
                                </div>

                                {/* Subtitle / Topic if distinct */}
                                {cls.title && cls.title.toLowerCase() !== classLabel.toLowerCase() && (
                                  <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                                    {cls.title}
                                  </p>
                                )}

                                {/* Meta Badges */}
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                                  {displayDuration && (
                                    <span className="flex items-center gap-1 font-mono text-slate-600">
                                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                        <polyline points="12 6 12 12 16 14" strokeWidth="2" />
                                      </svg>
                                      {displayDuration}
                                    </span>
                                  )}
                                  <span>•</span>
                                  <span className={isWatched ? 'text-emerald-600 font-semibold' : (isCurrent ? 'text-[#EE2C3C] font-semibold' : 'text-slate-400')}>
                                    {isWatched ? 'Completed' : (isCurrent ? 'In Progress' : 'Up Next')}
                                  </span>
                                  {cls.pdfUrl && (
                                    <>
                                      <span>•</span>
                                      <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                                        PDF Notes
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Right: Actions */}
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {cls.pdfUrl && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePlayerClass(cls);
                                      setStudentViewerMode('notes');
                                    }}
                                    className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-[#EE2C3C] border border-slate-200 hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer"
                                    title="Open Class Notes & PDF"
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleClassWatched(cls.id, playerCourse.title, cls.classNumber);
                                  }}
                                  className={`h-8 px-2.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                                    isWatched
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                                  }`}
                                  title={isWatched ? 'Completed (Click to unmark)' : 'Click to mark as watched'}
                                >
                                  {isWatched ? (
                                    <>
                                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span>Done</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-3 h-3 rounded-full border-2 border-slate-300 inline-block" />
                                      <span>Mark</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* DESKTOP LMS CARD ITEM (hidden lg:flex) */}
                          <div
                            onClick={() => {
                              setActivePlayerClass(cls);
                              setVideoCurrentTime(0);
                              setVideoIsPlaying(false);
                              setStudentViewerMode('video');
                            }}
                            className={`hidden lg:flex w-full rounded-xl transition-all p-3.5 items-start gap-3 cursor-pointer select-none border ${
                              isCurrent
                                ? 'bg-white border-slate-300 border-l-[5px] border-l-[#EE2C3C] shadow-sm'
                                : 'bg-white hover:bg-slate-50/90 border-slate-200/90'
                            }`}
                          >
                            {/* Round 1-Click Watched Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleClassWatched(cls.id, playerCourse.title, cls.classNumber);
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all cursor-pointer flex-shrink-0 mt-0.5 ${
                                isWatched
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : isCurrent
                                  ? 'bg-slate-900 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:border-slate-300'
                              }`}
                              title={isWatched ? 'Mark as Unwatched' : 'Mark as Completed'}
                            >
                              {isWatched ? '✓' : cIdx + 1}
                            </button>

                            {/* Class Meta */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-slate-900 tracking-tight">
                                  {classLabel}
                                </span>
                                {displayDuration && (
                                  <span className="text-xs font-semibold text-slate-500 font-mono">
                                    {displayDuration}
                                  </span>
                                )}
                              </div>

                              {/* Clean, Modern LMS Badges & Buttons */}
                              <div className="flex items-center flex-wrap gap-2 mt-2.5">
                                {isCurrent && (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-red-50 text-[#EE2C3C] border border-red-200">
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EE2C3C] opacity-75" />
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#EE2C3C]" />
                                    </span>
                                    <span>Now Playing</span>
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleClassWatched(cls.id, playerCourse.title, cls.classNumber);
                                  }}
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer border ${
                                    isWatched
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-emerald-400'
                                  }`}
                                  title={isWatched ? 'Completed (Click to unmark)' : 'Click to mark as watched'}
                                >
                                  <span className={isWatched ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                                    {isWatched ? '✓ Completed' : '○ Mark Done'}
                                  </span>
                                </button>

                                {cls.pdfUrl && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePlayerClass(cls);
                                      setStudentViewerMode('notes');
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white hover:bg-slate-50 text-slate-700 hover:text-[#EE2C3C] border border-slate-200 hover:border-[#EE2C3C]/40 transition-all cursor-pointer shadow-2xs group/pdf"
                                    title="Open Class Notes & PDF"
                                  >
                                    <svg className="w-3.5 h-3.5 text-[#EE2C3C] group-hover/pdf:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <span>PDF Notes</span>
                                  </button>
                                )}
                              </div>
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
                  src={selectedCertificateForView.fileUrl || ''}
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
                  href={selectedCertificateForView.fileUrl || '#'}
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
                    Helpline: +91 99080 87345 | Web: rndcadd.com
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
                  <span className="font-bold text-[#131313]">{studentUser.phone || '—'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">College / University</span>
                  <span className="font-semibold text-[#131313]">{studentUser.college || '—'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Native Place</span>
                  <span className="font-semibold text-[#131313]">{studentUser.nativePlace || '—'}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 pt-1 border-t border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Enrolled Course</span>
                  <span className="font-bold text-[#131313]">{studentUser.stream}</span>
                </div>
              </div>

              {/* Financial Calculation Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[320px]">
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
