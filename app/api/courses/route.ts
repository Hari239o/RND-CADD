import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

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

interface CourseModule {
  number: string;
  title: string;
  hours: number;
  topics: string[];
}

interface CourseCapstone {
  title: string;
  description: string;
  deliverables: string[];
}

interface StoredCourse {
  id: string;
  code: string;
  title: string;
  folder: 'civil' | 'mechanical' | 'electrical' | 'interior' | 'ppm' | 'piping';
  domain: string;
  stream: string;
  category: string;
  software: string;
  tools: string[];
  duration: string;
  totalHours?: number;
  level?: string;
  rating?: string;
  enrolledStudents?: string;
  mode: string;
  fee: number;
  price: number;
  status: 'Active' | 'Inactive';
  image: string;
  overview: string;
  tagline?: string;
  prerequisites?: string;
  certification?: string;
  careerRoles?: string[];
  capstoneProject?: CourseCapstone;
  modules?: CourseModule[];
  syllabus: string[];
  classes: CourseClass[];
  createdAt?: string;
  updatedAt?: string;
}

const MAIN_FOLDERS = [
  {
    id: 'civil',
    name: 'Civil & Architectural Engineering',
    shortName: 'Civil & BIM',
    code: 'FOLDER 01',
    description: 'Structural drafting, parametric BIM modeling, building analysis, and municipal layouts.',
  },
  {
    id: 'mechanical',
    name: 'Mechanical & Automotive Design',
    shortName: 'Mechanical CAD/CAE',
    code: 'FOLDER 02',
    description: '3D parametric solid modeling, generative surface design, FEA stress analysis, and CNC machining.',
  },
  {
    id: 'electrical',
    name: 'Electrical & Automation Engineering',
    shortName: 'Electrical CADD',
    code: 'FOLDER 03',
    description: 'Industrial control schematics, substation SLDs, wiring harnesses, and PLC automation.',
  },
  {
    id: 'interior',
    name: 'Interior Architecture & Space Planning',
    shortName: 'Interior & 3D Vis',
    code: 'FOLDER 04',
    description: 'Space planning, SketchUp modular joinery, 3ds Max rendering, and V-Ray raytracing.',
  },
  {
    id: 'ppm',
    name: 'Construction & EPC Project Management (PPM)',
    shortName: 'Project Management',
    code: 'FOLDER 05',
    description: 'Primavera P6, Microsoft Project, WBS, Gantt scheduling, and EVM cost control.',
  },
  {
    id: 'piping',
    name: 'Process Plant & Piping Engineering',
    shortName: 'Piping & Plant CAD',
    code: 'FOLDER 06',
    description: 'Piping & instrumentation (P&ID), equipment layouts, 3D pipe racks, and Caesar II flexibility.',
  },
] as const;

