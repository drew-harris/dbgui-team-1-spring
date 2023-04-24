process.argv = [process.argv[0], ...process.argv.slice(3)];
import { createRequire } from "module";
const require = createRequire("/Users/camdc/Downloads/school/3345/dbgui-team-1-spring/backend/esrun-clgrc5lda0001y4ls0nzw4xgt.tmp.mjs");
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.ts
import * as cors from "../node_modules/cors/lib/index.js";
import dotenv from "../node_modules/dotenv/lib/main.js";
import express from "../node_modules/express/index.js";
import cookieParser from "../node_modules/cookie-parser/index.js";

// src/error.ts
var APIError = class extends Error {
  constructor(message = "Internal Server Error", status = 500, originalError = null) {
    super(message);
    this.message = message;
    this.status = status;
    this.originalError = originalError;
  }
};

// src/routers/protectedRouter.ts
import { Router } from "../node_modules/express/index.js";

// src/middleware/authMiddleware.ts
import jwt from "../node_modules/jsonwebtoken/index.js";
var authMiddleware = (req, _res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;
  if (!token) {
    throw new APIError("Unauthorized", 401);
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    throw new APIError("Unauthorized", 401);
  }
  req.user = decodedToken;
  next();
};
var doctorOnlyMiddleware = (req, _res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;
  if (!token) {
    throw new APIError("Unauthorized", 401);
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    throw new APIError("Unauthorized", 401);
  }
  req.user = decodedToken;
  if (req.user.type !== "doctor") {
    throw new APIError("Unauthorized (must be a doctor)", 401);
  }
  next();
};
var patientOnlyMiddleware = (req, _res, next) => {
  const token = req.headers.authorization || req.cookies.jwt;
  if (!token) {
    throw new APIError("Unauthorized", 401);
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    throw new APIError("Unauthorized", 401);
  }
  req.user = decodedToken;
  if (req.user.type !== "patient") {
    throw new APIError("Unauthorized (must be a patient)", 401);
  }
  next();
};

// src/routers/protectedRouter.ts
var protectedRouter = Router();
protectedRouter.use(authMiddleware);
protectedRouter.get("/", (req, res) => {
  res.json({ message: "You are authorized", username: req.user.username });
});

// src/routers/userRouters/index.ts
import { Router as Router4 } from "../node_modules/express/index.js";

// src/routers/userRouters/doctorRouter.ts
import bcrypt from "../node_modules/bcrypt/bcrypt.js";
import { Router as Router2 } from "../node_modules/express/index.js";
import jwt2 from "../node_modules/jsonwebtoken/index.js";

// src/db.ts
import { PrismaClient } from "../node_modules/@prisma/client/index.js";
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;

