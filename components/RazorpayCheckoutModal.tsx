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

    // Priority 1: Pre-fill from initialCandidate (e.g. EnrollmentSection form)
    if (initialCandidate) {
      if (initialCandidate.fullName) setFullName(initialCandidate.fullName);
      if (initialCandidate.email) setEmail(initialCandidate.email);
      if (initialCandidate.phone) setPhone(initialCandidate.phone);
      if (initialCandidate.preferredBatch) setPreferredBatch(initialCandidate.preferredBatch);
    }

    // Priority 2: Pre-fill missing fields from active logged-in session
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
          setPromoFeedback(`Applied ${code}: ₹${calc.toLocaleString('en-IN')} instant scholarship saved.`);
        } else {
          setAppliedDiscount(null);
          setPromoFeedback('Coupon not active or not applicable to this program.');
        }
      }
    } catch {
      setPromoFeedback('Could not validate coupon right now.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Full name, registered email address, and WhatsApp/mobile number are mandatory to unlock your LMS course.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Create order on server
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

      // 2. If server issued a sandbox/demo order (placeholder merchant keys), present Test Mode Gateway Simulator
      if (orderData.isMockOrder) {
        setSandboxOrderData(orderData);
        setIsLoading(false);
        return;
      }

      // 3. Load official Razorpay Checkout SDK for live keys
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

      // Immediately log user in / sync unlocked course & receipt across Student Portal
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden z-10 my-auto max-h-[94vh] flex flex-col"
        >
          {/* Corporate Top Header Strip */}
          <div className="bg-[#0F172A] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EE2C3C] flex items-center justify-center text-white shadow-sm shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black tracking-wide uppercase">
                    Direct Admissions &amp; Razorpay Checkout
                  </h3>
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
                    Auto-Unlock Enabled
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Complete registration details to activate your LMS Portal &amp; unlock course modules instantly
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="overflow-y-auto flex-1">
            {paymentSuccessData ? (
              /* ==================== STEP 3: INSTANT COURSE UNLOCKED RECEIPT ==================== */
              <div className="p-6 sm:p-10 max-w-2xl mx-auto text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-2">
                    Payment Verified &bull; Enrolled Automatically
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                    Course Unlocked in Your Student Portal!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Your seat is confirmed and <strong className="text-slate-900">{paymentSuccessData.courseTitle}</strong> is now active in your account.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Payment Transaction
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Receipt No:</span>
                      <span className="font-bold font-mono text-slate-900">{paymentSuccessData.receiptId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment ID:</span>
                      <span className="font-bold font-mono text-slate-900 truncate max-w-[140px]">{paymentSuccessData.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Amount Paid:</span>
                      <span className="font-black text-emerald-700">₹{paymentSuccessData.amount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                      LMS Portal Credentials
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Student ID:</span>
                      <span className="font-black font-mono text-slate-900">{paymentSuccessData.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Login Email:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">{paymentSuccessData.email || email}</span>
                    </div>
                    {paymentSuccessData.tempPassword ? (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Default Password:</span>
                        <span className="font-black font-mono text-[#EE2C3C]">{paymentSuccessData.tempPassword}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Account Status:</span>
                        <span className="font-bold text-emerald-700">Active &amp; Unlocked</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={(paymentSuccessData.email || email) ? `/portal/student?email=${encodeURIComponent(paymentSuccessData.email || email)}` : '/portal/student'}
                    onClick={onClose}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Open Unlocked Course in Portal</span>
                    <span>&rarr;</span>
                  </Link>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : sandboxOrderData ? (
              /* ==================== STEP 2 (TEST MODE): RAZORPAY SANDBOX SIMULATOR ==================== */
              <div className="p-6 sm:p-8 max-w-xl mx-auto space-y-5">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Razorpay Test Gateway Simulation
                    </div>
                    <div className="text-sm font-bold mt-0.5">{course.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">Order: {sandboxOrderData.orderId}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase">Payable</div>
                    <div className="text-xl font-black text-white">₹{(sandboxOrderData.amountInRupees || payableFee).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Select Payment Method (Sandbox Test)
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'upi', label: 'UPI / QR', sub: 'GPay, PhonePe' },
                      { id: 'card', label: 'Cards', sub: 'Visa, Mastercard' },
                      { id: 'netbanking', label: 'NetBanking', sub: 'SBI, HDFC, ICICI' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSandboxMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          sandboxMethod === m.id
                            ? 'border-[#EE2C3C] bg-red-50/50 ring-2 ring-[#EE2C3C]/15'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs font-black text-slate-900">{m.label}</div>
                        <div className="text-[10px] text-slate-500">{m.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  Clicking complete below verifies this transaction on the server, generates your official receipt, and <strong>automatically enrolls &amp; unlocks this course</strong> in your Student Portal.
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleCompleteSandboxPayment}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Verifying & Unlocking Course...' : `Pay ₹${(sandboxOrderData.amountInRupees || payableFee).toLocaleString('en-IN')} & Unlock Course →`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSandboxOrderData(null)}
                    className="px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              /* ==================== STEP 1: SPLIT 2-COLUMN CHECKOUT PATTERN ==================== */
              <form onSubmit={handlePayNow} className="grid grid-cols-1 lg:grid-cols-12">
                {/* LEFT COLUMN (7 Cols): Candidate & Enrollment Details */}
                <div className="lg:col-span-7 p-5 sm:p-7 space-y-5 bg-white">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  {/* Section 01: Candidate Identity */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A]">
                        01. Candidate Identity
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">Fields with * are required</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-[#EE2C3C]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter candidate full name (used on Certificate)"
                        className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/10 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address <span className="text-[#EE2C3C]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp / Mobile <span className="text-[#EE2C3C]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98490 12345"
                          className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:ring-2 focus:ring-red-500/10 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 02: Academic & Training Preferences */}
                  <div className="space-y-3.5 pt-1">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0F172A]">
                        02. Academic &amp; Batch Configuration
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Qualification
                        </label>
                        <select
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:bg-white focus:border-[#EE2C3C] focus:outline-none transition-all"
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
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          College / Company
                        </label>
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. JNTUH / L&T"
                          className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          City / Location
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Hyderabad"
                          className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Training Mode Selector Pills */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Training Mode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          'Offline Campus + RTX Lab',
                          'Live Instructor Online',
                          'Hybrid (Lab + Online)',
                        ].map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setTrainingMode(mode)}
                            className={`px-3 py-2 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                              trainingMode === mode
                                ? 'border-[#EE2C3C] bg-red-50 text-[#EE2C3C]'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Preferred Batch Slot
                        </label>
                        <select
                          value={preferredBatch}
                          onChange={(e) => setPreferredBatch(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-[#EE2C3C] focus:outline-none transition-all"
                        >
                          <option value="weekday-morning">Weekday Morning (08:00 AM – 10:30 AM)</option>
                          <option value="weekday-afternoon">Weekday Afternoon (02:00 PM – 04:30 PM)</option>
                          <option value="weekday-evening">Weekday Evening (06:30 PM – 09:00 PM)</option>
                          <option value="weekend-fasttrack">Weekend Fast-Track (Sat &amp; Sun)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Promo / Referral Code (Optional)
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="ENTER CODE"
                            className="flex-1 min-w-0 px-3 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#EE2C3C] focus:outline-none"
                          />
                          <button
                            type="button"
                            disabled={isApplyingPromo || !promoCode.trim()}
                            onClick={handleApplyPromo}
                            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 shrink-0"
                          >
                            {isApplyingPromo ? '...' : 'Apply'}
                          </button>
                        </div>
                        {promoFeedback && (
                          <p className={`text-[10px] mt-1 font-semibold ${appliedDiscount ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {promoFeedback}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (5 Cols): Executive Dark Order Summary & Pay CTA */}
                <div className="lg:col-span-5 bg-[#0F172A] text-white p-5 sm:p-7 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-slate-800">
                  <div className="space-y-5">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                        Enrollment Summary
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white mt-2.5 leading-snug">
                        {course.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                        <span>{course.duration || '12 Weeks Certified'}</span>
                        <span>&bull;</span>
                        <span>{course.category || 'Industrial CAD/BIM'}</span>
                      </div>
                    </div>

                    {/* Fee Breakdown Card */}
                    <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-2.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Program Tuition Fee</span>
                        <span className="font-bold">₹{baseCourseFee.toLocaleString('en-IN')}</span>
                      </div>
                      {appliedDiscount && (
                        <div className="flex justify-between text-emerald-400 font-semibold">
                          <span>Coupon ({appliedDiscount.code})</span>
                          <span>-₹{appliedDiscount.discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-300">
                        <span>LMS Portal &amp; RTX Lab</span>
                        <span className="text-emerald-400 font-bold uppercase text-[10px] px-2 py-0.5 bg-emerald-500/10 rounded">Included</span>
                      </div>
                      <div className="pt-2.5 border-t border-slate-700 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Total Payable
                        </span>
                        <span className="text-2xl font-black text-white">
                          ₹{payableFee.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Auto-Unlock Guarantees */}
                    <div className="space-y-2 text-[11px] text-slate-300">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Instant Benefits Upon Payment:
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                        <span>Automatic student enrollment &amp; instant course unlock</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                        <span>HD video lectures, PDF study materials &amp; live sessions</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                        <span>Official Razorpay payment receipt generated immediately</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Submit CTA */}
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#EE2C3C] hover:bg-[#D71E2E] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Initializing Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay ₹{payableFee.toLocaleString('en-IN')} &amp; Unlock Course</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
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
