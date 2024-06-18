// importing npm modules
import bcrypt from "bcrypt";
// importing models
import { User, UserModel } from "../../models/user.model.js";
// importing types
import type { Request, Response } from "express";
import type {
  Body,
  ResponseData,
  ResponseFormat,
  ResponseMessage,
} from "../../types/express.types.js";

// --- functions -------------------------------------------------

const validateUsername = (username?: unknown): boolean => {
  // only alphabetic characters and digits
  return !!username?.toString().match(/^[a-zA-Z0-9]*$/);
};
const validatePassword = (password?: unknown): boolean => {
  // min 8 charcters of which at least on uppercase, one lowercase, one digit, one special
  return !!password
    ?.toString()
    .match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/);
};
const validateName = (name?: unknown): boolean => {
  // only alphabetic characters
  return !!name?.toString().match(/^[a-zA-Z]*$/);
};
const validateEmail = (email?: unknown): boolean => {
  // format username@domain.tld
  return !!email?.toString().match(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/);
};
const validateDateOfBirth = (dateOfBirth?: unknown): boolean => {
  // check if null
  if (!(typeof dateOfBirth === "string")) return false;

  // check if a valid date can be generated
  try {
    if (new Date(dateOfBirth).toString() === "Invalid Date") return false;
  } catch {
    return false;
  }

  // all checks passed
  return true;
};

// --------------------------------------------------------------

export const getUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // --- 1 --- extract received data

    const { username, email } = req.body as Body;

    // --- 2 --- validate

    if (!username && !email)
      return res.status(400).json({
        success: false,
        messages: [
          {
            type: "error",
            content: `No username or email has been provided!`,
          },
        ],
        data: {},
      } as ResponseFormat);

    const invalidData: string[] = [];
    if (!validateUsername(username)) invalidData.push("username");
    if (!validateEmail(email)) invalidData.push("email");

    // --- 3 --- retrieve the user by either username or email

    let userDb: User | null = null;

    if (username && !invalidData.includes("username")) {
      userDb = await UserModel.findOne({ username });
    } else if (email && !invalidData.includes("email")) {
      userDb = await UserModel.findOne({ email });
    }

    const user =
      !userDb ? null : (
        {
          username: userDb.username,
          firstname: userDb.firstname,
          lastname: userDb.lastname,
          email: userDb.email,
          dateOfBirth: userDb.dateOfBirth,
        }
      );

    // --- 4 --- build the response messages and data

    const messages: ResponseMessage[] = [];
    const data: ResponseData = {};

    if (invalidData.length) {
      messages.push({
        type: "error",
        content: `One ore more pieced of the provided data are missing or invalid!`,
      });
      data.invalidData = invalidData;
    }

    if (user) {
      messages.push({
        type: "success",
        content: `Successfully retrieved the user`,
      });
      data.user = user;
    } else {
      messages.push({
        type: "warning",
        content: `No user has been found for the provided data`,
      });
      data.user = user;
    }

    // --- * ---

    return res.status(200).json({
      success: true,
      messages,
      data,
    } as ResponseFormat);

    // ---------
  } catch (error) {
    console.log(error);

    const errorString =
      error instanceof Error ? `${error.name}: ${error.message}` : "Unknown";
    return res.status(500).json({ internalServerError: errorString });
  }
};

export const addUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // --- 1 --- extract received data

    const { username, password, firstname, lastname, email, dateOfBirth } =
      req.body as Body;

    // --- 2 --- validate received data

    const invalidData: string[] = [];
    if (!validateUsername(username)) invalidData.push("username");
    if (!validatePassword(password)) invalidData.push("password");
    if (!validateName(firstname)) invalidData.push("firstname");
    if (!validateName(lastname)) invalidData.push("lastname");
    if (!validateEmail(email)) invalidData.push("email");
    if (!validateDateOfBirth(dateOfBirth)) invalidData.push("dateOfBirth");

    if (invalidData.length) {
      return res.status(400).json({
        success: false,
        messages: [
          {
            type: "error",
            content: `One ore more pieced of the provided data are invalid!`,
          },
        ],
        data: {
          invalidData, // TO DO - we may want to remove this for security purposes
        },
      });
    }

    // --- 3 --- create a new user in the database

    try {
      await new UserModel({
        username,
        password: bcrypt.hashSync(password as string, 10),
        firstname,
        lastname,
        email,
        dateOfBirth,
      }).save();
    } catch (error) {
      const errorString =
        error instanceof Error ? `${error.name}: ${error.message}` : "Unknown";

      return res.status(400).json({
        success: false,
        messages: [
          {
            type: "error",
            content: `Error when adding the user to the database`,
          },
        ],
        data: {
          error: errorString, // TO DO - we may want to remove this for security purposes
        },
      });
    }

    // --- * ---

    return res.status(200).json({
      success: true,
      messages: [
        {
          type: "success",
          content: `Successfully added the user`,
        },
      ],
      data: {},
    } as ResponseFormat);

    // ---------
  } catch (error) {
    console.log(error);

    const errorString =
      error instanceof Error ? `${error.name}: ${error.message}` : "Unknown";
    return res.status(500).json({ internalServerError: errorString });
  }
};
