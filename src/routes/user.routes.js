// user routes
import express from "express";
import {
  adminLogin,
  getUserById,
  getUsers,
  googleRegisterandlogin,
  login,
  register,
  updateUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// admin login
router.post("/admin/login", adminLogin);
router.get("/", getUsers);
// get user by id
router.get("/:id", getUserById);
// update user by id
router.put("/:id", updateUser);
// google login
router.post("/google/login", googleRegisterandlogin);

export default router;
