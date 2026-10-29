import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App task workflow", () => {
  it("adds a submitted task to the API-backed task list", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    await screen.findByText("Build task list");

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

    expect(await screen.findByText("Plan sprint")).toBeTruthy();
    expect(await screen.findByText("1 of 4 completed")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Complete Plan sprint"));
    expect(await screen.findByText("2 of 4 completed")).toBeTruthy();
  });
});
