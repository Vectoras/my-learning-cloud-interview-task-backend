// importing npm modules
import express from "express";
// importing from the controller
import { getUser, addUser } from "./user.controller.js";

// creating the router
export const userRouter = express.Router();

// test route
userRouter
  .route("/test")
  .get((req, res) => {
    res.send("The userRouter is up an running");
  })
  .post((req, res) => {
    res.json({ status: "The userRouter is up and running" });
  });

// routers

userRouter
  //
  .route("/user")
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .get(getUser)
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .post(addUser);
