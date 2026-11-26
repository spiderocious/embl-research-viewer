/** Thrown when a request fails at the network level or returns a non-2xx status. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * The single network seam. No component or feature calls `fetch` directly;
 * every request goes through here so error handling and the base behaviour
 * live in one place.
 */
export const apiClient = {
  async getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
    let response: Response;
    try {
      response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    } catch (cause) {
      throw new ApiError(0, `Network request failed: ${(cause as Error).message}`);
    }
    if (!response.ok) {
      throw new ApiError(response.status, `Request failed with status ${response.status}`);
    }
    return (await response.json()) as T;
  },
};
