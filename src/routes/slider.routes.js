import express from "express";
import {
  getAllSlider,
  addSlider,
  getSingleSlider,
  updateSlider,
  deleteSlider,
} from "../controller/slider.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", getAllSlider);
router.post("/",checkAdmin, addSlider);
router.get("/:id", getSingleSlider);
router.put("/:id",checkAdmin, updateSlider);
router.delete("/:id",checkAdmin, deleteSlider);

export default router;