const INITIAL_SEEDED_COURSES: StoredCourse[] = [
  {
    id: 'CRS-CIV-01',
    code: 'BIM-CIV-90',
    title: 'Civil CADD & Master BIM',
    folder: 'civil',
    domain: 'Civil & Architectural Engineering',
    stream: 'civil',
    category: 'PARAMETRIC BIM',
    software: 'Autodesk Revit Architecture, AutoCAD 2D/3D, Enscape 3D, 3ds Max',
    tools: ['Autodesk Revit 2026', 'AutoCAD 2026', 'Enscape 3D', '3ds Max'],
    duration: '90 Days (180 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 35000,
    price: 35000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    overview: 'Master end-to-end architectural BIM workflows from parametric floor layout generation, structural walls, and curtain systems to multi-disciplinary clash detection and construction sequencing.',
    tagline: 'Comprehensive Building Information Modeling with 4D Scheduling and Clash Detection',
    syllabus: [
      'AutoCAD 2D Drafting, Structural Detailing & Layer Architecture',
      'Parametric Revit Families, Walls, Slabs, Grids & Elevation Sections',
      'BIM 360 Construction Cloud Coordination & Clash Detection',
      'Enscape Real-Time Daylight & Photorealistic Walkthrough Rendering'
    ],
    classes: [
      {
        id: 'cls-civ-1',
        classNumber: 'Class 01',
        title: 'AutoCAD 2D Drafting Standards & Project Setup',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Industry-standard DWG setup, BIS title block standards, layer architecture, and precision snap tools.'
      },
      {
        id: 'cls-civ-2',
        classNumber: 'Class 02',
        title: 'Parametric Wall Assemblies, Slabs & Grids in Revit',
        duration: '55 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Modeling structural compound walls, core layers, elevation datum levels, and structural grid alignments.'
      },
      {
        id: 'cls-civ-3',
        classNumber: 'Class 03',
        title: 'Custom Family Creation & Curtain Glazing Systems',
        duration: '60 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Creating parametric window/door families, curtain wall mullion layout, and reference planes.'
      },
      {
        id: 'cls-civ-4',
        classNumber: 'Class 04',
        title: 'Navisworks Clash Matrix & Enscape 4K Walkthrough',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Multi-trade hard clash detection, 4D construction schedule simulation, and GPU real-time daylight rendering.'
      }
    ]
  },
  {
    id: 'CRS-MEC-02',
    code: 'CAD-MEC-90',
    title: 'Mechanical CAD/CAM/CAE Diploma',
    folder: 'mechanical',
    domain: 'Mechanical & Automotive Design',
    stream: 'mechanical',
    category: 'MECHANICAL CAE',
    software: 'Dassault CATIA V5, SolidWorks 2026, ANSYS Workbench',
    tools: ['SolidWorks 2026', 'CATIA V5', 'ANSYS Workbench', 'Mastercam'],
    duration: '90 Days (180 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 32000,
    price: 32000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    overview: 'Comprehensive mechanical product engineering program encompassing parametric part sketching, Class-A surfacing, mechanism kinematics, and finite element stress analysis.',
    tagline: 'Parametric Solid Modeling, Generative Surfacing, and Multi-Physics Simulation',
    syllabus: [
      'SolidWorks 3D Parametric Part Modeling, Sheet Metal & Welded Frames',
      'CATIA V5 Generative Shape Design (GSD) & Surface Modeling',
      'Mechanism Kinematics, Collision Analysis & Dynamic Motion Study',
      'ANSYS FEA Static Structural, Thermal & Modal Vibration Simulation'
    ],
    classes: [
      {
        id: 'cls-mec-1',
        classNumber: 'Class 01',
        title: 'SolidWorks 3D Parametric Sketching & Constraints',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Fully constrained 2D sketches, geometric relations, boss-extrude, cut-extrude, and thin features.'
      },
      {
        id: 'cls-mec-2',
        classNumber: 'Class 02',
        title: 'Sheet Metal Unfolding, K-Factor & Welded Structures',
        duration: '60 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Edge flanges, miter flanges, sheet metal gauge tables, flat pattern development, and structural weldments.'
      },
      {
        id: 'cls-mec-3',
        classNumber: 'Class 03',
        title: 'CATIA V5 Generative Shape Design & Wireframe Tools',
        duration: '65 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Splines, boundary curves, sweep surfaces, blend surfaces, multi-section surfaces, and curvature continuity.'
      },
      {
        id: 'cls-mec-4',
        classNumber: 'Class 04',
        title: 'ANSYS Static Structural Stress & Deflection Simulation',
        duration: '55 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Material library assignment, adaptive tetrahedral meshing, boundary conditions, and Von-Mises stress analysis.'
      }
    ]
  },
  {
    id: 'CRS-ELE-03',
    code: 'CAD-ELE-60',
    title: 'Electrical CADD & Switchgear Design',
    folder: 'electrical',
    domain: 'Electrical & Automation Engineering',
    stream: 'eee',
    category: 'ELECTRICAL CAD',
    software: 'AutoCAD Electrical, MATLAB Simulink, ETAP Fundamentals',
    tools: ['AutoCAD Electrical 2026', 'MATLAB Simulink', 'ETAP 24', 'EPLAN Pro'],
    duration: '60 Days (120 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 28000,
    price: 28000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    overview: 'Industrial electrical system design covering single-line diagrams, substation equipment layouts, control panel schematics, and load flow transient calculations.',
    tagline: 'Industrial Power Distribution, Substation Drafting, and Control Circuit Design',
    syllabus: [
      'Single Line Diagrams (SLD) & Substation Schematic Routing',
      'Control Panel Layout, Wire Sizing & Bill of Materials (BOM)',
      'PLC / SCADA Circuit Logic Schematics & Terminal Block Assignment',
      'MATLAB Simulink Power System Modeling & Harmonic Analysis'
    ],
    classes: [
      {
        id: 'cls-ele-1',
        classNumber: 'Class 01',
        title: 'Single Line Diagram (SLD) Drafting & IEC Standards',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Substation busbar architecture, CT/PT transformer symbology, circuit breaker ratings, and earthing layouts.'
      },
      {
        id: 'cls-ele-2',
        classNumber: 'Class 02',
        title: 'Motor Control Center (MCC) & Control Logic Schematics',
        duration: '55 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'DOL starter circuits, star-delta control schematics, interlock relays, and wire numbering automation.'
      },
      {
        id: 'cls-ele-3',
        classNumber: 'Class 03',
        title: 'ETAP Balanced Load Flow & Short Circuit Calculations',
        duration: '60 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Industrial feeder load flow calculations, bus voltage drops, transformer tap adjustments, and fault currents.'
      }
    ]
  },
  {
    id: 'CRS-INT-04',
    code: 'ARC-INT-60',
    title: 'Interior Architecture & 3D Visualization',
    folder: 'interior',
    domain: 'Interior Architecture & Space Planning',
    stream: 'civil',
    category: 'INTERIOR 3D VIS',
    software: 'Trimble SketchUp Pro, Autodesk 3ds Max, Chaos V-Ray 6, AutoCAD',
    tools: ['Trimble SketchUp Pro', 'Autodesk 3ds Max', 'Chaos V-Ray 6', 'AutoCAD'],
    duration: '60 Days (120 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 30000,
    price: 30000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    overview: 'Interior architectural space planning, modular kitchen ergonomics, custom joinery millwork, and photorealistic raytraced 4K rendering.',
    tagline: 'Modern Space Planning, Photorealistic V-Ray Rendering, and Modular Joinery',
    syllabus: [
      'Residential & Commercial Floor Layout Space Planning in 2D AutoCAD',
      'SketchUp Modular Kitchen & Wardrobe Joinery Details',
      '3ds Max Photorealistic Interior Lighting, Materials & Camera Framing',
      'V-Ray 6 Raytracing Render Engine & Cinematic 4K Post-Production'
    ],
    classes: [
      {
        id: 'cls-int-1',
        classNumber: 'Class 01',
        title: 'Ergonomic Space Planning & CAD Interior Layouts',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Anthropometric dimensions, circulation corridors, furniture clearance standards, and false ceiling grids.'
      },
      {
        id: 'cls-int-2',
        classNumber: 'Class 02',
        title: 'SketchUp Modular Cabinetry & Hardware Fitting Details',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Tandem drawer mechanisms, carcass panels, shutter finishes, edge-banding, and hardware specifications.'
      },
      {
        id: 'cls-int-3',
        classNumber: 'Class 03',
        title: '3ds Max Physically-Based Lighting & V-Ray 6 Materials',
        duration: '65 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'IES photometric spotlights, dome HDRI environment lighting, PBR reflection glossiness, and normal bump maps.'
      }
    ]
  },
  {
    id: 'CRS-PPM-05',
    code: 'PPM-PRO-45',
    title: 'Project Planning & Management (PPM)',
    folder: 'ppm',
    domain: 'Construction & EPC Project Management (PPM)',
    stream: 'civil',
    category: 'PROJECT MANAGEMENT',
    software: 'Oracle Primavera P6 Professional, Microsoft Project (MSP)',
    tools: ['Primavera P6 Professional', 'Microsoft Project (MSP)', 'Excel PM Dashboards'],
    duration: '45 Days (90 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 25000,
    price: 25000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    overview: 'Master enterprise construction project scheduling, Critical Path Method (CPM), resource allocation matrices, S-Curves, and cost-variance earned value management.',
    tagline: 'Enterprise Primavera P6 Scheduling, Resource Optimization, and EVM Tracking',
    syllabus: [
      'Work Breakdown Structure (WBS) & Organizational Breakdown (OBS)',
      'Critical Path Method (CPM), Float Analysis & Precedence Diagramming',
      'Resource Leveling, Earned Value Analysis (EVA) & Cost S-Curves',
      'Baseline Comparison, Variance Tracking & Executive Status Reporting'
    ],
    classes: [
      {
        id: 'cls-ppm-1',
        classNumber: 'Class 01',
        title: 'Enterprise Project Structure (EPS) & WBS Hierarchy',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Organizational breakdown, defining multi-level WBS nodes, milestone dates, and work packages.'
      },
      {
        id: 'cls-ppm-2',
        classNumber: 'Class 02',
        title: 'Activity Logic Ties, Critical Path (CPM) & Float Tracking',
        duration: '55 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Finish-to-Start (FS) / SS relationships, total float, free float, and early/late schedule date computations.'
      },
      {
        id: 'cls-ppm-3',
        classNumber: 'Class 03',
        title: 'Resource Allocation, Leveling & Earned Value (EVA)',
        duration: '60 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Labor & non-labor resource curves, over-allocation leveling, Schedule Performance Index (SPI), and Cost Performance Index (CPI).'
      }
    ]
  },
  {
    id: 'CRS-PIP-06',
    code: 'PIP-IND-60',
    title: 'Piping & Plant Engineering CADD',
    folder: 'piping',
    domain: 'Process Plant & Piping Engineering',
    stream: 'mechanical',
    category: 'PROCESS PIPING',
    software: 'AutoCAD Plant 3D, Intergraph SmartPlant 3D (SP3D), Caesar II',
    tools: ['AutoCAD Plant 3D', 'SP3D', 'Caesar II', 'Navisworks'],
    duration: '60 Days (120 Hours)',
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    fee: 34000,
    price: 34000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    overview: 'Process piping drafting, equipment layout arrangements, 3D pipe routing, automated isometric generation, and Caesar II thermal expansion stress analysis.',
    tagline: 'Process Plant Layout, 3D Piping Routing, and Pipe Stress Analysis',
    syllabus: [
      'Piping & Instrumentation Diagrams (P&ID) Standard Symbology',
      'Equipment Layout, 3D Piping Routing & Pipe Rack Design',
      'Isometric Drawing Generation & Material Take-Off (MTO)',
      'Caesar II Pipe Flexibility & Thermal Expansion Stress Analysis'
    ],
    classes: [
      {
        id: 'cls-pip-1',
        classNumber: 'Class 01',
        title: 'P&ID Process Drafting & Instrumentation Standards',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'ISA symbology, valve designations, line numbering specifications, and instrumentation loops.'
      },
      {
        id: 'cls-pip-2',
        classNumber: 'Class 02',
        title: '3D Equipment Modeling & Pipe Rack Routing',
        duration: '55 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Horizontal vessel layout, pump suction/discharge routing, pipe rack tiers, and valve access stations.'
      },
      {
        id: 'cls-pip-3',
        classNumber: 'Class 03',
        title: 'Automated Isometrics, BOM & Caesar II Flexibility',
        duration: '60 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Extracting isometric sheets, cut pipe lengths, fitting counts, and pipe thermal expansion stress verification.'
      }
    ]
  }  ,
  // Additional Civil Courses
  {
    id: 'CRS-CIV-02',
    code: 'REV-BIM-12',
    title: 'Revit Architecture & BIM Specialist',
    folder: 'civil',
    domain: 'Civil & Architectural Engineering',
    stream: 'civil',
    category: 'PARAMETRIC BIM',
    software: 'Autodesk Revit 2026, Navisworks Manage, BIM 360',
    tools: ['Autodesk Revit 2026', 'Navisworks Manage', 'BIM 360', 'Enscape'],
    duration: '12 Weeks (120 Hours)',
    totalHours: 120,
    fee: 32000,
    price: 32000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    overview: 'Comprehensive Building Information Modeling with 4D Scheduling and Clash Detection across architectural and structural trades.',
    tagline: 'Autodesk Authorized Revit BIM Professional Certification',
    syllabus: [
      'Core BIM Dimensions (3D, 4D, 5D) & Revit User Interface',
      'Parametric Family Creation & Advanced Glazing Curtain Systems',
      'Multi-Disciplinary Clash Detection in Navisworks Manage',
      'Automated Schedules, Material Take-off & Construction Documentation'
    ],
    classes: [
      {
        id: 'cls-civ2-1',
        classNumber: 'Class 01',
        title: 'Core BIM Concepts & Family Editor',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'BIM dimensions, UI setup, datum levels, grids, and parametric family creation.'
      }
    ]
  },
  {
    id: 'CRS-CIV-03',
    code: 'CAD-CIV-2D',
    title: 'AutoCAD Civil 2D Drafting & 3D Planning',
    folder: 'civil',
    domain: 'Civil & Architectural Engineering',
    stream: 'civil',
    category: 'PARAMETRIC BIM',
    software: 'AutoCAD 2026, AutoCAD Civil 3D',
    tools: ['AutoCAD 2026', 'AutoCAD Civil 3D', 'Autodesk Design Review'],
    duration: '8 Weeks (80 Hours)',
    totalHours: 80,
    fee: 22000,
    price: 22000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    overview: 'Municipal plan approvals, structural reinforcement drafting, road alignments, and topographical surface contours.',
    tagline: 'Standard Building Regulations, Survey CAD & Municipal Sanction Drawings',
    syllabus: [
      'Precision Coordinate Systems, Drafting Settings & Layer Standardization',
      'Architectural Floor Plans, Cross-Sections & Elevation Drafting',
      'RCC Reinforcement Detailing per IS 456 Standards',
      'Municipal Approval Drawings & Layout Plotting'
    ],
    classes: [
      {
        id: 'cls-civ3-1',
        classNumber: 'Class 01',
        title: 'Municipal Sanction Standards & Plan Detailing',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'FAR computations, setback rules, and municipal submission sheets.'
      }
    ]
  },

  // Additional Mechanical Courses
  {
    id: 'CRS-MEC-01',
    code: 'SLD-MEC-60',
    title: 'SOLIDWORKS Master Professional',
    folder: 'mechanical',
    domain: 'Mechanical & Automotive Design',
    stream: 'mechanical',
    category: 'MECHANICAL CAE',
    software: 'SolidWorks 2026, CSWP, Sheet Metal',
    tools: ['SolidWorks 2026', 'PhotoView 360', 'SOLIDWORKS Simulation'],
    duration: '10 Weeks (100 Hours)',
    totalHours: 100,
    fee: 30000,
    price: 30000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    overview: 'Certified SolidWorks Professional curriculum covering complex parametric assemblies, sheet metal unfolding, structural weldments, and GD&T production drawings.',
    tagline: 'Dassault Certified SolidWorks Professional (CSWP) Training Track',
    syllabus: [
      'Advanced 3D Parametric Part Sketching & Feature Trees',
      'Sheet Metal Forming, Bend Deductions & Flat Patterns',
      'Structural Weldments, Cut Lists & Frame Analysis',
      'Top-Down Assembly Design & Mechanism Kinematics'
    ],
    classes: [
      {
        id: 'cls-mec1-1',
        classNumber: 'Class 01',
        title: 'Parametric Part Feature Trees & Constraints',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Advanced geometric constraints, sweeps, lofts, and multi-body dynamics.'
      }
    ]
  },
  {
    id: 'CRS-MEC-03',
    code: 'CAT-AER-60',
    title: 'CATIA V5 Aerospace & Automotive Surfacing',
    folder: 'mechanical',
    domain: 'Mechanical & Automotive Design',
    stream: 'mechanical',
    category: 'MECHANICAL CAE',
    software: 'Dassault CATIA V5, Generative Shape Design',
    tools: ['CATIA V5-6R2026', 'Generative Shape Design', 'DMU Kinematics'],
    duration: '10 Weeks (100 Hours)',
    totalHours: 100,
    fee: 34000,
    price: 34000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    overview: 'Industrial surface modeling for vehicle exteriors and aerospace aerodynamics using CATIA V5 Generative Shape Design (GSD).',
    tagline: 'Class-A Surface Modeling, Aerodynamic Profiles & DMU Kinematics',
    syllabus: [
      'Wireframe Geometry, Splines & Boundary Curves',
      'Generative Shape Design Surfaces & Curvature Continuity',
      'Automotive Body-in-White (BIW) Sheet Metal Architecture',
      'DMU Kinematic Mechanism Simulation & Clash Checks'
    ],
    classes: [
      {
        id: 'cls-mec3-1',
        classNumber: 'Class 01',
        title: 'Class-A Surfacing Fundamentals in CATIA',
        duration: '55 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Surface curvature continuity (G0, G1, G2), blends, and styling fillets.'
      }
    ]
  },

  // Additional Electrical Courses
  {
    id: 'CRS-ELE-01',
    code: 'ELE-AUT-45',
    title: 'AutoCAD Electrical Industrial Systems',
    folder: 'electrical',
    domain: 'Electrical & Automation Engineering',
    stream: 'eee',
    category: 'ELECTRICAL CADD',
    software: 'AutoCAD Electrical 2026, PLC Schematics',
    tools: ['AutoCAD Electrical 2026', 'JIC/IEC Symbol Libraries'],
    duration: '8 Weeks (80 Hours)',
    totalHours: 80,
    fee: 26000,
    price: 26000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1200&q=80',
    overview: 'Industrial control panel wiring schematics, automatic wire numbering, PLC I/O module parametric generation, and bill of materials export.',
    tagline: 'Autodesk Certified Electrical CAD Specialist Curriculum',
    syllabus: [
      'JIC & IEC Electrical Drafting Standards & Symbology',
      'Ladder Schematics, Relay Logic & Motor Control Circuits',
      'Parametric PLC I/O Module Generation & Point-to-Point Wiring',
      'Panel Footprint Layouts & Automated Terminal Strips'
    ],
    classes: [
      {
        id: 'cls-ele1-1',
        classNumber: 'Class 01',
        title: 'Ladder Schematics & Wire Numbering',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Drawing ladder circuits, assigning component tags, and cross-reference contacts.'
      }
    ]
  },
  {
    id: 'CRS-ELE-02',
    code: 'EPL-IND-60',
    title: 'EPLAN Electric P8 Automation Engineering',
    folder: 'electrical',
    domain: 'Electrical & Automation Engineering',
    stream: 'eee',
    category: 'ELECTRICAL CADD',
    software: 'EPLAN Electric P8, Multi-Line Diagrams, Macros',
    tools: ['EPLAN Electric P8 2026', 'EPLAN Data Portal', 'Pro Panel'],
    duration: '8 Weeks (80 Hours)',
    totalHours: 80,
    fee: 32000,
    price: 32000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    overview: 'European & international automation standard engineering. Master multi-line diagrams, intelligent macros, terminal connection diagrams, and enclosure 3D layout.',
    tagline: 'Industrial Automation & Switchboard Engineering with EPLAN Pro',
    syllabus: [
      'Project Structure per IEC 81346 High-Level Architecture',
      'Multi-Line Schematics with Intelligent Device Macros',
      'PLC Hardware Configuration & Addressing Tables',
      'Automated Reports: Cable Schedules, Parts Lists & Terminal Plans'
    ],
    classes: [
      {
        id: 'cls-ele2-1',
        classNumber: 'Class 01',
        title: 'Project Setup & Macro Creation in EPLAN',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'IEC 81346 designation, device tags, and creating reusable smart macros.'
      }
    ]
  },

  // Additional Interior Courses
  {
    id: 'CRS-INT-01',
    code: 'SKP-MOD-45',
    title: 'SketchUp & Modular Casework Joinery',
    folder: 'interior',
    domain: 'Interior Architecture & Space Planning',
    stream: 'interior',
    category: 'INTERIOR 3D VIS',
    software: 'Trimble SketchUp Pro, LayOut, V-Ray for SketchUp',
    tools: ['Trimble SketchUp Pro', 'LayOut', 'V-Ray'],
    duration: '6 Weeks (60 Hours)',
    totalHours: 60,
    fee: 26000,
    price: 26000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    overview: 'Design production-ready modular kitchens, residential casework, and custom wardrobes with precision joinery drawings and CNC cut-list generation.',
    tagline: 'Modular Kitchens, Wardrobe Carcass, Joinery Millwork & Hardware Detailing',
    syllabus: [
      'Kitchen Work Triangle & Standard Modular Dimensions (300/450/600/900mm)',
      'Parametric Cabinet Components & Hardware Fittings Schedule',
      'LayOut 2D Shop Drawings, Elevations & Exploded Axonometrics',
      'Material Mapping, Edge-banding & CNC Cutlist Optimization'
    ],
    classes: [
      {
        id: 'cls-int1-1',
        classNumber: 'Class 01',
        title: 'Modular Kitchen Ergonomics & Carcass Sizing',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Standard carcass dimensions, tandem drawer clearances, and shutter fitting.'
      }
    ]
  },
  {
    id: 'CRS-INT-02',
    code: '3DS-VRY-45',
    title: '3ds Max & V-Ray Photorealistic Rendering',
    folder: 'interior',
    domain: 'Interior Architecture & Space Planning',
    stream: 'interior',
    category: 'INTERIOR 3D VIS',
    software: 'Autodesk 3ds Max 2026, Chaos V-Ray 6, Photoshop',
    tools: ['Autodesk 3ds Max 2026', 'Chaos V-Ray 6', 'Photoshop'],
    duration: '8 Weeks (80 Hours)',
    totalHours: 80,
    fee: 28000,
    price: 28000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    overview: 'Create high-end photorealistic 4K architectural interior renders. Master HDRI environments, IES luminaire profiles, realistic fabric/wood textures, and frame-buffer color grading.',
    tagline: 'Physically Based Lighting, IES Photometrics, PBR Shading & Post-Production',
    syllabus: [
      'DWG CAD Floorplan Import & Precision Architectural Modeling',
      'Dome Light HDRIs, V-Ray Sun & IES Photometric Spotlights',
      'Physically Based V-Ray Shaders (Marble, Brushed Metals, Fabrics)',
      'Render Elements Breakdown & Photoshop Post-Compositing'
    ],
    classes: [
      {
        id: 'cls-int2-1',
        classNumber: 'Class 01',
        title: 'IES Photometric Spotlights & Daylight Setup',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Placing manufacturer IES luminaire profiles and balancing interior daylight exposure.'
      }
    ]
  },

  // Additional PPM Courses
  {
    id: 'CRS-PPM-01',
    code: 'P6-ENT-60',
    title: 'Oracle Primavera P6 Professional Enterprise',
    folder: 'ppm',
    domain: 'Construction & EPC Project Management (PPM)',
    stream: 'ppm',
    category: 'PROJECT MANAGEMENT',
    software: 'Oracle Primavera P6 Professional 24, EVM, Visualizer',
    tools: ['Oracle Primavera P6 Pro 24', 'Primavera Visualizer', 'Excel PM Models'],
    duration: '8 Weeks (80 Hours)',
    totalHours: 80,
    fee: 28000,
    price: 28000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    overview: 'Master enterprise-level project planning with Primavera P6. Build robust Work Breakdown Structures, define logic ties, optimize critical path float, level labor/machinery, and report earned value performance.',
    tagline: 'Enterprise EPS, Multi-Level WBS, Critical Path Method & Earned Value S-Curves',
    syllabus: [
      'Enterprise Project Structure (EPS) & Work Breakdown Structure (WBS)',
      'Precedence Diagramming (FS, SS, FF, SF) & Critical Path Computation',
      'Resource Loading, Over-Allocation Leveling & S-Curve Graphing',
      'Earned Value Analysis (EVM): CPI, SPI, BAC, EAC & Variance Tracking'
    ],
    classes: [
      {
        id: 'cls-ppm1-1',
        classNumber: 'Class 01',
        title: 'EPS, WBS Architecture & Calendars in P6',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Creating enterprise breakdown structure, defining calendars, and setting up WBS codes.'
      }
    ]
  },
  {
    id: 'CRS-PPM-02',
    code: 'MSP-EPC-45',
    title: 'Microsoft Project (MSP) Professional',
    folder: 'ppm',
    domain: 'Construction & EPC Project Management (PPM)',
    stream: 'ppm',
    category: 'PROJECT MANAGEMENT',
    software: 'Microsoft Project 2026 Pro, Power BI, Excel',
    tools: ['Microsoft Project 2026 Pro', 'Excel PowerPivot', 'Power BI'],
    duration: '6 Weeks (60 Hours)',
    totalHours: 60,
    fee: 22000,
    price: 22000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    overview: 'Learn Microsoft Project from fundamentals to executive dashboards. Structure task hierarchies, assign work/material resources, manage multiple projects with a shared resource pool, and track progress against baseline.',
    tagline: 'Interactive Gantt Charts, Resource Pool Sharing, Task Dependencies & Baselines',
    syllabus: [
      'Work Breakdown Indentation, Milestones & Predecessors',
      'Resource Pool Sharing (Work, Material, Cost) & Leveling',
      'Setting Multiple Baselines & Schedule Variance Analysis',
      'Executive Visual Reports Export to Excel & Power BI'
    ],
    classes: [
      {
        id: 'cls-ppm2-1',
        classNumber: 'Class 01',
        title: 'Task Hierarchies & Predecessor Ties in MSP',
        duration: '45 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Building auto-scheduled tasks, milestones, finish-to-start logic, and lag durations.'
      }
    ]
  },

  // Additional Piping Courses
  {
    id: 'CRS-PIP-01',
    code: 'PLT-3D-45',
    title: 'AutoCAD Plant 3D Modeling & P&ID',
    folder: 'piping',
    domain: 'Process Plant & Piping Engineering',
    stream: 'piping',
    category: 'PROCESS PIPING',
    software: 'AutoCAD Plant 3D 2026, Plant Spec Editor',
    tools: ['AutoCAD Plant 3D 2026', 'Plant 3D Spec Editor', 'Navisworks'],
    duration: '8 Weeks (80 Hours)',
    totalHours: 80,
    fee: 30000,
    price: 30000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    overview: 'Master plant design workflows using AutoCAD Plant 3D. Create intelligent P&IDs with tag validation, build custom piping specifications, route spec-driven 3D pipe lines, and extract automated isometrics with complete BOM.',
    tagline: 'Intelligent P&ID, 3D Equipment Layout, Spec-Driven Piping & Automated Isometrics',
    syllabus: [
      'Intelligent P&ID Drafting with ISA-5.1 Symbology & Line Lists',
      '3D Parametric Equipment (Vessels, Heat Exchangers, Pumps)',
      'Spec-Driven Piping Routing per ASME B16.5 & B16.9 Standards',
      'Automated Isometric Extraction with Cut Pipe Lists & MTO'
    ],
    classes: [
      {
        id: 'cls-pip1-1',
        classNumber: 'Class 01',
        title: 'P&ID Drafting & Intelligent Equipment Tags',
        duration: '50 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'Drawing ISA compliant P&IDs, tagging pumps, and validating pipeline continuity.'
      }
    ]
  },
  {
    id: 'CRS-PIP-02',
    code: 'SP3-IND-60',
    title: 'Intergraph SmartPlant 3D (SP3D) Master',
    folder: 'piping',
    domain: 'Process Plant & Piping Engineering',
    stream: 'piping',
    category: 'PROCESS PIPING',
    software: 'Intergraph SP3D, SmartPlant Review',
    tools: ['Intergraph SP3D', 'SmartPlant Review', 'SmartPlant P&ID'],
    duration: '10 Weeks (100 Hours)',
    totalHours: 100,
    fee: 35000,
    price: 35000,
    mode: 'Classroom & Dedicated CAD Workstation Lab',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    overview: 'Train in the world standard for mega-scale offshore and petrochemical plant engineering: Intergraph SmartPlant 3D. Master coordinate systems, structural steel frames, multi-tier pipe racks, and multi-user database collaboration.',
    tagline: 'Enterprise Multi-Disciplinary Plant Modeling, Equipment, Structural Grids & Piping',
    syllabus: [
      'SP3D Space Management, Grids & Workspace Filtering',
      'Structural Steel Column Grids, Standard Beams & Pipe Racks',
      'Piping Systems Hierarchy, In-line Valves & Pipe Supports',
      'SmartPlant Isometric Drawing Generation & PCF Export'
    ],
    classes: [
      {
        id: 'cls-pip2-1',
        classNumber: 'Class 01',
        title: 'Coordinate Architecture & Equipment in SP3D',
        duration: '55 mins',
        videoType: 'drive',
        videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
        description: 'SP3D coordinate grids, placing vertical drums, and nozzle radial orientations.'
      }
    ]
  }

];

