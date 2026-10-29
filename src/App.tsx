import { BrokenTaskList } from "./features/tasks/components/BrokenTaskList";
import {
  TaskForm,
  type TaskFormValues,
} from "./features/tasks/components/TaskForm";
import { useTaskMutations } from "./features/tasks/hooks/useTaskMutations";

export default function App() {
  return <TaskManager />;
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
      <TaskForm onSubmit={createTask} />
      {createTaskMutation.isError && (
        <p role="alert">{createTaskMutation.error.message}</p>
      )}
      <BrokenTaskList />
    </main>
  );
}