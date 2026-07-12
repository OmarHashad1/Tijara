import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiEnvelope } from "./types";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Background probes (e.g. "who am I") must not hard-redirect guests. */
    skipAuthRedirect?: boolean;
  }
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/**
 * Auth is cookie-based (httpOnly accessToken/refreshToken set by the server) —
 * every request must carry credentials; there is no token in JS state.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/** Routes where a 401 is a real answer, not an expired access token. */
const NO_REFRESH_ROUTES = ["/auth/login", "/auth/signup", "/auth/refresh-token"];

let refreshPromise: Promise<void> | null = null;

/**
 * On 401: call POST /auth/refresh-token once (deduped across concurrent
 * failures), then retry the original request. On repeat failure, land on
 * /login. Server-side renders skip this — cookies aren't forwarded there.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;

    const status = error.response?.status;
    const url = original?.url ?? "";

    const shouldAttemptRefresh =
      status === 401 &&
      original &&
      !original._retried &&
      typeof window !== "undefined" &&
      !NO_REFRESH_ROUTES.some((route) => url.includes(route));

    if (!shouldAttemptRefresh) throw error;

    original._retried = true;

    refreshPromise ??= api
      .post("/auth/refresh-token")
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });

    try {
      await refreshPromise;
    } catch {
      if (!original.skipAuthRedirect) window.location.assign("/login");
      throw error;
    }

    return api.request(original);
  },
);

/**
 * Unwrap the backend's `{status, data: {message, payload | data}}` envelope.
 * Most modules use `payload`; the user/customer module uses `data`.
 */
export function unwrap<T>(body: ApiEnvelope<T>): T {
  return (body.data.payload ?? body.data.data) as T;
}

/** Human-readable message from a NestJS error body, for toasts. */
export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string | string[] })
      ?.message;
    if (Array.isArray(message)) return message[0];
    if (message) return message;
  }
  return "Something went wrong. Please try again.";
}
