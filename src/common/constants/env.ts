import { defaultEnvOptions } from "./defaults";
import dotenv from "dotenv";

dotenv.config();

export class ENV {
  public NODE_ENV: string | undefined;
  public SERVICE_TAG: string | undefined;
  public LOG_PATH: string | undefined;
  public PORT: string | undefined;
  public CORS_WHITELIST: string | undefined;

  private readonly keys: (keyof ENV)[];

  constructor() {
    this.keys = [
      "NODE_ENV",
      "SERVICE_TAG",
      "LOG_PATH",
      "PORT",
      "CORS_WHITELIST",
    ];

    this.loadENV();
  }

  private loadENV = () => {
    this.keys.forEach((key) => {
      this[key] = process.env[key] || defaultEnvOptions[key];

      if (this[key] === undefined) {
        throw new Error(
          `Missing environment variable "${key}" has no default, cannot start service`
        );
      }
    });
  };
}

export const env: ENV = new ENV();
