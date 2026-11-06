import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { axe } from "vitest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../model/model";
import { TaskForm, type TaskFormValues } from "./TaskForm";

afterEach(() => {
  cleanup();
});

function createTask(): Task {
  return {
    id: "task-1",
    title: "Existing task",
    description: "Task details",
    status: "in_progress",
    priority: "high",
    assigneeId: "employee-1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
}

describe("TaskForm", () => {
  it("renders create mode with default priority and status", () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    expect(screen.getByRole("form", { name: "Create task" })).toBeTruthy();
    expect(screen.getByLabelText("Priority")).toHaveProperty("value", "medium");
    expect(screen.getByLabelText("Status")).toHaveProperty("value", "todo");
    expect(
      screen.getByRole("button", { name: "Create task" })
    ).toBeTruthy();
  });

  it("has no accessibility violations in create mode", async () => {
    const { container } = render(<TaskForm onSubmit={vi.fn()} />);

    expect((await axe(container)).violations).toHaveLength(0);
  });

  it("submits trimmed title, description, priority, and status in create mode", async () => {
    const onSubmit = vi.fn<(values: TaskFormValues) => void>();
    render(<TaskForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText("Due date")).toHaveProperty("type", "date");
    fireEvent.change(screen.getByLabelText("Task title"), {
      target: { value: "  Write tests  " },
    });
    fireEvent.change(screen.getByLabelText("Due date"), {
      target: { value: "2026-12-31" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Add form coverage" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "in_progress" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Write tests",
        dueDate: "2026-12-31",
        description: "Add form coverage",
        priority: "high",
        status: "in_progress",
      }, expect.any(Function)),
    );
  });

  it("rejects a title shorter than 3 trimmed characters", async () => {
    const onSubmit = vi.fn();
    const { container } = render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Task title"), {
      target: { value: "  a  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSubmit).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toBe(
        "Title must be between 3 and 100 characters.",
      );
      expect(screen.getByLabelText("Task title").getAttribute("aria-describedby")).toBe(
        "task-title-error",
      );
      expect(document.activeElement).toBe(screen.getByLabelText("Task title"));
    });
    expect((await axe(container)).violations).toHaveLength(0);
  });

  it("disables and guards submission while a request is pending", () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();
    render(
      <TaskForm onSubmit={onSubmit} onCancel={onCancel} isSubmitting />,
    );

    expect(
      screen.getByRole("button", { name: "Saving..." }).hasAttribute("disabled"),
    ).toBe(true);
    expect(
      screen.getByRole("button", { name: "Cancel" }).hasAttribute("disabled"),
    ).toBe(true);
    fireEvent.submit(screen.getByRole("form", { name: "Create task" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps the Cancel button enabled when no request is pending", () => {
    render(<TaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Cancel" }).hasAttribute("disabled"),
    ).toBe(false);
  });

  it("prevents titles longer than 100 characters", () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Task title"), {
      target: { value: "a".repeat(101) },
    });
    expect(screen.getByLabelText("Task title")).toHaveProperty(
      "value",
      "a".repeat(100)
    );
  });

  it("accepts a title of exactly 100 characters", async () => {
    const onSubmit = vi.fn<(values: TaskFormValues) => void>();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Task title"), {
      target: { value: "a".repeat(100) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: "a".repeat(100) }),
        expect.any(Function),
      ),
    );
  });

  it("renders existing values and submits changes in edit mode", async () => {
    const onSubmit = vi.fn<(values: TaskFormValues) => void>();
    const task = createTask();
    render(<TaskForm task={task} onSubmit={onSubmit} />);

    expect(screen.getByRole("form", { name: "Edit task" })).toBeTruthy();
    expect(screen.getByLabelText("Task title")).toHaveProperty(
      "value",
      "Existing task"
    );
    expect(screen.getByLabelText("Description")).toHaveProperty(
      "value",
      "Task details"
    );
    expect(screen.getByLabelText("Priority")).toHaveProperty("value", "high");
    expect(screen.getByLabelText("Status")).toHaveProperty(
      "value",
      "in_progress"
    );

    fireEvent.change(screen.getByLabelText("Task title"), {
      target: { value: "Updated task" },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "done" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: "Updated task",
        dueDate: "",
        description: "Task details",
        priority: "high",
        status: "done",
      }, expect.any(Function));
    });
  });

  it("calls onCancel when cancel is available", () => {
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("labels the cancel button 'Discard changes' in edit mode", () => {
    render(<TaskForm task={createTask()} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Discard changes" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });
});
