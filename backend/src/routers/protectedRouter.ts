import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

export const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.get("/", (req, res) => {
  res.send("Current User: " + req.user.username);
});
