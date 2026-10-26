import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Task } from "../model";
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

  it("submits trimmed title, description, priority, and status in create mode", () => {
    const onSubmit = vi.fn<(values: TaskFormValues) => void>();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "  Write tests  " },
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

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Write tests",
      description: "Add form coverage",
      priority: "high",
      status: "in_progress",
    });
  });

  it("rejects a title shorter than 3 trimmed characters", () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "  a  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toBe(
      "Title must be between 3 and 100 characters."
    );
  });

  it("prevents titles longer than 100 characters", () => {
    const onSubmit = vi.fn();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "a".repeat(101) },
    });
    expect(screen.getByLabelText("Title")).toHaveProperty(
      "value",
      "a".repeat(100)
    );
  });

  it("accepts a title of exactly 100 characters", () => {
    const onSubmit = vi.fn<(values: TaskFormValues) => void>();
    render(<TaskForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "a".repeat(100) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "a".repeat(100) })
    );
  });

  it("renders existing values and submits changes in edit mode", () => {
    const onSubmit = vi.fn<(values: TaskFormValues) => void>();
    const task = createTask();
    render(<TaskForm task={task} onSubmit={onSubmit} />);

    expect(screen.getByRole("form", { name: "Edit task" })).toBeTruthy();
    expect(screen.getByLabelText("Title")).toHaveProperty(
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

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated task" },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "done" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Updated task",
      description: "Task details",
      priority: "high",
      status: "done",
    });
  });

  it("calls onCancel when cancel is available", () => {
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
