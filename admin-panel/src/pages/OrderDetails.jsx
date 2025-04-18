import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import {
  useDeleteordersMutation,
  useGetordersByIdQuery,
  useUpdateordersMutation,
} from "../redux/Api/orderApi";
import { takaSign } from "../utils/Currency";
import { generateInvoicePDF } from "../utils/invoiceGenerator";
import { useGetbrandsQuery } from "../redux/Api/brandApi";
import Swal from "sweetalert2";
const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useGetordersByIdQuery(id);
  const [updateOrder] = useUpdateordersMutation();
  // delete order
  const [deleteOrder] = useDeleteordersMutation();
  const { data: brands } = useGetbrandsQuery();

  const logo = brands && brands.length > 0 ? brands[0].logo : null;
  const brandName = brands && brands.length > 0 ? brands[0].name : null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dueAmount, setDueAmount] = useState();
  const [paidAmount, setPaidAmount] = useState();
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (order) {
      setNewStatus(order.status || "");
      setTransactionId(order.transactionId || "");
      setTransactionStatus(order.transactionStatus || "");
      setPaymentStatus(order.paymentStatus || "");
      setPaymentMethod(order.paymentMethod || "");
      setDueAmount(order.dueAmount);
      setPaidAmount(order.paidAmount);
      setDeliveryCharge(order.deliveryCharge || 0);
      setNumber(order.number || 0);
    }
  }, [order]);

  const handleUpdateOrder = async () => {
    // loading swal
    Swal.fire({
      title: "Updating Order...",
      text: "Please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      await updateOrder({
        id,
        status: newStatus,
        transactionId,
        transactionStatus,
        paymentStatus,
        paymentMethod,
        dueAmount,
        paidAmount,
        deliveryCharge,
        number,
      }).unwrap();
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Order Updated",
        text: "Order details updated successfully.",
        confirmButtonText: "OK",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update order details", error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      // show confirmation dialog
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (!confirmDelete) return;
      // delete order
      await deleteOrder(id).unwrap();
      alert("Order deleted successfully");
      navigate("/dashboard/orders");
    } catch (error) {
      console.error("Failed to delete order", error);
    }
  };

  const handleDownloadInvoice = () => {
    generateInvoicePDF({
      logo,
      brandName,
      name: order?.userId?.username || "N/A",
      email: order?.userId?.email || "N/A",
      userPhone: order?.userId?.mobileNumber || "N/A",
      order,
      address: order?.address || {},
      totalPrice: order?.totalPrice || 0,
      transactionId: order?.transactionId || "N/A",
      transactionStatus: order?.transactionStatus || "N/A",
      paymentStatus: order?.paymentStatus || "N/A",
      paymentMethod: order?.paymentMethod || "N/A",
      dueAmount: order?.dueAmount || 0,
      paidAmount: order?.paidAmount || 0,
      date: order?.createdAt || new Date(),
      deliveryCharge: order?.deliveryCharge || 0,
      payment_Number: order?.number || 0,
      // size and color
      variant: order?.products?.map((product) => product.variant),
      color: order?.products?.map((product) => product.color),
    });
  };

  if (isLoading) return <div className="text-center p-5">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 p-5">Error loading order.</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>

      <div className="border-b pb-4 mb-4">
        <p className="text-gray-600">
          Order ID: <span className="font-medium">{order._id || "N/A"}</span>
        </p>
        <p className="text-gray-600">
          Total Price:{" "}
          <span className="font-medium">
            {takaSign()} {order.totalPrice || "N/A"}
          </span>
        </p>
      </div>

      {/* show order information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Order Information</h3>
        {order?.products?.map((product) => (
          <div key={product._id} className="border-b py-2">
            <p className="text-gray-600">
              Product:{" "}
              <span className="font-medium">
                {product?.productId?.name || "No"}
              </span>
            </p>
            <p className="text-gray-600">
              Quantity: <span className="font-medium">{product.quantity}</span>
            </p>
            {/* varient */}
            {product?.variant && (
              <p className="text-gray-600">
                Size / Variant:{" "}
                <span className="font-medium">{product.variant}</span>
              </p>
            )}
            {/* color */}
            {product?.color && (
              <p className="text-gray-600">
                Color: <span className="font-medium">{product.color}</span>
              </p>
            )}
          </div>
        ))}
      </div>
      {/* address */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
        <p className="text-gray-600">
          Name:{" "}
          <span className="font-medium">
            {order?.userId?.username || "N/A"}
          </span>
        </p>
        <p className="text-gray-600">
          User Phone:{" "}
          <span className="font-medium">
            {order?.userId?.mobileNumber || "N/A"}
          </span>
        </p>
        {order?.address && (
          <div key={order.address._id} className="border-b py-2">
            <p className="text-gray-600">
              Address:{" "}
              <span className="font-medium">
                {order.address.addressLine1 || "N/A"}{" "}
                {order.address.addressLine2
                  ? `, ${order.address.addressLine2}`
                  : ""}
              </span>
            </p>
            <p className="text-gray-600">
              division:{" "}
              <span className="font-medium">
                {order.address.division || "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              district:{" "}
              <span className="font-medium">
                {order.address.district || "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              upazilla:{" "}
              <span className="font-medium">
                {order.address.upazilla || "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              union:{" "}
              <span className="font-medium">
                {order.address.union || "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              zipCode:{" "}
              <span className="font-medium">
                {order.address.zipCode || "N/A"}
              </span>
            </p>

            <p className="text-gray-600">
              Order Number:{" "}
              <span className="font-medium">
                {order.address.phoneNumber || "N/A"}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* payment information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
        <p className="text-gray-600">
          Transaction ID:{" "}
          <span className="font-medium">{order.transactionId || "N/A"}</span>
        </p>
        <p className="text-gray-600">
          Transaction Status:{" "}
          <span className="font-medium">
            {order.transactionStatus || "N/A"}
          </span>
        </p>
        <p className="text-gray-600">
          Payment Status:{" "}
          <span className="font-medium">{order.paymentStatus || "N/A"}</span>
        </p>
        <p className="text-gray-600">
          Payment Method:{" "}
          <span className="font-medium">{order.paymentMethod || "N/A"}</span>
        </p>
        <p className="text-gray-600">
          Delivery Charge:{" "}
          <span className="font-medium">
            {takaSign()} {order.deliveryCharge || 0}
          </span>
        </p>
        <p className="text-gray-600">
          Due Amount:{" "}
          <span className="font-medium">
            {takaSign()} {order.dueAmount || 0}
          </span>
        </p>
        <p className="text-gray-600">
          Paid Amount:{" "}
          <span className="font-medium">
            {takaSign()} {order.paidAmount || 0}
          </span>
        </p>
        <p className="text-gray-600">
          Order Status:{" "}
          <span className="font-medium">{order.status || "N/A"}</span>
        </p>
        <p className="text-gray-600">
          Payment Number:{" "}
          <span className="font-medium">{order.number || "N/A"}</span>
        </p>
        <p className="text-gray-600">
          Order Date:{" "}
          <span className="font-medium">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </p>
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Edit Order
      </button>
      <button
        onClick={handleDeleteOrder}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
      >
        Delete Order
      </button>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="p-5 bg-white rounded-lg shadow-md max-w-lg mx-auto"
      >
        <h3 className="text-lg font-semibold mb-3">Edit Order Details</h3>
        <label>
          Status:
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
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
        </label>
        <label>
          Transaction ID:
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </label>
        <label>
          Transaction Status:
          <select
            value={transactionStatus}
            onChange={(e) => setTransactionStatus(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            {["success", "failed", "pending"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Payment Status:
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            {["paid", "pending", "failed"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          Payment Method:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            {["bkash", "nagod", "cash_on_delivery"].map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <label>
          Paid Amount:
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </label>
        {/* payment for number */}
        <label>
          Payment Number:
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </label>
        <label>
          Delivery Charge:
          <input
            type="number"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </label>
        <label>
          Due Amount:
          <input
            type="number"
            value={dueAmount}
            onChange={(e) => setDueAmount(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </label>
        <button
          onClick={handleUpdateOrder}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition mt-2"
        >
          Save Changes
        </button>
      </ReactModal>

      <div className="mt-6 text-center">
        <button
          onClick={handleDownloadInvoice}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
