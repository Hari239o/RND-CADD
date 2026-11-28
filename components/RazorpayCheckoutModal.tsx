'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CoursePaymentInfo {
  title: string;
  fee?: number;
  duration?: string;
  category?: string;
  stream?: string;
}

interface InitialCandidateInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  preferredBatch?: string;
}

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CoursePaymentInfo | null;
  initialCandidate?: InitialCandidateInfo;
  onSuccess?: (paymentDetails: any) => void;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  course,
  initialCandidate,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('B.Tech / B.E');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [trainingMode, setTrainingMode] = useState('Offline Campus + RTX Lab');
  const [preferredBatch, setPreferredBatch] = useState('weekday-morning');
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; discount: number } | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<string>('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sandboxOrderData, setSandboxOrderData] = useState<any | null>(null);
  const [sandboxMethod, setSandboxMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage('');
      setPaymentSuccessData(null);
      setSandboxOrderData(null);
      setPromoFeedback('');
      return;
    }

    if (initialCandidate) {
      if (initialCandidate.fullName) setFullName(initialCandidate.fullName);
      if (initialCandidate.email) setEmail(initialCandidate.email);
      if (initialCandidate.phone) setPhone(initialCandidate.phone);
      if (initialCandidate.preferredBatch) setPreferredBatch(initialCandidate.preferredBatch);
    }

    try {
      if (typeof window !== 'undefined') {
        const userStr = sessionStorage.getItem('rnd_cadd_user') || localStorage.getItem('rnd_cadd_user');
        if (userStr) {
          const u = JSON.parse(userStr);
          if (!initialCandidate?.fullName && (u.name || u.fullName)) setFullName(u.name || u.fullName);
          if (!initialCandidate?.email && u.email) setEmail(u.email);
          if (!initialCandidate?.phone && (u.phone || u.officialMobile)) setPhone(u.phone || u.officialMobile);
          if (u.qualification && u.qualification !== '-') setQualification(u.qualification);
          if (u.college && u.college !== '-') setCollege(u.college);
          if (u.nativePlace && u.nativePlace !== '-') setCity(u.nativePlace);
        }
      }
    } catch {}
  }, [isOpen, initialCandidate]);

  if (!isOpen || !course) return null;

  const baseCourseFee = course.fee && course.fee > 0 ? course.fee : 25000;
  const discountValue = appliedDiscount ? appliedDiscount.discount : 0;
  const payableFee = Math.max(500, baseCourseFee - discountValue);

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setAppliedDiscount(null);
      setPromoFeedback('');
      return;
    }
    setIsApplyingPromo(true);
    setPromoFeedback('');
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (data.success && Array.isArray(data.offers)) {
        const matched = data.offers.find(
          (o: any) =>
            o.code?.toUpperCase() === code &&
            o.status === 'Active' &&
            (!o.targetCourse || o.targetCourse === 'All Courses' || o.targetCourse.toLowerCase() === course.title.toLowerCase())
        );
        if (matched) {
          const calc =
            matched.discountType === 'percentage'
              ? Math.round((baseCourseFee * (Number(matched.discountValue) || 0)) / 100)
              : Number(matched.discountValue) || 0;
          setAppliedDiscount({ code, discount: calc });
          setPromoFeedback(`Applied ${code}: ₹${calc.toLocaleString('en-IN')} discount.`);
        } else {
          setAppliedDiscount(null);
          setPromoFeedback('Coupon is inactive or not valid for this course.');
        }
      }
    } catch {
      setPromoFeedback('Unable to validate coupon right now.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Full name, email address, and mobile number are required to unlock your course.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: course.title,
          candidateName: fullName.trim(),
          candidateEmail: email.trim().toLowerCase(),
          candidatePhone: phone.trim(),
          qualification,
          college: college.trim(),
          city: city.trim(),
          trainingMode,
          preferredBatch,
          promoCode: appliedDiscount?.code || '',
          customAmount: baseCourseFee,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      if (orderData.isMockOrder) {
        setSandboxOrderData(orderData);
        setIsLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        setSandboxOrderData(orderData);
        setIsLoading(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'RND CADD Training Institute',
        description: `Enrollment: ${course.title}`,
        image: '/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: fullName.trim(),
          email: email.trim().toLowerCase(),
          contact: phone.trim(),
        },
        notes: {
          courseTitle: course.title,
          trainingMode,
          preferredBatch,
        },
        theme: {
          color: '#EE2C3C',
        },
        handler: async (response: any) => {
          await handleVerifyPayment({
            razorpay_order_id: response.razorpay_order_id || orderData.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amountInRupees: orderData.amountInRupees || payableFee,
          });
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', (failedRes: any) => {
        console.error('Razorpay payment failed:', failedRes.error);
        setErrorMessage(failedRes.error?.description || 'Payment was unsuccessful or cancelled. Please retry.');
        setIsLoading(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Razorpay checkout error:', err);
      setErrorMessage(err?.message || 'Unable to start checkout. Please verify your details and retry.');
      setIsLoading(false);
    }
  };

  const handleCompleteSandboxPayment = async () => {
    if (!sandboxOrderData) return;
    setIsLoading(true);
    setErrorMessage('');
    await handleVerifyPayment({
      razorpay_order_id: sandboxOrderData.orderId,
      razorpay_payment_id: `pay_test_${Date.now()}`,
      razorpay_signature: 'mock_verified_signature',
      amountInRupees: sandboxOrderData.amountInRupees || payableFee,
    });
  };

  const handleVerifyPayment = async (paymentPayload: any) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentPayload,
          courseTitle: course.title,
          candidateName: fullName.trim(),
          candidateEmail: normalizedEmail,
          candidatePhone: phone.trim(),
          qualification,
          college: college.trim(),
          city: city.trim(),
          trainingMode,
          preferredBatch,
          promoCode: appliedDiscount?.code || '',
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed.');
      }

      try {
        if (typeof window !== 'undefined') {
          const existingRaw = sessionStorage.getItem('rnd_cadd_user') || localStorage.getItem('rnd_cadd_user');
          const existingParsed = existingRaw ? JSON.parse(existingRaw) : null;

          const activeUserSession = verifyData.user
            ? verifyData.user
            : {
                ...(existingParsed || {}),
                name: fullName.trim(),
                email: normalizedEmail,
                role: 'student',
                id: verifyData.studentId || existingParsed?.id || 'STU-NEW',
                studentId: verifyData.studentId || existingParsed?.studentId || 'STU-NEW',
                stream: course.title,
                phone: phone.trim(),
                college: college.trim(),
                qualification,
                nativePlace: city.trim(),
                assignedCourses: verifyData.assignedCourses || [course.title],
                paymentReceipts: [verifyData.receipt, ...(existingParsed?.paymentReceipts || [])],
                accessStatus: 'active',
              };

          sessionStorage.setItem('rnd_cadd_user', JSON.stringify(activeUserSession));
          sessionStorage.setItem('rnd_cadd_role', 'student');
          localStorage.setItem('rnd_cadd_user', JSON.stringify(activeUserSession));
          localStorage.setItem('rnd_cadd_role', 'student');

          if (normalizedEmail) {
            const emailKey = `rnd_cadd_enrolled_${normalizedEmail}`;
            const existing = JSON.parse(localStorage.getItem(emailKey) || '[]');
            const updatedList = Array.from(new Set([...existing, ...(verifyData.assignedCourses || [course.title])]));
            localStorage.setItem(emailKey, JSON.stringify(updatedList));
          }

          window.dispatchEvent(new Event('storage'));
        }
      } catch {}

      setSandboxOrderData(null);
      setPaymentSuccessData(verifyData);
      if (onSuccess) {
        onSuccess(verifyData);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      setErrorMessage(err?.message || 'Payment verification failed. Contact admissions support.');
    } finally {
      setIsLoading(false);
    }
  };

  const TRAINING_MODES = [
    { value: 'Offline Campus + RTX Lab', label: 'Campus + Lab' },
    { value: 'Live Instructor Online', label: 'Live Online' },
    { value: 'Hybrid (Lab + Online)', label: 'Hybrid' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
        {/* Clean Light-Neutral Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Corporate Enterprise White Checkout Window */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 12 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden z-10 my-auto max-h-[94vh] flex flex-col"
        >
          {/* Clean MNC Light Header Bar */}
          <div className="bg-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#EE2C3C] shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                    Course Enrollment &amp; Razorpay Billing
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Instant LMS Unlock
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Authorized R&amp;D CADD Admissions Portal &bull; Automatic Seat &amp; Course Activation
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1 bg-white">
            {paymentSuccessData ? (
              /* ==================== STEP 3: VERIFIED ENROLLMENT RECEIPT ==================== */
              <div className="p-6 sm:p-10 max-w-2xl mx-auto text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-2">
                    Payment Verified &bull; Enrolled Automatically
                  </span>
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Course Unlocked in Your Student Portal
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Your admission is active and <span className="font-semibold text-slate-900">{paymentSuccessData.courseTitle}</span> is ready for learning.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Payment Receipt
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Receipt No</span>
                      <span className="font-semibold font-mono text-slate-900">{paymentSuccessData.receiptId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment ID</span>
                      <span className="font-semibold font-mono text-slate-900 truncate max-w-[140px]">{paymentSuccessData.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid</span>
                      <span className="font-bold text-emerald-700">₹{paymentSuccessData.amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      LMS Portal Credentials
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student ID</span>
                      <span className="font-bold font-mono text-slate-900">{paymentSuccessData.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Login Email</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[155px]">{paymentSuccessData.email || email}</span>
                    </div>
                    {paymentSuccessData.tempPassword ? (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Default Password</span>
                        <span className="font-bold font-mono text-[#EE2C3C]">{paymentSuccessData.tempPassword}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status</span>
                        <span className="font-semibold text-emerald-700">Active &amp; Unlocked</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Link
                    href={(paymentSuccessData.email || email) ? `/portal/student?email=${encodeURIComponent(paymentSuccessData.email || email)}` : '/portal/student'}
                    onClick={onClose}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Open Unlocked Course in Portal</span>
                    <span>&rarr;</span>
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : sandboxOrderData ? (
              /* ==================== STEP 2 (TEST MODE): CLEAN LIGHT RAZORPAY GATEWAY ==================== */
              <div className="p-6 sm:p-8 max-w-xl mx-auto space-y-5">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <div>
                    <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
                      Razorpay Test Mode Gateway
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">{course.title}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">Order ID: {sandboxOrderData.orderId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500">Payable</div>
                    <div className="text-xl font-bold text-slate-900">₹{(sandboxOrderData.amountInRupees || payableFee).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-slate-700">
                    Choose Payment Instrument
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'upi', label: 'UPI / QR', sub: 'GPay, PhonePe' },
                      { id: 'card', label: 'Card', sub: 'Visa, Mastercard' },
                      { id: 'netbanking', label: 'NetBanking', sub: 'All Major Banks' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSandboxMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          sandboxMethod === m.id
                            ? 'border-[#EE2C3C] bg-[#FEF2F2] ring-1 ring-[#EE2C3C]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{m.label}</div>
                        <div className="text-[11px] text-slate-500">{m.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  Completing payment automatically verifies your transaction on the server, generates a receipt, and unlocks <strong className="text-slate-900">{course.title}</strong> in your Student Portal.
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleCompleteSandboxPayment}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isLoading ? 'Verifying & Unlocking Course...' : `Complete Payment ₹${(sandboxOrderData.amountInRupees || payableFee).toLocaleString('en-IN')} →`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSandboxOrderData(null)}
                    className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              /* ==================== STEP 1: CLEAN MNC LIGHT 2-COLUMN CHECKOUT ==================== */
              <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-12">
                {/* LEFT COLUMN (7 Cols): Structured Light Corporate Form */}
                <div className="lg:col-span-7 p-5 sm:p-7 space-y-5 bg-white">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  {/* Section 1: Applicant Identity */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        1. Applicant Details
                      </h4>
                      <span className="text-[11px] text-slate-400">* Required fields</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Full Name <span className="text-[#EE2C3C]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Vikram Reddy (Printed on Certificate)"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/10 focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Email Address <span className="text-[#EE2C3C]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/10 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Phone / WhatsApp <span className="text-[#EE2C3C]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98490 12345"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/10 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Academic & Batch Details */}
                  <div className="space-y-3.5 pt-1">
                    <div className="pb-2 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        2. Academic &amp; Batch Selection
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Qualification
                        </label>
                        <select
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:border-[#EE2C3C] focus:outline-none transition-colors"
                        >
                          <option value="B.Tech / B.E">B.Tech / B.E</option>
                          <option value="Diploma / Polytechnic">Diploma</option>
                          <option value="M.Tech / M.E">M.Tech / M.E</option>
                          <option value="B.Arch / Interior">B.Arch / Interior</option>
                          <option value="Working Professional">Working Professional</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          College / Company
                        </label>
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. JNTUH / L&T"
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-[#EE2C3C] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Hyderabad"
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-[#EE2C3C] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Clean Segmented Training Mode Control */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Training Mode
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                        {TRAINING_MODES.map((m) => (
                          <button
                            key={m.value}
                            type="button"
                            onClick={() => setTrainingMode(m.value)}
                            className={`py-2 px-2 rounded-md text-xs font-semibold text-center transition-all cursor-pointer whitespace-nowrap ${
                              trainingMode === m.value
                                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Preferred Batch Timing
                        </label>
                        <select
                          value={preferredBatch}
                          onChange={(e) => setPreferredBatch(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:border-[#EE2C3C] focus:outline-none transition-colors"
                        >
                          <option value="weekday-morning">Weekday Morning (8:00–10:30 AM)</option>
                          <option value="weekday-afternoon">Weekday Afternoon (2:00–4:30 PM)</option>
                          <option value="weekday-evening">Weekday Evening (6:30–9:00 PM)</option>
                          <option value="weekend-fasttrack">Weekend Batch (Sat &amp; Sun)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Promo Code <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="ENTER CODE"
                            className="flex-1 min-w-0 px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-mono uppercase text-slate-900 placeholder-slate-400 focus:border-[#EE2C3C] focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={isApplyingPromo || !promoCode.trim()}
                            onClick={handleApplyPromo}
                            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold cursor-pointer disabled:opacity-50 shrink-0 transition-colors"
                          >
                            {isApplyingPromo ? '...' : 'Apply'}
                          </button>
                        </div>
                        {promoFeedback && (
                          <p className={`text-[11px] mt-1 font-medium ${appliedDiscount ? 'text-emerald-700' : 'text-red-600'}`}>
                            {promoFeedback}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (5 Cols): Clean Neutral MNC Light Order Summary Sidebar */}
                <div className="lg:col-span-5 bg-[#F8FAFC] p-5 sm:p-7 flex flex-col justify-between gap-5 border-t lg:border-t-0 lg:border-l border-slate-200">
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3.5 shadow-2xs">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Order Summary
                      </div>

                      <div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {course.duration || '12 Weeks Certified'} &bull; {course.category || 'Engineering CAD'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Program Tuition Fee</span>
                          <span className="font-semibold text-slate-900">₹{baseCourseFee.toLocaleString('en-IN')}</span>
                        </div>
                        {appliedDiscount && (
                          <div className="flex justify-between text-emerald-700 font-medium">
                            <span>Promo ({appliedDiscount.code})</span>
                            <span>-₹{appliedDiscount.discount.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600">
                          <span>LMS Portal &amp; RTX Lab</span>
                          <span className="text-emerald-700 font-semibold">Included</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Total Payable
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-slate-900">
                          ₹{payableFee.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Clean Corporate Guarantees Box */}
                    <div className="px-1 space-y-2 text-xs text-slate-600">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Included Upon Payment
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>Automatic student enrollment &amp; instant course unlock</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>Full HD video classes, PDF materials &amp; live labs</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>Verified Razorpay receipt &amp; portal login credentials</span>
                      </div>
                    </div>
                  </div>

                  {/* Single-Line Crisp Primary CTA */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-sm font-semibold shadow-xs transition-colors active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white shrink-0" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Initializing Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay ₹{payableFee.toLocaleString('en-IN')} Securely</span>
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                      <span>256-Bit SSL Encrypted</span>
                      <span>UPI &bull; Cards &bull; NetBanking</span>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
