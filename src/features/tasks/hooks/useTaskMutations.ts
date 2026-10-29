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
    onSuccess: invalidateTasks,
  });
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: Task["id"]; status: Task["status"] }) =>
      updateTask(id, { status }),
    onSuccess: invalidateTasks,
  });
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidateTasks,
  });

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
}
