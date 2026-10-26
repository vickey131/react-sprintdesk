import { useState, type FormEvent } from "react";
import type { Priority, Task, TaskStatus } from "../model";

export type TaskFormValues = Pick<
  Task,
  "title" | "description" | "priority" | "status"
>;

interface TaskFormProps {
  task?: Task;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
}

const TITLE_ERROR = "Title must be between 3 and 100 characters.";

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<Priority>(
    task?.priority ?? "medium"
  );
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "todo");
  const [titleError, setTitleError] = useState("");
  const isEditing = task !== undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
      setTitleError(TITLE_ERROR);
      return;
    }

    setTitleError("");
    onSubmit({
      title: trimmedTitle,
      description,
      priority,
      status,
    });
  }

  function handleTitleChange(value: string) {
    const nextTitle = value.slice(0, 100);
    setTitle(nextTitle);

    if (titleError && nextTitle.trim().length >= 3) {
      setTitleError("");
    }
  }

  return (
    <form
      aria-label={isEditing ? "Edit task" : "Create task"}
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => handleTitleChange(event.target.value)}
          maxLength={100}
        />
        {titleError && (
          <p id="task-title-error" role="alert">
            {titleError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          name="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="task-status">Status</label>
        <select
          id="task-status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TaskStatus)}
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button type="submit">{isEditing ? "Save changes" : "Create task"}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}