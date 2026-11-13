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
    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

    const enrollmentRecord = {
      registrationId,
      fullName: String(fullName).trim(),
      email: normalizedEmail || 'N/A',
      phone: String(phone).trim(),
      courseTitle: String(courseTitle).trim(),
      preferredBatch: preferredBatch || 'weekday-morning',
      createdAt: timestamp,
      status: 'SEAT_RESERVED',
      campus: 'AMEERPET_HYDERABAD',
    };

    let savedToMongo = false;
    let studentCourses: string[] = [courseTitle];

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('enrollments').insertOne(enrollmentRecord);
        savedToMongo = true;

        // If email is provided, assign the course strictly to THIS student in the users collection
        if (normalizedEmail && normalizedEmail !== 'n/a') {
          const user = await db.collection('users').findOne({ email: normalizedEmail });
          if (user) {
            const currentCourses = Array.isArray(user.assignedCourses) ? user.assignedCourses : (user.courseName ? [user.courseName] : []);
            if (!currentCourses.includes(courseTitle)) {
              currentCourses.push(courseTitle);
            }
            studentCourses = currentCourses;

            await db.collection('users').updateOne(
              { email: normalizedEmail },
              {
                $addToSet: { assignedCourses: courseTitle },
                $set: { updatedAt: timestamp }
              }
            );
          } else {
            // Auto-provision user account for this student so they can immediately sign in with their own course
            await db.collection('users').insertOne({
              name: String(fullName).trim(),
              fullName: String(fullName).trim(),
              email: normalizedEmail,
              phone: String(phone).trim(),
              officialMobile: String(phone).trim(),
              role: 'student',
              password: '9908',
              stream: courseTitle,
              courseName: courseTitle,
              assignedCourses: [courseTitle],
              accessStatus: 'active',
              createdAt: timestamp,
            });
          }
        }
      }
    } catch (dbErr) {
      console.warn('[Enroll API] MongoDB write notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      registrationId,
      savedToDatabase: savedToMongo,
      assignedCourses: studentCourses,
      email: normalizedEmail,
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
