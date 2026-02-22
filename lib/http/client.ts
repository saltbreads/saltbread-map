import axios, { AxiosError } from "axios";
import type { ApiEnvelope } from "./types";
import { ApiError } from "../api/ApiError";
import { isApiFail } from "./guards";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiEnvelope<unknown>>) => {
    const status = err.response?.status;
    const data = err.response?.data;

    // 서버가 envelope 실패를 내려준 경우(code/meta 보존)
    if (isApiFail(data)) {
      return Promise.reject(
        new ApiError(data.message ?? "요청 실패", {
          status,
          code: data.code,
          meta: data.meta,
        })
      );
    }

    // timeout / 네트워크
    if (err.code === "ECONNABORTED") {
      return Promise.reject(new ApiError("요청 시간 초과", { status }));
    }

    return Promise.reject(
      new ApiError(err.message || "네트워크 오류", { status })
    );
  }
);
