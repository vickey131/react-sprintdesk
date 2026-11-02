import { TaskSchema } from "./model";

const statuses = ["todo", "in_progress", "done"] as const;
const priorities = ["high", "medium", "low"] as const;
const startDate = Date.parse("2026-01-01T00:00:00.000Z");

export const sampleTasks = TaskSchema.array().parse(
  Array.from({ length: 500 }, (_, index) => {
    const timestamp = new Date(startDate + index * 60 * 60 * 1000).toISOString();
    const statusPosition = index % 10;

    return {
      id: `sample-task-${String(index + 1).padStart(3, "0")}`,
      title: `Sample task ${String(index + 1).padStart(3, "0")}`,
      description: `Generated task ${index + 1} for the SprintDesk sample dataset.`,
      status:
        statusPosition < 5
          ? statuses[0]
          : statusPosition < 8
            ? statuses[1]
            : statuses[2],
      priority: priorities[index % priorities.length],
      assigneeId: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }),
);
