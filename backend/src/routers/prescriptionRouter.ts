import { Router } from "express";
import { prisma } from "../db";
import { APIError } from "../error";
import {
  doctorOnlyMiddleware,
  patientOnlyMiddleware,
} from "../middleware/authMiddleware";

const prescriptionRouter = Router();

// Get all prescriptions for a patient (patient only)
prescriptionRouter.get("/", patientOnlyMiddleware, async (req, res) => {
  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: req.user.id },
  });
  res.json(prescriptions);
});

prescriptionRouter.get("/doctor", patientOnlyMiddleware, async (req, res) => {
  const prescriptions = await prisma.prescription.findMany({
    where: { doctorId: req.user.id },
  });
  res.json(prescriptions);
});

//Create prescription as a docotr
prescriptionRouter.post("/", doctorOnlyMiddleware, async (req, res) => {
  const { patientId, medication, dosage, frequency, duration, comment } =
    req.body;
  if (!req.user.id) {
    throw new APIError("Missing user id", 400);
  }
  const prescription = await prisma.prescription.create({
    data: {
      medication,
      dosage,
      frequency,
      duration,
      patient: {
        connect: {
          id: patientId,
        },
      },
      doctor: {
        connect: {
          id: req.user.id,
        },
      },
      comment,
    },
  });

  res.json(prescription);
});
// Update a prescription (doctor only)
prescriptionRouter.put("/:id", doctorOnlyMiddleware, async (req, res) => {
  const { id } = req.params;
  const { patientId, medication, dosage, frequency, duration } = req.body;

  const prescription = await prisma.prescription.update({
    where: { id },
    data: {
      patientId,
      medication,
      dosage,
      frequency,
      duration,
    },
  });

  res.json(prescription);
});

// Delete a prescription (doctor only)
prescriptionRouter.delete("/:id", doctorOnlyMiddleware, async (req, res) => {
  const { id } = req.params;

  await prisma.prescription.delete({
    where: { id },
  });

  res.json({ success: true });
});

// Request a refill on a prescription (patient only)
prescriptionRouter.post(
  "/:id/refill",
  patientOnlyMiddleware,
  async (req, res) => {
    const { id } = req.params;

    const refillRequest = await prisma.refill.create({
      data: {
        prescriptionId: id,
      },
    });

    res.json(refillRequest);
  }
);

// Accept or decline refill request (doctor only)
prescriptionRouter.put(
  "/:id/refill/:action",
  doctorOnlyMiddleware,
  async (req, res) => {
    const { id, action } = req.params;

    if (action !== "accept" && action !== "decline") {
      return res.status(400).json({ error: "Invalid action" });
    }

    const updatedRefill = await prisma.refill.update({
      where: { id },
      data: {
        approved: action === "accept" ? true : false,
      },
    });

    res.json(updatedRefill);
  }
);

//export
export { prescriptionRouter };
