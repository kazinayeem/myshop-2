import express from "express";
import cors from "cors";
import path from "path";
import logger from "morgan";
import "dotenv/config";
import connectDB from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import CategoryRoutes from "./routes/category.routes.js";
import SubCategoryRoutes from "./routes/subcategory.routes.js";
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// app.get("/", (req, res) => {
//   res.sendFile("index.html", { root: "public" });
// });

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
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
