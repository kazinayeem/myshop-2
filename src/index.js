import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import xssClean from "xss-clean";

dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import addressRoutes from "./routes/address.routes.js";
import Brand from "./routes/brand.routes.js";
import CategoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import SliderRoutes from "./routes/slider.routes.js";
import SubCategoryRoutes from "./routes/subcategory.routes.js";
import userRoutes from "./routes/user.routes.js";

// initialize express
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(rateLimit({ windowMs: 30 * 60 * 1000, max: 100 }));
app.use(xssClean());
app.use(hpp());

// middlewares
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
// app.use(
//   morgan("combined", {
//     stream: {
//       write: (message) => logger.info(message.trim()), 
//     },
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// products
app.use("/api/products", productRoutes);
// categories
app.use("/api/categories", CategoryRoutes);
// subcategories
app.use("/api/subcategories", SubCategoryRoutes);
// addresses
app.use("/api/addresses", addressRoutes);
// orders
app.use("/api/orders", orderRoutes);
// users
app.use("/api/users", userRoutes);
// sliders
app.use("/api/sliders", SliderRoutes);
// brands
app.use("/api/brands", Brand);

/// ❌ 404 Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// start server
export default app;
