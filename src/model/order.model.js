import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        variant: {
          type: String,
          required: false,
        },
        color: {
          type: String,
          required: false,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "cash_on_delivery"],
      required: true,
      default: "cash_on_delivery",
    },
    transactionId: {
      type: String,
      required: false,
    },
    transactionDate: {
      type: Date,
      required: false,
    },
    number: {
      type: Number,
      required: false,
      default: +880000000000,
    },
    transactionStatus: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    deliveryCharge: {
      type: Number,
      required: false,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
        "failed",
        "completed",
        "processing",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
