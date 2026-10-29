
# Race Conditions in Async UI

## Race condition

A race condition occurs when the result of an operation depends on the order in which asynchronous operations finish.

In a search UI, multiple requests can run while the user types. A slower, older request may finish after a newer request and overwrite the latest results.

## How to reproduce it

The `RaceConditionDemo` component simulates requests with different delays.

1. Search for `react`.
2. Quickly change the query to `typescript`.
3. Observe that `typescript` may appear first, followed by the older `react` result.

This happens because the older request can finish after the newer request.

## Why it happens

Each effect starts an asynchronous request. Without cancellation or stale-result protection, every completed request can update component state, regardless of whether its query is still current.

## Fix with AbortController

Create an `AbortController` for each effect execution and pass its signal to the request.

```ts
useEffect(() => {
  const controller = new AbortController();

  fetch(url, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    })
    .then(setData)
    .catch((error: unknown) => {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setError("Failed to load data.");
    });

  return () => controller.abort();
}, [url]);
```

When the dependency changes or the component unmounts, cleanup aborts the previous request. An aborted request should not display an ordinary error message.

## Limitations

- Cancellation works only when the underlying operation supports the signal.
- It does not undo server-side work that has already happened.
- For operations that cannot be cancelled, use a stale-result guard or request identity check to prevent outdated results from updating the UI.
- Loading state and error state must also be managed carefully so an older request cannot overwrite the state of a newer request.

## Conclusion

Async UI needs to account for loading, success, empty, and error states. Aborting obsolete requests helps prevent stale results, reduces unnecessary work, and makes search interfaces more reliable.
