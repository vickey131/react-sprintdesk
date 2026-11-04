import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import App, { RouteErrorBoundary } from "./App";
import { server } from "./shared/mocks/server";

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

    await screen.findByText("Task1");

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

  it("preserves task form values and retries a failed submission", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    server.use(
      http.post("*/api/tasks", () =>
        HttpResponse.json({ message: "Create failed" }, { status: 503 }),
      ),
    );
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    await screen.findByText("Task1");
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Recover this task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Keep these values after an error" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "high" },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "in_progress" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Create failed",
    );
    expect(screen.getByLabelText("Title")).toHaveProperty(
      "value",
      "Recover this task",
    );
    expect(screen.getByLabelText("Description")).toHaveProperty(
      "value",
      "Keep these values after an error",
    );
    expect(screen.getByLabelText("Priority")).toHaveProperty("value", "high");
    expect(screen.getByLabelText("Status")).toHaveProperty(
      "value",
      "in_progress",
    );

    server.resetHandlers();
    fireEvent.click(screen.getByRole("button", { name: "Retry submission" }));

    expect(await screen.findByText("Recover this task")).toBeTruthy();
  });

  it("offers a retry when the route encounters a render error", () => {
    function ThrowWhenEnabled({ shouldThrow }: { shouldThrow: boolean }) {
      if (shouldThrow) {
        throw new Error("Render failed");
      }
      return <p>Recovered route</p>;
    }

    function RouteHarness() {
      const [shouldThrow, setShouldThrow] = useState(true);

      return (
        <>
          <button type="button" onClick={() => setShouldThrow(false)}>
            Clear route error
          </button>
          <RouteErrorBoundary>
            <ThrowWhenEnabled shouldThrow={shouldThrow} />
          </RouteErrorBoundary>
        </>
      );
    }

    render(<RouteHarness />);

    expect(screen.getByRole("alert").textContent).toContain("Render failed");
    fireEvent.click(screen.getByRole("button", { name: "Clear route error" }));
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByText("Recovered route")).toBeTruthy();
  });
});
