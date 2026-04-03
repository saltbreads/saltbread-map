import { http } from "@/lib/http/client";
import type { ApiEnvelope } from "@/lib/http/types";
import { unwrap } from "@/lib/http/unwrap";

export type ReviewSort = "latest" | "rating";

export type GetShopReviewsParams = {
  page?: number;
  limit?: number;
  sort?: ReviewSort;
};

export type ReviewAuthorDto = {
  id: string;
  nickname: string | null;
  profileImageUrl: string | null;
} | null;

export type ReviewImageDto = {
  id: string;
  url: string;
  order: number;
};

export type ShopReviewDto = {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  author: ReviewAuthorDto;
  images: ReviewImageDto[];
};

export type ShopReviewsResponse = {
  items: ShopReviewDto[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
};

export async function getShopReviews(
  shopId: string,
  params?: GetShopReviewsParams
): Promise<ShopReviewsResponse> {
  const res = await http.get<ApiEnvelope<ShopReviewsResponse>>(
    `/shops/${shopId}/reviews`,
    {
      params: {
        ...(params?.page != null ? { page: params.page } : {}),
        ...(params?.limit != null ? { limit: params.limit } : {}),
        ...(params?.sort ? { sort: params.sort } : {}),
      },
    }
  );

  const data = unwrap(res.data, res.status);

  if (!data || !Array.isArray(data.items)) {
    throw new Error(`Invalid response from /shops/${shopId}/reviews`);
  }

  return data;
}

export type ReviewTagDto = {
  id: string;
  label: string;
  count: number;
  externalCount: number | null;
  displayCount: number;
};

export type ShopReviewTagsResponse = {
  items: ReviewTagDto[];
};

export async function getShopReviewTags(
  shopId: string
): Promise<ShopReviewTagsResponse> {
  const res = await http.get<ApiEnvelope<ShopReviewTagsResponse>>(
    `/shops/${shopId}/review-tags`
  );

  const data = unwrap(res.data, res.status);

  if (!data || !Array.isArray(data.items)) {
    throw new Error(`Invalid response from /shops/${shopId}/review-tags`);
  }

  return data;
}

export type CreateReviewRequest = {
  shopId: string;
  rating: number;
  content?: string;
  imageUrls?: string[];
  tags?: string[];
};

export async function postReview({ shopId, ...body }: CreateReviewRequest) {
  const res = await http.post<ApiEnvelope<ShopReviewDto>>(
    `/shops/${shopId}/reviews`,
    body
  );

  return unwrap(res.data, res.status);
}

export type AiTagSuggestionRequest = {
  content: string;
};

export type AiTagSuggestionResponse = {
  items: string[];
};

export async function postAiTagSuggestions(
  body: AiTagSuggestionRequest
): Promise<AiTagSuggestionResponse> {
  const res = await http.post<ApiEnvelope<AiTagSuggestionResponse>>(
    "/reviews/ai-tag-suggestions",
    body
  );

  const data = unwrap(res.data, res.status);

  if (!data || !Array.isArray(data.items)) {
    throw new Error("Invalid response from /reviews/ai-tag-suggestions");
  }

  return data;
}
