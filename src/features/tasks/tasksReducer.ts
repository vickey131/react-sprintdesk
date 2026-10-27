import type { Task, TaskStatus } from "./model";

export type TaskUpdates = Partial<
  Pick<Task, "title" | "description" | "priority" | "assigneeId">
>;

export type TasksAction =
  | { type: "add"; task: Task }
  | { type: "update"; id: Task["id"]; updates: TaskUpdates }
  | { type: "delete"; id: Task["id"] }
  | { type: "move-status"; id: Task["id"]; status: TaskStatus }
  | { type: "toggle"; id: Task["id"] };

export function tasksReducer(tasks: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case "add":
      return [...tasks, action.task];
    case "update": {
      if (!tasks.some((task) => task.id === action.id)) return tasks;

      return tasks.map((task) =>
        task.id === action.id ? { ...task, ...action.updates } : task
      );
    }
    case "delete": {
      if (!tasks.some((task) => task.id === action.id)) return tasks;

      return tasks.filter((task) => task.id !== action.id);
    }
    case "move-status": {
      const task = tasks.find((currentTask) => currentTask.id === action.id);
      if (!task || task.status === action.status) return tasks;

      return tasks.map((currentTask) =>
        currentTask.id === action.id
          ? { ...currentTask, status: action.status }
          : currentTask
      );
    }
    case "toggle": {
      const task = tasks.find((currentTask) => currentTask.id === action.id);
      if (!task) return tasks;

      const status = task.status === "done" ? "todo" : "done";
      return tasks.map((currentTask) =>
        currentTask.id === action.id ? { ...currentTask, status } : currentTask
      );
    }
    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
