import express from "express";
import {
  getAllSlider,
  addSlider,
  getSingleSlider,
  updateSlider,
  deleteSlider,
} from "../controller/slider.controller.js";

const router = express.Router();

router.get("/", getAllSlider);
router.post("/", addSlider);
router.get("/:id", getSingleSlider);
router.put("/:id", updateSlider);
router.delete("/:id", deleteSlider);

export default router;