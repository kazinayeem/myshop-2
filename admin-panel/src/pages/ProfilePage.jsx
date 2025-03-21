import { useState } from "react";
import { useGetOrdersQuery } from "../redux/Api/orderApi";
import OrderDetails from "../components/OrderDetails";
import TotalSaleandProfite from "../components/TotalSaleandProfite";
import Loading from "../components/Loading";
import { generateProfilePDF } from "../utils/pdfUtils";
import DatetoDateFilter from "../components/DatetoDateFilter";
import { useGetbrandsQuery } from "../redux/Api/brandApi";

const ProfilePage = () => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const { data: brands } = useGetbrandsQuery();

  const logo = brands && brands.length > 0 ? brands[0].logo : null;
  const brandName = brands && brands.length > 0 ? brands[0].name : null;
  const {
    data: orders,
    isLoading,
    isError,
  } = useGetOrdersQuery(startDate && endDate ? { startDate, endDate } : {});
  // Ensure orders is an array and has data
  const calculateFinancials = (orders) => {
    if (!Array.isArray(orders))
      return { totalSales: 0, totalProfit: 0, totalLoss: 0 };

    let totalSales = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    orders.forEach((order) => {
      if (Array.isArray(order.products)) {
        order.products.forEach((product) => {
          if (product.productId) {
            const costPrice = product.productId.buyingPrice * product.quantity;
            const sellingPrice = product.price * product.quantity;
            const profitOrLoss = sellingPrice - costPrice;

            totalSales += sellingPrice;
            if (profitOrLoss > 0) {
              totalProfit += profitOrLoss;
            } else {
              totalLoss += Math.abs(profitOrLoss);
            }
          }
        });
      }
    });

    return { totalSales, totalProfit, totalLoss };
  };

  const generateReport = () => {
    const { totalSales, totalProfit, totalLoss } = calculateFinancials(
      orders || []
    );
    const reportData = {
      logo,
      brandName,
      startDate,
      endDate,
      totalAmount: totalSales,
      orderCount: orders.length,
      totalProfit,
      totalLoss,
      orders,
    };

    generateProfilePDF(reportData);
  };

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Error loading orders.</p>;

  return (
    <div className="container mx-auto p-6">
      <TotalSaleandProfite endDate={endDate} startDate={startDate} />

      {/* generate report button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={generateReport}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Generate Report
        </button>
      </div>

      <DatetoDateFilter
        endDate={endDate}
        setEndDate={setEndDate}
        startDate={startDate}
        setStartDate={setStartDate}
      />

      {/* last 7, 10 ,and 30 day filter */}
      <div className="flex justify-end mb-4">
        <select
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded-md focus:ring focus:ring-blue-300"
        >
          {/* value as a date */}
          <option value="">Select Date</option>
          <option value={today}>Today</option>
          <option
            value={
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
          >
            Last 7 Days
          </option>
          <option
            value={
              new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
          >
            Last 10 Days
          </option>
          <option
            value={
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
          >
            Last 30 Days
          </option>
        </select>
      </div>

      {/* <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Filter Orders</h2>
        <div className="flex space-x-4 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

      </div> */}

      <div data-headlessui-state={orders}>
        <OrderDetails orders={orders} />
      </div>
    </div>
  );
};

export default ProfilePage;
