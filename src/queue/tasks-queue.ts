import { Queue } from "bullmq";
import { apiConfig } from "../config.js";

export const connection = {
  host: apiConfig.redisConfig.host,
  port: apiConfig.redisConfig.port,
};

export const tasksQueue = new Queue("tasks-queue", { connection });
