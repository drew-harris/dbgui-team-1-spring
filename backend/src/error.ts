export class APIError extends Error {
  message;
  status;
  originalError;

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
