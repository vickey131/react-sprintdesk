# Effect Discipline

**1. ConnectionStatus**

Symptom: The component continues receiving online/offline events after unmounting, leaving unnecessary event listeners behind.

Root cause: The Effect registered event listeners but did not remove them during cleanup.

Fix: Added a cleanup function that removes both the online and offline event listeners when the component unmounts.

**2. FocusTimer**

Symptom: The counter remains at 1 instead of continuing to increase every second.

Root cause: The callback gets stale seconds value. The Effect depends on running, so the interval continues using the value captured when it was created.

Fix: Used a functional state update, so each interval increments the latest state value without needing seconds as an Effect dependency.

**3. TaskQuickFind**

Symptom: The component repeatedly runs its Effect and updates state unnecessarily, potentially causing an infinite render loop.

Root cause: The options object is recreated on every render. Since it is included in the dependencies, so it triggers the effect continuously. Additionally, matches is derived from tasks and query, so storing it in state is unnecessary.

Fix: Removed the Effect and matches state. Calculated the matching tasks directly during rendering.