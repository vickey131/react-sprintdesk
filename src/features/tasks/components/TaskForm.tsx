import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  TaskFormSchema,
  type Task,
  type TaskFormValues,
} from "../model/model";
import { ApiError } from "../../../shared/lib/http";

export type { TaskFormValues } from "../model/model";

interface TaskFormProps {
  task?: Task;
  onSubmit: (
    values: TaskFormValues,
    onError: (error: unknown) => void,
  ) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

function isTaskFormField(field: string): field is keyof TaskFormValues {
  return Object.prototype.hasOwnProperty.call(TaskFormSchema.shape, field);
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const isEditing = task !== undefined;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      dueDate: task?.dueDate ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",
      status: task?.status ?? "todo",
    },
  });

  return (
    <form
      aria-label={isEditing ? "Edit task" : "Create task"}
      onSubmit={handleSubmit((values) => {
        if (!isSubmitting) {
          onSubmit(values, (error) => {
            if (
              error instanceof ApiError &&
              error.status === 400 &&
              Object.keys(error.fieldErrors).length > 0
            ) {
              for (const [field, message] of Object.entries(
                error.fieldErrors,
              )) {
                if (isTaskFormField(field)) {
                  setError(field, { type: "server", message });
                }
              }
            }
          });
        }
      })}
      noValidate
    >
      <div>
        <label htmlFor="task-title">Task title (required)</label>
        <input
          {...register("title")}
          id="task-title"
          type="text"
          placeholder="Enter task title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={
            errors.title
              ? "task-title-hint task-title-error"
              : "task-title-hint"
          }
        />
        <p id="task-title-hint">3–100 characters</p>
        {errors.title?.message && (
          <p id="task-title-error" role="alert" aria-live="assertive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="task-due-date">Due date</label>
        <input
          {...register("dueDate")}
          id="task-due-date"
          type="date"
        />
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          {...register("description")}
          id="task-description"
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "task-description-error" : undefined
          }
        />
        {errors.description?.message && (
          <p id="task-description-error" role="alert" aria-live="assertive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          {...register("priority")}
          id="task-priority"
          aria-invalid={Boolean(errors.priority)}
          aria-describedby={errors.priority ? "task-priority-error" : undefined}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        {errors.priority?.message && (
          <p id="task-priority-error" role="alert" aria-live="assertive">
            {errors.priority.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="task-status">Status</label>
        <select
          {...register("status")}
          id="task-status"
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? "task-status-error" : undefined}
        >
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
        {errors.status?.message && (
          <p id="task-status-error" role="alert" aria-live="assertive">
            {errors.status.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? "Saving..."
          : isEditing
            ? "Save changes"
            : "Create task"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          {isEditing ? "Discard changes" : "Cancel"}
        </button>
      )}
    </form>
  );
}