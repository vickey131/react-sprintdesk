import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../model";
import { TasksProvider, useTasks } from "..";
import { BrokenTaskList } from "./BrokenTaskList";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function createTasks(): Task[] {
  return [
    {
      id: "1",
      title: "First task",
      description: "",
      status: "todo",
      priority: "low",
      assigneeId: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      title: "Second task",
      description: "",
      status: "todo",
      priority: "high",
      assigneeId: null,
      createdAt: "2026-01-02T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
    },
  ];
}

function TaskListHarness({ initialTasks }: { initialTasks: Task[] }) {
  const { dispatch } = useTasks();

  return (
    <>
      <button
        type="button"
        onClick={() =>
          initialTasks.forEach((task) => dispatch({ type: "add", task }))
        }
      >
        Load tasks
      </button>
      <BrokenTaskList />
    </>
  );
}

function renderTaskList(initialTasks = createTasks()) {
  render(
    <TasksProvider>
      <TaskListHarness initialTasks={initialTasks} />
    </TasksProvider>
  );
  fireEvent.click(screen.getByRole("button", { name: "Load tasks" }));
}

describe("BrokenTaskList", () => {
  it("shares task completion and deletion with the provider state", () => {
    renderTaskList();

    fireEvent.click(screen.getByLabelText("Complete First task"));
    expect(screen.getByText("1 of 2 completed")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    expect(screen.queryByText("First task")).toBeNull();
    expect(screen.getByText("0 of 1 completed")).toBeTruthy();
  });

  it("filters completed tasks without changing shared state", () => {
    const initialTasks = createTasks().map((task) =>
      task.id === "1" ? { ...task, status: "done" as const } : task
    );
    renderTaskList(initialTasks);

    fireEvent.click(screen.getByLabelText("Show completed"));

    expect(screen.queryByText("First task")).toBeNull();
    expect(screen.getByText("1 of 2 completed")).toBeTruthy();
  });

  it("sorts a derived list without mutating the shared task order", () => {
    const initialTasks = createTasks();
    renderTaskList(initialTasks);

    fireEvent.click(screen.getByRole("button", { name: "Sort by priority" }));

    const renderedTitles = screen
      .getAllByRole("listitem")
      .map((item) => item.querySelector("span")?.textContent);
    expect(renderedTitles).toEqual(["Second task", "First task"]);
    expect(initialTasks.map((task) => task.id)).toEqual(["1", "2"]);
  });

  it("searches tasks by title", () => {
    vi.useFakeTimers();
    renderTaskList();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search tasks" }), {
      target: { value: "second" },
    });

    expect(screen.getByText("First task")).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByText("First task")).toBeNull();
    expect(screen.getByText("Second task")).toBeTruthy();
  });

  it("filters tasks by status and priority", () => {
    const initialTasks = createTasks().map((task) =>
      task.id === "1" ? { ...task, status: "done" as const } : task
    );
    renderTaskList(initialTasks);

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "done" },
    });
    fireEvent.change(screen.getByLabelText("Filter by priority"), {
      target: { value: "low" },
    });

    expect(screen.getByText("First task")).toBeTruthy();
    expect(screen.queryByText("Second task")).toBeNull();
  });

  it("counts every task by status regardless of active filters", () => {
    const initialTasks = createTasks().map((task) =>
      task.id === "1"
        ? { ...task, status: "in_progress" as const }
        : { ...task, status: "done" as const }
    );
    renderTaskList(initialTasks);

    expect(screen.getByText(/To do: 0/)).toBeTruthy();
    expect(screen.getByText(/In progress: 1/)).toBeTruthy();
    expect(screen.getByText(/Done: 1/)).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "in_progress" },
    });

    expect(screen.getByText(/Done: 1/)).toBeTruthy();
  });

  it("shows a distinct empty state when there are no tasks", () => {
    renderTaskList([]);

    expect(screen.getByText("No tasks yet.")).toBeTruthy();
  });

  it("shows a distinct empty state when filters match no tasks", () => {
    renderTaskList();

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "done" },
    });

    expect(screen.getByText("No tasks match your filters.")).toBeTruthy();
  });

  it("sorts tasks by newest creation date", () => {
    renderTaskList();

    fireEvent.click(screen.getByRole("button", { name: "Sort by date" }));

    const renderedTitles = screen
      .getAllByRole("listitem")
      .map((item) => item.querySelector("span")?.textContent);
    expect(renderedTitles).toEqual(["Second task", "First task"]);
  });
});
