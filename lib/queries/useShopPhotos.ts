import { useInfiniteQuery } from "@tanstack/react-query";
import { getShopPhotos } from "@/lib/api/shops";

type Params = {
  limit?: number;
};

export function useShopPhotos(shopId: string, params?: Params) {
  return useInfiniteQuery({
    queryKey: ["shopPhotos", shopId, params?.limit ?? 20],
    queryFn: ({ pageParam }) =>
      getShopPhotos(shopId, {
        limit: params?.limit ?? 20,
        cursor: pageParam ?? null,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : null,
    enabled: !!shopId,
  });
}
