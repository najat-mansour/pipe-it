import { createWebhookDB, getAllWebhooksDB, getWebhookByIdDB, getWebhookBySourceDB } from "../db/queries/webhooks.js";
import { WebhookRequestDTO, toWebhookResponseDTO, WebhookResponseDTO } from "../types/webhooks.js";
import { BadRequestError } from "../errors/http-errors.js";

export async function createWebhook(userId: string, webhook: WebhookRequestDTO): Promise<WebhookResponseDTO> {
    const existedWebhookBySource = await getWebhookBySourceDB(webhook.source);
    if (existedWebhookBySource) {
        throw new BadRequestError("Webhook with the same source is already existed!");
    }
    const createdWebhook = await createWebhookDB(userId, webhook);
    return toWebhookResponseDTO(createdWebhook);
}

export async function getWebhookById(webhookId: string): Promise<WebhookResponseDTO> {
    const webhook = await getWebhookByIdDB(webhookId);
    if (!webhook) {
        throw new BadRequestError("Webhook not found!");
    }
    return toWebhookResponseDTO(webhook);
}

export async function getAllWebhooks(): Promise<WebhookResponseDTO[]> {
    const webhooks = await getAllWebhooksDB();
    if (webhooks.length === 0) {
        throw new BadRequestError("No webhooks found!");
    }
    return webhooks.map((webhook) => toWebhookResponseDTO(webhook));
}