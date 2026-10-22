
export type TaskStatus = "todo" | "in_progress" | "done";

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NewTaskInput = Pick<
  Task,
  "title" | "description" | "priority" | "assigneeId"
>;
