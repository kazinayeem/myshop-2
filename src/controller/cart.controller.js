// cart controller
// import Cart model
import Cart from "../model/cart.model.js";
import User from "../model/user.model.js";
import Product from "../model/product.model.js";
import mongoose from "mongoose";

// add to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }

    // check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if cart exists for user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // create new cart
      cart = new Cart({ userId, items: [] });
    }

    // check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (existingItemIndex !== -1) {
      // update quantity and size/color if already in cart
      cart.items[existingItemIndex].quantity += quantity || 1;
      if (size) cart.items[existingItemIndex].size = size;
      if (color) cart.items[existingItemIndex].color = color;
    } else {
      // add new item to cart
      cart.items.push({
        productId,
        quantity: quantity || 1,
        size,
        color,
      });
    }

    // save the cart
    await cart.save();

    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // check if cart exists for user
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price imageUrl"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// update cart
export const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity, size, color } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }

    // check if cart exists for user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // check if product exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // update quantity and size/color
    if (quantity) cart.items[existingItemIndex].quantity = quantity;
    if (size) cart.items[existingItemIndex].size = size;
    if (color) cart.items[existingItemIndex].color = color;

    // save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "User ID and Product ID are required" });
    }

    // check if cart exists for user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // check if product exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // remove the item from the cart
    cart.items.splice(existingItemIndex, 1);

    // save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// clear cart
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // check if cart exists for user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // clear the cart items
    cart.items = [];

    // save the updated cart
    await cart.save();

    return res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// checkout cart
export const checkoutCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // check if cart exists for user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // check if cart is empty
    if (cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // proceed with checkout logic here (e.g., create an order, process payment, etc.)

    return res.status(200).json({ message: "Checkout successful", cart });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
