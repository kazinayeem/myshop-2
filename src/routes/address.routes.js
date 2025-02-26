import express from "express";

import {
  getAddress,
  getAddressById,
  createAddress,
  updateAddress,
  addAddress,
  deleteAddress,
  getAddressByUserId,
} from "../controller/address.controller.js";

const router = express.Router();

router.get("/", getAddress);
router.get("/:id", getAddressById);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.post("/add", addAddress);
router.delete("/:id", deleteAddress);
router.get("/user/:id", getAddressByUserId);

export default router;
