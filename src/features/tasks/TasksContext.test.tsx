import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Task } from "./model";
import { TasksProvider, useTasks } from ".";

afterEach(() => {
  cleanup();
});

const task: Task = {
  id: "task-1",
  title: "Shared task",
  description: "",
  status: "todo",
  priority: "medium",
  assigneeId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("TasksProvider and useTasks", () => {
  it("provides reducer state and dispatch to consumers", () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: TasksProvider,
    });

    expect(result.current.tasks).toEqual([]);

    act(() => {
      result.current.dispatch({ type: "add", task });
    });

    expect(result.current.tasks).toEqual([task]);
  });

  it("throws a helpful error when used outside TasksProvider", () => {
    expect(() => renderHook(() => useTasks())).toThrow(
      "useTasks must be used within a TasksProvider."
    );
  });
});
