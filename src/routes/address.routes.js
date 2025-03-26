import express from "express";

import {
  addAddress,
  deleteAddress,
  getAddressById,
  getAddressByUserId,
  updateAddress,
} from "../controller/address.controller.js";
import checkLogin from "../middleware/checkLogin.js";

const router = express.Router();

router.post("/", checkLogin, addAddress);
router.get("/:id", checkLogin, getAddressById);
router.get("/user/:userId", checkLogin, getAddressByUserId);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
