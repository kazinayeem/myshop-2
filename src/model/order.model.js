import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
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
      default: 0,
    },
    paymentMethod: {
      type: String,
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
    bankTransactionId: {
      type: String,
      required: false,
    },

    number: {
      type: Number,
      required: false,
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
      default: 0,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: false,
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
      posOrder: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
