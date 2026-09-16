/**
 * Typed fetch wrappers for the admin API.
 *
 * Everything goes through `request`, so a 401 has one place to be handled: the
 * session expired while a tab was open, and the app needs to fall back to the
 * login screen rather than show an empty list.
 */

export interface ValidationProblem {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  problems: ValidationProblem[];

  constructor(status: number, message: string, problems: ValidationProblem[] = []) {
    super(message);
    this.status = status;
    this.problems = problems;
  }
}

/** Set by AdminApp so an expired session anywhere returns to the login screen. */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });

  if (res.status === 401) {
    onUnauthorized?.();
    throw new ApiError(401, 'Your session expired. Sign in again.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}) as Record<string, unknown>);
    const problems = Array.isArray(body.problems) ? (body.problems as ValidationProblem[]) : [];

    /*
      Prefer the server's actual reason. It sends specifics in `problems` —
      "Give the template a name", "that slug is reserved" — and falling straight
      through to the generic status text threw all of that away, leaving
      "Some fields need attention" with no indication of which, or why.
    */
    const message =
      typeof body.message === 'string'
        ? body.message
        : problems.length === 1
          ? problems[0].message
          : problems.length > 1
            ? `${problems.length} fields need attention.`
            : describeStatus(res.status);

    throw new ApiError(res.status, message, problems);
  }

  return (await res.json()) as T;
}

function describeStatus(status: number): string {
  if (status === 400) return 'Some fields need attention before this can be saved.';
  if (status === 404) return 'That item no longer exists.';
  if (status === 413) return 'That file is too large.';
  if (status === 503) return 'Cannot reach the database right now.';
  return `Request failed (${status}).`;
}

/* ------------------------------------------------------------------------- */
