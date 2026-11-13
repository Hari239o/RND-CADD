export interface JobApplicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  stream: string;
  studentId?: string;
  qualification: string;
  college?: string;
  portfolioUrl?: string;
  coverNote?: string;
  appliedAt: string;
  status: 'Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected';
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  discipline: 'civil' | 'mechanical' | 'electrical' | 'piping' | 'interior' | 'ppm' | 'all';
  jobType: 'Full-Time' | 'Full-time' | 'Internship' | 'Apprenticeship' | 'Contract' | 'Fresher Drive';
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  location: string;
  salary: string;
  experience: string;
  vacancies: number;
  tools: string[];
  skills?: string[];
  stream?: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline?: string;
  status: 'Active' | 'Closed';
  isFeatured?: boolean;
  applicantsCount: number;
  applicants: JobApplicant[];
}

export interface JobNotification {
  id: string;
  jobId: string;
  title: string;
  company: string;
  discipline: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Initial verified industry placement opportunities from partner EPCs & software leaders
export const INITIAL_JOBS: JobPost[] = [
  {
    id: 'JOB-2026-001',
    title: 'Junior BIM Modeler (Civil & Architecture)',
    company: 'Larsen & Toubro (L&T Construction)',
    companyLogo: '/logos/lt.png',
    discipline: 'civil',
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Hyderabad / Chennai',
    salary: '₹5.0 - ₹7.5 LPA',
    experience: '0-2 Years (Freshers Welcome)',
    vacancies: 6,
    tools: ['Revit Architecture', 'Navisworks', 'AutoCAD', 'BIM 360'],
    description: 'Responsible for creating high-fidelity 3D architectural and structural BIM models, conducting clash detection, and producing detailed 2D construction documentation for metro rail and infrastructure projects.',
    requirements: [
      'Diploma or B.Tech in Civil Engineering / Architecture',
      'Proficiency in Autodesk Revit and Navisworks coordination',
      'Understanding of LOD 300/400 standards',
      'RND CADD certification preferred',
    ],
    postedDate: '2026-11-06',
    deadline: '2026-12-15',
    status: 'Active',
    isFeatured: true,
    applicantsCount: 14,
    applicants: [
      {
        id: 'APP-101',
        jobId: 'JOB-2026-001',
        name: 'K. Shiva Kumar',
        email: 'shiva.k@gmail.com',
        phone: '+91 98480 23456',
        stream: 'Civil & BIM',
        studentId: 'STU-HYD-8492',
        qualification: 'B.Tech Civil (2025)',
        portfolioUrl: 'https://drive.google.com/portfolio-shiva',
        coverNote: 'Completed Advanced Revit BIM Masterclass at RND CADD Ameerpet campus.',
        appliedAt: '2026-11-06T10:30:00Z',
        status: 'Shortlisted',
      },
    ],
  },
  {
    id: 'JOB-2026-002',
    title: 'Automotive CAD Design Engineer',
    company: 'Tata Technologies',
    companyLogo: '/logos/tata.png',
    discipline: 'mechanical',
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Pune / Hyderabad',
    salary: '₹5.5 - ₹8.0 LPA',
    experience: '0-2 Years',
    vacancies: 8,
    tools: ['CATIA V5', 'SOLIDWORKS', 'GD&T', 'ANSYS FEA'],
    description: 'Develop parametric 3D CAD assemblies and BIW Class-A sheet metal components for next-generation electric vehicle (EV) platforms with international OEM clients.',
    requirements: [
      'B.Tech / B.E in Mechanical / Automobile Engineering',
      'Hands-on expertise in CATIA V5 part design and surface modeling',
      'Sound knowledge of GD&T (ASME Y14.5M) and manufacturing tolerances',
    ],
    postedDate: '2026-11-05',
    deadline: '2026-12-20',
    status: 'Active',
    isFeatured: true,
    applicantsCount: 22,
    applicants: [],
  },
  {
    id: 'JOB-2026-003',
    title: 'Process Piping Design Engineer (SP3D)',
    company: 'Worley Engineering',
    companyLogo: '/logos/worley.png',
    discipline: 'piping',
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Hyderabad / Mumbai',
    salary: '₹6.0 - ₹9.0 LPA',
    experience: '1-3 Years',
    vacancies: 4,
    tools: ['SP3D', 'CAESAR II', 'P&ID AutoCAD', 'Navisworks'],
    description: 'Create 3D piping layouts, pipe routing, equipment modeling, and isometric extraction for oil & gas refinery and green hydrogen process facilities.',
    requirements: [
      'Degree / Diploma in Mechanical or Chemical Engineering',
      'Experience in Intergraph Smart 3D (SP3D) piping module',
      'Familiarity with ASME B31.3 / B31.1 piping codes',
    ],
    postedDate: '2026-11-04',
    deadline: '2026-12-10',
    status: 'Active',
    isFeatured: true,
    applicantsCount: 9,
    applicants: [],
  },
  {
    id: 'JOB-2026-004',
    title: 'Substation & Control Cabinet CADD Engineer',
    company: 'Siemens Energy',
    companyLogo: '/logos/siemens.png',
    discipline: 'electrical',
    jobType: 'Full-Time',
    workMode: 'Hybrid',
    location: 'Bengaluru / Hyderabad',
    salary: '₹5.2 - ₹7.8 LPA',
    experience: '0-2 Years',
    vacancies: 5,
    tools: ['AutoCAD Electrical', 'EPLAN Pro Panel', 'Revit MEP', 'ETAP'],
    description: 'Prepare single line diagrams (SLD), 3D control panel layouts, schematic wiring diagrams, and cable sizing schedules for high-voltage transmission substations.',
    requirements: [
      'B.Tech / Diploma in Electrical & Electronics Engineering (EEE)',
      'Practical training in AutoCAD Electrical schematics and EPLAN Pro Panel',
      'Knowledge of IEC & IEEE electrical standards',
    ],
    postedDate: '2026-11-04',
    deadline: '2026-12-22',
    status: 'Active',
    isFeatured: false,
    applicantsCount: 11,
    applicants: [],
  },
  {
    id: 'JOB-2026-005',
    title: 'Capital EPC Project Planner (PPM)',
    company: 'Jacobs Engineering',
    companyLogo: '/logos/jacobs.png',
    discipline: 'ppm',
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Hyderabad / Bengaluru',
    salary: '₹6.5 - ₹9.5 LPA',
    experience: '1-3 Years',
    vacancies: 3,
    tools: ['Primavera P6', 'Microsoft Project', 'Earned Value Analysis'],
    description: 'Establish baseline work breakdown structures (WBS), resource-loaded schedules, critical path methodology (CPM), and project risk registers for EPC infrastructure.',
    requirements: [
      'Engineering degree with certification in Oracle Primavera P6',
      'Strong grasp of Earned Value Management (EVM) metrics (CPI, SPI)',
      'Excellent analytical and client presentation capabilities',
    ],
    postedDate: '2026-11-03',
    deadline: '2026-12-18',
    status: 'Active',
    isFeatured: false,
    applicantsCount: 7,
    applicants: [],
  },
  {
    id: 'JOB-2026-006',
    title: '3D Interior Architecture & Space Planner',
    company: 'Godrej Interio / Hafele Studio',
    companyLogo: '/logos/interior.png',
    discipline: 'interior',
    jobType: 'Full-Time',
    workMode: 'On-site',
    location: 'Hyderabad (Banjara Hills)',
    salary: '₹4.5 - ₹6.5 LPA',
    experience: '0-2 Years',
    vacancies: 4,
    tools: ['3ds Max', 'V-Ray', 'SketchUp', 'AutoCAD Interior'],
    description: 'Develop photo-realistic 3D walkthroughs, modular kitchen and wardrobe production drawings, and interior material specification schedules for luxury residential projects.',
    requirements: [
      'Degree / Diploma in Interior Design or Architecture',
      'Proficiency in 3ds Max photo-realistic lighting and V-Ray rendering',
      'Strong spatial planning and presentation portfolio',
    ],
    postedDate: '2026-11-02',
    deadline: '2026-12-25',
    status: 'Active',
    isFeatured: false,
    applicantsCount: 16,
    applicants: [],
  },
];

export const INITIAL_NOTIFICATIONS: JobNotification[] = [
  {
    id: 'NOTIF-001',
    jobId: 'JOB-2026-001',
    title: 'New Civil / BIM Placement Drive: L&T Construction',
    company: 'Larsen & Toubro',
    discipline: 'civil',
    message: 'L&T is actively hiring Junior BIM Modelers (0-2 Yrs) for Hyderabad & Chennai projects. CTC: ₹5.0 - ₹7.5 LPA. Apply before Dec 15.',
    timestamp: '2026-11-06T09:00:00Z',
    isRead: false,
  },
  {
    id: 'NOTIF-002',
    jobId: 'JOB-2026-002',
    title: 'Automotive CAD Hiring: Tata Technologies EV Division',
    company: 'Tata Technologies',
    discipline: 'mechanical',
    message: 'Tata Technologies announced 8 openings for Automotive CAD Design Engineers (CATIA V5 / SolidWorks). Eligible trainees can apply today.',
    timestamp: '2026-11-05T14:30:00Z',
    isRead: false,
  },
  {
    id: 'NOTIF-003',
    jobId: 'JOB-2026-004',
    title: 'Electrical Substation CADD Openings: Siemens Energy',
    company: 'Siemens Energy',
    discipline: 'electrical',
    message: 'Siemens Energy campus recruitment drive is live for Electrical & Automation students. 5 vacancies in AutoCAD Electrical & EPLAN.',
    timestamp: '2026-11-04T11:15:00Z',
    isRead: true,
  },
];
