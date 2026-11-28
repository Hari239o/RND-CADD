import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_FOLDERS = [
  {
    id: 'civil',
    name: 'Civil & Architectural Engineering',
    shortName: 'Civil & BIM',
    code: 'FOLDER 01',
    partner: 'Autodesk & Bentley Certified',
    credential: 'Executive Master Diploma',
    duration: '6 Months (120 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    logoText: 'BIM',
    description: 'Structural drafting, parametric BIM modeling, building analysis, and municipal layouts.',
    software: 'Autodesk Revit, AutoCAD 2D/3D, STAAD.Pro, ETABS, 3ds Max',
    badgeBg: 'bg-[#E0F2FE]',
    badgeText: 'text-[#0369A1]',
    accentColor: '#0284C7',
  },
  {
    id: 'mechanical',
    name: 'Mechanical & Automotive Design',
    shortName: 'Mechanical CAD/CAE',
    code: 'FOLDER 02',
    partner: 'Dassault & PTC Certified',
    credential: 'Executive CAD/CAE Diploma',
    duration: '6 Months (140 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    logoText: 'CAD',
    description: '3D parametric solid modeling, generative surface design, FEA stress analysis, and CNC machining.',
    software: 'SOLIDWORKS, CATIA V5, ANSYS, PTC Creo, Siemens NX',
    badgeBg: 'bg-[#FFEDD5]',
    badgeText: 'text-[#C2410C]',
    accentColor: '#EA580C',
  },
  {
    id: 'electrical',
    name: 'Electrical & Automation Engineering',
    shortName: 'Electrical CADD',
    code: 'FOLDER 03',
    partner: 'Siemens & EPLAN Certified',
    credential: 'Executive Electrical Diploma',
    duration: '6 Months (140 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=1200&q=80',
    logoText: 'E-CAD',
    description: 'Industrial control schematics, substation SLDs, wiring harnesses, and PLC automation.',
    software: 'AutoCAD Electrical, Revit MEP, EPLAN, ETAP, MATLAB',
    badgeBg: 'bg-[#D1FAE5]',
    badgeText: 'text-[#047857]',
    accentColor: '#059669',
  },
  {
    id: 'interior',
    name: 'Interior Architecture & Space Planning',
    shortName: 'Interior & 3D Vis',
    code: 'FOLDER 04',
    partner: 'Chaos Group & Trimble Certified',
    credential: 'Executive Interior Diploma',
    duration: '4 Months (90 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    logoText: '3D-VIS',
    description: 'Space planning, SketchUp modular joinery, 3ds Max rendering, and V-Ray raytracing.',
    software: '3ds Max, V-Ray, SketchUp Pro, Lumion, AutoCAD',
    badgeBg: 'bg-[#EDE9FE]',
    badgeText: 'text-[#6D28D9]',
    accentColor: '#8B5CF6',
  },
  {
    id: 'ppm',
    name: 'Construction & EPC Project Management (PPM)',
    shortName: 'Project Management',
    code: 'FOLDER 05',
    partner: 'Oracle & Microsoft Certified',
    credential: 'PPM Specialist Certification',
    duration: '3 Months (60 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    logoText: 'PPM',
    description: 'Primavera P6, Microsoft Project, WBS, Gantt scheduling, and EVM cost control.',
    software: 'Oracle Primavera P6, Microsoft Project, EPC Suite',
    badgeBg: 'bg-[#CCFBF1]',
    badgeText: 'text-[#0F766E]',
    accentColor: '#0D9488',
  },
  {
    id: 'piping',
    name: 'Process Plant & Piping Engineering',
    shortName: 'Piping & Plant CAD',
    code: 'FOLDER 06',
    partner: 'Hexagon & Autodesk Certified',
    credential: 'Piping Specialist Certification',
    duration: '4 Months (80 Hours)',
    badgeLabel: '360° Career Support',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
    logoText: 'PIPE',
    description: 'Piping & instrumentation (P&ID), equipment layouts, 3D pipe racks, and Caesar II flexibility.',
    software: 'SP3D, CAESAR II, AutoCAD Plant 3D, PDMS, P&ID',
    badgeBg: 'bg-[#FEE2E2]',
    badgeText: 'text-[#991B1B]',
    accentColor: '#DC2626',
  },
];

let inMemoryFolders: any[] = [...DEFAULT_FOLDERS];

