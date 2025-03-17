import { useState } from "react";
import { useGetOrdersQuery } from "../redux/Api/orderApi";
import OrderDetails from "../components/OrderDetails";
import TotalSaleandProfite from "../components/TotalSaleandProfite";
import Loading from "../components/Loading";

const ProfilePage = () => {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");

  const {
    data: orders,
    isLoading,
    isError,
  } = useGetOrdersQuery(startDate && endDate ? { startDate, endDate } : {});

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Error loading orders.</p>;

  return (
    <div className="container mx-auto p-6">
      <TotalSaleandProfite />

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
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
      </div>
      <div data-headlessui-state={orders}>
        <OrderDetails orders={orders} />
      </div>

      {/* <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        {orders.map((order) => (
          <div key={order._id} className="border-b border-gray-300 pb-4 mb-4">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>
              Status:{" "}
              <span className="font-medium text-blue-600">{order.status}</span>
            </p>
            <p>
              Total Price:{" "}
              <span className="font-medium">
                ${order.totalPrice.toFixed(2)}
              </span>
            </p>
            <div className="mt-2">
              <h3 className="font-semibold">Products:</h3>
              <ul className="list-disc list-inside ml-4">
                {order.products.map((product) => (
                  <li key={product._id} className="mt-2">
                    {product.productId ? (
                      <>
                        <p className="font-semibold">
                          {product.productId.name}
                        </p>
                        <p>Quantity: {product.quantity}</p>
                        <p>
                          Buying Price: $
                          {product.productId.buyingPrice.toFixed(2)}
                        </p>
                        <p>Selling Price: ${product.price.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-gray-500">
                        Product information not available.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default ProfilePage;
