
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { server } from "../shared/mocks/server";
import { resetTasks } from "../shared/mocks/handlers";

beforeAll(() => {
  server.listen();
  console.log("MSW server started");
});

beforeEach(() => {
  resetTasks();
});

afterEach(() => {
  server.resetHandlers();
  resetTasks();
});

afterAll(() => {
  server.close();
});
