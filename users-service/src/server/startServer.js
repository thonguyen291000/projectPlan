import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import accessEnv from "../helpers/accessEnv";

import mongoose from "mongoose";
import setupRoutes from "./routes/routes";

const PORT = accessEnv("PORT", 7002);

const app = express();

app.use(bodyParser.json());

// Fix cor error
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);

setupRoutes(app);


// Catch thrown errors
app.use((err, req, res, next ) => {
  return res.status(500).json({
    message: err.message
  })
})

// Connect to mongodb atlas
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@chat-app.vfn8t.mongodb.net/${process.env.MONGO_DB_USER}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.info(`User server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    throw err;
  });
