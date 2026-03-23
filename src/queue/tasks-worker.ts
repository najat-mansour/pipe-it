import { Worker } from "bullmq";
import { connection } from "./tasks-queue.js";
import { updateTaskStatusDB } from "../db/queries/tasks.js";
import { increaseAttemptsNumberDB, updateDeliveryStatusDB } from "../db/queries/deliveries.js";
import { Task } from "../types/tasks.js";
import { ActionResult, executeAction } from "../actions/action-executor.js";
import { Subscriber } from "../types/subscribers.js";
import { Delivery } from "../types/deliveries.js";

async function sendToSubscriber(subscriber: Subscriber, deliveries: Delivery[],result: ActionResult): Promise<void> {
  const delivery = deliveries.find(d => d.subscriberId === subscriber.id)!;

  const MAX_ATTEMPTS = 3;
  const DELAY = 500; 

  let attempt = 0;

  while (attempt < MAX_ATTEMPTS) {
    try {
      const response = await fetch(subscriber.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      });

      await increaseAttemptsNumberDB(delivery.id);

      if (response.ok) {
        await updateDeliveryStatusDB(delivery.id, "SUCCESS");
        return; 
      }
      //! Else, throw an error
      throw new Error();

    } catch {
      attempt++;

      if (attempt >= MAX_ATTEMPTS) {
        await updateDeliveryStatusDB(delivery.id, "FAILED");
        return;
      }

      //! Exponential Delay
      const delay = DELAY * Math.pow(2, attempt);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

new Worker("tasks-queue", async (task) => {
    //! 0- Extract the task to be processed
    const toBeProcessedTask = task.data as Task;

    //! 1- Mark the task as "IN_PROCESS"
    await updateTaskStatusDB(toBeProcessedTask.id, "IN_PROCESS");

    //! 2- Processing the task
    const action = toBeProcessedTask.webhook.action;
    const payload = toBeProcessedTask.payload;
    const result = await executeAction(action, payload) as ActionResult;

    //! 3- Mark the task as "FINISHED"
    await updateTaskStatusDB(toBeProcessedTask.id, "FINISHED");

    //! 4- Try to send to the subscribers and update the status and attemptsNumber in the deliveries table
    const subscribers = toBeProcessedTask.webhook.subscribers;
    const deliveries = toBeProcessedTask.deliveries;
    await Promise.all(
      subscribers.map((subscriber) =>
        sendToSubscriber(subscriber, deliveries, result)
      )
    );
  },
  {
    connection
  }
);