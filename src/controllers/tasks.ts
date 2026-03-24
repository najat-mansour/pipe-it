import { Request, Response, NextFunction } from "express";
import { getTaskById, getAllTasks, createTask } from "../services/tasks.js";

export async function createTaskHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const source = req.params.source as string;
    const payload = req.body;
    const task = await createTask(source, payload);
    res.status(201).json(task);
  } catch (err: unknown) {
    next(err);
  }
}

export async function getTaskByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const task = await getTaskById(id);
    res.status(200).json(task);
  } catch (err: unknown) {
    next(err);
  }
}

export async function getAllTasksHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (err: unknown) {
    next(err);
  }
}