// src/routers/userRouters/doctorRouter.ts
var doctorRouter = Router2();
doctorRouter.post("/signup", (req, res) => __async(void 0, null, function* () {
  console.log(req.body);
  const { username, email, password, practice, firstName, lastName, location } = req.body;
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
  if (!location) {
    throw new APIError("Location is required", 400);
  }
  const possibleUser = yield prisma.doctor.findFirst({
    where: {
      OR: [
        {
          email
        },
        {
          username
        }
      ]
    }
  });
  if (possibleUser) {
    console.log("User already exists", possibleUser);
    throw new APIError("User already exists", 400);
  }
  const salt = yield bcrypt.genSalt(10);
  const hashedPassword = yield bcrypt.hash(password, salt);
  const doctor = yield prisma.doctor.create({
    data: {
      email,
      firstName,
      username,
      password: hashedPassword,
      lastName,
      practice,
      location
    },
    /** 
      This will be the shape of the object we return and put in our jwt
      The patient jwt should have the exact same shape
    */
    select: {
      email: true,
      id: true,
      username: true
    }
  });
  if (!process.env.JWT_SECRET) {
    throw new APIError("JWT secret not found", 500);
  }
  const token = jwt2.sign(
    __spreadProps(__spreadValues({}, doctor), {
      type: "doctor"
    }),
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return res.json({ jwt: token, user: doctor });
}));
doctorRouter.post("/signin", (req, res) => __async(void 0, null, function* () {
  const { email, password } = req.body;
  if (!email) {
    throw new APIError("Email is required", 400);
  }
  if (!password) {
    throw new APIError("Password is required", 400);
  }
  const doctor = yield prisma.doctor.findFirst({
    where: {
      email
    }
  });
  console.log("Doctor", doctor);
  if (!doctor) {
    throw new APIError("User not found", 404);
  }
  const isPasswordCorrect = yield bcrypt.compare(
    req.body.password,
    doctor.password
  );
  if (!isPasswordCorrect) {
    throw new APIError("Incorrect password", 400);
  }
  const token = jwt2.sign(
    {
      id: doctor.id,
      email: doctor.email,
      username: doctor.username,
      type: "doctor"
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return res.cookie("jwt", token).json({ jwt: token });
}));

// src/routers/userRouters/patientRouter.ts
import bcrypt2 from "../node_modules/bcrypt/bcrypt.js";
import { Router as Router3 } from "../node_modules/express/index.js";
import jwt3 from "../node_modules/jsonwebtoken/index.js";
var patientRouter = Router3();
patientRouter.post("/signup", (req, res) => __async(void 0, null, function* () {
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
  const possibleUser = yield prisma.patient.findFirst({
    where: {
      OR: [
        {
          email
        },
        {
          username
        }
      ]
    }
  });
  if (possibleUser) {
    console.log("User already exists", possibleUser);
    throw new APIError("User already exists", 400);
  }
  const salt = yield bcrypt2.genSalt(10);
  const hashedPassword = yield bcrypt2.hash(password, salt);
  const patient = yield prisma.patient.create({
    data: {
      email,
      firstName,
      username,
      password: hashedPassword,
      lastName
    },
    /** 
      This will be the shape of the object we return and put in our jwt
      The doctor jwt should have the exact same shape
    */
    select: {
      email: true,
      id: true,
      username: true
    }
  });
  if (!process.env.JWT_SECRET) {
    throw new APIError("JWT secret not found", 500);
  }
  const token = jwt3.sign(
    __spreadProps(__spreadValues({}, patient), {
      // Add a type discrimiator so that middleware can tell the difference between patient and doctor requests
      type: "patient"
    }),
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return res.json({ jwt: token, user: patient });
}));
patientRouter.post("/signin", (req, res) => __async(void 0, null, function* () {
  const { email, password } = req.body;
  if (!email) {
    throw new APIError("Email is required", 400);
  }
  if (!password) {
    throw new APIError("Password is required", 400);
  }
  const patient = yield prisma.patient.findFirst({
    where: {
      email
    }
  });
  console.log("Patient signing in", patient);
  if (!patient) {
    throw new APIError("User not found", 404);
  }
  const isPasswordCorrect = yield bcrypt2.compare(
    req.body.password,
    patient.password
  );
  if (!isPasswordCorrect) {
    throw new APIError("Incorrect password", 400);
  }
  const token = jwt3.sign(
    {
      id: patient.id,
      email: patient.email,
      username: patient.username,
      type: "patient"
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return res.cookie("jwt", token).json({ jwt: token });
}));

// src/routers/userRouters/index.ts
var userRouter = Router4();
userRouter.use("/doctor", doctorRouter);
userRouter.use("/patient", patientRouter);

// src/routers/doctorRouter.ts
import { Router as Router5 } from "../node_modules/express/index.js";

// src/utils/params.ts
function parseParams(req) {
  const raw = req.query;
  const safe = {};
  for (const key in raw) {
    if (typeof raw[key] !== "string")
      continue;
    safe[key] = raw[key] || void 0 || void 0;
  }
  return safe;
}

// src/routers/doctorRouter.ts
var doctorRouter2 = Router5();
doctorRouter2.use(authMiddleware);
doctorRouter2.get("/", (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const doctors = yield prisma.doctor.findMany({
    where: {
      id: params.id,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      username: params.username,
      practice: params.practice,
      location: params.location
    },
    take: params.limit ? parseInt(params.limit) : void 0,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      practice: true,
      email: true,
      username: true,
      location: true,
      scheduleStartTime: true,
      scheduleEndTime: true
    },
    orderBy: params.orderBy ? {
      [params.orderBy]: params.order
    } : void 0
  });
  return res.json(doctors);
}));
doctorRouter2.get("/fields", (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const field = params.field;
  if (!field) {
    throw new APIError("Missing field", 400);
  }
  const doctors = yield prisma.doctor.findMany({
    distinct: field,
    select: {
      [field]: true
    }
  });
  const values = doctors.map((doctor) => doctor[field]);
  return res.json(values);
}));
doctorRouter2.get("/search", (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const doctors = yield prisma.doctor.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: params.query
          }
        },
        {
          lastName: {
            contains: params.query
          }
        }
      ]
    },
    take: params.limit ? parseInt(params.limit) : void 0,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      practice: true,
      email: true,
      username: true,
      location: true,
      scheduleStartTime: true,
      scheduleEndTime: true
    }
  });
  return res.json(doctors);
}));
doctorRouter2.post("/link", (req, res) => __async(void 0, null, function* () {
  console.log("Linking doctor and patient as:", req.user);
  if (!req.body.doctorId && !req.body.patientId) {
    throw new APIError("Missing doctor or patient", 400);
  }
  try {
    const patient = yield prisma.patient.update({
      where: {
        id: req.user.type === "patient" ? req.user.id : req.body.patientId
      },
      data: {
        doctorId: req.user.type === "doctor" ? req.user.id : req.body.doctorId
      },
      include: {
        doctor: true
      }
    });
    res.json(patient);
  } catch (error) {
    console.error(error);
    throw new APIError("Error linking doctor and patient", 500);
  }
}));
doctorRouter2.post("/unlink", (req, res) => __async(void 0, null, function* () {
  console.log("Unlinking doctor and patient as:", req.user);
  const patient = yield prisma.patient.update({
    where: {
      id: req.user.type === "patient" ? req.user.id : req.body.patientId
    },
    data: {
      doctor: {
        disconnect: true
      }
    }
  });
  res.json(patient);
}));

