import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../model";
import { BrokenTaskList } from "./BrokenTaskList";
import { resetTasks } from "../../../shared/mocks/handlers";
import { server } from "../../../shared/mocks/server";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

beforeEach(() => {
  window.localStorage.clear();
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

async function renderTaskList(initialTasks = createTasks()) {
  resetTasks(initialTasks);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <BrokenTaskList />
    </QueryClientProvider>,
  );
  await screen.findByText(initialTasks.length ? initialTasks[0].title : "No tasks yet.");
}

describe("BrokenTaskList", () => {
  it("completes and deletes tasks through the API", async () => {
    await renderTaskList();

    fireEvent.click(screen.getByLabelText("Complete First task"));
    await screen.findByText("1 of 2 completed");

    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    await waitFor(() => {
      expect(screen.queryByText("First task")).toBeNull();
      expect(screen.getByText("0 of 1 completed")).toBeTruthy();
    });
  });

  it("filters completed tasks without changing API data", async () => {
    const initialTasks = createTasks().map((task) =>
      task.id === "1" ? { ...task, status: "done" as const } : task
    );
    await renderTaskList(initialTasks);

    fireEvent.click(screen.getByLabelText("Show completed"));

    expect(screen.queryByText("First task")).toBeNull();
    expect(screen.getByText("1 of 2 completed")).toBeTruthy();
  });

  it("sorts a derived list without mutating the API task order", async () => {
    const initialTasks = createTasks();
    await renderTaskList(initialTasks);

    fireEvent.click(screen.getByRole("button", { name: "Sort by priority" }));

    const renderedTitles = screen
      .getAllByRole("listitem")
      .map((item) => item.querySelector("span")?.textContent);
    expect(renderedTitles).toEqual(["Second task", "First task"]);
    expect(initialTasks.map((task) => task.id)).toEqual(["1", "2"]);
  });

  it("searches tasks by title", async () => {
    await renderTaskList();
    vi.useFakeTimers();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search tasks" }), {
      target: { value: "second" },
    });

    expect(screen.getByText("First task")).toBeTruthy();
    await vi.advanceTimersByTimeAsync(300);
    vi.useRealTimers();

    expect(await screen.findByText("Second task")).toBeTruthy();
    expect(screen.queryByText("First task")).toBeNull();
  });

  it("filters tasks by status and priority", async () => {
    const initialTasks = createTasks().map((task) =>
      task.id === "1" ? { ...task, status: "done" as const } : task
    );
    await renderTaskList(initialTasks);

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "done" },
    });
    fireEvent.change(screen.getByLabelText("Filter by priority"), {
      target: { value: "low" },
    });

    await waitFor(() => {
      expect(screen.getByText("First task")).toBeTruthy();
      expect(screen.queryByText("Second task")).toBeNull();
    });
  });

  it("counts every task by status regardless of active filters", async () => {
    const initialTasks = createTasks().map((task) =>
      task.id === "1"
        ? { ...task, status: "in_progress" as const }
        : { ...task, status: "done" as const }
    );
    await renderTaskList(initialTasks);

    expect(screen.getByText(/To do: 0/)).toBeTruthy();
    expect(screen.getByText(/In progress: 1/)).toBeTruthy();
    expect(screen.getByText(/Done: 1/)).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "in_progress" },
    });

    expect(screen.getByText(/Done: 1/)).toBeTruthy();
  });

  it("shows a distinct empty state when there are no tasks", async () => {
    await renderTaskList([]);

    expect(screen.getByText("No tasks yet.")).toBeTruthy();
  });

  it("shows a distinct empty state when filters match no tasks", async () => {
    await renderTaskList();

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "done" },
    });

    await screen.findByText("No tasks match your filters.");
  });

  it("shows an API error and retries the failed request", async () => {
    let shouldFail = true;
    server.use(
      http.get("*/api/tasks", () =>
        shouldFail
          ? HttpResponse.json(
              { message: "Service unavailable" },
              { status: 503 },
            )
          : HttpResponse.json(createTasks()),
      ),
    );
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <BrokenTaskList />
      </QueryClientProvider>,
    );

    expect((await screen.findByRole("alert")).textContent).toBe(
      "Unable to load tasks: Service unavailable",
    );
    shouldFail = false;
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("First task")).toBeTruthy();
  });

  it("sorts tasks by newest creation date", async () => {
    await renderTaskList();

    fireEvent.click(screen.getByRole("button", { name: "Sort by date" }));

    const renderedTitles = screen
      .getAllByRole("listitem")
      .map((item) => item.querySelector("span")?.textContent);
    expect(renderedTitles).toEqual(["Second task", "First task"]);
  });
});
