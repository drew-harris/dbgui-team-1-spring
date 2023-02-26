import express from "express";
import dotenv from "dotenv";
import * as cors from "cors";
import { APIError } from "./error";

// Load enviornment variables from .env file
dotenv.config();

const app = express();
app.use(cors.default());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((err, _req, res, _next) => {
  console.error("Caught");
  if (err instanceof APIError) {
    res.status(err.status).json({
      error: {
        error: err.originalError,
        message: err.message,
      },
    });
  } else {
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
