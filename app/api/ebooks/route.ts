import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export interface EbookItem {
  id: string;
  title: string;
  course: string;
  pdfUrl: string;
  pdfName: string;
  pdfSize?: string;
  pages?: string | number;
  description?: string;
  coverImage?: string;
  accessType: 'free' | 'locked';
  targetAudience: 'all' | 'course' | 'particular';
  targetCourse?: string;
  allowedStudentIds?: string[];
  allowedEmails?: string[];
  createdAt: string;
  updatedAt?: string;
  isUnlocked?: boolean;
}

// In-memory fallback cache
let inMemoryEbooks: EbookItem[] = [
  {
    id: 'ebook-init-1',
    title: 'AutoCAD 2026 Complete Civil Drafting & Detailing Handbook',
    course: 'Civil CADD & Master BIM',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'AutoCAD-2026-Civil-Drafting-Handbook.pdf',
    pdfSize: '14.2 MB',
    pages: '340 Pages',
    description: 'Comprehensive guide covering 2D floor plans, elevation detailing, layer standards, dynamic blocks, and municipal drawing submission.',
    accessType: 'free',
    targetAudience: 'all',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ebook-init-2',
    title: 'Autodesk Revit Architecture & Parametric BIM Standards Manual',
    course: 'Civil CADD & Master BIM',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'Autodesk-Revit-BIM-Standard-Manual.pdf',
    pdfSize: '22.8 MB',
    pages: '480 Pages',
    description: 'Industrial reference manual for parametric family editor, multi-trade clash detection, automated schedules, and Navisworks coordination.',
    accessType: 'locked',
    targetAudience: 'course',
    targetCourse: 'Civil CADD & Master BIM',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ebook-init-3',
    title: 'SolidWorks Mechanical Design & CSWA/CSWP Mastery Workbook',
    course: 'Mechanical CAD/CAM/CAE Diploma',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'SolidWorks-Mechanical-CSWP-Workbook.pdf',
    pdfSize: '18.6 MB',
    pages: '290 Pages',
    description: 'Part modeling, sheetmetal stamping, welded structures, mold design, and drafting standards for CSWA/CSWP examination.',
    accessType: 'locked',
    targetAudience: 'course',
    targetCourse: 'Mechanical CAD/CAM/CAE Diploma',
    createdAt: new Date().toISOString(),
  },
];

// Helper to determine if an ebook is unlocked for a student
function computeUnlockedStatus(
  ebook: EbookItem,
  studentId?: string | null,
  studentEmail?: string | null,
  enrolledCourses: string[] = []
): boolean {
  // Free ebooks are accessible and unlocked for ALL students
  if (ebook.accessType === 'free') {
    return true;
  }

  // Paid/Locked ebooks are locked for all students unless specifically granted access by admin
  if (studentId && Array.isArray(ebook.allowedStudentIds) && ebook.allowedStudentIds.includes(studentId)) {
    return true;
  }
  if (
    studentEmail &&
    Array.isArray(ebook.allowedEmails) &&
    ebook.allowedEmails.some((e) => e.toLowerCase() === studentEmail.toLowerCase())
  ) {
    return true;
  }

  return false;
}

// GET: Retrieve ebooks (admin or student-filtered)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const email = searchParams.get('email');
  const courseParam = searchParams.get('course');
  const coursesParam = searchParams.get('courses');

  let enrolledCourses: string[] = [];
  if (coursesParam) {
    try {
      enrolledCourses = coursesParam.split(',').map((c) => decodeURIComponent(c.trim())).filter(Boolean);
    } catch {
      enrolledCourses = [];
    }
  }
  if (courseParam && !enrolledCourses.includes(courseParam)) {
    enrolledCourses.push(courseParam);
  }

  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const collection = db.collection('ebooks');
      const count = await collection.countDocuments();
      if (count === 0 && inMemoryEbooks.length > 0) {
        await collection.insertMany(inMemoryEbooks);
      }

      if ((studentId || email) && enrolledCourses.length === 0) {
        try {
          const usersCollection = db.collection('users');
          const query: any = {};
          if (email) query.email = { $regex: new RegExp(`^${email}$`, 'i') };
          else if (studentId) query.studentId = studentId;

          const userDoc = await usersCollection.findOne(query);
          if (userDoc) {
            if (Array.isArray(userDoc.assignedCourses)) {
              enrolledCourses.push(...userDoc.assignedCourses);
            }
            if (userDoc.courseName && !enrolledCourses.includes(userDoc.courseName)) {
              enrolledCourses.push(userDoc.courseName);
            }
          }
        } catch (e) {
          console.warn('[Ebooks API] Could not auto-fetch student assignedCourses:', e);
        }
      }

      const results = await collection.find({}).sort({ createdAt: -1 }).toArray();
      const allEbooks: EbookItem[] = results.map((doc: any) => ({
        id: doc.id || doc._id?.toString() || `ebook-${Date.now()}`,
        title: doc.title || 'CAD Reference Manual',
        course: doc.course || 'Civil CADD & Master BIM',
        pdfUrl: doc.pdfUrl || '',
        pdfName: doc.pdfName || 'Reference-Manual.pdf',
        pdfSize: doc.pdfSize || 'Document',
        pages: doc.pages || '100+ Pages',
        description: doc.description || '',
        coverImage: doc.coverImage || '',
        accessType: (doc.accessType as 'free' | 'locked') || 'free',
        targetAudience: (doc.targetAudience as 'all' | 'course' | 'particular') || 'all',
        targetCourse: doc.targetCourse || doc.course || '',
        allowedStudentIds: Array.isArray(doc.allowedStudentIds) ? doc.allowedStudentIds : [],
        allowedEmails: Array.isArray(doc.allowedEmails) ? doc.allowedEmails : [],
        createdAt: doc.createdAt || new Date().toISOString(),
        updatedAt: doc.updatedAt,
      }));

      if (!studentId && !email) {
        return NextResponse.json({
          success: true,
          source: 'mongodb',
          ebooks: allEbooks.map((b) => ({ ...b, isUnlocked: true })),
        });
      }

      const filteredForStudent = allEbooks
        .filter((b) => {
          if (b.targetAudience === 'all') return true;
          if (b.targetAudience === 'course') return true;
          if (b.targetAudience === 'particular') {
            const hasId = studentId && b.allowedStudentIds?.includes(studentId);
            const hasEmail = email && b.allowedEmails?.some((e) => e.toLowerCase() === email.toLowerCase());
            return Boolean(hasId || hasEmail);
          }
          return true;
        })
        .map((b) => ({
          ...b,
          isUnlocked: computeUnlockedStatus(b, studentId, email, enrolledCourses),
        }));

      return NextResponse.json({
        success: true,
        source: 'mongodb',
        ebooks: filteredForStudent,
      });
    }
  } catch (err) {
    console.warn('[Ebooks API] MongoDB query notice, serving local memory cache:', err);
  }

  if (!studentId && !email) {
    return NextResponse.json({
      success: true,
      source: 'memory',
      ebooks: inMemoryEbooks.map((b) => ({ ...b, isUnlocked: true })),
    });
  }

  const filtered = inMemoryEbooks
    .filter((b) => {
      if (b.targetAudience === 'all') return true;
      if (b.targetAudience === 'course') return true;
      if (b.targetAudience === 'particular') {
        const hasId = studentId && b.allowedStudentIds?.includes(studentId);
        const hasEmail = email && b.allowedEmails?.some((e) => e.toLowerCase() === email.toLowerCase());
        return Boolean(hasId || hasEmail);
      }
      return true;
    })
    .map((b) => ({
      ...b,
      isUnlocked: computeUnlockedStatus(b, studentId, email, enrolledCourses),
    }));

  return NextResponse.json({
    success: true,
    source: 'memory',
    ebooks: filtered,
  });
}

