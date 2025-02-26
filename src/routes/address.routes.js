import express from "express";

import {
  
  addAddress,deleteAddress,getAddressById,getAddressByUserId,updateAddress
} from "../controller/address.controller.js";

const router = express.Router();

router.post("/", addAddress);
router.get("/:id", getAddressById);
router.get("/user/:userId", getAddressByUserId);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
