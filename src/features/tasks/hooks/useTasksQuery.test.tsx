import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { taskQueryKeys } from "../../../shared/api/taskQueryKeys";
import { useTasksQuery } from "./useTasksQuery";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("uses every filter in the key and passes TanStack Query's signal to fetch", async () => {
  const filters = {
    search: "unit",
    status: "done" as const,
    priority: "low" as const,
  };
  const fetchMock = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe(
        "/api/tasks?search=unit&status=done&priority=low",
      );
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return Response.json([]);
    },
  );
  vi.stubGlobal("fetch", fetchMock);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useTasksQuery(filters), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual([]);
  expect(fetchMock).toHaveBeenCalledOnce();
  expect(taskQueryKeys.list(filters)).toEqual([
    "tasks",
    { search: "unit", status: "done", priority: "low" },
  ]);
});
