
import { http, HttpResponse } from "msw";
import type { Task, NewTaskInput } from "../../features/tasks/model";

const seedTasks: Task[] = [
  {
    id: "task-1",
    title: "Task1",
    description: "test",
    status: "todo",
    priority: "high",
    assigneeId: null,
    createdAt: "2026-10-29T09:00:00.000Z",
    updatedAt: "2026-10-29T09:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Add search",
    description: "Filter tasks by title",
    status: "in_progress",
    priority: "medium",
    assigneeId: null,
    createdAt: "2026-10-29T10:00:00.000Z",
    updatedAt: "2026-10-29T10:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Write unit tests",
    description: "Cover task reducer behavior",
    status: "done",
    priority: "low",
    assigneeId: null,
    createdAt: "2026-10-29T11:00:00.000Z",
    updatedAt: "2026-10-29T11:00:00.000Z",
  },
];

let tasks: Task[] = [...seedTasks];

export function resetTasks(initialTasks: Task[] = seedTasks) {
  tasks = initialTasks.map((task) => ({ ...task }));
}

export const handlers = [
  // GET /api/tasks
  http.get("*/api/tasks", ({ request }) => {
    const url = new URL(request.url);

    if (url.searchParams.get("fail") === "500") {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }

    const search = url.searchParams.get("search")?.toLocaleLowerCase().trim();
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");

    const result = tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title.toLocaleLowerCase().includes(search) ||
        task.description.toLocaleLowerCase().includes(search);

      return (
        matchesSearch &&
        (!status || task.status === status) &&
        (!priority || task.priority === priority)
      );
    });

    return HttpResponse.json(result);
  }),

  // POST /api/tasks
  http.post("*/api/tasks", async ({ request }) => {
    const input = (await request.json()) as NewTaskInput & {
      status?: Task["status"];
    };
    const now = new Date().toISOString();

    const task: Task = {
      ...input,
      id: crypto.randomUUID(),
      status: input.status ?? "todo",
      assigneeId: null,
      createdAt: now,
      updatedAt: now,
    };

    tasks = [...tasks, task];

    return HttpResponse.json(task, { status: 201 });
  }),

  // PATCH /api/tasks/:id
  http.patch("*/api/tasks/:id", async ({ params, request }) => {
    const id = String(params.id);
    const updates = (await request.json()) as Partial<
      Pick<Task, "title" | "description" | "status" | "priority" | "assigneeId">
    >;

    const existing = tasks.find((task) => task.id === id);

    if (!existing) {
      return HttpResponse.json(
        { message: "Task not found" },
        { status: 404 },
      );
    }

    const updated: Task = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    tasks = tasks.map((task) => (task.id === id ? updated : task));

    return HttpResponse.json(updated);
  }),

  // DELETE /api/tasks/:id
  http.delete("*/api/tasks/:id", ({ params }) => {
    const id = String(params.id);
    const exists = tasks.some((task) => task.id === id);

    if (!exists) {
      return HttpResponse.json(
        { message: "Task not found" },
        { status: 404 },
      );
    }

    tasks = tasks.filter((task) => task.id !== id);

    return new HttpResponse(null, { status: 204 });
  }),
];
