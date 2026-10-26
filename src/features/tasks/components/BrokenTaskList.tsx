
import { useState } from "react";
import { useTasks } from "..";

const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
} as const;

export function BrokenTaskList() {
  const { tasks, dispatch } = useTasks();
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortByPriority, setSortByPriority] = useState(false);

  const visibleTasks = (showCompleted
    ? tasks
    : tasks.filter((task) => task.status !== "done")
  ).slice();

  if (sortByPriority) {
    visibleTasks.sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );
  }

  const completedCount = tasks.filter((task) => task.status === "done").length;

  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">Tasks</h2>

      <p>
        {completedCount} of {tasks.length} completed
      </p>

      <label>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(event) => setShowCompleted(event.target.checked)}
        />
        Show completed
      </label>

      <button
        type="button"
        onClick={() => setSortByPriority((current) => !current)}
      >
        {sortByPriority ? "Clear priority sort" : "Sort by priority"}
      </button>

      <ul>
        {visibleTasks.map((task) => (
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
        ))}
      </ul>
    </section>
  );
}
