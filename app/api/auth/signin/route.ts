import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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

    // 1. Direct Verification for User's Designated Admin
    // Admin: harikishorereddy9908@gmial.com (or @gmail.com) / 9908
    if (
      (normalizedEmail === 'harikishorereddy9908@gmial.com' ||
       normalizedEmail === 'harikishorereddy9908@gmail.com')
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
            stream: 'Executive CADD Administration'
          },
          redirectUrl: '/portal/admin'
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid password for administrator account.' },
          { status: 401 }
        );
      }
    }

    // 2. Direct Verification for User's Designated Student
    // Student: student1@gmail.com / 9908
    if (normalizedEmail === 'student1@gmail.com') {
      if (trimmedPassword === '9908') {
        return NextResponse.json({
          success: true,
          message: 'Signed in as Student',
          user: {
            id: 'stu_master_01',
            name: 'Ram.g',
            email: normalizedEmail,
            role: 'student',
            mobile: '+91 99080 12345',
            officialMobile: '+91 99080 12345',
            stream: 'Civil & Architectural BIM'
          },
          redirectUrl: '/portal/student'
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid password for student account.' },
          { status: 401 }
        );
      }
    }

    // 3. Check Live MongoDB Database (for users created through Sign Up)
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const user = await db.collection('users').findOne({ email: normalizedEmail });
      if (user) {
        if (user.password === trimmedPassword) {
          const userRole = user.role === 'admin' ? 'admin' : 'student';
          return NextResponse.json({
            success: true,
            message: 'Signed in successfully',
            user: {
              id: user._id.toString(),
              name: user.name || user.fullName || normalizedEmail.split('@')[0],
              email: user.email,
              role: userRole,
              mobile: user.officialMobile || user.mobile || user.phone || '',
              officialMobile: user.officialMobile || user.mobile || user.phone || '',
              stream: user.stream || 'Civil & BIM'
            },
            redirectUrl: userRole === 'admin' ? '/portal/admin' : '/portal/student'
          });
        } else {
          return NextResponse.json(
            { success: false, message: 'Invalid password. Please check and try again.' },
            { status: 401 }
          );
        }
      }
    }

    // 4. Default Fallback if email not registered
    return NextResponse.json(
      {
        success: false,
        message: 'Account not found. Please verify your email or click Sign Up to register.'
      },
      { status: 404 }
    );

  } catch (error: any) {
    console.error('[API Sign In Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
