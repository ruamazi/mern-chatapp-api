import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt_token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.SEC);
  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
