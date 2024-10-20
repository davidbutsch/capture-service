import { config } from "@/common";
import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  credentials: config.aws.clientCredentials,
  region: config.aws.s3.region,
});