// src/routers/discussionRouter.ts
import { Router as Router6 } from "../node_modules/express/index.js";
var discussionRouter = Router6();
discussionRouter.use(doctorOnlyMiddleware);
discussionRouter.post("/", (req, res) => __async(void 0, null, function* () {
  const body = req.body;
  if (!(body == null ? void 0 : body.title) || !(body == null ? void 0 : body.body)) {
    throw new APIError("Missing title or body", 400);
  }
  const post = yield prisma.discussion.create({
    data: {
      title: body.title,
      body: body.body,
      createdBy: {
        connect: {
          id: req.user.id
        }
      }
    }
  });
  return res.json(post);
}));
discussionRouter.get("/", (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  console.log(params);
  const posts = yield prisma.discussion.findMany({
    where: {
      id: params.id,
      createdById: params.doctorId,
      body: {
        contains: params.query
      }
    },
    orderBy: params.orderBy ? {
      [params.orderBy]: params.order || "desc"
    } : void 0
  });
  res.json(posts);
}));
discussionRouter.delete("/:id", (req, res) => __async(void 0, null, function* () {
  try {
    yield prisma.comment.deleteMany({
      where: {
        discussionId: req.params.id
      }
    });
  } catch (error) {
    throw new APIError("Could not delete comments", 500);
  }
  const post = yield prisma.discussion.deleteMany({
    where: {
      id: req.params.id,
      createdById: req.user.id
    }
  });
  if (post.count === 0) {
    throw new APIError("No post was deleted", 400);
  }
  res.json(post);
}));
discussionRouter.get("/:id", (req, res) => __async(void 0, null, function* () {
  const post = yield prisma.discussion.findUnique({
    where: {
      id: req.params.id
    },
    include: {
      comments: true
    }
  });
  res.json(post);
}));
discussionRouter.post("/comment", (req, res) => __async(void 0, null, function* () {
  const body = req.body;
  if (!(body == null ? void 0 : body.content) || !(body == null ? void 0 : body.discussionId)) {
    throw new APIError("Missing content or discussionId", 400);
  }
  const comment = yield prisma.comment.create({
    data: {
      content: body.content,
      createdBy: {
        connect: {
          id: req.user.id
        }
      },
      discussion: {
        connect: {
          id: body.discussionId
        }
      }
    }
  });
  return res.json(comment);
}));
discussionRouter.delete("/comment/:id", (req, res) => __async(void 0, null, function* () {
  if (!req.params.id) {
    throw new APIError("Missing comment id", 400);
  }
  const comment = yield prisma.comment.deleteMany({
    where: {
      id: req.params.id,
      createdById: req.user.id
    }
  });
  if (comment.count === 0) {
    throw new APIError("No comment was deleted", 400);
  }
  res.json(comment);
}));

