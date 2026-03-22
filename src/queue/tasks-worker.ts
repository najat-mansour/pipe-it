import { Worker } from "bullmq";
import { connection } from "./tasks-queue.js";
import { updateTaskStatusDB } from "../db/queries/tasks.js";
import { Task } from "../types/tasks.js";
import { getTodayMatches } from "../actions/today-matches.js";
import { getWeather } from "../actions/weather-query.js";
import { translate } from "../actions/translation.js";
import { summarizeText } from "../actions/summarization.js";

const tasksWorker = new Worker("tasks-queue", async(task) => {
    //! 0- Extract the task to be processed
    const toBeProcessedTask = task.data as Task;

    //! 1- Mark the task as "IN_PROCESS"
    await updateTaskStatusDB(toBeProcessedTask.id, "IN_PROCESS");

    //! 2- Processing the task
    const action = toBeProcessedTask.webhook.action;
    const payload = toBeProcessedTask.payload;
    let result = undefined;
    if (action === "TODAY-MATCHES") {
      result = await getTodayMatches();

    } else if (action === "WEATHER-QUERY") {
      result = await getWeather(payload.city!);

    } else if (action === "TRANSLATION") {
      result = await translate(payload.text!, payload.destLanguage!);

    } else if (action === "SUMMARIZATION") {
      result = await summarizeText(payload.text!);

    }

    //! 3- Mark the task as "FINISHED"
    await updateTaskStatusDB(toBeProcessedTask.id, "FINISHED");

    //! 4- Try to send to the subscribers and update the status and attemptsNumber in the deliveries table
    console.log(result);
  },
  {
    connection
  }
);