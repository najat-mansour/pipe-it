import { db } from "../index.js";
import { eq, sql } from "drizzle-orm";
import { deliveries } from "../schema.js";
import { DeliveryStatus } from "../../types/deliveries.js";

export async function increaseAttemptsNumberDB(id: string): Promise<void> {
    await db.update(deliveries).set({ attemptsNumber: sql`${deliveries.attemptsNumber} + 1` }).where(eq(deliveries.id, id));
}

export async function updateDeliveryStatusDB(id: string, status: DeliveryStatus): Promise<void> {
    if (status === "SUCCESS")
        await db.update(deliveries).set({ status, deliveredAt: new Date() }).where(eq(deliveries.id, id));
    else 
        await db.update(deliveries).set({ status }).where(eq(deliveries.id, id));
}