// src/routers/appointmentRouter.ts
import { Router as Router7 } from "../node_modules/express/index.js";
var appointmentRouter = Router7();
appointmentRouter.get("/", authMiddleware, (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const appointments = yield prisma.appointment.findMany({
    where: {
      id: params.id,
      doctorId: params.doctorId,
      patientId: params.patientId
    },
    orderBy: params.orderBy ? {
      [params.orderBy]: params.order || "desc"
    } : void 0,
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      }
    }
  });
  res.json(appointments);
}));
appointmentRouter.post("/", patientOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const body = req.body;
  if (!body) {
    throw new APIError("Missing body", 400);
  }
  if (!body.reason) {
    throw new APIError("Missing reason", 400);
  }
  let time;
  try {
    time = new Date(body.time);
  } catch (error) {
    throw new APIError("Invalid time", 400);
  }
  const appointment = yield prisma.appointment.create({
    data: {
      patientId: req.user.id,
      doctorId: body.doctorId,
      reason: body.reason,
      time
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      }
    }
  });
  return res.json(appointment);
}));
appointmentRouter.delete("/:id", authMiddleware, (req, res) => __async(void 0, null, function* () {
  const appointment = yield prisma.appointment.findUnique({
    where: {
      id: req.params.id
    },
    include: {
      doctor: true,
      patient: true
    }
  });
  if (!appointment) {
    throw new APIError("Appointment not found", 404);
  }
  console.log(req.user.id, appointment.patientId, appointment.doctorId);
  if (appointment.patientId !== req.user.id && req.user.id !== appointment.doctorId) {
    throw new APIError("Unauthorized", 401);
  }
  yield prisma.appointment.delete({
    where: {
      id: req.params.id
    }
  });
  return res.json({ success: true });
}));
appointmentRouter.put(
  "/:id/approve",
  doctorOnlyMiddleware,
  (req, res) => __async(void 0, null, function* () {
    const appointment = yield prisma.appointment.findUnique({
      where: {
        id: req.params.id
      }
    });
    if (!appointment) {
      throw new APIError("Appointment not found", 404);
    }
    if (appointment.doctorId !== req.user.id) {
      throw new APIError("Unauthorized (not the right doctor)", 401);
    }
    const updated = yield prisma.appointment.update({
      where: {
        id: req.params.id
      },
      data: {
        approved: true
      },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            id: true
          }
        },
        patient: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
            id: true
          }
        }
      }
    });
    return res.json(updated);
  })
);
appointmentRouter.put("/:id/reject", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const appointment = yield prisma.appointment.findUnique({
    where: {
      id: req.params.id
    }
  });
  if (!appointment) {
    throw new APIError("Appointment not found", 404);
  }
  if (appointment.doctorId !== req.user.id) {
    throw new APIError("Unauthorized (not the right doctor)", 401);
  }
  const updated = yield prisma.appointment.update({
    where: {
      id: req.params.id
    },
    data: {
      approved: false
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      }
    }
  });
  return res.json(updated);
}));

