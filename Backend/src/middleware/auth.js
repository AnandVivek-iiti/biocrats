import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Access token required" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// Middleware to verify admin
export const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, async () => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin privileges required.",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};