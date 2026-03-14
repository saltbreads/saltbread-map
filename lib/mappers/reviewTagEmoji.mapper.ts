import { REVIEW_TAG_EMOJI } from "@/lib/constants/reviewTags";
import type { ReviewTagDto } from "@/lib/api/reviews";

export type ReviewTagItem = {
  id: string;
  icon: string;
  label: string;
  count: number;
};

export function mapReviewTags(tags: ReviewTagDto[]): ReviewTagItem[] {
  if (!tags?.length) return [];

  return tags.map((tag) => ({
    id: tag.id,
    icon: REVIEW_TAG_EMOJI[tag.label] ?? "🏷️",
    label: tag.label,
    count: tag.displayCount,
  }));
}

export type TopInfoItem = { icon: string; label: string };

export function mapLabelsToTopInfoItems(
  labels: string[] | null | undefined
): TopInfoItem[] {
  if (!labels?.length) return [];

  return labels.map((label) => ({
    icon: REVIEW_TAG_EMOJI[label] ?? "🏷️",
    label,
  }));
}
