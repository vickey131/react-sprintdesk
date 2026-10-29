
import type { Task } from "../../features/tasks/model";

export type TaskFilters = {
  search?: string;
  status?: Task["status"];
  priority?: Task["priority"];
};

export const taskQueryKeys = {
  all: ["tasks"] as const,

  list: (filters: TaskFilters = {}) =>
    [
      "tasks",
      {
        search: filters.search ?? "",
        status: filters.status ?? "all",
        priority: filters.priority ?? "all",
      },
    ] as const,
};
