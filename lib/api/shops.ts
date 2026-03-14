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

export type PhotoHighlightsResponse = {
  hero: { url: string } | null;
  items: {
    id: string;
    url: string;
    reviewId: string;
    createdAt: string;
  }[];
  total: number;
};

export async function getPhotoHighlights(
  shopId: string
): Promise<PhotoHighlightsResponse> {
  const res = await http.get<ApiEnvelope<PhotoHighlightsResponse>>(
    `/shops/${shopId}/photo-highlights`
  );

  return unwrap(res.data, res.status);
}

export type ShopHomeDto = {
  shopId: string;
  name: string;
  address: {
    road: string | null;
    jibun: string | null;
  };
  telephone: string | null;
  hoursRaw: string | null;
  links: {
    website: string | null;
    instagram: string | null;
    kakao: string | null;
    etc: {
      type: string;
      url: string;
      label: string | null;
      isPrimary: boolean;
    }[];
  };
};

export async function getShopHome(shopId: string): Promise<ShopHomeDto> {
  const res = await http.get<ApiEnvelope<ShopHomeDto>>(`/shops/${shopId}/home`);

  const data = unwrap(res.data, res.status);

  if (!data) {
    throw new Error(`Invalid response from /shops/${shopId}/home`);
  }

  return data;
}

export type ShopMenuDto = {
  id: string;
  name: string;
  price: number | null;
  priceText: string | null;
  displayPrice: number | string | null;
  imageUrl: string | null;
};

export async function getShopMenus(shopId: string): Promise<ShopMenuDto[]> {
  const res = await http.get<ApiEnvelope<ShopMenuDto[]>>(
    `/shops/${shopId}/menus`
  );

  const data = unwrap(res.data, res.status);

  if (!Array.isArray(data)) {
    throw new Error(`Invalid response from /shops/${shopId}/menus`);
  }

  return data;
}
