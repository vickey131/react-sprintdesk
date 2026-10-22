
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  findEmployee,
  getNames,
  filterByDepartment,
  updateEmployee,
  groupBy,
  countByDepartment,
  getDisplayName,
  deepPick,
  sumNumbers,
  createCounter,
  debounce,
  fetchWithFallback,
} from "./exercises";

import type { Employee } from "./exercises";

const employees: Employee[] = [
  { id: 1, name: "Vignesh", department: "Engineering", active: true },
  { id: 2, name: "Priya", department: "HR", active: false },
  { id: 3, name: "Arun", department: "Engineering", active: true },
];

afterEach(() => {
  vi.useRealTimers();
});

// 1. Find an employee.
describe("findEmployee", () => {
  it("returns the employee with the matching ID", () => {
    expect(findEmployee(employees, 2)?.name).toBe("Priya");
  });

  it("returns undefined when no employee matches", () => {
    expect(findEmployee(employees, 99)).toBeUndefined();
  });
});

// 2. Get names.
describe("getNames", () => {
  it("returns employee names", () => {
    expect(getNames(employees)).toEqual(["Vignesh", "Priya", "Arun"]);
  });

  it("returns an empty array for an empty list", () => {
    expect(getNames([])).toEqual([]);
  });
});

// 3. Filter by department.
describe("filterByDepartment", () => {
  it("returns employees from the selected department", () => {
    expect(
      filterByDepartment(employees, "Engineering").map(({ name }) => name)
    ).toEqual(["Vignesh", "Arun"]);
  });

  it("returns an empty array for an unknown department", () => {
    expect(filterByDepartment(employees, "Finance")).toEqual([]);
  });
});

// 4. Update an employee immutably.
describe("updateEmployee", () => {
  it("returns an employee with the updated values", () => {
    const result = updateEmployee(employees[0], { active: false });

    expect(result.active).toBe(false);
    expect(result.name).toBe("Vignesh");
  });

  it("does not change the original employee", () => {
    const original = employees[0];
    const result = updateEmployee(original, { name: "Vicky" });

    expect(result).not.toBe(original);
    expect(original.name).toBe("Vignesh");
  });
});

// 5. Group items using a callback.
describe("groupBy", () => {
  it("groups employees by department", () => {
    const result = groupBy(employees, (employee) => employee.department);

    expect(result.Engineering.map(({ name }) => name)).toEqual([
      "Vignesh",
      "Arun",
    ]);
    expect(result.HR.map(({ name }) => name)).toEqual(["Priya"]);
  });

  it("works with other kinds of data", () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const result = groupBy(numbers, (number) =>
      number % 2 === 0 ? "even" : "odd"
    );

    expect(result.even).toEqual([2, 4, 6]);
    expect(result.odd).toEqual([1, 3, 5]);
  });

  it("returns an empty object for an empty list", () => {
    expect(groupBy([], () => "group")).toEqual({});
  });
});

// 6. Count employees by department.
describe("countByDepartment", () => {
  it("returns the number of employees in each department", () => {
    expect(countByDepartment(employees)).toEqual({
      Engineering: 2,
      HR: 1,
    });
  });

  it("returns an empty object for an empty list", () => {
    expect(countByDepartment([])).toEqual({});
  });
});

// 7. Get a display name safely.
describe("getDisplayName", () => {
  it("returns the employee name", () => {
    expect(getDisplayName({ profile: { name: "Vignesh" } })).toBe("Vignesh");
  });

  it("handles missing nested properties", () => {
    expect(getDisplayName({})).toBe("Unknown employee");
    expect(getDisplayName({ profile: {} })).toBe("Unknown employee");
    expect(getDisplayName()).toBe("Unknown employee");
  });

  it("preserves an empty string", () => {
    expect(getDisplayName({ profile: { name: "" } })).toBe("");
  });
});

// 8. Pick nested properties.
describe("deepPick", () => {
  const user = {
    name: "Vignesh",
    profile: {
      city: "Chennai",
      role: "Frontend Engineer",
    },
  };

  it("returns the requested properties", () => {
    expect(deepPick(user, ["name", "profile.city"])).toEqual({
      name: "Vignesh",
      "profile.city": "Chennai",
    });
  });

  it("ignores paths that do not exist", () => {
    expect(deepPick(user, ["profile.country"])).toEqual({});
  });

  it("returns an empty object when no paths are requested", () => {
    expect(deepPick(user, [])).toEqual({});
  });
});

// 9. Sum numbers using rest parameters.
describe("sumNumbers", () => {
  it("adds multiple numbers", () => {
    expect(sumNumbers(10, 20, 30)).toBe(60);
  });

  it("returns zero when no numbers are provided", () => {
    expect(sumNumbers()).toBe(0);
  });
});

// 10. Create a counter using a closure.
describe("createCounter", () => {
  it("remembers its value between calls", () => {
    const counter = createCounter();

    expect(counter()).toBe(1);
    expect(counter()).toBe(2);
    expect(counter()).toBe(3);
  });

  it("can start from a custom value", () => {
    const counter = createCounter(5);

    expect(counter()).toBe(6);
    expect(counter()).toBe(7);
  });

  it("creates independent counters", () => {
    const first = createCounter();
    const second = createCounter();

    first();
    first();

    expect(second()).toBe(1);
  });
});

// 11. Debounce a function.
describe("debounce", () => {
  it("waits until the delay has passed", () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced();

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("runs only once when called repeatedly within the delay", () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const debounced = debounce(callback, 300);

    debounced();
    vi.advanceTimersByTime(100);

    debounced();
    vi.advanceTimersByTime(100);

    debounced();
    vi.advanceTimersByTime(299);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// 12. Handle asynchronous success and failure.
describe("fetchWithFallback", () => {
  it("returns the result when the promise succeeds", async () => {
    const fetcher = vi.fn().mockResolvedValue("Success");

    await expect(fetchWithFallback(fetcher, "Fallback")).resolves.toBe(
      "Success"
    );
  });

  it("returns the fallback when the promise rejects", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Request failed"));

    await expect(fetchWithFallback(fetcher, "Fallback")).resolves.toBe(
      "Fallback"
    );
  });
});
