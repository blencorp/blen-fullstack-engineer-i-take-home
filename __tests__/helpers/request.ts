import { NextRequest } from "next/server";

interface RequestOptions {
  method?: string;
  body?: Record<string, unknown>;
  searchParams?: Record<string, string>;
}

/**
 * Creates a NextRequest for testing route handlers.
 */
export function createRequest(
  path: string,
  options?: RequestOptions,
): NextRequest {
  const url = new URL(path, "http://localhost:3001");

  if (options?.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      url.searchParams.set(key, value);
    }
  }

  const init: {
    method: string;
    body?: string;
    headers?: Record<string, string>;
  } = {
    method: options?.method || "GET",
  };

  if (options?.body) {
    init.body = JSON.stringify(options.body);
    init.headers = { "Content-Type": "application/json" };
  }

  return new NextRequest(url, init);
}

/**
 * Parses a Response body as JSON.
 */
export async function parseResponse<T = unknown>(
  response: Response,
): Promise<T> {
  return response.json() as Promise<T>;
}
