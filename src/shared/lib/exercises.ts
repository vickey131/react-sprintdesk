
export type Employee = {
  id: number | string;
  name: string;
  department: string;
  active: boolean;
};

// 1. Find an employee by ID.
export function findEmployee(
  employees: Employee[],
  id: number | string
): Employee | undefined {
  return employees.find((employee) => employee.id === id);
}

// 2. Get employee names using destructuring.
export function getNames(employees: Employee[]): string[] {
  return employees.map(({ name }) => name);
}

// 3. Filter employees by department.
export function filterByDepartment(
  employees: Employee[],
  department: string
): Employee[] {
  return employees.filter(
    (employee) => employee.department === department
  );
}

// 4. Update an employee without changing the original object.
export function updateEmployee(
  employee: Employee,
  updates: Partial<Employee>
): Employee {
  return { ...employee, ...updates };
}

// 5. Group items using a callback.
export function groupBy<T>(
  items: T[],
  getKey: (item: T) => string
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};

  for (const item of items) {
    const key = getKey(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
  }

  return groups;
}

// 6. Count employees in each department using reduce.
export function countByDepartment(
  employees: Employee[]
): Record<string, number> {
  return employees.reduce<Record<string, number>>((counts, employee) => {
    counts[employee.department] = (counts[employee.department] ?? 0) + 1;
    return counts;
  }, {});
}

// 7. Get a nested name using optional chaining and nullish coalescing.
export function getDisplayName(
  employee?: { profile?: { name?: string } }
): string {
  return employee?.profile?.name ?? "Unknown employee";
}

// 8. Pick selected nested properties using dot-separated paths.
export function deepPick(
  item: object,
  paths: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => {
      if (current !== null && typeof current === "object") {
        return (current as Record<string, unknown>)[key];
      }

      return undefined;
    }, item);

    if (value !== undefined) {
      result[path] = value;
    }
  }

  return result;
}

// 9. Add any number of values using rest parameters.
export function sumNumbers(...numbers: number[]): number {
  return numbers.reduce((total, number) => total + number, 0);
}

// 10. Create a counter that remembers its value using a closure.
export function createCounter(start = 0): () => number {
  let count = start;

  return () => {
    count += 1;
    return count;
  };
}

// 11. Debounce function.
export function debounce(
  callback: () => void,
  delay: number
): () => void {
  let timer: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(timer);
    timer = setTimeout(callback, delay);
  };
}

// 12. Return a fallback value if any error occured.
export async function fetchWithFallback<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}
