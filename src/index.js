import helmet from "helmet"; 
import cors from "cors"; 
import rateLimit from "express-rate-limit"; 
import xssClean from "xss-clean"; 
import hpp from "hpp"; 
import dotenv from "dotenv";

dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import CategoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import addressRoutes from "./routes/address.routes.js";
import SubCategoryRoutes from "./routes/subcategory.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import SliderRoutes from "./routes/slider.routes.js";
import logger from "./lib/logger.js";

const PORT = process.env.PORT || 4000;

// initialize express
const app = express();
// 🛡️ Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(xssClean());
app.use(hpp());

// middlewares
app.use(cookieParser());
app.use(cors());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), // Log HTTP requests
    },
  })
);
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
app.listen(PORT, () => {
  connectDB().then(() => {
    console.log(`Server is running on port ${PORT}`);
    //   url
    console.log(`http://localhost:${PORT}`);
  });

  console.log(`http://localhost:${PORT}/health`);
});
