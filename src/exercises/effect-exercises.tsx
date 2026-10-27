import { useEffect, useState } from "react";

export function ConnectionStatus() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return <p role="status">{online ? "Online" : "Offline"}</p>;
}

export function FocusTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;

    const id = window.setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div>
      <p>{seconds}s focused</p>
      <button
        type="button"
        onClick={() => setRunning((current) => !current)}
      >
        {running ? "Stop" : "Start"}
      </button>
    </div>
  );
}

interface TaskSummary {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
}

export function TaskQuickFind({
  tasks,
}: {
  tasks: TaskSummary[];
}) {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();

  const matches = tasks.filter((task) =>
    task.title.toLowerCase().includes(normalizedQuery)
  );

  return (
    <div>
      <label htmlFor="quick-find">Find a task</label>
      <input
        id="quick-find"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <p>{matches.length} matching</p>

      <ul>
        {matches.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
