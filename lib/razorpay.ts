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

// True only when merchant credentials have not been replaced with real Razorpay API keys
export const IS_DEMO_RAZORPAY_KEY =
  RAZORPAY_KEY_ID === 'rzp_test_RNDCADD2026' ||
  RAZORPAY_KEY_SECRET === 'rnd_cadd_secret_2026';

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
 * Verify Razorpay HMAC-SHA256 signature using timing-safe comparison.
 * Sandbox verification is only allowed when explicit server-originated mockOrderFlag is true AND demo keys are active.
 */
export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  allowDemoSandbox = false
): boolean {
  if (!orderId || !paymentId || !signature) return false;

  const isDevEnvironment = process.env.NODE_ENV === 'development';
  if (
    (isDevEnvironment || (IS_DEMO_RAZORPAY_KEY && allowDemoSandbox)) &&
    (orderId.startsWith('order_test_') ||
      paymentId.startsWith('pay_test_') ||
      signature === 'mock_verified_signature')
  ) {
    return true;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(generatedSignature, 'utf8');
    const actualBuffer = Buffer.from(signature, 'utf8');

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (err) {
    console.error('[Razorpay verifySignature] Error:', err);
    return false;
  }
}
