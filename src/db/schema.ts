import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
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

export const usersRelations = relations(users, ({ many }) => ({
  webhooks: many(webhooks),
}));

export const webhooksRelations = relations(webhooks, ({ one, many }) => ({
  user: one(users, {
    fields: [webhooks.userId],
    references: [users.id],
  }),
  subscribers: many(subscribers),
}));

export const subscribersRelations = relations(subscribers, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [subscribers.webhookId],
    references: [webhooks.id],
  }),
}));