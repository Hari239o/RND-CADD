'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  onSelectStream: (stream: any) => void;
  onOpenEnrollModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectStream, onOpenEnrollModal }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-xs text-slate-600">
      
      {/* Pre-Footer Action Banner with Elegant Clean Gradient */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-6xl mx-auto pt-14 pb-8">
        <div className="bg-gradient-to-br from-[#0F172A] via-[#15304C] to-[#0A192F] rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EE2C3C] animate-ping" />
              <span>Free CAD Demo Sessions Weekly</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Ready to Upgrade Your Engineering Career?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Experience our guaranteed 1:1 workstation lab in Ameerpet or attend an interactive live CAD session with certified industry faculty.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenEnrollModal}
              className="px-6 sm:px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#EE2C3C] via-[#E01829] to-[#D20A0B] hover:from-[#D20A0B] hover:to-[#B50809] shadow-lg hover:shadow-xl hover:shadow-red-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Book a Free Demo Class</span>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        
        {/* Col 1: Institute Brand & Accreditations */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="RND CADD"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            Premier CAD, CAM, CAE, and BIM training institute based in Ameerpet, Hyderabad. Empowering engineering graduates and professionals with industry-accredited design expertise.
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Authorized Training Partner
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Autodesk</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Dassault</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Bentley</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">Oracle P6</span>
            </div>
          </div>
        </div>

        {/* Col 2: Civil & BIM Programs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Civil &amp; BIM Architecture
          </h4>
          <ul className="space-y-2 text-xs text-slate-600">
            {[
              { id: 'civil', label: 'Revit Architecture & BIM Specialist' },
              { id: 'civil', label: 'AutoCAD Civil 2D & 3D Planning' },
              { id: 'civil', label: 'STAAD.Pro & ETABS Structural Design' },
              { id: 'interior', label: '3ds Max & V-Ray Visualization' },
              { id: 'interior', label: 'SketchUp Modular Interior Joinery' },
            ].map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => onSelectStream(item.id)}
                  className="hover:text-[#EE2C3C] transition-colors flex items-center gap-1.5 group text-left cursor-pointer"
                >
                  <svg className="w-3 h-3 text-slate-400 group-hover:text-[#EE2C3C] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Mechanical, Electrical & Plant CAD */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Mechanical &amp; Automation
          </h4>
          <ul className="space-y-2 text-xs text-slate-600">
            {[
              { id: 'mechanical', label: 'SOLIDWORKS Master Professional' },
              { id: 'mechanical', label: 'CATIA V5 Aerospace & Automotive' },
              { id: 'mechanical', label: 'ANSYS FEA & CFD Multiphysics' },
              { id: 'eee', label: 'AutoCAD Electrical Systems' },
              { id: 'eee', label: 'EPLAN Electric P8 Automation' },
              { id: 'piping', label: 'Piping & Plant CAD (SP3D & Caesar II)' },
              { id: 'ppm', label: 'Oracle Primavera P6 (PPM)' },
            ].map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => onSelectStream(item.id)}
                  className="hover:text-[#EE2C3C] transition-colors flex items-center gap-1.5 group text-left cursor-pointer"
                >
                  <svg className="w-3 h-3 text-slate-400 group-hover:text-[#EE2C3C] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Campus Contact & Timings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Campus Headquarters
          </h4>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#EE2C3C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>3rd Floor, Above Metro Station Pillar A1042, Ameerpet Commercial Complex, Hyderabad, Telangana 500038</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-bold text-slate-900">+91 98490 12345</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:info@rndcadd.com" className="font-medium text-[#EE2C3C] hover:underline">
                info@rndcadd.com
              </a>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Lab Hours: 7:00 AM – 9:30 PM (7 Days)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-slate-200 py-5 bg-slate-50 text-[11px] text-slate-500">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            &copy; {new Date().getFullYear()} RND CADD Training Institute. All rights reserved.
          </div>
          <div className="flex items-center space-x-5 text-slate-600">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Admission</span>
            <span>&bull;</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Verify Certificate</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
