import { rateLimit, ipKeyGenerator } from "express-rate-limit";

const getClientIp = (req) => {
  const railwayIp = req.get("x-real-ip");
  const ip = process.env.RAILWAY_ENVIRONMENT && railwayIp ? railwayIp : req.ip;
  return ipKeyGenerator(ip || "unknown", 56);
};

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: getClientIp,
  message: {
    message: "Too many requests. Try again in 15 minutes.",
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: getClientIp,
  message: {
    message: "Too many attempts. Try again later.",
  },
});
