import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, courseTitle, preferredBatch } = body;

    if (!fullName || !phone || !courseTitle) {
      return NextResponse.json(
        { error: 'Missing mandatory candidate details.' },
        { status: 400 }
      );
    }

    const timestamp = new Date();
    const registrationId = `EDU-CAD-${timestamp.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const enrollmentRecord = {
      registrationId,
      fullName,
      email: email || 'N/A',
      phone,
      courseTitle,
      preferredBatch: preferredBatch || 'weekday-morning',
      createdAt: timestamp,
      status: 'SEAT_RESERVED',
      campus: 'AMEERPET_HYDERABAD',
    };

    let savedToMongo = false;
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('enrollments').insertOne(enrollmentRecord);
        savedToMongo = true;
      }
    } catch (dbErr) {
      console.warn('[Enroll API] MongoDB write notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      registrationId,
      savedToDatabase: savedToMongo,
      message: 'Workstation seat reservation received successfully.',
      record: enrollmentRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
