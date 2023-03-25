import jwt from "jsonwebtoken";
import { APIError } from "../error";

export const authMiddleware = (req, _res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;

  if (!token) {
    throw new APIError("Unauthorized", 401);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    throw new APIError("Unauthorized", 401);
  }

  req.user = decodedToken;
  next();
};

export const doctorOnlyMiddleware = (req, _res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;

  if (!token) {
    throw new APIError("Unauthorized", 401);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    throw new APIError("Unauthorized", 401);
  }

  req.user = decodedToken;
  if (req.user.type !== "doctor") {
    throw new APIError("Unauthorized (must be a doctor)", 401);
  }
  next();
};
