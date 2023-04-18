import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
import {
  authMiddleware,
  doctorOnlyMiddleware,
} from "../middleware/authMiddleware";
import { parseParams } from "../utils/params";

const scheduleRouter = Router();

// Returns the schedule for a doctor, the current doctor if thats what the user is
scheduleRouter.get("/", authMiddleware, async (req, res) => {
  const params = parseParams(req);
  let docId: string;
  if (req.user.type === "doctor") {
    docId = req.user.id;
  } else if (params.id) {
    docId = params.id;
  } else {
    throw new APIError("Missing doctor id", 400);
  }

  if (!docId || typeof docId !== "string") {
    throw new APIError("Missing doctor id", 400);
  }

  try {
    const schedule = await prisma.doctor.findFirst({
      where: {
        id: docId,
      },

      select: {
        scheduleStartTime: true,
        scheduleEndTime: true,
      },
    });
    return res.json({
      start: schedule?.scheduleStartTime,
      end: schedule?.scheduleEndTime,
    });
  } catch (error) {
    console.error(error);
    throw new APIError("Error getting schedule", 500, error);
  }
});

scheduleRouter.post("/", doctorOnlyMiddleware, async (req, res) => {
  if (!req.body?.start) {
    throw new APIError("Missing start time", 400);
  }

  if (!req.body?.end) {
    throw new APIError("Missing end time", 400);
  }

  const { start, end } = req.body;
  if (!start || !end) {
    throw new APIError("Missing start or end time", 400);
  }

  const startNum = parseInt(start);
  const endNum = parseInt(end);

  if (isNaN(startNum) || isNaN(endNum)) {
    throw new Error("Start or end time is not a number");
  }
  if (startNum < 0 || startNum > 23) {
    throw new Error("Start time is not a valid hour");
  }
  if (endNum < 0 || endNum > 23) {
    throw new Error("End time is not a valid hour");
  }
  if (startNum >= endNum) {
    throw new Error("Start time must be before end time");
  }

  const docId = req.user?.id;
  if (!docId) {
    throw new APIError("Missing doctor id", 400);
  }

  try {
    const schedule = await prisma.doctor.update({
      where: {
        id: docId,
      },
      data: {
        scheduleStartTime: startNum,
        scheduleEndTime: endNum,
      },
    });
    return res.json({
      start: schedule.scheduleStartTime,
      end: schedule.scheduleEndTime,
    });
  } catch (error) {
    throw new APIError("Error updating schedule", 500, error);
  }
});

export { scheduleRouter };
