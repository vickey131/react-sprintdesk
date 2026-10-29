import { Component, type ReactNode } from "react";
import { BrokenTaskList } from "./features/tasks/components/BrokenTaskList";
import {
  TaskForm,
  type TaskFormValues,
} from "./features/tasks/components/TaskForm";
import { useTaskMutations } from "./features/tasks/hooks/useTaskMutations";

export default function App() {
  return (
    <RouteErrorBoundary>
      <TaskManager />
    </RouteErrorBoundary>
  );
}

export class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main>
          <h1>SprintDesk</h1>
          <p role="alert">Something went wrong: {this.state.error.message}</p>
          <button type="button" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

function TaskManager() {
  const { createTaskMutation } = useTaskMutations();

  function createTask(values: TaskFormValues) {
    createTaskMutation.mutate({
      ...values,
      assigneeId: null,
    });
  }

  return (
    <main>
      <h1>SprintDesk</h1>
      <TaskForm
        onSubmit={createTask}
        isSubmitting={createTaskMutation.isPending}
      />
      {createTaskMutation.isError && (
        <>
          <p role="alert">{createTaskMutation.error.message}</p>
          {createTaskMutation.variables && (
            <button
              type="button"
              onClick={() =>
                createTaskMutation.mutate(createTaskMutation.variables)
              }
            >
              Retry submission
            </button>
          )}
        </>
      )}
      <BrokenTaskList />
    </main>
  );
}