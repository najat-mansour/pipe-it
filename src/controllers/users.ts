import { NextFunction, Request, Response } from "express";
import { createUser } from "../services/users.js";

export async function createUserHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const newUser = req.body;
    const user = await createUser(newUser);
    res.status(201).json(user);
  } catch (err: unknown) {
    next(err);
  }
}
