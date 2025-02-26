// user routes
import express from "express";
import { register, login, getUsers } from "../controller/user.controller.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);

export default router;
