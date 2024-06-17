// importing npm modules
import express from "express";
import cors from "cors";
import helmet from "helmet";
// importing custom middleware
import { addRequestFeedbackMiddleware } from "./middleware/response_format/add_request_feedback.js";
// importing routers
import { userRouter } from "./user/user.router.js";

// creating the app
export const app = express();

// middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:8080",
      "https://localhost",
      "https://localhost:443",
      "http://127.0.0.1",
      "http://127.0.0.1:8080",
      "https://127.0.0.1",
      "https://127.0.0.1:443",
    ],
    methods: ["OPTIONS", "GET", "PUT", "POST"],
  }),
);
app.use(express.json());
app.use(addRequestFeedbackMiddleware);

// routers

app.use("/users", userRouter);

// test route
app
  .route("/test")
  .get((req, res) => {
    res.send("The server is up an running");
  })
  .post((req, res) => {
    res.json({ status: "The server is up and running" });
  });

// 404 route
app
  .route("*")
  .get((req, res) => {
    res.status(404).send("Not found");
  })
  .post((req, res) => {
    res.status(404).json({ status: "Not found" });
  });
