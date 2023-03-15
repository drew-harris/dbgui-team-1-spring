import { Router } from "express";
import { prisma } from "../db";
import { authMiddleware } from "../middleware/authMiddleware";
import { parseParams } from "../utils/params";

export const doctorRouter = Router();

doctorRouter.use(authMiddleware);

doctorRouter.get("/", async (req, res) => {
  const params = parseParams(req);
  const doctors = await prisma.doctor.findMany({
    where: {
      id: params.id,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      username: params.username,
      practice: params.practice,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      practice: true,
      email: true,
      username: true,
    },
    orderBy: {
      [params.orderBy]: params.order,
    },
  });

  return res.json(doctors);
});
