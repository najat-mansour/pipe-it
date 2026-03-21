import { Worker } from "bullmq";
import { connection } from "./tasks-queue.js";
import { updateTaskStatusDB } from "../db/queries/tasks.js";
import { Task } from "../types/tasks.js";

const tasksWorker = new Worker("tasks-queue", async(task) => {
    console.log("Adding a new task to the queue:");
    const toBeProcessedTask = task.data as Task;
    //! 1- Mark the task as "IN_PROCESS"
    await updateTaskStatusDB(toBeProcessedTask.id, "IN_PROCESS");

    //! 2- Processing the task


    //! 3- Mark the task as "FINISHED"
    await updateTaskStatusDB(toBeProcessedTask.id, "FINISHED");

    //! 4- Try to send to the subscribers and update the status and attemptsNumber in the deliveries table
    
  },
  {
    connection
  }
);