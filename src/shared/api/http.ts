export class ApiError extends Error {
  public readonly status: number;
  public readonly fieldErrors: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function getErrorDetails(body: string, statusText: string, status: number) {
  if (body.trim()) {
    try {
      const errorBody: unknown = JSON.parse(body);

      if (typeof errorBody === "object" && errorBody !== null) {
        const message =
          "message" in errorBody &&
          typeof errorBody.message === "string" &&
          errorBody.message.trim()
            ? errorBody.message
            : statusText || `Request failed with status ${status}`;
        const fieldErrors: Record<string, string> = {};

        if (
          "errors" in errorBody &&
          typeof errorBody.errors === "object" &&
          errorBody.errors !== null &&
          !Array.isArray(errorBody.errors)
        ) {
          for (const [field, value] of Object.entries(errorBody.errors)) {
            const message = Array.isArray(value) ? value[0] : value;
            if (typeof message === "string" && message.trim()) {
              fieldErrors[field] = message;
            }
          }
        }

        return { message, fieldErrors };
      }
    } catch (error) {
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }
  }

  return {
    message: statusText || `Request failed with status ${status}`,
    fieldErrors: {},
  };
}

export async function request(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<unknown> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const body = await response.text();
    const errorDetails = getErrorDetails(
      body,
      response.statusText,
      response.status,
    );
    throw new ApiError(
      errorDetails.message,
      response.status,
      errorDetails.fieldErrors,
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json() as Promise<unknown>;
}