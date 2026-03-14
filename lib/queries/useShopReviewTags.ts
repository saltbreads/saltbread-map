import { useQuery } from "@tanstack/react-query";
import { getShopReviewTags } from "@/lib/api/reviews";

export function useShopReviewTags(shopId: string) {
  return useQuery({
    queryKey: ["shopReviewTags", shopId],
    queryFn: () => getShopReviewTags(shopId),
    enabled: !!shopId,
  });
}
