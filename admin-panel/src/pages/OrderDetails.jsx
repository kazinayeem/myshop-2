import { useParams } from "react-router";
import { useState } from "react";
import {
  useGetordersByIdQuery,
  useUpdateordersMutation,
} from "../redux/Api/orderApi";
import { takaSign } from "../utils/Currency";

const OrderDetails = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetordersByIdQuery(id);
  const [updateOrder] = useUpdateordersMutation();

  const [newStatus, setNewStatus] = useState(""); // State for selected status

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      await updateOrder({ id, status: newStatus }).unwrap();
      setNewStatus(""); // Reset status after update
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  if (isLoading) return <div className="text-center p-5">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 p-5">Error loading order.</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

      {/* Order Info */}
      <div className="border-b pb-4 mb-4">
        <p className="text-gray-600">
          Order ID: <span className="font-medium">{order._id}</span>
        </p>
        <p className="text-gray-600">
          Status:{" "}
          <span className="font-medium text-green-600">{order.status}</span>
        </p>
        <p className="text-gray-600">
          Total Price: <span className="font-medium"> {takaSign()} {order.totalPrice}</span>
        </p>
      </div>

      {/* Update Order Status */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Update Order Status</h3>
        <div className="flex gap-3 items-center">
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
          <button
            onClick={handleUpdateStatus}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">User Information</h3>
        <p>Name: {order.userId?.username}</p>
        <p>Email: {order.userId?.email}</p>
        <p>Phone: {order.userId?.mobileNumber}</p>
      </div>

      {/* Shipping Address */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Shipping Address</h3>
        <p>
          {order.address?.addressLine1}, {order.address?.addressLine2}
        </p>
        <p>
          {order.address?.city}, {order.address?.state} -{" "}
          {order.address?.zipCode}
        </p>
      </div>

      {/* Ordered Products */}
      <div>
        <h3 className="text-lg font-semibold">Ordered Products</h3>
        {order.products?.length > 0 ? (
          <ul className="divide-y">
            {order.products.map((item) => (
              <li key={item._id} className="py-3">
                {item.productId ? (
                  <div>
                    <p className="font-medium">{item.productId.name}</p>
                    <p>
                      Price:  {takaSign()} {item.price} | Quantity: {item.quantity}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Product not found</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
