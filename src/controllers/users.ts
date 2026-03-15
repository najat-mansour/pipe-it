import { NextFunction, Request, Response } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, login, updateUser } from "../services/users.js";
import { getBearerToken, validateJWT } from "../utils/jwt.js";
import { apiConfig } from "../config.js";

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = req.body;
    const createdUser = await createUser(newUser);
    res.status(201).json(createdUser);

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

export async function getUserByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const user = await getUserById(id);
    res.status(200).json(user);

  } catch(err: unknown) {
    next(err);

  }
}

export async function getAllUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);

  } catch(err: unknown) {
    next(err);

  }
}

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, apiConfig.jwtConfig.secretKey);
    await deleteUser(userId);
    res.status(204).send();

  } catch(err: unknown) {
    next(err); 

  } 
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req);
    const userId = validateJWT(token, apiConfig.jwtConfig.secretKey);
    const userInfo = req.body;
    const updatedUser = await updateUser(userId, userInfo);
    res.status(200).json(updatedUser);

  } catch(err: unknown) {
    next(err);

  }
}