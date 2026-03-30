import type { ShopHomeDto } from "@/lib/api/shops";

type BusinessStatus = "OPEN" | "CLOSED" | "BREAK" | "UNKNOWN";

export function mapShopHomeToSectionProps(data: ShopHomeDto) {
  const displayAddress =
    data.address.road ?? data.address.jibun ?? "주소 정보 없음";

  const businessStatus: BusinessStatus = "UNKNOWN";

  return {
    name: data.name,
    address: {
      display: displayAddress,
      road: data.address.road ?? undefined,
      jibun: data.address.jibun ?? undefined,
      zip: undefined,
    },
    transit: undefined,
    business: {
      status: businessStatus,
      statusText: data.hoursRaw
        ? "영업시간 정보 확인 필요"
        : "영업시간 정보 없음",
      todayText: data.hoursRaw ?? undefined,
      weekly: [],
    },
    phone: {
      label: "전화번호 보기",
      number: data.telephone ?? undefined,
    },
    links: {
      website: data.links.website ?? undefined,
      instagram: data.links.instagram ?? undefined,
      kakao: data.links.kakao ?? undefined,
    },
  };
}
