import { env } from "@/common";

export const config = {
  port: env.PORT!,
  corsWhitelist: env.CORS_WHITELIST!.split(","),
  databases: {},
  aws: {
    clientCredentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
    },
    s3: {
      region: env.S3_REGION!,
      bucket: env.S3_BUCKET!,
    },
  },
};
