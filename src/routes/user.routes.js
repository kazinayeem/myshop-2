// user routes
import express from "express";
import {
  register,
  login,
  getUsers,
  getUserById,
  adminLogin,
} from "../controller/user.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// admin login
router.post("/admin/login", adminLogin);
router.get("/", getUsers);
// get user by id
router.get("/:id", getUserById);

export default router;
