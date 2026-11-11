import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export interface StudentCertificate {
  id: string;
  certId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  course: string;
  track?: string;
  grade: string;
  issueDate: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: 'pdf' | 'image' | 'template';
  isVerified: boolean;
  issuer: string;
  notes?: string;
  createdAt: string;
}

// In-memory fallback cache
let inMemoryCertificates: StudentCertificate[] = [
  {
    id: 'cert-init-1',
    certId: 'RND-AUTODESK-849201',
    studentId: 'STU-001',
    studentName: 'Student 1',
    studentEmail: 'student1@gmail.com',
    course: 'Civil CADD & Master BIM',
    track: 'Autodesk Revit & Civil BIM Specialist',
    grade: 'Grade A+ (Distinction)',
    issueDate: 'November 06, 2026',
    fileUrl: '/sample-certificate.pdf',
    fileName: 'Autodesk-Civil-BIM-STU-001.pdf',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    isVerified: true,
    issuer: 'Er. Swamy Naidu (Academic Director)',
    notes: 'Official verified PDF certificate uploaded for student.',
    createdAt: new Date().toISOString(),
  },
];

// GET: Fetch certificates (optionally filtered by studentId or email)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const email = searchParams.get('email');

  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const collection = db.collection('certificates');
      const count = await collection.countDocuments();
      if (count === 0 && inMemoryCertificates.length > 0) {
        await collection.insertMany(inMemoryCertificates);
      }

      let query: any = {};
      if (studentId && email) {
        query = {
          $or: [
            { studentId: studentId },
            { studentEmail: { $regex: new RegExp(`^${email}$`, 'i') } },
          ],
        };
      } else if (studentId) {
        query = { studentId };
      } else if (email) {
        query = { studentEmail: { $regex: new RegExp(`^${email}$`, 'i') } };
      }

      const results = await collection.find(query).sort({ createdAt: -1 }).toArray();
      const certificates: StudentCertificate[] = results.map((doc: any) => ({
        id: doc.id || doc._id?.toString() || `cert-${Date.now()}`,
        certId: doc.certId || `RND-${Math.floor(100000 + Math.random() * 900000)}`,
        studentId: doc.studentId || '',
        studentName: doc.studentName || 'Student',
        studentEmail: doc.studentEmail || '',
        course: doc.course || 'CAD Engineering Track',
        track: doc.track || doc.course || 'Authorized CAD Specialist',
        grade: doc.grade || 'Grade A+ (Distinction)',
        issueDate: doc.issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        fileUrl: doc.fileUrl || '/sample-certificate.pdf',
        fileName: doc.fileName || 'Official-Certificate.pdf',
        fileSize: doc.fileSize || '1.4 MB',
        fileType: 'pdf',
        isVerified: doc.isVerified ?? true,
        issuer: doc.issuer || 'Er. Swamy Naidu (Academic Director)',
        notes: doc.notes || '',
        createdAt: doc.createdAt || new Date().toISOString(),
      }));

      return NextResponse.json({
        success: true,
        source: 'mongodb',
        certificates,
      });
    }
  } catch (err) {
    console.warn('[Certificates API] MongoDB query notice, serving local memory cache:', err);
  }

  // Standalone fallback
  let filtered = [...inMemoryCertificates];
  if (studentId || email) {
    filtered = filtered.filter(
      (c) =>
        (studentId && c.studentId === studentId) ||
        (email && c.studentEmail.toLowerCase() === email.toLowerCase())
    );
  }

  return NextResponse.json({
    success: true,
    source: 'fallback',
    certificates: filtered,
  });
}

// POST: Issue and upload a certificate for a student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName,
      studentEmail,
      course,
      track,
      grade,
      certId,
      issueDate,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      notes,
    } = body;

    if (!studentId || !studentName) {
      return NextResponse.json(
        { success: false, message: 'Student ID and Student Name are required to issue a certificate.' },
        { status: 400 }
      );
    }

    const generatedId = `RND-AUTODESK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCertificate: StudentCertificate = {
      id: body.id || `cert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      certId: certId || generatedId,
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      studentEmail: (studentEmail || '').trim(),
      course: (course || 'Autodesk Revit & Civil BIM Specialist').trim(),
      track: (track || course || 'Autodesk & Dassault Verified Track').trim(),
      grade: grade || 'Grade A+ (Distinction)',
      issueDate: issueDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      fileUrl: (fileUrl || '/sample-certificate.pdf').trim(),
      fileName: (fileName || 'Student-Certificate.pdf').trim(),
      fileSize: (fileSize || 'PDF Document').trim(),
      fileType: 'pdf',
      isVerified: true,
      issuer: 'Er. Swamy Naidu (Academic Director)',
      notes: (notes || '').trim(),
      createdAt: new Date().toISOString(),
    };

    // Update in-memory fallback
    inMemoryCertificates = [newCertificate, ...inMemoryCertificates];

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        // Insert into certificates collection
        await db.collection('certificates').insertOne(newCertificate);

        // Also push into student's user profile if exists
        await db.collection('users').updateOne(
          {
            $or: [
              { studentId: newCertificate.studentId },
              { email: newCertificate.studentEmail },
            ],
          },
          {
            $push: { certificates: newCertificate } as any,
          }
        );
      }
    } catch (dbErr) {
      console.warn('[Certificates API] Notice persisting to DB:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Certificate issued successfully for ${newCertificate.studentName}.`,
      certificate: newCertificate,
    });
  } catch (error: any) {
    console.error('[Certificates API] POST error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to issue certificate' },
      { status: 500 }
    );
  }
}

// DELETE: Revoke / delete a certificate
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Certificate ID is required for deletion.' },
      { status: 400 }
    );
  }

  inMemoryCertificates = inMemoryCertificates.filter((c) => c.id !== id && c.certId !== id);

  try {
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      await db.collection('certificates').deleteOne({
        $or: [{ id }, { certId: id }],
      });

      await db.collection('users').updateMany(
        {},
        {
          $pull: { certificates: { $or: [{ id }, { certId: id }] } } as any,
        }
      );
    }
  } catch (dbErr) {
    console.warn('[Certificates API] Notice deleting from DB:', dbErr);
  }

  return NextResponse.json({
    success: true,
    message: 'Certificate removed successfully.',
  });
}
