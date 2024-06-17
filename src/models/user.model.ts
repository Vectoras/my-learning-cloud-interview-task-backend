// importing npm modules
import { model, Schema } from "mongoose";

// ----------------

export const UserModel = model(
  "User",
  new Schema(
    {
      username: {
        type: String,
        trim: true,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        trim: true,
        required: true,
      },
      firstname: {
        type: String,
        trim: true,
        required: true,
      },
      lastname: {
        type: String,
        trim: true,
        required: true,
      },
      email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
    },
    { timestamps: true },
  ),
);
