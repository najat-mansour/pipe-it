import { users } from "./schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = Partial<NewUser>;
export type UserWithoutPassword = Omit<User, "password">;
export type LoggedInUser = UserWithoutPassword & { token: string }; 