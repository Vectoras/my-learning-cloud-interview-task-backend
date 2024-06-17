// importing types
import type { RequestHandler } from "express";

export const getUser: RequestHandler = (req, res) => {
  res.send("This will get details about one user from db");
}

export const addUser: RequestHandler = (req, res) => {
  res.send("This will add a new user to the db");
}
