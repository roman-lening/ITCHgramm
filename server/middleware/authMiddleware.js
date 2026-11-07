import jwt from "jsonwebtoken";
import "dotenv/config";


function authMiddleware(req, res, next) {
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
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (!decoded.userId) {
      return res.status(401).json({
        message: "Invalid authorization token",
      });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authorization token",
    });
  }
}

export default authMiddleware;

