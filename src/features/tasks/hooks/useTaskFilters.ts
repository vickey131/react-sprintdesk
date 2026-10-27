import { useState } from "react";
import type { Priority, Task, TaskStatus } from "../model";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const visibleTasks = tasks.filter((task) => {
    const matchesSearch =
      normalizedQuery.length === 0 ||
      task.title.toLocaleLowerCase().includes(normalizedQuery) ||
      task.description.toLocaleLowerCase().includes(normalizedQuery);

    return (
      matchesSearch &&
      (showCompleted || task.status !== "done") &&
      (statusFilter === "all" || task.status === statusFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
    );
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

  return {
    visibleTasks,
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