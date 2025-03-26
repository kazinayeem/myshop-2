import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from "../controller/brand.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

// Get all brands
router.get("/", getAllBrands);

// Create a new brand
router.post("/", checkAdmin, createBrand);
// Update a brand by ID
router.put("/:id", checkAdmin, updateBrand);
// Delete a brand by ID
router.delete("/:id", checkAdmin, deleteBrand);

export default router;
