import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import SSLCommerzPayment from "sslcommerz-lts";
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";
import { envData } from "../config/envdata.js";
import { sendOrderConfirmationMail } from "../lib/createOrderMail.js";
import { sendDeliveryConfirmationMail } from "../lib/deliveredMailer.js";

const store_id = envData.storeid;
const store_passwd = envData.storepassword;
const is_live = envData.islive;
const serverUrl = envData.serverUrl;

//  create order
export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    for (const product of products) {
      const { productId, quantity, variant } = product;

      const checkStock = await Product.findById(productId).select(
        "stock priceByVariant"
      );
      if (!checkStock) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (checkStock.priceByVariant && checkStock.priceByVariant.length > 0) {
        const variantData = checkStock.priceByVariant.find(
          (v) => v.value === variant
        );

        if (!variantData) {
          return res.status(400).json({ message: "Variant not found" });
        }

        if (variantData.stock < quantity) {
          return res
            .status(400)
            .json({ message: `Insufficient stock for variant: ${variant}` });
        }
        variantData.stock -= quantity;
      } else {
        if (checkStock.stock < quantity) {
          return res.status(400).json({ message: "Insufficient stock" });
        }
        checkStock.stock -= quantity;
      }
      await checkStock.save();
    }

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { orderhistory: savedOrder._id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // if cash on delivery, return order details
    if (req.body.paymentMethod === "cash_on_delivery") {
      const order = await Order.findById(savedOrder._id)
        .populate("userId", "email username")
        .populate("products.productId", "name");

      await sendOrderConfirmationMail({
        email: order.userId.email,
        name: order.userId.username,
        orderId: order._id,
        items: order.products.map((p) => ({
          name: p.productId.name,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: order.totalPrice,
      });
      return res.status(200).json(savedOrder);
    }

    const data = {
      total_amount: savedOrder.totalPrice,
      currency: "BDT",
      tran_id: savedOrder._id.toString(),
      success_url: `${serverUrl}/success?tran_id=${savedOrder._id}`,
      fail_url: `${serverUrl}/fail?tran_id=${savedOrder._id}`,
      cancel_url: `${serverUrl}/cancel?tran_id=${savedOrder._id}`,
      ipn_url: `${serverUrl}/ipn?tran_id=${savedOrder._id}`,
      shipping_method: "Courier",
      product_name: "Order Payment",
      product_category: "General",
      product_profile: "general",
      cus_name: updatedUser.username || "Customer Name",
      cus_email: updatedUser.email || "customer@example.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: updatedUser.phone || "01711111111",
      cus_fax: updatedUser.phone || "01711111111",
      ship_name: updatedUser.name || "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    let GatewayPageURL = apiResponse.GatewayPageURL;
    if (apiResponse) {
      res.status(200).json({
        message: "Payment initiated",
        GatewayPageURL: GatewayPageURL,
      });
    } else {
      res.status(400).json({ message: "Payment initiation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// pos order
export const posOrder = async (req, res) => {
  try {
    const { products } = req.body;
    for (const product of products) {
      const { productId, quantity, variant } = product;
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        console.log("Invalid productId:", productId);
        return res.status(400).json({ message: "Invalid productId" });
      }

      const checkStock = await Product.findById(productId).select(
        "stock priceByVariant"
      );

      if (!checkStock) {
        console.log("Product not found in DB:", productId);
        return res
          .status(404)
          .json({ message: `Product not found: ${productId}` });
      }

      if (checkStock.priceByVariant && checkStock.priceByVariant.length > 0) {
        const variantData = checkStock.priceByVariant.find(
          (v) => v.value === variant
        );

        if (!variantData) {
          return res.status(400).json({ message: "Variant not found" });
        }

        if (variantData.stock < quantity) {
          return res
            .status(400)
            .json({ message: `Insufficient stock for variant: ${variant}` });
        }
        variantData.stock -= quantity;
      } else {
        if (checkStock.stock < quantity) {
          return res.status(400).json({ message: "Insufficient stock" });
        }
        checkStock.stock -= quantity;
      }
      await checkStock.save();
    }

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    return res.status(200).json(savedOrder);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
// get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { startDate, endDate, orderId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (orderId) {
      if (mongoose.Types.ObjectId.isValid(orderId)) {
        filter._id = orderId;
      } else {
        filter.$or = [
          { "userId.username": { $regex: new RegExp(orderId, "i") } },
          { "userId.email": { $regex: new RegExp(orderId, "i") } },
        ];
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
    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({ orders, totalOrders });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

// order by user id
export const getOrderByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .populate("products.productId", "name price buyingPrice")
      .populate("address");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update order
export const updateOrder = async (req, res) => {
  try {
    const existingOrder = await Order.findById(req.params.id).populate(
      "userId",
      "email username"
    );

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const prevStatus = existingOrder.status;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("userId", "email username");

    // If the status changed to 'Delivered', send mail
    if (prevStatus !== "delivered" && updatedOrder.status === "delivered") {
      await sendDeliveryConfirmationMail({
        email: updatedOrder.userId.email,
        name: updatedOrder.userId.username,
        orderId: updatedOrder._id,
      });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
};

// delete order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    await User.findByIdAndUpdate(
      deletedOrder.userId,
      { $pull: { orderhistory: deletedOrder._id } },
      { new: true }
    );

    return res.status(200).json(deletedOrder);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// get order by id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

      .populate("userId", "username email mobileNumber")
      .populate("products.productId", "name price buyingPrice image")
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
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// get order by amount
export const getOrderByAmount = async (req, res) => {
  try {
    const orders = await Order.find({ amount: req.params.amount });
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
