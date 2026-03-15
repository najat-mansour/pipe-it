import { db } from "../index.js";
import { NewUser, UpdateUser, User, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUserDB(user: NewUser): Promise<User> {
  const [result] = await db.insert(users).values(user).returning();
  return result;
}

export async function getUserByUsernameDB(username: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.username, username));
  return result;
}

export async function getUserByEmailDB(email: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
}

export async function getUserByIdDB(id: string): Promise<User> {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return result;
} 

export async function getAllUsersDB(): Promise<User[]> {
  const result = await db.select().from(users);
  return result;
} 

export async function deleteUserDB(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id)); 
}

export async function updateUserDB(id: string, user: UpdateUser): Promise<User> {
  const [result] = await db.update(users).set(user).where(eq(users.id, id)).returning();
  return result;
}