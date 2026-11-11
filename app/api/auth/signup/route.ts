import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      mobile,
      stream = 'Civil & BIM',
      role = 'student',
      password
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Full name, email address, and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // 1. Try to persist into MongoDB
    const { db, isConnected } = await connectToDatabase();
    if (isConnected && db) {
      const existingUser = await db.collection('users').findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists. Please Sign In.' },
          { status: 409 }
        );
      }

      const newUser = {
        fullName: String(fullName).trim(),
        name: String(fullName).trim(),
        email: normalizedEmail,
        mobile: mobile ? String(mobile).trim() : '',
        officialMobile: mobile ? String(mobile).trim() : '',
        phone: mobile ? String(mobile).trim() : '',
        stream,
        role: role === 'admin' ? 'admin' : 'student',
        password, // In production, hash with bcrypt
        createdAt: new Date(),
        status: 'active'
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
          stream: newUser.stream
        },
        redirectUrl: newUser.role === 'admin' ? '/portal/admin' : '/portal/student'
      });
    }

    // 2. Offline / Standalone Fallback Mode
    return NextResponse.json({
      success: true,
      isDemoMode: true,
      message: 'Account created successfully (Local Workstation Session)',
      user: {
        id: 'usr_' + Date.now(),
        name: String(fullName).trim(),
        email: normalizedEmail,
        role: role === 'admin' ? 'admin' : 'student',
        stream
      },
      redirectUrl: role === 'admin' ? '/portal/admin' : '/portal/student'
    });

  } catch (error: any) {
    console.error('[API Sign Up Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to register account' },
      { status: 500 }
    );
  }
}
