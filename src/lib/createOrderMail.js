import nodemailer from "nodemailer";
import { envData } from "../config/envdata.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envData.user,
    pass: envData.pass,
  },
});
export const orderConfirmationTemplate = ({
  name,
  orderId,
  items,
  totalAmount,
}) => {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 0;">${item.name}</td>
        <td style="padding: 8px 0;">${item.quantity}</td>
        <td style="padding: 8px 0;">${item.price}</td>
      </tr>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Order Confirmation</title>
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
        .order-id {
          font-weight: bold;
          color: #007BFF;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border-bottom: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .total {
          font-weight: bold;
          margin-top: 20px;
          text-align: right;
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
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Thank you for your purchase! Your order <span class="order-id">#${orderId}</span> has been confirmed.</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
          <p class="total">Total: ${totalAmount}</p>
          <p>You will receive another email once your items have shipped.</p>
        </div>
        <div class="footer">
          <p>Need help? <a href="mailto:kazinayeem55085@gmail.com">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to send order confirmation email
export async function sendOrderConfirmationMail({
  email,
  name,
  orderId,
  items,
  totalAmount,
}) {
  try {
    const htmlContent = orderConfirmationTemplate({
      name,
      orderId,
      items,
      totalAmount,
    });
    const textContent = `Hi ${name}, your order #${orderId} has been confirmed. Total amount: ${totalAmount}.`;

    const info = await transporter.sendMail({
      from: '"Nayeem Shop" <kazinayeem55085@gmail.com>',
      to: email,
      subject: "Order Confirmed - Your Purchase Receipt",
      text: textContent,
      html: htmlContent,
    });

    console.log("✅ Order confirmation sent:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send order confirmation:", error.message);
  }
}