// GET all folders from MongoDB
export async function GET() {
  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const collection = db.collection('folders');
      const seedCheck = await db.collection('site_content').findOne({ key: 'folders_initialized' });

      // Only auto-seed if database has never been initialized before
      if (!seedCheck) {
        const count = await collection.countDocuments();
        if (count === 0) {
          await collection.insertMany(DEFAULT_FOLDERS);
        }
        await db.collection('site_content').updateOne(
          { key: 'folders_initialized' },
          { $set: { key: 'folders_initialized', initializedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }

      const folders = await collection.find({}).toArray();
      // Clean _id for client use
      const cleaned = folders.map((f: any) => ({
        ...f,
        _id: f._id?.toString(),
      }));

      return NextResponse.json(
        { success: true, source: 'mongodb', folders: cleaned },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }
  } catch (err) {
    console.warn('[Folders API] MongoDB query error:', err);
  }

  return NextResponse.json(
    { success: true, source: 'fallback', folders: inMemoryFolders },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
  );
}

// POST create a new folder or restore defaults
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if restore action
    if (body.action === 'restore_defaults') {
      inMemoryFolders = [...DEFAULT_FOLDERS];
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('folders').deleteMany({});
        await db.collection('folders').insertMany(DEFAULT_FOLDERS);
      }
      return NextResponse.json({ success: true, folders: DEFAULT_FOLDERS, message: 'Restored default folders' });
    }

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, message: 'Folder name is required' }, { status: 400 });
    }

    const folderId =
      body.id ||
      body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');

    const newFolderObj = {
      id: folderId,
      name: body.name.trim(),
      shortName: body.shortName?.trim() || body.name.trim().split(' ')[0],
      code: body.code || `FOLDER ${String(inMemoryFolders.length + 1).padStart(2, '0')}`,
      partner: body.partner?.trim() || 'Certified Training Center',
      credential: body.credential?.trim() || 'Executive CAD/CAM Diploma',
      duration: body.duration?.trim() || '4-6 Months',
      badgeLabel: body.badgeLabel?.trim() || '360° Career Support',
      image:
        body.image?.trim() ||
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      logoText: body.logoText?.trim() || 'CAD',
      description: body.description?.trim() || 'Comprehensive industry CAD program with live labs.',
      software: body.software?.trim() || 'Industry Standard CAD Tools',
      badgeBg: body.badgeBg || 'bg-[#E0F2FE]',
      badgeText: body.badgeText || 'text-[#0369A1]',
      accentColor: body.accentColor || '#0284C7',
      createdAt: new Date().toISOString(),
    };

    inMemoryFolders = [...inMemoryFolders.filter((f) => f.id !== folderId), newFolderObj];

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('folders').updateOne(
        { id: folderId },
        { $set: newFolderObj },
        { upsert: true }
      );
    }

    return NextResponse.json(
      { success: true, folder: newFolderObj, message: `Folder "${newFolderObj.name}" created successfully` },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
  } catch (err) {
    console.error('[Folders API] POST error:', err);
    return NextResponse.json({ success: false, message: 'Failed to create folder' }, { status: 500 });
  }
}

// DELETE a folder AND its courses permanently from MongoDB
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get('id');
  const deleteAll = searchParams.get('all') === 'true';

  if (!folderId && !deleteAll) {
    return NextResponse.json({ success: false, message: 'Folder ID or all=true is required' }, { status: 400 });
  }

  try {
    const { db, isConnected } = await connectToDatabase();

    if (deleteAll) {
      inMemoryFolders = [];
      if (isConnected && db) {
        await db.collection('folders').deleteMany({});
        await db.collection('courses').deleteMany({});
        await db.collection('site_content').updateOne(
          { key: 'folders_initialized' },
          { $set: { key: 'folders_initialized', clearedAt: new Date().toISOString() } },
          { upsert: true }
        );
        await db.collection('site_content').updateOne(
          { key: 'courses_initialized' },
          { $set: { key: 'courses_initialized', clearedAt: new Date().toISOString() } },
          { upsert: true }
        );
      }
      return NextResponse.json({ success: true, message: 'All folders and their courses deleted permanently from database' });
    }

    // Delete single folder and its courses
    inMemoryFolders = inMemoryFolders.filter((f) => f.id !== folderId);

    if (isConnected && db) {
      // 1. Delete the folder from 'folders' collection
      const folderResult = await db.collection('folders').deleteMany({
        $or: [
          { id: folderId },
          { id: folderId?.toLowerCase() },
          { id: new RegExp(`^${folderId?.trim()}$`, 'i') },
        ],
      });

      // 2. Permanently delete all courses in this folder from 'courses' collection
      const coursesResult = await db.collection('courses').deleteMany({
        $or: [
          { folder: folderId },
          { folder: folderId?.toLowerCase() },
          { folder: new RegExp(`^${folderId?.trim()}$`, 'i') },
        ],
      });

      return NextResponse.json(
        {
          success: true,
          deletedFolderCount: folderResult.deletedCount,
          deletedCoursesCount: coursesResult.deletedCount,
          message: `Folder "${folderId}" and ${coursesResult.deletedCount} course(s) deleted permanently from database`,
        },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }

    return NextResponse.json({ success: true, message: `Folder "${folderId}" deleted` });
  } catch (err) {
    console.error('[Folders API] DELETE error:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete folder from database' }, { status: 500 });
  }
}
