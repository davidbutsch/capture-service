import { getReasonPhrase } from "http-status-codes";

export class AppError extends Error {
  public code: number;
  public status: string;
  public errors: any[];

  constructor(code: number, message: string, errors: any[] = []) {
    super(message);
    this.code = code;
    this.status = getReasonPhrase(code);
    this.errors = errors;
  }
}
