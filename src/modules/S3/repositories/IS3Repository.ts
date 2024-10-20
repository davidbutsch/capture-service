export interface IS3Repository {
  getBuffer(key: string): Promise<Buffer>;
  uploadBuffer(buffer: Buffer, mimetype?: string): Promise<string>;
}
