import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../model";
import { useTaskFilters } from "./useTaskFilters";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.history.replaceState({}, "", "/");
});

function createTasks(): Task[] {
  return [
    {
      id: "1",
      title: "Low priority",
      description: "",
      status: "todo",
      priority: "low",
      assigneeId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Completed high priority",
      description: "",
      status: "done",
      priority: "high",
      assigneeId: null,
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    },
    {
      id: "3",
      title: "Medium priority",
      description: "",
      status: "in_progress",
      priority: "medium",
      assigneeId: null,
      createdAt: "2026-01-03T00:00:00.000Z",
      updatedAt: "2026-01-03T00:00:00.000Z",
    },
  ];
}

describe("useTaskFilters", () => {
  it("includes completed tasks by default and preserves input order", () => {
    const tasks = createTasks();
    const { result } = renderHook(() => useTaskFilters(tasks));

    expect(result.current.visibleTasks).toEqual(tasks);
    expect(result.current.showCompleted).toBe(true);
    expect(result.current.sortByPriority).toBe(false);
  });

  it("hides completed tasks when requested", () => {
    const tasks = createTasks();
    const { result } = renderHook(() => useTaskFilters(tasks));

    act(() => {
      result.current.setShowCompleted(false);
    });

    expect(result.current.visibleTasks.map((task) => task.id)).toEqual([
      "1",
      "3",
    ]);
  });

  it("sorts visible tasks high-to-low without mutating the input", () => {
    const tasks = createTasks();
    const originalTaskIds = tasks.map((task) => task.id);
    const { result } = renderHook(() => useTaskFilters(tasks));

    act(() => {
      result.current.setSortByPriority(true);
    });

    expect(result.current.visibleTasks.map((task) => task.id)).toEqual([
      "2",
      "3",
      "1",
    ]);
    expect(tasks.map((task) => task.id)).toEqual(originalTaskIds);
  });

  it("debounces URL-backed search text without case sensitivity", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTaskFilters(createTasks()));

    act(() => {
      result.current.setSearchQuery("COMPLETED");
    });

    expect(window.location.search).toBe("?search=COMPLETED");
    expect(result.current.searchQuery).toBe("COMPLETED");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.debouncedSearchQuery).toBe("completed");
  });

  it("stores status and priority filters in the URL", () => {
    const { result } = renderHook(() => useTaskFilters(createTasks()));

    act(() => {
      result.current.setStatusFilter("todo");
      result.current.setPriorityFilter("low");
    });

    expect(window.location.search).toBe("?status=todo&priority=low");
    expect(result.current.statusFilter).toBe("todo");
    expect(result.current.priorityFilter).toBe("low");
  });

  it("updates filters when browser navigation changes the URL", () => {
    const { result } = renderHook(() => useTaskFilters(createTasks()));

    act(() => {
      window.history.pushState({}, "", "/?status=done&priority=high");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current.statusFilter).toBe("done");
    expect(result.current.priorityFilter).toBe("high");
  });

  it("ignores invalid URL filter values", () => {
    window.history.replaceState({}, "", "/?status=unknown&priority=urgent");
    const { result } = renderHook(() => useTaskFilters(createTasks()));

    expect(result.current.statusFilter).toBe("all");
    expect(result.current.priorityFilter).toBe("all");
  });

  it("sorts tasks by newest creation date without mutating the input", () => {
    const tasks = createTasks();
    const originalTaskIds = tasks.map((task) => task.id);
    const { result } = renderHook(() => useTaskFilters(tasks));

    act(() => {
      result.current.setSortByDate(true);
    });

    expect(result.current.visibleTasks.map((task) => task.id)).toEqual([
      "3",
      "2",
      "1",
    ]);
    expect(tasks.map((task) => task.id)).toEqual(originalTaskIds);
  });
});