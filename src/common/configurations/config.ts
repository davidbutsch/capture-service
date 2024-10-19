import { env } from "@/common";

export const config = {
  port: env.PORT!,
  corsWhitelist: env.CORS_WHITELIST!.split(","),
  databases: {},
};
