import nodemailer from "nodemailer";

/**
 * Send an email to the specified recipients with the given subject and body.
 *
 * @param {object} options
 * @param {string[]} options.to Recipient email addresses
 * @param {string} options.subject Email subject
 * @param {string} options.html Email body in HTML format
 * @param {number} [options.retries=2] Number of times to retry sending the email
 *   in case of failure
 * @returns {Promise<void>}
 */
export async function sendEmail({
  to,
  subject,
  html,
  retries = 2,
}: {
  to: string[];
  subject: string;
  html: string;
  retries?: number;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error("SMTP configuration is missing in environment variables");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Send the email
      await transporter.sendMail({
        from: SMTP_FROM,
        to: to.join(","),
        subject,
        html,
      });
      return; // Success!
    } catch (err) {
      lastError = err;
      if (attempt === retries) throw err; // Give up after last try
      await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}
