import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateProfilePDF = ({
  user,
  totalAmount,
  orderCount,
  totalProfit,
  totalLoss,
  orders,
}) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Add Profile Info
  doc.setFontSize(20);
  doc.text("MY SHOP - Profile Summary", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Username: ${user.username}`, 14, 30);
  doc.text(`Email: ${user.email}`, 14, 40);
  doc.text(`Total Orders: ${orderCount}`, 14, 50);
  doc.text(`Total Amount Spent: ₹${totalAmount}`, 14, 60);
  doc.text(`Total Profit: ₹${totalProfit}`, 14, 70);
  doc.text(`Total Loss: ₹${totalLoss}`, 14, 80);

  // Add Orders Table
  const tableColumn = ["Order ID", "Status", "Amount", "Profit/Loss"];
  const tableRows = orders.map((order) => [
    order._id,
    order.status,
    `₹${order.amount}`,
    order.products.reduce((acc, product) => {
      // Destructure the product properties and check for valid values
      const { price, buyingPrice, quantity } = product.productId;

      // Check if price, buyingPrice, and quantity are valid numbers
      const validPrice = typeof price === "number" && !isNaN(price) ? price : 0;
      const validBuyingPrice =
        typeof buyingPrice === "number" && !isNaN(buyingPrice)
          ? buyingPrice
          : 0;
      const validQuantity =
        typeof quantity === "number" && !isNaN(quantity) ? quantity : 0;

      // Calculate the profit/loss for the product
      const profitLoss = (validPrice - validBuyingPrice) * validQuantity;

      return acc + profitLoss; // Accumulate profit/loss
    }, 0),
  ]);

  // Add the table to the PDF document
  autoTable(doc, {
    startY: 90,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 40;

  doc.setFontSize(10);
  doc.text("Thank you for being a valued customer!", 105, footerY, {
    align: "center",
  });
  doc.text("MY SHOP", 105, footerY + 5, { align: "center" });
  doc.text("Contact: +91 9876543210", 105, footerY + 10, { align: "center" });
  doc.text("Email: support@myshop.com", 105, footerY + 15, { align: "center" });
  doc.text("Address: Mumbai, India", 105, footerY + 20, { align: "center" });

  // Save PDF
  doc.save(`${user.username}_Profile.pdf`);
};
