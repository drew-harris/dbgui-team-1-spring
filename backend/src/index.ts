import * as cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { APIError } from "./error";

// Load enviornment variables from .env file
dotenv.config();

const app = express();
app.use(cors.default());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/uppercase", (req, res) => {
  if (!req.body.sentence) {
    throw new APIError("Missing sentence", 400);
  }

  res.json({
    message: req.body.sentence.toUpperCase(),
  });
});

app.use((err, _req, res, _next) => {
  if (err instanceof APIError) {
    console.log(err.originalError);
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
