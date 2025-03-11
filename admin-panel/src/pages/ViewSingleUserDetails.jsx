import { motion } from "framer-motion";
import { useState } from "react";
import { useParams } from "react-router";
import Loading from "../components/Loading";
import UserAnalysisCharts from "../components/UserAnalysisCharts";
import { useUpdateordersMutation } from "../redux/Api/orderApi";
import { useGetUserByIdQuery } from "../redux/Api/userApi";
import {
  generateAllInvoicesPDF,
  generateInvoicePDF,
} from "../utils/invoiceGenerator";

const ViewSingleUserDetails = () => {
  const { userId } = useParams();
  const {
    data: userDetails,
    isLoading,
    error,
    refetch,
  } = useGetUserByIdQuery(userId);
  const [updateOrderStatus] = useUpdateordersMutation();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  if (isLoading) return <Loading />;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading user details</p>
    );

  const totalOrders = userDetails.orderhistory?.length || 0;
  const totalAmount = userDetails.orderhistory?.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  const handleStatusUpdate = async (orderId) => {
    if (!newStatus) return;
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      setSelectedOrderId(null);
      setNewStatus("");
      refetch();
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-6 max-w-5xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        User Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info */}
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700">
            {userDetails.username}
          </h2>
          <p className="text-gray-500">{userDetails.email}</p>
          <p className="font-medium text-lg mt-4 text-gray-800">
            Total Orders: {totalOrders}
          </p>
          <p className="font-medium text-lg text-gray-800">
            Total Amount: ${totalAmount.toFixed(2)}
          </p>

          {/* user mobileNumber */}
          {userDetails.mobileNumber && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Mobile</h3>
              <p className="text-gray-600">{userDetails.mobileNumber}</p>
            </div>
          )}

          {/* user address form user.address array*/}
          {userDetails.address && userDetails.address.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">Address</h3>
              <ul className="list-disc list-inside space-y-2 mt-2">
                {userDetails.address.map((address, index) => (
                  <li key={index} className="text-gray-600">
                    {address.addressLine1}, {address.addressLine2},{" "}
                    {address.state}, {address.zipCode}, {address.city}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Order History */}
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Order History
          </h3>
          {userDetails.orderhistory?.length > 0 ? (
            <div className="space-y-4">
              {userDetails.orderhistory.map((order) => (
                <div
                  key={order._id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="font-medium text-gray-800">
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p className="text-gray-600">
                    <strong>Total Amount:</strong> ${order.amount}
                  </p>
                  <p className="mt-2 font-semibold text-gray-800">Products:</p>
                  <ul className="ml-4 space-y-2">
                    {order.products.map((product) => (
                      <li
                        key={product._id}
                        className="flex justify-between bg-white p-2 rounded-lg shadow-md border border-gray-200"
                      >
                        <span className="font-medium text-gray-800">
                          {product.productId.name}
                        </span>
                        <span className="text-gray-600">
                          Qty: {product.quantity}
                        </span>
                        <span className="text-gray-600">
                          ${product.productId.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {selectedOrderId === order._id ? (
                    <div className="mt-4 flex items-center">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="p-2 border rounded w-full"
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
                      <button
                        onClick={() => handleStatusUpdate(order._id)}
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedOrderId(order._id)}
                      className="text-blue-500 hover:underline"
                    >
                      Change Status
                    </button>
                  )}
                  <button
                    className="text-blue-500 hover:underline ml-4"
                    onClick={() =>
                      generateInvoicePDF({
                        name: userDetails.username,
                        email: userDetails.email,
                        order,
                      })
                    }
                  >
                    Download Invoice
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
          <button
            className="text-blue-500 hover:underline mt-4"
            onClick={() =>
              generateAllInvoicesPDF({
                orders: userDetails.orderhistory,
                name: userDetails.username,
                email: userDetails.email,
              })
            }
          >
            Download All Invoices
          </button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <UserAnalysisCharts userDetails={userDetails} />
      </motion.div>
    </motion.div>
  );
};

export default ViewSingleUserDetails;