// src/routers/prescriptionRouter.ts
import { Router as Router8 } from "../node_modules/express/index.js";
var prescriptionRouter = Router8();
prescriptionRouter.get("/", patientOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const prescriptions = yield prisma.prescription.findMany({
    where: { patientId: req.user.id },
    select: {
      comment: true,
      doctor: true,
      patient: true,
      refills: true
    }
  });
  res.json(prescriptions);
}));
prescriptionRouter.post("/", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const { patientId, medication, dosage, frequency, duration, comment } = req.body;
  if (!req.user.id) {
    throw new APIError("Missing user id", 400);
  }
  const prescription = yield prisma.prescription.create({
    data: {
      medication,
      dosage,
      frequency,
      duration,
      patient: {
        connect: {
          id: patientId
        }
      },
      doctor: {
        connect: {
          id: req.user.id
        }
      },
      comment
    }
  });
  res.json(prescription);
}));
prescriptionRouter.put("/:id", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  const { patientId, medication, dosage, frequency, duration } = req.body;
  const prescription = yield prisma.prescription.update({
    where: { id },
    data: {
      patientId,
      medication,
      dosage,
      frequency,
      duration
    }
  });
  res.json(prescription);
}));
prescriptionRouter.delete("/:id", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  yield prisma.prescription.delete({
    where: { id }
  });
  res.json({ success: true });
}));
prescriptionRouter.post("/:id/refill", patientOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  const refillRequest = yield prisma.refill.create({
    data: {
      prescriptionId: id
    }
  });
  res.json(refillRequest);
}));
prescriptionRouter.put("/:id/refill/:action", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const { id, action } = req.params;
  if (action !== "accept" && action !== "decline") {
    return res.status(400).json({ error: "Invalid action" });
  }
  const updatedRefill = yield prisma.refill.update({
    where: { id },
    data: {
      approved: action === "accept" ? true : false
    }
  });
  res.json(updatedRefill);
}));

// src/routers/reviewsRouter.ts
import { Router as Router9 } from "../node_modules/express/index.js";
var reviewRouter = Router9();
reviewRouter.get("/", authMiddleware, (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const reviews = yield prisma.review.findMany({
    where: {
      id: params.id,
      doctorId: params.doctorId,
      patientId: params.patientId
    },
    orderBy: params.orderBy ? {
      [params.orderBy]: params.order || "desc"
    } : void 0,
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      }
    }
  });
  res.json(reviews);
}));
reviewRouter.get("/:doctorId", authMiddleware, (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const reviews = yield prisma.review.findMany({
    where: {
      doctorId: params.doctorId
    },
    orderBy: params.orderBy ? {
      [params.orderBy]: params.order || "desc"
    } : void 0,
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      }
    }
  });
  res.json(reviews);
}));
reviewRouter.post("/", patientOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const body = req.body;
  if (!body) {
    throw new APIError("Missing body", 400);
  }
  if (!body.comments) {
    throw new APIError("Missing comments", 400);
  }
  if (!body.rating) {
    throw new APIError("Missing rating", 400);
  }
  const review = yield prisma.review.create({
    data: {
      patientId: req.user.id,
      doctorId: body.doctorId,
      content: body.content,
      rating: body.rating
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      }
    }
  });
  res.json(review);
}));
reviewRouter.put("/:id", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const review = yield prisma.review.findUnique({
    where: {
      id: req.params.id
    }
  });
  const body = req.body;
  if (!review) {
    throw new APIError("Review not found", 400);
  }
  if (!body) {
    throw new APIError("Missing body", 400);
  }
  if (!body.comments) {
    throw new APIError("Missing comments", 400);
  }
  if (!body.rating) {
    throw new APIError("Missing rating", 400);
  }
  const updatedReview = yield prisma.review.update({
    where: {
      id: req.params.id
    },
    data: {
      rating: body.rating,
      content: body.content
    },
    include: {
      doctor: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      },
      patient: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          id: true
        }
      }
    }
  });
  res.json(updatedReview);
}));
reviewRouter.delete("/:id", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  const review = yield prisma.appointment.findUnique({
    where: {
      id: req.params.id
    },
    include: {
      doctor: true,
      patient: true
    }
  });
  if (!review) {
    throw new APIError("Appointment not found", 404);
  }
  if (review.patientId !== req.user.id && req.user.id !== review.doctorId)
    throw new APIError("Unauthorized", 401);
  yield prisma.appointment.delete({
    where: {
      id: req.params.id
    }
  });
  return res.json({ success: true });
}));

