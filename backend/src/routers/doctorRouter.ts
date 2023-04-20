import { Prisma } from "@prisma/client";
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
      location: params.location,
    },
    take: params.limit ? parseInt(params.limit) : undefined,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      practice: true,
      email: true,
      username: true,
      location: true,
      scheduleStartTime: true,
      scheduleEndTime: true,
    },
    orderBy: params.orderBy
      ? {
          [params.orderBy]: params.order,
        }
      : undefined,
  });

  return res.json(doctors);
});

doctorRouter.get("/fields", async (req, res) => {
  const params = parseParams(req);
  const field = params.field;
  if (!field) {
    throw new APIError("Missing field", 400);
  }
  const doctors = await prisma.doctor.findMany({
    distinct: field as Prisma.Enumerable<Prisma.DoctorScalarFieldEnum>,
    select: {
      [field]: true,
    },
  });

  const values = doctors.map((doctor) => doctor[field]);
  return res.json(values);
});

doctorRouter.get("/search", async (req, res) => {
  const params = parseParams(req);
  const doctors = await prisma.doctor.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: params.query,
          },
        },
        {
          lastName: {
            contains: params.query,
          },
        },
      ],
    },
    take: params.limit ? parseInt(params.limit) : undefined,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      practice: true,
      email: true,
      username: true,
      location: true,
      scheduleStartTime: true,
      scheduleEndTime: true,
    },
  });

  return res.json(doctors);
});

// Links a doctor to a patient and vice versa
doctorRouter.post("/link", async (req, res) => {
  console.log("Linking doctor and patient as:", req.user);
  if (!req.body.doctorId && !req.body.patientId) {
    throw new APIError("Missing doctor or patient", 400);
  }
  try {
    const patient = await prisma.patient.update({
      where: {
        id: req.user.type === "patient" ? req.user.id : req.body.patientId,
      },
      data: {
        doctorId: req.user.type === "doctor" ? req.user.id : req.body.doctorId,
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

doctorRouter.post("/unlink", async (req, res) => {
  // only takes a patient id
  console.log("Unlinking doctor and patient as:", req.user);
  const patient = await prisma.patient.update({
    where: {
      id: req.user.type === "patient" ? req.user.id : req.body.patientId,
    },
    data: {
      doctor: {
        disconnect: true,
      },
    },
  });

  res.json(patient); // returns the patient with null doctor
});
