# SprintDesk state map

| State | Owner | Derived? |
|---|---|---|
| Tasks and their fields (`id`, `title`, `description`, `status`, `priority`, `assigneeId`, `createdAt`, `updatedAt`) | `/api/tasks` via TanStack Query; mutations invalidate task queries | No |
| Form fields (`title`, `description`, `priority`, `status`) and title validation error | `TaskForm` | No |
| Search text, status filter, and priority filter | URL search parameters, read and updated by `useTaskFilters` | No |
| Show-completed toggle and sort toggles | `useTaskFilters` in `BrokenTaskList` | No |
| Debounced search text | `useDebouncedValue` in `useTaskFilters` | Yes; derived from URL search text after 300 ms |
| Visible tasks | API query for search/status/priority; `useTaskFilters` for show-completed and sorting | Yes |
| Completed and per-status task counts | `BrokenTaskList` | Yes; calculated from tasks |

Tasks are fetched from the API and cached by TanStack Query. Search, status, and priority filters are reflected in the URL; display-only controls remain local to the list.