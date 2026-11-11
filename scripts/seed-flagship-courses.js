const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/educadd_lms';

const FLAGSHIP_COURSES = [
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
  }
];

async function seed() {
  const client = await MongoClient.connect(uri);
  const db = client.db('educadd_lms');
  const collection = db.collection('courses');

  for (const course of FLAGSHIP_COURSES) {
    await collection.updateOne(
      { id: course.id },
      { $set: course },
      { upsert: true }
    );
  }

  // Also make sure existing courses have a folder and fee
  const allCourses = await collection.find({}).toArray();
  for (const c of allCourses) {
    if (!c.folder || !c.fee) {
      let folder = 'civil';
      const d = (c.domain || c.title || '').toLowerCase();
      if (d.includes('mech') || c.stream === 'mechanical') folder = 'mechanical';
      else if (d.includes('elec') || c.stream === 'eee') folder = 'electrical';
      else if (d.includes('interior') || d.includes('3ds max')) folder = 'interior';
      else if (d.includes('primavera') || d.includes('project')) folder = 'ppm';
      else if (d.includes('piping') || d.includes('plant')) folder = 'piping';

      await collection.updateOne(
        { _id: c._id },
        {
          $set: {
            folder,
            fee: c.fee || 30000,
            price: c.price || c.fee || 30000,
            status: c.status || 'Active',
            classes: c.classes && c.classes.length > 0 ? c.classes : [
              {
                id: 'cls-1',
                classNumber: 'Class 01',
                title: `${c.title} - Fundamentals & CAD Standards`,
                duration: '45 mins',
                videoType: 'drive',
                videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
                description: 'Overview of engineering standards, drafting templates, and core software tools.'
              },
              {
                id: 'cls-2',
                classNumber: 'Class 02',
                title: `${c.title} - Core Modeling & Industrial Detailing`,
                duration: '60 mins',
                videoType: 'drive',
                videoUrl: 'https://drive.google.com/file/d/1w8o19vH1M9hP2nE5G4aBcDef/preview',
                description: 'Detailed workflows, parametric geometry, and industry capstone project design.'
              }
            ]
          }
        }
      );
    }
  }

  const finalCount = await collection.countDocuments();
  console.log('Seeded successfully! Total courses now in MongoDB:', finalCount);
  await client.close();
}

seed().catch(console.error);
