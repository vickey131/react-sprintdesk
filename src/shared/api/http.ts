export class ApiError extends Error {
  public readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(body: string, statusText: string, status: number) {
  if (body.trim()) {
    try {
      const errorBody: unknown = JSON.parse(body);

      if (
        typeof errorBody === "object" &&
        errorBody !== null &&
        "message" in errorBody &&
        typeof errorBody.message === "string" &&
        errorBody.message.trim()
      ) {
        return errorBody.message;
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }
  }

  return statusText || `Request failed with status ${status}`;
}

export async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(
      getErrorMessage(body, response.statusText, response.status),
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}