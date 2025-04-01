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
const createCategoryAndSubCategories = async () => {
  try {
    const categories = [
      {
        name: "Electronics",
        image: "https://picsum.photos/200/300?category=electronics",
      },
      {
        name: "Furniture",
        image: "https://picsum.photos/200/300?category=furniture",
      },
      {
        name: "Clothing",
        image: "https://picsum.photos/200/300?category=clothing",
      },
      { name: "Books", image: "https://picsum.photos/200/300?category=books" },
    ];

    const categoryInstances = [];

    for (let categoryData of categories) {
      const category = await Category.create(categoryData); // ✅ Optimized: Use `create()`
      categoryInstances.push(category);

      const subcategories = await SubCategory.insertMany(
        Array.from({ length: 3 }, (_, i) => ({
          name: `${categoryData.name} - Sub ${i + 1}`,
          image: `https://picsum.photos/200/300?subcategory=${i + 1}`,
          category: category._id,
        }))
      );

      category.subcategories = subcategories.map((sub) => sub._id);
      await category.save();
    }
    return categoryInstances;
  } catch (error) {
    console.error("❌ Error creating categories:", error);
    process.exit(1);
  }
};

const SliderAdd = async () => {
  try {
    console.log("Seeding slider...");
    const sliders = [];

    for (let i = 0; i < 5; i++) {
      sliders.push({
        image: `https://picsum.photos/1000/500`,
        title: `Slider ${i + 1}`,
        buttonText: `Shop Now ${i + 1}`,
        buttonLink: `product`,
        description: `Description for Slider ${i + 1}`,
        status: "active",
      });
    }

    await Slider.insertMany(sliders); // ✅ Optimized: Bulk insert
    console.log("✅ Sliders Seeded Successfully!");
  } catch (error) {
    console.error("❌ Error seeding sliders:", error);
    process.exit(1);
  }
};

const mybrand = async () => {
  try {
    console.log("Seeding brands...");
    const newbrand = new Brand({
      name: "Brand 1",
      logo: "https://picsum.photos/100/100",
      description: "Description for Brand 1",
    });
    await newbrand.save();
    console.log("✅ Brands Seeded Successfully!");
  } catch (error) {
    console.error("❌ Error creating brand:", error);
    process.exit(1);
  }
};
const seedProducts = async (categoryInstances) => {
  try {
    console.log("Seeding products...");
    const products = [];

    for (let i = 0; i < 100; i++) {
      const price = Math.floor(Math.random() * 500) + 100;
      const discount = Math.floor(Math.random() * 30);
      const discountedPrice = price - (price * discount) / 100;

      const category =
        categoryInstances[Math.floor(Math.random() * categoryInstances.length)];
      const subcategories = await SubCategory.find({ category: category._id });

      if (!subcategories.length) continue;
      const subcategory =
        subcategories[Math.floor(Math.random() * subcategories.length)];

      const priceByVariant = [
        {
          name: "Size",
          value: "Small",
          buyingPrice: price - 10,
          price: price,
          stock: Math.floor(Math.random() * 50) + 1,
          image: `https://picsum.photos/200/300?variant=${i + 1}`,
        },
        {
          name: "Size",
          value: "Medium",
          buyingPrice: price - 5,
          price: price + 10,
          stock: Math.floor(Math.random() * 50) + 1,
          image: `https://picsum.photos/200/300?variant=${i + 1}`,
        },
        {
          name: "Size",
          value: "Large",
          buyingPrice: price,
          price: price + 20,
          stock: Math.floor(Math.random() * 50) + 1,
          image: `https://picsum.photos/200/300?variant=${i + 1}`,
        },
      ];

      products.push({
        name: `Product ${i + 1}`,
        description: `Description for Product ${i + 1}`,
        price,
        discountedPrice,
        discountPercent: discount,
        bulkOrder: { discount: 10, minQuantity: 5 },
        buyingPrice: price - 10,
        image: [`https://picsum.photos/200/300?product=${i + 1}`],
        category: category._id,
        subcategory: subcategory._id, // ✅ Fix: Correct subcategory reference
        stock: Math.floor(Math.random() * 100) + 1,
        brand: `Brand ${i % 5}`,
        priceByVariant,
        slug: `product-${i + 1}`,
        video: `https://www.youtube.com/watch?v=example${i + 1}`,
        isFeatured: Math.random() > 0.5,
        color: ["Red", "Blue", "Green", "Black", "White"],
        section: "featured",
        returnable: Math.random() > 0.5,
        warranty: Math.random() > 0.5,
        cod: Math.random() > 0.5,
        returnableDays: Math.floor(Math.random() * 30) + 1,
      });
    }

    await Product.insertMany(products); // ✅ Optimized: Bulk insert
    console.log("✅ 100 Products Seeded Successfully!");
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    console.log("Seeding admin...");

    const adminExists = await User.findOne({ email: "user@gmail.com" });
    if (adminExists) {
      console.log("⚠️ Admin already exists. Skipping...");
      return;
    }

    await User.create({
      username: "user",
      email: "user@gmail.com",
      password: "password123",
      isAdmin: true,
      mobileNumber: `017${Math.floor(Math.random() * 10000000)}`,
    });

    console.log("✅ Admin Added Successfully!");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();
    console.log("Deleting existing data...");

    await Promise.all([
      Category.deleteMany({}),
      SubCategory.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
      Address.deleteMany({}),
      Order.deleteMany({}),
      Slider.deleteMany({}),
      Brand.deleteMany({}),
    ]);

    const categoryInstances = await createCategoryAndSubCategories();
    await seedProducts(categoryInstances);
    await seedAdmin();
    await SliderAdd();
    await mybrand();

    console.log("✅ Seeding Completed Successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error in seeding process:", error);
    process.exit(1);
  }
};

seed();
