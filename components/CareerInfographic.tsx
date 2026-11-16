'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';

export interface CareerPathwayItem {
  id: string;
  step: string;
  level: string;
  experience: string;
  role: string;
  ctc: string;
  focus: string;
  growth: string;
  // Backward compatibility fields
  status?: string;
  color?: 'blue' | 'orange';
  iconType?: string;
}

export const getCourseCareerPathways = (course: Course): CareerPathwayItem[] => {
  const query = `${course.id || ''} ${course.title || ''} ${course.stream || ''} ${course.folder || ''} ${course.category || ''} ${Array.isArray(course.tools) ? course.tools.join(' ') : ''} ${typeof (course as any).software === 'string' ? (course as any).software : ''}`.toLowerCase();

  // 1. CNC / Mastercam / Manufacturing
  if (query.includes('mastercam') || query.includes('cnc') || query.includes('cam') || query.includes('machining')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'CNC Programmer & 2D CAM Specialist', ctc: '₹4.2L – ₹8.5L PA', focus: '2D Toolpaths, G-Code Verification & Cycle Times', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: '3-Axis / 4-Axis Milling Engineer', ctc: '₹5.2L – ₹10.5L PA', focus: 'Complex Surface Toolpaths, High-Speed Machining & Mold Die', growth: '+35% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: '5-Axis Multi-Tasking CAM Lead', ctc: '₹7.2L – ₹13.8L PA', focus: 'Simultaneous 5-Axis Programming, Mill-Turn & Kinematics', growth: '+65% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Tooling & Manufacturing Process Manager', ctc: '₹9.5L – ₹17.0L PA', focus: 'Fixture Architecture, Post-Processor Setup & Lean Optimization', growth: '+90% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Chief CAM & Smart Factory Consultant', ctc: '₹14.0L – ₹24.0L+ PA', focus: 'Industry 4.0 Digital Factory & Global Aerospace Supply', growth: 'Executive Tier' },
    ];
  }

  // 2. SolidWorks / Creo / Mechanical Design
  if (query.includes('solidworks') || query.includes('creo') || query.includes('inventor') || query.includes('mechanical cad') || (query.includes('mechanical') && !query.includes('ansys') && !query.includes('catia'))) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'Mechanical 3D CAD Modeler', ctc: '₹4.5L – ₹8.8L PA', focus: 'Parametric Part & Assembly Modeling with GD&T Tolerances', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Product Design & Sheet Metal Specialist', ctc: '₹5.8L – ₹11.0L PA', focus: 'Sheet Metal Enclosures, Molded Plastics & DFMA Optimization', growth: '+38% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Senior Machine Design Lead', ctc: '₹7.5L – ₹14.0L PA', focus: 'Kinematic Mechanisms, Drive Systems & Structural Validation', growth: '+68% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Product Development & R&D Lead', ctc: '₹10.0L – ₹18.0L PA', focus: 'New Product Introduction (NPI), Rapid Prototyping & Sourcing', growth: '+95% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Chief Mechanical Engineering Architect', ctc: '₹15.0L – ₹26.0L+ PA', focus: 'Enterprise Product Strategy, Global PLM & Technical Direction', growth: 'Executive Tier' },
    ];
  }

  // 3. CATIA V5 Aerospace & Automotive Surfacing
  if (query.includes('catia') || query.includes('aerospace') || query.includes('automotive') || query.includes('surfacing')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'Automotive CAD Surface Modeler', ctc: '₹5.0L – ₹9.5L PA', focus: 'Generative Shape Design (GSD), Wireframe & Solid Part Integration', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Class-A BIW Design Specialist', ctc: '₹6.5L – ₹12.5L PA', focus: 'Exterior & Interior Class-A Surfaces & Curvature Continuity', growth: '+40% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Aerospace Packaging & DMU Lead', ctc: '₹8.5L – ₹15.5L PA', focus: 'Digital Mock-Up (DMU) Kinematics, Space Claim & Tolerance Stacks', growth: '+70% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Vehicle Integration Lead', ctc: '₹11.5L – ₹20.0L PA', focus: 'Crashworthiness Packaging, Aerodynamic Styling & Platform Systems', growth: '+105% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Global Automotive / Aerospace Consultant', ctc: '₹16.0L – ₹28.0L+ PA', focus: 'Global Co-Design Programs, EV Platform Architecture & Strategy', growth: 'Executive Tier' },
    ];
  }

  // 4. ANSYS FEA & CFD Multiphysics Simulation
  if (query.includes('ansys') || query.includes('fea') || query.includes('cfd') || query.includes('simulation') || query.includes('multiphysics')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'Junior CAE Simulation Analyst', ctc: '₹5.2L – ₹10.0L PA', focus: 'High-Quality Meshing, Boundary Conditions & Linear Static Runs', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Structural FEA & Fatigue Specialist', ctc: '₹6.8L – ₹13.0L PA', focus: 'Non-Linear Contact, Elastoplastic Materials & Durability Life', growth: '+38% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'CFD Aerodynamics & Thermal Lead', ctc: '₹9.0L – ₹16.5L PA', focus: 'Fluent Multiphase, Turbulent Heat Transfer & Aero-Acoustics', growth: '+72% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Simulation Technical Authority', ctc: '₹12.0L – ₹21.0L PA', focus: 'Physical Test Correlation, Regulatory Certification & Design Audit', growth: '+105% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Principal CAE Multiphysics Consultant', ctc: '₹17.0L – ₹30.0L+ PA', focus: 'HPC Scalable Simulation Strategy & Digital Twin Architecture', growth: 'Executive Tier' },
    ];
  }

  // 5. Revit Architecture & BIM Specialist
  if (query.includes('revit') || query.includes('bim') || query.includes('navisworks')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'BIM Architectural Modeler', ctc: '₹4.5L – ₹9.0L PA', focus: '3D BIM Modeling, Parametric Walls, Floors & Sheet Extraction', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Revit Family Creator & Drafter', ctc: '₹5.5L – ₹10.5L PA', focus: 'Parametric Family Content, Standard Template Libraries & LOD 300', growth: '+35% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Lead BIM Coordinator', ctc: '₹7.0L – ₹13.5L PA', focus: 'Multi-Disciplinary Model Federation, Navisworks Clash Matrix & Audits', growth: '+65% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Clash Resolution & 4D Simulation Specialist', ctc: '₹9.5L – ₹17.0L PA', focus: '4D/5D Timeline Simulation, Site Clash Rectification & Risk Audits', growth: '+92% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Corporate BIM Consultant & Enterprise Lead', ctc: '₹14.0L – ₹24.0L+ PA', focus: 'Enterprise BIM Execution (BEP), Digital Twins & Global Delivery', growth: 'Executive Tier' },
    ];
  }

  // 6. STAAD.Pro / ETABS / High-Rise Structural Design
  if (query.includes('staad') || query.includes('etabs') || query.includes('structural') || query.includes('seismic')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'Structural CAD Drafter & Modeler', ctc: '₹4.2L – ₹8.0L PA', focus: 'RCC & Structural Steel General Arrangement (GA) Drawings', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Junior Structural Design Engineer', ctc: '₹5.5L – ₹10.5L PA', focus: 'Dead/Live/Seismic Load Modeling & Concrete Element Detailing', growth: '+35% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Senior Structural Analyst (IS/ACI)', ctc: '₹7.5L – ₹14.0L PA', focus: 'High-Rise Response Spectrum, Wind Dynamics & Foundation Design', growth: '+68% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Lead Structural Project Consultant', ctc: '₹10.0L – ₹18.0L PA', focus: 'Value Engineering, Seismic Retrofitting & Structural Peer Reviews', growth: '+98% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Principal Structural Director', ctc: '₹15.0L – ₹26.0L+ PA', focus: 'Mega-Infrastructure, Signature Bridges & Corporate EPC Leadership', growth: 'Executive Tier' },
    ];
  }

  // 7. AutoCAD Civil / 2D Drafting / Survey / Municipal
  if (query.includes('autocad') || query.includes('civil') || query.includes('drafting')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'Civil 2D/3D Drafting Engineer', ctc: '₹3.8L – ₹7.5L PA', focus: 'Layout Plans, Structural Sections, Elevations & Working Drawings', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Infrastructure Planning Specialist', ctc: '₹4.8L – ₹9.5L PA', focus: 'Grading, Earthwork Cut/Fill & Municipal Sanction Dossiers', growth: '+32% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Senior Land & Highway Modeler', ctc: '₹6.5L – ₹12.5L PA', focus: 'Highway Alignment, Stormwater Networks & Survey Integration', growth: '+65% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Civil Project Delivery Lead', ctc: '₹8.8L – ₹16.0L PA', focus: 'Multi-Utility Coordination & Statutory Infrastructure Approvals', growth: '+92% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Chief Civil Infrastructure Consultant', ctc: '₹13.0L – ₹23.0L+ PA', focus: 'Smart City Masterplanning & Public Infrastructure Concessions', growth: 'Executive Tier' },
    ];
  }

  // 8. 3ds Max / V-Ray / Lumion / Architectural Visualization / Interior
  if (query.includes('lumion') || query.includes('3ds max') || query.includes('v-ray') || query.includes('sketchup') || query.includes('interior') || query.includes('rendering')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: '3D Architectural Visualizer', ctc: '₹4.2L – ₹8.5L PA', focus: 'Poly Modeling, PBR Materials & Camera Scene Composition', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Lighting & Photorealistic Artist', ctc: '₹5.5L – ₹10.8L PA', focus: 'V-Ray GI Lighting, HDRI Skies, Texture Baking & Material Detail', growth: '+36% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Senior Architectural Walkthrough Lead', ctc: '₹7.2L – ₹14.0L PA', focus: 'Cinematic Camera Moves, Lumion Animations & Interactive VR Tours', growth: '+66% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Visualization Studio Art Director', ctc: '₹9.8L – ₹17.5L PA', focus: 'High-End Marketing Visuals & Real Estate Developer Direction', growth: '+94% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Chief Creative Visualization Partner', ctc: '₹14.5L – ₹25.0L+ PA', focus: 'Global Architectural Competitions & Luxury Brand Visual Strategy', growth: 'Executive Tier' },
    ];
  }

  // 9. Electrical CAD / EPLAN / ETAP / Automation
  if (query.includes('eplan') || query.includes('electrical') || query.includes('automation') || query.includes('etap') || query.includes('plc')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'Electrical Control Systems Drafter', ctc: '₹4.5L – ₹8.5L PA', focus: 'Schematics, Single Line Diagrams (SLD) & Cable Schedules', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'EPLAN Industrial Automation Specialist', ctc: '₹5.8L – ₹11.0L PA', focus: '3D Control Cabinet Pro Panel Layouts, PLC I/O & Wire Harnesses', growth: '+38% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Substation Power Grid Analyst (ETAP)', ctc: '₹7.8L – ₹14.5L PA', focus: 'Short Circuit, Arc Flash, Relay Coordination & Load Flow Studies', growth: '+70% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Lead Substation & EPC Engineer', ctc: '₹10.5L – ₹18.5L PA', focus: 'Turnkey Substation Design & Automation Commissioning', growth: '+98% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Principal Electrical Energy Consultant', ctc: '₹15.0L – ₹27.0L+ PA', focus: 'Renewable Grid Interconnection, Decarbonization & EPC Advisory', growth: 'Executive Tier' },
    ];
  }

  // 10. Piping / SP3D / Caesar II / Plant Design
  if (query.includes('piping') || query.includes('sp3d') || query.includes('plant') || query.includes('caesar')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'Junior Piping Layout Modeler', ctc: '₹4.8L – ₹9.2L PA', focus: '3D Equipment & Piping Routing, Isometrics Extraction & MTO', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'SP3D Plant Detailer & Routing Specialist', ctc: '₹6.2L – ₹12.0L PA', focus: 'Complex Pipe Rack Routing, Nozzle Orientations & Clash Checking', growth: '+36% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Piping Stress Analyst (Caesar II)', ctc: '₹8.2L – ₹15.5L PA', focus: 'Thermal Expansion, Sustained/Occasional Loads & Pipe Support Sizing', growth: '+68% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Lead Piping Engineering Coordinator', ctc: '₹11.5L – ₹20.0L PA', focus: 'P&ID Synchronization, Skid Package Design & Fabricator Audits', growth: '+95% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Principal Plant EPC Consultant', ctc: '₹16.0L – ₹28.0L+ PA', focus: 'Refinery, LNG & Petrochemical Mega-Plant Engineering Management', growth: 'Executive Tier' },
    ];
  }

  // 11. Primavera P6 / PPM
  if (query.includes('primavera') || query.includes('ppm') || query.includes('project')) {
    return [
      { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'EPC Planning & Scheduling Engineer', ctc: '₹5.0L – ₹9.5L PA', focus: 'WBS Hierarchy, Activity Sequencing & Baseline Schedule Setup', growth: 'Entry Benchmark' },
      { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Primavera P6 Project Controller', ctc: '₹6.8L – ₹13.0L PA', focus: 'Resource Loading, Cost S-Curves & Critical Path Method (CPM)', growth: '+38% Growth' },
      { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Earned Value & Delay Claims Analyst', ctc: '₹9.0L – ₹16.5L PA', focus: 'EVM Performance Indices, Time Impact Analysis (TIA) & Forensic Audits', growth: '+70% Growth' },
      { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Lead Portfolio Controls Manager', ctc: '₹12.5L – ₹21.5L PA', focus: 'Multi-Project Risk Simulation & Enterprise Milestone Governance', growth: '+98% Growth' },
      { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Corporate PPM Program Director', ctc: '₹17.5L – ₹30.0L+ PA', focus: 'Global Mega-Project Governance & Executive Board Advisory', growth: 'Executive Tier' },
    ];
  }

  // Default Fallback
  return [
    { id: '1', step: '01', level: 'Entry Milestone', experience: '0 – 2 Years', role: 'CAD Design & Modeling Engineer', ctc: '₹4.5L – ₹8.8L PA', focus: 'Detailed 2D/3D Modeling, Standard Drafting & Quality Compliance', growth: 'Entry Benchmark' },
    { id: '2', step: '02', level: 'Associate Specialist', experience: '2 – 4 Years', role: 'Senior Project Modeler', ctc: '₹5.8L – ₹11.0L PA', focus: 'Component Engineering, Specification Validation & Assembly Models', growth: '+35% Growth' },
    { id: '3', step: '03', level: 'Mid-Senior Lead', experience: '4 – 6 Years', role: 'Engineering Lead Coordinator', ctc: '₹7.5L – ₹14.0L PA', focus: 'Cross-Disciplinary Coordination, Technical Reviews & Clash Mitigation', growth: '+65% Growth' },
    { id: '4', step: '04', level: 'Senior Specialist', experience: '6 – 8 Years', role: 'Technical Project Authority', ctc: '₹10.0L – ₹18.0L PA', focus: 'Process Quality Optimization, Timeline Audits & Risk Assessment', growth: '+95% Growth' },
    { id: '5', step: '05', level: 'Executive Consultant', experience: '8+ Years', role: 'Chief Engineering Consultant', ctc: '₹15.0L – ₹26.0L+ PA', focus: 'Strategic Project Direction, Client Advisory & Enterprise Implementation', growth: 'Executive Tier' },
  ];
};

export interface HiringConglomerate {
  id: string;
  name: string;
  renderLogo: () => React.ReactNode;
}

export const HIRING_CONGLOMERATES: HiringConglomerate[] = [
  {
    id: 'tata-tech',
    name: 'Tata Technologies',
    renderLogo: () => (
      <div className="w-6 h-6 rounded-full border-[1.5px] border-[#1E4B88] flex items-center justify-center bg-blue-50/80 shadow-xs flex-shrink-0">
        <span className="text-[11px] font-black text-[#1E4B88] leading-none">T</span>
      </div>
    ),
  },
  {
    id: 'lt',
    name: 'Larsen & Toubro (L&T)',
    renderLogo: () => (
      <div className="h-6 px-1.5 rounded bg-[#003B71] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
        <span className="text-[10px] font-black tracking-tighter">L&amp;T</span>
      </div>
    ),
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    renderLogo: () => (
      <div className="w-6 h-6 rounded-md bg-[#3DCD58] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 5l8 7-8 7" />
        </svg>
      </div>
    ),
  },
  {
    id: 'cyient',
    name: 'Cyient Limited',
    renderLogo: () => (
      <div className="w-6 h-6 rounded-full bg-[#00A3E0] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      </div>
    ),
  },
  {
    id: 'meil',
    name: 'MEIL Infrastructure',
    renderLogo: () => (
      <div className="h-6 px-1.5 rounded-md bg-[#C4122F] flex items-center justify-center text-white font-black text-[9px] tracking-tight flex-shrink-0 shadow-xs">
        MEIL
      </div>
    ),
  },
  {
    id: 'boeing-airbus',
    name: 'Boeing & Airbus Tier-1',
    renderLogo: () => (
      <div className="flex items-center -space-x-1.5 flex-shrink-0">
        <div className="w-6 h-6 rounded-md bg-[#0033A0] flex items-center justify-center text-white shadow-xs z-10" title="Boeing">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93V15h-2v3.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 11v2h2v-2l5-5h2v2l-3.5 3.5H19c.62 0 1.2.09 1.76.24C20.08 15.22 16.95 18.44 13 18.93z" />
          </svg>
        </div>
        <div className="w-6 h-6 rounded-md bg-[#00205B] flex items-center justify-center text-white shadow-xs z-0" title="Airbus">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
      </div>
    ),
  },
  {
    id: 'atkins',
    name: 'AtkinsRéalis',
    renderLogo: () => (
      <div className="w-6 h-6 rounded-md bg-[#E0004D] flex items-center justify-center text-white font-black text-[10px] flex-shrink-0 shadow-xs">
        A
      </div>
    ),
  },
  {
    id: 'jacobs',
    name: 'Jacobs Engineering',
    renderLogo: () => (
      <div className="w-6 h-6 rounded-md bg-[#00529B] flex items-center justify-center text-white font-black text-[11px] flex-shrink-0 shadow-xs">
        J
      </div>
    ),
  },
  {
    id: 'alstom',
    name: 'Alstom Transport',
    renderLogo: () => (
      <div className="h-6 px-1.5 rounded-md bg-[#002B49] flex items-center justify-center text-white flex-shrink-0 shadow-xs">
        <span className="text-[10px] font-black text-[#FF003B] mr-0.5">/</span>
        <span className="text-[9px] font-black tracking-tight">AL</span>
      </div>
    ),
  },
  {
    id: 'siemens',
    name: 'Siemens Energy',
    renderLogo: () => (
      <div className="w-6 h-6 rounded-md bg-[#00646E] flex items-center justify-center text-white font-black text-[10px] flex-shrink-0 shadow-xs">
        S
      </div>
    ),
  },
];

interface CareerInfographicProps {
  course: Course;
}

export const CareerInfographic: React.FC<CareerInfographicProps> = ({ course }) => {
  const pathways = getCourseCareerPathways(course);

  return (
    <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
      
      {/* 1. ENTERPRISE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-2">
            <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>MNC Career Progression Pathway</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Engineering Career Roadmap &amp; Industry Designation Path
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Progression trajectory from trainee modeler to senior engineering consultant across leading EPC conglomerates and Fortune 500 engineering firms.
          </p>
        </div>

        {/* Executive Highlights */}
        <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/80 px-4 py-2.5 rounded-2xl flex-shrink-0 self-start lg:self-center">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Experience Span</span>
            <span className="text-xs font-black text-slate-800">0 to 8+ Years Trajectory</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase text-emerald-600 block tracking-wider">Industry Alignment</span>
            <span className="text-xs font-black text-emerald-700">100% MNC Verified</span>
          </div>
        </div>
      </div>

      {/* 2. DESKTOP SEQUENTIAL MNC CAREER PATHWAY ROADMAP */}
      <div className="hidden lg:block relative pt-4 pb-2">
        {/* Continuous Flowing Rail Line connecting all 5 steps */}
        <div className="absolute top-[38px] left-[7%] right-[7%] h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-[#EE2C3C] rounded-full z-0 opacity-80" />

        <div className="grid grid-cols-5 gap-3.5 relative z-10">
          {pathways.map((item, idx) => {
            const isLast = idx === pathways.length - 1;
            const isFirst = idx === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group flex flex-col items-center"
              >
                {/* Node Milestone Circle on the Track */}
                <div className="relative mb-4 flex items-center justify-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-xs shadow-md transition-transform group-hover:scale-110 border-2 ${
                      isLast
                        ? 'bg-[#EE2C3C] text-white border-white ring-4 ring-red-100 shadow-red-500/30'
                        : isFirst
                        ? 'bg-[#1E3A8A] text-white border-white ring-4 ring-blue-100 shadow-blue-500/30'
                        : 'bg-white text-slate-800 border-slate-300 ring-4 ring-slate-100 group-hover:border-blue-600 group-hover:text-blue-600'
                    }`}
                  >
                    {item.step}
                  </div>

                  {/* Forward progression chevron pointer */}
                  {!isLast && (
                    <div className="absolute -right-3 text-slate-300 group-hover:text-indigo-500 transition-colors pointer-events-none">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Milestone Detail Card */}
                <div className="w-full h-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs group-hover:shadow-md group-hover:border-blue-500/60 transition-all flex flex-col justify-between text-left space-y-3 relative overflow-hidden">
                  {/* Subtle Top Accent Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                      isLast
                        ? 'bg-[#EE2C3C]'
                        : isFirst
                        ? 'bg-blue-600'
                        : 'bg-slate-200 group-hover:bg-indigo-500'
                    }`}
                  />

                  {/* Stage & Experience Pill */}
                  <div className="pt-1 flex items-center justify-between gap-1.5 text-[11px]">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      {item.level}
                    </span>
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70 text-[10px]">
                      {item.experience}
                    </span>
                  </div>

                  {/* Role Designation */}
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#15304C] transition-colors leading-snug min-h-[2.5rem]">
                      {item.role}
                    </h4>
                  </div>

                  {/* Compensation Package (CTC) */}
                  <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Compensation Range
                    </span>
                    <span className="text-xs font-black text-[#15304C] block mt-0.5">
                      {item.ctc}
                    </span>
                  </div>

                  {/* Core Deliverable / Focus Area */}
                  <div className="text-[11px] text-slate-600 leading-relaxed min-h-[3rem]">
                    <span className="font-bold text-slate-800">Core Scope:</span> {item.focus}
                  </div>

                  {/* Upward Trajectory Tag */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span
                      className={`font-black ${
                        isLast ? 'text-[#EE2C3C]' : 'text-blue-600'
                      }`}
                    >
                      {item.growth}
                    </span>
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l10-10M17 7H7m10 0v10" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. MOBILE & TABLET CONNECTED ROADMAP PATHWAY (Vertical Stepper) */}
      <div className="lg:hidden relative pl-6 sm:pl-8 space-y-4 pt-2">
        {/* Left Continuous Vertical Spine Line */}
        <div className="absolute left-3 sm:left-4 top-3 bottom-6 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-[#EE2C3C] rounded-full -translate-x-1/2" />

        {pathways.map((item, idx) => {
          const isLast = idx === pathways.length - 1;
          const isFirst = idx === 0;

          return (
            <div key={item.id} className="relative group">
              {/* Milestone Circle positioned on the vertical track */}
              <div
                className={`absolute -left-6 sm:-left-8 top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-[11px] border-2 shadow-sm ${
                  isLast
                    ? 'bg-[#EE2C3C] text-white border-white'
                    : isFirst
                    ? 'bg-blue-600 text-white border-white'
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                {item.step}
              </div>

              {/* Card Container */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {item.level}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {item.experience}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                  {item.role}
                </h4>

                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation</span>
                    <span className="text-xs sm:text-sm font-black text-[#15304C]">{item.ctc}</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-600">{item.growth}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800">Core Scope:</span> {item.focus}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. HIRING CONGLOMERATES & RECRUITING PARTNERS RIBBON */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Alumni Recruited Across Fortune 500 EPC &amp; Engineering Firms:
          </span>
          <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-600">
            ✓ Direct Corporate Drives
          </span>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {HIRING_CONGLOMERATES.map((partner) => (
            <motion.div
              key={partner.id}
              whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.15 } }}
              className="flex items-center gap-2 bg-slate-50/70 hover:bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 hover:border-[#1E3A8A] hover:shadow-xs transition-all cursor-pointer group"
            >
              {partner.renderLogo()}
              <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};
