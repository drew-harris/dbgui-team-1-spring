import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../db";
import { APIError } from "../../error";

export const doctorRouter = Router();

doctorRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  const { username, email, password, practice, firstName, lastName } = req.body;

  if (!username) {
    throw new APIError("Username is required", 400);
  }
  if (!email) {
    throw new APIError("Email is required", 400);
  }
  if (!password) {
    throw new APIError("Password is required", 400);
  }
  if (!practice) {
    throw new APIError("Practice is required", 400);
  }
  if (!firstName) {
    throw new APIError("First name is required", 400);
  }
  if (!lastName) {
    throw new APIError("Last name is required", 400);
  }

  // Check if user with email or username already exists
  const possibleUser = await prisma.doctor.findFirst({
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
  const doctor = await prisma.doctor.create({
    data: {
      email,
      firstName,
      username,
      password: hashedPassword,
      lastName,
      practice,
    },

    /** 
      This will be the shape of the object we return and put in our jwt
      The patient jwt should have the exact same shape
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

  const token = jwt.sign(doctor, process.env.JWT_SECRET, { expiresIn: "30d" });

  return res.json({ jwt: token, user: doctor });
});
