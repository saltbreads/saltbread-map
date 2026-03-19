"use client";

import { Logo } from "@/components/shared/brand/Logo";
import { FcGoogle } from "react-icons/fc";
import { SiNaver, SiKakaotalk } from "react-icons/si";
import {
  getGoogleOAuthUrl,
  getKakaoOAuthUrl,
  getNaverOAuthUrl,
} from "@/lib/api/auth";
export default function LoginPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-white px-6">
      <section className="w-full max-w-sm md:max-w-md">
        <div className="flex flex-col items-center gap-4 mb-10 md:mb-12">
          <Logo size="xl" />
          <p className="text-sm md:text-base text-black text-center">
            내 주변 소금빵집을 한눈에
          </p>
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <a
            href={getGoogleOAuthUrl()}
            className="flex items-center justify-center gap-2 md:gap-3 h-12 md:h-14 rounded-xl border border-zinc-300 bg-white text-zinc-900 font-medium md:text-base hover:bg-zinc-50 transition"
          >
            <FcGoogle className="text-[20px] md:text-[22px]" />
            Google로 로그인
          </a>

          <a
            href={getNaverOAuthUrl()}
            className="flex items-center justify-center gap-2 md:gap-3 h-12 md:h-14 rounded-xl bg-[#03C75A] text-white font-medium md:text-base hover:brightness-95 transition"
          >
            <SiNaver className="text-[18px] md:text-[20px]" />
            네이버로 로그인
          </a>

          <a
            href={getKakaoOAuthUrl()}
            className="flex items-center justify-center gap-2 md:gap-3 h-12 md:h-14 rounded-xl bg-[#FEE500] text-black font-medium md:text-base hover:brightness-95 transition"
          >
            <SiKakaotalk className="text-[18px] md:text-[20px]" />
            카카오로 로그인
          </a>
        </div>

        <p className="mt-6 md:mt-7 text-xs md:text-sm text-zinc-500 text-center leading-relaxed">
          계속 진행하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </section>
    </main>
  );
}
