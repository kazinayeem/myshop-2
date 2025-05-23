import { useGetOrdersQuery } from "../redux/Api/orderApi";
import { takaSign } from "../utils/Currency";
import PropTypes from "prop-types";

export default function TotalSaleandProfite({ startDate, endDate }) {
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrdersQuery(startDate && endDate ? { startDate, endDate } : {});
  const orders = order && order.orders ? order.orders : [];

  if (isLoading) return <p className="text-center text-gray-600">Loading...</p>;
  if (isError)
    return <p className="text-center text-red-500">Error loading orders.</p>;

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
            let costPrice = product.productId.buyingPrice * product.quantity;
            let sellingPrice = product.price * product.quantity;

            // Check if the product has a selected price variant
            if (product.productId.priceByVariant && product.variant) {
              const selectedVariant = product.productId.priceByVariant.find(
                (v) => v.value === product.variant
              );
              if (selectedVariant) {
                costPrice = selectedVariant.buyingPrice * product.quantity;
                sellingPrice = selectedVariant.price * product.quantity;
              }
            }

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

  const { totalSales, totalProfit, totalLoss } = calculateFinancials(
    orders || []
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold mb-4">Financial Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Total Sales</p>
          <p className="text-xl font-bold">
            {takaSign()}
            {totalSales.toFixed(2)}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Total Profit</p>
          <p className="text-xl font-bold">
            {takaSign()}
            {totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-lg font-semibold">Total Loss</p>
          <p className="text-xl font-bold">
            {takaSign()}
            {totalLoss.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

// props types
TotalSaleandProfite.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};
