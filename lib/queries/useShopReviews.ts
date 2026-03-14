import { useQuery } from "@tanstack/react-query";
import {
  getShopReviews,
  getShopReviewTags,
  type GetShopReviewsParams,
} from "@/lib/api/reviews";

export function useShopReviews(shopId: string, params?: GetShopReviewsParams) {
  return useQuery({
    queryKey: ["shopReviews", shopId, params],
    queryFn: () => getShopReviews(shopId, params),
    enabled: !!shopId,
  });
}

export function useShopReviewTags(shopId: string) {
  return useQuery({
    queryKey: ["shopReviewTags", shopId],
    queryFn: () => getShopReviewTags(shopId),
    enabled: !!shopId,
  });
}
