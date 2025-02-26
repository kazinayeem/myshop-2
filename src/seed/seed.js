import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../model/category.model.js";
import SubCategory from "../model/subcategory.model.js";
import Product, { Variant } from "../model/product.model.js";

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
    {
      name: "Books",
      image: "https://picsum.photos/200/300?category=books",
    },
  ];

  const categoryInstances = [];

  // Create categories and their subcategories
  for (let categoryData of categories) {
    const category = new Category({
      name: categoryData.name,
      image: categoryData.image,
    });

    await category.save();
    categoryInstances.push(category);

    // Add Subcategories for each category
    const subcategories = [
      {
        name: `${categoryData.name} - Sub 1`,
        image: "https://picsum.photos/200/300?subcategory=1",
        category: category._id,
      },
      {
        name: `${categoryData.name} - Sub 2`,
        image: "https://picsum.photos/200/300?subcategory=2",
        category: category._id,
      },
      {
        name: `${categoryData.name} - Sub 3`,
        image: "https://picsum.photos/200/300?subcategory=3",
        category: category._id,
      },
    ];

    for (let subcategoryData of subcategories) {
      const subcategory = new SubCategory(subcategoryData);
      await subcategory.save();

      // Link subcategory to category
      category.subcategory.push(subcategory._id);
      await category.save();
    }
  }

  return categoryInstances;
};

// Function to Seed Products
const seedProducts = async (categoryInstances) => {
  console.log("Seeding products...");

  let products = [];

  for (let i = 0; i < 200; i++) {
    // Loop for 100 products
    const hasVariants = Math.random() > 0.5;
    const price = Math.floor(Math.random() * 500) + 100; // Random price
    const discount = Math.floor(Math.random() * 30); // Random discount
    const discountedPrice = price - (price * discount) / 100;

    // Select random category and subcategory from existing ones
    const category =
      categoryInstances[Math.floor(Math.random() * categoryInstances.length)];
    const subcategory =
      category.subcategory[
        Math.floor(Math.random() * category.subcategory.length)
      ];

    const newProduct = new Product({
      name: `Product ${i + 1}`,
      description: `This is a description for Product ${i + 1}.`,
      section: ["New Arrivals", "Best Sellers"],
      buyingPrice: price - 50,
      price,
      discountedPrice,
      discountPercent: discount,
      image: [`https://picsum.photos/200/300?product=${i + 1}`],
      category: category._id,
      subcategory: subcategory,
      bulkOrder: {
        minQuantity: Math.floor(Math.random() * 10) + 1,
        discount: Math.floor(Math.random() * 20) + 5,
      },
      stock: Math.floor(Math.random() * 100) + 1, // Random stock
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

    // Link product to its category
    category.product.push(newProduct._id);
    await category.save();

    // If product should have variants, create them
    if (hasVariants) {
      const variantNames = ["Size", "Color"];
      const values = {
        Size: ["Small", "Medium", "Large"],
        Color: ["Red", "Blue", "Green", "Black", "White"],
      };

      const variants = [];
      for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
        const name =
          variantNames[Math.floor(Math.random() * variantNames.length)];
        const value =
          values[name][Math.floor(Math.random() * values[name].length)];
        const variant = new Variant({
          product: newProduct._id,
          name,
          value,
          price: price,
          stock: Math.floor(Math.random() * 50) + 1, // Random stock for variant
        });
        await variant.save();
        variants.push(variant._id);
      }

      newProduct.priceByVariant = variants;
      await newProduct.save();
    }

    products.push(newProduct);
  }

  console.log("✅ 5000 Products Seeded Successfully!");
  process.exit();
};

// Run the Seed Function
const seed = async () => {
  await connectDB();
  console.log(
    "Deleting existing categories, subcategories, products, and variants..."
  );

  await Category.deleteMany({});
  await SubCategory.deleteMany({});
  await Product.deleteMany({});
  await Variant.deleteMany({});

  // Create Categories and Subcategories
  const categoryInstances = await createCategoryAndSubCategories();

  // Seed products
  await seedProducts(categoryInstances);
};

seed();
