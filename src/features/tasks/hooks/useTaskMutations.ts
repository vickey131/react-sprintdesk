import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { Task } from "../model";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../../../shared/api/tasks";
import { taskQueryKeys } from "../../../shared/api/taskQueryKeys";

export function useTaskMutations() {
  const queryClient = useQueryClient();
  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSettled: invalidateTasks,
  });
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: Task["id"]; status: Task["status"] }) =>
      updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.all });
      const previousTasks = queryClient.getQueriesData<Task[]>({
        queryKey: taskQueryKeys.all,
      });

      queryClient.setQueriesData<Task[]>(
        { queryKey: taskQueryKeys.all },
        (tasks) =>
          tasks?.map((task) => (task.id === id ? { ...task, status } : task)),
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
    onSettled: invalidateTasks,
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
}
