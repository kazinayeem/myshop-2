// user controller

// register user

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// login google without password if user is not registered then register user or else login user

export const googleRegisterandlogin = async (req, res) => {
  try {
    const { email, username, profilePic } = req.body;
    if (!email || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id },
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
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: existingUser._id,
          username: existingUser.username,
          email: existingUser.email,
          profilePic: existingUser.profilePic,
        },
        token,
      });
    } else {
      const newUser = new User({
        username,
        email,
        profilePic,
      });
      await newUser.save();
      // create token
      const token = jwt.sign(
        { id: newUser._id },
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
      return res.status(201).json({
        message: "Register successful",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

// register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email: email });

    // const checkusernameisexit = await User.findOne({
    //   username: username,
    // });
    // if (checkusernameisexit) {
    //   return res.status(400).json({ message: "Username already exists" });
    // }
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
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
};
// admin login
export const adminLogin = async (req, res) => {
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
    // check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
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
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      // .select("-password")
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

// udate user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, mobileNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { username, email, password, mobileNumber },
      { new: true }
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
