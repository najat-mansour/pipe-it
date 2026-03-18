import { createWebhookDB, deleteWebhookByIdDB, getAllWebhooksByUserIdDB, getAllWebhooksDB, getWebhookByIdDB, getWebhookBySourceDB } from "../db/queries/webhooks.js";
import { WebhookRequestDTO, toWebhookResponseDTO, WebhookResponseDTO } from "../types/webhooks.js";
import { BadRequestError, ForbiddenError } from "../errors/http-errors.js";

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

export async function getAllWebhooksByUserId(userId: string): Promise<WebhookResponseDTO[]> {
    const webhooks = await getAllWebhooksByUserIdDB(userId);
    if (webhooks.length === 0) {
        throw new BadRequestError("No webhooks found for this user!");
    }
    return webhooks.map((webhook) => toWebhookResponseDTO(webhook));
}   

export async function deleteWebhookById(webhookId: string, userId: string): Promise<void> {
    const existedWebhookById = await getWebhookByIdDB(webhookId);
    if (!existedWebhookById) {
        throw new BadRequestError("Webhook not found!");
    }
    if (existedWebhookById.userId !== userId) {
        throw new ForbiddenError("You are not authorized to delete this webhook!");
    }
    await deleteWebhookByIdDB(webhookId);
}   