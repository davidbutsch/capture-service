import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { NextFunction, Request, Response } from "express";

import { Logger } from "@/libs";

@Middleware({ type: "after" })
export class ErrorLogger implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, _res: Response, next: NextFunction): void {
    Logger.error(error);
    next(error);
  }
}
