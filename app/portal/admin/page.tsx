'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { JobPost, JobApplicant } from '@/lib/jobs-data';
import { INITIAL_JOBS } from '@/lib/jobs-data';

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

interface CourseItem {
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
  tagline?: string;
  overview?: string;
  prerequisites?: string;
  certification?: string;
  careerRoles?: string[];
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


const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'CRS-CIV-01',
    code: 'BIM-CIV-90',
    title: 'Civil CADD & Master BIM',
    folder: 'civil',
    domain: 'Civil & Architectural Engineering',
    stream: 'civil',
    software: 'Autodesk Revit Architecture, AutoCAD 2D/3D, Enscape 3D, 3ds Max',
    duration: '90 Days (180 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 35000,
    price: 35000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    overview: 'Master end-to-end architectural BIM workflows from parametric floor layout generation to multi-disciplinary clash detection.',
    syllabus: [
      'AutoCAD 2D Drafting, Structural Detailing & Layer Architecture',
      'Parametric Revit Families, Walls, Slabs, Grids & Elevation Sections',
      'BIM 360 Construction Cloud Coordination & Clash Detection',
      'Enscape Real-Time Daylight & Photorealistic Walkthrough Rendering'
    ]
  },
  {
    id: 'CRS-MEC-02',
    code: 'CAD-MEC-90',
    title: 'Mechanical CAD/CAM/CAE Diploma',
    folder: 'mechanical',
    domain: 'Mechanical & Automotive Design',
    stream: 'mechanical',
    software: 'Dassault CATIA V5, SolidWorks 2026, ANSYS Workbench',
    duration: '90 Days (180 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 32000,
    price: 32000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    overview: 'Comprehensive mechanical product engineering program encompassing parametric part sketching, Class-A surfacing, and ANSYS FEA.',
    syllabus: [
      'SolidWorks 3D Parametric Part Modeling, Sheet Metal & Welded Frames',
      'CATIA V5 Generative Shape Design (GSD) & Surface Modeling',
      'Mechanism Kinematics, Collision Analysis & Dynamic Motion Study',
      'ANSYS FEA Static Structural, Thermal & Modal Vibration Simulation'
    ]
  },
  {
    id: 'CRS-ELE-03',
    code: 'CAD-ELE-60',
    title: 'Electrical CADD & Switchgear Design',
    folder: 'electrical',
    domain: 'Electrical & Automation Engineering',
    stream: 'eee',
    software: 'AutoCAD Electrical, MATLAB Simulink, ETAP Fundamentals',
    duration: '60 Days (120 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 28000,
    price: 28000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    overview: 'Industrial electrical system design covering single-line diagrams, substation layouts, control panel schematics, and load flow transient calculations.',
    syllabus: [
      'Single Line Diagrams (SLD) & Substation Schematic Routing',
      'Control Panel Layout, Wire Sizing & Bill of Materials (BOM)',
      'PLC / SCADA Circuit Logic Schematics & Terminal Block Assignment',
      'MATLAB Simulink Power System Modeling & Harmonic Analysis'
    ]
  },
  {
    id: 'CRS-INT-04',
    code: 'ARC-INT-60',
    title: 'Interior Architecture & 3D Visualization',
    folder: 'interior',
    domain: 'Interior Architecture & Space Planning',
    stream: 'civil',
    software: 'Trimble SketchUp Pro, Autodesk 3ds Max, Chaos V-Ray 6, AutoCAD',
    duration: '60 Days (120 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 30000,
    price: 30000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    overview: 'Interior architectural space planning, modular kitchen ergonomics, custom joinery millwork, and photorealistic raytraced 4K rendering.',
    syllabus: [
      'Residential & Commercial Floor Layout Space Planning in 2D AutoCAD',
      'SketchUp Modular Kitchen & Wardrobe Joinery Details',
      '3ds Max Photorealistic Interior Lighting, Materials & Camera Framing',
      'V-Ray 6 Raytracing Render Engine & Cinematic 4K Post-Production'
    ]
  },
  {
    id: 'CRS-PPM-05',
    code: 'PPM-PRO-45',
    title: 'Project Planning & Management (PPM)',
    folder: 'ppm',
    domain: 'Construction & EPC Project Management (PPM)',
    stream: 'civil',
    software: 'Oracle Primavera P6 Professional, Microsoft Project (MSP)',
    duration: '45 Days (90 Hours)',
    mode: 'Executive Weekend / Regular Lab',
    fee: 25000,
    price: 25000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    overview: 'Master enterprise construction project scheduling, Critical Path Method (CPM), resource allocation matrices, S-Curves, and cost-variance earned value management.',
    syllabus: [
      'Work Breakdown Structure (WBS) & Organizational Breakdown (OBS)',
      'Critical Path Method (CPM), Float Analysis & Precedence Diagramming',
      'Resource Leveling, Earned Value Analysis (EVA) & Cost S-Curves',
      'Baseline Comparison, Variance Tracking & Executive Status Reporting'
    ]
  },
  {
    id: 'CRS-PIP-06',
    code: 'PIP-IND-60',
    title: 'Piping & Plant Engineering CADD',
    folder: 'piping',
    domain: 'Process Plant & Piping Engineering',
    stream: 'mechanical',
    software: 'AutoCAD Plant 3D, Intergraph SmartPlant 3D (SP3D), Caesar II',
    duration: '60 Days (120 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 34000,
    price: 34000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    overview: 'Process piping drafting, equipment layout arrangements, 3D pipe routing, automated isometric generation, and Caesar II thermal expansion stress analysis.',
    syllabus: [
      'Piping & Instrumentation Diagrams (P&ID) Standard Symbology',
      'Equipment Layout, 3D Piping Routing & Pipe Rack Design',
      'Isometric Drawing Generation & Material Take-Off (MTO)',
      'Caesar II Pipe Flexibility & Thermal Expansion Stress Analysis'
    ]
  }
];

