import { Worker } from "bullmq";
import { connection } from "./tasks-queue.js";

const tasksWorker = new Worker("tasks-queue", async(task) => {
    console.log("Adding a new task to the queue:");
    console.log(task.data);
  },
  {
    connection
  }
);