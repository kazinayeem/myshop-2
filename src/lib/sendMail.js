// mailer.js
import nodemailer from "nodemailer";
import { envData } from "../config/envdata.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envData.user,
    pass: envData.pass,
  },
});

// Email HTML Template Generator
export const emailTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset OTP</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f7fc;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .header h1 {
          font-size: 24px;
          text-align: center;
          color: #333;
        }
        .content {
          font-size: 16px;
          color: #555;
        }
        .otp {
          display: inline-block;
          background: #007BFF;
          color: white;
          font-weight: bold;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          font-size: 14px;
          text-align: center;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for the next 10 minutes. If you did not request this, please ignore the email.</p>
        </div>
        <div class="footer">
          <p>Need help? <a href="mailto:kazinayeem55085.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send email
export async function sendMailConfig({ email, name, otp }) {
  try {
    const htmlContent = emailTemplate(name, otp);
    const textContent = `Hello ${name}, Your OTP is ${otp}.`;

    const info = await transporter.sendMail({
      from: '"Nayeem Support" <kazinayeem55085@gmail.com>',
      to: email,
      subject: "Reset Password",
      text: textContent,
      html: htmlContent,
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
}
