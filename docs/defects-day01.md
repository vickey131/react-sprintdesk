## React Defect Refactoring

## 1. State Mutation

**Symptom:** Adding a task changed the original task array instead of creating a new array.

**Root cause:** Used tasks.push() and passed the same array back to setTasks().  State updates should be immutable.

**Fix:** Now used the functional state update to solve it.

**Test:** Verified that adding a task does not change the original initialTasks array.

## 2. Index Keys

**Symptom:** Notes entered for a task could disappear or become associated with the wrong task after deleting another task.

**Root cause:** Used the array index as the React key. After deleting or reordering items, React could reuse the wrong component instance.

**Fix:** Changed key={index} to key={task.id} so each task has a stable identity.

**Test:** Entered notes for the second task, deleted the first task, and checked that the notes remained associated with the second task.

## 3. Duplicated Derived State

**Symptom:** The completed count increased when completing a task, but it did not correctly decrease when marking the task incomplete.

**Root cause:** Stored completedCount separately even though it can be calculated from tasks.

**Fix:** Now Calculated the count directly using tasks.filter((task) => task.done).length.

**Test:** Completed a task and then marked it incomplete, checking that the count changed from 1 back to 0.

## 4. Unnecessary Effect

**Symptom:** Deleted tasks can remain visible because the visible task list was not updated whenever the task list changed.

**Root cause:** useEffect updated visibleTasks only when showCompleted changed. It missed other changes to tasks.

**Fix:** Removed the Effect and derived visibleTasks directly from tasks and showCompleted.

**Test:** Deleted a task and verified that it disappeared from the list.

## 5. Prop Mutation

**Symptom:** Sorting tasks changed the order of the original array passed by the parent component.

**Root cause:** I called .sort() directly on initialTasks. Sorting modifies the original array.

**Fix:** Sorted a copy of the current task state using [...currentTasks].sort(...) and updated state with the result.

**Test:** Sorted the displayed tasks and verified that the original initialTasks order remained unchanged.
