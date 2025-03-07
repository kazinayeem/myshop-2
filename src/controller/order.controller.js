import Order from "../model/order.model.js";

// order controller

//  create order
export const createOrder = async (req, res) => {
  try {
    const { userId, products, amount, address } = req.body;

    const newOrder = new Order({
      userId,
      products,
      amount,
      address,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("products.productId", "name price buyingPrice")
      .populate("address");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// order by user id
export const getOrderByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });

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

      .populate("userId", "username email")
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
