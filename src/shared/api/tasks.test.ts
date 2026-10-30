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
