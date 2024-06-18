// importing npm modules
import { Document, Model, model, Schema } from "mongoose";

// --- interfaces ----------

export interface User {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: Date;
}

export interface UserDocument extends User, Document {}

interface UserModel extends Model<UserDocument> {}

// -------------------------

const userSchema: Schema<UserDocument, UserModel> = new Schema(
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
);

export const UserModel = model<UserDocument, UserModel>("User", userSchema);
