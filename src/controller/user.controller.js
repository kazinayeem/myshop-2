// user controller

// register user

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
// register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Use findOne to check for a single user with the given email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials 2" });
    }
    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "3433erwrewrwr",
      {
        expiresIn: "30d",
      }
    );
    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("address")
      .populate("orderhistory");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// get user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password")
      .populate("address")
      .populate({
        path: "orderhistory",
        populate: {
          path: "products.productId",
          select: "name price", // Selecting only name and price
        },
      });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
