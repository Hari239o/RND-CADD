import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const mode = searchParams.get('state') || 'signin';

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'rnd-cadd.vercel.app';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${proto}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  if (error || !code) {
    console.warn('[Google OAuth] Authorization error or code missing:', error);
    const fallbackRoute = mode === 'signup' ? '/signup' : '/signin';
    return NextResponse.redirect(`${baseUrl}${fallbackRoute}?error=${encodeURIComponent(error || 'cancelled')}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[Google OAuth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment.');
    return NextResponse.redirect(`${baseUrl}/signin?error=server_configuration_error`);
  }

  try {
    // 1. Exchange authorization code for tokens with Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[Google OAuth] Token exchange failed:', tokenData);
      return NextResponse.redirect(`${baseUrl}/signin?error=token_exchange_failed`);
    }

    // 2. Fetch authenticated Google profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await profileRes.json();
    if (!googleUser || !googleUser.email) {
      console.error('[Google OAuth] Failed to retrieve Google profile:', googleUser);
      return NextResponse.redirect(`${baseUrl}/signin?error=profile_fetch_failed`);
    }

    const normEmail = googleUser.email.toLowerCase().trim();
    const isAdmin =
      normEmail === 'harikishorereddy9908@gmail.com' ||
      normEmail.includes('admin') ||
      normEmail.includes('rndcadd');

    const userRole = isAdmin ? 'admin' : 'student';

    // 3. Connect to MongoDB Atlas & Check Account Existence
    let dbUser: any = null;
    let existing: any = null;
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const usersCol = db.collection('users');
        const escapedEmail = normEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        existing = await usersCol.findOne({
          $or: [
            { email: normEmail },
            { email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } },
          ],
        });

        // CASE 1: Student is already registered, but tried to Sign Up via Google!
        // Show pop-up stating the email is already registered and redirect to login.
        if (mode === 'signup' && existing) {
          console.log(`[Google OAuth Case-1] User ${normEmail} already registered. Redirecting to signup with already_registered modal.`);
          return NextResponse.redirect(
            `${baseUrl}/signup?already_registered=true&email=${encodeURIComponent(normEmail)}`
          );
        }

        // CASE 2: Student has NOT registered yet, but tried to Sign In directly via Google!
        // Show pop-up stating "Please Create an Account" and redirect to sign up.
        if (mode === 'signin' && !existing && !isAdmin) {
          console.log(`[Google OAuth Case-2] User ${normEmail} does not exist in DB. Redirecting to signin with not_registered modal.`);
          return NextResponse.redirect(
            `${baseUrl}/signin?not_registered=true&email=${encodeURIComponent(normEmail)}`
          );
        }

        // Proceed with normal flow
        if (!existing) {
          // New student registered via Google Sign-Up: Strictly no default assigned courses until formally enrolled
          const newUser = {
            email: normEmail,
            name: googleUser.name || 'CAD Student',
            photo: googleUser.picture || '',
            role: userRole,
            source: 'google_oauth',
            createdAt: new Date().toISOString(),
            stream: '',
            courseName: '',
            assignedCourses: [],
            attendance: 0,
            designs: [],
            courseFee: 0,
            paidFee: 0,
            balanceFee: 0,
            accessStatus: 'pending_enrollment',
          };
          const insertRes = await usersCol.insertOne(newUser);
          dbUser = { ...newUser, id: insertRes.insertedId.toString() };
        } else {
          // Existing student logging in via Google Sign-In
          await usersCol.updateOne(
            { _id: existing._id },
            {
              $set: {
                photo: googleUser.picture || existing.photo || '',
                lastLoginAt: new Date().toISOString(),
              },
            }
          );
          dbUser = {
            ...existing,
            id: existing._id.toString(),
            photo: googleUser.picture || existing.photo || '',
          };
        }
      }
    } catch (dbErr) {
      console.warn('[Google OAuth] MongoDB synchronization warning:', dbErr);
    }

    // 4. Build session object
    const sessionUser = {
      id: dbUser?.id || dbUser?.studentId || 'GOOGLE_USER',
      name: googleUser.name || 'CAD Student',
      email: normEmail,
      photo: googleUser.picture || '',
      role: userRole,
      assignedCourses: Array.isArray(dbUser?.assignedCourses) ? dbUser.assignedCourses : [],
    };

    const targetUrl = isAdmin
      ? `${baseUrl}/portal/admin`
      : `${baseUrl}/portal/student?email=${encodeURIComponent(normEmail)}`;

    // 5. Return HTML response that safely sets localStorage, cookie and navigates
    const safeUserJson = JSON.stringify(sessionUser).replace(/</g, '\\u003c');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating with Google...</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #F8FAFC;
      color: #0F172A;
    }
    .box {
      background: #FFFFFF;
      padding: 32px 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      text-align: center;
      border: 1px solid #E2E8F0;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #E2E8F0;
      border-top-color: #EE2C3C;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="box">
    <div class="spinner"></div>
    <h2 style="font-size: 18px; margin: 0 0 8px;">Connecting Google Account...</h2>
    <p style="font-size: 13px; color: #64748B; margin: 0;">Securing session and redirecting to portal</p>
  </div>
  <script>
    try {
      const user = ${safeUserJson};
      localStorage.setItem('rnd_cadd_user', JSON.stringify(user));
      localStorage.setItem('rnd_cadd_role', user.role);
      document.cookie = 'rnd_cadd_session=' + encodeURIComponent(JSON.stringify(user)) + '; path=/; max-age=604800; SameSite=Lax';
    } catch (e) {
      console.warn('Storage warning:', e);
    }
    window.location.replace(${JSON.stringify(targetUrl)});
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (err: any) {
    console.error('[Google OAuth] Unexpected callback error:', err);
    return NextResponse.redirect(`${baseUrl}/signin?error=oauth_internal_error`);
  }
}
