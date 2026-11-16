'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';

export interface CareerPathwayItem {
  id: string;
  role: string;
  ctc: string;
  status: string;
  color: 'blue' | 'orange';
  iconType: 'monitor' | 'chart' | 'hierarchy' | 'gear' | 'info';
}

export const getCourseCareerPathways = (course: Course): CareerPathwayItem[] => {
  const query = `${course.id || ''} ${course.title || ''} ${course.stream || ''} ${course.folder || ''} ${course.category || ''} ${Array.isArray(course.tools) ? course.tools.join(' ') : ''} ${typeof (course as any).software === 'string' ? (course as any).software : ''}`.toLowerCase();

  // CNC / Mastercam / Manufacturing
  if (query.includes('mastercam') || query.includes('cnc') || query.includes('cam') || query.includes('machining')) {
    return [
      { id: '1', role: 'CNC Programmer', ctc: '₹4.5L – ₹9.2L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'CAM Engineer', ctc: '₹4.5L – ₹9.2L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Machining Process Planner', ctc: '₹5.0L – ₹10.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Manufacturing Technician', ctc: '₹4.0L – ₹8.2L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Tooling & CAD/CAM Consultant', ctc: '₹4.8L – ₹11.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // SolidWorks / Creo / Mechanical
  if (query.includes('solidworks') || query.includes('creo') || query.includes('inventor') || query.includes('mechanical')) {
    return [
      { id: '1', role: 'Mechanical Design Engineer', ctc: '₹4.5L – ₹9.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Parametric 3D Modeler', ctc: '₹4.2L – ₹8.8L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Product Development Lead', ctc: '₹5.5L – ₹12.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Sheet Metal & Tooling Specialist', ctc: '₹4.5L – ₹9.0L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Mechanical CAD Consultant', ctc: '₹5.0L – ₹11.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // CATIA V5 / Surface modeling / Aerospace / Automotive
  if (query.includes('catia') || query.includes('aerospace') || query.includes('automotive') || query.includes('surfacing')) {
    return [
      { id: '1', role: 'Class-A Surface Modeler', ctc: '₹5.0L – ₹11.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Aerospace BIW Design Engineer', ctc: '₹5.5L – ₹12.5L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Automotive R&D Specialist', ctc: '₹6.0L – ₹14.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Kinematics & DMU Analyst', ctc: '₹4.8L – ₹9.8L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Senior Surfacing Consultant', ctc: '₹5.5L – ₹12.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // ANSYS / FEA / CFD
  if (query.includes('ansys') || query.includes('fea') || query.includes('cfd') || query.includes('simulation') || query.includes('multiphysics')) {
    return [
      { id: '1', role: 'FEA Structural Analyst', ctc: '₹5.2L – ₹11.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'CFD Aerodynamic Engineer', ctc: '₹5.5L – ₹12.0L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Thermal Simulation Specialist', ctc: '₹5.0L – ₹10.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'NVH & Vibration Analyst', ctc: '₹5.2L – ₹11.0L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'CAE Multiphysics Consultant', ctc: '₹6.0L – ₹13.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // Revit / BIM / Architecture
  if (query.includes('revit') || query.includes('bim') || query.includes('navisworks')) {
    return [
      { id: '1', role: 'BIM Architectural Modeler', ctc: '₹4.5L – ₹9.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Revit Family Creator & Drafter', ctc: '₹4.2L – ₹8.5L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Lead BIM Coordinator', ctc: '₹5.5L – ₹12.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Clash Resolution Specialist', ctc: '₹4.8L – ₹10.2L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Corporate BIM Consultant', ctc: '₹5.2L – ₹11.8L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // STAAD.Pro / ETABS / Structural
  if (query.includes('staad') || query.includes('etabs') || query.includes('structural')) {
    return [
      { id: '1', role: 'Structural Design Engineer', ctc: '₹4.8L – ₹10.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Seismic & Wind Load Analyst', ctc: '₹5.2L – ₹11.8L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'High-Rise RCC & Steel Specialist', ctc: '₹5.5L – ₹12.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Structural Detailer & Auditor', ctc: '₹4.5L – ₹9.5L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Senior Structural Consultant', ctc: '₹5.8L – ₹13.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // AutoCAD Civil / Survey / Municipal
  if (query.includes('autocad') || query.includes('civil') || query.includes('drafting')) {
    return [
      { id: '1', role: 'Civil 2D/3D Drafting Specialist', ctc: '₹4.0L – ₹8.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Municipal Sanction Drafter', ctc: '₹3.8L – ₹7.8L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Infrastructure Project Modeler', ctc: '₹5.0L – ₹10.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Survey & Quantity Estimator', ctc: '₹4.2L – ₹8.8L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Consulting Civil Drafter', ctc: '₹4.5L – ₹10.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // Lumion / 3ds Max / V-Ray / SketchUp / Interior
  if (query.includes('lumion') || query.includes('3ds max') || query.includes('v-ray') || query.includes('sketchup') || query.includes('interior')) {
    return [
      { id: '1', role: '3D Architectural Visualizer', ctc: '₹4.2L – ₹9.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Lighting & Walkthrough Artist', ctc: '₹4.5L – ₹9.5L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Interior Architecture Designer', ctc: '₹4.0L – ₹8.8L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Modular Joinery Modeler', ctc: '₹4.8L – ₹10.2L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: '3D Presentation Consultant', ctc: '₹5.0L – ₹12.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // Electrical / EPLAN / ETAP / Automation
  if (query.includes('eplan') || query.includes('electrical') || query.includes('automation') || query.includes('etap')) {
    return [
      { id: '1', role: 'Electrical Control Systems Engineer', ctc: '₹4.5L – ₹9.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'EPLAN Automation Specialist', ctc: '₹4.8L – ₹10.2L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Substation Power Analyst', ctc: '₹5.2L – ₹11.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'PLC Panel Design Drafter', ctc: '₹4.2L – ₹8.8L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Electrical EPC Consultant', ctc: '₹5.0L – ₹11.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // Piping / SP3D / Caesar II
  if (query.includes('piping') || query.includes('sp3d') || query.includes('plant') || query.includes('caesar')) {
    return [
      { id: '1', role: 'SP3D Piping Layout Designer', ctc: '₹4.8L – ₹10.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Process Plant Equipment Modeler', ctc: '₹5.0L – ₹11.0L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Piping Stress Analyst (Caesar II)', ctc: '₹5.5L – ₹12.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Isometric & MTO Specialist', ctc: '₹4.5L – ₹9.5L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Refinery EPC Piping Consultant', ctc: '₹5.8L – ₹13.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // Primavera P6 / PPM
  if (query.includes('primavera') || query.includes('ppm') || query.includes('project')) {
    return [
      { id: '1', role: 'EPC Planning & Scheduling Engineer', ctc: '₹5.0L – ₹11.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
      { id: '2', role: 'Primavera P6 Project Controller', ctc: '₹5.5L – ₹12.0L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
      { id: '3', role: 'Earned Value & Cost Analyst', ctc: '₹5.2L – ₹11.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
      { id: '4', role: 'Critical Path & Risk Specialist', ctc: '₹5.8L – ₹13.5L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
      { id: '5', role: 'Corporate PPM Consultant', ctc: '₹6.0L – ₹14.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
    ];
  }

  // Fallback using course defined careerRoles
  const roles = Array.isArray(course.careerRoles) && course.careerRoles.length >= 4
    ? course.careerRoles.slice(0, 5)
    : ['CAD Design Engineer', 'Product Modeler', 'Senior Project Drafter', 'Quality Audit Specialist', 'Engineering Consultant'];

  return [
    { id: '1', role: roles[0] || 'CAD Design Engineer', ctc: '₹4.5L – ₹9.2L PA', status: 'Active Hiring', color: 'blue', iconType: 'monitor' },
    { id: '2', role: roles[1] || 'Product Modeler', ctc: '₹4.2L – ₹8.8L PA', status: 'Active Hiring', color: 'orange', iconType: 'chart' },
    { id: '3', role: roles[2] || 'Senior Project Drafter', ctc: '₹5.0L – ₹10.5L PA', status: 'Active Hiring', color: 'blue', iconType: 'hierarchy' },
    { id: '4', role: roles[3] || 'Quality Audit Specialist', ctc: '₹4.0L – ₹8.2L PA', status: 'Active Hiring', color: 'orange', iconType: 'gear' },
    { id: '5', role: roles[4] || 'Engineering Consultant', ctc: '₹4.8L – ₹11.0L PA', status: 'Active Hiring', color: 'blue', iconType: 'info' },
  ];
};

interface CareerInfographicProps {
  course: Course;
}

export const CareerInfographic: React.FC<CareerInfographicProps> = ({ course }) => {
  const pathways = getCourseCareerPathways(course);

  const hiringPartners = [
    'Tata Technologies',
    'Larsen & Toubro (L&T)',
    'Schneider Electric',
    'Cyient Limited',
    'MEIL Infrastructure',
    'Boeing & Airbus Tier-1',
    'AtkinsRéalis',
    'Jacobs Engineering',
    'Alstom Transport',
  ];

  const renderIcon = (type: CareerPathwayItem['iconType']) => {
    switch (type) {
      case 'monitor':
        return (
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <path d="M7 8h10M7 11h6" strokeLinecap="round" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" />
            <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" />
            <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" />
            <path d="M4 10l6-6 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'hierarchy':
        return (
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="5" r="2.5" />
            <path d="M12 7.5v4" />
            <path d="M6 13.5h12" />
            <path d="M6 13.5v2M18 13.5v2" />
            <circle cx="6" cy="18" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
          </svg>
        );
      case 'gear':
        return (
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
            <line x1="12" y1="11" x2="12" y2="15" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-7 sm:p-8 shadow-sm space-y-6">
      {/* THE FAN / PETAL INFOGRAPHIC DIAGRAM */}
      <div className="relative">
        
        {/* Desktop / Tablet Fan Layout */}
        <div className="hidden md:block relative w-full max-w-4xl mx-auto py-4">
          
          {/* Top-Center Hub Arch */}
          <div className="w-80 mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 text-center relative z-20">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Career Opportunities<br />
              <span className="text-[#EE2C3C] font-bold">After {course.title}</span>
            </h4>
          </div>

          {/* 5 Radiating Petal Diamonds Layout in Arc */}
          <div className="relative mt-6 pt-4 pb-12">
            
            {/* Visual Arc Connector Line (Smooth Crisp Arc, No Dashed Lines) */}
            <div className="absolute top-10 left-12 right-12 h-44 border-t-2 border-slate-200 rounded-t-full pointer-events-none -z-0 opacity-80"></div>

            <div className="grid grid-cols-5 gap-3 items-start relative z-10">
              {pathways.map((item) => {
                const isBlue = item.color === 'blue';
                return (
                  <div key={item.id} className="flex flex-col items-center text-center space-y-3 group">
                    {/* Rotated Diamond Petal with Icon */}
                    <motion.div
                      whileHover={{ scale: 1.12, y: -4, transition: { duration: 0.2 } }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl rotate-45 flex items-center justify-center shadow-lg transition-transform cursor-pointer ${
                        isBlue
                          ? 'bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-blue-500/25'
                          : 'bg-gradient-to-br from-[#F97316] to-[#EA580C] shadow-orange-500/25'
                      }`}
                    >
                      <div className="-rotate-45 flex items-center justify-center">
                        {renderIcon(item.iconType)}
                      </div>
                    </motion.div>

                    {/* Curved Pointer Arrow Indicator */}
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-6 text-slate-400 group-hover:text-[#EE2C3C] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                      </svg>
                    </div>

                    {/* Role Title & Details Label */}
                    <div className="space-y-1.5">
                      <h5 className="text-sm sm:text-base font-bold text-slate-900 tracking-normal leading-snug group-hover:text-[#EE2C3C] transition-colors min-h-[2.5rem]">
                        {item.role}
                      </h5>
                      <div>
                        <span className="inline-block text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs">
                          {item.ctc}
                        </span>
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {item.status}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Mobile View: Vertical Clean Radial Cards */}
        <div className="md:hidden space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
            <h4 className="text-base font-bold text-slate-900">
              Career Opportunities<br />
              <span className="text-[#EE2C3C] text-sm">After {course.title}</span>
            </h4>
          </div>

          <div className="space-y-2.5">
            {pathways.map((item) => {
              const isBlue = item.color === 'blue';
              return (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl rotate-45 flex items-center justify-center flex-shrink-0 shadow-sm ${
                        isBlue ? 'bg-[#2563EB]' : 'bg-[#F97316]'
                      }`}
                    >
                      <div className="-rotate-45 scale-75">
                        {renderIcon(item.iconType)}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs text-slate-900 truncate">
                        {item.role}
                      </h5>
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        Starting CTC: {item.ctc}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex-shrink-0">
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* OUR HIRING CONGLOMERATES */}
      <div className="pt-3 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
          Our Hiring Conglomerates:
        </span>
        <div className="flex flex-wrap gap-2">
          {hiringPartners.map((p, idx) => (
            <span
              key={idx}
              className="text-xs sm:text-sm font-semibold text-slate-800 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#EE2C3C] hover:text-[#EE2C3C] transition-colors shadow-2xs"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
