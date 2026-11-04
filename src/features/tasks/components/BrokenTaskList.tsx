
import { useCallback, useMemo, useState } from "react";
import { useTaskMutations } from "../hooks/useTaskMutations";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { useTasksQuery } from "../hooks/useTasksQuery";
import { sampleTasks } from "../sampleTasks";
import { TaskItem } from "./TaskItem";

export function BrokenTaskList() {
  const [showSampleTasks, setShowSampleTasks] = useState(false);
  const {
    getVisibleTasks,
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
    debouncedSearchQuery,
  } = useTaskFilters([]);
  const allTasksQuery = useTasksQuery();
  const tasksQuery = useTasksQuery({
    search: debouncedSearchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
  });
  const allTasks = useMemo(
    () => (showSampleTasks ? sampleTasks : allTasksQuery.data ?? []),
    [showSampleTasks, allTasksQuery.data],
  );
  const tasks = useMemo(
    () =>
      showSampleTasks
        ? sampleTasks.filter((task) => {
            const matchesSearch =
              !debouncedSearchQuery ||
              task.title.toLocaleLowerCase().includes(debouncedSearchQuery) ||
              task.description
                .toLocaleLowerCase()
                .includes(debouncedSearchQuery);
            return (
              matchesSearch &&
              (statusFilter === "all" || task.status === statusFilter) &&
              (priorityFilter === "all" || task.priority === priorityFilter)
            );
          })
        : tasksQuery.data ?? [],
    [showSampleTasks, debouncedSearchQuery, statusFilter, priorityFilter, tasksQuery.data],
  );
  // getVisibleTasks's result depends only on `tasks` plus these three flags,
  // not on its own (unstable) identity, which changes every render.
  const visibleTasks = useMemo(
    () => getVisibleTasks(tasks),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, showCompleted, sortByDate, sortByPriority],
  );
  const {
    updateTaskMutation,
    deleteTaskMutation,
  } = useTaskMutations();

  // `.mutate` is the stable reference we actually need; the enclosing
  // mutation object is recreated every render and would defeat memoization.
  const handleToggleTask = useCallback(
    (id: string, nextStatus: "todo" | "in_progress" | "done") =>
      updateTaskMutation.mutate({ id, status: nextStatus }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateTaskMutation.mutate],
  );
  const handleDeleteTask = useCallback(
    (id: string) => deleteTaskMutation.mutate(id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteTaskMutation.mutate],
  );

  const statusCounts = useMemo(
    () =>
      allTasks.reduce(
        (counts, task) => {
          if (task.status === "todo") counts.todo += 1;
          else if (task.status === "in_progress") counts.inProgress += 1;
          else counts.done += 1;
          return counts;
        },
        { todo: 0, inProgress: 0, done: 0 },
      ),
    [allTasks],
  );
  const completedCount = statusCounts.done;

  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">Tasks</h2>

      <p role="status" aria-live="polite">
        {completedCount} of {allTasks.length} completed
      </p>

      <p aria-live="polite">
        To do: {statusCounts.todo} | In progress: {statusCounts.inProgress} |
        Done: {statusCounts.done}
      </p>

      <fieldset>
        <legend>Filter tasks</legend>
        <label htmlFor="show-completed">
          <input
            id="show-completed"
            type="checkbox"
            checked={showCompleted}
            onChange={(event) => setShowCompleted(event.target.checked)}
          />
          Show completed
        </label>

        <label htmlFor="show-500-tasks">
          <input
            id="show-500-tasks"
            type="checkbox"
            checked={showSampleTasks}
            onChange={(event) => setShowSampleTasks(event.target.checked)}
          />
          Show 500 tasks
        </label>

        <label htmlFor="task-search">Search tasks</label>
        <input
          id="task-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <label htmlFor="task-status-filter">Filter by status</label>
        <select
          id="task-status-filter"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as typeof statusFilter)
          }
        >
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <label htmlFor="task-priority-filter">Filter by priority</label>
        <select
          id="task-priority-filter"
          value={priorityFilter}
          onChange={(event) =>
            setPriorityFilter(event.target.value as typeof priorityFilter)
          }
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </fieldset>

      <fieldset>
        <legend>Sort tasks</legend>
        <button
          type="button"
          aria-pressed={sortByPriority}
          onClick={() => setSortByPriority((current) => !current)}
        >
          {sortByPriority ? "Clear priority sort" : "Sort by priority"}
        </button>

        <button
          type="button"
          aria-pressed={sortByDate}
          onClick={() => setSortByDate((current) => !current)}
        >
          {sortByDate ? "Clear date sort" : "Sort by date"}
        </button>
      </fieldset>

      <ul>
        {!showSampleTasks && tasksQuery.isPending ? (
          <li role="status">Loading tasks...</li>
        ) : !showSampleTasks && tasksQuery.isError ? (
          <li>
            <p role="alert" aria-live="assertive">
              Unable to load tasks: {tasksQuery.error.message}
            </p>
            <button type="button" onClick={() => void tasksQuery.refetch()}>
              Retry
            </button>
          </li>
        ) : allTasks.length === 0 ? (
          <li>No tasks yet.</li>
        ) : visibleTasks.length === 0 ? (
          <li>No tasks match your filters.</li>
        ) : (
          visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              disabled={showSampleTasks}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </ul>
      {(updateTaskMutation.isError || deleteTaskMutation.isError) && (
        <p role="alert" aria-live="assertive">
          {(updateTaskMutation.error ?? deleteTaskMutation.error)?.message}
        </p>
      )}
    </section>
  );
}
