import { BrokenTaskList } from "./features/tasks/components/BrokenTaskList";
import {
  TaskForm,
  type TaskFormValues,
} from "./features/tasks/components/TaskForm";
import { TasksProvider, useTasks } from "./features/tasks";

export default function App() {
  return (
    <TasksProvider>
      <TaskManager />
    </TasksProvider>
  );
}

function TaskManager() {
  const { dispatch } = useTasks();

  function createTask(values: TaskFormValues) {
    const now = new Date().toISOString();
    dispatch({
      type: "add",
      task: {
        ...values,
        id: crypto.randomUUID(),
        assigneeId: null,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  return (
    <main>
      <h1>SprintDesk</h1>
      <TaskForm onSubmit={createTask} />
      <BrokenTaskList />
    </main>
  );
}