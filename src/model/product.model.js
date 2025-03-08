import mongoose from "mongoose";

// Variant Schema
const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensures price is non-negative
    },
    stock: {
      type: Number,
      required: true,
      min: 0, // Ensures stock is not negative
    },
    image: {
      type: String, // Optional variant-specific image
      required: false,
    },
  },
  { timestamps: true }
);

export const Variant = mongoose.model("Variant", variantSchema);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    section: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
    buyingPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    discountPercent: {
      type: Number,
      required: false,
      min: 0,
      max: 100, // Ensures percentage remains valid
    },
    priceByVariant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
        required: false,
      },
    ],
    image: [
      {
        type: String,
        required: true,
      },
    ],
    video: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    bulkOrder: {
      minQuantity: {
        type: Number,
        required: false,
        min: 1,
      },
      discount: {
        type: Number,
        required: false,
        min: 0,
        max: 100,
      },
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      required: false,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    warranty: {
      type: String,
      required: false,
      trim: true,
    },
    returnable: {
      type: Boolean,
      default: false,
    },
    returnableDays: {
      type: Number,
      required: function () {
        return this.returnable;
      },
      min: 1,
    },
    cod: {
      type: Boolean,
      default: false,
    },
    
  },
  { timestamps: true }
);

// productSchema.index({ slug: 1 }); 

const Product = mongoose.model("Product", productSchema);

export default Product;
