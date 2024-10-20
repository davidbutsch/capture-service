import dotenv from "dotenv";
import { defaultEnvOptions } from "./defaults";

dotenv.config();

export class ENV {
  public NODE_ENV: string | undefined;
  public LOG_PATH: string | undefined;
  public PORT: string | undefined;
  public CORS_WHITELIST: string | undefined;
  public AWS_ACCESS_KEY_ID: string | undefined;
  public AWS_SECRET_ACCESS_KEY: string | undefined;
  public S3_REGION: string | undefined;
  public S3_BUCKET: string | undefined;

  private readonly keys: (keyof ENV)[];

  constructor() {
    this.keys = [
      "NODE_ENV",
      "LOG_PATH",
      "PORT",
      "CORS_WHITELIST",
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "S3_REGION",
      "S3_BUCKET",
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
