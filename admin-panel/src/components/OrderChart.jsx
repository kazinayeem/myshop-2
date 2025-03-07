import { Chart } from "react-google-charts";
import { useGetordersQuery } from "../redux/Api/orderApi";
import Loading from "./Loading";

const OrderChart = () => {
  const { data: orders, isLoading, isError } = useGetordersQuery();

  if (isLoading) return <Loading/>;
  if (isError) return <div>Error loading orders</div>;
  if (!orders || orders.length === 0) return <div>No orders available</div>;

  const data = [["Order ID", "Total Amount"]];
  orders.forEach((order) => {
    data.push([order.userId.email, order.amount]);
  });

  const options = {
    title: "Order Amounts",
    hAxis: { title: "Order ID", textPosition: "none" },
    vAxis: { title: "Amount ($)" },
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
