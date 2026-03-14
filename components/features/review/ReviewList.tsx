"use client";

import { ReviewCard } from "./ReviewCard";
import { ReviewTagList } from "./ReviewTagList";

import { useShopReviews } from "@/lib/queries/useShopReviews";
import { useShopReviewTags } from "@/lib/queries/useShopReviewTags";
import { mapReviewTags } from "@/lib/mappers/reviewTagEmoji.mapper";

type Props = {
  shopId: string;
};

export function ReviewList({ shopId }: Props) {
  const { data, isLoading, isError } = useShopReviews(shopId, {
    page: 1,
    limit: 10,
    sort: "latest",
  });

  const {
    data: tagsData,
    isLoading: isTagsLoading,
    isError: isTagsError,
  } = useShopReviewTags(shopId);

  const reviews = data?.items ?? [];

  const tags = mapReviewTags(tagsData?.items ?? []).map((t) => ({
    id: t.id,
    label: t.label,
    count: t.count,
    emoji: t.icon,
  }));

  if (isLoading || isTagsLoading) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
        리뷰 불러오는 중...
      </div>
    );
  }

  if (isError || isTagsError) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-red-500">
        리뷰 정보를 불러오지 못했어.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewTagList tags={tags} />

      {!reviews.length ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
          등록된 리뷰가 존재하지 않습니다
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}
