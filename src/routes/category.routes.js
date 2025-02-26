// category routes
import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from "../controller/category.controller.js";
const router = express.Router();

router.post("/", createCategory); 
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
