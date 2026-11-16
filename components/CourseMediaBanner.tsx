'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Course } from '@/lib/courses-data';

interface CourseMediaBannerProps {
  course: Course;
  mainTool: string;
}

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

/**
 * High-Tech Interactive Canvas Animation
 * Real-time 60fps vector physics rendering custom discipline simulations:
 * - Civil/BIM: 3D wireframe skyscraper construction with moving crane & elevation levels
 * - 3ds Max/Interior: Perspective room wireframe with sweeping lighting beams & camera reticle
 * - Mechanical: Kinetic planetary gears with torque rotation & stress analysis mesh
 * - Electrical: Pulsing PCB circuit network with electron flow packets
 * - Piping: 3D isometric piping network with directional flow indicators
 * - PPM: Animated Gantt chart timeline with critical path milestone pulses
 */
export const DisciplineAnimationCanvas: React.FC<{ stream: string; title: string }> = ({ stream, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const s = stream.toLowerCase();
    const isCivil = s.includes('civil') || title.toLowerCase().includes('revit') || title.toLowerCase().includes('staad');
    const isInterior = s.includes('interior') || title.toLowerCase().includes('3ds max') || title.toLowerCase().includes('v-ray') || title.toLowerCase().includes('sketchup');
    const isMechanical = s.includes('mechanical') || title.toLowerCase().includes('solidworks') || title.toLowerCase().includes('catia') || title.toLowerCase().includes('ansys');
    const isElectrical = s.includes('electrical') || s.includes('eee') || title.toLowerCase().includes('eplan') || title.toLowerCase().includes('etap');
    const isPiping = s.includes('piping') || title.toLowerCase().includes('sp3d');
    const isPPM = s.includes('ppm') || title.toLowerCase().includes('primavera');

    let tick = 0;

    const render = () => {
      tick += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Blueprint Background Grid
      ctx.fillStyle = '#0F1E36';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. DISCIPLINE SPECIFIC VECTOR ANIMATION
      if (isCivil) {
        // CIVIL & BIM CONSTRUCTION ANIMATION: Rising Skyscraper & Moving Crane
        const centerX = width * 0.55;
        const baseY = height * 0.85;

        // Ground line
        ctx.strokeStyle = '#EE2C3C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, baseY);
        ctx.lineTo(width - 20, baseY);
        ctx.stroke();

        // Rising building frames
        const buildingWidth = 110;
        const maxFloors = 8;
        const currentHeight = Math.min(maxFloors, 2 + ((Math.sin(tick * 0.8) + 1) * 3));
        
        ctx.strokeStyle = '#00D2FF';
        ctx.lineWidth = 1.5;
        for (let f = 0; f < currentHeight; f++) {
          const floorY = baseY - (f * 18);
          // Floor slab
          ctx.beginPath();
          ctx.moveTo(centerX - buildingWidth / 2, floorY);
          ctx.lineTo(centerX + buildingWidth / 2, floorY);
          ctx.stroke();

          // Pillars & Cross bracing
          ctx.strokeRect(centerX - buildingWidth / 2, floorY - 18, 20, 18);
          ctx.strokeRect(centerX + buildingWidth / 2 - 20, floorY - 18, 20, 18);
          ctx.strokeRect(centerX - 15, floorY - 18, 30, 18);

          // Diagonal structural truss
          ctx.beginPath();
          ctx.moveTo(centerX - buildingWidth / 2, floorY);
          ctx.lineTo(centerX + buildingWidth / 2, floorY - 18);
          ctx.strokeStyle = 'rgba(0, 210, 255, 0.3)';
          ctx.stroke();
          ctx.strokeStyle = '#00D2FF';
        }

        // Tower Crane
        const craneX = centerX - 80;
        const craneHeight = baseY - 160;
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        // Mast
        ctx.beginPath();
        ctx.moveTo(craneX, baseY);
        ctx.lineTo(craneX, craneHeight);
        ctx.stroke();
        // Mast lattice
        for (let y = baseY; y > craneHeight; y -= 16) {
          ctx.beginPath();
          ctx.moveTo(craneX - 6, y);
          ctx.lineTo(craneX + 6, y - 8);
          ctx.stroke();
        }
        // Jib boom
        const jibAngle = Math.sin(tick * 0.5) * 0.15;
        ctx.save();
        ctx.translate(craneX, craneHeight);
        ctx.rotate(jibAngle);
        ctx.beginPath();
        ctx.moveTo(-25, 0);
        ctx.lineTo(120, 0);
        ctx.stroke();
        // Trolley & Cable
        const trolleyX = 40 + Math.sin(tick) * 30;
        ctx.fillStyle = '#EE2C3C';
        ctx.fillRect(trolleyX - 4, -2, 8, 4);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(trolleyX, 2);
        const hookY = 40 + Math.cos(tick) * 15;
        ctx.lineTo(trolleyX, hookY);
        ctx.stroke();
        // Hook load (steel I-beam)
        ctx.fillStyle = '#00D2FF';
        ctx.fillRect(trolleyX - 16, hookY, 32, 6);
        ctx.restore();

        // Technical Readout Overlay
        ctx.font = '10px monospace';
        ctx.fillStyle = '#00D2FF';
        ctx.fillText(`CIVIL BIM STRUCTURAL ENGINE: 4K WIREFRAME`, 18, 24);
        ctx.fillStyle = '#10B981';
        ctx.fillText(`● ACTIVE SIMULATION • FLOOR L${Math.floor(currentHeight)} ELEVATION +${Math.floor(currentHeight * 3.6)}m`, 18, 40);

      } else if (isInterior) {
        // 3DS MAX & INTERIOR ARCHVIZ: Perspective Room, Sweeping Light Rays & Camera Wireframe
        const vanishingX = width * 0.5;
        const vanishingY = height * 0.45;

        // Perspective wall lines
        ctx.strokeStyle = 'rgba(238, 44, 60, 0.6)';
        ctx.lineWidth = 1.5;
        // Back wall
        const backW = 140;
        const backH = 90;
        ctx.strokeRect(vanishingX - backW / 2, vanishingY - backH / 2, backW, backH);

        // Perspective rays to corners
        const corners = [
          [vanishingX - backW / 2, vanishingY - backH / 2, 0, 0],
          [vanishingX + backW / 2, vanishingY - backH / 2, width, 0],
          [vanishingX - backW / 2, vanishingY + backH / 2, 0, height],
          [vanishingX + backW / 2, vanishingY + backH / 2, width, height],
        ];
        corners.forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });

        // Volumetric Sun / Light Cone sweeping
        const sweepX = vanishingX + Math.sin(tick) * 70;
        const gradient = ctx.createRadialGradient(sweepX, vanishingY - 20, 10, sweepX, vanishingY + 60, 120);
        gradient.addColorStop(0, 'rgba(255, 230, 120, 0.35)');
        gradient.addColorStop(1, 'rgba(255, 230, 120, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(sweepX, vanishingY - 40);
        ctx.lineTo(sweepX - 80, height);
        ctx.lineTo(sweepX + 80, height);
        ctx.closePath();
        ctx.fill();

        // 3D Camera Reticle
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        const reticleX = sweepX;
        const reticleY = vanishingY + 20;
        ctx.strokeRect(reticleX - 25, reticleY - 18, 50, 36);
        ctx.beginPath();
        ctx.moveTo(reticleX - 8, reticleY);
        ctx.lineTo(reticleX + 8, reticleY);
        ctx.moveTo(reticleX, reticleY - 8);
        ctx.lineTo(reticleX, reticleY + 8);
        ctx.stroke();

        ctx.font = '10px monospace';
        ctx.fillStyle = '#F59E0B';
        ctx.fillText(`3DS MAX + V-RAY RAYTRACED GI RENDERING ENGINE`, 18, 24);
        ctx.fillStyle = '#10B981';
        ctx.fillText(`● ACTIVE FRAME PASS: 64/64 • DENOISER 4K PASS`, 18, 40);

      } else if (isMechanical) {
        // MECHANICAL CAD/CAE: Rotating Planetary Gears & Kinematic Mesh
        const centerX = width * 0.55;
        const centerY = height * 0.52;

        const drawGear = (gx: number, gy: number, radius: number, teeth: number, angle: number, color: string) => {
          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(angle);
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < teeth; i++) {
            const a = (i / teeth) * Math.PI * 2;
            const a2 = ((i + 0.4) / teeth) * Math.PI * 2;
            const a3 = ((i + 0.6) / teeth) * Math.PI * 2;
            const a4 = ((i + 1) / teeth) * Math.PI * 2;
            ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
            ctx.lineTo(Math.cos(a2) * (radius + 10), Math.sin(a2) * (radius + 10));
            ctx.lineTo(Math.cos(a3) * (radius + 10), Math.sin(a3) * (radius + 10));
            ctx.lineTo(Math.cos(a4) * radius, Math.sin(a4) * radius);
          }
          ctx.closePath();
          ctx.stroke();
          // Inner hub
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        };

        // Main Driver Gear
        drawGear(centerX - 35, centerY, 48, 14, tick * 1.5, '#00D2FF');
        // Driven Gear
        drawGear(centerX + 48, centerY - 25, 34, 10, -tick * 2.1, '#EE2C3C');

        // Coordinate axes
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(30, height - 30);
        ctx.lineTo(70, height - 30);
        ctx.moveTo(30, height - 30);
        ctx.lineTo(30, height - 70);
        ctx.stroke();

        ctx.font = '10px monospace';
        ctx.fillStyle = '#00D2FF';
        ctx.fillText(`SOLIDWORKS / CATIA 3D KINEMATICS ENGINE`, 18, 24);
        ctx.fillStyle = '#10B981';
        ctx.fillText(`● FEA MESH RUNNING • TORQUE: 1,480 Nm • 1400 RPM`, 18, 40);

      } else if (isElectrical) {
        // ELECTRICAL & AUTOMATION: Pulsing PCB Traces & Bus Logic
        ctx.strokeStyle = '#00D2FF';
        ctx.lineWidth = 2;

        const traces = [
          [[40, 60], [120, 60], [160, 100], [240, 100], [280, 60], [width - 40, 60]],
          [[40, 120], [100, 120], [140, 160], [220, 160], [260, 120], [width - 40, 120]],
          [[40, 180], [140, 180], [180, 140], [240, 140], [300, 180], [width - 40, 180]],
        ];

        traces.forEach((t) => {
          ctx.beginPath();
          ctx.moveTo(t[0][0], t[0][1]);
          for (let i = 1; i < t.length; i++) {
            ctx.lineTo(t[i][0], t[i][1]);
          }
          ctx.stroke();
        });

        // Flowing Electron Pulse Packets
        const pulsePos = (tick * 120) % (width - 80);
        ctx.fillStyle = '#10B981';
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(40 + pulsePos, 60, 5, 0, Math.PI * 2);
        ctx.arc(40 + ((pulsePos + 100) % (width - 80)), 120, 5, 0, Math.PI * 2);
        ctx.arc(40 + ((pulsePos + 200) % (width - 80)), 180, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '10px monospace';
        ctx.fillStyle = '#00D2FF';
        ctx.fillText(`EPLAN / SIEMENS AUTOMATION LOGIC RIG`, 18, 24);
        ctx.fillStyle = '#10B981';
        ctx.fillText(`● BUS FREQUENCY: 50.0 Hz • SCADA ACTIVE MONITORING`, 18, 40);

      } else {
        // PIPING & PPM & GENERIC: Dynamic Flow Grid
        const cy = height * 0.55;
        ctx.strokeStyle = '#EE2C3C';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(30, cy);
        ctx.lineTo(width - 30, cy);
        ctx.stroke();

        ctx.strokeStyle = '#00D2FF';
        ctx.lineWidth = 3;
        ctx.strokeRect(width * 0.5 - 40, cy - 30, 80, 60);

        // Fluid pulse
        const pulse = (tick * 140) % (width - 60);
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(30 + pulse, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '10px monospace';
        ctx.fillStyle = '#00D2FF';
        ctx.fillText(`SP3D / PRIMAVERA HIGH-PERFORMANCE WORKSTATION`, 18, 24);
        ctx.fillStyle = '#10B981';
        ctx.fillText(`● REAL-TIME INDUSTRIAL PROCESS SIMULATION ACTIVE`, 18, 40);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [stream, title]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

/**
 * Main Interactive Course Media Preview Component
 * Allows instant toggle between:
 * - 🎬 Live 3D Simulation Video Animation
 * - 📷 4K Photorealistic Render with multi-tier verified fallbacks
 */
export const CoursePreviewMedia: React.FC<CourseMediaBannerProps> = ({ course, mainTool }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'render'>('video');
  const [imgErrorCount, setImgErrorCount] = useState(0);
  const stream = (course.folder || course.stream || 'civil').toLowerCase();
  const images = getVerifiedCourseImages(course);

  // Active image based on error count
  const activeImageUrl = imgErrorCount === 0 ? images.primary : images.secondary;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col">
      {/* Top Header Mode Switcher Bar */}
      <div className="bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'video'
                ? 'bg-[#EE2C3C] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎬</span>
            <span>3D Live Simulation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('render')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'render'
                ? 'bg-[#EE2C3C] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📷</span>
            <span>4K Render</span>
          </button>
        </div>

        {/* Live Status Pill */}
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/70 px-2.5 py-1 rounded-md border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>RTX GPU Rig</span>
        </span>
      </div>

      {/* Main Visual Viewport */}
      <div className="relative h-56 sm:h-64 w-full bg-slate-950 overflow-hidden">
        {activeTab === 'video' ? (
          // Tab 1: Live Interactive 60fps 3D Simulation Canvas
          <div className="relative w-full h-full">
            <DisciplineAnimationCanvas stream={stream} title={course.title} />

            {/* Bottom Floating Control Watermark */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-bold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none">
              <span className="truncate text-slate-300">
                {course.title}
              </span>
              <span className="text-[#EE2C3C] font-mono flex-shrink-0 ml-2">
                60 FPS • REALTIME
              </span>
            </div>
          </div>
        ) : (
          // Tab 2: 4K Verified High-Res Image with Multiple Fallbacks
          <div className="relative w-full h-full bg-slate-950">
            {imgErrorCount < 2 ? (
              <img
                src={activeImageUrl}
                alt={course.title}
                onError={() => setImgErrorCount((prev) => prev + 1)}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              // Ultimate Fallback: High-Tech Animated Vector Canvas if all images fail
              <DisciplineAnimationCanvas stream={stream} title={course.title} />
            )}

            {/* Bottom Watermark Badge */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-bold text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="truncate text-slate-200">
                {images.tag}
              </span>
              <span className="text-emerald-400 font-mono flex-shrink-0 ml-2">
                ✓ 4K RENDER
              </span>
            </div>
          </div>
        )}

        {/* Top-Left Tool Badge */}
        <div className="absolute top-2.5 left-2.5 bg-[#15304C]/95 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/20 shadow-md pointer-events-none z-10">
          {mainTool}
        </div>
      </div>
    </div>
  );
};

/**
 * Animated Ambient Background for Hero Banner
 * Renders ambient grid, animated glow particles, and subtle technical coordinate telemetry
 */
export const CourseHeroBackground: React.FC<{ stream: string }> = ({ stream }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Radiant Glow Spheres */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#EE2C3C]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Blueprint Coordinates */}
      <div className="hidden lg:block absolute top-6 right-10 font-mono text-[9px] text-slate-400/40 tracking-widest space-y-1 text-right select-none">
        <div>X: 104.2984 • Y: 248.1092 • Z: +42.00m</div>
        <div>TOLERANCE: ±0.005mm • ACCREDITED CAD LAB</div>
      </div>
    </div>
  );
};
