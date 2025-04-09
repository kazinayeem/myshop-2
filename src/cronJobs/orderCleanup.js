import cron from "node-cron";
import Order from "../model/order.model.js";

import User from "../model/user.model.js"; // Import User model
import Order from "../model/order.model.js"; // Import Order model

const cleanupFailedPayments = async () => {
  try {
    const failedOrders = await Order.find({ paymentStatus: "failed" });
    if (failedOrders.length === 0) {
      console.log("No failed payment orders found.");
      return;
    }

    for (const order of failedOrders) {
      const user = await User.findById(order.userId);
      if (!user) {
        console.log(`No user found for order with ID ${order._id}`);
        continue;
      }
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $pull: { orderhistory: order._id } },
        { new: true }
      );

      console.log(
        `Order with ID ${order._id} removed from user's orderhistory.`
      );
      console.log("Updated User:", updatedUser);
    }
  } catch (error) {
    console.error("Error during cleanup of failed payment orders:", error);
  }
};

// Schedule a cron job to run every 2 minutes
cron.schedule("*/1 * * * *", async () => {
  console.log("Running daily cleanup: removing failed payment orders...");

  await cleanupUserOrders();
  console.log("Daily cleanup completed.");
});
