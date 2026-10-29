
import { expect, it } from "vitest";

const api = "http://localhost/api/tasks";

it("returns seeded tasks", async () => {
  const response = await fetch(api);
  const tasks = await response.json();

  expect(response.status).toBe(200);
  expect(tasks).toHaveLength(3);
});

it("filters tasks by search, status, and priority", async () => {
  const response = await fetch(
    `${api}?search=unit&status=done&priority=low`,
  );
  const tasks = await response.json();

  expect(tasks).toHaveLength(1);
  expect(tasks[0]).toMatchObject({
    id: "task-3",
    status: "done",
    priority: "low",
  });
});

it("creates a task", async () => {
  const response = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Test API",
      description: "Test task creation",
      status: "todo",
      priority: "medium",
    }),
  });

  expect(response.status).toBe(201);

  const task = await response.json();
  expect(task.title).toBe("Test API");
  expect(task.id).toBeDefined();
});

it("updates a task", async () => {
  const response = await fetch(`${api}/task-1`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "done" }),
  });

  expect(response.status).toBe(200);
  expect(await response.json()).toMatchObject({ id: "task-1", status: "done" });
});

it("deletes a task", async () => {
  const response = await fetch(`${api}/task-1`, { method: "DELETE" });

  expect(response.status).toBe(204);

  const listResponse = await fetch(api);
  const tasks = await listResponse.json();

  expect(tasks.some((task: { id: string }) => task.id === "task-1")).toBe(false);
});

it("returns 404 for a missing task", async () => {
  const response = await fetch(`${api}/missing-task`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "done" }),
  });

  expect(response.status).toBe(404);
});

it("returns 500 when the failure switch is enabled", async () => {
  const response = await fetch(`${api}?fail=500`);

  expect(response.status).toBe(500);
  expect(await response.json()).toMatchObject({
    message: "Internal server error",
  });
});
