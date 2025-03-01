import  { useState } from "react";
import { useGetordersQuery, useUpdateordersMutation } from "../redux/Api/orderApi";

export default function ShowAllOrders() {
  const { data: orders, isLoading, isError } = useGetordersQuery();
  const [updateOrder] = useUpdateordersMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleUpdateStatus = async (orderId) => {
    if (!newStatus) return;
    try {
      await updateOrder({ id: orderId, status: newStatus }).unwrap();
      setSelectedOrder(null);
      setNewStatus("");
    } catch (error) {
      console.error("Failed to update order", error);
    }
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to fetch orders.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Orders</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">User</th>
            <th className="border p-2">Products</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            <tr key={order._id} className="border">
              <td className="border p-2">{order.userId?.username}</td>
              <td className="border p-2">
                {order.products.map((product) => (
                  <div key={product.productId?._id}>
                    {product.productId?.name} ({product.quantity})
                  </div>
                ))}
              </td>
              <td className="border p-2">${order.amount}</td>
              <td className="border p-2">{order.status}</td>
              <td className="border p-2">
                {selectedOrder === order._id ? (
                  <div>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="p-1 border rounded"
                    >
                      <option value="">Select Status</option>
                      {["pending", "shipped", "delivered", "cancelled", "returned", "refunded", "failed", "completed", "processing"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(order._id)}
                      className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedOrder(order._id)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Change Status
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
