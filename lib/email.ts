/**
 * Email & SMTP Dispatch Service
 * Configured to work out-of-the-box in development mode,
 * and seamlessly connect to real SMTP once credentials are provided in .env.local
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || 'no-reply@rndcadd.com';

  // If live SMTP credentials are configured:
  if (host && user && pass) {
    try {
      // Dynamic import to avoid build errors if nodemailer is optionally added
      const nodemailer = await import('nodemailer').catch(() => null);
      if (nodemailer) {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

        const info = await transporter.sendMail({
          from,
          to,
          subject,
          text,
          html,
        });

        console.log('[SMTP Email Sent]:', info.messageId);
        return { success: true, messageId: info.messageId };
      }
    } catch (err: any) {
      console.error('[SMTP Sending Error]:', err);
      return { success: false, error: err.message };
    }
  }

  // Development Fallback: Log OTP securely to server console
  console.log(`[Email Service Standby] To: ${to} | Subject: ${subject} | Content: ${text || html}`);
  return { success: true, messageId: 'simulated_' + Date.now() };
}
