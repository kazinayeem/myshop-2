// user routes
import express from "express";
import {
  adminLogin,
  changePasswordController,
  CheckOtpController,
  getUserById,
  getUsers,
  googleRegisterandlogin,
  login,
  register,
  resetPassword,
  SendOtpController,
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
// reset password
router.post("/reset-password", resetPassword);
// send otp
router.post("/send-otp", SendOtpController);
// verify otp
router.post("/verify-otp", CheckOtpController);
//change password
router.post("/change-password", changePasswordController);
export default router;
