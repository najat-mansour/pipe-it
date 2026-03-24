import express from "express";
import {
  createTaskHandler,
  getAllTasksHandler,
  getTaskByIdHandler,
} from "../controllers/tasks.js";
import { tasksLimiter } from "../middlewares/rate-limiter.js";

const router = express.Router();

router.use(tasksLimiter);
router.post("/:source", createTaskHandler);
router.get("/:id", getTaskByIdHandler);
router.get("/", getAllTasksHandler);

export default router;
