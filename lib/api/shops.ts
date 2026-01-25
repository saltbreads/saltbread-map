export type ShopLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type ShopsLocationsResponse = {
  success: boolean;
  data: ShopLocation[];
};

export async function getShopLocations(): Promise<ShopLocation[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log(`env : ${baseUrl}`);
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");

  const res = await fetch(`${baseUrl}/shops/locations`, {
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

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Invalid response from /shops/locations");
  }

  return json.data;
}
