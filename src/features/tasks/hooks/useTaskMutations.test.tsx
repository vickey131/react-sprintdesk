import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { taskQueryKeys } from "../../../shared/api/taskQueryKeys";
import type { Task } from "../model";
import { useTaskMutations } from "./useTaskMutations";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const task: Task = {
  id: "task-1",
  title: "Task1",
  description: "",
  status: "todo",
  priority: "high",
  assigneeId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function createMutationHarness() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const allTasksKey = taskQueryKeys.list();
  const todoTasksKey = taskQueryKeys.list({ status: "todo" });
  queryClient.setQueryData(allTasksKey, [task]);
  queryClient.setQueryData(todoTasksKey, [task]);

  return { queryClient, wrapper, allTasksKey, todoTasksKey };
}

describe("useTaskMutations", () => {
  it("optimistically updates the task status in cached task queries", async () => {
    let resolveFetch!: (response: Response) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );
    const { queryClient, wrapper, allTasksKey, todoTasksKey } =
      createMutationHarness();
    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    result.current.updateTaskMutation.mutate({
      id: task.id,
      status: "done",
    });

    await waitFor(() => {
      expect(queryClient.getQueryData<Task[]>(allTasksKey)?.[0].status).toBe(
        "done",
      );
      expect(queryClient.getQueryData<Task[]>(todoTasksKey)?.[0].status).toBe(
        "done",
      );
    });

    resolveFetch(Response.json({ ...task, status: "done" }));
    await waitFor(() =>
      expect(result.current.updateTaskMutation.isSuccess).toBe(true),
    );
  });

  it("rolls back cached task data when a status update fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ message: "Update failed" }, { status: 500 }),
      ),
    );
    const { queryClient, wrapper, allTasksKey, todoTasksKey } =
      createMutationHarness();
    const { result } = renderHook(() => useTaskMutations(), { wrapper });

    result.current.updateTaskMutation.mutate({
      id: task.id,
      status: "done",
    });

    await waitFor(() =>
      expect(result.current.updateTaskMutation.isError).toBe(true),
    );

    expect(queryClient.getQueryData<Task[]>(allTasksKey)).toEqual([task]);
    expect(queryClient.getQueryData<Task[]>(todoTasksKey)).toEqual([task]);
  });
});
