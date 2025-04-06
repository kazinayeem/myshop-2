import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../model/category.model.js";
import Product from "../model/product.model.js";
import Order from "../model/order.model.js";
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
      faker.number.float({ min: 100, max: 10000, fractionDigits: 0 })
    ),
    buyingPrice: Number(
      faker.number.float({ min: 100, max: 9000, fractionDigits: 0 })
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
    description: `
  <div class="product-description">
    <h2>Luxora™ Smart Aroma Diffuser & Humidifier</h2>

    <img src="https://picsum.photos/seed/aroma1/800/400" alt="Aroma Diffuser Front View" style="width:100%;max-width:800px;margin:20px 0;" />
    
    <p>Bring a wave of calm into your home with the <strong>Luxora™ Smart Aroma Diffuser</strong>. This elegantly designed 2-in-1 humidifier and diffuser is more than just a wellness tool — it's a modern decor statement that fits perfectly in bedrooms, offices, or meditation spaces.</p>

    <p>With smart features, customizable lighting, and ultrasonic mist technology, Luxora enhances air quality, mood, and aesthetic in one beautiful package. Choose your favorite essential oils, set the timer, and let the diffuser do the rest.</p>

    <img src="https://picsum.photos/seed/aroma2/800/400" alt="Aroma Diffuser Glowing Light" style="width:100%;max-width:800px;margin:20px 0;" />

    <h3>✨ Product Highlights</h3>
    <ul>
      <li>💧 <strong>300ml Water Tank</strong> – Ideal for small to medium rooms.</li>
      <li>🌈 <strong>7-Color LED Light Modes</strong> – Customize your ambiance.</li>
      <li>🕒 <strong>Smart Timer Function</strong> – Auto shutoff at 1H / 3H / 6H / Continuous.</li>
      <li>🔇 <strong>Quiet Operation</strong> – Less than 30dB noise level.</li>
      <li>🧼 <strong>BPA-Free & Easy to Clean</strong> – Safe for family and pets.</li>
    </ul>

    <img src="https://picsum.photos/seed/aroma3/800/400" alt="Aroma Diffuser Side View" style="width:100%;max-width:800px;margin:20px 0;" />

    <h3>📺 See It In Action</h3>
    <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin-bottom:20px;">
      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Luxora Diffuser Demo" frameborder="0" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
    </div>

    <img src="https://picsum.photos/seed/aroma4/800/400" alt="Luxora Diffuser in Living Room" style="width:100%;max-width:800px;margin:20px 0;" />

    <h3>📐 Specifications</h3>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;border:1px solid #ddd;">Capacity</td><td style="padding:8px;border:1px solid #ddd;">300ml</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Dimensions</td><td style="padding:8px;border:1px solid #ddd;">168mm x 121mm</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Run Time</td><td style="padding:8px;border:1px solid #ddd;">Up to 10 hours</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Power Source</td><td style="padding:8px;border:1px solid #ddd;">USB (Cable Included)</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Weight</td><td style="padding:8px;border:1px solid #ddd;">540g</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;">Material</td><td style="padding:8px;border:1px solid #ddd;">ABS + PP (BPA-Free)</td></tr>
    </table>

    <h3>🧡 Customer Reviews</h3>
    <blockquote>
      "This diffuser changed my nightly routine! The lights are gorgeous, and it runs silently through the night." <br />
      <cite>– Alex M.</cite>
    </blockquote>

    <blockquote>
      "Bought this for my office. Clients always compliment how relaxing the space feels now. Highly recommend!" <br />
      <cite>– Priya R.</cite>
    </blockquote>

    <p><strong>Rating:</strong> ⭐ 4.9/5 based on 3,842 reviews</p>

    <p><em>✔️ Free worldwide shipping | 🔁 30-day returns | 🔒 100% Secure checkout</em></p>
  </div>
`,
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
    await Order.deleteMany({});
    console.log("🧹 Ready to insert products...");

    const allProducts = [
      ...Array.from({ length: 20 }, () => createProduct(true, false)),
      ...Array.from({ length: 20 }, () => createProduct(true, true)),
      ...Array.from({ length: 20 }, () => createProduct(false, false)),
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
