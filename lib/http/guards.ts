import type { ApiEnvelope, ApiFail } from "./types";

export function isApiEnvelope(x: unknown): x is ApiEnvelope<unknown> {
  return !!x && typeof x === "object" && "success" in x;
}

export function isApiFail(x: unknown): x is ApiFail {
  return isApiEnvelope(x) && x.success === false;
}
