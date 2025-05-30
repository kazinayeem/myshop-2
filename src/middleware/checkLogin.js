// check login middleware
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
const checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, "3433erwrewrwr");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkLogin;
