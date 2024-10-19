import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { NextFunction, Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

import { ErrorResponse } from "@/errors";
import { ValidationError } from "class-validator";

const getTargetType = (message: string) => {
  const regex = /Invalid (\w+), check 'errors' property for more info/;
  const match = message.match(regex);

  if (match && match[1]) return match[1];
};

@Middleware({ type: "after" })
export class ValidationErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, next: NextFunction): void {
    if (!(error?.errors?.[0] instanceof ValidationError)) return next(error);

    const validationErrors = error.errors;
    const targetType = getTargetType(error.message);

    const errorResponse: ErrorResponse & { details: [ValidationError] } = {
      code: StatusCodes.BAD_REQUEST,
      status: getReasonPhrase(StatusCodes.BAD_REQUEST),
      message: `Bad request ${targetType}`,
      details: [validationErrors],
    };

    res.status(errorResponse.code).json({ error: errorResponse });
  }
}
