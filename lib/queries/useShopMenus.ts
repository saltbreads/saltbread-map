import { useQuery } from "@tanstack/react-query";
import { getShopMenus } from "@/lib/api/shops";

export function useShopMenus(shopId: string, enabled = true) {
  return useQuery({
    queryKey: ["shopMenus", shopId],
    queryFn: () => getShopMenus(shopId),
    enabled: enabled && !!shopId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
