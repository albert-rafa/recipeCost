class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, status = 400) {
    super(message);
    this.statusCode = status;
  }
}

export { AppError };
