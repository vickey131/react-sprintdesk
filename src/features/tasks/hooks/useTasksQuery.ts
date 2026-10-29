import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../../shared/api/tasks";
import {
  taskQueryKeys,
  type TaskFilters,
} from "../../../shared/api/taskQueryKeys";

export function useTasksQuery(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskQueryKeys.list(filters),
    queryFn: ({ signal }) => getTasks(filters, signal),
  });
}
