# Day 1 — Baseline Self-Assessment

## What I finished

Requirement 1 – Employee data: Done — loaded employee details from a JSON file.

Requirement 2 – Reusable components: Done — created a reusable EmployeeCard component to display employee information.

Requirement 3 – Props: Done — passed employee details to the card component using props.

Requirement 4 – Search: Done — added a search field to filter employees.

Requirement 5 – Department filter: Done — implemented a dropdown to filter employees by department.

Requirement 6 – Active-only filter: Done — added a checkbox to show only active employees.

Requirement 7 – Combined filters: Done — made search, department, and active-only filters work together.

Requirement 8 – Clear filters: Done — added a button to reset the filters and display the employee list again.

## Topic ratings (1 = need help, 5 = could teach it)

| Topic | Rating | Evidence (one sentence from today) |
|---|---:|---|
| Props | 5 | Passed employee data to EmployeeCard through props and reused the component for multiple employees. |
| State | 5 | Used React state to manage the search input, department selection, and active-only checkbox. |
| Lists and keys | 4 | Rendered employee cards dynamically from JSON data and used keys to identify list items. |
| Events | 5 | Handled search inputs, dropdown, checkbox, and button interactions to update the UI. |
| Conditional rendering | 4 | Displayed filtered results and explored how component state affects what gets rendered. |

## Where I got stuck

- Initially, I needed to make sure the different filters worked together instead of each filter overriding the others. I worked through the filtering logic so the search, department, and active-only conditions were applied together.

- I spent some time understanding how to keep the UI in sync with state changes and how React re-renders the component when a filter value changes.

- I also needed to check that the clear-filters button reset all the filter values consistently, rather than clearing only the search field.

## Top three gaps to close in this bootcamp

1. **React rendering and state behaviour:** Build a stronger understanding of state snapshots, batching, component identity, keys, and when Effects are actually necessary.
2. **Testing and debugging:** Become more confident writing reliable Vitest and React Testing Library tests, covering edge cases, and diagnosing test environment issues.
3. **TypeScript and development workflow:** Improve my use of strict typing, type narrowing, and domain modelling while becoming more comfortable with Git commits and maintaining clean project documentation.

