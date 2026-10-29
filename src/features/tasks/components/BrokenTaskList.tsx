
import { useTaskMutations } from "../hooks/useTaskMutations";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { useTasksQuery } from "../hooks/useTasksQuery";

export function BrokenTaskList() {
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
  const tasks = tasksQuery.data ?? [];
  const allTasks = allTasksQuery.data ?? [];
  const visibleTasks = getVisibleTasks(tasks);
  const {
    updateTaskMutation,
    deleteTaskMutation,
  } = useTaskMutations();

  const completedCount = allTasks.filter(
    (task) => task.status === "done",
  ).length;
  const statusCounts = {
    todo: allTasks.filter((task) => task.status === "todo").length,
    inProgress: allTasks.filter((task) => task.status === "in_progress").length,
    done: completedCount,
  };

  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">Tasks</h2>

      <p>
        {completedCount} of {allTasks.length} completed
      </p>

      <p>
        To do: {statusCounts.todo} | In progress: {statusCounts.inProgress} |
        Done: {statusCounts.done}
      </p>

      <label>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(event) => setShowCompleted(event.target.checked)}
        />
        Show completed
      </label>

      <label>
        Search tasks
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </label>

      <label>
        Filter by status
        <select
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
      </label>

      <label>
        Filter by priority
        <select
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
      </label>

      <button
        type="button"
        onClick={() => setSortByPriority((current) => !current)}
      >
        {sortByPriority ? "Clear priority sort" : "Sort by priority"}
      </button>

      <button
        type="button"
        onClick={() => setSortByDate((current) => !current)}
      >
        {sortByDate ? "Clear date sort" : "Sort by date"}
      </button>

      <ul>
        {tasksQuery.isPending ? (
          <li role="status">Loading tasks...</li>
        ) : tasksQuery.isError ? (
          <li>
            <p role="alert">Unable to load tasks: {tasksQuery.error.message}</p>
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
            <li key={task.id}>
              <input
                type="checkbox"
                aria-label={`Complete ${task.title}`}
                checked={task.status === "done"}
                onChange={() =>
                  updateTaskMutation.mutate({
                    id: task.id,
                    status: task.status === "done" ? "todo" : "done",
                  })
                }
              />

              <span>{task.title}</span>{" "}
              <small>({task.priority})</small>
              <small> - {task.status.replace("_", " ")}</small>

              <button
                type="button"
                onClick={() => deleteTaskMutation.mutate(task.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      {(updateTaskMutation.isError || deleteTaskMutation.isError) && (
        <p role="alert">
          {(updateTaskMutation.error ?? deleteTaskMutation.error)?.message}
        </p>
      )}
    </section>
  );
}
