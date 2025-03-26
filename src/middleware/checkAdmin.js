// check admin mdidleware
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const checkAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization;
   
    if (!token) {
      return res.status(401).json({ message: "Unauthorized 1" });
    }
    const decoded = jwt.verify(token, "3433erwrewrwr");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized 2" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default checkAdmin;
