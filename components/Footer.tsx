'use client';

import React from 'react';

interface FooterProps {
  onSelectStream: (stream: any) => void;
  onOpenEnrollModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectStream, onOpenEnrollModal }) => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-[#CBD5E1] text-xs text-[#475569]">
      {/* Top Banner */}
      <div className="border-b border-[#CBD5E1] py-8 bg-[#F1F5F9]">
        <div className="cad-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[#0F172A] text-lg font-black tracking-tight uppercase">
              READY TO UPGRADE YOUR ENGINEERING CAREER?
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">
              VISIT OUR AMEERPET LAB OR ATTEND A LIVE ONLINE CAD DEMO SESSION
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenEnrollModal}
              className="px-6 py-3 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] font-bold tracking-wider uppercase transition-colors shadow-sm"
            >
              ENROLL FOR DEMO CLASS -&gt;
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Campus Information */}
      <div className="cad-container py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Institute Brand */}
        <div className="space-y-4">
          <img
            src="/logo.png"
            alt="RND CADD"
            className="h-14 sm:h-16 w-auto object-contain"
          />
          <p className="text-xs text-[#475569] leading-relaxed">
            Premier engineering CAD, CAM, CAE, and BIM training institute located in Ameerpet, Hyderabad. Equipping Civil, Mechanical, and Electrical engineers with industry-certified blueprint modeling mastery.
          </p>
          <div className="text-[11px] text-[#64748B]">
            AUTODESK &bull; DASSAULT &bull; BENTLEY AUTHORIZED TRAINING PARTNER
          </div>
        </div>

        {/* Col 2: Civil & Mechanical */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
            CIVIL &amp; BIM COURSES
          </div>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button onClick={() => onSelectStream('civil')} className="hover:text-[#D20A0B] transition-colors">
                - Revit Architecture &amp; BIM
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('civil')} className="hover:text-[#D20A0B] transition-colors">
                - AutoCAD Civil 2D/3D
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('civil')} className="hover:text-[#D20A0B] transition-colors">
                - STAAD.Pro Structural Design
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('civil')} className="hover:text-[#D20A0B] transition-colors">
                - ETABS High-Rise Modeling
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('civil')} className="hover:text-[#D20A0B] transition-colors">
                - Primavera P6 Project Management
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Mechanical & EEE */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
            MECHANICAL &amp; EEE COURSES
          </div>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button onClick={() => onSelectStream('mechanical')} className="hover:text-[#D20A0B] transition-colors">
                - SOLIDWORKS CSWA/CSWP
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('mechanical')} className="hover:text-[#D20A0B] transition-colors">
                - CATIA V5 Surface &amp; BIW
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('mechanical')} className="hover:text-[#D20A0B] transition-colors">
                - ANSYS FEA &amp; CFD Fluent
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('eee')} className="hover:text-[#D20A0B] transition-colors">
                - AutoCAD Electrical Industrial
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('eee')} className="hover:text-[#D20A0B] transition-colors">
                - EPLAN Electric P8 &amp; Pro Panel
              </button>
            </li>
            <li>
              <button onClick={() => onSelectStream('eee')} className="hover:text-[#D20A0B] transition-colors">
                - MATLAB Simulink &amp; ETAP Grid
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Campus Contact & Lab Hours */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
            CAMPUS HEADQUARTERS
          </div>
          <div className="text-[11px] text-[#475569] space-y-2 leading-relaxed">
            <div>3rd Floor, Above Metro Station Pillar A1042, Ameerpet Commercial Complex, Hyderabad, Telangana 500038</div>
            <div className="text-[#0F172A] font-bold">DIRECT: +91 98490 12345 / 040-2373XXXX</div>
            <div className="text-[#D20A0B] font-bold">INFO@RNDCADD.COM</div>
          </div>
          <div className="pt-2 text-[10px] text-[#64748B]">
            LAB HOURS: 07:00 AM TO 09:30 PM (7 DAYS)
          </div>
        </div>

      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#CBD5E1] py-6 bg-[#FFFFFF] text-[11px]">
        <div className="cad-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            (C) 2026 RND CADD - CAD TRAINING INSTITUTE. NEXT.JS LMS &bull; MONGODB &bull; CLOUDFLARE R2 ARCHITECTURE.
          </div>
          <div className="flex items-center space-x-6 text-[#64748B]">
            <span>TERMS OF ADMISSION</span>
            <span>PRIVACY POLICY</span>
            <span>VERIFY CREDENTIAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
