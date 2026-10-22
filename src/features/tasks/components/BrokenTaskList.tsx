
import { useState, type FormEvent } from "react";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
}

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

interface BrokenTaskListProps {
  initialTasks: Task[];
}

export function BrokenTaskList({ initialTasks }: BrokenTaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(() => [...initialTasks]);
  const [title, setTitle] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  // Derive values from the current task state instead of duplicating state.
  const visibleTasks = showCompleted
    ? tasks
    : tasks.filter((task) => !task.done);

  const completedCount = tasks.filter((task) => task.done).length;

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      done: false,
      priority: "medium",
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setTitle("");
  }

  function toggleTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function deleteTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  }

  function sortByPriority() {
    setTasks((currentTasks) =>
      [...currentTasks].sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      )
    );
  }

  return (
    <section aria-labelledby="tasks-heading">
      <h2 id="tasks-heading">Tasks</h2>

      <p>
        {completedCount} of {tasks.length} completed
      </p>

      <form onSubmit={addTask}>
        <label htmlFor="new-task">New task</label>
        <input
          id="new-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <label>
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={(event) => setShowCompleted(event.target.checked)}
        />
        Show completed
      </label>

      <button type="button" onClick={sortByPriority}>
        Sort by priority
      </button>

      <ul>
        {visibleTasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              aria-label={`Complete ${task.title}`}
              checked={task.done}
              onChange={() => toggleTask(task.id)}
            />

            <span>{task.title}</span>{" "}
            <small>({task.priority})</small>

            <input
              aria-label={`Notes for ${task.title}`}
              placeholder="Notes"
            />

            <button type="button" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
