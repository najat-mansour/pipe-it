import { db } from "../index.js";
import { NewUser, User, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUserDB(user: NewUser): Promise<User> {
  const [result] = await db.insert(users).values(user).returning();
  return result;
}

export async function getUserByEmailDB(email: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}
