import type { Task } from "../../features/tasks/model";
import type { TaskFilters } from "./taskQueryKeys";
import { request } from "./http";

type CreateTaskInput = Pick<
  Task,
  "title" | "description" | "status" | "priority" | "assigneeId"
>;

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
  return request<Task[]>(`/api/tasks${query}`, { signal });
}

export function createTask(input: CreateTaskInput) {
  return request<Task>("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateTask(
  id: Task["id"],
  updates: Partial<Pick<Task, "status">>,
) {
  return request<Task>(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
}

export function deleteTask(id: Task["id"]) {
  return request<void>(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
