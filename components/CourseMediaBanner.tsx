'use client';

import React, { useState } from 'react';
import type { Course } from '@/lib/courses-data';

// Curated, verified high-resolution imagery with multiple fallbacks for every discipline & software
export const getVerifiedCourseImages = (c: Course): { primary: string; secondary: string; tag: string } => {
  const query = `${c.id || ''} ${c.title || ''} ${c.stream || ''} ${c.folder || ''} ${c.category || ''} ${Array.isArray(c.tools) ? c.tools.join(' ') : ''} ${typeof (c as any).software === 'string' ? (c as any).software : ''}`.toLowerCase();

  // 1. 3ds Max & V-Ray / Architectural Visualization / Lumion / Walkthroughs
  if (query.includes('3ds max') || query.includes('v-ray') || query.includes('vray') || query.includes('lumion') || query.includes('enscape') || query.includes('architectural visualization') || query.includes('rendering')) {
    return {
      primary: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      tag: 'Chaos V-Ray 6 Photorealistic Engine',
    };
  }

  // 2. Revit Architecture & BIM Specialist / Navisworks
  if (query.includes('revit') || query.includes('bim') || query.includes('navisworks')) {
    return {
      primary: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      tag: 'Autodesk Revit BIM 2026',
    };
  }

  // 3. STAAD.Pro / ETABS / High-Rise Structural Design
  if (query.includes('staad') || query.includes('etabs') || query.includes('structural') || query.includes('seismic')) {
    return {
      primary: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      tag: 'Bentley STAAD.Pro Structural Lab',
    };
  }

  // 4. AutoCAD Civil 2D & 3D Planning / Survey
  if (query.includes('autocad') && (query.includes('civil') || query.includes('drafting') || query.includes('2d'))) {
    return {
      primary: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      tag: 'AutoCAD Civil 2D/3D Workstation',
    };
  }

  // 5. SOLIDWORKS / Creo / Machine Design
  if (query.includes('solidworks') || query.includes('creo') || query.includes('inventor') || query.includes('mechanical cad')) {
    return {
      primary: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      tag: 'Dassault SOLIDWORKS Professional',
    };
  }

  // 6. CATIA V5 Aerospace & Automotive Surfacing / BIW
  if (query.includes('catia') || query.includes('aerospace') || query.includes('automotive') || query.includes('surfacing')) {
    return {
      primary: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
      tag: 'CATIA V5 Aerospace Lab',
    };
  }

  // 7. ANSYS FEA & CFD Multiphysics Simulation
  if (query.includes('ansys') || query.includes('fea') || query.includes('cfd') || query.includes('fluent') || query.includes('simulation') || query.includes('multiphysics')) {
    return {
      primary: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
      tag: 'ANSYS Multiphysics GPU Solver',
    };
  }

  // 8. Mastercam / CNC / CAM Machining
  if (query.includes('mastercam') || query.includes('cnc') || query.includes('cam') || query.includes('machining')) {
    return {
      primary: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
      tag: '5-Axis CNC Mastercam Station',
    };
  }

  // 9. Electrical CAD / EPLAN / Industrial Automation / PLC
  if (query.includes('eplan') || query.includes('electrical') || query.includes('automation') || query.includes('plc') || query.includes('scada')) {
    return {
      primary: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1200&q=80',
      tag: 'EPLAN Automation & Switchboard Lab',
    };
  }

  // 10. ETAP Power Systems & Substation Grid
  if (query.includes('etap') || query.includes('substation') || query.includes('power system') || query.includes('grid')) {
    return {
      primary: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
      tag: 'ETAP High-Voltage Substation Suite',
    };
  }

  // 11. Piping & Plant CAD / SP3D / Caesar II
  if (query.includes('piping') || query.includes('sp3d') || query.includes('plant') || query.includes('caesar') || query.includes('pipeline')) {
    return {
      primary: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      tag: 'Hexagon SP3D Plant Layout Rig',
    };
  }

  // 12. Primavera P6 / PPM / Project Management
  if (query.includes('primavera') || query.includes('ppm') || query.includes('project management') || query.includes('schedule')) {
    return {
      primary: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      tag: 'Oracle Primavera P6 Project Center',
    };
  }

  // 13. Interior Architecture / SketchUp / Joinery
  if (query.includes('sketchup') || query.includes('interior') || query.includes('joinery')) {
    return {
      primary: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      secondary: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      tag: 'Trimble SketchUp Interior Studio',
    };
  }

  // Default Civil Architecture Fallback
  return {
    primary: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    secondary: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80',
    tag: 'RND CADD Professional Workstation',
  };
};

