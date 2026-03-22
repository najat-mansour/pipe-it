import { Payload, Task, TaskStatus } from "../../types/tasks.js";
import { db } from "../index.js";
import { deliveries, tasks } from "../schema.js";
import { eq } from "drizzle-orm";
import { getWebhookByIdDB } from "./webhooks.js";
import { Webhook } from "../../types/webhooks.js";

export async function createTaskDB(webhookId: string, payload: Payload): Promise<Task> {
    const [result] = await db.insert(tasks).values({
        webhookId,
        payload
    }).returning();
    
    const webhook = await getWebhookByIdDB(webhookId) as Webhook;

    //! Insert the corresponding deliveries
    await db.insert(deliveries).values(
        webhook.subscribers.map((subscriber) => ({
            taskId: result.id,
            subscriberId: subscriber.id
        }))
    );

    return await getTaskByIdDB(result.id) as Task;
}

export async function getTaskByIdDB(id: string): Promise<Task | undefined> {
    const result = await db.query.tasks.findFirst({
        where: (tasks, { eq }) => eq(tasks.id, id),
        with: {
            deliveries: true,
            webhook: {
                with: {
                    user: true,
                    subscribers: true
                }
            }
        }
    });
    return result;
}

export async function getAllTasksDB(): Promise<Task[]> {
    const result = await db.query.tasks.findMany({
        with: {
            deliveries: true,
            webhook: {
                with: {
                    user: true,
                    subscribers: true
                }
            }
        }
    });
    return result;
}

export async function updateTaskStatusDB(id: string, status: TaskStatus): Promise<void> {
    await db.update(tasks).set({ status, processedAt: new Date() }).where(eq(tasks.id, id));
}