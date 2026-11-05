import { z } from "zod";
import { TaskSchema, type Task } from "../model/model";
import type { TaskFilters } from "./taskQueryKeys";
import { request } from "../../../shared/lib/http";

type CreateTaskInput = Omit<Task, "id" | "createdAt" | "updatedAt">;

const TasksResponseSchema = z.array(TaskSchema).superRefine((tasks, context) => {
  const ids = new Set<string>();

  tasks.forEach((task, index) => {
    if (ids.has(task.id)) {
      context.addIssue({
        code: "custom",
        message: "Task IDs must be unique.",
        path: [index, "id"],
      });
    }
    ids.add(task.id);
  });
});

function parseResponse<T>(schema: z.ZodType<T>, response: unknown): T {
  const result = schema.safeParse(response);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

export function getTasks(filters: TaskFilters, signal: AbortSignal) {
  const searchParams = new URLSearchParams();

  if (filters.search) {
    searchParams.set("search", filters.search);
  }
  if (filters.status) {
    searchParams.set("status", filters.status);
  }
  if (filters.priority) {
    searchParams.set("priority", filters.priority);
  }

  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  return request(`/api/tasks${query}`, { signal }).then((response) =>
    parseResponse(TasksResponseSchema, response),
  );
}

export function createTask(input: CreateTaskInput) {
  return request("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).then((response) => parseResponse(TaskSchema, response));
}

export function updateTask(
  id: Task["id"],
  updates: Partial<Pick<Task, "status">>,
) {
  return request(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  }).then((response) => parseResponse(TaskSchema, response));
}

export function deleteTask(id: Task["id"]) {
  return request(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  }).then((response) => parseResponse(z.undefined(), response));
}
