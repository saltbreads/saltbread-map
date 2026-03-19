import { http } from "@/lib/http/client";
import type { ApiEnvelope } from "@/lib/http/types";
import { unwrap } from "@/lib/http/unwrap";

export type ExchangeCodeRequest = {
  code: string;
};

export type ExchangeCodeResponse = {
  accessToken: string;
  sessionId: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  sessionId: string;
};

export type LogoutResponse = {
  ok: true;
};

export function getGoogleOAuthUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
}

export function getNaverOAuthUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/naver`;
}

export function getKakaoOAuthUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/kakao`;
}

export async function postAuthExchange(
  body: ExchangeCodeRequest
): Promise<ExchangeCodeResponse> {
  const res = await http.post<ApiEnvelope<ExchangeCodeResponse>>(
    "/auth/exchange",
    body
  );

  const data = unwrap(res.data, res.status);

  if (!data?.accessToken || !data?.sessionId) {
    throw new Error("Invalid response from /auth/exchange");
  }

  return data;
}

export async function postAuthRefresh(): Promise<RefreshTokenResponse> {
  const res = await http.post<ApiEnvelope<RefreshTokenResponse>>(
    "/auth/refresh"
  );

  const data = unwrap(res.data, res.status);

  if (!data?.accessToken || !data?.sessionId) {
    throw new Error("Invalid response from /auth/refresh");
  }

  return data;
}

export async function postAuthLogout(): Promise<LogoutResponse> {
  const res = await http.post<ApiEnvelope<LogoutResponse>>("/auth/logout");

  const data = unwrap(res.data, res.status);

  if (!data || data.ok !== true) {
    throw new Error("Invalid response from /auth/logout");
  }

  return data;
}
