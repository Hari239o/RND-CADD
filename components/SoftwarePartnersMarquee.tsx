'use client';

import React from 'react';

interface SoftwareBrand {
  name: string;
  renderLogo: () => React.ReactNode;
}

export const SoftwarePartnersMarquee: React.FC = () => {
  // ROW 1: Flagship CAD, BIM & Structural Engineering Suites (Right-to-Left)
  const row1Brands: SoftwareBrand[] = [
    {
      name: 'Autodesk AutoCAD',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#E51937] flex items-center justify-center text-white text-[11px] font-black shadow-2xs">
            A
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-slate-900 tracking-tight">AutoCAD</span>
            <span className="text-[8px] font-bold text-[#E51937] uppercase tracking-wider">Autodesk</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Autodesk Revit BIM',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#1858A8] flex items-center justify-center text-white text-[11px] font-black shadow-2xs">
            R
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-[#1858A8] tracking-tight">Revit BIM</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Arch &amp; MEP</span>
          </div>
        </div>
      ),
    },
    {
      name: 'SOLIDWORKS',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#DA291C] flex items-center justify-center text-white text-[9px] font-black shadow-2xs">
            SW
          </div>
          <span className="text-xs font-black text-slate-900 tracking-wider uppercase">SOLIDWORKS</span>
        </div>
      ),
    },
    {
      name: 'Dassault CATIA V5',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#005386] flex items-center justify-center text-white text-[9px] font-black">
            3D
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-[#005386] tracking-tight">CATIA V5</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Dassault</span>
          </div>
        </div>
      ),
    },
    {
      name: 'Bentley STAAD.Pro',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#008542] flex items-center justify-center text-white text-[10px] font-black">
            S
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-[#008542] tracking-tight">STAAD.Pro</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Bentley</span>
          </div>
        </div>
      ),
    },
    {
      name: 'ANSYS Workbench',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#FFB71B] skew-x-[-12deg] rounded-xs" />
          <span className="text-xs font-black text-slate-900 tracking-widest uppercase">ANSYS</span>
        </div>
      ),
    },
    {
      name: 'CSI ETABS',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0F4C81] flex items-center justify-center text-white text-[9px] font-black">
            CSI
          </div>
          <span className="text-xs font-black text-[#0F4C81] tracking-wider uppercase">ETABS</span>
        </div>
      ),
    },
    {
      name: 'Siemens NX',
      renderLogo: () => (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-[#009999] tracking-widest uppercase">SIEMENS</span>
          <span className="px-1.5 py-0.5 rounded bg-[#009999]/10 text-[#006666] text-[10px] font-black">NX</span>
        </div>
      ),
    },
    {
      name: 'EPLAN Electric P8',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#C8102E] flex items-center justify-center text-white text-[10px] font-black">
            E
          </div>
          <span className="text-xs font-black text-slate-900 tracking-wider uppercase">EPLAN P8</span>
        </div>
      ),
    },
    {
      name: 'Oracle Primavera P6',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#C74634] flex items-center justify-center text-white text-[10px] font-black">
            P6
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-[#C74634] tracking-tight">Primavera P6</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Oracle EPC</span>
          </div>
        </div>
      ),
    },
  ];

  // ROW 2: 3D Visualization, Piping, Electrical & Plant Tools (Left-to-Right)
  const row2Brands: SoftwareBrand[] = [
    {
      name: 'Autodesk 3ds Max',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0696D7] flex items-center justify-center text-white text-[10px] font-black">
            3ds
          </div>
          <span className="text-xs font-black text-slate-900 tracking-tight">3ds Max</span>
        </div>
      ),
    },
    {
      name: 'Chaos V-Ray',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#0284C7] flex items-center justify-center text-white text-[10px] font-black">
            V
          </div>
          <span className="text-xs font-black text-[#0284C7] tracking-tight">Chaos V-Ray</span>
        </div>
      ),
    },
    {
      name: 'Trimble SketchUp',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#005F9E] flex items-center justify-center text-white text-[10px] font-black">
            SU
          </div>
          <span className="text-xs font-black text-[#005F9E] tracking-tight">SketchUp Pro</span>
        </div>
      ),
    },
    {
      name: 'Hexagon SP3D',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#006B6B] flex items-center justify-center text-white text-[9px] font-black">
            3D
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-black text-[#006B6B] tracking-tight">SmartPlant 3D</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Hexagon</span>
          </div>
        </div>
      ),
    },
    {
      name: 'CAESAR II Piping',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#B91C1C] flex items-center justify-center text-white text-[9px] font-black">
            C2
          </div>
          <span className="text-xs font-black text-slate-900 tracking-wider uppercase">CAESAR II</span>
        </div>
      ),
    },
    {
      name: 'AutoCAD Plant 3D',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#047857] flex items-center justify-center text-white text-[9px] font-black">
            P3D
          </div>
          <span className="text-xs font-black text-[#047857] tracking-tight">Plant 3D</span>
        </div>
      ),
    },
    {
      name: 'ETAP Electrical',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-[9px] font-black">
            ET
          </div>
          <span className="text-xs font-black text-[#1D4ED8] tracking-widest uppercase">ETAP</span>
        </div>
      ),
    },
    {
      name: 'MathWorks MATLAB',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#D97706] flex items-center justify-center text-white text-[9px] font-black">
            ML
          </div>
          <span className="text-xs font-black text-slate-900 tracking-wider uppercase">MATLAB</span>
        </div>
      ),
    },
    {
      name: 'Microsoft Project',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#217346] flex items-center justify-center text-white text-[10px] font-black">
            P
          </div>
          <span className="text-xs font-black text-[#217346] tracking-tight">MS Project</span>
        </div>
      ),
    },
    {
      name: 'Autodesk Navisworks',
      renderLogo: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#0F766E] flex items-center justify-center text-white text-[10px] font-black">
            N
          </div>
          <span className="text-xs font-black text-slate-900 tracking-tight">Navisworks</span>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full py-10 sm:py-12 bg-[#FAFCFF] border-b border-slate-200/80 overflow-hidden">
      <div className="cad-container">
        <div className="text-center mb-7">
          <span className="inline-block text-[11px] font-bold text-[#D20A0B] tracking-wider uppercase bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Authorized Industry Software Ecosystem
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2.5">
            Master 25+ Global CAD, BIM &amp; EPC Platforms
          </h3>
        </div>
      </div>

      {/* Dual Opposing Infinite Marquees with Edge Fade */}
      <div className="relative w-full overflow-hidden flex flex-col gap-4 py-1.5">
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none" />

        {/* ROW 1: Right to Left */}
        <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="inline-flex items-center gap-4 sm:gap-5 animate-marquee py-1">
            {row1Brands.concat(row1Brands).concat(row1Brands).map((item, idx) => (
              <div
                key={`sw-row1-${item.name}-${idx}`}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 transition-all duration-300 flex-shrink-0 select-none min-h-[48px]"
                title={item.name}
              >
                {item.renderLogo()}
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Left to Right */}
        <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="inline-flex items-center gap-4 sm:gap-5 animate-marquee-ltr py-1">
            {row2Brands.concat(row2Brands).concat(row2Brands).map((item, idx) => (
              <div
                key={`sw-row2-${item.name}-${idx}`}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 transition-all duration-300 flex-shrink-0 select-none min-h-[48px]"
                title={item.name}
              >
                {item.renderLogo()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
