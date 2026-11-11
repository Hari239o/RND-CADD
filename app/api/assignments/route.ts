import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export interface AssignmentItem {
  id: string;
  title: string;
  course: string;
  description: string;
  pdfUrl: string;
  pdfName: string;
  pdfSize?: string;
  dueDate: string;
  maxScore?: number;
  createdAt: string;
  updatedAt?: string;
}

// In-memory fallback cache
let inMemoryAssignments: AssignmentItem[] = [
  {
    id: 'asgn-init-1',
    title: 'AutoCAD 2D Working Plan & Sectional Elevation Assignment',
    course: 'Civil CADD & Master BIM',
    description:
      'Draft complete 2BHK municipal approval floor plan with wall thickness 230mm/115mm, door/window schedules, dimension styles according to NBC 2026, and staircase sectional elevation at 1:100 scale.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'AutoCAD-2D-Working-Plan-Assignment.pdf',
    pdfSize: '2.4 MB',
    dueDate: '2026-11-25',
    maxScore: 100,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'asgn-init-2',
    title: 'Autodesk Revit 2026 Multi-Story Residential BIM Project',
    course: 'Civil CADD & Master BIM',
    description:
      'Construct parametric G+3 residential building model with curtain walling, structural column grid, topographical contours, schedule quantities, and export Navisworks clash report.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'Revit-MultiStory-BIM-Project-Spec.pdf',
    pdfSize: '4.8 MB',
    dueDate: '2026-11-30',
    maxScore: 100,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'asgn-init-3',
    title: 'SolidWorks CSWP Parametric Flange Coupling Assembly',
    course: 'Mechanical CAD/CAM/CAE Diploma',
    description:
      'Model protected type flexible flange coupling components (shaft, key, hex bolts, hub) with GD&T tolerances, interference detection analysis, and generate complete 2D production drawing with BOM.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfName: 'SolidWorks-Flange-Coupling-Task.pdf',
    pdfSize: '3.1 MB',
    dueDate: '2026-11-28',
    maxScore: 100,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

async function ensureDbSeeded(db: any) {
  try {
    const count = await db.collection('assignments').countDocuments();
    if (count === 0) {
      await db.collection('assignments').insertMany(inMemoryAssignments);
    }
  } catch (err) {
    console.error('Failed to seed assignments collection:', err);
  }
}

// GET: Fetch assignments (admin gets all, student gets filtered by enrolled courses)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coursesParam = searchParams.get('courses');
  const singleCourse = searchParams.get('course');
  const id = searchParams.get('id');

  try {
    const { db, isConnected } = await connectToDatabase();

    if (isConnected && db) {
      await ensureDbSeeded(db);

      const query: any = {};
      if (id) {
        query.id = id;
      } else if (coursesParam || singleCourse) {
        const courseList: string[] = [];
        if (singleCourse) courseList.push(singleCourse.trim());
        if (coursesParam) {
          coursesParam.split(',').forEach((c) => {
            const trimmed = c.trim();
            if (trimmed && !courseList.includes(trimmed)) courseList.push(trimmed);
          });
        }

        // Match if course matches or assignment is for 'All Courses'
        query.$or = [
          { course: 'All Courses' },
          { course: { $in: courseList.map((c) => new RegExp(`^${c}$`, 'i')) } },
        ];
      }

      const assignments = await db
        .collection('assignments')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return NextResponse.json({
        success: true,
        assignments: assignments.map((a: any) => {
          const { _id, ...rest } = a;
          return rest;
        }),
      });
    }

    // Fallback in-memory
    let results = [...inMemoryAssignments];
    if (id) {
      results = results.filter((a) => a.id === id);
    } else if (coursesParam || singleCourse) {
      const courseList: string[] = [];
      if (singleCourse) courseList.push(singleCourse.trim().toLowerCase());
      if (coursesParam) {
        coursesParam.split(',').forEach((c) => {
          const t = c.trim().toLowerCase();
          if (t && !courseList.includes(t)) courseList.push(t);
        });
      }

      results = results.filter((a) => {
        const c = (a.course || '').toLowerCase();
        return c === 'all courses' || courseList.includes(c);
      });
    }

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      assignments: results,
    });
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assignments', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Admin uploads a new assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, course, description, pdfUrl, pdfName, pdfSize, dueDate, maxScore } = body;

    if (!title || !course || !pdfUrl) {
      return NextResponse.json(
        { success: false, message: 'Assignment Title, Target Course, and PDF Document are required' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAssignment: AssignmentItem = {
      id: `asgn-${Date.now()}-${randomSuffix}`,
      title: title.trim(),
      course: course.trim(),
      description: description ? description.trim() : '',
      pdfUrl: pdfUrl.trim(),
      pdfName: pdfName ? pdfName.trim() : `${title.trim().replace(/\s+/g, '-')}.pdf`,
      pdfSize: pdfSize ? pdfSize.trim() : '2.5 MB',
      dueDate: dueDate || new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      maxScore: Number(maxScore) || 100,
      createdAt: now,
      updatedAt: now,
    };

    // Save in memory
    inMemoryAssignments.unshift(newAssignment);

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('assignments').insertOne({ ...newAssignment });
    }

    return NextResponse.json({
      success: true,
      assignment: newAssignment,
      message: `Assignment successfully published and assigned to students of "${course}".`,
    });
  } catch (error: any) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create assignment', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Admin removes an assignment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Assignment ID required' }, { status: 400 });
    }

    inMemoryAssignments = inMemoryAssignments.filter((a) => a.id !== id);

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('assignments').deleteOne({ id });
    }

    return NextResponse.json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete assignment', error: error.message },
      { status: 500 }
    );
  }
}
