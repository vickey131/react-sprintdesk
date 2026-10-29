
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = useCancellation ? new AbortController() : undefined;

    setLoading(true);
    setError(null);

    mockSearch(query, controller?.signal)
      .then(setResult)
      .catch((reason: unknown) => {
        if (reason instanceof Error && reason.name === "AbortError") {
          return;
        }

        setError("Failed to load results.");
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller?.abort();
    };
  }, [query, useCancellation]);

  return (
    <section>
      <h2>Race Condition Demo</h2>

      <label>
        Search query:{" "}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <p>
        <label>
          <input
            type="checkbox"
            checked={useCancellation}
            onChange={(event) => setUseCancellation(event.target.checked)}
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
