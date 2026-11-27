import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { sendEmail, getSmtpConfig } from '@/lib/email';

export const dynamic = 'force-dynamic';

// In-memory fallback for rapid local testing
const inMemoryOtps: Record<string, { code: string; expiresAt: number }> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = 'request_otp', emailOrPhone, otp, newPassword } = body;

    if (!emailOrPhone) {
      return NextResponse.json(
        { success: false, message: 'Please enter your registered email address' },
        { status: 400 }
      );
    }

    const identifier = String(emailOrPhone).trim().toLowerCase();

    // ACTION 1: REQUEST OTP
    if (action === 'request_otp') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAtMs = Date.now() + 15 * 60 * 1000; // 15 mins

      // 1. Store in Memory
      inMemoryOtps[identifier] = {
        code: generatedOtp,
        expiresAt: expiresAtMs,
      };

      // 2. Persist in MongoDB Atlas `otps` collection for resilient multi-instance serverless support
      try {
        const { db, isConnected } = await connectToDatabase();
        if (isConnected && db) {
          await db.collection('otps').updateOne(
            { email: identifier },
            {
              $set: {
                email: identifier,
                code: generatedOtp,
                expiresAt: new Date(expiresAtMs),
                createdAt: new Date(),
              },
            },
            { upsert: true }
          );
        }
      } catch (dbErr) {
        console.warn('[Forgot Password] MongoDB OTP cache warning:', dbErr);
      }

      // 3. Dispatch official email via Gmail SMTP
      const emailHtml = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="background-color: #15304C; padding: 24px 32px; text-align: center; border-bottom: 3px solid #EE2C3C;">
            <h1 style="color: #FFFFFF; font-size: 20px; margin: 0; font-weight: 800; letter-spacing: 0.5px;">RND CADD TRAINING INSTITUTE</h1>
            <p style="color: #94A3B8; font-size: 12px; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 1px;">Security & Account Recovery</p>
          </div>
          
          <div style="padding: 32px 32px 24px; color: #1E293B;">
            <h2 style="font-size: 18px; font-weight: bold; margin: 0 0 12px; color: #0F172A;">Password Reset Verification Code</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
              Hello,<br>
              We received a request to reset the password for your RND CADD workstation account (<strong>${identifier}</strong>). Use the verification code below to set a new password:
            </p>
            
            <div style="background-color: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 24px;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #EE2C3C; display: inline-block;">
                ${generatedOtp}
              </span>
            </div>
            
            <p style="font-size: 13px; line-height: 1.5; color: #64748B; margin: 0 0 8px;">
              &bull; This one-time password (OTP) is valid for <strong>15 minutes</strong>.<br>
              &bull; If you did not request this password reset, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background-color: #F8FAFC; padding: 16px 32px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8;">
            RND CADD Training Institute &bull; Ameerpet Main Campus, Hyderabad<br>
            Official Academic & Student Portal Notification
          </div>
        </div>
      `;

      const emailResult = await sendEmail({
        to: identifier,
        subject: `RND CADD - Password Reset Code: ${generatedOtp}`,
        text: `Your RND CADD password reset verification code is: ${generatedOtp}. This code expires in 15 minutes.`,
        html: emailHtml,
      });

      const { isConfigured } = getSmtpConfig();

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${identifier}`,
        emailSent: emailResult.success,
        // Only surface the OTP directly in local development when SMTP is not configured
        otp: process.env.NODE_ENV === 'development' && !isConfigured ? generatedOtp : undefined,
      });
    }

    // ACTION 2: VERIFY AND RESET
    if (action === 'verify_and_reset') {
      const trimmedOtp = String(otp || '').trim();

      if (!trimmedOtp) {
        return NextResponse.json(
          { success: false, message: 'Please enter the verification code' },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: 'New password must be at least 6 characters' },
          { status: 400 }
        );
      }

      // 1. Verify against MongoDB Atlas
      let isValid = false;
      const { db, isConnected } = await connectToDatabase();

      if (isConnected && db) {
        try {
          const doc = await db.collection('otps').findOne({ email: identifier });
          if (doc && doc.code === trimmedOtp) {
            const expires = doc.expiresAt instanceof Date ? doc.expiresAt.getTime() : new Date(doc.expiresAt).getTime();
            if (Date.now() <= expires) {
              isValid = true;
            }
          }
        } catch (dbErr) {
          console.warn('[Forgot Password] MongoDB query error:', dbErr);
        }
      }

      // 2. Fallback to active in-memory record if MongoDB was not connected during request
      if (!isValid) {
        const mem = inMemoryOtps[identifier];
        if (mem && mem.code === trimmedOtp && Date.now() <= mem.expiresAt) {
          isValid = true;
        }
      }

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired verification code. Please check your email or request a new code.' },
          { status: 400 }
        );
      }

      // 3. Update password in MongoDB `users` and `students`
      if (isConnected && db) {
        try {
          await db.collection('users').updateOne(
            { email: identifier },
            {
              $set: {
                password: newPassword,
                updatedAt: new Date().toISOString(),
              },
            },
            { upsert: false }
          );

          await db.collection('students').updateOne(
            { email: identifier },
            {
              $set: {
                password: newPassword,
                updatedAt: new Date().toISOString(),
              },
            },
            { upsert: false }
          );

          // Clear used OTP
          await db.collection('otps').deleteOne({ email: identifier });
        } catch (dbErr) {
          console.warn('[Forgot Password] DB password update error:', dbErr);
        }
      }

      delete inMemoryOtps[identifier];

      return NextResponse.json({
        success: true,
        message: 'Password reset successfully! You can now log in with your new password.',
        redirectUrl: '/signin',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action requested' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[API Forgot Password Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Password recovery failed' },
      { status: 500 }
    );
  }
}
