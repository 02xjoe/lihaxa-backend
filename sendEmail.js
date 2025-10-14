// sendEmail.js
import nodemailer from "nodemailer";

console.log("Loading sendEmail.js");
console.log("SMTP config:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.EMAIL_USER,
});

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.zoho.com",
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: true, // true for port 465 (SSL)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) console.error("SMTP verification error:", error.message);
    else console.log("SMTP server is ready");
  });

  return transporter;
};

const formatObjectAsHtml = (obj) =>
  Object.entries(obj)
    .map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
    .join("");

export const sendCompanyAndUserEmails = async ({ formData, userEmail, userName, subjectPrefix = "" }) => {
  const transporter = createTransporter();

  const companyMail = {
    from: process.env.EMAIL_USER,
    to: process.env.COMPANY_EMAIL, // admin@lihaxa.com
    subject: `${subjectPrefix} New Waitlist Signup: ${userName || userEmail}`,
    html: `<h3>New waitlist signup</h3>${formatObjectAsHtml(formData)}`,
  };

  const userMail = {
    from: process.env.EMAIL_USER,
    to: userEmail, // User’s email from form
    subject: `${subjectPrefix} Thanks for joining the waitlist`,
    html: `<p>Hi ${userName || ""},</p>
           <p>Thanks for joining the waitlist. We received your details:</p>
           ${formatObjectAsHtml(formData)}
           <p>We will be in touch soon.</p>`,
  };

  try {
    console.log("Sending company email to:", companyMail.to);
    await transporter.sendMail(companyMail);
    console.log("Company email sent");
    console.log("Sending user email to:", userMail.to);
    await transporter.sendMail(userMail);
    console.log("User email sent");
    return { ok: true };
  } catch (err) {
    console.error("Email send error:", err.message, err);
    return { ok: false, error: err };
  }
};




/*
// backend/utils/sendEmail.js
import nodemailer from "nodemailer";



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