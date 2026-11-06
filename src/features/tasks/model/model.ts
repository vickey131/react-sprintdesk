
import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "in_progress", "done"], {
  error: "Choose a valid task status.",
});
export const PrioritySchema = z.enum(["low", "medium", "high"], {
  error: "Choose a valid priority.",
});

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: TaskStatusSchema,
  priority: PrioritySchema,
  assigneeId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const TaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be between 3 and 100 characters.")
    .max(100, "Title must be between 3 and 100 characters."),
  dueDate: z.string().optional(),
  description: z.string(),
  priority: PrioritySchema,
  status: TaskStatusSchema,
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type TaskFormValues = z.infer<typeof TaskFormSchema>;
export type NewTaskInput = Pick<
  Task,
  "title" | "description" | "priority" | "assigneeId"
>;
