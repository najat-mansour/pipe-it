import { createTaskDB, getAllTasksDB, getTaskByIdDB } from "../db/queries/tasks.js";
import { getWebhookBySourceDB } from "../db/queries/webhooks.js";
import { BadRequestError, NotFoundError } from "../errors/http-errors.js";
import { tasksQueue } from "../queue/tasks-queue.js";
import { Payload, TaskResponseDTO, toTaskResponseDTO } from "../types/tasks.js";
import { Action } from "../types/webhooks.js";

function validatePayload(action: Action, payload: Payload): void {
    if (action === "SUMMARIZATION") {
        if (payload === null || !("text" in payload)) { 
            throw new BadRequestError("The 'text' property is not found!");
        }
    }  

    if (action === "TRANSLATION") {
        if (payload === null || !("text" in payload!)) {
            throw new BadRequestError("The 'text' property is not found!");
        }
        if (!("destLanguage" in payload)) {
            throw new BadRequestError("The 'destLanguage' is not found!");
        }
    }

    if (action === "WEATHER-QUERY") {
        if (payload === null || !("city" in payload)) {
            throw new BadRequestError("The 'city' property is not found!");
        }
    }
}

export async function createTask(source: string, payload: Payload): Promise<TaskResponseDTO> {
    const webhook = await getWebhookBySourceDB(source);
    if (!webhook) {
        throw new BadRequestError("Source not found!");
    }
    validatePayload(webhook.action, payload);
    const task = await createTaskDB(webhook.id, payload);
    await tasksQueue.add("task", task);
    return toTaskResponseDTO(task);
}

export async function getTaskById(id: string): Promise<TaskResponseDTO> {
    const task = await getTaskByIdDB(id);
    if (!task) {
        throw new NotFoundError("Task not found!");
    }
    return toTaskResponseDTO(task);
}

export async function getAllTasks(): Promise<TaskResponseDTO[]> {
    const tasks = await getAllTasksDB();
    if (tasks.length === 0) {
        throw new NotFoundError("No tasks found!");
    }
    return tasks.map((task) => toTaskResponseDTO(task));
}