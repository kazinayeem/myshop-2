import { useState } from "react";
import {
  useGetordersQuery,
  useUpdateordersMutation,
} from "../redux/Api/orderApi";
import Loading from "../components/Loading";
import { motion } from "framer-motion";

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

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Failed to fetch orders.</p>;

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
        All Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">User</th>
              <th className="p-3">Products</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <motion.tr
                key={order._id}
                className="border-b transition hover:bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3 text-center">{order.userId?.username}</td>
                <td className="p-3 text-center">
                  {order.products.map((product) => (
                    <div
                      key={product.productId?._id}
                      className="text-sm text-gray-700"
                    >
                      {product.productId?.name} ({product.quantity})
                    </div>
                  ))}
                </td>
                <td className="p-3 text-center font-semibold">
                  ${order.amount}
                </td>
                <td className="p-3 text-center text-blue-600 font-medium">
                  {order.status}
                </td>
                <td className="p-3 text-center">
                  {selectedOrder === order._id ? (
                    <div className="flex justify-center items-center gap-2">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="p-2 border rounded-md focus:ring focus:ring-blue-300"
                      >
                        <option value="">Select Status</option>
                        {[
                          "pending",
                          "shipped",
                          "delivered",
                          "cancelled",
                          "returned",
                          "refunded",
                          "failed",
                          "completed",
                          "processing",
                        ].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <motion.button
                        onClick={() => handleUpdateStatus(order._id)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                        whileTap={{ scale: 0.95 }}
                      >
                        Update
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      onClick={() => setSelectedOrder(order._id)}
                      className="bg-gray-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
                      whileTap={{ scale: 0.95 }}
                    >
                      Change Status
                    </motion.button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
