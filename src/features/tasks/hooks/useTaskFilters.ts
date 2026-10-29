import { useEffect, useState } from "react";
import type { Priority, Task, TaskStatus } from "../model";
import { useDebouncedValue } from "./useDebouncedValue";

type StatusFilter = TaskStatus | "all";
type PriorityFilter = Priority | "all";

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
} as const;

export function useTaskFilters(tasks: Task[]) {
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortByPriority, setSortByPriority] = useState(false);
  const [sortByDate, setSortByDate] = useState(false);
  const [locationSearch, setLocationSearch] = useState(
    () => window.location.search,
  );
  const searchParams = new URLSearchParams(locationSearch);
  const searchQuery = searchParams.get("search") ?? "";
  const statusFilter = getStatusFilter(searchParams.get("status"));
  const priorityFilter = getPriorityFilter(searchParams.get("priority"));

  useEffect(() => {
    function syncLocationSearch() {
      setLocationSearch(window.location.search);
    }

    window.addEventListener("popstate", syncLocationSearch);
    return () => window.removeEventListener("popstate", syncLocationSearch);
  }, []);

  const debouncedSearchQuery = useDebouncedValue(
    searchQuery.trim().toLocaleLowerCase(),
    300,
  );

  function updateSearchParam(
    name: string,
    value: string | null,
    replace = false,
  ) {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    const query = params.toString();
    const nextSearch = query ? `?${query}` : "";
    if (nextSearch === window.location.search) {
      return;
    }

    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
    if (replace) {
      window.history.replaceState(window.history.state, "", nextUrl);
    } else {
      window.history.pushState(window.history.state, "", nextUrl);
    }
    setLocationSearch(nextSearch);
  }

  function setSearchQuery(value: string) {
    updateSearchParam("search", value || null, true);
  }

  function setStatusFilter(value: StatusFilter) {
    updateSearchParam("status", value === "all" ? null : value);
  }

  function setPriorityFilter(value: PriorityFilter) {
    updateSearchParam("priority", value === "all" ? null : value);
  }

  function getVisibleTasks(tasksToFilter: Task[]) {
    const visibleTasks = tasksToFilter.filter((task) => {
      return showCompleted || task.status !== "done";
    });

    if (sortByDate) {
      visibleTasks.sort(
        (first, second) =>
          Date.parse(second.createdAt) - Date.parse(first.createdAt)
      );
    } else if (sortByPriority) {
      visibleTasks.sort(
        (first, second) =>
          PRIORITY_ORDER[first.priority] - PRIORITY_ORDER[second.priority]
      );
    }

    return visibleTasks;
  }

  return {
    visibleTasks: getVisibleTasks(tasks),
    getVisibleTasks,
    debouncedSearchQuery,
    showCompleted,
    setShowCompleted,
    sortByPriority,
    setSortByPriority,
    sortByDate,
    setSortByDate,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
  };
}

function getStatusFilter(value: string | null): StatusFilter {
  return value === "todo" || value === "in_progress" || value === "done"
    ? value
    : "all";
}

function getPriorityFilter(value: string | null): PriorityFilter {
  return value === "low" || value === "medium" || value === "high"
    ? value
    : "all";
}