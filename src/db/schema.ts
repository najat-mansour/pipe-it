import { pgTable, uuid, varchar, timestamp, text, jsonb, pgEnum  } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const refreshTokens = pgTable('refresh_tokens', {
  token: text('token').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'), 
});

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: varchar("source", { length: 512 }).notNull().unique(),
  action: varchar("action", { length: 256 }).notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url", { length: 512 }).notNull(),
  webhookId: uuid("webhook_id")
    .notNull()
    .references(() => webhooks.id, { onDelete: "cascade" }),
});

const taskStatusEnum = pgEnum("task_status", [
  "CREATED",
  "IN_PROCESS",
  "FINISHED",
]);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  webhookId: uuid("webhook_id").references(() => webhooks.id, { onDelete: "cascade" }).notNull(),
  payload: jsonb("payload").notNull(),
  status: taskStatusEnum("status").default("CREATED").notNull(),  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at")
});

export const usersRelations = relations(users, ({ one, many }) => ({
  webhooks: many(webhooks),
  refreshToken: one(refreshTokens),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const webhooksRelations = relations(webhooks, ({ one, many }) => ({
  user: one(users, {
    fields: [webhooks.userId],
    references: [users.id],
  }),
  subscribers: many(subscribers),
  tasks: many(tasks)
}));

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [subscribers.webhookId],
    references: [webhooks.id]
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [tasks.webhookId],
    references: [webhooks.id],
  }),
}));