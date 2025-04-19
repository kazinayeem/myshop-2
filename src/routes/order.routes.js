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
  posOrder,
  updateOrder,
} from "../controller/order.controller.js";
import checkLogin from "../middleware/checkLogin.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.post("/", checkLogin, createOrder);
router.post("/posOrder", posOrder);
router.put("/:id", checkAdmin, updateOrder);
router.delete("/:id", checkAdmin, deleteOrder);
router.get("/user/:id", getOrderByUserId);
router.get("/status/:status", getOrderByStatus);
router.get("/amount/:amount", getOrderByAmount);
router.get("/date/:date", getOrderByDate);
export default router;
