import { Chart } from "react-google-charts";
import { useGetOrdersQuery } from "../redux/Api/orderApi";
import Loading from "./Loading";

const OrderChart = () => {
  const { data: orders, isLoading, isError } = useGetOrdersQuery();

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading orders</div>;
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return <div>No orders available</div>;
  }

  // Prepare chart data
  const data = [["Order ID", "Total Amount"]];
  orders.forEach((order) => {
    // Make sure userId.email is available
    const orderId = order._id || `Order-${order._id}`; // Fallback for missing email
    data.push([orderId, order.totalPrice]);
  });

  const options = {
    title: "Order Amounts",
    hAxis: {
      title: "Order ID",
      textPosition: "none",
    },
    vAxis: {
      title: "Amount (Taka)", // Adjusted to match your currency
    },
    legend: "none",
  };

  return (
    <div>
      <h2>Order Chart</h2>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default OrderChart;
