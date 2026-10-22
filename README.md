# SprintDesk

SprintDesk is a small React task manager built to practise React, TypeScript, state management, and frontend testing.

Tasks are stored in memory, so changes reset when the page is reloaded.

## Features

- Display and manage tasks
- Filter tasks by status
- Sort tasks by priority
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
├── features/
│   ├── tasks/
│   │   ├── components/
│   │   └── model.ts
│   └── rendering/
└── lib/
docs/
```

The structure groups task-related functionality, reusable utilities, and learning documentation.

## Learning Goals

This project is a hands-on exercise in:

- React state, rendering, and reconciliation
- TypeScript types, unions, and generics
- Immutable updates and derived state
- Component keys and identity
- Regression testing with Vitest and React Testing Library
- Git commits and version control

