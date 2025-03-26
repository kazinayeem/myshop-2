// category routes
import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from "../controller/category.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";
const router = express.Router();

router.post("/",checkAdmin, createCategory); 
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id",checkAdmin, deleteCategory);

export default router;
