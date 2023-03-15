export class APIError extends Error {
  message: string;
  status: number;
  originalError: Error | null;

  constructor(
    message = "Internal Server Error",
    status = 500,
    originalError = null
  ) {
    super(message);
    this.message = message;
    this.status = status;
    this.originalError = originalError;
  }
}
