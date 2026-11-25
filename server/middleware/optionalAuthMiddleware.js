import authMiddleware from "./authMiddleware.js";

const optionalAuthMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return next();
  }

  return authMiddleware(req, res, next);
};

export default optionalAuthMiddleware;
