
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BrokenTaskList, type Task } from "./BrokenTaskList";

afterEach(() => {
  cleanup();
});

function createTasks(): Task[] {
  return [
    {
      id: "1",
      title: "First task",
      done: false,
      priority: "low",
    },
    {
      id: "2",
      title: "Second task",
      done: false,
      priority: "high",
    },
  ];
}

describe("BrokenTaskList defect", () => {
  it("does not mutate the initial array when adding a task", () => {
    const initialTasks = createTasks();
    render(<BrokenTaskList initialTasks={initialTasks} />);

    fireEvent.change(screen.getByLabelText("New task"), {
      target: { value: "Third task" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(initialTasks).toHaveLength(2);
  });

  it("keeps notes associated with the correct task after deletion", () => {
    render(<BrokenTaskList initialTasks={createTasks()} />);

    fireEvent.change(screen.getByLabelText("Notes for Second task"), {
      target: { value: "Keep these notes" },
    });

    const firstTask = screen.getByText("First task").closest("li");
    if (!firstTask) throw new Error("First task list item not found");

    fireEvent.click(
      screen.getAllByRole("button", { name: "Delete" })[0]
    );

    expect(
      screen.getByLabelText("Notes for Second task")
    ).toHaveProperty("value", "Keep these notes");
  });

  it("updates the completed count in both directions", () => {
    render(<BrokenTaskList initialTasks={createTasks()} />);

    const checkbox = screen.getByLabelText("Complete First task");

    fireEvent.click(checkbox);
    expect(screen.getByText("1 of 2 completed")).toBeTruthy();

    fireEvent.click(checkbox);
    expect(screen.getByText("0 of 2 completed")).toBeTruthy();
  });

  it("removes a deleted task from the visible list", () => {
    render(<BrokenTaskList initialTasks={createTasks()} />);

    fireEvent.click(
      screen.getAllByRole("button", { name: "Delete" })[0]
    );

    expect(screen.queryByText("First task")).toBeNull();
  });

  it("does not reorder the original array when sorting", () => {
    const initialTasks = createTasks();
    const originalOrder = initialTasks.map((task) => task.id);

    render(<BrokenTaskList initialTasks={initialTasks} />);

    fireEvent.click(screen.getByRole("button", { name: "Sort by priority" }));

    expect(initialTasks.map((task) => task.id)).toEqual(originalOrder);
  });
});
