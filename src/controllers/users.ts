import { NextFunction, Request, Response } from "express";
import { createUser, login } from "../services/users.js";

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = req.body;
    const user = await createUser(newUser);
    res.status(201).json(user);

  } catch (err: unknown) {
    next(err);

  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    const loggedInUser = await login(username, password);
    res.status(200).json(loggedInUser);

  } catch(err: unknown) {
    next(err);

  }
}