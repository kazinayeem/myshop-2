import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { takaSign } from "./Currency";

const logoPath = "https://i.ibb.co/yGz1JpX/825159-preview.jpg";

export const generateInvoicePDF = ({
  name,
  email,
  userPhone,
  order,
  address,
  totalPrice,
  transactionId,
  transactionStatus,
  paymentStatus,
  paymentMethod,
  dueAmount,
  paidAmount,
  date,
  deliveryCharge,
}) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Add Logo
  const imgWidth = 40;
  const imgHeight = 20;
  doc.addImage(logoPath, "PNG", 10, 10, imgWidth, imgHeight);

  // Shop Name
  doc.setFontSize(20);
  doc.text("MY SHOP", 105, 20, { align: "center" });

  // Invoice Title
  doc.setFontSize(12);
  doc.text(`Invoice #${order._id}`, 14, 40);

  // User & Order Details (Compact Format)
  doc.setFontSize(10);
  doc.text(`User: ${name} | Email: ${email} | Phone: ${userPhone}`, 14, 50);
  doc.text(
    `Address: ${address?.addressLine1}, ${address?.city} - ${address?.zipCode}`,
    14,
    55
  );
  doc.text(
    `Status: ${order.status} | Transaction: ${transactionId} (${transactionStatus})`,
    14,
    60
  );
  doc.text(
    `Payment: ${paymentStatus} | Method: ${paymentMethod} | Paid: ${takaSign()} ${paidAmount} | Due: ${takaSign()} ${dueAmount}`,
    14,
    65
  );
  doc.text(`Order Date: ${new Date(date).toLocaleString()}`, 14, 70);

  // Table Headers
  const tableColumn = ["Product", "Quantity", "Price", "Total"];
  const tableRows = order.products.map((product) => [
    product.productId?.name || "Unknown",
    product.quantity,
    `${takaSign()} ${product.price.toFixed(2) || "0.00"}`,
    `${takaSign()} ${(product.quantity * product.price).toFixed(2)}`,
  ]);

  // Generate Table
  let finalY = 80;
  if (tableRows.length > 0) {
    autoTable(doc, {
      startY: finalY,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });
    finalY = doc.lastAutoTable.finalY + 10;
  }

  // Total Before Delivery Charge
  doc.setFontSize(12);
  doc.text(`Subtotal: ${takaSign()} ${totalPrice.toFixed(2)}`, 14, finalY);

  // Delivery Charge & Final Total
  finalY += 6;
  doc.text(
    `Delivery Charge: ${takaSign()} ${deliveryCharge.toFixed(2)}`,
    14,
    finalY
  );
  finalY += 6;
  doc.text(
    `Total Amount: ${takaSign()} ${(totalPrice + deliveryCharge).toFixed(2)}`,
    14,
    finalY
  );

  // Footer with generated date, time, and website
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 40;
  const generatedDate = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 105, footerY, { align: "center" });
  doc.text("MY SHOP", 105, footerY + 5, { align: "center" });
  doc.text("Contact: +91 9876543210", 105, footerY + 10, { align: "center" });
  doc.text("Email: support@myshop.com", 105, footerY + 15, { align: "center" });
  doc.text("Address: Dhaka, Bangladesh", 105, footerY + 20, {
    align: "center",
  });
  doc.text(`Generated on: ${generatedDate}`, 105, footerY + 30, {
    align: "center",
  });
  doc.text("Website: www.nayeemsofr.com", 105, footerY + 35, {
    align: "center",
  });

  // Save PDF
  doc.save(`Invoice_${order._id}.pdf`);
};
