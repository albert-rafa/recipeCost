import { Request, Response, NextFunction } from "express";
import { ZodError, Schema } from "zod";

function params(schema: Schema) {
  return (request: Request, response: Response, next: NextFunction): any => {
    try {
      schema.parse(request.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).send({ error: "Invalid data" });
      } else {
        return response.status(500).send({ error: "Internal Server Error" });
      }
    }
  };
}

function body(schema: Schema) {
  return (request: Request, response: Response, next: NextFunction): any => {
    try {
      schema.parse(request.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return response.status(400).send({ error: "Invalid data" });
      } else {
        return response.status(500).send({ error: "Internal Server Error" });
      }
    }
  };
}

export { params, body };
