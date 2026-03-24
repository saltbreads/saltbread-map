import { Suspense } from "react";
import OAuthCallbackClient from "./OAuthCallbackClient";

function LoadingFallback() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6">
      <p className="text-sm text-zinc-600">로그인 처리 중...</p>
    </main>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OAuthCallbackClient />
    </Suspense>
  );
}
