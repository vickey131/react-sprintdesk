import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Task } from "./model";
import { TasksProvider, useTasks } from ".";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

beforeEach(() => {
  window.localStorage.clear();
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

  it("loads tasks from local storage", () => {
    window.localStorage.setItem("sprintdesk-tasks", JSON.stringify([task]));

    const { result } = renderHook(() => useTasks(), {
      wrapper: TasksProvider,
    });

    expect(result.current.tasks).toEqual([task]);
  });

  it("persists task updates to local storage", () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: TasksProvider,
    });

    act(() => {
      result.current.dispatch({ type: "add", task });
    });

    expect(window.localStorage.getItem("sprintdesk-tasks")).toBe(
      JSON.stringify([task])
    );
  });

  it("throws a helpful error when used outside TasksProvider", () => {
    expect(() => renderHook(() => useTasks())).toThrow(
      "useTasks must be used within a TasksProvider."
    );
  });
});
