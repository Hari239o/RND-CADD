import { NextResponse } from 'next/server';
import { getRazorpay, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { COURSES } from '@/lib/courses-data';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      courseTitle,
      candidateName,
      candidateEmail,
      candidatePhone,
      preferredBatch = 'weekday-morning',
      customAmount,
    } = body;

    if (!courseTitle) {
      return NextResponse.json(
        { error: 'Course title is required to initialize payment.' },
        { status: 400 }
      );
    }

    // Determine course fee
    let feeInRupees = 25000;
    if (customAmount && Number(customAmount) > 0) {
      feeInRupees = Number(customAmount);
    } else {
      const matched = COURSES.find(
        (c) => c.title.toLowerCase().trim() === courseTitle.toLowerCase().trim()
      );
      if (matched && matched.fee) {
        feeInRupees = matched.fee;
      }
    }

    const amountInPaise = Math.round(feeInRupees * 100);
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    let orderId = '';
    let isMockOrder = false;

    try {
      const razorpay = getRazorpay();
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          courseTitle: String(courseTitle).slice(0, 40),
          candidateName: String(candidateName || '').slice(0, 40),
          candidatePhone: String(candidatePhone || '').slice(0, 30),
          preferredBatch: String(preferredBatch).slice(0, 30),
        },
      });
      orderId = order.id;
    } catch (rzpErr: any) {
      console.warn('[Razorpay API Warning] Orders create fallback invoked:', rzpErr?.message || rzpErr);
      // Fallback to deterministic sandbox order for demo/test environments
      orderId = `order_test_${Date.now()}`;
      isMockOrder = true;
    }

    // Store order record in MongoDB
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        await db.collection('razorpay_orders').insertOne({
          orderId,
          receiptId,
          courseTitle,
          feeInRupees,
          amountInPaise,
          candidateName: candidateName || 'Candidate',
          candidateEmail: candidateEmail ? candidateEmail.toLowerCase().trim() : '',
          candidatePhone: candidatePhone || '',
          preferredBatch,
          status: 'CREATED',
          isMockOrder,
          createdAt: new Date(),
        });
      }
    } catch (dbErr) {
      console.warn('[Razorpay MongoDB] Notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: amountInPaise,
      amountInRupees: feeInRupees,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      courseTitle,
      candidate: {
        name: candidateName || '',
        email: candidateEmail || '',
        phone: candidatePhone || '',
      },
      isMockOrder,
    });
  } catch (error: any) {
    console.error('[Razorpay create-order error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize Razorpay order.' },
      { status: 500 }
    );
  }
}
