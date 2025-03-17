import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { takaSign } from "./Currency";

const logoPath = "https://i.ibb.co.com/yGz1JpX/825159-preview.jpg";

export const generateInvoicePDF = ({
  name,
  email,
  order,
  userPhone,
  address,
}) => {
  const doc = new jsPDF("p", "mm", "a4"); // Ensure the page is A4 size

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

  // User Details
  doc.setFontSize(12);
  doc.text(`User: ${name || "Unknown"}`, 14, 50);
  doc.text(`Email: ${email || "N/A"}`, 14, 60);
  doc.text(`Phone: ${userPhone || "N/A"}`, 14, 70); // User phone number

  // Address Fields
  const addressLine1 = address?.addressLine1 || "N/A";
  const addressLine2 = address?.addressLine2 || "";
  const city = address?.city || "N/A";
  const state = address?.state || "N/A";
  const zipCode = address?.zipCode || "N/A";

  doc.text(
    `Address: ${addressLine1}, ${addressLine2}, ${city}, ${state} - ${zipCode}`,
    14,
    80
  );
  doc.text(`Status: ${order.status}`, 14, 90);

  // Table Headers
  const tableColumn = ["Product", "Quantity", "Price", "Total"];
  const tableRows = order.products.map((product) => [
    product.productId?.name || "Unknown",
    product.quantity,
    `${takaSign()} ${product.productId?.price?.toFixed(2) || "0.00"}`,
    `${takaSign()} ${(
      product.quantity * (product.productId?.price || 0)
    ).toFixed(2)}`,
  ]);

  // Generate Table
  let finalY = 100;
  if (tableRows.length > 0) {
    autoTable(doc, {
      startY: finalY,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });
    finalY = doc.lastAutoTable.finalY + 10;
  }

  // Total Amount
  doc.setFontSize(14);
  doc.text(
    `Total Amount:  ${takaSign()} ${order.totalPrice.toFixed(2)}`,
    14,
    finalY
  );

  // Footer with generated date, time, and website
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 40; // Place the footer 40mm from the bottom of the page

  const generatedDate = new Date().toLocaleString(); // Current date and time
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 105, footerY, { align: "center" });
  doc.text("MY SHOP", 105, footerY + 5, { align: "center" });
  doc.text("Contact: +91 9876543210", 105, footerY + 10, { align: "center" });
  doc.text("Email: support@myshop.com", 105, footerY + 15, {
    align: "center",
  });
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
