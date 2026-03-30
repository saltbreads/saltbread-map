import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/lib/store/auth.store";

type RefreshResponse = {
  success: boolean;
  data: {
    accessToken: string;
    sessionId: string;
  };
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

/**
 * 요청 인터셉터
 * - store에 accessToken이 있으면 Authorization 자동 첨부
 */
http.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      config.headers = new AxiosHeaders(config.headers);
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  return config;
});

/**
 * refresh 공통 함수
 * - 동시에 여러 요청이 401 나도 refresh는 한 번만 수행
 */
let refreshPromise: Promise<string | null> | null = null;
let isRedirectingToLogin = false;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await axios.post<RefreshResponse>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const payload = response.data?.data;

        if (!payload?.accessToken || !payload?.sessionId) {
          throw new Error("Invalid refresh response");
        }

        useAuthStore.getState().setAuth({
          accessToken: payload.accessToken,
          sessionId: payload.sessionId,
        });

        return payload.accessToken;
      } catch {
        useAuthStore.getState().clearAuth();

        if (typeof window !== "undefined" && !isRedirectingToLogin) {
          isRedirectingToLogin = true;
          window.location.replace("/login");
        }

        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

/**
 * 응답 인터셉터
 * - 401이면 refresh 시도
 * - refresh 성공 시 원래 요청 재시도
 * - refresh 실패 시 clearAuth
 */
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";
    const isAuthEndpoint =
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout") ||
      requestUrl.includes("/auth/exchange");

    if (status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      return Promise.reject(error);
    }

    if (originalRequest.headers instanceof AxiosHeaders) {
      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
    } else {
      originalRequest.headers = new AxiosHeaders(originalRequest.headers);
      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
    }

    return http(originalRequest);
  }
);
