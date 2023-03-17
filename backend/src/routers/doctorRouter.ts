import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
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
    take: params.limit ? parseInt(params.limit) : undefined,
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

// Links a doctor to a patient and vice versa
doctorRouter.post("/link", async (req, res) => {
  console.log("Linking doctor and patient");
  if (!req.body.doctorId && !req.body.patientId) {
    throw new APIError("Missing doctor or patient", 400);
  }
  try {
    const patient = await prisma.patient.update({
      where: {
        id: req.user.type === "patient" ? req.user.id : req.body.patientId,
      },
      data: {
        doctor: {
          connect: {
            id: req.user.type === "doctor" ? req.user.id : req.body.doctorId,
          },
        },
      },
      include: {
        doctor: true,
      },
    });

    res.json(patient); // returns the connected doctor
  } catch (error) {
    console.error(error);
    throw new APIError("Error linking doctor and patient", 500);
  }
});
