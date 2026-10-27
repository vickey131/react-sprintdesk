import { useContext } from "react";
import { TasksContext, TasksDispatchContext } from "./TasksContext";

export function useTasks() {
  const tasks = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);

  if (tasks === null || dispatch === null) {
    throw new Error("useTasks must be used within a TasksProvider.");
  }

  return { tasks, dispatch };
}
