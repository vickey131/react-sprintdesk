# SprintDesk

SprintDesk is a small React task manager built to practise React, TypeScript, state management, and frontend testing.

Tasks are stored in memory, so changes reset when the page is reloaded.

## Features

- Display and manage tasks
- Search tasks by title or description
- Filter tasks by status
- Filter tasks by priority
- Sort tasks by priority or creation date (newest first)
- Practise immutable state updates and derived state
- Explore React rendering behaviour and component identity
- Write unit and regression tests

## Tech Stack

- React
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
│           ├── useLocalStorage.test.ts
│           ├── useTaskFilters.ts
│           └── useTaskFilters.test.ts
├── index.css
├── lib/
│   ├── exercises.ts
│   └── exercises.test.ts
├── main.tsx

docs/
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
- Git commits and version control
