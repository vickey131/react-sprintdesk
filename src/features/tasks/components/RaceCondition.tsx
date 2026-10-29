
import { useEffect, useState } from "react";

type SearchResult = {
  query: string;
  message: string;
};

const mockSearch = (query: string, signal?: AbortSignal): Promise<SearchResult> =>
  new Promise((resolve, reject) => {
    const delay = query === "react" ? 5000 : 300;

    const timeoutId = setTimeout(() => {
      resolve({
        query,
        message: `Results for "${query}"`,
      });
    }, delay);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true },
    );

    if (signal?.aborted) {
      clearTimeout(timeoutId);
      reject(new DOMException("Request aborted", "AbortError"));
    }
});
  
export default function RaceCondition() {
  const [query, setQuery] = useState("react");
  const [useCancellation, setUseCancellation] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [requestId, setRequestId] = useState(0);
  const [completedRequestId, setCompletedRequestId] = useState<number | null>(
    null,
  );
  const [requestError, setRequestError] = useState<{
    requestId: number;
    message: string;
  } | null>(null);
  const loading = completedRequestId !== requestId;
  const error = requestError?.requestId === requestId ? requestError.message : null;

  useEffect(() => {
    const controller = useCancellation ? new AbortController() : undefined;

    mockSearch(query, controller?.signal)
      .then(setResult)
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") {
          return;
        }

        setRequestError({
          requestId,
          message: "Failed to load results.",
        });
      })
      .finally(() => {
        setCompletedRequestId(requestId);
      });

    return () => {
      controller?.abort();
    };
  }, [query, requestId, useCancellation]);

  return (
    <section>
      <h2>Race Condition Demo</h2>

      <label>
        Search query:{" "}
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setRequestId((current) => current + 1);
          }}
        />
      </label>

      <p>
        <label>
          <input
            type="checkbox"
            checked={useCancellation}
            onChange={(event) => {
              setUseCancellation(event.target.checked);
              setRequestId((current) => current + 1);
            }}
          />
          Enable AbortController
        </label>
      </p>

      <p>
        <strong>Status:</strong> {loading ? "Loading..." : "Idle"}
      </p>

      {error && <p role="alert">{error}</p>}

      {result && (
        <p>
          <strong>Result</strong> {result.message}
        </p>
      )}
    </section>
  );
}
