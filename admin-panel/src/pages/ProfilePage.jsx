import React, { useEffect, useState } from "react";
import { useGetordersQuery } from "../redux/Api/orderApi";
import { generateProfilePDF } from "../utils/pdfUtils";
import { motion } from "framer-motion"; // Import Framer Motion
import Loading from "../components/Loading";

const ProfilePage = () => {
  const { data: orders, isLoading, isError } = useGetordersQuery();
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  useEffect(() => {
    if (orders) {
      let totalAmountSpent = 0;
      let profit = 0;
      let loss = 0;

      orders.forEach((order) => {
        totalAmountSpent += order.amount;
        order.products.forEach((product) => {
          const { quantity } = product;
          const { price, buyingPrice } = product.productId;

          if (
            typeof price === "number" &&
            typeof buyingPrice === "number" &&
            !isNaN(price) &&
            !isNaN(buyingPrice) &&
            typeof quantity === "number" &&
            !isNaN(quantity)
          ) {
            const profitLoss = (price - buyingPrice) * quantity;

            if (profitLoss > 0) {
              profit += profitLoss;
            } else {
              loss += profitLoss;
            }
          }
        });
      });

      setTotalAmount(totalAmountSpent);
      setOrderCount(orders.length);
      setTotalProfit(profit);
      setTotalLoss(loss);
    }
  }, [orders]);

  const handleGeneratePDF = () => {
    const user = { username: "UserName", email: "user@example.com" }; // Replace with actual data
    const profileData = {
      user,
      totalAmount,
      orderCount,
      totalProfit,
      totalLoss,
      orders,
    };
    generateProfilePDF(profileData);
  };

  if (isLoading)
    return (
      <motion.div animate={{ opacity: 0.5 }} className="text-center">
        <Loading />
      </motion.div>
    );
  if (isError) return <div>Error fetching data</div>;

  return (
    <motion.div
      className="font-sans bg-gray-50 min-h-screen py-12 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Your Profile
        </h1>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-lg">
            <strong>Username:</strong> Kazi Nayeem
          </p>
          <p className="text-lg">
            <strong>Email:</strong> kazi1@gmail.com
          </p>
          <p className="text-lg">
            <strong>Total Orders:</strong> {orderCount}
          </p>
          <p className="text-lg">
            <strong>Total Amount Spent:</strong> ₹{totalAmount}
          </p>

          {totalProfit > 0 && (
            <p className="text-lg text-green-600">
              <strong>Profit:</strong> ₹{totalProfit}
            </p>
          )}

          {totalLoss < 0 && (
            <p className="text-lg text-red-600">
              <strong>Loss:</strong> ₹{Math.abs(totalLoss)}
            </p>
          )}
        </motion.div>

        <motion.button
          onClick={handleGeneratePDF}
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Generate PDF
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mt-8">
            Your Orders
          </h2>
          {orders.map((order) => (
            <motion.div
              key={order._id}
              className="bg-gray-100 p-4 rounded-lg mt-4 shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-medium text-gray-700">
                Order ID: {order._id}
              </h3>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.productId.buyingPrice}
              </p>

              {/* Conditional rendering for Profit/Loss per order */}
              {order.products.reduce((acc, product) => {
                const { quantity } = product;
                const { price, buyingPrice } = product.productId;

                if (
                  typeof price === "number" &&
                  typeof buyingPrice === "number" &&
                  !isNaN(price) &&
                  !isNaN(buyingPrice) &&
                  typeof quantity === "number" &&
                  !isNaN(quantity)
                ) {
                  return acc + (price - buyingPrice) * quantity;
                }
                return acc;
              }, 0) > 0 ? (
                <React.Fragment>
                  <p className="text-green-600">
                    <strong>Profit:</strong> ₹
                    {order.products.reduce((acc, product) => {
                      const { quantity } = product;
                      const { price, buyingPrice } = product.productId;
                      return acc + (price - buyingPrice) * quantity;
                    }, 0)}
                  </p>
                  {order.products.map((product) => (
                    <p key={product.productId._id}>
                      <strong>
                        Buying Price {product.productId.buyingPrice}
                      </strong>
                    </p>
                  ))}
                </React.Fragment>
              ) : (
                <p className="text-red-600">
                  <strong>Loss:</strong> ₹
                  {Math.abs(
                    order.products.reduce((acc, product) => {
                      const { quantity } = product;
                      const { price, buyingPrice } = product.productId;
                      return acc + (price - buyingPrice) * quantity;
                    }, 0)
                  )}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
