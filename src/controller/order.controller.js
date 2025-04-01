import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import User from "../model/user.model.js";
// order controller

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
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (error) {
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
