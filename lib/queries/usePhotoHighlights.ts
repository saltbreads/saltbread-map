import { useQuery } from "@tanstack/react-query";
import { getPhotoHighlights } from "../api/shops";

export function usePhotoHighlights(shopId: string, open: boolean) {
  return useQuery({
    queryKey: ["photo-highlights", shopId],
    queryFn: () => getPhotoHighlights(shopId),
    enabled: open && !!shopId,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });
}
