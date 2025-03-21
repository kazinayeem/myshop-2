import { motion } from "framer-motion";
import { useState } from "react";
import Loading from "../components/Loading";
import {
  useGetOrdersQuery,
  useUpdateordersMutation,
} from "../redux/Api/orderApi";
import { useNavigate } from "react-router";
import { takaSign } from "../utils/Currency";
import DatetoDateFilter from "../components/DatetoDateFilter";

export default function ShowAllOrders() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const navigate = useNavigate();
  const {
    data: orders,
    isLoading,
    isError,
  } = useGetOrdersQuery(startDate && endDate ? { startDate, endDate } : {});
  const [updateOrder] = useUpdateordersMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchId, setSearchId] = useState("");

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

  // Filter orders based on selected status
  const filteredOrders = orders?.filter((order) => {
    // Apply status filter if provided
    const statusFilter = !filterStatus || order.status === filterStatus;

    // Apply orderId search filter
    const idFilter =
      !searchId || order._id.toLowerCase().includes(searchId.toLowerCase());

    return statusFilter && idFilter;
  });

  return (
    <motion.div
      className="min-w-full max-w-5xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">
        All Orders
      </h2>

      {/* Filter and Search */}
      <div className="flex justify-between mb-4 ">
        {/* Filter Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded-md focus:ring focus:ring-blue-300"
        >
          <option value="">All Orders</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
          <option value="returned">Returned</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
        </select>

        {/* Search by Order ID */}
        <div className="flex items-center">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by Order ID"
            className="p-2 border rounded-md mr-2"
          />
          <motion.button
            className="bg-gray-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-600 transition"
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchId("")}
          >
            Clear Search
          </motion.button>
        </div>
      </div>
      <DatetoDateFilter
        endDate={endDate}
        setEndDate={setEndDate}
        startDate={startDate}
        setStartDate={setStartDate}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Products</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((order) => (
              <motion.tr
                key={order._id}
                className="border-b transition hover:bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3 text-gray-700 font-semibold">{order._id}</td>
                <td className="p-3 text-center">{order.userId?.username}</td>
                <td className="p-3 text-center">
                  {order.products.map((product) => (
                    <div
                      key={product.productId?._id}
                      className="text-sm text-gray-700"
                    >
                      {product.productId?.name} ({product.quantity}) -{" "} ({
                      product.variant} - {product.color || "N/A"}) -{""}
                     
                    </div>
                  ))}
                </td>
                <td className="p-3 text-center font-semibold">
                  {takaSign()}
                  {order.totalPrice.toFixed(3)}
                </td>
                <td className="p-3 text-center text-blue-600 font-medium">
                  {order.status}
                </td>
                <td className="p-3 text-center text-green-600 font-medium">
                  {order.paymentStatus}
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
                  {/* See more */}
                  <motion.button
                    className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-green-600 transition ml-2"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                  >
                    See More
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
