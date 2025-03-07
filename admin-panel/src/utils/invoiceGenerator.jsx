import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const logoPath = "https://i.ibb.co.com/yGz1JpX/825159-preview.jpg";

export const generateInvoicePDF = ({ name, email, order }) => {
  const doc = new jsPDF("p", "mm", "a4"); // Ensure the page is A4 size

  // Add Logo
  const imgWidth = 40;
  const imgHeight = 20;
  doc.addImage(logoPath, "PNG", 10, 10, imgWidth, imgHeight);

  // Shop Name
  doc.setFontSize(20);
  doc.text("MY SHOP", 105, 20, { align: "center" });

  // Invoice Title
  doc.setFontSize(16);
  doc.text(`Invoice #${order._id}`, 14, 40);

  // User Details
  doc.setFontSize(12);
  doc.text(`User: ${name || "Unknown"}`, 14, 50);
  doc.text(`Email: ${email || "N/A"}`, 14, 60);
  doc.text(`Status: ${order.status}`, 14, 70);

  // Table Headers
  const tableColumn = ["Product", "Quantity", "Price", "Total"];
  const tableRows = order.products.map((product) => [
    product.productId?.name || "Unknown",
    product.quantity,
    `$${product.productId?.price?.toFixed(2) || "0.00"}`,
    `$${(product.quantity * (product.productId?.price || 0)).toFixed(2)}`,
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

  // Total Amount
  doc.setFontSize(14);
  doc.text(`Total Amount: $${order.amount.toFixed(2)}`, 14, finalY);

  // Refund and Warranty Policy
  const policyText = `
  Refund Policy:
  - If you're not satisfied with your purchase, you can return the product within 30 days of receipt for a full refund.
  - The product must be unused and in the original packaging to qualify for a refund.
  
  Warranty:
  - All products come with a 1-year warranty from the date of purchase.
  - The warranty covers manufacturing defects but does not cover damage caused by misuse or accidents.
  `;
  doc.setFontSize(10);
  doc.text(policyText, 14, finalY + 20);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 40; // Place the footer 40mm from the bottom of the page

  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 105, footerY, { align: "center" });
  doc.text("MY SHOP", 105, footerY + 5, { align: "center" });
  doc.text("Contact: +91 9876543210", 105, footerY + 10, { align: "center" });
  doc.text("Email: support@myshop.com", 105, footerY + 15, { align: "center" });
  doc.text("Address: Mumbai, India", 105, footerY + 20, { align: "center" });
  // Save PDF
  doc.save(`Invoice_${order._id}.pdf`);
};

export const generateAllInvoicesPDF = ({ orders, name, email }) => {
  const doc = new jsPDF("p", "mm", "a4"); // Ensure the page is A4 size

  doc.setFontSize(20);
  doc.text("MY SHOP", 105, 15, { align: "center" });

  let yOffset = 30;
  orders.forEach((order, index) => {
    if (index > 0) doc.addPage(); // Add new page for each order

    doc.setFontSize(16);
    doc.text(`Invoice #${order._id}`, 14, yOffset);

    doc.setFontSize(12);
    doc.text(`User: ${name || "Unknown"}`, 14, yOffset + 10);
    doc.text(`Email: ${email || "N/A"}`, 14, yOffset + 20);
    doc.text(`Status: ${order.status}`, 14, yOffset + 30);

    const tableColumn = ["Product", "Quantity", "Price", "Total"];
    const tableRows = order.products.map((product) => [
      product.productId?.name || "Unknown",
      product.quantity,
      `$${product.productId?.price?.toFixed(2) || "0.00"}`,
      `$${(product.quantity * (product.productId?.price || 0)).toFixed(2)}`,
    ]);

    let finalY = yOffset + 40;
    if (tableRows.length > 0) {
      autoTable(doc, {
        startY: finalY,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
      });
      finalY = doc.lastAutoTable.finalY + 10;
    }

    doc.setFontSize(14);
    doc.text(`Total Amount: $${order.amount.toFixed(2)}`, 14, finalY);

    // Refund and Warranty Policy
    // Refund and Warranty Policy
    const policyText = `
  Refund Policy:
  - If you're not satisfied with your purchase, you can return the product within 30 days of receipt for a full refund.
  - The product must be unused and in the original packaging to qualify for a refund.
  
  Warranty:
  - All products come with a 1-year warranty from the date of purchase.
  - The warranty covers manufacturing defects but does not cover damage caused by misuse or accidents.
  `;
    doc.setFontSize(10);
    doc.text(policyText, 14, finalY + 20);

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 40; // Place the footer 40mm from the bottom of the page

    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 105, footerY, { align: "center" });
    doc.text("MY SHOP", 105, footerY + 5, { align: "center" });
    doc.text("Contact: +91 9876543210", 105, footerY + 10, { align: "center" });
    doc.text("Email: support@myshop.com", 105, footerY + 15, {
      align: "center",
    });
    doc.text("Address: Mumbai, India", 105, footerY + 20, { align: "center" });
  });

  // Save PDF
  doc.save("All_Invoices.pdf");
};
