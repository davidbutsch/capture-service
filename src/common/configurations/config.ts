import { env } from "@/common";

export const config = {
  serviceTag: env.SERVICE_TAG!,
  port: env.PORT!,
  corsWhitelist: env.CORS_WHITELIST!.split(","),
  databases: {},
};