// POST: Add new ebook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      course,
      pdfUrl,
      pdfName,
      pdfSize,
      pages,
      description,
      coverImage,
      accessType = 'free',
      targetAudience = 'all',
      targetCourse,
      allowedStudentIds = [],
      allowedEmails = [],
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, message: 'E-Book Title is required' }, { status: 400 });
    }
    if (!pdfUrl || !pdfUrl.trim()) {
      return NextResponse.json({ success: false, message: 'PDF File or URL is required' }, { status: 400 });
    }

    const newEbook: EbookItem = {
      id: `ebook-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      course: course?.trim() || 'Civil CADD & Master BIM',
      pdfUrl: pdfUrl.trim(),
      pdfName: pdfName?.trim() || `${title.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`,
      pdfSize: pdfSize?.trim() || 'PDF Document',
      pages: pages ? String(pages).trim() : '120 Pages',
      description: description?.trim() || 'Official CAD Engineering Reference Manual & Technical Handbook.',
      coverImage: coverImage?.trim() || '',
      accessType: accessType === 'locked' ? 'locked' : 'free',
      targetAudience: targetAudience || 'all',
      targetCourse: (targetCourse || course || 'Civil CADD & Master BIM').trim(),
      allowedStudentIds: Array.isArray(allowedStudentIds) ? allowedStudentIds : [],
      allowedEmails: Array.isArray(allowedEmails) ? allowedEmails : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryEbooks.unshift(newEbook);

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('ebooks');
        await collection.insertOne(newEbook);
      }
    } catch (dbErr) {
      console.warn('[Ebooks API] MongoDB insert notice, saved to local cache:', dbErr);
    }

    return NextResponse.json({
      success: true,
      ebook: newEbook,
      message: 'E-Book published successfully and synced to students.',
    });
  } catch (error: any) {
    console.error('[Ebooks API] POST error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create ebook' },
      { status: 500 }
    );
  }
}

// PUT: Update ebook (toggle locked/free, change audience, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'E-Book ID is required' }, { status: 400 });
    }

    updates.updatedAt = new Date().toISOString();

    const idx = inMemoryEbooks.findIndex((b) => b.id === id);
    if (idx !== -1) {
      inMemoryEbooks[idx] = { ...inMemoryEbooks[idx], ...updates };
    }

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const collection = db.collection('ebooks');
        await collection.updateOne({ id }, { $set: updates });
      }
    } catch (dbErr) {
      console.warn('[Ebooks API] MongoDB update notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'E-Book updated successfully',
      ebook: idx !== -1 ? inMemoryEbooks[idx] : { id, ...updates },
    });
  } catch (error: any) {
    console.error('[Ebooks API] PUT error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update ebook' },
      { status: 500 }
    );
  }
}

// DELETE: Remove ebook
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, message: 'E-Book ID is required' }, { status: 400 });
  }

  inMemoryEbooks = inMemoryEbooks.filter((b) => b.id !== id);

  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const collection = db.collection('ebooks');
      await collection.deleteOne({ id });
    }
  } catch (dbErr) {
    console.warn('[Ebooks API] MongoDB delete notice:', dbErr);
  }

  return NextResponse.json({
    success: true,
    message: 'E-Book deleted successfully',
  });
}
