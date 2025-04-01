import dotenv from "dotenv";
dotenv.config(); // ✅ Load environment variables first

import connectDB from "../config/db.js";
import Address from "../model/address.model.js";
import Category from "../model/category.model.js";
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import SubCategory from "../model/subcategory.model.js";
import User from "../model/user.model.js";
import Slider from "../model/slider.model.js";
import Brand from "../model/brand.model.js";

const createProduct = async (category, subcategory) => {
  try {
    const products = [];

    for (let i = 0; i < 10; i++) {
      const product = await Product.create({
        name: `Product ${i + 1}`,
        description: `Description for Product ${i + 1}`,
        price: Math.floor(Math.random() * 100) + 1,
        stock: Math.floor(Math.random() * 50) + 1,
        category: category._id,
        subcategory: subcategory._id,
        image: `https://picsum.photos/200/300?product=${i + 1}`,
      });
      products.push(product);
    }
    return products;
  } catch (error) {
    console.error("❌ Error creating products:", error);
    process.exit(1);
  }
};
