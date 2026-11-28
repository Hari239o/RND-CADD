'use client';

import React from 'react';

interface SoftwareCompanyCard {
  companyName: string;
  productTag: string;
  logoSrc: string;
  isWordmarkOnly?: boolean;
}

const ROW_1_COMPANIES: SoftwareCompanyCard[] = [
  {
    companyName: 'Autodesk, Inc.',
    productTag: 'Revit BIM & 3ds Max',
    logoSrc: '/logos/autodesk.svg',
  },
  {
    companyName: 'Autodesk AutoCAD',
    productTag: '2D/3D CAD & Plant 3D',
    logoSrc: '/logos/autocad.svg',
  },
  {
    companyName: 'Dassault Systèmes SE',
    productTag: 'CATIA V5 & 3DEXPERIENCE',
    logoSrc: '/logos/dassault3ds.png',
  },
  {
    companyName: 'SOLIDWORKS Corp.',
    productTag: 'Dassault 3D CAD',
    logoSrc: '/logos/solidworks.png',
  },
  {
    companyName: 'Bentley Systems, Inc.',
    productTag: 'STAAD.Pro Infrastructure',
    logoSrc: '/logos/bentley.png',
  },
  {
    companyName: 'Ansys, Inc.',
    productTag: 'Ansys FEA & Simulation',
    logoSrc: '/logos/ansys.svg',
    isWordmarkOnly: true,
  },
  {
    companyName: 'Computers & Structures',
    productTag: 'CSI ETABS & SAFE',
    logoSrc: '/logos/csi.png',
  },
  {
    companyName: 'Siemens AG',
    productTag: 'Siemens NX CAD/CAM',
    logoSrc: '/logos/siemens.svg',
    isWordmarkOnly: true,
  },
  {
    companyName: 'EPLAN Software',
    productTag: 'EPLAN Electric P8',
    logoSrc: '/logos/eplan.png',
  },
  {
    companyName: 'Oracle Corporation',
    productTag: 'Oracle Primavera P6',
    logoSrc: '/logos/oracle.png',
  },
];

const ROW_2_COMPANIES: SoftwareCompanyCard[] = [
  {
    companyName: 'Chaos Software',
    productTag: 'Chaos V-Ray Rendering',
    logoSrc: '/logos/chaos.png',
  },
  {
    companyName: 'Trimble Inc.',
    productTag: 'Tekla & BIM Suite',
    logoSrc: '/logos/trimble.svg',
  },
  {
    companyName: 'SketchUp (Trimble)',
    productTag: 'SketchUp Pro 3D',
    logoSrc: '/logos/sketchup.svg',
  },
  {
    companyName: 'Hexagon AB',
    productTag: 'SmartPlant 3D & CAESAR II',
    logoSrc: '/logos/hexagon.png',
  },
  {
    companyName: 'Schneider Electric SE',
    productTag: 'ETAP & SCADA Automation',
    logoSrc: '/logos/schneider.png',
  },
  {
    companyName: 'The MathWorks, Inc.',
    productTag: 'MATLAB & Simulink',
    logoSrc: '/logos/mathworks.png',
  },
  {
    companyName: 'Microsoft Corporation',
    productTag: 'Microsoft Project EPC',
    logoSrc: '/logos/microsoft.png',
  },
  {
    companyName: 'PTC Inc.',
    productTag: 'PTC Creo Parametric',
    logoSrc: '/logos/ptc.png',
  },
  {
    companyName: 'Lumion (Act-3D)',
    productTag: '3D Arch Visualization',
    logoSrc: '/logos/lumion.png',
  },
  {
    companyName: 'Autodesk, Inc.',
    productTag: 'Navisworks Manage',
    logoSrc: '/logos/autodesk.svg',
  },
];

function CompanyLogoCard({ item }: { item: SoftwareCompanyCard }) {
  return (
    <div
      className="inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300 transition-all duration-300 flex-shrink-0 select-none min-h-[52px]"
      title={`${item.companyName} — ${item.productTag}`}
    >
      {item.isWordmarkOnly ? (
        <div className="flex items-center gap-2.5">
          <img
            src={item.logoSrc}
            alt={item.companyName}
            className="h-5 w-auto max-w-[78px] object-contain"
          />
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex flex-col leading-tight text-left">
            <span className="text-[11px] font-bold text-slate-900">{item.companyName}</span>
            <span className="text-[9px] font-medium text-slate-500">{item.productTag}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center p-1 shrink-0">
            <img
              src={item.logoSrc}
              alt={item.companyName}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight text-left">
            <span className="text-xs font-bold text-slate-900 tracking-tight">{item.companyName}</span>
            <span className="text-[9.5px] font-semibold text-slate-500">{item.productTag}</span>
          </div>
        </>
      )}
    </div>
  );
}

export const SoftwarePartnersMarquee: React.FC = () => {
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

      {/* Dual Opposing Infinite Marquees */}
      <div className="relative w-full overflow-hidden flex flex-col gap-4 py-1.5">
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none" />

        {/* ROW 1: Right to Left */}
        <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="inline-flex items-center gap-4 sm:gap-5 animate-marquee py-1">
            {ROW_1_COMPANIES.concat(ROW_1_COMPANIES).concat(ROW_1_COMPANIES).map((item, idx) => (
              <CompanyLogoCard key={`sw-row1-${item.companyName}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* ROW 2: Left to Right */}
        <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="inline-flex items-center gap-4 sm:gap-5 animate-marquee-ltr py-1">
            {ROW_2_COMPANIES.concat(ROW_2_COMPANIES).concat(ROW_2_COMPANIES).map((item, idx) => (
              <CompanyLogoCard key={`sw-row2-${item.companyName}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
