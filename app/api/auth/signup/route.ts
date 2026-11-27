import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      mobile,
      stream = 'Civil & BIM',
      role = 'student',
      password,
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Full name, email address, and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    // Strictly no default course access for new account registration until student formally enrolls
    const studentAssignedCourses: string[] = [];

    // System reserved default accounts check
    const reservedAccounts = [
      'student1@gmail.com',
      'student2@gmail.com',
      'student3@gmail.com',
      'harikishorereddy9908@gmail.com',
      'harikishorereddy9908@gmial.com',
      'admin@rndcadd.com',
      'admin@gmail.com',
    ];

    if (reservedAccounts.includes(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          alreadyExists: true,
          code: 'ACCOUNT_ALREADY_EXISTS',
          message: 'An account with this email address already exists. Please log in to your account.',
          redirectUrl: `/signin?email=${encodeURIComponent(normalizedEmail)}`,
          email: normalizedEmail,
        },
        { status: 409 }
      );
    }

    // 1. Fetch & Check Live MongoDB Database (Strict Verification)
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      // Look for existing user with identical or case-insensitive email
      const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const existingUser = await db.collection('users').findOne({
        $or: [
          { email: normalizedEmail },
          { email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } },
        ],
      });

      if (existingUser) {
        const isGoogleAccount = existingUser.source === 'google_oauth';
        return NextResponse.json(
          {
            success: false,
            alreadyExists: true,
            code: 'ACCOUNT_ALREADY_EXISTS',
            message: isGoogleAccount
              ? 'An account with this email is already registered using Google Sign-In. Please sign in with Google.'
              : 'An account with this email address already exists. Please log in to your account.',
            redirectUrl: `/signin?email=${encodeURIComponent(normalizedEmail)}`,
            email: normalizedEmail,
            source: existingUser.source || 'direct',
          },
          { status: 409 }
        );
      }

      // Check if mobile number already exists (if provided)
      if (mobile && String(mobile).trim()) {
        const cleanMobile = String(mobile).trim();
        const existingMobile = await db.collection('users').findOne({
          $or: [
            { mobile: cleanMobile },
            { officialMobile: cleanMobile },
            { phone: cleanMobile },
          ],
        });
        if (existingMobile) {
          return NextResponse.json(
            {
              success: false,
              alreadyExists: true,
              code: 'MOBILE_ALREADY_EXISTS',
              message: 'An account with this mobile number already exists. Please log in or use another number.',
              redirectUrl: `/signin`,
            },
            { status: 409 }
          );
        }
      }

      const newUser = {
        fullName: String(fullName).trim(),
        name: String(fullName).trim(),
        email: normalizedEmail,
        mobile: mobile ? String(mobile).trim() : '',
        officialMobile: mobile ? String(mobile).trim() : '',
        phone: mobile ? String(mobile).trim() : '',
        stream: stream ? String(stream).trim() : '',
        courseName: '', // Empty until officially enrolled in a course
        role: 'student', // Public registrations are strictly student accounts (prevents privilege escalation)
        password, // user password
        createdAt: new Date(),
        status: 'active',
        accessStatus: 'pending_enrollment',
        assignedCourses: [], // Strictly empty upon registration
        attendance: 0, // Starts fresh with zero attendance recorded
        designs: [], // Starts fresh with zero CAD designs submitted
        courseFee: 0,
        paidFee: 0,
        balanceFee: 0,
      };

      const result = await db.collection('users').insertOne(newUser);
      return NextResponse.json({
        success: true,
        message: 'CAD Account registered successfully!',
        user: {
          id: result.insertedId.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          stream: newUser.stream,
          assignedCourses: [],
        },
        redirectUrl: '/portal/student',
      });
    }

    // 2. Fallback when database is temporarily unreachable
    return NextResponse.json(
      {
        success: false,
        message: 'Database service is currently connecting. Please wait a moment and try again.',
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error('[API Sign Up Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to register account' },
      { status: 500 }
    );
  }
}
