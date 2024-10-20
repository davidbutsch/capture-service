import { AppError } from "@/errors";
import { ffmpeg, s3Client } from "@/libs";
import { IS3Repository } from "@/modules/S3";
import { IVideoService } from "@/modules/video";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "tsyringe";

import { config } from "@/common";
import { IMusiqRepository } from "@/modules/musiq";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PassThrough } from "stream";

function getRandomIndexes(arr: any[], count: number): number[] {
  const randomIndexes = new Set<number>();

  while (randomIndexes.size < count) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    randomIndexes.add(randomIndex);
  }

  return Array.from(randomIndexes);
}

async function getSignedUrlForS3Object(
  bucketName: string,
  objectKey: string
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  // Generate a signed URL valid for 60 minutes
  const signedUrl = await getSignedUrl(
    s3Client as unknown as any,
    command as unknown as any,
    {
      expiresIn: 3600,
    }
  );
  return signedUrl;
}

@injectable()
export class VideoService implements IVideoService {
  constructor(
    @inject("S3Repository") private s3Repository: IS3Repository,
    @inject("MusiqRepository") private musiqRepository: IMusiqRepository
  ) {}

  async getFrames(key: string): Promise<string[]> {
    const videoBuffer = await this.s3Repository.getBuffer(key);
    const buffers = await this.toImageSequence(videoBuffer);

    const promises = getRandomIndexes(buffers, 8).map(async (i) => {
      const key = await this.s3Repository.uploadBuffer(buffers[i], "image/png");
      const url = getSignedUrlForS3Object(config.aws.s3.bucket, key);
      return url;
    });

    const urls = await Promise.all(promises);

    return urls;
  }

  async uploadVideo(file?: Express.Multer.File): Promise<string> {
    if (!file)
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Field name 'video' not provided"
      );

    const key = await this.s3Repository.uploadBuffer(
      file.buffer,
      file.mimetype
    );
    return key;
  }

  async toImageSequence(buffer: Buffer, fps?: number): Promise<Buffer[]> {
    try {
      return await new Promise<Buffer[]>((resolve, reject) => {
        const buffers: Buffer[] = [];
        const stream = new PassThrough();

        const videoStream = new PassThrough();
        videoStream.end(buffer);

        ffmpeg(videoStream)
          .inputFormat("mp4")
          .outputFormat("image2pipe")
          .fps(fps ?? 5)
          .on("end", () => resolve(buffers))
          .on("error", (error) => reject(error))
          .pipe(stream, { end: true });

        stream.on("data", (chunk: Buffer) => {
          buffers.push(chunk);
        });
      });
    } catch (error) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error instanceof Error
          ? error.message
          : "Unknown image conversion error occurred"
      );
    }
  }
}
