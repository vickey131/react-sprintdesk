import { memo } from "react";
import type { ReactNode } from "react";
import type { Task, TaskStatus } from "../model/model";

type TaskItemProps = {
  task: Task;
  disabled: boolean;
  onToggle: (id: Task["id"], nextStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: Task["id"]) => void;
  children?: ReactNode;
};

function TaskItemComponent({
  task,
  disabled,
  onToggle,
  onEdit,
  onDelete,
  children,
}: TaskItemProps) {
  return (
    <li>
      <input
        type="checkbox"
        aria-label={`Complete ${task.title}`}
        checked={task.status === "done"}
        disabled={disabled}
        onChange={() =>
          onToggle(task.id, task.status === "done" ? "todo" : "done")
        }
      />

      <span>{task.title}</span>{" "}
      <small>({task.priority})</small>
      <small> - {task.status.replace("_", " ")}</small>

      {!disabled && (
        <>
          <button type="button" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button type="button" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </>
      )}
      {children}
    </li>
  );
}

export const TaskItem = memo(TaskItemComponent);
