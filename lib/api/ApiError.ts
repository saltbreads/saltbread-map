export class ApiError extends Error {
  code?: string;
  meta?: unknown;
  status?: number;

  constructor(
    message: string,
    opts?: { code?: string; meta?: unknown; status?: number }
  ) {
    super(message);
    this.name = "ApiError";
    this.code = opts?.code;
    this.meta = opts?.meta;
    this.status = opts?.status;
  }
}
