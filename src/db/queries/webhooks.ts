import { db } from "../index.js";
import { NewWebhook, Webhook } from "../types.js";
import { subscribers, webhooks } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createWebhookDB(userId: string, webhook: NewWebhook): Promise<Webhook> {
    const [result] = await db.insert(webhooks).values({ 
        source: webhook.source,
        action: webhook.action,
        userId
    }).returning();

    for(let i = 0; i < webhook.subscribers.length; i++) {
        await db.insert(subscribers).values({
            webhookId: result.id,
            url: webhook.subscribers[i]
        });
    }
    return {
        id: result.id,
        source: result.source,
        action: result.action,
        subscribers: webhook.subscribers,
        userId: result.userId,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    };
}

export async function getWebhookBySource(srouce: string): Promise<Webhook> {
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.source, srouce));
    const urls = await db.select({ url: subscribers.url }).from(subscribers).where(eq(subscribers.webhookId, webhook.id));
    return {
        ...webhook,
        subscribers: urls.map(u => u.url)
    }   
}

export async function getWebhookByIdDB(webhookId: string): Promise<Webhook> {
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, webhookId));
    const urls = await db.select({ url: subscribers.url }).from(subscribers).where(eq(subscribers.webhookId, webhookId));
    return {
        ...webhook,
        subscribers: urls.map(u => u.url)
    }   
}