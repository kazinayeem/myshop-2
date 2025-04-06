import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../model/category.model.js";
import Product from "../model/product.model.js";
dotenv.config();

const MONGO_URI =
  "mongodb+srv://nayeemwhatsapp6:Gps8Hm3BpybdGmRs@ecommerce.ge3yd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce";

const categories = [
  "67e37970da947d8fd2a53e10",
  "67e37970da947d8fd2a53e10",
  "67e37970da947d8fd2a53e10",
  "67e393bafbd58f27bcd80f1c",
];

const subcategories = [
  "67e379c4da947d8fd2a53e15",
  "67e379ceda947d8fd2a53e18",
  "67e380d679475bd8db8eac3c",
  "67e380d679475bd8db8eac3c",
];

const variantPresets = {
  mobile: { name: "Storage", values: ["64GB", "128GB", "256GB"] },
  laptop: { name: "RAM", values: ["4GB", "8GB", "16GB"] },
  clothing: { name: "Size", values: ["XS", "S", "M", "L", "XL"] },
  other: { name: "Type", values: ["Standard", "Premium", "Deluxe"] },
};

const generateVariant = () => {
  const type = faker.helpers.arrayElement([
    "mobile",
    "laptop",
    "clothing",
    "other",
  ]);
  const preset = variantPresets[type];
  return {
    name: preset.name,
    value: faker.helpers.arrayElement(preset.values),
    price: Number(
      faker.number.float({ min: 100, max: 10000, fractionDigits: 2 })
    ),
    buyingPrice: Number(
      faker.number.float({ min: 100, max: 9000, fractionDigits: 2 })
    ),
    stock: faker.number.int({ min: 1, max: 100 }),
    image: faker.image.urlPicsumPhotos(),
  };
};

const createProduct = (withVariant = false, withColor = false) => {
  const price = Number(
    faker.number.float({ min: 100, max: 10000, fractionDigits: 0 })
  );
  const discount = faker.number.int({ min: 0, max: 30 });
  const discountedPrice = Number((price - (price * discount) / 100).toFixed(2));

  const category = faker.helpers.arrayElement(categories);
  const subcategory = faker.helpers.arrayElement(subcategories);

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    section: [faker.commerce.department()],
    buyingPrice: Number(
      faker.number.float({ min: 100, max: 9000, fractionDigits: 0 })
    ),
    price,
    discountedPrice,
    discountPercent: discount,
    priceByVariant: withVariant
      ? Array.from(
          { length: faker.number.int({ min: 1, max: 4 }) },
          generateVariant
        )
      : [],
    image: [
      faker.image.urlPicsumPhotos(),
      faker.image.urlPicsumPhotos(),
      faker.image.urlPicsumPhotos(),
    ],
    video: faker.internet.url(),
    color: withColor
      ? faker.helpers.arrayElements(
          ["Red", "Blue", "Black", "Green", "White"],
          2
        )
      : [],
    category,
    subcategory,
    bulkOrder: {
      minQuantity: faker.number.int({ min: 5, max: 20 }),
      discount: faker.number.int({ min: 5, max: 25 }),
    },
    stock: faker.number.int({ min: 10, max: 100 }),
    brand: faker.company.name(),
    rating: faker.number.float({
      min: 0,
      max: 5,
      precision: 0,
      fractionDigits: 0,
    }),
    numReviews: faker.number.int({
      min: 0,
      max: 5,
      precision: 0,
      fractionDigits: 0,
    }),
    isFeatured: faker.datatype.boolean(),
    slug:
      faker.helpers.slugify(faker.commerce.productName()).toLowerCase() +
      "-" +
      faker.string.alphanumeric(5),
    isDeleted: false,
    isBlocked: false,
    warranty: faker.helpers.arrayElement(["6 months", "1 year", "No warranty"]),
    returnable: faker.datatype.boolean(),
    returnableDays: 7,
    cod: faker.datatype.boolean(),
  };
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🧹 Ready to insert products...");

    const allProducts = [
      ...Array.from({ length: 67 }, () => createProduct(true, false)),
      ...Array.from({ length: 67 }, () => createProduct(true, true)),
      ...Array.from({ length: 66 }, () => createProduct(false, false)),
    ];

    for (const productData of allProducts) {
      const product = await Product.create(productData);

      // Update category and subcategory documents
      await Category.findByIdAndUpdate(product.category, {
        $push: { product: product._id },
      });
    }

    console.log(
      "🚀 Successfully seeded 200 products and updated categories/subcategories."
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seeding:", err);
    process.exit(1);
  }
};

seed();
