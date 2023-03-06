import { Router } from "express";
import { doctorRouter } from "./doctorRouter";
import { patientRouter } from "./patientRouter";

export const userRouter = Router();

userRouter.use("/doctor", doctorRouter);
userRouter.use("/patient", patientRouter);
