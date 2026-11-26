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
let inMemoryAssignments: AssignmentItem[] = [];

async function ensureDbSeeded(db: any) {
  try {
    await db.collection('assignments').deleteMany({
      $or: [
        { id: { $in: ['asgn-init-1', 'asgn-init-2', 'asgn-init-3'] } },
        { pdfUrl: { $regex: 'dummy\\.pdf', $options: 'i' } }
      ]
    });
  } catch (err) {
    console.error('Failed to clean assignments collection:', err);
  }
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET: Fetch assignments (admin gets all, student gets filtered by enrolled courses or all if requested)
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

        const isRequestingAll =
          courseList.length === 0 ||
          courseList.some((c) => c.toLowerCase() === 'all' || c.toLowerCase() === 'all courses');

        if (!isRequestingAll) {
          const matchConditions: any[] = [
            { course: 'All Courses' },
            { course: 'all' },
            { course: { $in: ['All Courses', 'all', 'All'] } },
          ];

          courseList.forEach((c) => {
            const safe = escapeRegex(c);
            matchConditions.push({ course: new RegExp(`^${safe}$`, 'i') });
            // Flexible match for partial titles e.g. "Primavera" in "Oracle Primavera P6 Professional Enterprise"
            if (c.length > 4) {
              matchConditions.push({ course: new RegExp(safe, 'i') });
            }
          });

          query.$or = matchConditions;
        }
      }

      const assignments = await db
        .collection('assignments')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      // Sync in-memory fallback
      assignments.forEach((a: any) => {
        const { _id, ...rest } = a;
        const exists = inMemoryAssignments.some((m) => m.id === rest.id);
        if (!exists) inMemoryAssignments.push(rest);
      });

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

      const isRequestingAll =
        courseList.length === 0 ||
        courseList.some((c) => c === 'all' || c === 'all courses');

      if (!isRequestingAll) {
        results = results.filter((a) => {
          const c = (a.course || '').toLowerCase().trim();
          if (c === 'all courses' || c === 'all') return true;
          return courseList.some((target) => c === target || c.includes(target) || target.includes(c));
        });
      }
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

// PATCH / PUT: Admin updates an existing assignment
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, course, description, pdfUrl, pdfName, pdfSize, dueDate, maxScore } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Assignment ID required' }, { status: 400 });
    }

    const updateFields: any = { updatedAt: new Date().toISOString() };
    if (title !== undefined) updateFields.title = title.trim();
    if (course !== undefined) updateFields.course = course.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (pdfUrl !== undefined) updateFields.pdfUrl = pdfUrl.trim();
    if (pdfName !== undefined) updateFields.pdfName = pdfName.trim();
    if (pdfSize !== undefined) updateFields.pdfSize = pdfSize.trim();
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (maxScore !== undefined) updateFields.maxScore = Number(maxScore);

    // Update in-memory
    inMemoryAssignments = inMemoryAssignments.map((a) => (a.id === id ? { ...a, ...updateFields } : a));

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('assignments').updateOne({ id }, { $set: updateFields });
    }

    return NextResponse.json({
      success: true,
      message: 'Assignment updated successfully',
      updatedFields: updateFields,
    });
  } catch (error: any) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update assignment', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
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
