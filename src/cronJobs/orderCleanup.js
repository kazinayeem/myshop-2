import cron from "node-cron";
import Order from "../model/order.model.js";

// Schedule a cron job to run every 2 minutes
cron.schedule("*/30 * * * *", async () => {
  try {
    console.log("Running daily cleanup: removing failed payment orders...");

    const result = await Order.deleteMany({ paymentStatus: "failed" });
    if (result.deletedCount === 0) {
      console.log("No failed payment orders found.");
      return;
    }

    console.log(`Deleted ${result.deletedCount} failed orders.`);
  } catch (error) {
    console.error("Error during order cleanup:", error);
  }
});
