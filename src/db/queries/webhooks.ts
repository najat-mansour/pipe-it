import { db } from "../index.js";
import { WebhookRequestDTO, Webhook } from "../../types/webhooks.js";
import { subscribers, webhooks } from "../schema.js";

export async function createWebhookDB(userId: string, webhook: WebhookRequestDTO): Promise<Webhook> {
    const [createdWebhook] = await db.insert(webhooks).values({
        source: webhook.source,
        action: webhook.action,
        userId
    }).returning();
    
    await db.insert(subscribers).values(
        webhook.subscribers.map((url) => ({
            webhookId: createdWebhook.id,
            url
        }))
    );

    return await getWebhookByIdDB(createdWebhook.id) as Webhook;
}

export async function getWebhookByIdDB(webhookId: string): Promise<Webhook | undefined> {
    const webhook = await db.query.webhooks.findFirst({
        where: (webhooks, { eq }) => eq(webhooks.id, webhookId),
        with: {
            subscribers: true,
            user: true
        }
    });
    return webhook;
}

export async function getWebhookBySourceDB(source: string): Promise<Webhook | undefined> {
    const webhook = await db.query.webhooks.findFirst({
        where: (webhooks, { eq }) => eq(webhooks.source, source),
        with: {
            subscribers: true,
            user: true
        },
    });
    return webhook;
}

export async function getAllWebhooksDB(): Promise<Webhook[]> {
    const webhooks = await db.query.webhooks.findMany({
        with: {
            subscribers: true,
            user: true
        }
    });
    return webhooks;
}