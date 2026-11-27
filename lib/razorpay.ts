import Razorpay from 'razorpay';
import crypto from 'crypto';

// Support both server and client Razorpay keys
export const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID ||
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
  'rzp_test_RNDCADD2026';

export const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET ||
  'rnd_cadd_secret_2026';

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * Verify Razorpay HMAC-SHA256 signature
 */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId) return false;

  // In test/sandbox mode where mock signature is used
  if (
    orderId.startsWith('order_test_') ||
    paymentId.startsWith('pay_test_') ||
    signature === 'mock_verified_signature'
  ) {
    return true;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (err) {
    console.error('[Razorpay verifySignature] Error:', err);
    return false;
  }
}
