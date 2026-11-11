'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const CourseraMatrix: React.FC<{ onEnrollClick: () => void }> = ({ onEnrollClick }) => {
  const matrixRows = [
    {
      feature: 'CORE SOFTWARE MASTERED',
      civil: 'Revit BIM, AutoCAD, STAAD.Pro, ETABS, 3ds Max, Primavera P6',
      mechanical: 'SOLIDWORKS, CATIA V5, ANSYS Workbench, Creo, Siemens NX, Mastercam',
      eee: 'AutoCAD Electrical, Revit MEP, EPLAN P8, MATLAB Simulink, ETAP, Altium'
    },
    {
      feature: 'CURRICULUM DURATION',
      civil: '120 - 440 Total Hours (8 to 16 Weeks)',
      mechanical: '100 - 450 Total Hours (8 to 16 Weeks)',
      eee: '80 - 400 Total Hours (8 to 14 Weeks)'
    },
    {
      feature: 'PORTFOLIO CAPSTONES',
      civil: '5-Story Commercial BIM + IS 1893 Seismic Space Frame Analysis',
      mechanical: 'Industrial Reduction Gearbox + Automotive Class-A Outer Skin + FEA Rotor',
      eee: '3-Motor MCC Panel Schematic + 132kV Substation TCC Relay Coordination'
    },
    {
      feature: 'HARDWARE WORKSTATION LAB',
      civil: 'Dedicated Intel i9 Rigs with 4K Dual Displays & Enscape GPU Acceleration',
      mechanical: 'NVIDIA RTX Workstations for Real-Time 3D Assemblies & ANSYS Solving',
      eee: 'Dual Display Electrical Workstations with EPLAN & MATLAB Toolboxes'
    },
    {
      feature: 'OFFICIAL GLOBAL CREDENTIALS',
      civil: 'Autodesk Certified Professional (ACP) + Bentley Structural Modeler',
      mechanical: 'Dassault Systèmes CSWP + Mastercam Certified Mill Programmer',
      eee: 'Autodesk AutoCAD Electrical + EPLAN Certified Engineer (ECE)'
    },
    {
      feature: 'CAREER PLACEMENT TARGETS',
      civil: 'BIM Coordinator, Structural Design Engineer, Site Planning Specialist',
      mechanical: 'Automotive BIW Modeler, Product Design Engineer, FEA/CFD Analyst',
      eee: 'Electrical Panel Designer, Substation Engineer, PCB Layout Specialist'
    },
    {
      feature: 'AVERAGE SALARY TRAJECTORY',
      civil: 'INR 4.2L - 7.5L Per Annum (Freshers to 2 Yrs)',
      mechanical: 'INR 4.5L - 8.2L Per Annum (Freshers to 2 Yrs)',
      eee: 'INR 4.4L - 7.8L Per Annum (Freshers to 2 Yrs)'
    }
  ];

  return (
    <section id="curriculum-matrix" className="py-20 bg-[#FFFFFF] border-t border-b border-[#CBD5E1]">
      <div className="cad-container">
        
        {/* Section Header - Zero Subheaders Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#CBD5E1] gap-4"
        >
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-2 tracking-wider uppercase">
              ENGINEERING CURRICULUM SPECIFICATIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] uppercase">
              MULTI-DISCIPLINARY PROGRAM COMPARISON MATRIX
            </h2>
          </div>

          <button
            onClick={onEnrollClick}
            className="px-6 py-2.5 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs font-bold uppercase tracking-wider shadow-sm transition-colors rounded-xl"
          >
            RESERVE BATCH SEAT -&gt;
          </button>
        </motion.div>

        {/* Matrix Table - Zero Icons */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-x-auto border border-[#CBD5E1] bg-[#FFFFFF] shadow-sm"
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#CBD5E1] bg-[#F1F5F9] text-xs">
                <th className="p-4 w-1/4 text-[#475569] uppercase font-bold">SPECIFICATION MATRIX</th>
                <th className="p-4 w-1/4 text-[#0284C7] border-l border-[#CBD5E1] uppercase font-bold">
                  [01] CIVIL &amp; BIM TRACK
                </th>
                <th className="p-4 w-1/4 text-[#EA580C] border-l border-[#CBD5E1] uppercase font-bold">
                  [02] MECHANICAL CAD/CAE
                </th>
                <th className="p-4 w-1/4 text-[#059669] border-l border-[#CBD5E1] uppercase font-bold">
                  [03] ELECTRICAL (EEE)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs text-[#334155]">
              {matrixRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="p-4 font-bold text-[#0F172A] bg-[#F8FAFC]">
                    {row.feature}
                  </td>
                  <td className="p-4 border-l border-[#E2E8F0] leading-relaxed">
                    {row.civil}
                  </td>
                  <td className="p-4 border-l border-[#E2E8F0] leading-relaxed">
                    {row.mechanical}
                  </td>
                  <td className="p-4 border-l border-[#E2E8F0] leading-relaxed">
                    {row.eee}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Matrix Note */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] pt-2">
          <div>* ALL LICENSES PROVIDED IN-HOUSE FOR STUDENT CAPSTONE EXECUTION</div>
          <div>CAMPUS LOCATION: AMEERPET METRO STATION PILLAR A1042</div>
        </div>

      </div>
    </section>
  );
};
