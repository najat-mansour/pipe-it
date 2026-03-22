import { Worker } from "bullmq";
import { connection } from "./tasks-queue.js";
import { updateTaskStatusDB } from "../db/queries/tasks.js";
import { SummarizationPayload, Task, TranslationPayload, WeatherQueryPayload } from "../types/tasks.js";
import { getTodayMatches } from "../actions/today-matches.js";
import { getWeather } from "../actions/weather-query.js";
import { translate } from "../actions/translation.js";
import { summarizeText } from "../actions/summarization.js";
import { increaseAttemptsNumberDB, updateDeliveryStatusDB } from "../db/queries/deliveries.js";

const tasksWorker = new Worker("tasks-queue", async (task) => {
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
      const weatherQueryPayload = payload as WeatherQueryPayload;
      result = await getWeather(weatherQueryPayload.city);

    } else if (action === "TRANSLATION") {
      const translationPayload = payload as TranslationPayload;
      result = await translate(translationPayload.text, translationPayload.destLanguage);

    } else if (action === "SUMMARIZATION") {
      const summarizationPayload = payload as SummarizationPayload;
      result = await summarizeText(summarizationPayload.text);

    }

    //! 3- Mark the task as "FINISHED"
    await updateTaskStatusDB(toBeProcessedTask.id, "FINISHED");

    //! 4- Try to send to the subscribers and update the status and attemptsNumber in the deliveries table
    const subscribers = toBeProcessedTask.webhook.subscribers;
    const deliveries = toBeProcessedTask.deliveries;
    await Promise.all(
      subscribers.map(async (subscriber) => {
        const response = await fetch(subscriber.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });

        const delivery = deliveries.find(d => d.subscriberId === subscriber.id);
        await increaseAttemptsNumberDB(delivery!.id);

        if (response.ok) {
          await updateDeliveryStatusDB(delivery!.id, "SUCCESS");

        } else {
          await updateDeliveryStatusDB(delivery!.id, "FAILED");

        }
      })
    );
  },
  {
    connection
  }
);