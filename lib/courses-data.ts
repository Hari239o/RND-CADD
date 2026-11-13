export interface CourseModule {
  number: string;
  title: string;
  hours: number;
  topics: string[];
}

export interface Course {
  id: string;
  code?: string;
  folder?: string;
  fee?: number;
  classes?: any[];
  stream: 'civil' | 'mechanical' | 'eee' | 'interior' | 'ppm' | 'piping' | string;
  title: string;
  category: string;
  tagline: string;
  duration: string;
  totalHours: number;
  level: string;
  rating: string;
  enrolledStudents: string;
  tools: string[];
  image: string;
  overview: string;
  certification: string;
  careerRoles: string[];
  prerequisites: string;
  capstoneProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
  modules: CourseModule[];
}

export interface StreamCategory {
  id: 'civil' | 'mechanical' | 'eee';
  name: string;
  fullName: string;
  code: string;
  description: string;
  image: string;
  statCount: string;
  leadSoftware: string[];
}

export const STREAMS: StreamCategory[] = [
  {
    id: 'civil',
    name: 'CIVIL & BIM',
    fullName: 'Civil Engineering & BIM Architecture',
    code: 'DISCIPLINE 01',
    description: 'Structural drafting, parametric BIM modeling, building analysis, and construction scheduling.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    statCount: '6 Specialized Programs',
    leadSoftware: ['Revit BIM', 'AutoCAD', 'STAAD.Pro', 'ETABS', '3ds Max']
  },
  {
    id: 'mechanical',
    name: 'MECHANICAL CAD/CAE',
    fullName: 'Mechanical Design, CAM & Simulation',
    code: 'DISCIPLINE 02',
    description: '3D parametric solid modeling, generative surface design, FEA stress analysis, and CNC toolpathing.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    statCount: '6 Specialized Programs',
    leadSoftware: ['SOLIDWORKS', 'CATIA V5', 'ANSYS', 'Creo', 'Mastercam']
  },
  {
    id: 'eee',
    name: 'ELECTRICAL & EEE',
    fullName: 'Electrical CAD, Power Systems & Automation',
    code: 'DISCIPLINE 03',
    description: 'Industrial control schematics, substation transient analysis, high-speed PCB layout, and PLC automation.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    statCount: '6 Specialized Programs',
    leadSoftware: ['AutoCAD Electrical', 'EPLAN P8', 'MATLAB', 'ETAP', 'Altium']
  }
];

