import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  window.localStorage.clear();
});

describe("useLocalStorage", () => {
  it("returns the fallback when there is no stored value", () => {
    const { result } = renderHook(() =>
      useLocalStorage("settings", { theme: "light" })
    );

    expect(result.current[0]).toEqual({ theme: "light" });
  });

  it("loads a stored value", () => {
    window.localStorage.setItem("count", JSON.stringify(3));

    const { result } = renderHook(() => useLocalStorage("count", 0));

    expect(result.current[0]).toBe(3);
  });

  it("loads the value for a new key when the key changes", () => {
    window.localStorage.setItem("first", JSON.stringify("first value"));
    window.localStorage.setItem("second", JSON.stringify("second value"));

    const { result, rerender } = renderHook(
      ({ key }: { key: string }) => useLocalStorage(key, "fallback"),
      { initialProps: { key: "first" } }
    );

    rerender({ key: "second" });

    expect(result.current[0]).toBe("second value");
  });

  it("falls back and replaces invalid stored JSON", () => {
    window.localStorage.setItem("settings", "{invalid");

    const { result } = renderHook(() =>
      useLocalStorage("settings", { theme: "light" })
    );

    expect(result.current[0]).toEqual({ theme: "light" });
    expect(window.localStorage.getItem("settings")).toBe(
      JSON.stringify({ theme: "light" })
    );
  });

  it("persists direct and functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("count", 1));

    act(() => {
      result.current[1](2);
    });
    expect(window.localStorage.getItem("count")).toBe("2");

    act(() => {
      result.current[1]((current) => current + 1);
    });
    expect(result.current[0]).toBe(3);
    expect(window.localStorage.getItem("count")).toBe("3");
  });
});