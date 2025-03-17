import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const logoPath = "https://i.ibb.co/yGz1JpX/825159-preview.jpg"; // Ensure this is a valid image URL

export const generateProfilePDF = ({
  startDate,
  endDate,
  totalAmount,
  orderCount,
  totalProfit,
  totalLoss,
  orders,
}) => {
  const doc = new jsPDF("p", "mm", "a4");
  const imgWidth = 40;
  const imgHeight = 20;
  const margin = 14; // Left margin for text alignment

  // Add logo
  doc.addImage(logoPath, "PNG", 10, 10, imgWidth, imgHeight);
  doc.setFontSize(20);
  doc.text("MY SHOP - Sales Summary", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Total Orders: ${orderCount}`, margin, 50);
  doc.text(
    `Total Amount Spent: ${totalAmount.toLocaleString("en-BD")}`,
    margin,
    60
  );
  doc.text(`Total Profit: ${totalProfit.toLocaleString("en-BD")}`, margin, 70);
  doc.text(`Total Loss: ${totalLoss.toLocaleString("en-BD")}`, margin, 80);

  // Show period only if start and end dates are provided
  if (startDate && endDate) {
    doc.text(`Period: ${startDate} to ${endDate}`, margin, 90);
  } else {
    doc.text(`Period: All Time`, margin, 90);
  }

  doc.text("Order Details:", margin, 100);

  // Document generate date and time
  const date = new Date();
  const formattedDate = date.toLocaleString("en-BD", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Sort orders by Order ID
  const sortedOrders = [...orders].sort((a, b) => a._id.localeCompare(b._id));

  const tableColumn = [
    "Order ID",
    "Product Name",
    "Status",
    "Amount",
    "Profit/Loss",
  ];

  const tableRows = sortedOrders.flatMap((order) =>
    order.products.map((product) => {
      const productData = product.productId || {};
      const {
        name = "Unknown Product",
        price = 0,
        buyingPrice = 0,
      } = productData;
      const quantity = product.quantity || 0;
      const profitLoss = (price - buyingPrice) * quantity;

      return [
        order._id,
        name,
        profitLoss < 0 ? "Loss" : "Profit",
        `${order.totalPrice.toLocaleString("en-BD")}`,
        `${Math.abs(profitLoss).toLocaleString("en-BD")}`,
      ];
    })
  );

  let pageNumber = 0;

  // Generate table with page number and footer
  autoTable(doc, {
    startY: 110,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    columnStyles: {
      4: { halign: "center" },
    },
    didDrawPage: function () {
      pageNumber++;
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      // Generated on date (left-aligned)
      doc.setFontSize(7);
      doc.text(`Generated on: ${formattedDate}`, margin, pageHeight - 10);

      // Page number at the center
      doc.setFontSize(9);
      doc.text(
        `Page ${pageNumber} of ${doc.internal.getNumberOfPages()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      // Custom text on the right side (website)
      doc.setFontSize(7);
      doc.text("nayeemsoft - www.nayeem.com", pageWidth - 10, pageHeight - 10, {
        align: "right",
      });
    },
  });

  // Footer Section (shown on last page)
  // const pageHeight = doc.internal.pageSize.height;
  // const footerY = pageHeight - 40;

  // doc.setFontSize(10);
  // doc.text("Thank you for being a valued customer!", 105, footerY, {
  //   align: "center",
  // });
  // doc.text("MY SHOP", 105, footerY + 5, { align: "center" });
  // doc.text("Contact: +880 1712345678", 105, footerY + 10, { align: "center" });
  // doc.text("Email: support@myshop.com", 105, footerY + 15, { align: "center" });
  // doc.text("Address: Dhaka, Bangladesh", 105, footerY + 20, {
  //   align: "center",
  // });

  // Generate file name with random number
  const randomNumber = Math.round(Math.random() * 100000);
  const fileName =
    startDate && endDate
      ? `${startDate}-${endDate}-${randomNumber}.pdf`
      : `all-time-${randomNumber}.pdf`;

  doc.save(fileName);
};
