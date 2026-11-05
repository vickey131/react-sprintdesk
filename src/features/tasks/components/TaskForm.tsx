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
    setValue,
    setError,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",
      status: task?.status ?? "todo",
    },
  });
  const titleField = register("title");

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
        <label htmlFor="task-title">Title</label>
        <input
          {...titleField}
          id="task-title"
          type="text"
          placeholder="Enter task title"
          onChange={(event) => {
            if (event.currentTarget.value.length > 100) {
              event.currentTarget.value = event.currentTarget.value.slice(
                0,
                100,
              );
              setValue("title", event.currentTarget.value, {
                shouldValidate: true,
              });
            } else {
              titleField.onChange(event);
            }
          }}
          maxLength={100}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "task-title-error" : undefined}
        />
        {errors.title?.message && (
          <p id="task-title-error" role="alert" aria-live="assertive">
            {errors.title.message}
          </p>
        )}
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