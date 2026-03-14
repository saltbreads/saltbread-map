import { useQuery } from "@tanstack/react-query";
import { getShopHome } from "@/lib/api/shops";

export function useShopHome(shopId: string, enabled = true) {
  return useQuery({
    queryKey: ["shopHome", shopId],
    queryFn: () => getShopHome(shopId),
    enabled: enabled && !!shopId,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
  });
}
