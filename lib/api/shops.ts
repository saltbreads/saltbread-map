// lib/api/shops.ts
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

type ShopsLocationsResponse = {
  success: boolean;
  data: ShopLocationDto[];
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getShopLocations(): Promise<ShopLocation[]> {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(`${BASE_URL}/shops/locations`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch /shops/locations: ${res.status} ${res.statusText}`
    );
  }

  const json = (await res.json()) as ShopsLocationsResponse;

  if (!json?.success || !Array.isArray(json.data)) {
    throw new Error("Invalid response from /shops/locations");
  }

  //  프론트에서 쓰기 좋게 lat/lng로 normalize
  return json.data.map((s) => ({
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

export async function getSearchShops(params: GetSearchShopsParams) {
  if (!BASE_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const query = new URLSearchParams();

  query.append("lat", params.lat.toString());
  query.append("lng", params.lng.toString());

  if (params.radiusKm != null)
    query.append("radiusKm", String(params.radiusKm));
  if (params.limit != null) query.append("limit", String(params.limit));
  if (params.offset != null) query.append("offset", String(params.offset));
  if (params.search) query.append("search", params.search);

  const res = await fetch(`${BASE_URL}/shops/search?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("가게 조회 실패");

  const json = await res.json(); // { success, data }

  if (!json?.success || !Array.isArray(json.data)) {
    throw new Error("Invalid response from /shops/search");
  }

  return json.data as SearchShopItem[];
}
