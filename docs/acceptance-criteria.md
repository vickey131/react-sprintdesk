# SprintDesk Lite – Acceptance Criteria

## 1. User stories and acceptance criteria

### Create and edit tasks

As a team member, I should be able to create tasks and make changes whenever needed.

- **Given** I leave the title empty or enter fewer than 3 or more than 100 characters after trimming, **when** I save the task, **then** it should not be saved and a validation error should be shown and announced.
- **Given** I enter a description longer than 1000 characters, **when** I save the task, **then** it should not be saved and a validation error should be shown.
- **Given** I create a new task without selecting a priority, **when** the task is saved, **then** its priority should be `medium` and its status should be `todo`.
- **Given** I select a priority while creating a task, **when** I save it, **then** the selected `low`, `medium` or `high` priority should be saved.
- **Given** I create a task using only the keyboard, **when** I finish creating it, **then** the process should take less than 10 seconds.
- **Given** I open an existing task for editing, **when** I change and save any of its fields, including status, **then** the updated details should be saved.
- **Given** I make changes to a task, **when** I cancel the edit, **then** the original details should remain unchanged.
- **Given** saving a task fails, **when** the error occurs, **then** my entered data should remain available and I should be able to retry.

### Change status and delete tasks

As a team member, I should be able to update task progress and delete tasks when needed.

- **Given** a task is in `todo`, **when** I move it to `in_progress`, **then** its status should be updated.
- **Given** a task is in `in_progress`, **when** I move it to `done`, **then** its status should be updated.
- **Given** a task is in `done`, **when** I move it back to `in_progress`, **then** its status should be updated.
- **Given** a task is in `todo`, **when** I move it directly to `done`, **then** I should be asked to confirm the change.
- **Given** I change a task's status, **when** the API request is still pending, **then** the new status should appear immediately. If the request fails, the previous status should be restored and an error message should be shown.
- **Given** I choose to delete a task, **when** the confirmation is displayed, **then** the task should remain until I confirm.
- **Given** I confirm the deletion, **when** the deletion is completed, **then** the task should be removed permanently.

### Search, filter and sort tasks

As a team member, I should be able to find the tasks I need using search, filters and sorting.

- **Given** tasks have titles or descriptions, **when** I search, **then** matching tasks should be found in both fields, without considering letter case, and the search should be debounced.
- **Given** I select status or priority filters, **when** the board updates, **then** only tasks matching the selected filters and active search should be displayed.
- **Given** I have applied filters, **when** I share or reload the board URL, **then** the same filtered view should be displayed.
- **Given** I select priority sorting, **when** the tasks are displayed, **then** high-priority tasks should appear first.
- **Given** I select created-date sorting, **when** the tasks are displayed, **then** the newest tasks should appear first. This should also be the default sorting option.

### Dashboard

As a team lead, I should be able to get a quick overview of the team's progress.

- **Given** I open the dashboard, **when** the task summary is displayed, **then** I should see the count of tasks in each status and the count of high-priority tasks that are not done.
- **Given** I apply search or filters, **when** the dashboard counts are displayed, **then** they should still include all tasks and not just the visible results.
- **Given** I check the high-priority task count, **when** I view the dashboard, **then** I should be able to identify high-priority work that is not done in one interaction.

### Empty states, persistence, accessibility and performance

- **Given** there are no tasks, **when** I open the board, **then** I should see a message saying that no tasks have been created yet.
- **Given** tasks exist but none match my search or filters, **when** I view the board, **then** I should see a different empty-state message and an option to clear the filters.
- **Given** task data is saved through the Day 3 API layer, **when** I refresh the page, **then** the saved data should still be available.
- **Given** I use the board, **when** I interact with its controls, **then** every control should have a proper label and be usable with the keyboard.
- **Given** a validation error occurs, **when** it is displayed, **then** it should be announced and linked to the relevant input.
- **Given** I close a dialog, **when** it disappears, **then** keyboard focus should return to an appropriate location.
- **Given** the board contains 500 tasks, **when** I use it, **then** it should remain responsive.

## 2. Definition of Done – Milestone 1

- All the acceptance criteria above are met.
- The application meets WCAG 2.2 AA accessibility standards.
- Failed saves retain the entered data and allow a retry.
- Failed status updates restore the previous status and show an error message.
- The board remains responsive with 500 tasks.
- There are at least 30 automated tests and at least 80% statement coverage for `src/features`.

The scope is limited to a single-team task board for one sprint. Multiple boards, user accounts, assignees, comments, attachments and drag-and-drop are not included.

## 3. Open questions

A few details are not clearly explained in the brief. I've listed them below with possible assumptions. These are only for clarification and are not confirmed requirements.

| Question | Possible assumption |
|---|---|
| What happens if a task is deleted while someone is editing it? | Close the edit form, discard unsaved changes and notify the user. |
| Should search match whole words or partial text? | Allow partial matches in titles and descriptions. |
| Should the high-priority task count change when filters are applied? | Count all high-priority tasks that are not done, regardless of filters. |
| Should Clear filters also clear the search text? | Clear both the selected filters and search text. |
| What happens if task deletion fails? | Keep the task visible and allow the user to retry. |