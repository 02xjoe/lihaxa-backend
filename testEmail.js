// testEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

console.log("Script loaded"); // Debug: Confirm script starts
dotenv.config();
console.log("Dotenv loaded");

console.log("Environment variables:", {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS ? "[REDACTED]" : undefined,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  COMPANY_EMAIL: process.env.COMPANY_EMAIL,
});

async function sendTestEmail() {
  try {
    console.log("Creating transporter");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true, // true for port 465 (SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Verifying transporter");
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP verification error:", error.message, error);
          reject(error);
        } else {
          console.log("SMTP server is ready");
          resolve(success);
        }
      });
    });

    console.log("Sending test email to:", process.env.EMAIL_USER);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // admin@lihaxa.com
      subject: "Zoho SMTP Test",
      html: `<p>This is a test email from Node.js using Zoho SMTP.</p>`,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err.message, err);
  }
}

console.log("Starting sendTestEmail");
sendTestEmail()
  .then(() => console.log("sendTestEmail completed"))
  .catch((err) => console.error("❌ Uncaught error in sendTestEmail:", err.message, err))
  .finally(() => console.log("Script execution finished"));

process.on("exit", (code) => {
  console.log("Process exited with code:", code);
});



/*// backend/utils/sendEmail.js
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

//console.log("📧 Using SMTP:", {
//  host: process.env.SMTP_HOST,
//  user: process.env.EMAIL_USER,
//  pass: process.env.EMAIL_PASS ? "✅ loaded" : "❌ missing",
//  company: process.env.COMPANY_EMAIL
//});

//  Create transporter (connect to Zoho SMTP)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,      // smtp.zoho.com
    port: process.env.SMTP_PORT,      // 465
    secure: true,                     // true for port 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER,   // admin@lihaxa.com
      pass: process.env.EMAIL_PASS,   // app-specific password
    },
  });
};



// small helpers to build HTML/text bodies:
const formatObjectAsHtml = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
    .join("");

export const sendCompanyAndUserEmails = async ({ formData, userEmail, userName, subjectPrefix = "" }) => {
  const transporter = createTransporter();

  // Email to company (all fields)
  const companyMail = {
    from: process.env.EMAIL_USER,
    to: process.env.COMPANY_EMAIL,
    subject: `${subjectPrefix} New Waitlist Signup: ${userName || userEmail}`,
    html: `<h3>New waitlist signup</h3>${formatObjectAsHtml(formData)}`,
  };

  // Email to user (confirmation)
  const userMail = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `${subjectPrefix} Thanks for joining the waitlist`,
    html: `<p>Hi ${userName || ""},</p>
           <p>Thanks for joining the waitlist. We received your details:</p>
           ${formatObjectAsHtml(formData)}
           <p>We will be in touch soon.</p>`,
  };

  try {
    // send company email first
    await transporter.sendMail(companyMail);
    // then send confirmation to user
    await transporter.sendMail(userMail);
    return { ok: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { ok: false, error: err };
  }
};
*/