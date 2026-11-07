import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../modules/User.js";
import "dotenv/config";

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization token is required",
    });
  }
  const token = authHeader.slice(7);
  if (!token) {
    return res.status(401).json({
      message: "Authorization token is required",
    });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (
      typeof decoded.userId !== "string" ||
      !mongoose.isObjectIdOrHexString(decoded.userId)
    ) {
      return res.status(401).json({
        message: "Invalid authorization token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authorization token",
    });
  }
  try {
    const userExists = await User.exists({
      _id: decoded.userId,
    });
    if (!userExists) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default authMiddleware;
