"use client";

import { useMemo, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Modal } from "../../shared/ui/Modal";
import { ReviewTagSelector } from "./ReviewTagSelector";
import { REVIEW_TAG_EMOJI } from "@/lib/constants/reviewTags";
import { postAiTagSuggestions } from "@/lib/api/reviews";

export type CreateReviewPayload = {
  rating: number;
  content?: string;
  imageUrls?: string[];
  tags?: string[];
};

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onSubmitAction: (payload: CreateReviewPayload) => Promise<void> | void;
  isSubmitting?: boolean;
};

const MAX_IMAGE_COUNT = 10;
const MAX_TAG_COUNT = 5;

type ReviewFormErrors = {
  rating?: string;
  imageUrls?: string;
  submit?: string;
  aiTagSuggestion?: string;
};

type CloudinaryUploadInfo = {
  secure_url?: string;
};

export function ReviewCreateModal({
  open,
  onCloseAction,
  onSubmitAction,
  isSubmitting = false,
}: Props) {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  const trimmedContent = useMemo(() => content.trim(), [content]);

  const resetForm = () => {
    setRating(5);
    setContent("");
    setImageUrls([]);
    setSelectedTags([]);
    setErrors({});
    setIsSuggestingTags(false);
  };

  const handleClose = () => {
    if (isSubmitting || isSuggestingTags) return;
    resetForm();
    onCloseAction();
  };

  const handleRemoveImageUrl = (target: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== target));
  };

  const handleUploadSuccess = (info?: CloudinaryUploadInfo) => {
    const secureUrl = info?.secure_url;

    if (!secureUrl) {
      setErrors((prev) => ({
        ...prev,
        imageUrls: "업로드는 완료됐지만 이미지 URL을 가져오지 못했습니다.",
      }));
      return;
    }

    setImageUrls((prev) => {
      if (prev.includes(secureUrl)) return prev;
      if (prev.length >= MAX_IMAGE_COUNT) return prev;
      return [...prev, secureUrl];
    });

    setErrors((prev) => ({
      ...prev,
      imageUrls: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: ReviewFormErrors = {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      nextErrors.rating = "평점은 1점부터 5점까지의 정수여야 합니다.";
    }

    if (imageUrls.length > MAX_IMAGE_COUNT) {
      nextErrors.imageUrls = `이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAiTagSuggestion = async () => {
    if (!trimmedContent) {
      setErrors((prev) => ({
        ...prev,
        aiTagSuggestion: "리뷰 내용을 먼저 입력해줘.",
      }));
      return;
    }

    try {
      setIsSuggestingTags(true);
      setErrors((prev) => ({
        ...prev,
        aiTagSuggestion: undefined,
      }));

      const result = await postAiTagSuggestions({ content: trimmedContent });

      const suggestedTags = Array.isArray(result.items)
        ? result.items.filter((item): item is string => Boolean(item))
        : [];

      if (suggestedTags.length === 0) {
        setErrors((prev) => ({
          ...prev,
          aiTagSuggestion:
            "추천할 태그를 찾지 못했어. 내용을 조금 더 자세히 적어줘.",
        }));
        return;
      }

      setSelectedTags((prev) => {
        const merged = [...prev];

        for (const tag of suggestedTags) {
          if (!Object.prototype.hasOwnProperty.call(REVIEW_TAG_EMOJI, tag)) {
            continue;
          }

          if (!merged.includes(tag)) {
            merged.push(tag);
          }

          if (merged.length >= MAX_TAG_COUNT) {
            break;
          }
        }

        return merged;
      });
    } catch {
      setErrors((prev) => ({
        ...prev,
        aiTagSuggestion:
          "AI 태그 추천 중 문제가 발생했어. 잠시 후 다시 시도해줘.",
      }));
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setErrors({});

      const payload: CreateReviewPayload = {
        rating,
        ...(trimmedContent ? { content: trimmedContent } : {}),
        ...(imageUrls.length > 0 ? { imageUrls } : {}),
        ...(selectedTags.length > 0 ? { tags: selectedTags } : {}),
      };

      await onSubmitAction(payload);
      resetForm();
      onCloseAction();
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "리뷰 등록 중 문제가 발생했습니다. 다시 시도해주세요",
      }));
    }
  };

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting || isSuggestingTags}
        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        취소
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || isSuggestingTags}
        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "등록 중..." : "리뷰 등록"}
      </button>
    </div>
  );

  return (
    <Modal
      open={open}
      onCloseAction={handleClose}
      title="리뷰 등록"
      footer={footer}
      closeOnBackdrop={!isSubmitting && !isSuggestingTags}
      closeOnEsc={!isSubmitting && !isSuggestingTags}
      maxWidthClassName="max-w-xl"
    >
      <div className="space-y-5">
        <section>
          <label className="mb-2 block text-sm font-medium text-gray-800">
            평점 <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const active = value <= rating;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  disabled={isSubmitting || isSuggestingTags}
                  className={`text-3xl leading-none transition ${
                    active ? "text-yellow-400" : "text-gray-300"
                  } disabled:cursor-not-allowed`}
                  aria-label={`${value}점`}
                >
                  ★
                </button>
              );
            })}

            <span className="ml-2 text-sm text-gray-800">{rating}점</span>
          </div>

          {errors.rating && (
            <p className="mt-2 text-sm text-red-500">{errors.rating}</p>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-800">태그 선택</p>

            <button
              type="button"
              onClick={handleAiTagSuggestion}
              disabled={
                isSubmitting ||
                isSuggestingTags ||
                !trimmedContent ||
                selectedTags.length >= MAX_TAG_COUNT
              }
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSuggestingTags ? "추천 중..." : "AI 태그 추천"}
            </button>
          </div>

          <ReviewTagSelector
            tags={Object.keys(REVIEW_TAG_EMOJI)}
            selectedTags={selectedTags}
            emojiMap={REVIEW_TAG_EMOJI}
            maxSelect={MAX_TAG_COUNT}
            disabled={isSubmitting || isSuggestingTags}
            onChangeAction={setSelectedTags}
          />

          {errors.aiTagSuggestion && (
            <p className="text-sm text-red-500">{errors.aiTagSuggestion}</p>
          )}
        </section>

        <section>
          <label
            htmlFor="review-content"
            className="mb-2 block text-sm font-medium text-gray-800"
          >
            내용
          </label>
          <textarea
            id="review-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰 내용을 입력해줘."
            rows={5}
            disabled={isSubmitting || isSuggestingTags}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-900"
          />
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-800">
              리뷰 사진
            </label>

            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                multiple: true,
                maxFiles: MAX_IMAGE_COUNT - imageUrls.length,
                resourceType: "image",
                clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                folder: "saltbread-map/reviews",
                sources: ["local", "camera"],
              }}
              onSuccess={(result) => {
                const info = result?.info as CloudinaryUploadInfo | undefined;
                handleUploadSuccess(info);
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => {
                    if (imageUrls.length >= MAX_IMAGE_COUNT) {
                      setErrors((prev) => ({
                        ...prev,
                        imageUrls: `이미지는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`,
                      }));
                      return;
                    }
                    open?.();
                  }}
                  disabled={isSubmitting || isSuggestingTags}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  사진 업로드
                </button>
              )}
            </CldUploadWidget>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            최대 {MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.
          </p>

          {errors.imageUrls && (
            <p className="mt-2 text-sm text-red-500">{errors.imageUrls}</p>
          )}

          {imageUrls.length > 0 && (
            <ul className="mt-3 space-y-2">
              {imageUrls.map((url, index) => (
                <li
                  key={url}
                  className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">이미지 {index + 1}</p>
                    <p className="truncate text-sm text-gray-800">{url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(url)}
                    disabled={isSubmitting || isSuggestingTags}
                    className="ml-3 rounded-md px-2 py-1 text-sm text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {errors.submit && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.submit}
          </div>
        )}
      </div>
    </Modal>
  );
}
