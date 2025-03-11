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

  doc.setFontSize(20);
  doc.text("MY SHOP - Profile Summary", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Username: ${user.username}`, 14, 30);
  doc.text(`Email: ${user.email}`, 14, 40);
  doc.text(`Total Orders: ${orderCount}`, 14, 50);
  doc.text(`Total Amount Spent: ₹${totalAmount}`, 14, 60);
  doc.text(`Total Profit: ₹${totalProfit}`, 14, 70);
  doc.text(`Total Loss: ₹${totalLoss}`, 14, 80);

  const tableColumn = [
    "Order ID",
    "Product Name",
    "Status",
    "Amount",
    "Profit/Loss",
  ];

  const tableRows = orders
    .map((order) => {
      return order.products.map((product) => {
        const { price, buyingPrice } = product.productId;
        const { quantity } = product;
        const validPrice =
          typeof price === "number" && !isNaN(price) ? price : 0;
        const validBuyingPrice =
          typeof buyingPrice === "number" && !isNaN(buyingPrice)
            ? buyingPrice
            : 0;
        const validQuantity =
          typeof quantity === "number" && !isNaN(quantity) ? quantity : 0;

        const profitLoss = (validPrice - validBuyingPrice) * validQuantity;

        const status = profitLoss < 0 ? "Loss" : "Profit";
        const statusColor = profitLoss < 0 ? "#f8d7da" : "#d4edda"; // red for loss, green for profit
        const profitLossAmount =
          profitLoss < 0 ? `₹${Math.abs(profitLoss)}` : `₹${profitLoss}`;

        return [
          order._id,
          product.productId.name,
          status,
          `₹${order.totalPrice}`,
          profitLossAmount, 
          statusColor, 
        ];
      });
    })
    .flat(); 

  // Add the table to the PDF document
  autoTable(doc, {
    startY: 90,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    columnStyles: {
      2: { fillColor: (row) => row[5] }, 
      4: { halign: "center" }, 
    },
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
  doc.save(`${user.username}_${Math.round(Math.random() * 100000)}Profile.pdf`);
};
