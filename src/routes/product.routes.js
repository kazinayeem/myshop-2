import express from "express";
import {
  AddProduct,
  GetAllProducts,
  GetProductById,
  GetProductByName
} from "../controller/product.controller.js";

const router = express.Router();

router.get("/", GetAllProducts);
// search based on query
router.get("/search", GetProductByName);
router.get("/:id", GetProductById);
router.post("/add", AddProduct);
export default router;
