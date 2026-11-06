import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Task } from "../model/model";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../api/tasks";
import { taskQueryKeys } from "../api/taskQueryKeys";

export function useTaskMutations() {
  const queryClient = useQueryClient();
  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSettled: invalidateTasks,
  });
  const updateTaskMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: Task["id"];
      updates: Partial<
        Pick<Task, "title" | "description" | "status" | "priority" | "dueDate">
      >;
    }) => updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.all });
      const previousTasks = queryClient.getQueriesData<Task[]>({
        queryKey: taskQueryKeys.all,
      });

      queryClient.setQueriesData<Task[]>(
        { queryKey: taskQueryKeys.all },
        (tasks) =>
          tasks?.map((task) => (task.id === id ? { ...task, ...updates } : task)),
      );

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      context?.previousTasks.forEach(([queryKey, tasks]) => {
        queryClient.setQueryData(queryKey, tasks);
      });
    },
    onSettled: invalidateTasks,
  });
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async (_result, id) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.all });
      queryClient.setQueriesData<Task[]>(
        { queryKey: taskQueryKeys.all },
        (tasks) => tasks?.filter((task) => task.id !== id),
      );
    },
    onSettled: invalidateTasks,
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
}
