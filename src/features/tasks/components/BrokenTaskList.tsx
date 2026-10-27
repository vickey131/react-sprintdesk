
import { useTasks } from "..";
import { useTaskFilters } from "../hooks/useTaskFilters";

export function BrokenTaskList() {
  const { tasks, dispatch } = useTasks();
  const {
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
  } = useTaskFilters(tasks);

  const completedCount = tasks.filter((task) => task.status === "done").length;
  const statusCounts = {
    todo: tasks.filter((task) => task.status === "todo").length,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    done: completedCount,
  };

  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">Tasks</h2>

      <p>
        {completedCount} of {tasks.length} completed
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
        {tasks.length === 0 ? (
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
                onChange={() => dispatch({ type: "toggle", id: task.id })}
              />

              <span>{task.title}</span>{" "}
              <small>({task.priority})</small>
              <small> - {task.status.replace("_", " ")}</small>

              <button
                type="button"
                onClick={() => dispatch({ type: "delete", id: task.id })}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
