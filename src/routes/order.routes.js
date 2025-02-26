// order routes
import express from "express";

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderByAmount,
  getOrderByDate,
  getOrderById,
  getOrderByStatus,
  getOrderByUserId,
  updateOrder,
} from "../controller/order.controller.js";

const router = express.Router();
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.get("/user/:id", getOrderByUserId);
router.get("/status/:status", getOrderByStatus);
router.get("/amount/:amount", getOrderByAmount);
router.get("/date/:date", getOrderByDate);
export default router;
