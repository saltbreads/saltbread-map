"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { postAuthExchange } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth.store";

export default function OAuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const code = searchParams.get("code");
  const [message, setMessage] = useState("로그인 처리 중...");

  useEffect(() => {
    if (!code) return;

    const run = async () => {
      try {
        const data = await postAuthExchange({ code });

        setAuth({
          accessToken: data.accessToken,
          sessionId: data.sessionId,
        });

        router.replace("/");
      } catch (error) {
        console.error(error);
        setMessage("로그인 처리에 실패했습니다.");
      }
    };

    run();
  }, [code, router, setAuth]);

  if (!code) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-white px-6">
        <p className="text-sm text-zinc-600">인가 코드가 없습니다.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6">
      <p className="text-sm text-zinc-600">{message}</p>
    </main>
  );
}
