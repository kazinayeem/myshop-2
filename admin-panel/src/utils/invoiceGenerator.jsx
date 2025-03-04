import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // Shop Name
  doc.setFontSize(20);
  doc.text("MY SHOP", 105, 15, { align: "center" });

  // Invoice Title
  doc.setFontSize(16);
  doc.text(`Invoice #${order._id}`, 14, 30);

  // User Details
  doc.setFontSize(12);
  doc.text(`User: ${order.userId?.username || "Unknown"}`, 14, 40);
  doc.text(`Email: ${order.userId?.email || "N/A"}`, 14, 50);
  doc.text(`Status: ${order.status}`, 14, 60);

  // Table Headers
  const tableColumn = ["Product", "Quantity", "Price", "Total"];
  const tableRows = order.products.map((product) => [
    product.productId?.name || "Unknown",
    product.quantity,
    `$${product.productId?.price?.toFixed(2) || "0.00"}`,
    `$${(product.quantity * (product.productId?.price || 0)).toFixed(2)}`,
  ]);

  // Generate Table
  let finalY = 70;
  if (tableRows.length > 0) {
    autoTable(doc, {
      startY: finalY,
      head: [tableColumn],
      body: tableRows,
    });
    finalY = doc.lastAutoTable.finalY + 10;
  }

  // Total Amount
  doc.setFontSize(14);
  doc.text(`Total Amount: $${order.amount.toFixed(2)}`, 14, finalY);

  // Save PDF
  doc.save(`Invoice_${order._id}.pdf`);
};

export const generateAllInvoicesPDF = (orders) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("MY SHOP", 105, 15, { align: "center" });

  let yOffset = 30;

  orders.forEach((order, index) => {
    if (index > 0) doc.addPage(); // Add new page for each order

    doc.setFontSize(16);
    doc.text(`Invoice #${order._id}`, 14, yOffset);

    doc.setFontSize(12);
    doc.text(`User: ${order.userId?.username || "Unknown"}`, 14, yOffset + 10);
    doc.text(`Email: ${order.userId?.email || "N/A"}`, 14, yOffset + 20);
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
      });
      finalY = doc.lastAutoTable.finalY + 10;
    }

    doc.setFontSize(14);
    doc.text(`Total Amount: $${order.amount.toFixed(2)}`, 14, finalY);
  });

  // Save PDF
  doc.save("All_Invoices.pdf");
};
