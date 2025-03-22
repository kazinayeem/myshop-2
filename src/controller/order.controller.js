import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";

// order controller

//  create order
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { orderhistory: savedOrder._id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate, orderId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    let filter = {};

    // Date filtering
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default: Show only this month's orders
      const now = new Date();
      filter.createdAt = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      };
    }

    // Order ID search (supports both exact and partial search)
    if (orderId) {
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        filter._id = orderId;
      } else {
        filter._id = { $regex: orderId, $options: "i" }; 
      }
    }

    // Fetch orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "username email")
      .populate("products.productId")
      .populate("address");

    // Count total matching orders
    const totalOrders = await Order.countDocuments();

    res.status(200).json({ orders, totalOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// order by user id
export const getOrderByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
      .populate("products.productId", "name price buyingPrice")
      .populate("address");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update order
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    // remove order id from user order history
    await User.findByIdAndUpdate(
      deletedOrder.userId,
      { $pull: { orderhistory: deletedOrder._id } },
      { new: true }
    );

    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get order by id
export const getOrderById = async (req, res) => {
  try {
    console.log(req.params.id);
    const order = await Order.findById(req.params.id)

      .populate("userId", "username email mobileNumber")
      .populate("products.productId", "name price buyingPrice")
      .populate("address");
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get order by status
export const getOrderByStatus = async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get order by date
export const getOrderByDate = async (req, res) => {
  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(req.params.startDate),
        $lte: new Date(req.params.endDate),
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get order by amount
export const getOrderByAmount = async (req, res) => {
  try {
    const orders = await Order.find({ amount: req.params.amount });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
