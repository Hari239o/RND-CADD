'use client';

import React, { useRef, useState, useEffect } from 'react';

export const WorkstationShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight * 1.2)));
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Motion interpolations
  const deviceY = Math.max(0, (1 - scrollProgress) * 90);
  const giantTextX = 20 - scrollProgress * 40;

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 bg-[#FFFFFF] overflow-hidden border-b border-[#CBD5E1]"
    >
      {/* Giant Background Typography Scrolling Horizontally (Signature Unlox Motion) */}
      <div
        style={{
          transform: `translate3d(${giantTextX}%, 0, 0)`,
          willChange: 'transform',
        }}
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap select-none font-black text-[#0F172A]/[0.04] text-[90px] sm:text-[140px] md:text-[180px] tracking-tight uppercase z-0 pointer-events-none"
      >
        RND CADD &bull; PREMIER CAD &amp; BIM LABS &bull; AMEERPET METRO &bull; HYDERABAD
      </div>

      <div className="cad-container relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Technical Hardware Callout */}
        <div className="w-full lg:w-5/12 text-left">
          <div className="inline-flex items-center space-x-2 border border-[#D20A0B] bg-[#FFFFFF] px-3 py-1 text-[11px] font-bold text-[#D20A0B] mb-4 shadow-sm">
            <span>[ DEDICATED CAD LAB INFRASTRUCTURE ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#15304C] tracking-tight uppercase leading-tight">
            HIGH-PERFORMANCE RTX GPU WORKSTATIONS
          </h2>
          <p className="mt-4 text-xs text-[#475569] leading-relaxed">
            Every learner receives 1:1 access to enterprise Intel Core i9 processors paired with dedicated NVIDIA RTX GPUs and dual 4K monitors, ensuring zero lag during complex Revit BIM render calculations and ANSYS FEA non-linear simulations.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div className="border border-[#CBD5E1] bg-[#F8FAFC] p-4 shadow-sm">
              <div className="text-[10px] text-[#64748B] uppercase font-bold">PROCESSING UNIT</div>
              <div className="font-bold text-[#15304C] mt-1">Intel Core i9 14900K</div>
            </div>
            <div className="border border-[#CBD5E1] bg-[#F8FAFC] p-4 shadow-sm">
              <div className="text-[10px] text-[#64748B] uppercase font-bold">GRAPHICS ACCELERATION</div>
              <div className="font-bold text-[#D20A0B] mt-1">NVIDIA RTX 4080 16GB</div>
            </div>
          </div>

          <div className="mt-8 flex items-center space-x-4">
            <a
              href="#revealed-courses"
              className="px-6 py-3 bg-[#D20A0B] hover:bg-[#B50809] text-[#FFFFFF] text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
            >
              EXPLORE CERTIFIED COURSES -&gt;
            </a>
          </div>
        </div>

        {/* Right: The High-Precision CAD Workstation Screen Display */}
        <div
          style={{
            transform: `translate3d(0, ${deviceY}px, 0)`,
            willChange: 'transform',
            transition: 'transform 0.4s ease-out',
          }}
          className="w-full lg:w-7/12 flex items-center justify-center"
        >
          <div className="relative w-full max-w-[580px] bg-[#0F172A] p-3 shadow-2xl border-2 border-[#334155]">
            {/* Hardware Bezel Header */}
            <div className="flex items-center justify-between pb-2 px-2 text-[10px] text-[#94A3B8] border-b border-[#1E293B]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-[#EF4444]"></span>
                <span className="w-2 h-2 bg-[#F59E0B]"></span>
                <span className="w-2 h-2 bg-[#10B981]"></span>
                <span className="ml-2 font-mono text-[#CBD5E1]">RND-CADD-WORKSTATION-01 // ACTIVE_VIEWPORT</span>
              </div>
              <div className="font-mono text-[#D20A0B]">144 FPS // RTX 4080</div>
            </div>

            {/* Hardware Screen Content (Simulated 3D CAD Blueprint Layout) */}
            <div className="relative h-[280px] sm:h-[320px] bg-[#000814] overflow-hidden mt-2 border border-[#1E293B]">
              {/* CAD Grid Lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(#D20A0B 1px, transparent 1px), linear-gradient(90deg, #D20A0B 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
                }}
              ></div>

              {/* Blueprint Architectural Layout Graphic */}
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80"
                alt="CAD Blueprint Simulation"
                className="w-full h-full object-cover opacity-65"
              />

              {/* CAD Wireframe HUD Overlay */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between text-[11px] font-mono text-[#38BDF8]">
                  <div>GRID: 100mm &bull; SCALE 1:50</div>
                  <div className="text-[#10B981]">PARAMETRIC LOCK: ON</div>
                </div>

                <div className="space-y-1 text-[10px] font-mono text-[#E2E8F0] bg-[#0F172A]/90 p-2 border border-[#334155] w-fit">
                  <div>X: 1420.85mm | Y: 890.12mm | Z: 450.00mm</div>
                  <div className="text-[#D20A0B] font-bold">IS 456 / BIS CODE VERIFIED</div>
                </div>
              </div>
            </div>

            {/* Workstation Base Bar */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-[#64748B] px-2 font-mono">
              <span>DISC: CIVIL / MECH / EEE</span>
              <span>AUTODESK &bull; DASSAULT &bull; BENTLEY CERTIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
