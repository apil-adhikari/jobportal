import nodemailer from 'nodemailer';

// Use environment variables:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    // No SMTP config: return null so sendMail will fall back to logging (dev-friendly)
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  const from =
    process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@example.com';

  if (!transporter) {
    // Development fallback: log the email instead of sending
    console.info('SMTP not configured. Skipping email send.');
    console.info('Email payload:', { from, to, subject, text, html });
    return { accepted: [to], message: 'logged' };
  }

  const info = await transporter.sendMail({ from, to, subject, html, text });
  return info;
};

export const sendVerificationEmail = async (to, otp) => {
  const subject = 'Verify your email';
  const html = `<p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;
  const text = `Your verification code is ${otp}. It expires in 10 minutes.`;
  return sendMail({ to, subject, html, text });
};

export const sendApplicationStatusEmail = async (
  to,
  applicantName,
  jobTitle,
  newStatus
) => {
  const subject = `Application status updated: ${jobTitle}`;
  const html = `<p>Hi ${applicantName},</p><p>Your application for <strong>${jobTitle}</strong> has been updated to <strong>${newStatus}</strong>.</p>`;
  const text = `Hi ${applicantName},\nYour application for ${jobTitle} has been updated to ${newStatus}.`;
  return sendMail({ to, subject, html, text });
};

export default { sendVerificationEmail, sendApplicationStatusEmail };
