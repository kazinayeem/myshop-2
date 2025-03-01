// user routes
import express from "express";
import { register, login, getUsers, getUserById } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getUsers);
// get user by id
router.get("/:id", getUserById);

export default router;
