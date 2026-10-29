import { afterEach, expect, it, vi } from "vitest";
import { request, ApiError } from "./http";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("returns parsed JSON for a successful response", async () => {
  const data = { id: 1 };
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(data)));

  await expect(request<typeof data>("/api/tasks")).resolves.toEqual(data);
});

it("throws ApiError with the API message and status for HTTP errors", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json({ message: "Not found" }, { status: 404 }),
      ),
  );

  await expect(request("/api/tasks")).rejects.toMatchObject({
    name: ApiError.name,
    message: "Not found",
    status: 404,
  });
});

it("resolves undefined for a 204 response without parsing JSON", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  );

  await expect(request<void>("/api/tasks")).resolves.toBeUndefined();
});

it("throws ApiError with a readable fallback for an empty 500 response", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response("", { status: 500, statusText: "Internal Server Error" }),
    ),
  );

  await expect(request("/api/tasks")).rejects.toMatchObject({
    name: ApiError.name,
    status: 500,
    message: "Internal Server Error",
  });
});

it("propagates network failures", async () => {
  const error = new TypeError("Failed to fetch");
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));

  await expect(request("/api/tasks")).rejects.toBe(error);
});