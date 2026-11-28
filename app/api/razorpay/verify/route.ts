import { NextResponse } from 'next/server';
import { verifySignature, IS_DEMO_RAZORPAY_KEY } from '@/lib/razorpay';
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
      qualification = '',
      college = '',
      city = '',
      trainingMode = 'Offline Campus + RTX Lab',
      preferredBatch = 'weekday-morning',
      promoCode = '',
      amountInRupees = 25000,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Missing mandatory transaction IDs.' },
        { status: 400 }
      );
    }

    const { db, isConnected } = await connectToDatabase();

    // Check server-created order record to confirm whether this was a legitimate sandbox order
    let storedOrder: any = null;
    if (isConnected && db) {
      storedOrder = await db.collection('razorpay_orders').findOne({ orderId: razorpay_order_id });
    }

    const allowDemoSandbox = Boolean(IS_DEMO_RAZORPAY_KEY && storedOrder?.isMockOrder === true);

    // Verify HMAC SHA-256 signature
    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature || '',
      allowDemoSandbox
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature. Verification failed.' },
        { status: 400 }
      );
    }

    const timestamp = new Date();
    const cleanTitle = String(storedOrder?.courseTitle || courseTitle || 'CAD Engineering Program').trim();
    const cleanName = String(storedOrder?.candidateName || candidateName || 'Enrolled Student').trim();
    const normalizedEmail = String(storedOrder?.candidateEmail || candidateEmail || '').trim().toLowerCase();
    const cleanPhone = String(storedOrder?.candidatePhone || candidatePhone || '').trim();
    const cleanQual = String(storedOrder?.qualification || qualification || '-').trim();
    const cleanCollege = String(storedOrder?.college || college || '-').trim();
    const cleanCity = String(storedOrder?.city || city || 'Hyderabad').trim();
    const cleanMode = String(storedOrder?.trainingMode || trainingMode || 'Offline Campus + RTX Lab').trim();
    const cleanBatch = String(storedOrder?.preferredBatch || preferredBatch || 'weekday-morning').trim();
    const cleanPromo = String(storedOrder?.promoCode || promoCode || '').trim();
    const numericFee = Number(storedOrder?.feeInRupees || amountInRupees) || 25000;

    const receiptNumber = `RCPT-CAD-${timestamp.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const admissionDateStr = timestamp.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const receiptRecord = {
      receiptId: receiptNumber,
      date: timestamp.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      amount: numericFee,
      amountFormatted: `₹${numericFee.toLocaleString('en-IN')}`,
      course: cleanTitle,
      paymentMode: 'Razorpay (UPI / Cards / NetBanking)',
      refNumber: razorpay_payment_id,
      status: 'Paid',
      remarks: `Online Enrollment (${cleanMode})`,
      downloadUrl: '#',
    };

    const paymentDocument = {
      receiptId: receiptNumber,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      courseTitle: cleanTitle,
      candidateName: cleanName,
      candidateEmail: normalizedEmail,
      candidatePhone: cleanPhone,
      qualification: cleanQual,
      college: cleanCollege,
      city: cleanCity,
      trainingMode: cleanMode,
      preferredBatch: cleanBatch,
      promoCode: cleanPromo,
      amount: numericFee,
      currency: 'INR',
      status: 'PAID_VERIFIED',
      paymentMode: 'Razorpay',
      createdAt: timestamp,
    };

    let studentCourses: string[] = [cleanTitle];
    let studentUserRecord: any = null;
    let isNewAccount = false;
    let finalStudentId = `STU-${timestamp.getFullYear().toString().slice(-2)}${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if (isConnected && db) {
        // Check idempotency
        const existingPayment = await db.collection('payments').findOne({ paymentId: razorpay_payment_id });
        if (!existingPayment) {
          await db.collection('payments').insertOne(paymentDocument);
        }

        // Update order status
        await db.collection('razorpay_orders').updateOne(
          { orderId: razorpay_order_id },
          { $set: { status: 'PAID', paymentId: razorpay_payment_id, paidAt: timestamp } }
        );

        // Increment promo offer redemption count if used
        if (cleanPromo) {
          await db.collection('offers').updateOne(
            { code: cleanPromo.toUpperCase() },
            { $inc: { redemptionsCount: 1 } }
          );
        }

        // Upsert enrollment record cleanly
        const enrollmentOr: any[] = [];
        if (normalizedEmail) enrollmentOr.push({ email: normalizedEmail, courseTitle: cleanTitle });
        if (cleanPhone) enrollmentOr.push({ phone: cleanPhone, courseTitle: cleanTitle });
        const enrollmentFilter = enrollmentOr.length > 0 ? { $or: enrollmentOr } : { receiptId: receiptNumber };

        await db.collection('enrollments').updateOne(
          enrollmentFilter,
          {
            $set: {
              fullName: cleanName,
              email: normalizedEmail,
              phone: cleanPhone,
              qualification: cleanQual,
              college: cleanCollege,
              city: cleanCity,
              trainingMode: cleanMode,
              courseTitle: cleanTitle,
              preferredBatch: cleanBatch,
              status: 'PAID_ENROLLED',
              paymentId: razorpay_payment_id,
              receiptId: receiptNumber,
              amountPaid: numericFee,
              paidAt: timestamp,
            },
          },
          { upsert: true }
        );

        // Find or auto-provision student account and UNLOCK course immediately
        const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const userQuery: any[] = [];
        if (normalizedEmail) {
          userQuery.push({ email: normalizedEmail });
          userQuery.push({ email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } });
        }
        if (cleanPhone && cleanPhone.length >= 10) {
          userQuery.push({ phone: cleanPhone });
          userQuery.push({ officialMobile: cleanPhone });
        }

        const existingUser = userQuery.length > 0 ? await db.collection('users').findOne({ $or: userQuery }) : null;

        if (existingUser) {
          const prevCourses = Array.isArray(existingUser.assignedCourses)
            ? existingUser.assignedCourses
            : (existingUser.courseName ? [existingUser.courseName] : []);
          studentCourses = Array.from(new Set([...prevCourses, cleanTitle]));
          finalStudentId = existingUser.studentId || finalStudentId;

          const prevReceipts = Array.isArray(existingUser.paymentReceipts) ? existingUser.paymentReceipts : [];
          const hasThisReceipt = prevReceipts.some((r: any) => r?.refNumber === razorpay_payment_id);
          const updatedReceipts = hasThisReceipt ? prevReceipts : [receiptRecord, ...prevReceipts];

          const newPaidFee = hasThisReceipt
            ? (Number(existingUser.paidFee) || numericFee)
            : (Number(existingUser.paidFee) || 0) + numericFee;
          const totalCourseFee = Math.max(Number(existingUser.courseFee) || 0, newPaidFee);
          const newBalanceFee = Math.max(0, totalCourseFee - newPaidFee);

          await db.collection('users').updateOne(
            { _id: existingUser._id },
            {
              $set: {
                studentId: finalStudentId,
                name: existingUser.name || cleanName,
                fullName: existingUser.fullName || cleanName,
                email: existingUser.email || normalizedEmail,
                phone: existingUser.phone || cleanPhone,
                officialMobile: existingUser.officialMobile || cleanPhone,
                qualification: cleanQual !== '-' ? cleanQual : (existingUser.qualification || '-'),
                college: cleanCollege !== '-' ? cleanCollege : (existingUser.college || '-'),
                residence: cleanCity || existingUser.residence || 'Hyderabad',
                trainingMode: cleanMode,
                preferredBatch: cleanBatch,
                assignedCourses: studentCourses,
                courseName: existingUser.courseName || cleanTitle,
                stream: existingUser.stream || cleanTitle,
                courseFee: totalCourseFee,
                paidFee: newPaidFee,
                balanceFee: newBalanceFee,
                paymentReceipts: updatedReceipts,
                accessStatus: 'active',
                updatedAt: timestamp,
              },
            }
          );

          studentUserRecord = {
            id: existingUser.studentId || existingUser._id.toString(),
            studentId: finalStudentId,
            name: existingUser.name || cleanName,
            email: existingUser.email || normalizedEmail,
            role: 'student',
            stream: existingUser.stream || cleanTitle,
            phone: existingUser.phone || cleanPhone,
            college: cleanCollege !== '-' ? cleanCollege : (existingUser.college || ''),
            qualification: cleanQual !== '-' ? cleanQual : (existingUser.qualification || ''),
            nativePlace: cleanCity || existingUser.residence || 'Hyderabad',
            photo: existingUser.photo || '',
            assignedCourses: studentCourses,
            courseFee: totalCourseFee,
            paidFee: newPaidFee,
            balanceFee: newBalanceFee,
            accessStatus: 'active',
            paymentReceipts: updatedReceipts,
          };
        } else if (normalizedEmail) {
          isNewAccount = true;
          const newDoc = {
            studentId: finalStudentId,
            name: cleanName,
            fullName: cleanName,
            email: normalizedEmail,
            phone: cleanPhone,
            officialMobile: cleanPhone,
            mobile: cleanPhone,
            role: 'student',
            password: '9908',
            qualification: cleanQual,
            college: cleanCollege,
            residence: cleanCity,
            trainingMode: cleanMode,
            preferredBatch: cleanBatch,
            admissionDate: admissionDateStr,
            stream: cleanTitle,
            courseName: cleanTitle,
            assignedCourses: [cleanTitle],
            courseFee: numericFee,
            paidFee: numericFee,
            balanceFee: 0,
            paymentReceipts: [receiptRecord],
            accessStatus: 'active',
            source: 'razorpay_checkout',
            createdAt: timestamp,
            updatedAt: timestamp,
          };

          const insertRes = await db.collection('users').insertOne(newDoc);
          studentUserRecord = {
            id: finalStudentId || insertRes.insertedId.toString(),
            studentId: finalStudentId,
            name: cleanName,
            email: normalizedEmail,
            role: 'student',
            stream: cleanTitle,
            phone: cleanPhone,
            college: cleanCollege !== '-' ? cleanCollege : '',
            qualification: cleanQual !== '-' ? cleanQual : '',
            nativePlace: cleanCity,
            admissionDate: admissionDateStr,
            assignedCourses: [cleanTitle],
            courseFee: numericFee,
            paidFee: numericFee,
            balanceFee: 0,
            accessStatus: 'active',
            paymentReceipts: [receiptRecord],
          };
        }
      }
    } catch (dbErr) {
      console.warn('[Razorpay Verify DB Notice]:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Razorpay payment verified successfully. Course unlocked & enrolled!',
      receiptId: receiptNumber,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      courseTitle: cleanTitle,
      amount: numericFee,
      trainingMode: cleanMode,
      preferredBatch: cleanBatch,
      studentId: finalStudentId,
      email: normalizedEmail,
      isNewAccount,
      tempPassword: isNewAccount ? '9908' : undefined,
      assignedCourses: studentCourses,
      receipt: receiptRecord,
      user: studentUserRecord,
    });
  } catch (error: any) {
    console.error('[Razorpay verify error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
