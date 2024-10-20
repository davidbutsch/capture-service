export interface IMusiqRepository {
  predict(buffer: Buffer): Promise<number>;
}
