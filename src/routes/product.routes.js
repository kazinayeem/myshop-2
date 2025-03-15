import express from "express";
import {
  AddProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  GetProductByName,
  UpdateProduct,
} from "../controller/product.controller.js";

const router = express.Router();

router.get("/", GetAllProducts);
// search based on query
router.get("/search", GetProductByName);
router.get("/:id", GetProductById);
router.post("/", AddProduct);
router.put("/:id", UpdateProduct);
router.delete("/:id", DeleteProduct);
export default router;
