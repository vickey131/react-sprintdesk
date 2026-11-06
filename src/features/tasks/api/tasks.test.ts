import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./tasks";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("task API response validation", () => {
  it("rejects malformed task list payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json([{ id: "task-1" }])),
    );

    await expect(getTasks({}, new AbortController().signal)).rejects.toBeInstanceOf(
      z.ZodError,
    );
  });

  it("rejects task lists with duplicate IDs", async () => {
    const task = {
      id: "task-1",
      title: "Valid title",
      description: "",
      status: "todo",
      priority: "medium",
      assigneeId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json([task, task])),
    );

    await expect(getTasks({}, new AbortController().signal)).rejects.toBeInstanceOf(
      z.ZodError,
    );
  });

  it("accepts an empty task list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json([])),
    );

    await expect(getTasks({}, new AbortController().signal)).resolves.toEqual([]);
  });

  it("rejects invalid list, create, update, and delete responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => Promise.resolve(Response.json({}))),
    );

    await expect(getTasks({}, new AbortController().signal)).rejects.toBeInstanceOf(
      z.ZodError,
    );
    await expect(
      createTask({
        title: "Valid title",
        description: "",
        status: "todo",
        priority: "medium",
        assigneeId: null,
      }),
    ).rejects.toBeInstanceOf(z.ZodError);
    await expect(updateTask("task-1", { status: "done" })).rejects.toBeInstanceOf(
      z.ZodError,
    );
    await expect(deleteTask("task-1")).rejects.toBeInstanceOf(z.ZodError);
  });

  it("accepts a successful 204 delete response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );

    await expect(deleteTask("task-1")).resolves.toBeUndefined();
  });
});
