import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export interface CourseReview {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhoto?: string;
  courseName: string;
  rating: number; // 1 to 5
  review: string;
  trainerFeedback?: string;
  status: 'Verified' | 'Pending';
  createdAt: string;
}

let inMemoryReviews: CourseReview[] = [
  {
    id: 'rev-init-1',
    studentId: 'STU-001',
    studentName: 'Ram.g',
    studentEmail: 'student1@gmail.com',
    studentPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    courseName: 'Civil CADD & Master BIM',
    rating: 5,
    review:
      'The hands-on practical drafting in AutoCAD and Revit 2026 is exceptional. Er. Swamy Naidu explained BIM coordinates and multi-storey structural layout clearly. Workstations with NVIDIA Quadro rigs made 3D rendering smooth without any lag.',
    trainerFeedback: 'Excellent teaching and doubt resolution',
    status: 'Verified',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const course = searchParams.get('course');

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const query: Record<string, any> = {};
      if (email) {
        query.studentEmail = email.toLowerCase().trim();
      }
      if (course && course !== 'all') {
        query.courseName = course;
      }

      const dbReviews = await db
        .collection('reviews')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      const formatted: CourseReview[] = dbReviews.map((r) => ({
        id: r._id.toString(),
        studentId: r.studentId || 'STU-001',
        studentName: r.studentName || 'Student',
        studentEmail: r.studentEmail || '',
        studentPhoto: r.studentPhoto || '',
        courseName: r.courseName || 'Civil CADD & Master BIM',
        rating: Number(r.rating) || 5,
        review: r.review || '',
        trainerFeedback: r.trainerFeedback || '',
        status: r.status || 'Verified',
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));

      return NextResponse.json({ success: true, reviews: formatted });
    }

    // Fallback if DB is disconnected
    let filtered = [...inMemoryReviews];
    if (email) {
      filtered = filtered.filter((r) => r.studentEmail.toLowerCase() === email.toLowerCase());
    }
    if (course && course !== 'all') {
      filtered = filtered.filter((r) => r.courseName === course);
    }
    return NextResponse.json({ success: true, reviews: filtered });
  } catch (error: any) {
    console.error('[Reviews GET Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentEmail,
      studentPhoto,
      courseName,
      rating,
      review,
      trainerFeedback,
    } = body;

    if (!courseName || !review || !review.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please select a course and provide your review comments.' },
        { status: 400 }
      );
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const now = new Date();

    const reviewDoc = {
      studentId: studentId || 'STU-001',
      studentName: studentName || 'Student',
      studentEmail: (studentEmail || 'student1@gmail.com').toLowerCase().trim(),
      studentPhoto: studentPhoto || '',
      courseName: courseName.trim(),
      rating: numericRating,
      review: review.trim(),
      trainerFeedback: (trainerFeedback || '').trim(),
      status: 'Verified',
      createdAt: now,
    };

    const { db, isConnected } = await connectToDatabase();
    let insertedId = 'rev-' + Date.now();

    if (isConnected && db) {
      const result = await db.collection('reviews').insertOne(reviewDoc);
      insertedId = result.insertedId.toString();
    }

    const createdReview: CourseReview = {
      id: insertedId,
      ...reviewDoc,
      createdAt: now.toISOString(),
      status: 'Verified',
    };

    // Update in-memory fallback
    inMemoryReviews.unshift(createdReview);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your course & trainer review has been recorded and submitted to Administration.',
      review: createdReview,
    });
  } catch (error: any) {
    console.error('[Reviews POST Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing review id' }, { status: 400 });
    }

    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      try {
        await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
      } catch {
        await db.collection('reviews').deleteOne({ id });
      }
    }

    inMemoryReviews = inMemoryReviews.filter((r) => r.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (error: any) {
    console.error('[Reviews DELETE Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