export interface DisciplineHeroMedia {
  videoUrl: string;
  fallbackBg: string;
  label: string;
}

export const getDisciplineHeroMedia = (stream: string, title: string): DisciplineHeroMedia => {
  const query = `${stream} ${title}`.toLowerCase();

  // Interior / 3ds Max / V-Ray / Architectural Visualization
  if (query.includes('3ds max') || query.includes('v-ray') || query.includes('vray') || query.includes('lumion') || query.includes('interior') || query.includes('visualization')) {
    return {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-living-room-interior-design-42636-large.mp4',
      fallbackBg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      label: 'Architectural Visualization & Interior 3D Studio',
    };
  }

  // Civil & Construction BIM / Revit / STAAD.Pro / AutoCAD Civil
  if (query.includes('civil') || query.includes('revit') || query.includes('staad') || query.includes('bim') || query.includes('construction') || query.includes('etabs')) {
    return {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-under-construction-building-with-a-crane-42778-large.mp4',
      fallbackBg: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1920&q=80',
      label: 'Civil Engineering & Construction BIM Lab',
    };
  }

  // Mechanical / CATIA / SOLIDWORKS / ANSYS / Automotive
  if (query.includes('mechanical') || query.includes('catia') || query.includes('solidworks') || query.includes('ansys') || query.includes('aerospace') || query.includes('automotive') || query.includes('creo')) {
    return {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-working-in-a-factory-42998-large.mp4',
      fallbackBg: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1920&q=80',
      label: 'Mechanical CAD, CAE & Robotics Engineering Suite',
    };
  }

  // Electrical / EPLAN / PLC / ETAP
  if (query.includes('electrical') || query.includes('eee') || query.includes('eplan') || query.includes('automation') || query.includes('plc') || query.includes('etap')) {
    return {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-with-lights-flashing-40488-large.mp4',
      fallbackBg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1920&q=80',
      label: 'Electrical Power Grid & Automation Control Lab',
    };
  }

  // Piping & Plant Design / SP3D
  if (query.includes('piping') || query.includes('sp3d') || query.includes('plant') || query.includes('caesar')) {
    return {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-oil-rig-in-the-sea-at-sunset-42881-large.mp4',
      fallbackBg: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=80',
      label: 'Process Piping & Industrial Plant Design Lab',
    };
  }

  // PPM / Primavera P6
  if (query.includes('ppm') || query.includes('primavera') || query.includes('project')) {
    return {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-busy-city-traffic-at-night-time-lapse-42618-large.mp4',
      fallbackBg: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80',
      label: 'Project Planning & Enterprise PPM Center',
    };
  }

  // Default Civil
  return {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-under-construction-building-with-a-crane-42778-large.mp4',
    fallbackBg: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
    label: 'Accredited Engineering CAD Institute',
  };
};

/**
 * Animated Background for the Hero Section (matching Image 2)
 * Includes real-life discipline video loops (civil construction, mechanical robotics, electrical circuit, etc.)
 * with high-definition fallback and deep blueprint overlay
 */
export const CourseHeroBackground: React.FC<{ stream: string; title: string }> = ({ stream, title }) => {
  const media = getDisciplineHeroMedia(stream, title);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Base Fallback High-Res Image with Slow Motion Ambient Drift */}
      <img
        src={media.fallbackBg}
        alt={media.label}
        className="absolute inset-0 w-full h-full object-cover scale-105 opacity-40 transition-transform duration-10000"
      />

      {/* 2. Looping Real Video Background for Civil Construction, Mechanical Robotics, etc. */}
      {!videoError && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-35' : 'opacity-0'
          }`}
        >
          <source src={media.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* 3. Deep Cinematic Gradients to keep all text, badges, and breadcrumbs in Image 2 crystal-clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#081524]/95 via-[#0C1D30]/85 to-[#081524]/90"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#06101C]/60 via-transparent to-[#081524]"></div>

      {/* 4. Technical Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      ></div>

      {/* 5. Subtle Radiant Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] bg-[#EE2C3C]/12 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
