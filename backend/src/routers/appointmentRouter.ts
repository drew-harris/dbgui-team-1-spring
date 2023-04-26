import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
import {
  authMiddleware,
  doctorOnlyMiddleware,
  patientOnlyMiddleware,
} from "../middleware/authMiddleware";
import { parseParams } from "../utils/params";

const appointmentRouter = Router();

appointmentRouter.get("/", authMiddleware, async (req, res) => {
  const params = parseParams(req);
  const appointments = await prisma.appointment.findMany({
    where: {
      id: params.id,
      doctorId: params.doctorId,
      patientId: params.patientId,
    },
    orderBy: params.orderBy
      ? {
          [params.orderBy]: params.order || "desc",
        }
      : undefined,
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
    },
  });
  res.json(appointments);
});

// Update an appointment
appointmentRouter.put("/:id", authMiddleware, async (req, res) => {
  const body = req.body;
  if (!body) {
    throw new APIError("Missing body", 400);
  }

  const appointment = await prisma.appointment.update({
    where: {
      id: req.params.id,
    },
    data: {
      approved: body.approved,
      reason: body.reason,
      time: body.time ? new Date(body.time) : undefined,
    },
  });

  return res.json(appointment);
});

appointmentRouter.post("/", patientOnlyMiddleware, async (req, res) => {
  const body = req.body;
  if (!body) {
    throw new APIError("Missing body", 400);
  }

  if (!body.reason) {
    throw new APIError("Missing reason", 400);
  }

  let time: Date;
  try {
    time = new Date(body.time);
  } catch (error) {
    throw new APIError("Invalid time", 400);
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: req.user.id,
      doctorId: body.doctorId,
      reason: body.reason,
      time,
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
    },
  });

  return res.json(appointment);
});

appointmentRouter.post("/doctor", doctorOnlyMiddleware, async (req, res) => {
  const body = req.body;
  if (!body) {
    throw new APIError("Missing body", 400);
  }

  if (!body.reason) {
    throw new APIError("Missing reason", 400);
  }

  let time: Date;
  try {
    time = new Date(body.time);
  } catch (error) {
    throw new APIError("Invalid time", 400);
  }

  const appointment = await prisma.appointment.create({
    data: {
      patient: {
        connect: {
          id: body.patientId,
        },
      },
      reason: body.reason,
      time,
      doctor: {
        connect: {
          id: req.user.id,
        },
      },
      approved: true,
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
    },
  });

  return res.json(appointment);
});

// Cancel an appointment
appointmentRouter.delete("/:id", authMiddleware, async (req, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (!appointment) {
    throw new APIError("Appointment not found", 404);
  }
  console.log(req.user.id, appointment.patientId, appointment.doctorId);

  // Must be involved in the appointment
  if (
    appointment.patientId !== req.user.id &&
    req.user.id !== appointment.doctorId
  ) {
    throw new APIError("Unauthorized", 401);
  }

  await prisma.appointment.delete({
    where: {
      id: req.params.id,
    },
  });

  return res.json({ success: true });
});

// Approve appointment as doctor
appointmentRouter.put(
  "/:id/approve",
  doctorOnlyMiddleware,
  async (req, res) => {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!appointment) {
      throw new APIError("Appointment not found", 404);
    }

    if (appointment.doctorId !== req.user.id) {
      throw new APIError("Unauthorized (not the right doctor)", 401);
    }

    const updated = await prisma.appointment.update({
      where: {
        id: req.params.id,
      },
      data: {
        approved: true,
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            id: true,
          },
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            id: true,
          },
        },
      },
    });

    return res.json(updated);
  }
);

// Re-reject appointment as doctor
appointmentRouter.put("/:id/reject", doctorOnlyMiddleware, async (req, res) => {
  const appointment = await prisma.appointment.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!appointment) {
    throw new APIError("Appointment not found", 404);
  }

  if (appointment.doctorId !== req.user.id) {
    throw new APIError("Unauthorized (not the right doctor)", 401);
  }

  const updated = await prisma.appointment.update({
    where: {
      id: req.params.id,
    },
    data: {
      approved: false,
    },

    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true,
        },
      },
    },
  });

  return res.json(updated);
});

export { appointmentRouter };
