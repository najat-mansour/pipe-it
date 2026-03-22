import { Delivery, DeliveryResponseDTO, toDeliveryResponseDTO } from "./deliveries.js";
import { toWebhookResponseDTO, Webhook, WebhookResponseDTO } from "./webhooks.js";

export type TaskStatus = "CREATED" | "IN_PROCESS" | "FINISHED";

export type SummarizationPayload = { text: string };
export type TranslationPayload = { text: string; destLanguage: string };
export type WeatherQueryPayload = { city: string };
export type Payload = SummarizationPayload | TranslationPayload | WeatherQueryPayload;

export type Task = {
    id: string;
    webhookId: string;
    payload: Payload | null; 
    status: TaskStatus;
    createdAt: Date;
    processedAt: Date | null;
    deliveries: Delivery[];
    webhook: Webhook;
};

export type TaskResponseDTO = {
    id: string;
    payload: Payload | null;
    status: TaskStatus;
    createdAt: Date;
    processedAt: Date | null;
    deliveries: DeliveryResponseDTO[];
    webhook: WebhookResponseDTO;
};

export function toTaskResponseDTO(task: Task): TaskResponseDTO {
    return {
        id: task.id,
        payload: task.payload,
        status: task.status,
        createdAt: task.createdAt,
        processedAt: task.processedAt,
        deliveries: task.deliveries.map((delivery) => toDeliveryResponseDTO(delivery)),
        webhook: toWebhookResponseDTO(task.webhook)
    }
}