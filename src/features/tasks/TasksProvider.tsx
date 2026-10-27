import { useEffect, useReducer, type ReactNode } from "react";
import { TasksContext, TasksDispatchContext } from "./TasksContext";
import type { Task } from "./model";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { tasksReducer } from "./tasksReducer";

const TASKS_STORAGE_KEY = "sprintdesk-tasks";
const EMPTY_TASKS: Task[] = [];

interface TasksProviderProps {
  children: ReactNode;
}

export function TasksProvider({ children }: TasksProviderProps) {
  const [storedTasks, setStoredTasks] = useLocalStorage(
    TASKS_STORAGE_KEY,
    EMPTY_TASKS
  );
  const [tasks, dispatch] = useReducer(tasksReducer, storedTasks);

  useEffect(() => {
    setStoredTasks(tasks);
  }, [setStoredTasks, tasks]);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
