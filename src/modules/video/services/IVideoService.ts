export interface IVideoService {
  getFrames(key: string): Promise<string[]>;
  uploadVideo(file: Express.Multer.File): Promise<string>;
  toImageSequence(buffer: Buffer, fps?: number): Promise<Array<Buffer>>;
}
