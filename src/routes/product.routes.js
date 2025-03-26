import express from "express";
import {
  AddProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  GetProductByName,
  UpdateProduct,
} from "../controller/product.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", GetAllProducts);
// search based on query
router.get("/search", GetProductByName);
router.get("/:id", GetProductById);
router.post("/", checkAdmin, AddProduct);
router.put("/:id", checkAdmin, UpdateProduct);
router.delete("/:id", checkAdmin, DeleteProduct);
export default router;
