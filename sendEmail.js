// sendEmail.js

import { Resend } from "resend";

console.log("🟢 Loading sendEmail.js (Resend Version)");

const resend = new Resend(process.env.RESEND_API_KEY);

const formatObjectAsHtml = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
    .join("");

/**
 * Sends confirmation emails to both the company and the user via Resend API.
 */
export const sendCompanyAndUserEmails = async ({
  formData,
  userEmail,
  userName,
  subjectPrefix = "",
}) => {
  try {
    // Company/admin email
    const companyMail = {
      from: "Lihaxa <noreply@lihaxa.com>", // must match verified domain
      to: process.env.COMPANY_EMAIL || "admin@lihaxa.com",
      subject: `${subjectPrefix} New Waitlist Signup: ${userName || userEmail}`,
      html: `
        <h2> New Waitlist Submission</h2>
        <p>A new user just signed up on Lihaxa.</p>
        ${formatObjectAsHtml(formData)}
        <hr/>
        <small>Sent automatically from Lihaxa backend</small>
      `,
    };

    // User confirmation email
    const userMail = {
      from: "Lihaxa <noreply@lihaxa.com>",
      to: userEmail,
      subject: `${subjectPrefix} Thank You for Joining the Waitlist`,
      html: `
        <p>Dear ${userName || "User"},</p>
        <p>Thank you for signing up with <strong>Lihaxa Health</strong>. 
        Your submission was received successfully.</p>
        <p>We'll reach out once we begin onboarding doctors and patients.</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>The Lihaxa Team</strong></p>
        <hr/>
        <small>This is an automated message — please do not reply.</small>
      `,
    };

    console.log(" Sending emails via Resend...");

    const [companyResult, userResult] = await Promise.all([
      resend.emails.send(companyMail),
      resend.emails.send(userMail),
    ]);

    console.log(" Emails sent successfully via Resend");
    return { ok: true, companyResult, userResult };
  } catch (err) {
    console.error(" Resend email error:", err);
    return { ok: false, error: err };
  }
};




