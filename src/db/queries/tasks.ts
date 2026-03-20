import { Task, TaskStatus } from "../../types/tasks.js";
import { db } from "../index.js";
import { tasks } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createTaskDB(webhookId: string, payload: unknown): Promise<Task> {
    const [result] = await db.insert(tasks).values({
        webhookId,
        payload
    }).returning();
    return await getTaskByIdDB(result.id) as Task;
}

export async function getTaskByIdDB(id: string): Promise<Task | undefined> {
    const result = await db.query.tasks.findFirst({
        where: (tasks, { eq }) => eq(tasks.id, id),
        with: {
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