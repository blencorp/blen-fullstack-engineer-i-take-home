import { pgTable, pgEnum, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "completed",
  "archived",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "open",
  "in_progress",
  "in_review",
  "completed",
]);

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  status: projectStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("open").notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  assignee: text("assignee"),
  dueDate: timestamp("due_date"),
  labels: text("labels").array().default([]),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const projectRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type ProjectStatus = (typeof projectStatusEnum.enumValues)[number];
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];
