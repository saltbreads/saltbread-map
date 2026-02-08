"use client";
import { Logo } from "@/components/shared/brand/Logo";
import { SearchController } from "@/components/features/search/SearchController";
import { ShopPhotoGrid } from "@/components/features/shop/ShopPhotoGrid";
import { Button } from "@/components/shared/ui/Button";
import { InfoRow } from "@/components/shared/ui/InfoRow";
import { LikeButton } from "@/components/shared/ui/LikeButton";
import { RatingBadge } from "@/components/shared/ui/RatingBadge";
import { Tag } from "@/components/shared/ui/Tag";
import { useState } from "react";

export default function Page() {
  const [liked, setLiked] = useState(false);
  return (
    <div>
      <div className="p-6 flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="profile">
          👤
        </Button>
        <Button isLoading>Loading</Button>
        <Button href="/" variant="outline">
          링크 버튼
        </Button>
        <SearchController className="w-[min(560px,92vw)]" />
        <div className="h-10 w-10 bg-brand-primary" />
      </div>
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold">가게 이름 ㅇㅇㅇ</h3>
              <RatingBadge rating={4.4} reviewCount={109} />
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          <InfoRow icon="🥐" label="소금빵" value="3,000원대" />
          <InfoRow icon="🧈" label="버터향 강함" value={30} variant="badge" />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Tag>버터향</Tag>
          <Tag>겉바속쫀</Tag>
          <Tag>재방문</Tag>
        </div>
        <LikeButton isLiked={liked} onToggleAction={(next) => setLiked(next)} />
      </div>
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto w-full max-w-140">
          <h1 className="text-lg font-semibold text-zinc-900">
            Logo 조합 테스트
          </h1>
          <p className="mt-1 text-xs text-zinc-600">
            size(sm/md/lg) × showText(true/false)
          </p>

          <div className="mt-6 space-y-6">
            {/* showText = true */}
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-zinc-900">
                showText: true
              </h2>

              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">sm</span>
                  <Logo size="sm" showText />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">md</span>
                  <Logo size="md" showText />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">lg</span>
                  <Logo size="lg" showText />
                </div>
              </div>
            </section>

            {/* showText = false */}
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-zinc-900">
                showText: false
              </h2>

              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">sm</span>
                  <Logo size="sm" showText={false} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">md</span>
                  <Logo size="md" showText={false} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">lg</span>
                  <Logo size="lg" showText={false} />
                </div>
              </div>
            </section>
            <ShopPhotoGrid
              images={[
                "/image/sample1.jpg",
                "/image/sample2.jpg",
                "/image/sample3.jpg",
                "/image/sample4.jpg",
                "/image/sample5.jpg",
                "/image/sample6.jpg",
                "/image/sample7.jpg",
              ]}
              onOpen={(startIndex) => {
                // TODO: 여기서 모달/라이트박스 열기
                console.log("open gallery at", startIndex);
              }}
            />

            {/* className 테스트 */}
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-sm font-semibold text-zinc-900">
                className override
              </h2>

              <div className="mt-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">텍스트 색 변경</span>
                  <Logo size="md" className="text-brand-secondary" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">투명도</span>
                  <Logo size="md" className="opacity-70" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">간격 강제</span>
                  <Logo size="md" className="gap-4" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
