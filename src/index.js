import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import xssClean from "xss-clean";
import addressRoutes from "./routes/address.routes.js";
import Brand from "./routes/brand.routes.js";
import CategoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import SliderRoutes from "./routes/slider.routes.js";
import SubCategoryRoutes from "./routes/subcategory.routes.js";
import userRoutes from "./routes/user.routes.js";
import RootRoutes from "./routes/root.routes.js";
dotenv.config();

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(rateLimit({ windowMs: 30 * 60 * 1000, max: 100000 }));
app.use(xssClean());
app.use(hpp());
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 100 * 1024 * 1024 }, 
    abortOnLimit: true,
    createParentPath: true,
  })
);

app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

// root route
app.use("/", RootRoutes);

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
