import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
import { authMiddleware } from "../middleware/authMiddleware";
import { parseParams } from "../utils/params";

export const patientRouter = Router();

patientRouter.use(authMiddleware);

patientRouter.get("/", async (req, res) => {
  const params = parseParams(req);
  const patients = await prisma.patient.findMany({
    where: {
      id: params.id,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      username: params.username,
    },
    take: params.limit ? parseInt(params.limit) : undefined,
    select: {
      id: true,
      firstName: true,
      doctorId: true,
      lastName: true,
      email: true,
      username: true,
    },
    orderBy: params.orderBy
      ? {
          [params.orderBy]: params.order,
        }
      : undefined,
  });

  return res.json(patients);
});

patientRouter.get("/fields", async (req, res) => {
  const params = parseParams(req);
  const field = params.field;
  if (!field) {
    throw new APIError("Missing field", 400);
  }
  const patients = await prisma.patient.findMany({
    distinct: field as Prisma.Enumerable<Prisma.PatientScalarFieldEnum>,
    select: {
      [field]: true,
    },
  });

  const values = patients.map((doctor) => doctor[field]);
  return res.json(values);
});

patientRouter.get("/search", async (req, res) => {
  const params = parseParams(req);
  const patients = await prisma.patient.findMany({
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
      email: true,
      username: true,
      doctorId: true,
    },
  });

  return res.json(patients);
});
