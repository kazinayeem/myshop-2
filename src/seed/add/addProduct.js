
import Product, { Variant } from "../../model/product.model.js";
import Category from "../../model/category.model.js";
import SubCategory from "../../model/subcategory.model.js";
import connectDB from "../../config/db.js";
import mongoose from "mongoose";




const seedOneProduct = async () => {
  try {
    await connectDB();
    console.log("Database connected...");

    // fake category and subcategory
    const categoryid = new mongoose.Types.ObjectId();
    const subcategoryid =new  mongoose.Types.ObjectId();


    const product = new Product({
      name: "iPhone 15 Pro",
      description: "Latest Apple iPhone with A17 chip and improved camera.",
      brand: "Apple",
      price: 1199,
      discountedPrice: 1099,
      discountPercent: 8,
      stock: 100,
      section: ["New Arrivals", "Best Sellers"],
      isBlocked: false,
      isFeatured: true,
      slug: "iphone-15-pro",
      warranty: "1 year",
      category: categoryid,
      subcategory: subcategoryid,
      bulkOrder: { discount: 10, minQuantity: 2 },
      isDeleted: false,
      rating: 4.9,
      numReviews: 1500,
      returnableDays: 14,
      video: "https://example.com/video.mp4",
      cod: true,
      returnable: true,
      buyingPrice: 950,
      image: [
        "https://picsum.photos/200/300?product=iphone15pro",
        "https://picsum.photos/200/300?product=iphone15pro-side",
      ],
      priceByVariant: [],
    });

    await product.save();

    // Create a variant
    const variant1 = new Variant({
      product: product._id,
      name: "Storage",
      value: "256GB",
      price: 1199,
      stock: 50,
    });

    await variant1.save();

    // Attach variant to product
    product.priceByVariant.push(variant1._id);
    await product.save();

    console.log("✅ Product and Variant Seeded Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding product:", error);
    process.exit(1);
  }
};

seedOneProduct();
