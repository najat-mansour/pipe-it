import { toWebhookResponseDTO, Webhook, WebhookResponseDTO } from "./webhooks.js";

export type TaskStatus = "CREATED" | "IN_PROCESS" | "FINISHED"

export type Task = {
    id: string;
    webhookId: string;
    payload: unknown;
    status: TaskStatus;
    createdAt: Date;
    processedAt: Date | null;
    webhook: Webhook;
}

export type TaskResponseDTO = {
    id: string;
    payload: unknown;
    status: TaskStatus;
    createdAt: Date;
    processedAt: Date | null;
    webhook: WebhookResponseDTO;
};

export function toTaskResponseDTO(task: Task): TaskResponseDTO {
    return {
        id: task.id,
        payload: task.payload,
        status: task.status,
        createdAt: task.createdAt,
        processedAt: task.processedAt,
        webhook: toWebhookResponseDTO(task.webhook)
    }
}