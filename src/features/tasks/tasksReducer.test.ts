import { describe, expect, it } from "vitest";
import type { Task } from "./model";
import { tasksReducer } from "./tasksReducer";

function createTasks(): Task[] {
  return [
    {
      id: "1",
      title: "First task",
      description: "First description",
      status: "todo",
      priority: "low",
      assigneeId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Second task",
      description: "Second description",
      status: "in_progress",
      priority: "high",
      assigneeId: "employee-1",
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    },
  ];
}

describe("tasksReducer", () => {
  it("adds a task without mutating the existing state", () => {
    const tasks = createTasks();
    const newTask: Task = {
      id: "3",
      title: "Third task",
      description: "",
      status: "todo",
      priority: "medium",
      assigneeId: null,
      createdAt: "2026-01-03T00:00:00.000Z",
      updatedAt: "2026-01-03T00:00:00.000Z",
    };

    const result = tasksReducer(tasks, { type: "add", task: newTask });

    expect(result).toEqual([...tasks, newTask]);
    expect(result).not.toBe(tasks);
    expect(tasks).toHaveLength(2);
  });

  it("updates the matching task without mutating existing tasks", () => {
    const tasks = createTasks();
    const result = tasksReducer(tasks, {
      type: "update",
      id: "1",
      updates: { title: "Updated title", priority: "high" },
    });

    expect(result[0]).toEqual({
      ...tasks[0],
      title: "Updated title",
      priority: "high",
    });
    expect(result[1]).toBe(tasks[1]);
    expect(tasks[0].title).toBe("First task");
  });

  it("deletes only the matching task without mutating the existing state", () => {
    const tasks = createTasks();
    const result = tasksReducer(tasks, { type: "delete", id: "1" });

    expect(result).toEqual([tasks[1]]);
    expect(result).not.toBe(tasks);
    expect(tasks).toHaveLength(2);
  });

  it("moves a task to the requested status", () => {
    const tasks = createTasks();
    const result = tasksReducer(tasks, {
      type: "move-status",
      id: "1",
      status: "in_progress",
    });

    expect(result[0]).toEqual({ ...tasks[0], status: "in_progress" });
    expect(result[1]).toBe(tasks[1]);
    expect(tasks[0].status).toBe("todo");
  });

  it("toggles a todo task to done", () => {
    const tasks = createTasks();
    const result = tasksReducer(tasks, { type: "toggle", id: "1" });

    expect(result[0].status).toBe("done");
    expect(tasks[0].status).toBe("todo");
  });

  it("toggles an in-progress task to done", () => {
    const tasks = createTasks();
    const result = tasksReducer(tasks, { type: "toggle", id: "2" });

    expect(result[1].status).toBe("done");
  });

  it("toggles a done task back to todo", () => {
    const tasks = createTasks().map((task) =>
      task.id === "1" ? { ...task, status: "done" as const } : task
    );
    const result = tasksReducer(tasks, { type: "toggle", id: "1" });

    expect(result[0].status).toBe("todo");
  });

  it("returns the existing state when an action targets a missing task", () => {
    const tasks = createTasks();

    expect(
      tasksReducer(tasks, {
        type: "update",
        id: "missing",
        updates: { title: "Not added" },
      })
    ).toBe(tasks);
    expect(tasksReducer(tasks, { type: "delete", id: "missing" })).toBe(tasks);
    expect(
      tasksReducer(tasks, {
        type: "move-status",
        id: "missing",
        status: "done",
      })
    ).toBe(tasks);
    expect(tasksReducer(tasks, { type: "toggle", id: "missing" })).toBe(tasks);
  });
});