export default function AdminPortalPage() {
  // Navigation State - Tab 01 "Student", Tab 02 "Courses" directly below
  const [activeTab, setActiveTab] = useState<string>('Student');

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

  // Job Placement Management State (Real-time DB synced with jobs.unlox.com style)
  const [adminJobs, setAdminJobs] = useState<JobPost[]>(INITIAL_JOBS);
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
  const [quizSubject, setQuizSubject] = useState<'Revit' | 'AutoCAD' | 'SolidWorks'>('Revit');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
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
        setCourses(data.courses);
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

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rnd_cadd_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) {
            setAdminUser((prev) => ({
              ...prev,
              name: parsed.name,
              email: parsed.email || prev.email,
            }));
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rnd_cadd_user');
      localStorage.removeItem('rnd_cadd_role');
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

  // Initialize course for editing with all full-blueprint specs
  const handleStartEditCourse = (course: CourseItem) => {
    const toolsList = Array.isArray(course.tools) && course.tools.length > 0
      ? course.tools
      : course.software
      ? course.software.split(',').map((s) => s.trim()).filter(Boolean)
      : ['CAD Tools'];

    const modulesList: CourseModuleItem[] = Array.isArray(course.modules) && course.modules.length > 0
      ? course.modules
      : (course.syllabus || []).map((s, idx) => ({
          number: String(idx + 1).padStart(2, '0'),
          title: s,
          hours: 20,
          topics: [s, 'Practical lab drafting & validation'],
        }));

    const capstoneObj: CourseCapstoneItem = course.capstoneProject && course.capstoneProject.title
      ? course.capstoneProject
      : {
          title: `${course.title} Live Industry Project`,
          description: 'Real-world industrial drafting, modeling, and validation project with detailed engineering dossier.',
          deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
        };

    const careerList = Array.isArray(course.careerRoles) && course.careerRoles.length > 0
      ? course.careerRoles
      : ['CAD Design Engineer', 'Product Specialist', 'Project Engineer', 'Drafting Specialist'];

    setEditingCourse({
      ...course,
      tools: toolsList,
      software: course.software || toolsList.join(', '),
      category: course.category || (course.folder === 'civil' ? 'PARAMETRIC BIM' : course.folder === 'mechanical' ? 'MECHANICAL CAE' : 'ENGINEERING CAD'),
      level: course.level || 'Professional',
      duration: course.duration || '90 Days (180 Hours)',
      totalHours: Number(course.totalHours) || 180,
      mode: course.mode || 'Classroom & Dedicated CAD Workstation Lab',
      prerequisites: course.prerequisites || 'Diploma / B.Tech / Working Professional',
      certification: course.certification || 'Autodesk & Dassault Certificate',
      tagline: course.tagline || course.overview || '',
      capstoneProject: capstoneObj,
      careerRoles: careerList,
      modules: modulesList,
      syllabus: course.syllabus && course.syllabus.length > 0 ? course.syllabus : modulesList.map((m) => m.title),
    });
  };

  // Add New Course to MongoDB & live sync to website
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
      tagline: newCourse.tagline || newCourse.overview || 'Comprehensive engineering CAD curriculum with live lab exercises.',
      overview: newCourse.overview || 'Comprehensive engineering CAD curriculum with live lab exercises.',
      prerequisites: newCourse.prerequisites || 'Diploma / B.Tech / Working Professional',
      certification: newCourse.certification || 'Autodesk & Dassault Certificate',
      careerRoles,
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
        setCourses((prev) => [data.course, ...prev]);
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
        ...editingCourse,
        domain: matchedFolder.name,
        stream:
          editingCourse.folder === 'mechanical' || editingCourse.folder === 'piping'
            ? 'mechanical'
            : editingCourse.folder === 'electrical'
            ? 'eee'
            : 'civil',
        tools,
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
        setCourses((prev) => prev.map((c) => (c.id === updatedPayload.id ? data.course : c)));
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
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
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
        setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? data.course : c)));
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

    const formattedUrl = newClassForm.videoUrl.trim()
      ? (newClassForm.videoType === 'drive'
          ? formatGoogleDriveUrl(newClassForm.videoUrl)
          : newClassForm.videoUrl.trim())
      : '';

    const classItem: CourseClass = {
      id: newClassForm.id || `cls-${Date.now()}`,
      classNumber: newClassForm.classNumber.trim() || `Class 0${currentClasses.length + 1}`,
      title: newClassForm.title.trim(),
      duration: newClassForm.duration.trim() || '45 mins',
      videoType: newClassForm.videoType,
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
  const handleFileUpload = async (file: File, target: 'courseImage' | 'classVideo') => {
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
          showToast('Course image uploaded successfully.');
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
          reader.onload = (e) => resolve((e.target?.result as string) || '/sample-certificate.pdf');
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

  // Navigation Items - Clean 8 Core Management Modules
  const adminNavItems = [
    { id: 'Student', label: 'Student', tag: '01' },
    { id: 'Courses', label: 'Courses', tag: '02' },
    { id: 'Certificate', label: 'Certificate', tag: '03' },
    { id: 'Software Quiz', label: 'Software Quiz', tag: '04' },
    { id: 'Ebook', label: 'Ebook', tag: '05' },
    { id: 'Jobs', label: 'Jobs', tag: '06' },
    { id: 'Support', label: 'Support', tag: '07' },
    { id: 'Assignments', label: 'Assignments', tag: '08' },
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
      className="min-h-screen bg-[#F9FAFB] text-[#000000] flex flex-col md:flex-row text-base upgrad-admin-theme"
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

      {/* LEFT SIDEBAR - FIXED & STICKY */}
      <aside className="w-full md:w-80 md:sticky md:top-0 md:h-screen bg-[#FFFFFF] border-r-2 border-[#E2E8F0] flex flex-col justify-between shadow-md z-30 flex-shrink-0">
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
                      className={`text-sm font-mono font-bold px-2.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-[#FFFFFF]/20 text-[#FFFFFF]'
                          : 'bg-[#E2E8F0] text-[#131313]'
                      }`}
                    >
                      {item.tag}
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

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Bar - Clean & Professional */}
        {activeTab !== 'Courses' && (
          <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-medium text-[#666666] mb-1">
                <span>Admin Console</span>
                <span>/</span>
                <span className="text-[#131313] font-semibold">{activeTab}</span>
              </div>
              <h1 className="text-2xl font-bold text-[#131313] tracking-tight">
                {activeTab} Management
              </h1>
            </div>

            <div className="flex items-center space-x-3">
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
        <div className="p-6 sm:p-8 flex-1 space-y-6">

          {/* TAB 1: STUDENT (Clean Enterprise Data Table, Stats & Pleasant Buttons) */}
          {activeTab === 'Student' && (
            <div className="space-y-6">
              {/* Dynamic Live Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
                                        course.image ||
                                        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
                                      }
                                      alt={course.title}
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
                                    href={item.certificate.fileUrl || '/sample-certificate.pdf'}
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

          {/* TAB 4: SOFTWARE QUIZ */}
          {activeTab === 'Software Quiz' && (
            <div className="bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#131313]">Software Quiz</h3>
                </div>
                <div className="flex space-x-2">
                  {(['Revit', 'AutoCAD', 'SolidWorks'] as const).map((sub) => (
                    <button
                      key={sub}
                      onClick={() => {
                        setQuizSubject(sub);
                        setQuizAnswers({});
                        setQuizScore(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm sm:text-base font-bold ${
                        quizSubject === sub
                          ? 'bg-[#131313] text-[#FFFFFF]'
                          : 'bg-[#F1F5F9] text-[#131313]'
                      }`}
                    >
                      {sub} Quiz
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {[
                  { id: 1, q: 'In Autodesk Revit, which element is host-dependent and cannot exist without a wall?', opts: ['Floor slab', 'Door', 'Level', 'Grid line'], ans: 1 },
                  { id: 2, q: 'What is the primary file extension for an Autodesk Revit project file?', opts: ['.rfa', '.rte', '.rvt', '.dwg'], ans: 2 },
                  { id: 3, q: 'Which tool allows checking geometrical intersections between MEP pipes and structural beams?', opts: ['Purge Unused', 'Clash Detection / Interference Check', 'Audit Tool', 'Visibility Graphics'], ans: 1 },
                ].map((qObj) => (
                  <div key={qObj.id} className="p-5 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC]">
                    <span className="text-sm sm:text-base font-black text-[#131313] block mb-3">
                      Q{qObj.id}: {qObj.q}
                    </span>
                    <div className="space-y-2">
                      {qObj.opts.map((opt, optIdx) => (
                        <label key={optIdx} className="flex items-center space-x-3 cursor-pointer text-sm font-semibold text-[#334155]">
                          <input
                            type="radio"
                            name={`quiz_q_${qObj.id}`}
                            checked={quizAnswers[qObj.id] === optIdx}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [qObj.id]: optIdx })}
                            className="w-4 h-4 text-[#131313]"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    const score = Object.keys(quizAnswers).reduce((acc, qId) => {
                      const idNum = Number(qId);
                      const expected = idNum === 1 ? 1 : idNum === 2 ? 2 : 1;
                      return quizAnswers[idNum] === expected ? acc + 1 : acc;
                    }, 0);
                    setQuizScore(score);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#131313] hover:bg-[#262626] text-[#FFFFFF] text-sm font-bold uppercase tracking-wider"
                >
                  SUBMIT QUIZ
                </button>
                {quizScore !== null && (
                  <span className="text-sm font-black text-[#16A34A] bg-[#DCFCE7] px-4 py-2 rounded-xl border border-[#86EFAC]">
                    Score: {quizScore} / 3 Correct ({Math.round((quizScore / 3) * 100)}%)
                  </span>
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
                      onClick={fetchEbooks}
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
                    onClick={fetchJobs}
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                              <span className="text-emerald-700 font-bold">RATING: {course.rating || '4.9/5.0'}</span>
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
                                <span className="text-emerald-700 font-bold">RATING: {c.rating || '4.9/5.0'}</span>
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
                <div className="w-10 h-10 rounded-xl bg-[#EE2C3C] text-[#FFFFFF] flex items-center justify-center shadow-md">
                  
                </div>
                <div>
                  <span className="text-sm font-semibold font-black text-[#EE2C3C] uppercase tracking-wider block">
                    CURRICULUM SPECIFICATION BUILDER &bull; REAL-TIME LIVE SYNC
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#131313]">
                    Create New CAD Course Blueprint
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setShowAddCourseModal(false)} />
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleAddNewCourse} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#F8FAFC]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Identification & Stream */}
                <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                    1. Course Identification &amp; Academic Placement
                  </span>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      placeholder="e.g. Mechanical CAD/CAM/CAE Diploma"
                      className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Folder / Discipline *</label>
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
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      >
                        {foldersList.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.code || 'FOLDER'} - {folder.shortName || folder.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Course Code</label>
                      <input
                        type="text"
                        value={newCourse.code}
                        onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                        placeholder="e.g. CAD-MEC-90"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Category Badge</label>
                      <input
                        type="text"
                        value={newCourse.category}
                        onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                        placeholder="e.g. MECHANICAL CAE"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Course Level</label>
                      <select
                        value={newCourse.level}
                        onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Master Program">Master Program</option>
                        <option value="Certification">Certification</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Commercial & Academic Key Facts */}
                <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                    2. Commercial &amp; Academic Key Facts (Stats Matrix)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Tuition Fee (Rs) *</label>
                      <input
                        type="number"
                        required
                        value={newCourse.fee}
                        onChange={(e) => setNewCourse({ ...newCourse, fee: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-black text-[#16A34A] bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Duration Label</label>
                      <input
                        type="text"
                        value={newCourse.duration}
                        onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                        placeholder="e.g. 90 Days (180 Hours)"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Total Lab Hours</label>
                      <input
                        type="number"
                        value={newCourse.totalHours}
                        onChange={(e) => setNewCourse({ ...newCourse, totalHours: Number(e.target.value) || 120 })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold text-[#0F172A] bg-[#FFFFFF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Prerequisite</label>
                      <input
                        type="text"
                        value={newCourse.prerequisites}
                        onChange={(e) => setNewCourse({ ...newCourse, prerequisites: e.target.value })}
                        placeholder="e.g. Diploma / B.Tech / Working Professional"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Certification Authority</label>
                      <input
                        type="text"
                        value={newCourse.certification}
                        onChange={(e) => setNewCourse({ ...newCourse, certification: e.target.value })}
                        placeholder="e.g. Autodesk & Dassault Certificate"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Training Schedule / Mode</label>
                      <input
                        type="text"
                        value={newCourse.mode}
                        onChange={(e) => setNewCourse({ ...newCourse, mode: e.target.value })}
                        placeholder="e.g. Weekday & Weekend Fast-Track"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Course Status</label>
                      <select
                        value={newCourse.status}
                        onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value as any })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold bg-[#FFFFFF]"
                      >
                        <option value="Active">Active (Visible on Website)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Media, Banner Image & Toolchain */}
                <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                    3. Course Media, Banner &amp; Authorized Toolchain
                  </span>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Banner Image URL / Upload</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCourse.image}
                        onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold text-xs bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                      <label className="px-4 py-2.5 bg-[#131313] hover:bg-[#262626] text-[#FFFFFF] text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm">
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
                      <div className="mt-2.5 h-36 w-full rounded-xl overflow-hidden border-2 border-[#CBD5E1] bg-[#000000] relative shadow-inner">
                        <img src={newCourse.image} alt="Course Preview" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-[#FFFFFF] text-xs font-bold px-2.5 py-1 rounded font-mono font-bold">
                          Banner Preview
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Authorized Toolchain (Comma Separated)</label>
                    <input
                      type="text"
                      value={newCourse.software}
                      onChange={(e) => setNewCourse({ ...newCourse, software: e.target.value })}
                      placeholder="e.g. Dassault CATIA V5, SolidWorks 2026, ANSYS Workbench"
                      className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Tagline (Hero Subtitle)</label>
                    <input
                      type="text"
                      value={newCourse.tagline}
                      onChange={(e) => setNewCourse({ ...newCourse, tagline: e.target.value })}
                      placeholder="e.g. Parametric Solid Modeling, Generative Surfacing, and Multi-Physics Simulation"
                      className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Course Overview &amp; Content</label>
                    <textarea
                      rows={2}
                      value={newCourse.overview}
                      onChange={(e) => setNewCourse({ ...newCourse, overview: e.target.value })}
                      className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-medium bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>
                </div>

                {/* 4. Capstone Project & Career Pathways */}
                <div className="space-y-6">
                  {/* Capstone Project Blueprint */}
                  <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                    <span className="text-xs font-black text-[#00873D] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                      5. Capstone Project Blueprint (Mandatory Portfolio Project)
                    </span>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Portfolio Project Title</label>
                      <input
                        type="text"
                        value={newCourse.capstoneTitle}
                        onChange={(e) => setNewCourse({ ...newCourse, capstoneTitle: e.target.value })}
                        placeholder="e.g. Mechanical CAD/CAM/CAE Diploma Live Industry Project"
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-bold text-[#0F172A] bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Project Description</label>
                      <textarea
                        rows={2}
                        value={newCourse.capstoneDescription}
                        onChange={(e) => setNewCourse({ ...newCourse, capstoneDescription: e.target.value })}
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-medium bg-[#FFFFFF]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Verified Deliverables (Comma Separated)</label>
                      <input
                        type="text"
                        value={newCourse.capstoneDeliverablesText}
                        onChange={(e) => setNewCourse({ ...newCourse, capstoneDeliverablesText: e.target.value })}
                        placeholder="e.g. Design Drawings, 3D CAD Model, Project Dossier"
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold text-xs bg-[#FFFFFF]"
                      />
                    </div>
                  </div>

                  {/* Career Pathways */}
                  <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-3">
                    <span className="text-xs font-black text-[#EE2C3C] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                      6. Career Pathways (Job Placement Titles)
                    </span>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Placement Titles (Comma Separated)</label>
                      <input
                        type="text"
                        value={newCourse.careerRolesText}
                        onChange={(e) => setNewCourse({ ...newCourse, careerRolesText: e.target.value })}
                        placeholder="e.g. CAD Design Engineer, Automotive Product Designer, FEA Simulation Analyst"
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold text-xs bg-[#FFFFFF]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Interactive Module Syllabus Builder (Full Width) */}
              <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#CBD5E1] gap-2">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider">
                    4. Module Syllabus Specification ({newCourse.modules?.length || 0} Units)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = newCourse.modules || [];
                      const num = String(cur.length + 1).padStart(2, '0');
                      const updated = [
                        ...cur,
                        {
                          number: num,
                          title: `Module ${num} Advanced Topics`,
                          hours: 20,
                          topics: ['Core engineering concepts', 'Practical lab drafting & validation'],
                        },
                      ];
                      setNewCourse({
                        ...newCourse,
                        modules: updated,
                        syllabusText: updated.map((m) => m.title).join('\n'),
                      });
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#131313] hover:bg-[#262626] text-[#FFFFFF] text-sm font-bold uppercase transition-all shadow-sm"
                  >
                    + ADD SYLLABUS UNIT
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(newCourse.modules || []).map((mod, idx) => (
                    <div key={idx} className="p-4 bg-[#F8FAFC] border-2 border-[#CBD5E1] rounded-xl space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#EE2C3C]">MODULE {mod.number}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={mod.hours}
                            onChange={(e) => {
                              const updated = [...(newCourse.modules || [])];
                              updated[idx] = { ...updated[idx], hours: Number(e.target.value) || 20 };
                              setNewCourse({ ...newCourse, modules: updated });
                            }}
                            className="w-16 p-1 border rounded text-xs text-center font-bold bg-[#FFFFFF]"
                            title="Lab Hours"
                          />
                          <span className="text-xs font-bold font-bold text-[#64748B]">LAB HRS</span>
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
                            className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-0.5 rounded cursor-pointer font-medium ml-2 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div>
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
                          className="w-full p-2 rounded-lg border text-xs font-bold text-[#0F172A] bg-[#FFFFFF]"
                        />
                      </div>

                      <div>
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
                          className="w-full p-2 rounded-lg border text-xs text-[#475569] bg-[#FFFFFF]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Sticky Modal Actions */}
              <div className="pt-4 flex justify-end space-x-4 border-t-2 border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-8 py-3 rounded-xl border-2 border-[#CBD5E1] text-sm sm:text-base font-bold hover:bg-[#FFFFFF] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCourse}
                  className="px-10 py-3 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-[#FFFFFF] text-sm sm:text-base font-black uppercase tracking-wider shadow-md transition-all"
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
                <div className="w-10 h-10 rounded-xl bg-[#131313] text-[#FFFFFF] flex items-center justify-center shadow-md">
                  
                </div>
                <div>
                  <span className="text-sm font-semibold font-black text-[#2563EB] uppercase tracking-wider block">
                    COURSE MANAGEMENT EDITOR &bull; REAL-TIME LIVE SYNC
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#131313]">
                    Edit Course Blueprint: {editingCourse.title}
                  </h3>
                </div>
              </div>
              <RedCrossCloseButton onClick={() => setEditingCourse(null)} />
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleEditCourseSubmit} className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#F8FAFC]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Identification & Stream */}
                <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                    1. Course Identification &amp; Academic Placement
                  </span>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Course Title *</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Folder / Discipline *</label>
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
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      >
                        {foldersList.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.code || 'FOLDER'} - {folder.shortName || folder.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Course Code</label>
                      <input
                        type="text"
                        value={editingCourse.code}
                        onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Category Badge</label>
                      <input
                        type="text"
                        value={editingCourse.category || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                        placeholder="e.g. MECHANICAL CAE"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Course Level</label>
                      <select
                        value={editingCourse.level || 'Professional'}
                        onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      >
                        <option value="Professional">Professional</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Master Program">Master Program</option>
                        <option value="Certification">Certification</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Commercial & Academic Key Facts */}
                <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                    2. Commercial &amp; Academic Key Facts (Stats Matrix)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Standard Fee (Rs) *</label>
                      <input
                        type="number"
                        required
                        value={editingCourse.fee}
                        onChange={(e) => setEditingCourse({ ...editingCourse, fee: Number(e.target.value) })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-black text-[#16A34A] bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Duration Label</label>
                      <input
                        type="text"
                        value={editingCourse.duration}
                        onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Total Lab Hours</label>
                      <input
                        type="number"
                        value={editingCourse.totalHours || 120}
                        onChange={(e) => setEditingCourse({ ...editingCourse, totalHours: Number(e.target.value) || 120 })}
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold text-[#0F172A] bg-[#FFFFFF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Prerequisite</label>
                      <input
                        type="text"
                        value={editingCourse.prerequisites || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, prerequisites: e.target.value })}
                        placeholder="e.g. Diploma / B.Tech / Working Professional"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Certification Authority</label>
                      <input
                        type="text"
                        value={editingCourse.certification || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, certification: e.target.value })}
                        placeholder="e.g. Autodesk & Dassault Certificate"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Training Schedule / Mode</label>
                      <input
                        type="text"
                        value={editingCourse.mode || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, mode: e.target.value })}
                        placeholder="e.g. Weekday & Weekend Fast-Track"
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Course Status</label>
                      <select
                        value={editingCourse.status}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, status: e.target.value as 'Active' | 'Inactive' })
                        }
                        className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-bold bg-[#FFFFFF]"
                      >
                        <option value="Active">Active (Visible on Website)</option>
                        <option value="Inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Media, Banner Image & Toolchain */}
                <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                    3. Course Media, Banner &amp; Authorized Toolchain
                  </span>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Course Image URL / Upload</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingCourse.image || ''}
                        onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                        className="flex-1 p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold text-xs bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                      <label className="px-4 py-2.5 bg-[#131313] hover:bg-[#262626] text-[#FFFFFF] text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center whitespace-nowrap shadow-sm">
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
                      <div className="mt-2.5 h-36 w-full rounded-xl overflow-hidden border-2 border-[#CBD5E1] bg-[#000000] relative shadow-inner">
                        <img src={editingCourse.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-[#FFFFFF] text-xs font-bold px-2.5 py-1 rounded font-mono font-bold">
                          Banner Preview
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Authorized Toolchain (Comma Separated)</label>
                    <input
                      type="text"
                      value={editingCourse.software}
                      onChange={(e) => setEditingCourse({ ...editingCourse, software: e.target.value })}
                      placeholder="e.g. Dassault CATIA V5, SolidWorks 2026, ANSYS Workbench"
                      className="w-full p-3 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Tagline (Hero Subtitle)</label>
                    <input
                      type="text"
                      value={editingCourse.tagline || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, tagline: e.target.value })}
                      placeholder="e.g. Parametric Solid Modeling, Generative Surfacing, and Multi-Physics Simulation"
                      className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#334155] mb-1">Course Overview &amp; Content</label>
                    <textarea
                      rows={2}
                      value={editingCourse.overview || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, overview: e.target.value })}
                      className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-medium bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                    />
                  </div>
                </div>

                {/* 4. Capstone Project & Career Pathways */}
                <div className="space-y-6">
                  {/* Capstone Project Blueprint */}
                  <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                    <span className="text-xs font-black text-[#00873D] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                      5. Capstone Project Blueprint (Mandatory Portfolio Project)
                    </span>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Portfolio Project Title</label>
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
                        placeholder="e.g. Mechanical CAD/CAM/CAE Diploma Live Industry Project"
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-bold text-[#0F172A] bg-[#FFFFFF] focus:outline-none focus:border-[#131313]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Project Description</label>
                      <textarea
                        rows={2}
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
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-medium bg-[#FFFFFF]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Verified Deliverables (Comma Separated)</label>
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
                        placeholder="e.g. Design Drawings, 3D CAD Model, Project Dossier"
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold text-xs bg-[#FFFFFF]"
                      />
                    </div>
                  </div>

                  {/* Career Pathways */}
                  <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-3">
                    <span className="text-xs font-black text-[#EE2C3C] uppercase tracking-wider block border-b pb-2 border-[#CBD5E1]">
                      6. Career Pathways (Job Placement Titles)
                    </span>

                    <div>
                      <label className="block font-bold text-[#334155] mb-1">Placement Titles (Comma Separated)</label>
                      <input
                        type="text"
                        value={editingCourse.careerRoles?.join(', ') || ''}
                        onChange={(e) => {
                          const roles = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                          setEditingCourse({ ...editingCourse, careerRoles: roles });
                        }}
                        placeholder="e.g. CAD Design Engineer, Automotive Product Designer, FEA Simulation Analyst"
                        className="w-full p-2.5 rounded-xl border-2 border-[#CBD5E1] font-semibold text-xs bg-[#FFFFFF]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Interactive Module Syllabus Builder (Full Width) */}
              <div className="p-6 bg-[#FFFFFF] rounded-2xl border-2 border-[#E2E8F0] shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#CBD5E1] gap-2">
                  <span className="text-xs font-black text-[#131313] uppercase tracking-wider">
                    4. Module Syllabus Specification ({editingCourse.modules?.length || 0} Units)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingCourse.modules || [];
                      const num = String(cur.length + 1).padStart(2, '0');
                      const updated = [
                        ...cur,
                        {
                          number: num,
                          title: `Module ${num} Advanced Topics`,
                          hours: 20,
                          topics: ['Core engineering concepts', 'Practical lab drafting & validation'],
                        },
                      ];
                      setEditingCourse({
                        ...editingCourse,
                        modules: updated,
                        syllabus: updated.map((m) => m.title),
                      });
                    }}
                    className="px-4 py-1.5 rounded-lg bg-[#131313] hover:bg-[#262626] text-[#FFFFFF] text-sm font-bold uppercase transition-all shadow-sm"
                  >
                    + ADD SYLLABUS UNIT
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(editingCourse.modules || []).map((mod, idx) => (
                    <div key={idx} className="p-4 bg-[#F8FAFC] border-2 border-[#CBD5E1] rounded-xl space-y-2.5 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#EE2C3C]">MODULE {mod.number}</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={mod.hours}
                            onChange={(e) => {
                              const updated = [...(editingCourse.modules || [])];
                              updated[idx] = { ...updated[idx], hours: Number(e.target.value) || 20 };
                              setEditingCourse({ ...editingCourse, modules: updated });
                            }}
                            className="w-16 p-1 border rounded text-xs text-center font-bold bg-[#FFFFFF]"
                            title="Lab Hours"
                          />
                          <span className="text-xs font-bold font-bold text-[#64748B]">LAB HRS</span>
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
                            className="text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-0.5 rounded cursor-pointer font-medium ml-2 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div>
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
                          className="w-full p-2 rounded-lg border text-xs font-bold text-[#0F172A] bg-[#FFFFFF]"
                        />
                      </div>

                      <div>
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
                          className="w-full p-2 rounded-lg border text-xs text-[#475569] bg-[#FFFFFF]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Sticky Modal Actions */}
              <div className="pt-4 flex justify-end space-x-4 border-t-2 border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-8 py-3 rounded-xl border-2 border-[#CBD5E1] text-sm sm:text-base font-bold hover:bg-[#FFFFFF] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCourse}
                  className="px-10 py-3 rounded-xl bg-[#131313] hover:bg-[#262626] text-[#FFFFFF] text-sm sm:text-base font-black uppercase tracking-wider shadow-md transition-all"
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
                        testingVideoClass.videoType === 'drive' ? (
                          <iframe
                            src={formatGoogleDriveUrl(testingVideoClass.videoUrl)}
                            className="w-full h-full border-0"
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                            title={testingVideoClass.title}
                          />
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
                  src={viewingCertificate.fileUrl || '/sample-certificate.pdf'}
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
                  href={viewingCertificate.fileUrl || '/sample-certificate.pdf'}
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
    </div>
  );
}

