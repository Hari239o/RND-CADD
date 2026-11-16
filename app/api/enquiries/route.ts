import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, courseCategory, courseTitle, state, center } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and Phone Number are required to submit an enquiry.' },
        { status: 400 }
      );
    }

    const timestamp = new Date();
    const enquiryId = `ENQ-${timestamp.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const enquiryRecord = {
      enquiryId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      courseCategory: courseCategory || 'General Engineering CAD',
      courseTitle: courseTitle || 'All Programs / General Consultation',
      state: state || 'Telangana',
      center: center || 'Ameerpet (Hyderabad Headquarters)',
      source: 'WEBSITE_ENQUIRY_POPUP',
      status: 'NEW_LEAD',
      createdAt: timestamp,
      notes: 'Requested urgent counselor callback & syllabus consultation.',
    };

    let savedToMongo = false;

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('enquiries').insertOne(enquiryRecord);
        savedToMongo = true;
      }
    } catch (dbErr) {
      console.warn('[Enquiries API] MongoDB write fallback notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      enquiryId,
      savedToDatabase: savedToMongo,
      message: 'Enquiry received successfully. Our academic counselor will call you within 15 minutes.',
      record: enquiryRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const enquiries = await db
        .collection('enquiries')
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();

      return NextResponse.json({ success: true, count: enquiries.length, enquiries });
    }

    return NextResponse.json({
      success: true,
      count: 0,
      enquiries: [],
      notice: 'Database running in local fallback mode.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
