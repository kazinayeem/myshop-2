import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";
import DatetoDateFilter from "../components/DatetoDateFilter";
import Loading from "../components/Loading";
import { useGetOrdersQuery } from "../redux/Api/orderApi";

export default function ShowAllOrders() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useGetOrdersQuery({
    page,
    limit,
    ...(startDate && endDate ? { startDate, endDate } : {}),
    ...(searchId ? { orderId: searchId } : {}),
  });

  if (isLoading) return <Loading />;
  if (isError)
    return <p className="text-center text-red-500">Failed to fetch orders.</p>;

  const totalPages = Math.ceil((orders?.totalOrders || 1) / limit);

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

      {/* Search & Filters */}
      <div className="flex justify-between mb-4">
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
            className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
          >
            Search
          </motion.button>
          <motion.button
            className="bg-gray-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-600 transition ml-2"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchId("");
              refetch();
            }}
          >
            Clear
          </motion.button>
          {/* set limit */}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
              setPage(1);
              refetch();
            }}
            className="ml-4 p-2 border rounded-md"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <DatetoDateFilter
        endDate={endDate}
        setEndDate={setEndDate}
        startDate={startDate}
        setStartDate={setStartDate}
      />

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">Date</th>
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
            {orders?.orders?.map((order) => (
              <motion.tr
                key={order._id}
                className="border-b transition hover:bg-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3 text-sm">
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="p-2 text-sm">{order._id}</td>
                <td className="p-2">
                  {order.userId?.username.slice(0, 10) || "POS"}
                </td>
                <td className="p-2">
                  {order.products.map((product) => (
                    <div key={product._id}>
                      {product.productId?.name.slice(0, 20)}.. (
                      {product.quantity})
                    </div>
                  ))}
                </td>
                <td className="p-2">{order.totalPrice.toFixed(2)}</td>
                <td className="p-2 text-sm text-blue-600">{order.status}</td>
                <td className="p-2 text-green-600">{order.paymentStatus}</td>
                <td className="p-2">
                  <motion.button
                    onClick={() => navigate(`/dashboard/orders/${order._id}`)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-green-600 transition ml-2"
                    whileTap={{ scale: 0.95 }}
                  >
                    See More
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded-lg ${
            page > 1
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-2 rounded-lg ${
            page < totalPages
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
