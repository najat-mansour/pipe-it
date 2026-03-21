import { db } from "../index.js";
import { WebhookRequestDTO, Webhook } from "../../types/webhooks.js";
import { subscribers, webhooks } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createWebhookDB(userId: string, webhook: WebhookRequestDTO): Promise<Webhook> {
    const [createdWebhook] = await db.insert(webhooks).values({
        source: webhook.source,
        action: webhook.action,
        userId
    }).returning();
    
    //! Insert the corresponding subscribers
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

export async function getAllWebhooksByUserIdDB(userId: string): Promise<Webhook[]> {
    const webhooks = await db.query.webhooks.findMany({
        where: (webhooks, { eq }) => eq(webhooks.userId, userId),
        with: {
            subscribers: true,
            user: true
        }
    });
    return webhooks;
}

export async function deleteWebhookByIdDB(webhookId: string): Promise<void> {
    await db.delete(webhooks).where(eq(webhooks.id, webhookId));
}

export async function updateWebhookDB(webhookId: string, webhook: Partial<WebhookRequestDTO>): Promise<Webhook> {
    if (webhook.source) {
        await db.update(webhooks).set({
            source: webhook.source
        }).where(eq(webhooks.id, webhookId));
    }

    if (webhook.action) {
        await db.update(webhooks).set({
            action: webhook.action
        }).where(eq(webhooks.id, webhookId));
    }   

    if (webhook.subscribers) {
        await db.delete(subscribers).where(eq(subscribers.webhookId, webhookId));

        await db.insert(subscribers).values(
            webhook.subscribers.map((url) => ({
                webhookId,
                url
            }))
        );
    }
    
    return await getWebhookByIdDB(webhookId) as Webhook;
}       
