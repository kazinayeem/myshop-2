import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import xssClean from "xss-clean";
import SSLCommerzPayment from "sslcommerz-lts";
dotenv.config();

import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import Order from "./model/order.model.js";
import addressRoutes from "./routes/address.routes.js";
import Brand from "./routes/brand.routes.js";
import CategoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import SliderRoutes from "./routes/slider.routes.js";
import SubCategoryRoutes from "./routes/subcategory.routes.js";
import userRoutes from "./routes/user.routes.js";

const store_id = process.env.STORE_ID || "kazi67f0c67596ef9";
const store_passwd = process.env.STORE_PASSWORD || "kazi67f0c67596ef9@ssl";
const is_live = false;
const frontendUrl =
  process.env.FRONTEND_URL || "https://myshop-2-x9hr.vercel.app/";
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

app.get("/transaction-query-by-transaction-id", (req, res) => {
  const data = {
    tran_id: req.query.tran_id,
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.transactionQueryByTransactionId(data).then((data) => {
    res.json(data);
  });
});
app.post("/success", async (req, res) => {
  try {
    const paymentData = req.query;
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const data = {
      tran_id: paymentData.tran_id,
    };

    const paymentinfo = await sslcz.transactionQueryByTransactionId(data);

    if (paymentinfo.no_of_trans_found > 0 && paymentinfo.element.length > 0) {
      await Order.findOneAndUpdate(
        { _id: paymentData.tran_id },
        {
          transactionId: paymentData.tran_id,
          transactionStatus: "success",
          paymentStatus: "paid",
          paymentMethod: paymentinfo.element[0].card_type,
          bankTransactionId: paymentinfo.element[0].bank_tran_id,
          transactionDate: paymentinfo.element[0].tran_date,
          paidAmount: paymentinfo.element[0].amount,
          dueAmount: 0,
        }
      );
      res.redirect(`${frontendUrl}/success?tran_id=${paymentData.tran_id}`);
    } else {
      res.redirect(`${frontendUrl}/fail?tran_id=${paymentData.tran_id}`);
    }
  } catch (error) {
    console.error("Error in success route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/fail", (req, res) => {
  res.redirect(`${frontendUrl}/fail`);
});

app.post("/cancel", (req, res) => {
  res.redirect(`${frontendUrl}/fail`);
});

app.post("/ipn", async (req, res) => {
  res.status(200).json({ message: "IPN received successfully" });
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
