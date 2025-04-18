import nodemailer from "nodemailer";
import { envData } from "../config/envdata.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envData.user,
    pass: envData.pass,
  },
});

// Delivered Email Template
export const deliveryConfirmationTemplate = ({ name, orderId }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Order Delivered</title>
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
          color: #28a745;
        }
        .content {
          font-size: 16px;
          color: #555;
          text-align: center;
        }
        .order-id {
          font-weight: bold;
          color: #007BFF;
        }
        .footer {
          font-size: 14px;
          text-align: center;
          color: #888;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Delivered Successfully</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>We're happy to let you know that your order <span class="order-id">#${orderId}</span> has been successfully delivered.</p>
          <p>We hope you enjoy your purchase! If you have any questions or concerns, feel free to contact us.</p>
        </div>
        <div class="footer">
          <p>Need help? <a href="mailto:kazinayeem55085@gmail.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send delivery confirmation email
export async function sendDeliveryConfirmationMail({ email, name, orderId }) {
  try {
    const htmlContent = deliveryConfirmationTemplate({ name, orderId });
    const textContent = `Hi ${name}, your order #${orderId} has been successfully delivered. We hope you enjoy your purchase!`;

    const info = await transporter.sendMail({
      from: '"Nayeem Shop" <kazinayeem55085@gmail.com>',
      to: email,
      subject: "🎉 Your Order Has Been Delivered",
      text: textContent,
      html: htmlContent,
    });

    console.log("✅ Delivery confirmation sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send delivery confirmation:", error.message);
  }
}
