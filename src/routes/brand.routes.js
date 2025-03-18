import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from "../controller/brand.controller.js";

const router = express.Router();

// Get all brands
router.get("/", getAllBrands);

// Create a new brand
router.post("/", createBrand);
// Update a brand by ID
router.put("/:id", updateBrand);
// Delete a brand by ID
router.delete("/:id", deleteBrand);

export default router;
