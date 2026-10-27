import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedState, setStoredState] = useState(() => ({
    key,
    value: readStoredValue(key, initialValue),
  }));
  const value =
    storedState.key === key
      ? storedState.value
      : readStoredValue(key, initialValue);

  useEffect(() => {
    const serializedValue = JSON.stringify(value);

    if (serializedValue === undefined) {
      throw new TypeError("useLocalStorage value must be JSON-serializable.");
    }

    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, serializedValue);
  }, [key, value]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (nextValue) => {
      setStoredState((currentState) => {
        const currentValue =
          currentState.key === key
            ? currentState.value
            : readStoredValue(key, initialValue);

        return {
          key,
          value:
            typeof nextValue === "function"
              ? (nextValue as (previousValue: T) => T)(currentValue)
              : nextValue,
        };
      });
    },
    [initialValue, key]
  );

  return [value, setValue];
}

function readStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === "undefined") {
    return initialValue;
  }

  const storedValue = window.localStorage.getItem(key);

  if (storedValue === null) {
    return initialValue;
  }

  try {
    return JSON.parse(storedValue) as T;
  } catch {
    return initialValue;
  }
}