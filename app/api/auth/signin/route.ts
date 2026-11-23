import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter both your email address and password.' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedPassword = String(password).trim();

    // 1. Direct Verification for Designated Administrator
    if (
      normalizedEmail === 'harikishorereddy9908@gmial.com' ||
      normalizedEmail === 'harikishorereddy9908@gmail.com' ||
      normalizedEmail === 'admin@rndcadd.com' ||
      normalizedEmail === 'admin@gmail.com'
    ) {
      if (trimmedPassword === '9908') {
        return NextResponse.json({
          success: true,
          message: 'Signed in as Administrator',
          user: {
            id: 'admin_master_01',
            name: 'Hari Kishore Reddy',
            email: normalizedEmail,
            role: 'admin',
            stream: 'Executive CADD Administration',
          },
          redirectUrl: '/portal/admin',
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid password for administrator account.' },
          { status: 401 }
        );
      }
    }

    // 2. Strict Verification against Live MongoDB Database
    const { db, isConnected } = await connectToDatabase();

    if (!isConnected || !db) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database service is currently connecting. Please try again in a moment.',
        },
        { status: 503 }
      );
    }

    // Search for user in MongoDB (case-insensitive)
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await db.collection('users').findOne({
      $or: [
        { email: normalizedEmail },
        { email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } },
      ],
    });

    // IF USER DOES NOT EXIST IN DATABASE -> BLOCK ACCESS & PROMPT SIGNUP
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          notRegistered: true,
          code: 'ACCOUNT_NOT_FOUND',
          message: 'No account found with this email address. Please sign up first to access the student portal.',
          redirectUrl: `/signup?email=${encodeURIComponent(normalizedEmail)}`,
        },
        { status: 404 }
      );
    }

    // If account was created via Google OAuth and has no local password
    if (user.source === 'google_oauth' && !user.password) {
      return NextResponse.json(
        {
          success: false,
          code: 'GOOGLE_AUTH_REQUIRED',
          message: 'This account was created using Google Sign-In. Please click "Continue with Google" to log in.',
        },
        { status: 400 }
      );
    }

    // Verify Password
    if (user.password !== trimmedPassword) {
      return NextResponse.json(
        {
          success: false,
          code: 'INVALID_PASSWORD',
          message: 'Incorrect password. Please verify your password or use "Forgot Password" to reset it.',
        },
        { status: 401 }
      );
    }

    // Password matches -> Grant Authenticated Session
    const userRole = user.role === 'admin' ? 'admin' : 'student';
    const userCourses =
      Array.isArray(user.assignedCourses) && user.assignedCourses.length > 0
        ? user.assignedCourses
        : user.courseName
        ? [user.courseName]
        : user.stream
        ? [user.stream]
        : [];

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: {
        id: user._id.toString(),
        studentId: user.studentId || `STU-${user._id.toString().slice(-4).toUpperCase()}`,
        name: user.name || user.fullName || normalizedEmail.split('@')[0],
        email: user.email,
        role: userRole,
        mobile: user.officialMobile || user.mobile || user.phone || '',
        officialMobile: user.officialMobile || user.mobile || user.phone || '',
        stream: user.stream || user.courseName || (userCourses[0] || 'Civil & BIM'),
        assignedCourses: userCourses,
      },
      redirectUrl: userRole === 'admin' ? '/portal/admin' : '/portal/student',
    });
  } catch (error: any) {
    console.error('[API Sign In Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Authentication service error' },
      { status: 500 }
    );
  }
}
