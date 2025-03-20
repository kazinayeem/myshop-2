import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Address from "../model/address.model.js";
import Category from "../model/category.model.js";
import Order from "../model/order.model.js";
import Product from "../model/product.model.js";
import SubCategory from "../model/subcategory.model.js";
import User from "../model/user.model.js";

dotenv.config();

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
    }
  }
  return categoryInstances;
};

const seedProducts = async (categoryInstances) => {
  console.log("Seeding products...");
  for (let i = 0; i < 100; i++) {
    const price = Math.floor(Math.random() * 500) + 100;
    const discount = Math.floor(Math.random() * 30);
    const discountedPrice = price - (price * discount) / 100;
    const category =
      categoryInstances[Math.floor(Math.random() * categoryInstances.length)];

    const priceByVariant = [
      {
        name: "Size",
        value: "Small",
        price: price,
        stock: Math.floor(Math.random() * 50) + 1,
        image: `https://picsum.photos/200/300?variant=${i + 1}`,
      },
      {
        name: "Color",
        value: "Red",
        price: price,
        stock: Math.floor(Math.random() * 50) + 1,
        image: `https://picsum.photos/200/300?variant=${i + 1}`,
      },
      {
        name: "Size",
        value: "Medium",
        price: price,
        stock: Math.floor(Math.random() * 50) + 1,
        image: `https://picsum.photos/200/300?variant=${i + 1}`,
      },
    ];

    const newProduct = new Product({
      name: `Product ${i + 1}`,
      description: `Description for Product ${i + 1}`,
      price,
      discountedPrice,
      discountPercent: discount,
      bulkOrder: {
        discount: 10,
        minQuantity: 5,
      },
      buyingPrice: price - 10,
      image: [`https://picsum.photos/200/300?product=${i + 1}`],
      category: category._id,
      stock: Math.floor(Math.random() * 100) + 1,
      brand: "Brand " + (i % 5),
      priceByVariant,
      slug: `product-${i + 1}`,
      subcategory: category._id,
      video: `https://www.youtube.com/watch?v=example${i + 1}`,
      isFeatured: Math.random() > 0.5,
      color: "Red",
    });

    await newProduct.save();
  }
  console.log("✅ 100 Products Seeded Successfully!");
};

const seedUsers = async () => {
  console.log("Seeding users...");
  const users = [];

  for (let i = 0; i < 20; i++) {
    const user = new User({
      username: `user${i + 1}`,
      email: `user${i + 1}@gmail.com`,
      password: "password123",
      isAdmin: Math.random() > 0.5,
      mobileNumber: `017${Math.floor(Math.random() * 10000000)}`,
    });
    await user.save();
    users.push(user);
  }
  console.log("✅ 20 Users Seeded Successfully!");
  return users;
};

const seedAddresses = async (users) => {
  console.log("Seeding addresses...");
  for (let user of users) {
    const address = new Address({
      userId: user._id,
      addressLine1: "123 Main Street",
      addressLine2: "Apt 4B",
      city: "Dhaka",
      state: "Dhaka",
      country: "Bangladesh",
      zipCode: "1000",
    });
    await address.save();
  }
  console.log("✅ Addresses Seeded Successfully!");
};
const seedOrders = async (users) => {
  console.log("Seeding orders...");
  const products = await Product.find({});
  const addresses = await Address.find({}); // Fetch all addresses

  if (products.length === 0 || addresses.length === 0) {
    console.log("⚠️ No products or addresses found! Skipping order seeding.");
    return;
  }

  for (let user of users) {
    const address = addresses.find(
      (addr) => addr.userId?.toString() === user._id.toString()
    );

    if (!address) {
      console.log(`⚠️ No address found for user: ${user.username}`);
      continue;
    }

    // Pick 2-3 random products for the order
    const orderProducts = [];
    const numProducts = Math.floor(Math.random() * 2) + 2; // 2-3 products per order
    for (let i = 0; i < numProducts; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // Random quantity between 1 and 3
      orderProducts.push({
        productId: product._id,
        quantity,
        price: product.price,
      });
    }

    // Calculate total price
    const totalPrice = orderProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = new Order({
      userId: user._id,
      products: orderProducts,
      totalPrice,
      totalPrice: totalPrice,
      address: address._id,
      paidAmount: totalPrice,
      dueAmount: 0,
      paymentMethod: "credit_card",
      paymentStatus: "paid",
      deliveryCharge: 50,
      status: Math.random() > 0.5 ? "pending" : "shipped",
    });

    await order.save();
  }
  console.log("✅ Orders Seeded Successfully!");
};

const seed = async () => {
  await connectDB();
  console.log("Deleting existing data...");

  await Category.deleteMany({});
  await SubCategory.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  await Address.deleteMany({});
  await Order.deleteMany({});

  const categoryInstances = await createCategoryAndSubCategories();
  await seedProducts(categoryInstances);
  const users = await seedUsers();
  await seedAddresses(users);
  await seedOrders(users);

  console.log("✅ Seeding Completed Successfully!");
  process.exit();
};

seed();
