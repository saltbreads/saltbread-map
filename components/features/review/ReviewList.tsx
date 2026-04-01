"use client";

import { useState } from "react";

import { ReviewCard } from "./ReviewCard";
import { ReviewTagList } from "./ReviewTagList";
import {
  ReviewCreateModal,
  type CreateReviewPayload,
} from "./ReviewCreateModal";

import { useShopReviews } from "@/lib/queries/useShopReviews";
import { useShopReviewTags } from "@/lib/queries/useShopReviewTags";
import { mapReviewTags } from "@/lib/mappers/reviewTagEmoji.mapper";
import { useCreateReview } from "@/lib/queries/useCreateReview";

type Props = {
  shopId: string;
};

export function ReviewList({ shopId }: Props) {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createReview } = useCreateReview(shopId);

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

  const handleOpenReviewModal = () => {
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
  };

  const handleSubmitReview = async (payload: CreateReviewPayload) => {
    try {
      setIsSubmitting(true);
      await createReview(payload);
      setOpenReviewModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        리뷰 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-zinc-900">리뷰</h3>

          <button
            type="button"
            onClick={handleOpenReviewModal}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            리뷰 등록하기
          </button>
        </div>

        <ReviewTagList tags={tags} />

        {!reviews.length ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
            등록된 리뷰가 존재하지 않습니다.
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </div>

      <ReviewCreateModal
        open={openReviewModal}
        onCloseAction={handleCloseReviewModal}
        onSubmitAction={handleSubmitReview}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
