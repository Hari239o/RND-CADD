import { NextResponse } from 'next/server';
import { getRazorpay, RAZORPAY_KEY_ID, IS_DEMO_RAZORPAY_KEY } from '@/lib/razorpay';
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
      qualification = '',
      branch = '',
      passoutYear = '',
      college = '',
      city = '',
      trainingMode = 'Offline Campus + RTX Lab',
      preferredBatch = 'weekday-morning',
      promoCode = '',
      customAmount,
    } = body;

    if (!courseTitle || !candidateName || !candidateEmail || !candidatePhone) {
      return NextResponse.json(
        { error: 'Full name, registered email, phone number, and course are required to initialize enrollment checkout.' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(candidateEmail).trim().toLowerCase();
    const cleanTitle = String(courseTitle).trim();

    // 1. Authoritative Course Fee Resolution (MongoDB courses -> COURSES dataset -> customAmount)
    let baseFeeInRupees = 25000;
    let dbRef: any = null;
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        dbRef = db;
        const escapedTitle = cleanTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const dbCourse = await db.collection('courses').findOne({
          $or: [
            { title: cleanTitle },
            { title: new RegExp(`^${escapedTitle}$`, 'i') },
          ],
        });
        if (dbCourse && Number(dbCourse.fee) > 0) {
          baseFeeInRupees = Number(dbCourse.fee);
        } else {
          const matched = COURSES.find(
            (c) => c.title.toLowerCase().trim() === cleanTitle.toLowerCase()
          );
          if (matched && matched.fee) {
            baseFeeInRupees = matched.fee;
          } else if (customAmount && Number(customAmount) > 0) {
            baseFeeInRupees = Number(customAmount);
          }
        }
      }
    } catch {
      const matched = COURSES.find(
        (c) => c.title.toLowerCase().trim() === cleanTitle.toLowerCase()
      );
      if (matched && matched.fee) {
        baseFeeInRupees = matched.fee;
      } else if (customAmount && Number(customAmount) > 0) {
        baseFeeInRupees = Number(customAmount);
      }
    }

    // 2. Validate Optional Promo Code against Active Offers in MongoDB
    let discountAmount = 0;
    let appliedPromo = '';
    if (promoCode && String(promoCode).trim() && dbRef) {
      const cleanCode = String(promoCode).trim().toUpperCase();
      const offer = await dbRef.collection('offers').findOne({
        code: cleanCode,
        status: 'Active',
      });
      if (offer) {
        const appliesToCourse =
          !offer.targetCourse ||
          offer.targetCourse === 'All Courses' ||
          offer.targetCourse.toLowerCase().trim() === cleanTitle.toLowerCase();
        if (appliesToCourse) {
          appliedPromo = cleanCode;
          if (offer.discountType === 'percentage') {
            discountAmount = Math.round((baseFeeInRupees * (Number(offer.discountValue) || 0)) / 100);
          } else {
            discountAmount = Number(offer.discountValue) || 0;
          }
        }
      }
    }

    const finalFeeInRupees = Math.max(500, baseFeeInRupees - discountAmount);
    const amountInPaise = Math.round(finalFeeInRupees * 100);
    const receiptId = `rcpt_${Date.now().toString().slice(-8)}`;

    let orderId = '';
    let isMockOrder = IS_DEMO_RAZORPAY_KEY;

    if (!IS_DEMO_RAZORPAY_KEY) {
      try {
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            courseTitle: cleanTitle.slice(0, 40),
            candidateName: String(candidateName || '').slice(0, 40),
            candidateEmail: normalizedEmail.slice(0, 40),
            candidatePhone: String(candidatePhone || '').slice(0, 30),
            trainingMode: String(trainingMode).slice(0, 30),
            preferredBatch: String(preferredBatch).slice(0, 30),
          },
        });
        orderId = order.id;
        isMockOrder = false;
      } catch (rzpErr: any) {
        console.warn('[Razorpay API Warning] Orders create fallback invoked:', rzpErr?.message || rzpErr);
        orderId = `order_test_${Date.now()}`;
        isMockOrder = true;
      }
    } else {
      orderId = `order_test_${Date.now()}`;
      isMockOrder = true;
    }

    // Store complete order record in MongoDB
    try {
      if (dbRef) {
        await dbRef.collection('razorpay_orders').insertOne({
          orderId,
          receiptId,
          courseTitle: cleanTitle,
          baseFeeInRupees,
          discountAmount,
          promoCode: appliedPromo,
          feeInRupees: finalFeeInRupees,
          amountInPaise,
          candidateName: String(candidateName).trim(),
          candidateEmail: normalizedEmail,
          candidatePhone: String(candidatePhone).trim(),
          qualification: String(qualification || '').trim(),
          branch: String(branch || '').trim(),
          passoutYear: String(passoutYear || '').trim(),
          college: String(college || '').trim(),
          city: String(city || '').trim(),
          trainingMode,
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
      amountInRupees: finalFeeInRupees,
      baseFeeInRupees,
      discountAmount,
      appliedPromo,
      currency: 'INR',
      keyId: RAZORPAY_KEY_ID,
      courseTitle: cleanTitle,
      candidate: {
        name: String(candidateName).trim(),
        email: normalizedEmail,
        phone: String(candidatePhone).trim(),
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
