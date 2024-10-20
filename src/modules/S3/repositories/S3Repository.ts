import { config } from "@/common";
import { AppError } from "@/errors";
import { s3Client } from "@/libs";
import { IS3Repository, generateKey } from "@/modules/S3";
import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { StatusCodes } from "http-status-codes";

export class S3Repository implements IS3Repository {
  async getBuffer(key: string): Promise<Buffer> {
    const getObjectCommandInput: GetObjectCommandInput = {
      Bucket: config.aws.s3.bucket,
      Key: key,
    };

    try {
      const command = new GetObjectCommand(getObjectCommandInput);
      const response = await s3Client.send(command);

      if (!response.Body)
        throw new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Missing response body"
        );

      const byteArray = await response.Body.transformToByteArray();

      return Buffer.from(byteArray);
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown fetch error occurred"
      );
    }
  }
  async uploadBuffer(buffer: Buffer, mimetype?: string): Promise<string> {
    const key = generateKey(
      mimetype ? mimetype?.split("/")[0] + "-" : undefined
    );

    const putObjectCommandInput: PutObjectCommandInput = {
      Bucket: config.aws.s3.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      const command = new PutObjectCommand(putObjectCommandInput);
      await s3Client.send(command);
      return key;
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown upload error occurred"
      );
    }
  }
}
