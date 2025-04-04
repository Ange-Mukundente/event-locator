const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email notification
 * @param {string} email - Recipient's email
 * @param {string} subject - Email subject
 * @param {string} message - Email body text
 */
const sendEmail = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"Event Notifier" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendEmail };  
