// cart model
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      size: {
        type: String,
        required: false,
      },
      color: {
        type: String,
        required: false,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
