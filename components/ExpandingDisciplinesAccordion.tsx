'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';
import { COURSES } from '@/lib/courses-data';

interface ExpandingDisciplinesAccordionProps {
  activeStream: string;
  onSelectStream: (stream: string) => void;
  onOpenCourseModal?: (course: Course) => void;
}

interface DisciplineCard {
  id: string;
  num: string;
  partner: string;
  partnerBadge: string;
  title: string;
  shortTitle: string;
  stream: 'mechanical' | 'civil' | 'eee';
  targetCourseId: string;
  badge: string;
  credential: string;
  duration: string;
  description: string;
  points: string[];
  image: string;
}

export const ExpandingDisciplinesAccordion: React.FC<ExpandingDisciplinesAccordionProps> = ({
  activeStream,
  onSelectStream,
  onOpenCourseModal,
}) => {
  const [activeCardId, setActiveCardId] = useState<string>('card-01');

  const disciplines: DisciplineCard[] = [
    {
      id: 'card-01',
      num: '01',
      partner: 'Autodesk & Dassault Systèmes',
      partnerBadge: 'CAD',
      title: 'Mechanical CADD & Product Design',
      shortTitle: 'Mechanical CADD',
      stream: 'mechanical',
      targetCourseId: 'mech-solidworks-prof',
      badge: '360° Career Support & Placement',
      credential: 'Master Diploma',
      duration: '3 Months (180 Hrs)',
      description:
        'Construct high-precision mechanical assemblies, parametric CAD models, GD&T manufacturing blueprints, and finite element stress simulations.',
      points: [
        'SolidWorks & CATIA V5 Parametric Modeling',
        'GD&T, Sheet Metal & Manufacturing Blueprints',
        'Dedicated RTX GPU Workstation Simulation Lab',
      ],
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'card-02',
      num: '02',
      partner: 'Bentley Systems & CSI Structural',
      partnerBadge: 'CIVIL',
      title: 'Civil CADD & Structural Engineering',
      shortTitle: 'Civil CADD',
      stream: 'civil',
      targetCourseId: 'civil-autocad-adv',
      badge: 'High Industry Demand Track',
      credential: 'Professional Diploma',
      duration: '3 Months (160 Hrs)',
      description:
        'Design high-rise concrete frameworks, structural RCC detailing blueprints, and seismic-resistant analysis models adhering strictly to IS 456 & Eurocodes.',
      points: [
        'AutoCAD 2D/3D & Bentley STAAD.Pro V8i',
        'ETABS Multi-Storey Structural Detailing',
        'Foundation Reinforcement & Quantity Takeoff',
      ],
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'card-03',
      num: '03',
      partner: 'Autodesk Revit & BIM Institute',
      partnerBadge: 'BIM',
      title: 'Building Information Modelling (BIM)',
      shortTitle: 'BIM Architecture',
      stream: 'civil',
      targetCourseId: 'civil-revit-bim',
      badge: '#1 Rated BIM Industry Program',
      credential: 'BIM Specialist Diploma',
      duration: '4 Months (200 Hrs)',
      description:
        'Coordinate multidisciplinary architectural, structural, and MEP Revit models with automated clash detection, 4D construction scheduling, and digital twin delivery.',
      points: [
        'Autodesk Revit Architecture, Structure & MEP',
        'Navisworks Manage Clash Detection & Timeliner',
        'Dynamo Parametric BIM & ISO 19650 Standards',
      ],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'card-04',
      num: '04',
      partner: 'AutoCAD Electrical & EPLAN Certified',
      partnerBadge: 'ELEC',
      title: 'Electrical CADD & Control Automation',
      shortTitle: 'Electrical CADD',
      stream: 'eee',
      targetCourseId: 'eee-autocad-elec',
      badge: '100% Practical Lab Training',
      credential: 'Industrial Certificate',
      duration: '2.5 Months (140 Hrs)',
      description:
        'Draft single-line diagrams (SLD), industrial control panel layouts, schematic wiring diagrams, PLC interconnections, and substation automation switchgear.',
      points: [
        'AutoCAD Electrical & EPLAN Pro Panel Design',
        'PLC Schematics, IO Racks & Terminal Layouts',
        'IEC 60617 & IEEE Standard Blueprint Compliance',
      ],
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'card-05',
      num: '05',
      partner: 'Chaos Group & Autodesk 3ds Max',
      partnerBadge: '3DS',
      title: 'Interior Design & 3D Visualisation',
      shortTitle: 'Interior Design',
      stream: 'civil',
      targetCourseId: 'civil-3dsmax-vray',
      badge: 'Dedicated RTX GPU Studio',
      credential: 'Master Certificate',
      duration: '3 Months (150 Hrs)',
      description:
        'Create photorealistic architectural renders, bespoke spatial layouts, photometric lighting, material texturing, and immersive real-time 3D walkthroughs.',
      points: [
        '3ds Max & V-Ray Next Photorealistic Rendering',
        'Space Planning, Ergonomics & Custom Furniture',
        'Real-time Cinematic Unreal Engine 5 Walkthroughs',
      ],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const handleAction = (card: DisciplineCard) => {
    onSelectStream(card.stream);
    if (onOpenCourseModal) {
      const course = COURSES.find((c) => c.id === card.targetCourseId) || COURSES[0];
      onOpenCourseModal(course);
    } else {
      const el = document.getElementById('revealed-courses');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="disciplines-accordion" className="py-16 sm:py-20 bg-[#F9FAFB] border-t border-b border-[#E2E8F0] overflow-hidden">
      {/* Full width container utilizing left and right spaces completely */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-[1850px] mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold text-[#EE2C3C] tracking-wider uppercase">
              Core Engineering Disciplines
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mt-1">
              Select Your Engineering Domain
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed">
            Hover or click any discipline to view accredited blueprints, dedicated GPU workstation setups, and global career certifications.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ACCORDION EXPANDING CARDS WITH UPGRAD THEME (Smooth Flex Transition)     */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch min-h-[520px] w-full">
          {disciplines.map((card) => {
            const isExpanded = activeCardId === card.id;

            return (
              <div
                key={card.id}
                onClick={() => setActiveCardId(card.id)}
                onMouseEnter={() => setActiveCardId(card.id)}
                style={{
                  transition: 'flex 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer select-none ${
                  isExpanded
                    ? 'flex-[3.5] xl:flex-[4] bg-white border-2 border-[#EE2C3C] shadow-2xl p-6 sm:p-8 cursor-default'
                    : 'flex-1 min-w-[70px] lg:min-w-[105px] xl:min-w-[120px] bg-white border border-slate-200/90 shadow-sm hover:border-[#EE2C3C]/60 hover:shadow-lg p-3 sm:p-4 hover:-translate-y-1'
                }`}
              >
                {isExpanded ? (
                  /* ================= EXPANDED VIEW (upGrad Theme) ================= */
                  <div className="w-full h-full flex flex-col lg:flex-row justify-between items-stretch gap-6 animate-fadeIn">
                    {/* Left Column: Details, upGrad Badges, Specs, Red View Program Button */}
                    <div className="flex-1 flex flex-col justify-between h-full z-10 w-full min-w-0">
                      <div>
                        {/* Top Accreditation & Number Tag */}
                        <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
                          <span className="text-xs font-black text-[#EE2C3C] bg-[#FFF1F2] px-2.5 py-1 rounded-md border border-[#FECDD3]">
                            {card.num}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wide truncate">
                            <svg className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="truncate">{card.partner}</span>
                          </div>
                        </div>

                        {/* Main Title */}
                        <h3 className="text-2xl sm:text-3xl xl:text-4xl font-black text-slate-900 tracking-tight mb-3 leading-tight">
                          {card.title}
                        </h3>

                        {/* Light Cyan Pill Tag (Exact upGrad Image 2 style) */}
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00838F] bg-[#E6F7F8] px-3 py-1.5 rounded-full mb-4 w-fit shadow-xs">
                          <svg className="w-3.5 h-3.5 text-[#00838F] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{card.badge}</span>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 max-w-lg">
                          {card.description}
                        </p>

                        {/* Checklist Feature Badges */}
                        <div className="flex flex-col gap-2 mb-6">
                          {card.points.map((pt, i) => (
                            <div
                              key={i}
                              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-50/80 text-xs font-semibold text-slate-700 w-fit"
                            >
                              <span className="w-4 h-4 rounded-full bg-[#FFF1F2] text-[#EE2C3C] border border-[#FECDD3] flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                ✓
                              </span>
                              <span className="truncate">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Specs & Red View Program Button (upGrad Image 2 Theme) */}
                      <div>
                        {/* Specs Row: Diploma & Duration */}
                        <div className="flex items-center gap-5 pt-3 border-t border-slate-100 text-xs text-slate-600 mb-5 font-medium">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
                            </svg>
                            <span>{card.credential}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{card.duration}</span>
                          </div>
                        </div>

                        {/* Red Pill Button (Image 2 View Program style) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(card);
                          }}
                          className="py-3 px-8 rounded-full bg-[#EE2C3C] hover:bg-[#D20A0B] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                        >
                          <span>View Program</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: High Quality CAD Photo with Overlapping Partner Monogram Badge */}
                    <div className="flex-1 w-full relative rounded-2xl overflow-hidden min-h-[220px] lg:min-h-[340px] bg-slate-100 shadow-md group/img">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Dark gradient for badge contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Floating Circular Partner Monogram Badge (Exact Image 2 style) */}
                      <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center p-1 text-xs font-black text-slate-900 tracking-wider">
                        {card.partnerBadge}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= COLLAPSED VIEW ================= */
                  <div className="w-full h-full flex flex-col justify-between items-center py-4">
                    {/* Top Number */}
                    <div className="text-xs font-bold text-slate-400 bg-slate-100 group-hover:bg-[#FFF1F2] group-hover:text-[#EE2C3C] px-2.5 py-1 rounded-md transition-colors">
                      {card.num}
                    </div>

                    {/* Center Thumbnail with Overlapping Badge */}
                    <div className="my-auto py-3 flex flex-col items-center">
                      <div className="relative w-14 h-24 sm:w-16 sm:h-32 rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Small badge overlapping */}
                        <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white shadow border border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-900">
                          {card.partnerBadge.slice(0, 3)}
                        </div>
                      </div>
                      {/* Red Accent Indicator */}
                      <div className="w-6 h-1 bg-[#EE2C3C] rounded-full mt-3 group-hover:w-10 transition-all duration-300" />
                    </div>

                    {/* Bottom Short Title */}
                    <div className="text-xs font-bold text-slate-800 text-center tracking-tight group-hover:text-[#EE2C3C] transition-colors leading-tight px-1">
                      {card.shortTitle}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
