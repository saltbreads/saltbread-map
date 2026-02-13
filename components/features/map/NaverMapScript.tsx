"use client";

import Script from "next/script";

/**
 *  NaverMapScript
 *
 * 역할:
 * - 네이버 지도 Web SDK(maps.js)를 브라우저에 로드하는 전용 컴포넌트
 * - App Router 환경에서 안전하게 <Script>를 통해 외부 SDK를 주입한다.
 *
 * 왜 필요한가?
 * - naver.maps, naver.maps.Service.reverseGeocode 등은
 *   이 SDK가 로드된 이후에만 사용할 수 있기 때문.
 *
 * 주의사항:
 * - 반드시 클라이언트 컴포넌트여야 한다. ("use client")
 * - ncpKeyId는 환경변수(NEXT_PUBLIC_NAVER_MAP_CLIENT_ID)로 전달받는다.
 * - submodules=geocoder를 포함해야 reverseGeocode 사용 가능.
 */
export function NaverMapScript({ ncpKeyId }: { ncpKeyId: string }) {
  const src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${ncpKeyId}&submodules=geocoder`;

  return <Script src={src} strategy="afterInteractive" />;
}
