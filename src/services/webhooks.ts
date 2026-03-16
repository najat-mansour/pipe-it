import { createWebhookDB, getWebhookByIdDB, getWebhookBySource } from "../db/queries/webhooks.js";
import { NewWebhook, Webhook } from "../db/types.js";
import { BadRequestError } from "../errors/http-errors.js";

export async function createWebhook(userId: string, webhook: NewWebhook): Promise<Webhook> {
    const existingWebhook = await getWebhookBySource(webhook.source);
    if (existingWebhook) {
        throw new BadRequestError("Webhook with the same source is already existed!");
    }
    const result = await createWebhookDB(userId, webhook);
    return result;
}

export async function getWebhookById(webhookId: string): Promise<Webhook> {
    const result = await getWebhookByIdDB(webhookId);
    if (!result) {
        throw new BadRequestError("Webhook not found!");
    }
    return result;
}