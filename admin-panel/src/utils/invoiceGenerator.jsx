import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { takaSign } from "./Currency";

// const logoPath = "https://i.ibb.co/yGz1JpX/825159-preview.jpg";

export const generateInvoicePDF = ({
  logo,
  brandName,
  name,
  email,
  userPhone,
  order,
  address,
  totalPrice,
  transactionId,
  paymentMethod,
  paidAmount,
  date,
  deliveryCharge,
  variant,
  color,
}) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Add Logo
  doc.addImage(logo, "PNG", 10, 10, 40, 20);

  // Shop Name
  doc.setFontSize(18);
  doc.text(brandName, 105, 20, { align: "center" });

  // Invoice Title
  doc.setFontSize(12);
  doc.text(`Invoice #${order._id}`, 14, 40);

  // User & Order Details
  doc.setFontSize(10);
  doc.text(`Customer: ${name} | ${email} | ${userPhone}`, 14, 50);
  doc.text(
    `Address: ${address?.addressLine1}, ${address?.city} - ${address?.zipCode}`,
    14,
    55
  );
  doc.text(
    `Transaction ID: ${transactionId} | Payment: ${paymentMethod} | Paid: ${takaSign()} ${paidAmount}`,
    14,
    60
  );
  doc.text(`Date: ${new Date(date).toLocaleString()}`, 14, 65);

  // Table Headers
  const tableColumn = [
    "Product",
    "Size",
    "Color",
    "Quantity",
    "Price",
    "Total",
  ];
  const tableRows = order.products.map((product, index) => [
    product.productId?.name || "Unknown",
    variant?.[index] || "N/A",
    color?.[index] || "N/A",
    product.quantity,
    `${takaSign()} ${product.price.toFixed(2)}`,
    `${takaSign()} ${(product.quantity * product.price).toFixed(2)}`,
  ]);

  // Generate Table
  let finalY = 75;
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
  doc.setFontSize(12);
  doc.text(`Subtotal: ${takaSign()} ${totalPrice.toFixed(2)}`, 14, finalY);
  finalY += 6;
  doc.text(
    `Delivery Charge: ${takaSign()} ${deliveryCharge.toFixed(2)}`,
    14,
    finalY
  );
  finalY += 6;
  doc.text(
    `Total: ${takaSign()} ${(totalPrice + deliveryCharge).toFixed(2)}`,
    14,
    finalY
  );

  // Footer
  const footerY = doc.internal.pageSize.height - 30;
  doc.setFontSize(10);
  doc.text("Thank you for your purchase!", 105, footerY, { align: "center" });
  doc.text("MY SHOP | Dhaka, Bangladesh", 105, footerY + 5, {
    align: "center",
  });
  doc.text("Website: www.nayeemsofr.com", 105, footerY + 10, {
    align: "center",
  });

  // Bottom left corner - Invoice generated date/time
  doc.setFontSize(8);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    14,
    doc.internal.pageSize.height - 10
  );

  // Save PDF
  doc.save(`Invoice_${order._id}.pdf`);
};
