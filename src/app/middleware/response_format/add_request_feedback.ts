// importing types
import type { Request, Response, NextFunction, Send } from "express";
import type { Body } from "../../../types/express.types.js";

// --------------------------

export const addRequestFeedbackMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // implemented as per 'cpri' response https://stackoverflow.com/questions/33732509/express-js-how-to-intercept-response-send-response-json

  try {
    // cache the original function
    const originalJsonFunction = res.json;

    // extract data
    const { originalUrl: fullPath, params, query } = req;
    const body = req.body as Body;

    // add the request details to the response
    res.json = function (data) {
      // set function back to avoid the 'double-send'
      res.json = originalJsonFunction;
      // just call as normal with data
      res.json({
        ...data,
        request: {
          fullPath,
          params,
          query,
          body,
        },
      });
    } as Send;
  } catch (error) {
    const errorString =
      error instanceof Error ? `${error.name}: ${error.message}` : "Unknown";

    return res.status(500).send({
      success: false,
      messages: [
        {
          type: "error",
          content: "There has been an error while adding request feedback",
        },
      ],
      data: {
        error: errorString, // TO DO - we may want to remove this for security purposes
      },
    });
  }

  next();
};
