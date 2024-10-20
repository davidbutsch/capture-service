import { IVideoService } from "@/modules/video";
import { Length } from "class-validator";
import {
  Get,
  JsonController,
  Params,
  Post,
  UploadedFile,
} from "routing-controllers";
import { inject, injectable } from "tsyringe";

class GetFramesParams {
  @Length(128, 128, { message: "videoId must be equal to 64 characters" })
  key: string;
}

@injectable()
@JsonController("/videos")
export class VideoController {
  constructor(@inject("VideoService") private videoService: IVideoService) {}

  @Get("/frames/:key")
  async getFrames(@Params({ validate: false }) { key }: GetFramesParams) {
    const frames = await this.videoService.getFrames(key);

    return frames;
  }

  @Post("/")
  async uploadVideo(@UploadedFile("video") file: Express.Multer.File) {
    let key = await this.videoService.uploadVideo(file);

    return {
      data: {
        upload: { key },
      },
    };
  }
}
