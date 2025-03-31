import PropTypes from "prop-types";
import { Chart } from "react-google-charts";

const UserAnalysisCharts = ({ userDetails }) => {
  const totalSales = userDetails.orderhistory?.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  // Prepare chart data
  const ordersChartData = [
    ["Order Status", "Count"],
    [
      "Pending",
      userDetails.orderhistory?.filter((order) => order.status === "pending")
        .length || 0,
    ],
    [
      "Delivered",
      userDetails.orderhistory?.filter((order) => order.status === "delivered")
        .length || 0,
    ],
    [
      "Cancelled",
      userDetails.orderhistory?.filter((order) => order.status === "cancelled")
        .length || 0,
    ],
    [
      "Returned",
      userDetails.orderhistory?.filter((order) => order.status === "returned")
        .length || 0,
    ],
    [
      "Refunded",
      userDetails.orderhistory?.filter((order) => order.status === "refunded")
        .length || 0,
    ],
    [
      "Failed",
      userDetails.orderhistory?.filter((order) => order.status === "failed")
        .length || 0,
    ],
    [
      "In Progress",
      userDetails.orderhistory?.filter(
        (order) => order.status === "in progress"
      ).length || 0,
    ],
    [
      "Shipped",
      userDetails.orderhistory?.filter((order) => order.status === "shipped")
        .length || 0,
    ],
  ];

  const salesChartData = [
    ["Month", "Sales ($)"],
    ["Jan", totalSales],
    ["Feb", totalSales],
    ["Mar", totalSales],
    ["Apr", totalSales],
    ["May", totalSales],
    ["Jun", totalSales],
    ["Jul", totalSales],
    ["Aug", totalSales],
    ["Sep", totalSales],
    ["Oct", totalSales],
    ["Nov", totalSales],
    ["Dec", totalSales],
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">User Data Analysis</h2>

      {/* Order Status Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold">Order Status</h3>
        <Chart
          chartType="PieChart"
          data={ordersChartData}
          width="100%"
          height="400px"
        />
      </div>

      {/* Total Sales Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold">Total Sales</h3>
        <Chart
          chartType="BarChart"
          data={salesChartData}
          width="100%"
          height="400px"
        />
      </div>
    </div>
  );
};
UserAnalysisCharts.propTypes = {
  userDetails: PropTypes.shape({
    orderhistory: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number,
        status: PropTypes.string,
        products: PropTypes.arrayOf(
          PropTypes.shape({
            productId: PropTypes.string,
            quantity: PropTypes.number,
          })
        ),
      })
    ),
  }).isRequired,
};

export default UserAnalysisCharts;
