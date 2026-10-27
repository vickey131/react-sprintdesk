import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App task workflow", () => {
  it("adds a form submission to the task list shared state", () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Plan sprint" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Prepare the sprint backlog" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "high" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect(screen.getByText("Plan sprint")).toBeTruthy();
    expect(screen.getByText("0 of 1 completed")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Complete Plan sprint"));
    expect(screen.getByText("1 of 1 completed")).toBeTruthy();
  });
});