export const COURSES: Course[] = [
  // ==================== CIVIL COURSES ====================
  {
    id: 'civil-revit-bim',
    stream: 'civil',
    title: 'Revit Architecture & BIM Specialist',
    category: 'PARAMETRIC BIM',
    tagline: 'Comprehensive Building Information Modeling with 4D Scheduling and Clash Detection',
    duration: '12 Weeks',
    totalHours: 120,
    level: 'Beginner to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,420+ Engineers Trained',
    tools: ['Autodesk Revit 2026', 'Navisworks Manage', 'BIM 360', 'Enscape'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    overview: 'Master end-to-end architectural BIM workflows from parametric floor layout generation, structural walls, and curtain systems to multi-disciplinary clash detection and construction sequencing.',
    certification: 'Autodesk Certified Professional: Revit Architecture (ACP)',
    careerRoles: ['BIM Architect', 'Revit Modeler', 'BIM Coordinator', 'Architectural Draftsperson'],
    prerequisites: 'Basic understanding of architectural floor plans and building materials.',
    capstoneProject: {
      title: 'Commercial Complex 5-Story BIM Model with Multi-Trade Clash Report',
      description: 'Design and model an entire 5-floor mixed-use commercial facility with parametric curtain walls, interior fit-outs, schedules of quantities, and interference checking in Navisworks.',
      deliverables: ['Central BIM Model (.rvt)', 'Automated Bill of Quantities', 'Navisworks Clash Matrix', '4D Construction Timeline Animation']
    },
    modules: [
      {
        number: '01',
        title: 'Core BIM Concepts & Revit User Interface',
        hours: 20,
        topics: ['BIM Dimensions (3D, 4D, 5D)', 'Levels, Grids & Datum Elements', 'Basic Wall Systems & Layer Compound Structures', 'Doors, Windows & Floor Slabs']
      },
      {
        number: '02',
        title: 'Advanced Parametric Families & Geometry',
        hours: 30,
        topics: ['Parametric Family Editor', 'Curtain Wall Grids & Custom Mullions', 'Stairs, Railings & Ramp Formations', 'Custom In-Place Modeling with Sweeps & Blends']
      },
      {
        number: '03',
        title: 'Schedules, Material Take-off & Documentation',
        hours: 35,
        topics: ['Automated Quantity Take-off', 'Room & Area Calculations', 'Title Blocks, Viewports & Sheet Sets', 'Annotation, Keynoting & Detail Components']
      },
      {
        number: '04',
        title: 'Navisworks Coordination & Clash Detection',
        hours: 35,
        topics: ['Aggregating Architectural, Structural & MEP Models', 'Hard & Soft Clash Resolution', 'TimeLiner 4D Construction Simulation', 'Exporting Coordination Reports']
      }
    ]
  },
  {
    id: 'civil-autocad',
    stream: 'civil',
    title: 'AutoCAD Civil 2D Drafting & 3D Planning',
    category: 'TECHNICAL DRAFTING',
    tagline: 'Standard Engineering Working Drawings, Municipal Approvals & Elevation Generation',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Beginner',
    rating: '4.8/5.0',
    enrolledStudents: '2,890+ Engineers Trained',
    tools: ['AutoCAD 2026', 'Civil 3D Lite', 'AutoLISP Utilities'],
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn precise engineering drafting according to Bureau of Indian Standards (BIS) and International Building Codes (IBC), covering architectural floor plans, sections, elevations, and structural layout drawings.',
    certification: 'RND CADD Master Diploma in Civil CAD Drafting',
    careerRoles: ['Civil CAD Draftsperson', 'Site Engineer', 'Planning Technician', 'Consulting Engineer'],
    prerequisites: 'Basic knowledge of civil engineering geometry and manual drafting.',
    capstoneProject: {
      title: 'Complete Municipal Sanction Drawing Set for Multi-Unit Residential Villa',
      description: 'Prepare sanctioned submission drawings comprising floor plans, front & cross-sectional elevations, foundation trenches, and plumbing schematics complying with local development authority bylaws.',
      deliverables: ['AutoCAD .dwg Drawing Set', 'Site Layout & Key Plan', 'Staircase Cross-Sectional Detail', 'Submission Sheet PDF with Plotter Scale 1:100']
    },
    modules: [
      {
        number: '01',
        title: 'Precision Coordinate Systems & Draw Tools',
        hours: 15,
        topics: ['Cartesian, Polar & Relative Coordinate Input', 'Line, Polyline, Circle, Arc & Hatch Tools', 'Object Snaps, Tracking & Ortho Alignment', 'Layer Management & Industry Color Standards']
      },
      {
        number: '02',
        title: 'Advanced Modification, Dimensioning & Blocks',
        hours: 25,
        topics: ['Trim, Extend, Fillet, Offset & Array Commands', 'Dynamic Blocks with Stretch & Visibility States', 'Annotative Dimensioning & Text Styles', 'External References (XREFs) Management']
      },
      {
        number: '03',
        title: 'Architectural Working Drawings & Detailing',
        hours: 25,
        topics: ['G+2 Villa Floor Plan Development', 'Cross-Sections through Staircase and Washrooms', 'Foundation Trench Layout & Column Positioning', 'Door-Window Schedule Generation']
      },
      {
        number: '04',
        title: 'Layout Space, Plotting & 3D Basic Planning',
        hours: 15,
        topics: ['Paper Space Viewports & Scale Configuration', 'Page Setup, CTB Plot Styles & Batch Publishing', 'Basic 3D Solid Extrusions & Boolean Operations', 'File Standardization for Team Collaboration']
      }
    ]
  },
  {
    id: 'civil-staad-pro',
    stream: 'civil',
    title: 'STAAD.Pro Structural Analysis & Seismic Design',
    category: 'STRUCTURAL ANALYSIS',
    tagline: 'Finite Element Modeling, IS 456 RCC & IS 800 Steel Design with Seismic Code IS 1893',
    duration: '8 Weeks',
    totalHours: 75,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,150+ Engineers Trained',
    tools: ['Bentley STAAD.Pro CONNECT Edition', 'STAAD Foundation Advanced'],
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=900&q=80',
    overview: 'Acquire rigorous competence in analyzing concrete buildings, industrial steel sheds, and portal frames under dead, live, wind, and earthquake loads in compliance with standard codes.',
    certification: 'Bentley Certified Structural Modeling Associate',
    careerRoles: ['Structural Engineer', 'RCC Design Engineer', 'Steel Structural Modeler', 'Civil Project Analyst'],
    prerequisites: 'Mechanics of solids, structural analysis basics, and RCC design fundamentals.',
    capstoneProject: {
      title: 'Seismic and Wind Analysis of a G+8 Commercial RCC Space Frame',
      description: 'Model a multi-story frame, assign member properties, apply seismic forces using Equivalent Static and Response Spectrum techniques, and generate automated reinforcement schedules.',
      deliverables: ['STAAD .std Input/Output Models', 'Bending Moment & Shear Force Diagrams', 'Column & Beam Reinforcement Table', 'Isolated and Combined Footing Design Sheets']
    },
    modules: [
      {
        number: '01',
        title: 'Geometry Generation & Material Specifications',
        hours: 15,
        topics: ['Nodes, Beams & Plate Element Creation', 'Translational Repeat & Mirror Modeling', 'Material Properties & Section Profiles', 'Support Conditions (Fixed, Pinned, Spring)']
      },
      {
        number: '02',
        title: 'Load Application & Primary Combinations',
        hours: 20,
        topics: ['Selfweight, Dead Load & Floor Load Distribution', 'IS 875 Part 3 Wind Load Calculation', 'IS 1893 Seismic Zone Definition & Mass Modeling', 'Load Combination Formulations (Strength & Serviceability)']
      },
      {
        number: '03',
        title: 'IS 456 Concrete Design & Detailing',
        hours: 20,
        topics: ['Finite Element Space Frame Analysis', 'Design of Critical Beams & Shear Links', 'Axial Force + Biaxial Moment (P-M) Column Design', 'Deflection Limits & Serviceability Verification']
      },
      {
        number: '04',
        title: 'IS 800 Steel Trusses & Foundation Design',
        hours: 20,
        topics: ['Industrial Truss Modeling & Wind Uplift', 'Steel Section Optimization & Purlin Checks', 'STAAD Foundation Advanced Integration', 'Isolated, Mat & Pile Cap Analysis']
      }
    ]
  },
  {
    id: 'civil-etabs',
    stream: 'civil',
    title: 'ETABS High-Rise Building Structural Engineering',
    category: 'HIGH-RISE ENGINEERING',
    tagline: 'Multi-Story Tall Building Analysis, Shear Wall Modeling & Response Spectrum Dynamics',
    duration: '8 Weeks',
    totalHours: 70,
    level: 'Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '980+ Engineers Trained',
    tools: ['CSI ETABS 22', 'CSI SAFE 21'],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    overview: 'Specialized for high-rise buildings and tall infrastructure. Learn 3D building modeling, rigid diaphragm constraints, elevator core shear walls, and foundation mat design in CSI SAFE.',
    certification: 'CSI Structural Engineering Specialist',
    careerRoles: ['High-Rise Structural Specialist', 'Senior Civil Design Engineer', 'Finite Element Consultant'],
    prerequisites: 'Structural engineering degree or diploma, structural matrix analysis basics.',
    capstoneProject: {
      title: 'Full 15-Story Residential Tower Analysis with Dual Shear-Wall Core',
      description: 'Model a 15-story tower with elevator core shear walls, analyze dynamic modal mass participation, verify lateral drift ratios, and export reaction loads into CSI SAFE for raft foundation design.',
      deliverables: ['ETABS 3D Model', 'Modal Analysis Frequency Report', 'Shear Wall Boundary Zone Detailing', 'CSI SAFE Raft Foundation Settlement Map']
    },
    modules: [
      {
        number: '01',
        title: '3D Building Architecture in ETABS',
        hours: 15,
        topics: ['Story Data Setup & Similar Story Concept', 'Grid Systems (Cartesian & Cylindrical)', 'Frame Elements (Columns, Beams) Assignment', 'Rigid Diaphragm Definition for Floor Slabs']
      },
      {
        number: '02',
        title: 'Lateral Force Modeling & Dynamic Analysis',
        hours: 20,
        topics: ['Equivalent Static Lateral Force Procedure', 'Response Spectrum Function Input', 'Modal Mass Participation Ratios (90% Rule)', 'P-Delta Secondary Effects in Tall Structures']
      },
      {
        number: '03',
        title: 'Shear Wall Modeling, Meshing & Design',
        hours: 20,
        topics: ['Pier & Spandrel Label Assignments', 'Automated Area Mesh Optimization', 'Shear Wall Reinforcement Design according to IS 13920', 'Inter-Story Drift & Torsional Irregularity Checks']
      },
      {
        number: '04',
        title: 'Foundation Slab Design in CSI SAFE',
        hours: 15,
        topics: ['Exporting Joint Reactions from ETABS to SAFE', 'Soil Subgrade Modulus & Spring Modeling', 'Raft Foundation Punching Shear Checks', 'Flexural Reinforcement Strips & Design Sheets']
      }
    ]
  },
  {
    id: 'civil-3ds-max',
    stream: 'civil',
    title: '3ds Max & V-Ray Architectural Visualization',
    category: 'ARCHITECTURAL RENDERING',
    tagline: 'High-Fidelity Photorealistic Lighting, Materials, Walkthroughs & Interior Rendering',
    duration: '6 Weeks',
    totalHours: 60,
    level: 'Intermediate',
    rating: '4.8/5.0',
    enrolledStudents: '840+ Designers Trained',
    tools: ['Autodesk 3ds Max 2026', 'Chaos V-Ray 6', 'Adobe Photoshop'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    overview: 'Translate CAD blueprints and Revit files into stunning photorealistic architectural visualizations for real estate presentation, client walk-throughs, and portfolio development.',
    certification: 'RND CADD Architectural Visualization Master',
    careerRoles: ['3D Visualizer', 'Architectural CG Artist', 'Interior Render Specialist', 'Media Producer'],
    prerequisites: 'Basic knowledge of AutoCAD 2D or 3D modeling concepts.',
    capstoneProject: {
      title: 'Photorealistic Interior Penthouse & Day-to-Night Exterior Visualization',
      description: 'Import architectural CAD model, configure PBR realistic textures, create V-Ray sun/sky day lighting and artificial evening fixtures, and render high-resolution 4K imagery with post-production.',
      deliverables: ['High-Poly 3ds Max Scene', '4K Interior Living Room Render', '4K Evening Exterior Villa Render', 'Camera Walkthrough Video (60fps)']
    },
    modules: [
      {
        number: '01',
        title: 'CAD Import & High-Poly Precision Modeling',
        hours: 15,
        topics: ['Importing CAD Drawings & Revit FBX Models', 'Poly Modeling Techniques for Architecture', 'Parametric Furniture, Millwork & Cornices', 'Scene Optimization & Polycount Management']
      },
      {
        number: '02',
        title: 'V-Ray PBR Materials & Shader Creation',
        hours: 15,
        topics: ['V-Ray Material (VRayMtl) Architecture', 'Roughness, Diffuse, Normal & Bump Maps', 'Architectural Glass, Water & Polished Marble', 'UVW Mapping & Real-World Texture Alignment']
      },
      {
        number: '03',
        title: 'Lighting Setups & Camera Composition',
        hours: 15,
        topics: ['Physical Camera Controls (F-stop, ISO, Shutter)', 'Daylight System with V-Ray Sun & Sky', 'Interior IES Light Fixture Profiles', 'HDRI Environmental Dome Lighting']
      },
      {
        number: '04',
        title: 'Render Engine Settings & Post-Production',
        hours: 15,
        topics: ['V-Ray Frame Buffer (VFB) Tone Mapping', 'Render Elements (Reflection, Refraction, ZDepth)', 'Cryptomatte Isolation in Photoshop', 'Camera Path Walkthrough Animation Setup']
      }
    ]
  },
  {
    id: 'civil-primavera',
    stream: 'civil',
    title: 'Primavera P6 Construction Project Management',
    category: 'PROJECT MANAGEMENT',
    tagline: 'Critical Path Method (CPM), Cost Baselining & Earned Value Management (EVM)',
    duration: '4 Weeks',
    totalHours: 40,
    level: 'Professional',
    rating: '4.8/5.0',
    enrolledStudents: '1,320+ Engineers Trained',
    tools: ['Oracle Primavera P6 Professional', 'MS Excel Project Tracker'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn the project planning software utilized on massive infrastructure, highway, and mega-construction builds worldwide. Manage resources, track progress, and analyze project delays.',
    certification: 'Oracle Primavera P6 Project Management Specialist',
    careerRoles: ['Planning Engineer', 'Project Scheduling Manager', 'Cost Control Analyst', 'Contract Engineer'],
    prerequisites: 'Civil engineering background or construction site work experience.',
    capstoneProject: {
      title: 'Infrastructure Highway Bridge Project Master Schedule & Cost Baseline',
      description: 'Develop an end-to-end master schedule with 150+ activities, assign human and equipment resources, establish cost baselines, and simulate delay mitigation strategies.',
      deliverables: ['Primavera .xer Project Archive', 'Gantt Chart with Critical Path Identified', 'Resource Histogram & Cash Flow S-Curve', 'Earned Value Analysis Performance Report']
    },
    modules: [
      {
        number: '01',
        title: 'Enterprise Project Structure (EPS) & WBS',
        hours: 10,
        topics: ['Enterprise Project Structure Setup', 'Work Breakdown Structure (WBS) Hierarchy', 'Activity Types & Duration Estimations', 'Relationship Links (FS, SS, FF, SF) & Lags']
      },
      {
        number: '02',
        title: 'Critical Path Method (CPM) & Scheduling',
        hours: 10,
        topics: ['Forward & Backward Pass Scheduling', 'Total Float & Free Float Calculation', 'Identifying Critical Path & Near-Critical Activities', 'Calendar Configurations & Shift Working']
      },
      {
        number: '03',
        title: 'Resource Allocation & Cost Budgeting',
        hours: 10,
        topics: ['Labor, Non-Labor & Material Resource Creation', 'Resource Loading & Over-Allocation Leveling', 'Direct & Indirect Cost Curves', 'Establishing Target Project Baseline']
      },
      {
        number: '04',
        title: 'Tracking, Baselining & EVM Reporting',
        hours: 10,
        topics: ['Actual Progress Updating & Data Dates', 'Earned Value Metrics (PV, EV, AC, CV, SV, CPI, SPI)', 'Schedule Variance Analysis & Claim Documentation', 'Exporting Management Dashboard Reports']
      }
    ]
  },

  // ==================== MECHANICAL COURSES ====================
  {
    id: 'mech-solidworks',
    stream: 'mechanical',
    title: 'SOLIDWORKS Master Professional',
    category: 'PARAMETRIC 3D CAD',
    tagline: 'Precision Part Modeling, Advanced Assemblies, Sheet Metal, Weldments & Simulation',
    duration: '10 Weeks',
    totalHours: 100,
    level: 'Beginner to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '3,100+ Engineers Trained',
    tools: ['SOLIDWORKS 2026 Premium', 'Simulation Xpress', 'SOLIDWORKS Motion'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80',
    overview: 'Acquire complete professional fluency in SOLIDWORKS. From 2D sketching and 3D solid features to complex mechanical assemblies, sheet metal enclosures, and structural weldments.',
    certification: 'Certified SOLIDWORKS Associate & Professional (CSWA / CSWP)',
    careerRoles: ['Mechanical Design Engineer', 'Product Development Specialist', 'CAD Tooling Engineer', 'R&D Mechanical Modeler'],
    prerequisites: 'Basic knowledge of engineering graphics, orthographic projections, and machine drawing.',
    capstoneProject: {
      title: 'Industrial Dual-Stage Reduction Gearbox Assembly with Kinematic Motion Simulation',
      description: 'Model 30+ precision parts including helical gears, shafts, bearings, and casting housing. Perform interference checks, motion simulation, and automated manufacturing drawings with GD&T.',
      deliverables: ['Complete SolidWorks Assembly (.sldasm)', 'Exploded View with Bill of Materials', 'Motion Study Video (Rotation & Torque)', 'Manufacturing Drawing Sheets with Fit Tolerances']
    },
    modules: [
      {
        number: '01',
        title: '2D Sketching Fundamentals & Solid Features',
        hours: 20,
        topics: ['Geometric Relations & Fully Defined Sketches', 'Extrude, Revolve, Sweep & Loft Features', 'Fillet, Chamfer, Shell & Rib Engineering Tools', 'Reference Geometry: Planes, Axes & Coordinate Systems']
      },
      {
        number: '02',
        title: 'Complex Mechanical Assemblies & Mates',
        hours: 25,
        topics: ['Top-Down vs. Bottom-Up Assembly Strategy', 'Standard, Advanced & Mechanical Mates (Gear, Cam, Slot)', 'Interference Detection & Clearance Verification', 'Exploded Views & Bill of Materials (BOM) Customization']
      },
      {
        number: '03',
        title: 'Sheet Metal & Structural Weldments',
        hours: 30,
        topics: ['Base Flange, Edge Flange, Hem & Jog Tools', 'K-Factor & Bend Allowance Calculations', 'Flat Pattern Generation for Laser Cutting', 'Weldment Profiles, Structural Members, Gussets & End Caps']
      },
      {
        number: '04',
        title: 'GD&T Detailing & Simulation Xpress',
        hours: 25,
        topics: ['ASME Y14.5 Geometric Dimensioning & Tolerancing', 'Surface Finish, Datum Features & Positional Tolerance', 'Finite Element Stress Analysis in Simulation Xpress', 'CSWP Certification Exam Preparation Drills']
      }
    ]
  },
  {
    id: 'mech-catia',
    stream: 'mechanical',
    title: 'CATIA V5 Aerospace & Automotive Surfacing',
    category: 'SURFACE & BIW DESIGN',
    tagline: 'Generative Shape Design (GSD), Class-A Surfacing, DMU Kinematics & BIW Enclosures',
    duration: '12 Weeks',
    totalHours: 120,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,860+ Engineers Trained',
    tools: ['CATIA V5-6R 2026', 'Generative Shape Design (GSD)', 'DMU Kinematics'],
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=900&q=80',
    overview: 'The global standard in aerospace and automotive OEM engineering. Master advanced surface modeling, aerodynamic curves, Class-A continuity, Body-in-White (BIW) design, and kinematic mechanism simulations.',
    certification: 'Dassault Systèmes Certified CATIA Specialist',
    careerRoles: ['Automotive BIW Designer', 'Aerospace Surface Modeler', 'Class-A Surface Stylist', 'CAD Systems Engineer'],
    prerequisites: 'Strong background in 3D CAD modeling fundamentals.',
    capstoneProject: {
      title: 'Automotive Hood Outer/Inner Panel Assembly with Hemming & Generative Ribs',
      description: 'Develop Class-A outer skin surfaces, create structural inner reinforcement panel with generative lightening holes and mastic points, and verify G0, G1, and G2 surface curvature continuity.',
      deliverables: ['CATIA Part (.CATPart) with Full Spec Tree', 'Curvature Porcupine Analysis Report', 'Inner Panel Tooling Clearance Verification', 'Assembly Mechanism Kinematic Simulation']
    },
    modules: [
      {
        number: '01',
        title: 'CATIA Architecture & Parametric Part Design',
        hours: 25,
        topics: ['Sketcher Workbench & Constraint Strategies', 'Pad, Pocket, Shaft & Multi-Sections Solid Tools', 'Boolean Operations & Hybrid Modeling Architecture', 'Power Copy & Design Automation Templates']
      },
      {
        number: '02',
        title: 'Generative Shape Design (GSD) Wireframe & Surfaces',
        hours: 35,
        topics: ['Splines, Projections & Intersections', 'Extrude, Revolve, Cylinder, Offset & Swept Surfaces', 'Fill, Blend, Join, Trim & Split Surface Manipulations', 'G0 (Positional), G1 (Tangency) & G2 (Curvature) Continuity']
      },
      {
        number: '03',
        title: 'Automotive Body-in-White (BIW) Design',
        hours: 30,
        topics: ['BIW Terminology: A/B/C Pillars, Hood, Fender, Doors', 'Master Sections Interpretation & Tooling Direction', 'Flanges, Hemming Reliefs & Mastic Point Design', 'Draft Analysis for Injection Mold & Stamping Die Ejection']
      },
      {
        number: '04',
        title: 'DMU Kinematics & Assembly Product Design',
        hours: 30,
        topics: ['Kinematic Joints: Revolute, Prismatic, Cylindrical, Screw', 'Mechanism Simulation, Law Curves & Clash Analysis', 'Drafting Generation with Section Cuts and ISO Standards', 'Aerospace Bracket Optimization Case Studies']
      }
    ]
  },
  {
    id: 'mech-ansys',
    stream: 'mechanical',
    title: 'ANSYS FEA & CFD Multiphysics Simulation',
    category: 'CAE & FINITE ELEMENT',
    tagline: 'Static Structural, Modal Vibration, Transient Thermal & Fluent Fluid Flow Analysis',
    duration: '10 Weeks',
    totalHours: 90,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,540+ Engineers Trained',
    tools: ['ANSYS Workbench 2026', 'Mechanical APDL', 'ANSYS Fluent CFD'],
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=900&q=80',
    overview: 'Bridge engineering design with computational physics. Learn to mesh geometries, assign realistic boundary conditions, and simulate structural failure, heat transfer, and aerodynamic airflow.',
    certification: 'ANSYS Engineering Simulation Associate',
    careerRoles: ['FEA Analyst', 'CFD Engineer', 'Thermal Simulation Specialist', 'CAE Project Consultant'],
    prerequisites: 'Engineering mechanics, strength of materials, fluid mechanics, and heat transfer.',
    capstoneProject: {
      title: 'Structural Fatigue & Thermal Dissipation Analysis of High-Performance Brake Rotor',
      description: 'Model transient frictional heating during deceleration, calculate Von Mises stress peaks and thermal expansion, and run mesh independence study to verify numerical convergence.',
      deliverables: ['ANSYS Workbench Project Archive (.wbpz)', 'Mesh Convergence Curve (Element Quality > 0.85)', 'Von Mises Stress & Factor of Safety Contours', 'CFD Airflow Cooling Velocity Vector Plots']
    },
    modules: [
      {
        number: '01',
        title: 'Geometry Cleanup & Advanced Meshing',
        hours: 20,
        topics: ['SpaceClaim Geometry Defeature & Mid-Surfacing', 'Element Types: 1D Beam, 2D Shell & 3D Hex/Tet', 'Mesh Metrics: Aspect Ratio, Skewness & Orthogonal Quality', 'Local Sizing, Edge Biasing & Inflation Layers']
      },
      {
        number: '02',
        title: 'Static Structural Analysis & Contact Physics',
        hours: 25,
        topics: ['Boundary Conditions: Fixed, Displacement & Frictionless', 'Contact Formulations: Bonded, No Separation, Frictional', 'Stress Singularities vs. True Peak Stresses', 'Factor of Safety (FOS) & Failure Theories (Von Mises, Tresca)']
      },
      {
        number: '03',
        title: 'Modal Vibration & Transient Thermal Analysis',
        hours: 25,
        topics: ['Natural Frequencies & Mode Shapes (Resonance Avoidance)', 'Pre-Stressed Modal Analysis of Rotating Assemblies', 'Steady-State & Transient Thermal Heat Conduction', 'Coupled Thermal-Structural Multi-Field Simulation']
      },
      {
        number: '04',
        title: 'Computational Fluid Dynamics (CFD) with Fluent',
        hours: 20,
        topics: ['Navier-Stokes Governing Equations & Turbulence Models', 'Internal & External Incompressible Flow Modeling', 'Velocity Contours, Pressure Drops & Drag Coefficients', 'Post-Processing Simulation Graphs & Engineering Validation']
      }
    ]
  },
  {
    id: 'mech-creo',
    stream: 'mechanical',
    title: 'PTC Creo Parametric Industrial Design',
    category: 'PARAMETRIC CAE',
    tagline: 'Top-Down Skeleton Assembly, Sheet Metal, Mechanism Dynamics & Production Drafting',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Beginner to Intermediate',
    rating: '4.8/5.0',
    enrolledStudents: '1,210+ Engineers Trained',
    tools: ['PTC Creo Parametric 10.0', 'Creo Mechanism Dynamics'],
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=900&q=80',
    overview: 'Master PTC Creo for robust industrial machine design. Widely employed across automotive subsystems, heavy machinery, consumer appliances, and precision electronics packaging.',
    certification: 'PTC Certified Creo Design Associate',
    careerRoles: ['Creo Modeler', 'Mechanical Drafter', 'Mechanism Design Engineer', 'Industrial Product Developer'],
    prerequisites: 'Basic knowledge of engineering drawing and machine parts.',
    capstoneProject: {
      title: 'Four-Bar Linkage Mechanism with Automated Top-Down Assembly Framework',
      description: 'Construct a top-down assembly utilizing skeleton models, simulate angular velocity and torque at joints, and generate full manufacturing drawing sheets with associative BOM tables.',
      deliverables: ['Creo Skeleton Assembly (.asm)', 'Mechanism Dynamics Graph (.grt)', 'Standard Sheet Metal Bracket Design', 'Complete 2D Detail Drawings with Tolerancing']
    },
    modules: [
      {
        number: '01',
        title: 'Creo Fundamentals & Core Modeling',
        hours: 20,
        topics: ['Intent Manager Sketching & Parent-Child Relationships', 'Extrude, Revolve, Sweep & Helical Sweep Tools', 'Rounds, Chamfers, Drafts, Ribs & Holes', 'Patterning: Dimension, Direction, Axis & Fill Patterns']
      },
      {
        number: '02',
        title: 'Advanced Part Modeling & Flexible Modeling',
        hours: 20,
        topics: ['Swept Blend & Variable Section Sweeps', 'Family Tables for Standard Fasteners & Parts', 'Relations, Parameters & User-Defined Features (UDFs)', 'Flexible Modeling for Direct Geometry Modification']
      },
      {
        number: '03',
        title: 'Skeleton Assembly & Mechanism Simulation',
        hours: 20,
        topics: ['Top-Down Assembly Design with Skeleton Models', 'Mechanism Connections: Pin, Slider, Cylinder, Planar', 'Running Dynamic Motion Analyses & Interference Tracking', 'Exploded States, Offset Lines & Drawing Production']
      },
      {
        number: '04',
        title: 'Sheet Metal & Tooling Integration',
        hours: 20,
        topics: ['Wall Features: Planar, Flange, Flat & Extruded', 'Reliefs, Form Features & Rip Commands', 'Flat Pattern Validation & Material Spring-back', 'Detailing Worksheets & Title Block Standards']
      }
    ]
  },
  {
    id: 'mech-nx',
    stream: 'mechanical',
    title: 'Siemens NX CAD / Unigraphics Masterclass',
    category: 'HIGH-END INDUSTRIAL CAD',
    tagline: 'Synchronous Technology, Freeform Surfacing, Mold Wizard & Precision Engineering',
    duration: '10 Weeks',
    totalHours: 100,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,430+ Engineers Trained',
    tools: ['Siemens NX 2312', 'Mold Wizard', 'NX Synchronous Technology'],
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=900&q=80',
    overview: 'Experience the enterprise CAD suite chosen by premier automotive giants and aerospace contractors. Master Synchronous direct modeling, advanced class freeform surfaces, and injection mold tooling.',
    certification: 'Siemens NX Mechanical CAD Specialist',
    careerRoles: ['Siemens NX Designer', 'Mold & Die Specialist', 'Automotive Powertrain Modeler', 'Product Systems Analyst'],
    prerequisites: 'Strong 3D solid modeling foundation.',
    capstoneProject: {
      title: 'Automotive Engine Intake Manifold with Complete Injection Mold Tooling Design',
      description: 'Model aerodynamic intake manifold using synchronous technology and freeform surfaces, establish parting surfaces, core, and cavity split using NX Mold Wizard, and simulate mold flow cooling.',
      deliverables: ['NX Part File (.prt)', 'Core and Cavity Assembly with Lifters & Sliders', 'Draft Analysis Report (3 Degree Minimum)', 'Tooling Drawing Package with ISO Standards']
    },
    modules: [
      {
        number: '01',
        title: 'NX Interface & Synchronous Technology',
        hours: 25,
        topics: ['Direct Modeling with Move Face, Pull Face, Offset Region', 'Constraint Recognition & History-Free Geometry Edits', 'Extrude, Revolve, Hole & Thread Operations', 'Feature Reorder, Suppress & Expression Equations']
      },
      {
        number: '02',
        title: 'Advanced Freeform & Studio Surfacing',
        hours: 25,
        topics: ['Studio Splines & Control Point Manipulation', 'Through Curves, Mesh Surfaces & Swept Curves', 'Face Blend, Styled Blend & Aesthetic Fillets', 'Surface Quality Analysis: Reflection & Slope Evaluation']
      },
      {
        number: '03',
        title: 'Complex Assembly Modeling & WAVE Technology',
        hours: 25,
        topics: ['WAVE Geometry Linker for Inter-Part Associativity', 'Large Assembly Management & Lightweight Representations', 'Clearance Analysis & Collision Reporting', 'Drafting Application: Ordinate Dimensioning & Section Views']
      },
      {
        number: '04',
        title: 'Mold Wizard & Tooling Engineering',
        hours: 25,
        topics: ['Parting Line & Parting Surface Generation', 'Core & Cavity Automatic Splitting', 'Standard Mold Base Selection & Runner Gate Layout', 'Cooling Circuit Layout & Ejection Pin System']
      }
    ]
  },
  {
    id: 'mech-mastercam',
    stream: 'mechanical',
    title: 'Mastercam & Multi-Axis CNC Programming',
    category: 'CAM & MANUFACTURING',
    tagline: '2D/3D High-Speed Toolpaths, 4-Axis & 5-Axis Milling, Lathe Turning & G-Code Generation',
    duration: '6 Weeks',
    totalHours: 60,
    level: 'Intermediate',
    rating: '4.8/5.0',
    enrolledStudents: '1,120+ Engineers Trained',
    tools: ['Mastercam 2026', 'CIMCO Edit', 'Fanuc / Haas CNC Simulators'],
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=900&q=80',
    overview: 'Bridge digital CAD models to real-world precision machined components. Learn CNC milling, turning, high-speed dynamic roughing, toolpath verification, and post-processing for Fanuc and Haas CNC machines.',
    certification: 'Mastercam Certified Manufacturing Associate',
    careerRoles: ['CNC Programmer', 'CAM Engineer', 'Machining Process Planner', 'Manufacturing Technician'],
    prerequisites: 'Knowledge of cutting tools, feeds, speeds, and machine shop practices.',
    capstoneProject: {
      title: 'Aerospace Impeller Multi-Axis CNC Milling Program with G-Code Post-Processing',
      description: 'Program complete machining sequence from rough billet facing and dynamic pocketing to multi-axis surface finishing. Run gouge checks and generate production-ready Fanuc CNC code.',
      deliverables: ['Mastercam File (.mcam)', 'CIMCO Verified G-Code (.nc file)', 'Machining Setup Sheet (Tools, Offsets, Cycle Times)', 'Machine Simulation Verification Video']
    },
    modules: [
      {
        number: '01',
        title: 'CAM Setup & 2D Milling Operations',
        hours: 15,
        topics: ['Stock Setup, Work Coordinate Systems (G54-G59)', 'Facing, Contour Milling & 2D Pocketing', 'Dynamic Motion High-Speed Roughing Algorithms', 'Standard Drilling, Pecking & Tapping Cycles']
      },
      {
        number: '02',
        title: '3D High-Speed Surface Machining',
        hours: 15,
        topics: ['3D Surface High-Speed (OptiRough) Toolpaths', 'Finishing Strategies: Waterline, Scallop, Hybrid', 'Tool Holder Clearance & Collision Detection', 'Stepover & Scallop Height Calculations for Surface Finish']
      },
      {
        number: '03',
        title: 'Lathe Turning & Multi-Axis Basics',
        hours: 15,
        topics: ['OD Roughing, Finishing, Grooving & Threading', 'C-Axis Mill-Turn Configurations', 'Rotary 4-Axis Indexing & Continuous Milling', '5-Axis Curve, Swarf & Multiaxis Drilling Introduction']
      },
      {
        number: '04',
        title: 'Post-Processing & Shop Floor Verification',
        hours: 15,
        topics: ['Configuring Post-Processors for Fanuc, Haas, Siemens Controllers', 'G-Code and M-Code Structure Optimization', 'CIMCO Edit Backplotting & Cycle Time Calculation', 'Shop Floor Tooling Sheet & Work Offset Documentation']
      }
    ]
  },

  // ==================== EEE COURSES ====================
  {
    id: 'eee-autocad-electrical',
    stream: 'eee',
    title: 'AutoCAD Electrical Industrial Systems',
    category: 'ELECTRICAL CAD',
    tagline: 'Control Schematics, PLC I/O Wiring, Panel Layouts & Terminal Strip Automation',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Beginner to Intermediate',
    rating: '4.9/5.0',
    enrolledStudents: '2,140+ Engineers Trained',
    tools: ['AutoCAD Electrical 2026', 'Autodesk Vault'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    overview: 'Design automated industrial electrical schematics with speed and accuracy. Build ladder diagrams, point-to-point wiring, automated terminal strips, PLC modules, and electrical panel enclosures.',
    certification: 'Autodesk Certified Professional: AutoCAD Electrical',
    careerRoles: ['Electrical CAD Engineer', 'Control Panel Designer', 'Automation Project Engineer', 'Industrial Instrumentation Drafter'],
    prerequisites: 'Basic knowledge of circuit theory, contactors, relays, and motor starters.',
    capstoneProject: {
      title: 'Automated Industrial Motor Control Center (MCC) Panel Schematic & 2D Layout',
      description: 'Create multi-sheet schematics for a 3-motor conveyor line MCC with star-delta starters, safety interlocks, PLC discrete I/O modules, and real-scale enclosure panel layout.',
      deliverables: ['Multi-Sheet Electrical Project (.wdp & .dwg)', 'Automated Bill of Materials (BOM)', 'Terminal Footprint & Jumper Diagram', 'Cable & Wire Run Schedule']
    },
    modules: [
      {
        number: '01',
        title: 'Project Management & Schematic Wiring',
        hours: 20,
        topics: ['Project Manager & Drawing Properties Configuration', 'Wires, Wire Numbers & Signal Cross-References', 'Ladders & Rung Insertion with Automated Referencing', 'Component Insertion: Pushbuttons, Relays, Contactors']
      },
      {
        number: '02',
        title: 'PLC I/O Modules & Schematic Tools',
        hours: 20,
        topics: ['Parametric PLC Module Generation (Analog & Digital)', 'PLC Address-Based Tagging & I/O Spreadsheets Integration', 'Circuit Builder: Motor Starters, Control Circuits', 'Component Cross-Referencing (NO/NC Contacts)']
      },
      {
        number: '03',
        title: 'Panel Enclosure Layout & Footprints',
        hours: 20,
        topics: ['DIN Rail & Wireway Installation Planning', 'Physical Component Footprint Placement from Schematic List', 'Terminal Strip Editor & Jumper Configuration', 'Nameplates, Legend Tables & Conduit Calculations']
      },
      {
        number: '04',
        title: 'Reports Generation & Industrial Compliance',
        hours: 20,
        topics: ['Automated BOM with Catalog Numbers & Pricing', 'Wire From/To Lists & Terminal Connection Tables', 'IEC vs. NFPA Electrical Drawing Symbols Standards', 'Title Blocks Synchronization & PDF Export']
      }
    ]
  },
  {
    id: 'eee-revit-mep',
    stream: 'eee',
    title: 'Revit MEP Electrical Building Services',
    category: 'BUILDING ELECTRICAL BIM',
    tagline: 'Power Distribution, Lighting Layouts, Cable Trays, Panel Schedules & Lux Analysis',
    duration: '10 Weeks',
    totalHours: 100,
    level: 'Intermediate',
    rating: '4.8/5.0',
    enrolledStudents: '1,490+ Engineers Trained',
    tools: ['Autodesk Revit MEP 2026', 'Navisworks Manage', 'DIALux Evo Integration'],
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn electrical design inside Building Information Modeling (BIM). Layout lighting systems, power receptacles, calculate load balancing on distribution boards, and route high-voltage cable trays.',
    certification: 'Autodesk Certified Professional: Revit MEP Electrical',
    careerRoles: ['Electrical BIM Engineer', 'MEP Coordinator', 'Building Services Consultant', 'Electrical Draftsman'],
    prerequisites: 'Electrical engineering basics and building architectural plan comprehension.',
    capstoneProject: {
      title: 'Complete Electrical BIM Services for a 4-Floor Corporate Office Building',
      description: 'Model electrical lighting fixtures with lux calculations, power circuiting to distribution boards, transformer substation room, and routed cable tray systems coordinated against HVAC ducts.',
      deliverables: ['Revit MEP Central Model (.rvt)', 'Automated Distribution Panel Schedules', 'Cable Tray Route Layout with Elevation Tags', 'Navisworks MEP Clash Free Verification Matrix']
    },
    modules: [
      {
        number: '01',
        title: 'MEP Electrical Setup & Architecture Linking',
        hours: 25,
        topics: ['Linking Architectural & Structural Models', 'Electrical Settings: Voltage Definitions & Distribution Systems', 'Lighting Fixture Placement & Photometric IES Web Files', 'Space & Zone Creation for Illumination Calculations']
      },
      {
        number: '02',
        title: 'Power Systems & Distribution Circuiting',
        hours: 25,
        topics: ['Receptacles, Switches & Disconnects Layout', 'Circuiting Devices into Electrical Systems', 'Wire Sizing & Conduit Routing Standards', 'Distribution Panel Schedules & Phase Balancing']
      },
      {
        number: '03',
        title: 'Cable Trays, Substation & Low-Voltage Systems',
        hours: 25,
        topics: ['Cable Tray Fitting Types, Bends & Reducers', 'Transformers, Generators & UPS Battery Bank Modeling', 'Low Current Systems: Fire Alarm, CCTV, Data Racks', 'Cable Tray Fill Percentage & Structural Clearances']
      },
      {
        number: '04',
        title: 'Schedules, Documentation & Navisworks Coordination',
        hours: 25,
        topics: ['Electrical Quantity Take-off Schedules', 'Single-Line Diagram Drafting in Revit Views', 'Tagging, Annotation & Drawing Sheets Preparation', 'Clash Detection with Ductwork & Plumbing in Navisworks']
      }
    ]
  },
  {
    id: 'eee-eplan',
    stream: 'eee',
    title: 'EPLAN Electric P8 Automation Engineering',
    category: 'INDUSTRIAL AUTOMATION CAD',
    tagline: 'Multi-Line Schematics, 3D Control Cabinet Pro Panel Layouts & Automated Cable Wiring',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,080+ Engineers Trained',
    tools: ['EPLAN Electric P8 2026', 'EPLAN Pro Panel', 'EPLAN Data Portal'],
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=900&q=80',
    overview: 'The enterprise standard in Europe and global automation manufacturing. Create high-efficiency multi-line project schematics, virtual 3D control panel cabinets, and automated wire routing.',
    certification: 'EPLAN Certified Engineer (ECE)',
    careerRoles: ['EPLAN Design Engineer', 'Industrial Automation Specialist', 'Cabinet Engineering Analyst', 'Switchgear Designer'],
    prerequisites: 'Electrical circuit knowledge, industrial switchgear and relay logic familiarity.',
    capstoneProject: {
      title: 'Automated Bottling Plant Industrial Control Cabinet in EPLAN Pro Panel',
      description: 'Design complete multi-line schematics with PLC safety controllers, layout virtual 3D control cabinet with automated wire routing, and export CNC drilling templates for Rittal enclosures.',
      deliverables: ['EPLAN Project (.elk / .zw1)', '3D Cabinet Digital Twin Layout with Thermal Analysis', 'Automated Wire Cutting & Stripping List', 'Rittal Enclosure NC Drilling Output Data']
    },
    modules: [
      {
        number: '01',
        title: 'EPLAN Framework & Multi-Line Schematic Design',
        hours: 20,
        topics: ['Page Structure & IEC 81346 Identification Standards', 'Autoconnecting & Smart Connecting Logic', 'Symbol Libraries & Macro Creation', 'Cross-References: Contactors, Overload Relays & Safety Switches']
      },
      {
        number: '02',
        title: 'PLC System Integration & Bus Topology',
        hours: 20,
        topics: ['PLC Overview Pages & Multi-Line Bus Connections', 'Profinet & Industrial Ethernet Network Diagrams', 'PLC Data Exchange with TIA Portal / RSLogix', 'Potentials, Signals & Interruption Points']
      },
      {
        number: '03',
        title: 'Virtual 3D Cabinet Design in EPLAN Pro Panel',
        hours: 20,
        topics: ['Rittal Enclosure Selection from EPLAN Data Portal', 'Mounting Panels, Cable Ducts & DIN Rails Setup', '3D Component Placement & Minimum Clearance Verification', 'Virtual Wire Routing with Length & Bending Radius Calculation']
      },
      {
        number: '04',
        title: 'Automated Reports & Manufacturing Output',
        hours: 20,
        topics: ['Terminal Diagram, Cable Summary & Device Tagging Lists', 'Bill of Materials with Part Numbers & ERP Integration', 'Cabinet Climate Thermal Dissipation Verification', 'Production NC Data Export for Automated Panel Fabrication']
      }
    ]
  },
  {
    id: 'eee-matlab',
    stream: 'eee',
    title: 'MATLAB & Simulink Power Electronics Simulation',
    category: 'SYSTEMS SIMULATION',
    tagline: 'DC-DC Converters, Motor Drives (FOC/BLDC), Renewable Grid Integration & Control Laws',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,620+ Engineers Trained',
    tools: ['MATLAB R2026a', 'Simulink', 'Simscape Electrical'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    overview: 'Design, simulate, and optimize complex power electronic circuits and control algorithms. Model converters, inverters, electric vehicle motor drives, and solar/wind renewable grid interconnections.',
    certification: 'MathWorks Certified MATLAB Associate',
    careerRoles: ['Power Electronics Engineer', 'Control Systems Analyst', 'EV Powertrain Modeler', 'Renewable Grid Simulation Engineer'],
    prerequisites: 'Circuit analysis, differential equations, and control systems fundamentals.',
    capstoneProject: {
      title: 'Solar Photovoltaic Inverter System with Maximum Power Point Tracking (MPPT) & Grid Tie',
      description: 'Model PV array with Perturb & Observe MPPT algorithm, design DC-DC Boost Converter and 3-phase grid-connected inverter with Phase Locked Loop (PLL) synchronization under grid voltage sag.',
      deliverables: ['Simulink System Model (.slx)', 'THD Harmonic Distortion Spectrum Analysis (< 3%)', 'MPPT Tracking Efficiency Step-Response Plots', 'Embedded C-Code Generation via Embedded Coder']
    },
    modules: [
      {
        number: '01',
        title: 'MATLAB Scripting & Simulink Foundations',
        hours: 20,
        topics: ['Matrix Manipulations, Scripts & Custom Functions', 'Simulink Block Modeling & Discrete Solver Configurations', 'Simscape Electrical Specialized Power Systems Library', 'Signal Processing, Scope Visualizations & FFT Analysis']
      },
      {
        number: '02',
        title: 'Power Electronic Converters & PWM Techniques',
        hours: 20,
        topics: ['Buck, Boost & Buck-Boost DC-DC Converters Design', 'Inductor & Capacitor Value Sizing for Continuous Conduction', 'Pulse Width Modulation (PWM) & Space Vector (SVPWM)', 'Single-Phase & Three-Phase Voltage Source Inverters (VSI)']
      },
      {
        number: '03',
        title: 'Electric Motor Drives & Vector Control',
        hours: 20,
        topics: ['Permanent Magnet Synchronous Motor (PMSM) Modeling', 'Field Oriented Control (FOC) with Clarke & Park Transforms', 'PID Controller Tuning (Speed & Current Inner Loops)', 'Regenerative Braking Simulation in Electric Vehicles']
      },
      {
        number: '04',
        title: 'Renewable Microgrids & Embedded Code Generation',
        hours: 20,
        topics: ['Solar PV & Wind Turbine Modeling in Simscape', 'Battery Energy Storage Systems (BESS) State of Charge (SOC)', 'Phase Locked Loop (PLL) Grid Synchronization', 'Auto-Generating C-Code for TI C2000 DSP Microcontrollers']
      }
    ]
  },
  {
    id: 'eee-etap',
    stream: 'eee',
    title: 'ETAP Power System Analysis & Substation Design',
    category: 'POWER GRID & SUBSTATION',
    tagline: 'Load Flow Studies, Short-Circuit Calculation, Relay Coordination & Arc Flash Hazard',
    duration: '8 Weeks',
    totalHours: 75,
    level: 'Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '920+ Engineers Trained',
    tools: ['ETAP 24.0 Enterprise', 'ETAP Star Protection Coordination'],
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80',
    overview: 'The global benchmark software for electrical utility companies and heavy industrial plants. Perform critical load flow, IEEE/IEC short-circuit analysis, protection relay coordination, and arc flash safety.',
    certification: 'ETAP Certified Power Systems Engineer',
    careerRoles: ['Power Systems Engineer', 'Substation Protection Specialist', 'Industrial Grid Analyst', 'Electrical Commissioning Engineer'],
    prerequisites: 'Power systems engineering, per-unit system calculations, and switchgear fundamentals.',
    capstoneProject: {
      title: '132/33kV Electrical Substation Grid Modeling with Complete Overcurrent Relay Discrimination',
      description: 'Build a one-line diagram for a transmission substation with multiple generators and loads. Execute load flow to eliminate undervoltages, compute 3-phase faults, and configure protection time-current curves (TCC).',
      deliverables: ['ETAP Project Database (.oti)', 'Load Flow Bus Voltage & Branch Loss Report', 'IEEE 1584 Arc Flash Hazard Warning Labels Data', 'Star Protective Relay TCC Curve Plots']
    },
    modules: [
      {
        number: '01',
        title: 'One-Line Diagram Creation & Equipment Sizing',
        hours: 15,
        topics: ['Building One-Line Diagrams with Drag-and-Drop Elements', 'Transformers (Two-Winding, Three-Winding) & Impedance Sizing', 'Synchronous Generators & Induction Motors Modeling', 'Cables, Busbars & Transmission Line Parameters Input']
      },
      {
        number: '02',
        title: 'Load Flow Analysis & Power Factor Correction',
        hours: 20,
        topics: ['Newton-Raphson & Fast-Decoupled Load Flow Algorithms', 'Bus Voltage Alerts & Overloaded Cable Identification', 'Capacitor Bank Placement for Power Factor Correction (0.95+)', 'Transformer Tap Changer Optimization']
      },
      {
        number: '03',
        title: 'Short-Circuit Analysis according to IEEE & IEC',
        hours: 20,
        topics: ['ANSI / IEEE C37 Standard Fault Calculations', 'IEC 60909 Symmetrical & Asymmetrical Fault Currents', 'Circuit Breaker Interrupting & Making Capacity Verification', 'Ground Grid Design & Substation Step/Touch Potentials']
      },
      {
        number: '04',
        title: 'Protective Device Coordination & Arc Flash',
        hours: 20,
        topics: ['ETAP Star Time-Current Characteristic (TCC) Curves', 'Overcurrent & Earth Fault Relay Discrimination Margins', 'IEEE 1584 Arc Flash Incident Energy & Boundary Calculations', 'Safety PPE Categorization & Hazard Label Automation']
      }
    ]
  },
  {
    id: 'eee-altium',
    stream: 'eee',
    title: 'Altium Designer Multi-Layer PCB Engineering',
    category: 'PCB & HARDWARE DESIGN',
    tagline: 'High-Speed Digital Routing, Differential Pairs, Signal Integrity & Gerber Manufacturing',
    duration: '8 Weeks',
    totalHours: 70,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,280+ Engineers Trained',
    tools: ['Altium Designer 24', 'ActiveBOM', 'CAM350'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    overview: 'Design professional multi-layer printed circuit boards (PCBs). From hierarchical schematic capture and component footprint creation to high-speed impedance matching, thermal vias, and DFM validation.',
    certification: 'Altium Certified Hardware Design Associate',
    careerRoles: ['PCB Layout Engineer', 'Hardware Design Specialist', 'Electronics Embedded Developer', 'Signal Integrity Analyst'],
    prerequisites: 'Basic knowledge of electronic circuits, passive components, and SMD/through-hole technology.',
    capstoneProject: {
      title: '4-Layer ARM Cortex-M4 IoT Controller Board with USB-C and Impedance Matched RF',
      description: 'Capture hierarchical schematic with MCU and power regulators, define 4-layer stackup (Signal-GND-PWR-Signal), route 90-ohm USB differential pairs with length matching, and output IPC-2581 fab files.',
      deliverables: ['Altium Project (.PrjPcb)', 'Fabrication Gerber X2 & NC Drill Output Files', 'Pick and Place Assembly CSV', 'Design Rule Check (DRC) Zero-Violation Report']
    },
    modules: [
      {
        number: '01',
        title: 'Schematic Capture & Component Libraries',
        hours: 15,
        topics: ['Hierarchical Multi-Sheet Schematic Structuring', 'Creating Schematic Symbols & IPC Compliant Footprints', '3D STEP Model Integration for Component Verification', 'Net Labels, Buses, Harnesses & Electrical Rule Checks (ERC)']
      },
      {
        number: '02',
        title: 'PCB Layer Stackup & Design Rules',
        hours: 20,
        topics: ['Layer Stack Manager: Core, Prepreg & Controlled Impedance', 'Defining Design Rules (Clearance, Width, Via Sizes)', 'Component Placement Strategy: Power, Analog & High-Speed Digital', 'Ground Plane Partitioning & Return Current Path Planning']
      },
      {
        number: '03',
        title: 'High-Speed Routing & Signal Integrity',
        hours: 20,
        topics: ['Interactive Routing & Push/Shove Obstacle Avoidance', 'Differential Pair Routing (USB, Ethernet, PCIe)', 'Length & Delay Tuning (Accordion Trombone Meanders)', 'Crosstalk Mitigation, Thermal Vias & Copper Pour Polygons']
      },
      {
        number: '04',
        title: 'Design for Manufacturing (DFM) & Assembly Files',
        hours: 15,
        topics: ['Design Rule Checking (DRC) & Manufacturing Audits', 'Gerber X2, ODB++ & IPC-2581 Production Export', 'Drill Drawings, Solder Mask & Silkscreen Layer Verification', 'ActiveBOM Generation with Live Supplier Pricing & Availability']
      }
    ]
  }

  // ==================== INTERIOR ARCHITECTURE COURSES ====================
  {
    id: 'int-sketchup-joinery',
    folder: 'interior',
    stream: 'interior',
    title: 'SketchUp & Modular Casework Joinery',
    category: 'INTERIOR 3D VIS',
    tagline: 'Modular Kitchens, Wardrobe Carcass, Joinery Millwork & Hardware Detailing',
    duration: '6 Weeks',
    totalHours: 60,
    level: 'Beginner to Intermediate',
    rating: '4.9/5.0',
    enrolledStudents: '840+ Designers Trained',
    tools: ['Trimble SketchUp Pro', 'LayOut', 'V-Ray for SketchUp'],
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    overview: 'Design production-ready modular kitchens, residential casework, and custom wardrobes with precision joinery drawings and CNC cut-list generation.',
    certification: 'Trimble Certified SketchUp Professional',
    careerRoles: ['Modular Kitchen Designer', 'Interior CAD Specialist', 'Casework Draftsperson'],
    prerequisites: 'Basic knowledge of residential interiors or drafting fundamentals.',
    capstoneProject: {
      title: 'Luxury 3BHK Modular Kitchen & Wardrobe Fabrication Package',
      description: 'Produce complete 3D SketchUp cabinetry models with drawer systems, carcass assemblies, hardware schedules, and LayOut 2D shop drawings.',
      deliverables: ['SketchUp 3D Model (.skp)', 'LayOut Shop Drawing Book (.layout)', 'Hardware BOM & Cutlist']
    },
    modules: [
      {
        number: '01',
        title: 'Space Planning & Modular Standards',
        hours: 15,
        topics: ['Kitchen Work Triangle', 'Standard Modular Dimensions (300/450/600/900mm)', 'Carcass vs Shutter Materials', 'Appliance Clearance Guidelines']
      },
      {
        number: '02',
        title: 'SketchUp 3D Cabinetry Modeling',
        hours: 20,
        topics: ['Parametric Components', 'Tandem Drawer Boxes', 'Lift-up Flap Fittings', 'Edge-banding & Material Mapping']
      },
      {
        number: '03',
        title: 'LayOut Shop Drawings & CNC Cutlist',
        hours: 25,
        topics: ['Floor Plans & Internal Elevations', 'Sectional Details & Exploded Axonometrics', 'Hardware Fittings Schedule', 'Exporting PDF Fabrication Dossiers']
      }
    ]
  },
  {
    id: 'int-3dsmax-vray',
    folder: 'interior',
    stream: 'interior',
    title: '3ds Max & V-Ray Photorealistic Rendering',
    category: 'INTERIOR 3D VIS',
    tagline: 'Physically Based Lighting, IES Photometrics, PBR Shading & Cinematic Post-Production',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Intermediate to Advanced',
    rating: '5.0/5.0',
    enrolledStudents: '1,120+ Visualizers Trained',
    tools: ['Autodesk 3ds Max 2026', 'Chaos V-Ray 6', 'Adobe Photoshop'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    overview: 'Create high-end photorealistic 4K architectural interior renders. Master HDRI environments, IES luminaire profiles, realistic fabric/wood textures, and frame-buffer color grading.',
    certification: 'Autodesk Certified Professional: 3ds Max / Chaos V-Ray Certified',
    careerRoles: ['3D Architectural Visualizer', 'Lighting Artist', 'Interior CGI Lead'],
    prerequisites: 'Basic 3D modeling fundamentals.',
    capstoneProject: {
      title: 'Five-Star Hotel Suite Photorealistic Portfolio Showcase',
      description: 'Model and render an ultra-luxury suite with custom fabrics, velvet drapery, IES downlights, daylight sun study, and Photoshop post-compositing.',
      deliverables: ['High-Res 4K Renders', 'Render Elements Breakdown (Lighting, GI, Reflection)', 'Camera Animation Walkthrough']
    },
    modules: [
      {
        number: '01',
        title: 'Asset Import & Architectural Modeling',
        hours: 20,
        topics: ['DWG CAD Floorplan Import', 'Wall Openings & Crown Moldings', 'Subdivision Surface Furniture Detailing', 'Cloth Simulation for Cushions']
      },
      {
        number: '02',
        title: 'Lighting & Environment Setup',
        hours: 25,
        topics: ['Dome Light with HDRIs', 'V-Ray Sun & Sky Daylight Systems', 'Photometric IES Spotlights', 'Color Temperature & Exposure Control']
      },
      {
        number: '03',
        title: 'PBR Textures & Frame-Buffer Post-Production',
        hours: 35,
        topics: ['Complex V-Ray Shaders (Marble, Brushed Brass, Velvet)', 'Roughness & Normal Map Baking', 'Cryptomatte & Render Elements', 'Photoshop Camera Raw Grading']
      }
    ]
  },
  {
    id: 'int-autocad-space-planning',
    folder: 'interior',
    stream: 'interior',
    title: 'AutoCAD Interior Space Planning & Layouts',
    category: 'INTERIOR 3D VIS',
    tagline: '2D Interior Floor Plans, Electrical RCP, Plumbing & Elevation Working Drawings',
    duration: '6 Weeks',
    totalHours: 60,
    level: 'Beginner to Intermediate',
    rating: '4.8/5.0',
    enrolledStudents: '950+ Trainees',
    tools: ['AutoCAD 2026', 'Design Center', 'Sheet Set Manager'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    overview: 'Comprehensive training in drafting accurate interior architectural working drawings, Reflected Ceiling Plans (RCP), electrical switch layouts, flooring patterns, and wall elevations.',
    certification: 'Autodesk Certified User: AutoCAD for Interior Architecture',
    careerRoles: ['Interior Draftsperson', 'Architectural CAD Technician', 'Fitout Coordinator'],
    prerequisites: 'Basic computer literacy.',
    capstoneProject: {
      title: 'Commercial Executive Office Interior Working Drawing Set',
      description: 'Complete 15-sheet working drawing set containing demolition plan, furniture layout, false ceiling grid, electrical circuitry, and joinery details.',
      deliverables: ['DWG CAD Project Files', 'Consolidated Sheet Set PDF', 'BOQ Material Estimation']
    },
    modules: [
      {
        number: '01',
        title: 'Architectural Base Plan & Furniture Layout',
        hours: 20,
        topics: ['Layer Architecture & Lineweights', 'Standard Dynamic Furniture Blocks', 'Anthropometrics & Clearances', 'Partition Wall Types']
      },
      {
        number: '02',
        title: 'Reflected Ceiling & Electrical Circuits',
        hours: 20,
        topics: ['False Ceiling Gypsum Levels', 'Cove Lighting & Downlight Fixtures', 'Switch-to-Light Looping', 'HVAC Diffuser Coordinates']
      },
      {
        number: '03',
        title: 'Flooring, Elevations & Sheet Sets',
        hours: 20,
        topics: ['Flooring Tile Setting Out & Inlays', 'Wall Paneling Elevations', 'Callouts & Detail Cross-Sections', 'Batch Plotting via Sheet Set Manager']
      }
    ]
  },

  // ==================== PROJECT MANAGEMENT (PPM) COURSES ====================
  {
    id: 'ppm-primavera-enterprise',
    folder: 'ppm',
    stream: 'ppm',
    title: 'Oracle Primavera P6 Professional Enterprise',
    category: 'PROJECT MANAGEMENT',
    tagline: 'Enterprise EPS, Multi-Level WBS, Critical Path Method (CPM) & Earned Value S-Curves',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Intermediate to Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '1,560+ Project Planners',
    tools: ['Oracle Primavera P6 Pro 24', 'Primavera Visualizer', 'Excel PM Models'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    overview: 'Master enterprise-level project planning with Primavera P6. Build robust Work Breakdown Structures, define logic ties, optimize critical path float, level labor/machinery, and report earned value performance.',
    certification: 'Oracle Certified Specialist: Primavera P6 Enterprise Project Portfolio Management',
    careerRoles: ['Planning Engineer', 'Project Controls Specialist', 'PPM Consultant', 'Scheduler'],
    prerequisites: 'Basic knowledge of civil, mechanical, or industrial projects.',
    capstoneProject: {
      title: 'Metro Rail Viaduct 24-Month EPC Baseline Master Schedule',
      description: 'Develop a fully resourced 1,200-activity master schedule in Primavera P6 with resource allocation, monthly cost curves, cash flows, and delay claims analysis.',
      deliverables: ['Primavera P6 XER Export', 'Baseline S-Curve Analysis Report', 'Critical Path Risk Matrix']
    },
    modules: [
      {
        number: '01',
        title: 'Enterprise Portfolio & Calendar Setup',
        hours: 20,
        topics: ['Enterprise Project Structure (EPS)', 'Organizational Breakdown Structure (OBS)', 'Global vs Project Calendars', 'Work Breakdown Structure (WBS) Nodes']
      },
      {
        number: '02',
        title: 'Scheduling Logic & Critical Path Method',
        hours: 30,
        topics: ['Activity Types & Durations', 'Relationship Types (FS, SS, FF, SF) & Lags', 'Total Float & Free Float Computation', 'Schedule Compression (Crashing & Fast-Tracking)']
      },
      {
        number: '03',
        title: 'Resource Optimization & Earned Value Tracking',
        hours: 30,
        topics: ['Labor & Equipment Resource Codes', 'Resource Leveling Without Delaying Milestones', 'Earned Value Management (BAC, PV, EV, AC, CPI, SPI)', 'Variance Reporting & S-Curve Graphing']
      }
    ]
  },
  {
    id: 'ppm-ms-project',
    folder: 'ppm',
    stream: 'ppm',
    title: 'Microsoft Project (MSP) Professional',
    category: 'PROJECT MANAGEMENT',
    tagline: 'Interactive Gantt Charts, Resource Pool Sharing, Task Dependencies & Baseline Audits',
    duration: '6 Weeks',
    totalHours: 60,
    level: 'Beginner to Intermediate',
    rating: '4.8/5.0',
    enrolledStudents: '1,320+ Managers Trained',
    tools: ['Microsoft Project 2026 Pro', 'Excel PowerPivot', 'Power BI'],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn Microsoft Project from fundamentals to executive dashboards. Structure task hierarchies, assign work/material resources, manage multiple projects with a shared resource pool, and track progress against baseline.',
    certification: 'Microsoft Certified Professional: Managing Projects with Microsoft Project',
    careerRoles: ['Assistant Project Manager', 'Construction Scheduler', 'Project Coordinator'],
    prerequisites: 'Basic computer literacy.',
    capstoneProject: {
      title: 'Multi-Story Residential Tower 18-Month Construction Project',
      description: 'Create end-to-end MSP project plan featuring sub-tasks, recurring milestones, material cost tracking, custom graphical indicator fields, and executive dashboards.',
      deliverables: ['MS Project File (.mpp)', 'Executive Status Dashboard', 'Variance & Earned Value Report']
    },
    modules: [
      {
        number: '01',
        title: 'Task Sequencing & Hierarchy',
        hours: 15,
        topics: ['Manual vs Auto-Scheduled Tasks', 'Work Breakdown Indentation', 'Milestone Setting & Predecessors', 'Calendar Exceptions & Working Hours']
      },
      {
        number: '02',
        title: 'Resource Pools & Cost Modeling',
        hours: 20,
        topics: ['Work, Material & Cost Resources', 'Centralized Resource Pool Sharing', 'Over-allocation Alerts & Leveling Options', 'Fixed vs Variable Cost Assignment']
      },
      {
        number: '03',
        title: 'Tracking, Baselines & Executive Dashboards',
        hours: 25,
        topics: ['Setting Up to 11 Baselines', 'Updating Actual Work & Remaining Duration', 'Cost & Schedule Variance Tables', 'Visual Reports Export to Excel & Power BI']
      }
    ]
  },
  {
    id: 'ppm-cost-estimation',
    folder: 'ppm',
    stream: 'ppm',
    title: 'EPC Quantity Surveying & Cost Estimation',
    category: 'PROJECT MANAGEMENT',
    tagline: 'Bill of Quantities (BOQ), Rate Analysis, Tender Preparation & FIDIC Contracts',
    duration: '6 Weeks',
    totalHours: 60,
    level: 'Intermediate',
    rating: '4.9/5.0',
    enrolledStudents: '980+ Engineers Trained',
    tools: ['PlanSwift', 'Excel Advanced PM', 'AutoCAD Takeoff'],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
    overview: 'Learn professional quantity takeoff and project cost engineering. Extract quantities from architectural/structural drawings, perform rate analysis for concrete/steel/masonry, and build dynamic tenders.',
    certification: 'RICS Aligned Certificate in Quantity Surveying & Estimating',
    careerRoles: ['Quantity Surveyor', 'Cost Estimator', 'Contracts & Billing Engineer'],
    prerequisites: 'Civil or Mechanical engineering background.',
    capstoneProject: {
      title: 'Commercial IT Park ₹45 Crore Turnkey Cost Estimate & BOQ',
      description: 'Perform digital quantity takeoff from 20 structural sheets, calculate unit rate analysis including machinery and labor, and deliver a comprehensive item-rate tender package.',
      deliverables: ['Detailed Measurement Sheet (DMS)', 'Rate Analysis Dossier', 'Tender Submission BOQ']
    },
    modules: [
      {
        number: '01',
        title: 'Digital Quantity Takeoff Fundamentals',
        hours: 20,
        topics: ['Earthwork & Substructure Quantities', 'RCC Footings, Columns, Beams & Slabs', 'Steel Reinforcement Bar Bending Schedules (BBS)', 'Masonry & Plaster Area Computations']
      },
      {
        number: '02',
        title: 'Rate Analysis & Cost Modeling',
        hours: 20,
        topics: ['Standard Data Book Rates (CPWD / MoRTH)', 'Material Lead & Conveyance Charges', 'Machinery Output & Hire Rates', 'Contractor Profit & Contingencies']
      },
      {
        number: '03',
        title: 'Tendering, Contracts & Interim Billing',
        hours: 20,
        topics: ['Item-Rate vs EPC Lump-Sum Tenders', 'FIDIC Contract Conditions & Clauses', 'Running Account (RA) Bill Verification', 'Price Escalation Formulas']
      }
    ]
  },

  // ==================== PIPING & PLANT ENGINEERING COURSES ====================
  {
    id: 'pip-plant-3d',
    folder: 'piping',
    stream: 'piping',
    title: 'AutoCAD Plant 3D Modeling & P&ID',
    category: 'PROCESS PIPING',
    tagline: 'Intelligent P&ID, 3D Equipment Layout, Spec-Driven Piping & Automated Isometrics',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Intermediate',
    rating: '4.9/5.0',
    enrolledStudents: '1,040+ Piping Engineers',
    tools: ['AutoCAD Plant 3D 2026', 'Plant 3D Spec Editor', 'Navisworks'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
    overview: 'Master plant design workflows using AutoCAD Plant 3D. Create intelligent P&IDs with tag validation, build custom piping specifications, route spec-driven 3D pipe lines, and extract automated isometrics with complete BOM.',
    certification: 'Autodesk Certified Professional: AutoCAD Plant 3D',
    careerRoles: ['Plant Layout Engineer', 'Piping Draftsperson', '3D Plant Modeler'],
    prerequisites: 'Basic AutoCAD knowledge and familiarity with industrial piping.',
    capstoneProject: {
      title: 'Chemical Refinery Hydro-Desulfurization (HDS) Unit 3D Layout',
      description: 'Route high-pressure hydrogen lines connecting reactors, heat exchangers, and pumps with ASME B31.3 piping specs and generate full fabrication isometrics.',
      deliverables: ['Plant 3D Central Project', 'Automated Fabrication Isometric Sheets', 'Equipment Nozzle Schedule & BOM']
    },
    modules: [
      {
        number: '01',
        title: 'Intelligent P&ID Drafting & Data Validation',
        hours: 20,
        topics: ['ISA-5.1 Symbology Standards', 'Equipment & Instrument Bubbles', 'Pipe Line Numbering (Diameter-Fluid-Spec-Insulation)', 'P&ID to 3D Plant Model Line List Verification']
      },
      {
        number: '02',
        title: '3D Equipment & Piping Routing',
        hours: 30,
        topics: ['Modeling Horizontal/Vertical Vessels & Centrifugal Pumps', 'Spec-Driven Routing with ASME B16.5 Flanges', 'Branch Connections (Tees, Weldolets, Threadolets)', 'Valve Placement & Pipe Support Library']
      },
      {
        number: '03',
        title: 'Automated Isometrics & Orthographic Production',
        hours: 30,
        topics: ['Iso Break Points & Spool Numbering', 'Configuring Isometric Title Blocks', 'Cut Pipe Length Schedules & Welds Count', '2D Orthographic Section Views with Dimensions']
      }
    ]
  },
  {
    id: 'pip-sp3d-master',
    folder: 'piping',
    stream: 'piping',
    title: 'Intergraph SmartPlant 3D (SP3D) Master',
    category: 'PROCESS PIPING',
    tagline: 'Enterprise Multi-Disciplinary Plant Modeling, Equipment, Structural Grids & Piping',
    duration: '10 Weeks',
    totalHours: 100,
    level: 'Advanced',
    rating: '5.0/5.0',
    enrolledStudents: '890+ EPC Engineers',
    tools: ['Intergraph SP3D', 'SmartPlant Review', 'SmartPlant P&ID'],
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
    overview: 'Train in the world standard for mega-scale offshore and petrochemical plant engineering: Intergraph SmartPlant 3D. Master coordinate systems, structural steel frames, multi-tier pipe racks, and multi-user database collaboration.',
    certification: 'Hexagon Intergraph SP3D Certified Specialist',
    careerRoles: ['SP3D Administrator / Lead Modeler', 'Piping Design Engineer', 'Offshore Plant Designer'],
    prerequisites: 'Piping engineering fundamentals and CAD proficiency.',
    capstoneProject: {
      title: 'Offshore Wellhead Platform 3-Deck Plant Model in SP3D',
      description: 'Coordinate structural steel truss beams, separator vessels, and multi-tier interconnecting pipe racks inside SP3D with zero clash matrix report.',
      deliverables: ['SP3D Backup Session File', 'Clash Matrix Clearance Report', 'Material Take-off (MTO) Export']
    },
    modules: [
      {
        number: '01',
        title: 'SP3D Coordinate Architecture & Common Tasks',
        hours: 25,
        topics: ['Coordinate Systems & Workspaces', 'Space Management & Coordinate Grids', 'Query Filtering & Surface Styles', 'Reference 3D DWG/DGN Attachments']
      },
      {
        number: '02',
        title: 'Equipment & Structural Modeling',
        hours: 35,
        topics: ['Primitive Shapes & Solid Geometry', 'Nozzle Orientation & Elevation Placement', 'Structural Column Grids, Standard Beams & Bracing', 'Stairs, Handrails, Ladders & Grating Slabs']
      },
      {
        number: '03',
        title: 'Piping Discipline & Isometric Extraction',
        hours: 40,
        topics: ['Piping Systems & Run Hierarchy', 'Spec Selection & In-line Instrument Insertion', 'Piping Support Modeling & Hanger Assemblies', 'SmartPlant Isometric Drawing Generation (PCFs)']
      }
    ]
  },
  {
    id: 'pip-caesar-stress',
    folder: 'piping',
    stream: 'piping',
    title: 'Caesar II Pipe Stress Analysis & Flexibility',
    category: 'PROCESS PIPING',
    tagline: 'ASME B31.3 Flexibility, Sustained Loads, Thermal Expansion & Nozzle Loads',
    duration: '8 Weeks',
    totalHours: 80,
    level: 'Advanced',
    rating: '4.9/5.0',
    enrolledStudents: '920+ Stress Engineers',
    tools: ['Hexagon Caesar II 14', 'ASME B31.3 Calculator', 'FE Pipe'],
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80',
    overview: 'Evaluate structural integrity of industrial piping systems under operational temperature, pressure, wind, and seismic loads. Verify allowable stress limits according to ASME B31.3 and evaluate pump/compressor nozzle loads.',
    certification: 'Hexagon Caesar II Certified Pipe Stress Analyst',
    careerRoles: ['Pipe Stress Engineer', 'Flexibility Analyst', 'Mechanical Static Equipment Specialist'],
    prerequisites: 'Degree/Diploma in Mechanical/Chemical Engineering with Strength of Materials knowledge.',
    capstoneProject: {
      title: 'High-Temperature Boiler Steam Line (540°C, 100 Bar) Stress Analysis',
      description: 'Build complete Caesar II model with thermal expansion loops, select spring hanger supports, check allowable stress ranges, and verify turbine nozzle loads per NEMA SM-23.',
      deliverables: ['Caesar II (.CII) Model', 'Spring Hanger Selection Table', 'Code Compliance & Nozzle Load Report']
    },
    modules: [
      {
        number: '01',
        title: 'Piping Mechanics & ASME B31 Codes',
        hours: 20,
        topics: ['Thermal Expansion & Stress Range Concepts', 'Primary vs Secondary Stress Categories', 'ASME B31.1 (Power) vs ASME B31.3 (Process)', 'Sustained, Expansion & Occasional Load Cases']
      },
      {
        number: '02',
        title: 'Caesar II Geometry Modeling & Boundary Conditions',
        hours: 30,
        topics: ['Element Definition (DX, DY, DZ)', 'Bend Radius & Stress Intensification Factors (SIF)', 'Restraints: Anchors, Guides, Line Stops & Gaps', 'Modeling Temperature (T1, T2) & Internal Pressure']
      },
      {
        number: '03',
        title: 'Spring Hanger Sizing & Nozzle Evaluation',
        hours: 30,
        topics: ['Variable vs Constant Spring Hanger Selection', 'Thermal Movement & Hot Load vs Cold Load', 'Equipment Nozzle Compliance (API 610 / NEMA SM-23)', 'Expansion Loops & Routing Optimization Strategies']
      }
    ]
  }

];

