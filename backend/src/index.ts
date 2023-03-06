import * as cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import { APIError } from "./error";
import { protectedRouter } from "./routers/protectedRouter";
import { userRouter } from "./routers/userRouters";

// Load enviornment variables from .env file
dotenv.config();

const app = express();
app.use(cors.default());
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8000;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.use("/user", userRouter);
app.use("/protected", protectedRouter);

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
        message: err.message,
      },
    });
  } else {
    console.error(err);
    res.status(500).json({
      error: {
        error: err.message,
        message: "Internal server error",
      },
    });
  }
});

app
  .listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  })
  .on("error", (error) => {
    console.log(error);
  });
