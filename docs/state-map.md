# SprintDesk state map

| State | Owner | Derived? |
|---|---|---|
| Tasks and their fields (`id`, `title`, `description`, `status`, `priority`, `assigneeId`, `createdAt`, `updatedAt`) | `TasksProvider` reducer; saved to local storage by `useLocalStorage`; tasks are created in `App` | No |
| Form fields (`title`, `description`, `priority`, `status`) and title validation error | `TaskForm` | No |
| Show-completed toggle, search text, status and priority filters, and sort toggles | `useTaskFilters` in `BrokenTaskList` | No |
| Debounced search text | `useDebouncedValue` in `useTaskFilters` | Yes; derived from search text after 300 ms |
| Visible tasks | `useTaskFilters` | Yes; filtered and sorted from tasks and list controls |
| Completed and per-status task counts | `BrokenTaskList` | Yes; calculated from tasks |

Tasks are loaded from local storage and saved when they change. They start empty when no saved tasks are present.