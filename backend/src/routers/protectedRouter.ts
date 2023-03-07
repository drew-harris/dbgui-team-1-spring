import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

export const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.get("/", (req, res) => {
  res.json({ message: "You are authorized", username: req.user.username });
});
