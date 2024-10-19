import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { NextFunction, Request, Response } from "express";

import { Logger } from "@/libs";

@Middleware({ type: "before" })
export class RequestLogger implements ExpressMiddlewareInterface {
  use(req: Request, _res: Response, next: NextFunction): void {
    Logger.info({
      message: `${req.method} ${req.url}`,
      url: req.url,
      headers: req.headers,
    });
    next();
  }
}
