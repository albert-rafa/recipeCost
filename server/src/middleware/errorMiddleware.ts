import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";

const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error.message || "Internal Server Error";

  response.status(statusCode).send({ message });
};

export { errorHandler };