// Helper to normalize course fields
function normalizeCourse(raw: any): StoredCourse {
  const fee = Number(raw.fee || raw.price) || 30000;
  const tools = Array.isArray(raw.tools) && raw.tools.length > 0
    ? raw.tools
    : typeof raw.software === 'string' && raw.software.trim()
    ? raw.software.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['CAD Tools'];

  const syllabus = Array.isArray(raw.syllabus) && raw.syllabus.length > 0
    ? raw.syllabus
    : Array.isArray(raw.modules) && raw.modules.length > 0
    ? raw.modules.map((m: any) => m.title || String(m))
    : ['Standard CAD Syllabus'];

  const folder = raw.folder || (
    raw.domain?.toLowerCase().includes('mech') || raw.stream === 'mechanical' ? 'mechanical' :
    raw.domain?.toLowerCase().includes('elec') || raw.stream === 'eee' ? 'electrical' :
    raw.domain?.toLowerCase().includes('interior') ? 'interior' :
    raw.domain?.toLowerCase().includes('ppm') || raw.domain?.toLowerCase().includes('project') ? 'ppm' :
    raw.domain?.toLowerCase().includes('piping') ? 'piping' : 'civil'
  );

  const matchedFolder = MAIN_FOLDERS.find(f => f.id === folder) || MAIN_FOLDERS[0];

  const modules: CourseModule[] = Array.isArray(raw.modules) && raw.modules.length > 0
    ? raw.modules.map((m: any, idx: number) => ({
        number: m.number || String(idx + 1).padStart(2, '0'),
        title: m.title || (typeof m === 'string' ? m : `Module ${idx + 1}`),
        hours: Number(m.hours) || 20,
        topics: Array.isArray(m.topics) && m.topics.length > 0
          ? m.topics
          : [m.title || `Module ${idx + 1} core concepts`, 'Practical lab drafting & validation'],
      }))
    : syllabus.map((s: string, idx: number) => ({
        number: String(idx + 1).padStart(2, '0'),
        title: s,
        hours: 20,
        topics: [s, 'Practical lab drafting & validation'],
      }));

  const capstoneProject: CourseCapstone = raw.capstoneProject && raw.capstoneProject.title
    ? {
        title: raw.capstoneProject.title,
        description: raw.capstoneProject.description || 'Real-world industrial drafting, modeling, and validation project.',
        deliverables: Array.isArray(raw.capstoneProject.deliverables) && raw.capstoneProject.deliverables.length > 0
          ? raw.capstoneProject.deliverables
          : ['Design Drawings', '3D CAD Model', 'Project Dossier'],
      }
    : {
        title: `${raw.title || 'CAD Course'} Live Industry Project`,
        description: 'Real-world industrial drafting, modeling, and validation project.',
        deliverables: ['Design Drawings', '3D CAD Model', 'Project Dossier'],
      };

  const careerRoles: string[] = Array.isArray(raw.careerRoles) && raw.careerRoles.length > 0
    ? raw.careerRoles
    : ['CAD Design Engineer', 'Product Specialist', 'Project Engineer', 'Drafting Specialist'];

  const totalHours = Number(raw.totalHours) || (modules.reduce((sum: number, m: any) => sum + (m.hours || 0), 0) || 120);

  return {
    id: raw.id || `CRS-${Date.now().toString().slice(-6)}`,
    code: raw.code || `CAD-${Math.floor(10 + Math.random() * 89)}`,
    title: raw.title || 'Untitled CAD Program',
    folder: folder as any,
    domain: raw.domain || matchedFolder.name,
    stream: raw.stream || (folder === 'mechanical' || folder === 'piping' ? 'mechanical' : folder === 'electrical' ? 'eee' : 'civil'),
    category: raw.category || (folder === 'civil' ? 'PARAMETRIC BIM' : folder === 'mechanical' ? 'MECHANICAL CAE' : folder === 'electrical' ? 'ELECTRICAL CADD' : 'ENGINEERING CAD'),
    software: raw.software || tools.join(', '),
    tools,
    duration: raw.duration || '90 Days (180 Hours)',
    totalHours,
    level: raw.level || 'Professional',
    rating: raw.rating || '4.9/5.0',
    enrolledStudents: raw.enrolledStudents || '450+ Trainees',
    mode: raw.mode || 'Classroom & Dedicated CAD Workstation Lab',
    fee,
    price: fee,
    status: raw.status === 'Inactive' ? 'Inactive' : 'Active',
    image: raw.image || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    overview: raw.overview || raw.tagline || 'Comprehensive engineering CAD curriculum with live lab exercises and capstone verification.',
    tagline: raw.tagline || raw.overview || 'Industry Certified Curriculum',
    prerequisites: raw.prerequisites || 'Diploma / B.Tech / Working Professional',
    certification: raw.certification || 'Autodesk & Dassault Certificate',
    careerRoles,
    capstoneProject,
    modules,
    syllabus,
    classes: Array.isArray(raw.classes) && raw.classes.length > 0
      ? raw.classes.map((cls: any, cIdx: number) => ({
          id: cls.id || `cls-${Date.now()}-${cIdx}`,
          classNumber: cls.classNumber || `Class 0${cIdx + 1}`,
          title: cls.title || `Class 0${cIdx + 1}`,
          duration: cls.duration || '45 mins',
          videoType: cls.videoType || 'drive',
          videoUrl: cls.videoUrl || '',
          description: cls.description || '',
          resourcesUrl: cls.resourcesUrl || '',
          pdfUrl: cls.pdfUrl || '',
          pdfName: cls.pdfName || '',
          pdfSize: cls.pdfSize || '',
        }))
      : [
          {
            id: `cls-auto-1`,
            classNumber: 'Class 01',
            title: `${raw.title} - Fundamentals & CAD Standards`,
            duration: '45 mins',
            videoType: 'drive',
            videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
            description: 'Introduction to standard user interface, navigation shortcuts, template configurations, and BIS/ISO standards.',
            pdfUrl: '/uploads/sample-lecture-notes.pdf',
            pdfName: `${raw.code || 'CAD'}-Class-01-Notes.pdf`,
            pdfSize: '2.4 MB',
          },
          {
            id: `cls-auto-2`,
            classNumber: 'Class 02',
            title: `${raw.title} - Core Parametric Modeling & Detailing`,
            duration: '60 mins',
            videoType: 'drive',
            videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
            description: 'Advanced geometric constraints, dimensioning, layer management, and precision drafting workflows.',
            pdfUrl: '/uploads/sample-lab-drawings.pdf',
            pdfName: `${raw.code || 'CAD'}-Class-02-Drawings.pdf`,
            pdfSize: '3.8 MB',
          },
        ],
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Global in-memory cache to ensure instant persistence across API calls in fallback mode
let inMemoryCourses: StoredCourse[] = INITIAL_SEEDED_COURSES.map(normalizeCourse);

// GET all courses or filter by folder / stream
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder');
  const stream = searchParams.get('stream');

  try {
    const { db, isConnected } = await connectToDatabase();

    if (isConnected && db) {
      const collection = db.collection('courses');
      const count = await collection.countDocuments();

      if (count === 0) {
        await collection.insertMany(inMemoryCourses);
      } else {
        // Ensure all default courses exist in DB
        for (const defaultCourse of inMemoryCourses) {
          const exists = await collection.findOne({
            $or: [{ id: defaultCourse.id }, { title: defaultCourse.title }]
          });
          if (!exists) {
            await collection.insertOne(defaultCourse);
          }
        }
      }

      let query: any = {};
      if (folder && folder !== 'all') {
        query.folder = folder;
      } else if (stream && stream !== 'all') {
        query.stream = stream;
      }

      const courses = await collection.find(query).toArray();
      const normalized = courses.map(normalizeCourse);
      return NextResponse.json({ success: true, source: 'mongodb', courses: normalized, folders: MAIN_FOLDERS });
    }
  } catch (err) {
    console.warn('[Courses API] MongoDB query notice, serving local courses dataset:', err);
  }

  // Fallback to in-memory courses
  let filtered = inMemoryCourses;
  if (folder && folder !== 'all') {
    filtered = filtered.filter(c => c.folder === folder);
  } else if (stream && stream !== 'all') {
    filtered = filtered.filter(c => c.stream === stream);
  }

  return NextResponse.json({ success: true, source: 'fallback', courses: filtered, folders: MAIN_FOLDERS });
}

// POST create a new course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, message: 'Course title is required' }, { status: 400 });
    }

    const newCourse = normalizeCourse({
      ...body,
      id: body.id || `CRS-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    });

    // Update in-memory store immediately
    inMemoryCourses = [newCourse, ...inMemoryCourses.filter(c => c.id !== newCourse.id)];

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('courses');
        await collection.insertOne(newCourse);
        return NextResponse.json({ success: true, course: newCourse });
      }
    } catch (dbErr) {
      console.warn('[Courses API] Failed to insert in MongoDB, fallback mode:', dbErr);
    }

    return NextResponse.json({ success: true, course: newCourse, note: 'Saved in memory' });
  } catch (error) {
    console.error('[Courses API] POST error:', error);
    return NextResponse.json({ success: false, message: 'Could not create course' }, { status: 500 });
  }
}

// PUT update an existing course
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const courseId = body.id;
    const courseTitle = body.title;

    if (!courseId && !courseTitle) {
      return NextResponse.json({ success: false, message: 'Course ID or Title is required' }, { status: 400 });
    }

    const updatedCourse = normalizeCourse({
      ...body,
      updatedAt: new Date().toISOString(),
    });

    // Update in-memory store immediately
    inMemoryCourses = inMemoryCourses.map(c =>
      (courseId && c.id === courseId) || (courseTitle && c.title.toLowerCase().trim() === courseTitle.toLowerCase().trim())
        ? updatedCourse
        : c
    );

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('courses');
        const matchFilter: any = courseId && courseTitle
          ? { $or: [{ id: courseId }, { title: courseTitle }] }
          : (courseId ? { id: courseId } : { title: courseTitle });

        await collection.findOneAndUpdate(
          matchFilter,
          { $set: updatedCourse },
          { returnDocument: 'after', upsert: true }
        );
        return NextResponse.json({ success: true, course: updatedCourse });
      }
    } catch (dbErr) {
      console.warn('[Courses API] Failed to update in MongoDB, fallback mode:', dbErr);
    }

    return NextResponse.json({ success: true, course: updatedCourse, note: 'Updated in memory' });
  } catch (error) {
    console.error('[Courses API] PUT error:', error);
    return NextResponse.json({ success: false, message: 'Could not update course' }, { status: 500 });
  }
}

// DELETE a course
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('id');

  if (!courseId) {
    return NextResponse.json({ success: false, message: 'Course ID is required' }, { status: 400 });
  }

  // Update in-memory store immediately
  inMemoryCourses = inMemoryCourses.filter(c => c.id !== courseId);

  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const collection = db.collection('courses');
      const result = await collection.deleteOne({ id: courseId });
      return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    }
  } catch (dbErr) {
    console.warn('[Courses API] Failed to delete in MongoDB:', dbErr);
  }

  return NextResponse.json({ success: true, message: 'Deleted course' });
}
