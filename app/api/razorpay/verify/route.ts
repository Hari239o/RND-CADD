import { NextResponse } from 'next/server';
import { verifySignature } from '@/lib/razorpay';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseTitle,
      candidateName,
      candidateEmail,
      candidatePhone,
      preferredBatch = 'weekday-morning',
      amountInRupees = 25000,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Missing mandatory transaction IDs.' },
        { status: 400 }
      );
    }

    // Verify HMAC SHA-256 signature
    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature || ''
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    const timestamp = new Date();
    const receiptNumber = `RCPT-CAD-${timestamp.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const normalizedEmail = candidateEmail ? String(candidateEmail).trim().toLowerCase() : '';
    const numericFee = Number(amountInRupees) || 25000;

    const receiptRecord = {
      receiptId: receiptNumber,
      date: timestamp.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      amount: `₹${numericFee.toLocaleString('en-IN')}`,
      course: courseTitle || 'CAD Engineering Program',
      paymentMode: 'Razorpay (Online UPI / Cards / Netbanking)',
      refNumber: razorpay_payment_id,
      downloadUrl: '#',
    };

    const paymentDocument = {
      receiptId: receiptNumber,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      courseTitle: String(courseTitle || '').trim(),
      candidateName: String(candidateName || '').trim(),
      candidateEmail: normalizedEmail,
      candidatePhone: String(candidatePhone || '').trim(),
      preferredBatch,
      amount: numericFee,
      currency: 'INR',
      status: 'PAID_VERIFIED',
      paymentMode: 'Razorpay',
      createdAt: timestamp,
    };

    let studentCourses: string[] = [courseTitle];

    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        // 1. Record payment transaction
        await db.collection('payments').insertOne(paymentDocument);

        // 2. Update or insert enrollment
        await db.collection('enrollments').updateOne(
          {
            $or: [
              { email: normalizedEmail, courseTitle },
              { phone: candidatePhone, courseTitle },
            ],
          },
          {
            $set: {
              fullName: candidateName,
              email: normalizedEmail,
              phone: candidatePhone,
              courseTitle,
              preferredBatch,
              status: 'PAID_ENROLLED',
              paymentId: razorpay_payment_id,
              receiptId: receiptNumber,
              amountPaid: numericFee,
              paidAt: timestamp,
            },
          },
          { upsert: true }
        );

        // 3. Update or auto-provision student account with the paid course & receipt
        if (normalizedEmail) {
          const user = await db.collection('users').findOne({ email: normalizedEmail });
          if (user) {
            const currentCourses = Array.isArray(user.assignedCourses)
              ? user.assignedCourses
              : (user.courseName ? [user.courseName] : []);
            if (!currentCourses.includes(courseTitle)) {
              currentCourses.push(courseTitle);
            }
            studentCourses = currentCourses;

            await db.collection('users').updateOne(
              { email: normalizedEmail },
              {
                $addToSet: {
                  assignedCourses: courseTitle,
                  paymentReceipts: receiptRecord,
                },
                $set: {
                  accessStatus: 'active',
                  updatedAt: timestamp,
                },
              }
            );
          } else {
            // Auto-provision student profile
            await db.collection('users').insertOne({
              name: String(candidateName || '').trim(),
              fullName: String(candidateName || '').trim(),
              email: normalizedEmail,
              phone: String(candidatePhone || '').trim(),
              officialMobile: String(candidatePhone || '').trim(),
              role: 'student',
              password: '9908',
              stream: courseTitle,
              courseName: courseTitle,
              assignedCourses: [courseTitle],
              paymentReceipts: [receiptRecord],
              accessStatus: 'active',
              createdAt: timestamp,
            });
          }
        }
      }
    } catch (dbErr) {
      console.warn('[Razorpay Verify DB Notice]:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Razorpay payment verified successfully. Course unlocked!',
      receiptId: receiptNumber,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      courseTitle,
      amount: numericFee,
      assignedCourses: studentCourses,
      receipt: receiptRecord,
    });
  } catch (error: any) {
    console.error('[Razorpay verify error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
