# SprintDesk

SprintDesk is a small React task manager built with React and TypeScript.

Tasks are loaded and managed through the `/api/tasks` endpoint. In development,
the API is provided by MSW with an in-memory set of sample tasks.

## Features

- Create tasks with a title, description, priority, and status
- Mark tasks complete or move them back to to do, and delete tasks
- Search tasks by title or description
- Filter by status or priority with shareable URL search parameters, or hide completed tasks
- Sort by priority or creation date (newest first)
- See completed and per-status task counts
- Cache task queries and refresh task data after updates

## Tech Stack

- React
- TanStack Query
- MSW
- TypeScript
- Vite
- Vitest
- React Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and navigate to the project directory, then run:

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build the application |
| `npm run lint` | Check code for linting issues |
| `npm run typecheck` | Run TypeScript checks |
| `npm run test -- --run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run preview` | Preview the production build locally |

## Project Structure

```text
src/
├── App.css
├── App.test.tsx
├── App.tsx
├── exercises/
│   └── effect-exercises.tsx
├── features/
│   └── tasks/
│       ├── TasksContext.ts
│       ├── TasksContext.test.tsx
│       ├── TasksProvider.tsx
│       ├── index.ts
│       ├── model.ts
│       ├── tasksReducer.ts
│       ├── tasksReducer.test.ts
│       ├── useTasks.ts
│       ├── components/
│       │   ├── BrokenTaskList.tsx
│       │   ├── BrokenTaskList.test.tsx
│       │   ├── Experiments.tsx
│       │   ├── TaskForm.tsx
│       │   └── TaskForm.test.tsx
│       └── hooks/
│           ├── useDebouncedValue.ts
│           ├── useDebouncedValue.test.ts
│           ├── useLocalStorage.ts
│           ├── useTaskFilters.ts
│           └── useTaskFilters.test.ts
├── index.css
├── lib/
│   ├── exercises.ts
│   └── exercises.test.ts
├── main.tsx

docs/
└── state-map.md
public/
```

The structure groups task logic, UI components, reusable hooks, learning exercises, and documentation for the SprintDesk app.

## Learning Goals

This project is a hands-on exercise in:

- React state, rendering, and reconciliation
- TypeScript types, unions, and generics
- Immutable updates and derived state
- Component keys and identity
- Regression testing with Vitest and React Testing Library
- Server-state caching, filtering, retries, and request cancellation
- Git commits and version control
