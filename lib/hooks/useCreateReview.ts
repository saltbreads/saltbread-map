import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReview } from "@/lib/api/reviews";

export function useCreateReview(shopId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      rating: number;
      content?: string;
      imageUrls?: string[];
    }) => postReview({ shopId, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopReviews", shopId] });
      queryClient.invalidateQueries({ queryKey: ["shopReviewTags", shopId] });
    },
  });
}
