import { createContext, type Dispatch } from "react";
import type { Task } from "./model";
import type { TasksAction } from "./tasksReducer";

export const TasksContext = createContext<Task[] | null>(null);
export const TasksDispatchContext =
  createContext<Dispatch<TasksAction> | null>(null);