// src/routers/scheduleRouter.ts
import { Router as Router10 } from "../node_modules/express/index.js";
var scheduleRouter = Router10();
scheduleRouter.get("/", authMiddleware, (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  let docId;
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
    const schedule = yield prisma.doctor.findFirst({
      where: {
        id: docId
      },
      select: {
        scheduleStartTime: true,
        scheduleEndTime: true
      }
    });
    return res.json({
      start: schedule == null ? void 0 : schedule.scheduleStartTime,
      end: schedule == null ? void 0 : schedule.scheduleEndTime
    });
  } catch (error) {
    console.error(error);
    throw new APIError("Error getting schedule", 500, error);
  }
}));
scheduleRouter.post("/", doctorOnlyMiddleware, (req, res) => __async(void 0, null, function* () {
  var _a, _b, _c;
  if (!((_a = req.body) == null ? void 0 : _a.start)) {
    throw new APIError("Missing start time", 400);
  }
  if (!((_b = req.body) == null ? void 0 : _b.end)) {
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
  const docId = (_c = req.user) == null ? void 0 : _c.id;
  if (!docId) {
    throw new APIError("Missing doctor id", 400);
  }
  try {
    const schedule = yield prisma.doctor.update({
      where: {
        id: docId
      },
      data: {
        scheduleStartTime: startNum,
        scheduleEndTime: endNum
      }
    });
    return res.json({
      start: schedule.scheduleStartTime,
      end: schedule.scheduleEndTime
    });
  } catch (error) {
    throw new APIError("Error updating schedule", 500, error);
  }
}));

// src/routers/patientRouter.ts
import { Router as Router11 } from "../node_modules/express/index.js";
var patientRouter2 = Router11();
patientRouter2.use(authMiddleware);
patientRouter2.get("/", (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const patients = yield prisma.patient.findMany({
    where: {
      id: params.id,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      username: params.username
    },
    take: params.limit ? parseInt(params.limit) : void 0,
    select: {
      id: true,
      firstName: true,
      doctorId: true,
      lastName: true,
      email: true,
      username: true
    },
    orderBy: params.orderBy ? {
      [params.orderBy]: params.order
    } : void 0
  });
  return res.json(patients);
}));
patientRouter2.get("/fields", (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const field = params.field;
  if (!field) {
    throw new APIError("Missing field", 400);
  }
  const patients = yield prisma.patient.findMany({
    distinct: field,
    select: {
      [field]: true
    }
  });
  const values = patients.map((doctor) => doctor[field]);
  return res.json(values);
}));
patientRouter2.get("/search", (req, res) => __async(void 0, null, function* () {
  const params = parseParams(req);
  const patients = yield prisma.patient.findMany({
    where: {
      OR: [
        {
          firstName: {
            contains: params.query
          }
        },
        {
          lastName: {
            contains: params.query
          }
        }
      ]
    },
    take: params.limit ? parseInt(params.limit) : void 0,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      doctorId: true
    }
  });
  return res.json(patients);
}));

// src/index.ts
dotenv.config();
var app = express();
app.use(cors.default());
app.use(express.json());
app.use(cookieParser());
var port = process.env.PORT || 8e3;
app.get("/health", (req, res) => {
  res.send("OK");
});
app.use("/user", userRouter);
app.use("/doctors", doctorRouter2);
app.use("patients", patientRouter2);
app.use("/discussions", discussionRouter);
app.use("/appointments", appointmentRouter);
app.use("/schedules", scheduleRouter);
app.use("/protected", protectedRouter);
app.use("/reviews", reviewRouter);
app.use("/prescriptions", prescriptionRouter);
app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof APIError) {
    if (err.originalError) {
      console.error(err.originalError);
    }
    res.status(err.status).json({
      error: {
        error: err.originalError,
        message: err.message
      }
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: {
        error: err.message,
        message: "Internal server error"
      }
    });
  }
});
app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
}).on("error", (error) => {
  console.log(error);
});
