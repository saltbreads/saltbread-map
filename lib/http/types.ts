export type ApiSuccess<T> = { success: true; data: T };
export type ApiFail = {
  success: false;
  message?: string;
  code?: string;
  meta?: unknown;
};
export type ApiEnvelope<T> = ApiSuccess<T> | ApiFail;
