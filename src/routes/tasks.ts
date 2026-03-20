import express from "express";
import { createTaskHandler, getAllTasksHandler, getTaskByIdHandler } from "../controllers/tasks.js";

const router = express.Router();

router.post("/:source", createTaskHandler);
router.get("/:id", getTaskByIdHandler);
router.get("/", getAllTasksHandler);

export default router;