import express from "express";
import {
  GetAllProducts,
  GetProductById,
} from "../controller/product.controller.js";

const router = express.Router();

router.get("/", GetAllProducts);
router.get("/:id", GetProductById);

export default router;
