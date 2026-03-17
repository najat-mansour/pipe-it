import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-errors.js";

export async function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof HttpError) {
    const statusCode: number = err.statusCode;
    const errorMessage: string = err.message;
    res.status(statusCode).json({ error: errorMessage });
  }
  res.status(500).json({ err: err.message });
  next();
}
