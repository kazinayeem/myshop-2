import { useParams } from "react-router";
import { useGetUserByIdQuery } from "../redux/Api/userApi";
import UserAnalysisCharts from "../components/UserAnalysisCharts";

const ViewSingleUserDetails = () => {
  const { userId } = useParams();
  const { data: userDetails, isLoading, error } = useGetUserByIdQuery(userId);

  if (isLoading)
    return <p className="text-center text-xl">Loading user details...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Error loading user details</p>
    );

  // Calculate total orders and total amount
  const totalOrders = userDetails.orderhistory?.length || 0;
  const totalAmount = userDetails.orderhistory?.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6">User Details</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">{userDetails.username}</h2>
            <p className="text-gray-600">{userDetails.email}</p>
          </div>
          <div className="mt-4 md:mt-0 text-gray-700">
            <p className="font-medium text-lg">
              <strong>Total Orders:</strong> {totalOrders}
            </p>
            <p className="font-medium text-lg">
              <strong>Total Amount:</strong> ${totalAmount?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Address Handling */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Address</h3>
          <p className="text-gray-600">
            {userDetails.address?.length > 0
              ? `${userDetails.address[0]?.addressLine1}, ${userDetails.address[0]?.city}`
              : "No address available"}
          </p>
        </div>

        {/* Order History */}
        <div>
          <h3 className="text-xl font-semibold mt-6">Order History</h3>
          {userDetails.orderhistory?.length > 0 ? (
            <div className="space-y-4">
              {userDetails.orderhistory.map((order, index) => (
                <div
                  key={order._id}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ${order.amount}
                  </p>
                  <p className="mt-2 font-semibold">Products:</p>
                  <ul className="ml-4 space-y-2">
                    {order.products.map((product, index) => (
                      <li
                        key={product._id}
                        className="flex justify-between bg-white p-2 rounded-lg shadow-md border"
                      >
                        <span className="font-medium">
                          {product.productId.name}
                        </span>
                        <span>Qty: {product.quantity}</span>
                        <span className="text-gray-600">
                          ${product.productId.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
      <UserAnalysisCharts userDetails={userDetails} />
    </div>
  );
};

export default ViewSingleUserDetails;
