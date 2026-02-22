import { http } from "@/lib/http/client";
import type { ApiEnvelope } from "@/lib/http/types";
import { unwrap } from "@/lib/http/unwrap";

export type ShopLocationDto = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type ShopLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export async function getShopLocations(): Promise<ShopLocation[]> {
  const res = await http.get<ApiEnvelope<ShopLocationDto[]>>(
    "/shops/locations"
  );

  const data = unwrap(res.data, res.status);

  if (!Array.isArray(data)) {
    throw new Error("Invalid response from /shops/locations");
  }

  return data.map((s) => ({
    id: s.id,
    name: s.name,
    lat: s.latitude,
    lng: s.longitude,
  }));
}

export type GetSearchShopsParams = {
  lat: number;
  lng: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
  search?: string;
};

export type SearchShopItem = {
  id: string;
  name: string;
  heroImageUrl: string | null;
  latitude: number;
  longitude: number;
  avgRating: number;
  reviewCount: number;
  avgPrice: number | null;
  bestLabels: string[];
  isLiked?: boolean;
};

export async function getSearchShops(
  params: GetSearchShopsParams
): Promise<SearchShopItem[]> {
  const res = await http.get<ApiEnvelope<SearchShopItem[]>>("/shops/search", {
    params: {
      lat: params.lat,
      lng: params.lng,
      ...(params.radiusKm != null ? { radiusKm: params.radiusKm } : {}),
      ...(params.limit != null ? { limit: params.limit } : {}),
      ...(params.offset != null ? { offset: params.offset } : {}),
      ...(params.search ? { search: params.search } : {}),
    },
  });

  const data = unwrap(res.data, res.status);

  if (!Array.isArray(data)) {
    throw new Error("Invalid response from /shops/search");
  }

  return data;
}
