import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import connectDB from "./config/db.js";
import CategoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import addressRoutes from "./routes/address.routes.js";
import SubCategoryRoutes from "./routes/subcategory.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
const PORT = process.env.PORT || 4000;


// initialize express
const app = express();
// middlewares
app.use(cookieParser());
app.use(cors());
app.use(logger("dev"));
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
// not found
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(PORT, () => {
  connectDB().then(() => {
    console.log(`Server is running on port ${PORT}`);
    //   url
    console.log(`http://localhost:${PORT}`);
  });

  console.log(`http://localhost:${PORT}/health`);
});
