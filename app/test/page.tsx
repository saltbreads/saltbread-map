"use client";
import { Button } from "@/components/ui/Button";
import { SearchController } from "@/components/search/SearchController";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { InfoRow } from "@/components/ui/InfoRow";
import { Tag } from "@/components/ui/Tag";
import { LikeButton } from "@/components/ui/LikeButton";
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
    </div>
  );
}
