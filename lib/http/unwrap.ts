import type { ApiEnvelope } from "./types";
import { ApiError } from "../api/ApiError";

export function unwrap<T>(env: ApiEnvelope<T>, status?: number): T {
  if (env.success) return env.data;

  throw new ApiError(env.message ?? "요청 실패", {
    code: env.code,
    meta: env.meta,
    status,
  });
}
