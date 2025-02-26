import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../model/category.model.js";
import SubCategory from "../model/subcategory.model.js";
import Product, { Variant } from "../model/product.model.js";
import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import Address from "../model/address.model.js";

dotenv.config();

// Sample Categories and Subcategories
const createCategoryAndSubCategories = async () => {
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
    const category = new Category(categoryData);
    await category.save();
    categoryInstances.push(category);

    const subcategories = Array.from({ length: 3 }, (_, i) => ({
      name: `${categoryData.name} - Sub ${i + 1}`,
      image: `https://picsum.photos/200/300?subcategory=${i + 1}`,
      category: category._id,
    }));

    for (let subcategoryData of subcategories) {
      const subcategory = new SubCategory(subcategoryData);
      await subcategory.save();
      category.subcategory.push(subcategory._id);
    }
    await category.save();
  }

  return categoryInstances;
};

const seedProducts = async (categoryInstances) => {
  console.log("Seeding products...");
  let products = [];

  for (let i = 0; i < 100; i++) {
    const hasVariants = Math.random() > 0.5;
    const price = Math.floor(Math.random() * 500) + 100;
    const discount = Math.floor(Math.random() * 30);
    const discountedPrice = price - (price * discount) / 100;
    const category =
      categoryInstances[Math.floor(Math.random() * categoryInstances.length)];
    const subcategory =
      category.subcategory[
        Math.floor(Math.random() * category.subcategory.length)
      ];

    const newProduct = new Product({
      name: `Product ${i + 1}`,
      description: `Description for Product ${i + 1}`,
      section: ["New Arrivals", "Best Sellers"],
      buyingPrice: price - 50,
      price,
      discountedPrice,
      discountPercent: discount,
      image: [`https://picsum.photos/200/300?product=${i + 1}`],
      category: category._id,
      subcategory,
      bulkOrder: {
        minQuantity: Math.floor(Math.random() * 10) + 1,
        discount: Math.floor(Math.random() * 20) + 5,
      },
      stock: Math.floor(Math.random() * 100) + 1,
      brand: "Brand " + (i % 5),
      rating: (Math.random() * 5).toFixed(1),
      numReviews: Math.floor(Math.random() * 100),
      isFeatured: Math.random() > 0.8,
      slug: `product-${i + 1}`,
      isDeleted: false,
      isBlocked: false,
      warranty: `${Math.floor(Math.random() * 5) + 1} years`,
      returnable: Math.random() > 0.7,
      returnableDays: 7,
      cod: Math.random() > 0.5,
    });

    await newProduct.save();
    category.product.push(newProduct._id);
    await category.save();

    if (hasVariants) {
      const variantNames = ["Size", "Color"];
      const values = {
        Size: ["Small", "Medium", "Large"],
        Color: ["Red", "Blue", "Green", "Black", "White"],
      };
      const variants = [];

      for (let j = 0; j < Math.floor(Math.random() * 3); j++) {
        const name =
          variantNames[Math.floor(Math.random() * variantNames.length)];
        const value =
          values[name][Math.floor(Math.random() * values[name].length)];
        const variant = new Variant({
          product: newProduct._id,
          name,
          value,
          price,
          stock: Math.floor(Math.random() * 50) + 1,
        });
        await variant.save();
        variants.push(variant._id);
      }

      newProduct.priceByVariant = variants;
      await newProduct.save();
    }
    products.push(newProduct);
  }

  console.log("✅ 100 Products Seeded Successfully!");
  return products;
};

const seedUsers = async () => {
  console.log("Seeding users...");
  const users = [];

  for (let i = 0; i < 20; i++) {
    const user = new User({
      username: `user${i + 1}`,
      email: `user${i + 1}@gmail.com`,
      password: "password123",
    });

    await user.save();
    users.push(user);
  }

  console.log("✅ 20 Users Seeded Successfully!");
  return users;
};

const seedAddresses = async (userInstances) => {
  console.log("Seeding addresses...");
  const addressInstances = [];

  for (let user of userInstances) {
    const address = new Address({
      userId: user._id,
      addressLine1: `Street ${Math.floor(Math.random() * 100)}`,
      addressLine2: `Apt ${Math.floor(Math.random() * 10)}`,
      city: "City Name",
      state: "State Name",
      zipCode: `1000${Math.floor(Math.random() * 10)}`,
    });

    await address.save();
    addressInstances.push(address);
  }

  console.log("✅ Addresses Seeded Successfully!");
  return addressInstances;
};

const seedOrders = async (
  userInstances,
  addressInstances,
  productInstances
) => {
  console.log("Seeding orders...");

  for (let i = 0; i < 50; i++) {
    const user =
      userInstances[Math.floor(Math.random() * userInstances.length)];
    const address =
      addressInstances[Math.floor(Math.random() * addressInstances.length)];

    // Randomly selecting products for the order
    const selectedProducts = [];
    let totalAmount = 0;

    for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
      // Each order has 1-5 products
      const product =
        productInstances[Math.floor(Math.random() * productInstances.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // Random quantity (1-3)
      const price = product.price; // Original product price
      const totalPrice = price * quantity;

      selectedProducts.push({
        productId: product._id,
        quantity,
        price,
        totalPrice,
      });

      totalAmount += totalPrice;
    }

    // Ensure address and amount are set correctly
    const order = new Order({
      userId: user._id,
      products: selectedProducts,
      amount: totalAmount, // Make sure the amount is set
      address: address._id, // Ensure address is set
      status: "pending", // You can change this to "completed" or any other status as needed
    });

    await order.save();
    user.orderhistory.push(order._id);
    await user.save();
  }

  console.log("✅ 50 Orders Seeded Successfully!");
};

const seed = async () => {
  await connectDB();
  console.log(
    "Deleting existing categories, subcategories, products, users, orders, and addresses..."
  );

  await Category.deleteMany({});
  await SubCategory.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  await Address.deleteMany({});
  await Order.deleteMany({});

  const categoryInstances = await createCategoryAndSubCategories();
  const productInstances = await seedProducts(categoryInstances);
  const userInstances = await seedUsers();
  const addressInstances = await seedAddresses(userInstances);
  await seedOrders(userInstances, addressInstances, productInstances);

  console.log("✅ Seeding Completed Successfully!");
  process.exit();
};

seed();
