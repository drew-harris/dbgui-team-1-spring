import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../db";
import { APIError } from "../../error";

export const patientRouter = Router();

patientRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  const { username, email, password, firstName, lastName } = req.body;

  if (!username) {
    throw new APIError("Username is required", 400);
  }
  if (!email) {
    throw new APIError("Email is required", 400);
  }
  if (!password) {
    throw new APIError("Password is required", 400);
  }
  if (!firstName) {
    throw new APIError("First name is required", 400);
  }
  if (!lastName) {
    throw new APIError("Last name is required", 400);
  }

  // Check if user with email or username already exists
  const possibleUser = await prisma.patient.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    },
  });

  if (possibleUser) {
    console.log("User already exists", possibleUser);
    throw new APIError("User already exists", 400);
  }

  // Create a hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user
  const patient = await prisma.patient.create({
    data: {
      email,
      firstName,
      username,
      password: hashedPassword,
      lastName,
    },

    /** 
      This will be the shape of the object we return and put in our jwt
      The doctor jwt should have the exact same shape
    */
    select: {
      email: true,
      id: true,
      username: true,
    },
  });

  if (!process.env.JWT_SECRET) {
    throw new APIError("JWT secret not found", 500);
  }

  const token = jwt.sign(
    {
      ...patient,
      // Add a type discrimiator so that middleware can tell the difference between patient and doctor requests
      type: "patient",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return res.json({ jwt: token, user: patient });
});

patientRouter.post("/signin", async (req, res) => {
  // Needs email and password to sign in
  const { email, password } = req.body;

  if (!email) {
    throw new APIError("Email is required", 400);
  }
  if (!password) {
    throw new APIError("Password is required", 400);
  }

  const patient = await prisma.patient.findFirst({
    where: {
      email: email,
    },
  });

  console.log("Patient signing in", patient);

  if (!patient) {
    throw new APIError("User not found", 404);
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    patient.password
  );

  if (!isPasswordCorrect) {
    throw new APIError("Incorrect password", 400);
  }

  const token = jwt.sign(
    {
      id: patient.id,
      email: patient.email,
      username: patient.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return res.cookie("jwt", token).json({ jwt: token });
});
