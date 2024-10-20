import { AppError } from "@/errors";
import { ffmpeg } from "@/libs";
import { IS3Repository } from "@/modules/S3";
import { IVideoService } from "@/modules/video";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "tsyringe";

import { IMusiqRepository } from "@/modules/musiq";
import { PassThrough } from "stream";

@injectable()
export class VideoService implements IVideoService {
  constructor(
    @inject("S3Repository") private s3Repository: IS3Repository,
    @inject("MusiqRepository") private musiqRepository: IMusiqRepository
  ) {}

  async getFrames(key: string): Promise<string[]> {
    const videoBuffer = await this.s3Repository.getBuffer(key);
    const buffers = await this.toImageSequence(videoBuffer);

    const myarray: string[] = [];

    buffers.forEach(async (buffer) => {
      const prediction = await this.musiqRepository.predict(buffer);
      myarray.push(prediction.toString());
    });

    console.log(myarray);

    return myarray;
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
