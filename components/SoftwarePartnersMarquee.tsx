'use client';

import React from 'react';

interface SoftwareCompanyCard {
  companyName: string;
  logoSrc: string;
  isFullWordmark: boolean;
  maxLogoHeightClass?: string;
}

const ROW_1_COMPANIES: SoftwareCompanyCard[] = [
  {
    companyName: 'Autodesk, Inc.',
    logoSrc: '/logos/autodesk-official.svg',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-6 sm:h-7',
  },
  {
    companyName: 'Autodesk AutoCAD',
    logoSrc: '/logos/autocad-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-7 sm:h-8',
  },
  {
    companyName: 'Autodesk Revit',
    logoSrc: '/logos/revit-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-7 sm:h-8',
  },
  {
    companyName: 'Dassault Systèmes SE',
    logoSrc: '/logos/dassault-official.svg',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-7 sm:h-8',
  },
  {
    companyName: 'SOLIDWORKS (Dassault Systèmes)',
    logoSrc: '/logos/solidworks-official.svg',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-6 sm:h-7',
  },
  {
    companyName: 'Bentley Systems, Inc.',
    logoSrc: '/logos/bentley-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-6 sm:h-7',
  },
  {
    companyName: 'Ansys, Inc.',
    logoSrc: '/logos/ansys-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-6 sm:h-7',
  },
  {
    companyName: 'Siemens AG',
    logoSrc: '/logos/siemens-official.svg',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-5 sm:h-6',
  },
  {
    companyName: 'Oracle Corporation',
    logoSrc: '/logos/oracle-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-5 sm:h-6',
  },
];

const ROW_2_COMPANIES: SoftwareCompanyCard[] = [
  {
    companyName: 'Hexagon AB',
    logoSrc: '/logos/hexagon-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-7 sm:h-8',
  },
  {
    companyName: 'Trimble Inc.',
    logoSrc: '/logos/trimble-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-6 sm:h-7',
  },
  {
    companyName: 'SketchUp (Trimble Inc.)',
    logoSrc: '/logos/sketchup-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-6 sm:h-7',
  },
  {
    companyName: 'PTC Inc.',
    logoSrc: '/logos/ptc-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-7 sm:h-8',
  },
  {
    companyName: 'Microsoft Corporation',
    logoSrc: '/logos/microsoft-full.png',
    isFullWordmark: true,
    maxLogoHeightClass: 'h-6 sm:h-7',
  },
  {
    companyName: 'The MathWorks (MATLAB)',
    logoSrc: '/logos/mathworks-full.png',
    isFullWordmark: false,
  },
  {
    companyName: 'Chaos (V-Ray)',
    logoSrc: '/logos/chaos-full.png',
    isFullWordmark: false,
  },
  {
    companyName: 'EPLAN Software',
    logoSrc: '/logos/eplan.png',
    isFullWordmark: false,
  },
  {
    companyName: 'CSI (ETABS)',
    logoSrc: '/logos/csi.png',
    isFullWordmark: false,
  },
  {
    companyName: 'Schneider Electric',
    logoSrc: '/logos/schneider.png',
    isFullWordmark: false,
  },
  {
    companyName: 'Lumion (Act-3D)',
    logoSrc: '/logos/lumion.png',
    isFullWordmark: false,
  },
];

function CompanyLogoCard({ item }: { item: SoftwareCompanyCard }) {
  return (
    <div
      className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06)] hover:shadow-md hover:border-slate-300 transition-all duration-300 flex-shrink-0 select-none min-h-[62px] sm:min-h-[68px]"
      title={item.companyName}
    >
      {item.isFullWordmark ? (
        <img
          src={item.logoSrc}
          alt={item.companyName}
          className={`${item.maxLogoHeightClass || 'h-7'} w-auto max-w-[165px] object-contain`}
        />
      ) : (
        <div className="flex items-center gap-3">
          <img
            src={item.logoSrc}
            alt={item.companyName}
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain rounded-md shrink-0"
          />
          <span className="text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
            {item.companyName}
          </span>
        </div>
      )}
    </div>
  );
}

export const SoftwarePartnersMarquee: React.FC = () => {
  return (
    <section className="w-full py-16 sm:py-24 my-4 sm:my-6 bg-[#FAFCFF] border-y border-slate-200/80 overflow-hidden">
      <div className="cad-container">
        <div className="text-center mb-10 sm:mb-14 space-y-3">
          <span className="inline-block text-[11px] font-bold text-[#D20A0B] tracking-wider uppercase bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100">
            Authorized Industry Software Ecosystem
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Master 25+ Global CAD, BIM &amp; EPC Platforms
          </h3>
        </div>
      </div>

      {/* Dual Opposing Infinite Marquees with Generous Spacing */}
      <div className="relative w-full overflow-hidden flex flex-col gap-6 sm:gap-7 py-2">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-[#FAFCFF] via-[#FAFCFF]/90 to-transparent z-10 pointer-events-none" />

        {/* ROW 1: Right to Left */}
        <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="inline-flex items-center gap-6 sm:gap-8 animate-marquee py-1.5">
            {ROW_1_COMPANIES.concat(ROW_1_COMPANIES).concat(ROW_1_COMPANIES).map((item, idx) => (
              <CompanyLogoCard key={`sw-row1-${item.companyName}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* ROW 2: Left to Right */}
        <div className="relative w-full overflow-hidden whitespace-nowrap flex items-center">
          <div className="inline-flex items-center gap-6 sm:gap-8 animate-marquee-ltr py-1.5">
            {ROW_2_COMPANIES.concat(ROW_2_COMPANIES).concat(ROW_2_COMPANIES).map((item, idx) => (
              <CompanyLogoCard key={`sw-row2-${item.companyName}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
