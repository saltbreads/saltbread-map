"use client";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6">
      <section className="w-full max-w-sm">
        {/* 로고 */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <Logo size="lg" />
          <p className="text-sm text-muted-foreground text-center">
            내 주변 소금빵집을 한눈에
          </p>
        </div>

        {/* 로그인 버튼 */}
        <div className="flex flex-col gap-3">
          {/* Google */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            href="/api/auth/google"
          >
            Google로 로그인
          </Button>

          {/* Naver */}
          <Button
            size="lg"
            className="w-full bg-[#03C75A] hover:bg-[#02b350]"
            href="/api/auth/naver"
          >
            네이버로 로그인
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
          계속 진행하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </section>
    </main>
  );
}
