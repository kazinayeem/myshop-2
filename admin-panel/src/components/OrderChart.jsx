import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const OrderChart = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

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
