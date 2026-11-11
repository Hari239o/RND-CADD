'use client';

import React from 'react';
import { STREAMS } from '@/lib/courses-data';

interface StreamCardsProps {
  activeStream: 'all' | 'civil' | 'mechanical' | 'eee';
  onSelectStream: (stream: 'all' | 'civil' | 'mechanical' | 'eee') => void;
}

export const StreamCards: React.FC<StreamCardsProps> = ({
  activeStream,
  onSelectStream,
}) => {
  return (
    <section id="disciplines" className="py-20 bg-[#F1F5F9] border-t border-b border-[#CBD5E1]">
      <div className="cad-container">
        {/* Section Header - Zero Subheaders Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#CBD5E1] gap-4">
          <div>
            <div className="text-xs font-bold text-[#D20A0B] mb-2 tracking-wider">
              ENGINEERING DISCIPLINES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0F172A] uppercase">
              SELECT YOUR CAD DOMAIN
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectStream('all')}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors ${
                activeStream === 'all'
                  ? 'bg-[#D20A0B] text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#475569] border border-[#CBD5E1] hover:text-[#0F172A] shadow-sm'
              }`}
            >
              SHOW ALL (18 COURSES)
            </button>
          </div>
        </div>

        {/* 3 Domain Cards with Real Domain Imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {STREAMS.map((stream) => {
            const isSelected = activeStream === stream.id;

            return (
              <div
                key={stream.id}
                onClick={() => onSelectStream(stream.id as 'civil' | 'mechanical' | 'eee')}
                className={`cursor-pointer transition-all duration-200 border flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[#D20A0B] bg-[#FFFFFF] ring-2 ring-[#D20A0B]'
                    : 'border-[#CBD5E1] bg-[#FFFFFF] hover:border-[#D20A0B]'
                }`}
              >
                {/* Image Section with Course Representation */}
                <div className="relative h-56 w-full overflow-hidden bg-[#CBD5E1]">
                  <img
                    src={stream.image}
                    alt={stream.fullName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Solid Overlay Badge */}
                  <div className="absolute top-4 left-4 bg-[#FFFFFF] border border-[#CBD5E1] px-3 py-1 text-[11px] font-bold text-[#D20A0B] shadow-sm">
                    {stream.code}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#FFFFFF] border border-[#CBD5E1] px-3 py-1 text-[11px] text-[#0F172A] font-bold shadow-sm">
                    {stream.statCount}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] tracking-tight group-hover:text-[#D20A0B] transition-colors">
                      {stream.fullName}
                    </h3>
                    <p className="mt-3 text-xs text-[#475569] leading-relaxed">
                      {stream.description}
                    </p>

                    {/* Software Stack Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {stream.leadSoftware.map((software) => (
                        <span
                          key={software}
                          className="text-[10px] uppercase px-2 py-1 bg-[#F8FAFC] border border-[#CBD5E1] text-[#334155] font-semibold"
                        >
                          {software}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">
                      {isSelected ? '[ACTIVE DOMAIN]' : '[CLICK TO FILTER]'}
                    </span>
                    <span
                      className={`text-xs font-bold tracking-wider ${
                        isSelected ? 'text-[#D20A0B]' : 'text-[#0F172A] group-hover:text-[#D20A0B]'
                      }`}
                    >
                      {isSelected ? 'SHOWING COURSES v' : 'VIEW COURSES -&gt;'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
