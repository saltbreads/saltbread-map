"use client";

import { useEffect, useRef, useState } from "react";
import { saltBreadShopsMock } from "@/lib/data/saltBreadShops.mock";
import { useMapStore } from "@/lib/store/useMapStroe";

function isNaverMapsReady(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.naver?.maps?.Map && window.naver?.maps?.LatLng);
}

export default function NaverMapView() {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);

  // 초기 렌더에서 준비 여부를 바로 계산 (effect에서 동기 setState 제거)
  const [sdkReady, setSdkReady] = useState(() => isNaverMapsReady());

  const center = useMapStore((s) => s.center);

  // 최초 center만 고정 (지도 최초 생성에만 사용)
  const initialCenterRef = useRef(center);

  // 1) SDK 로드 대기 (준비 안 된 경우에만 폴링)
  useEffect(() => {
    if (sdkReady) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (isNaverMapsReady()) {
        window.clearInterval(timer);
        setSdkReady(true); // ✅ 콜백에서 setState
        return;
      }
      if (Date.now() - startedAt > 8000) {
        window.clearInterval(timer);
        console.error("[Map] NAVER SDK TIMEOUT");
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [sdkReady]);

  // 2) 지도 최초 생성 (SDK 준비 + DOM 준비 시 1번만)
  useEffect(() => {
    if (!sdkReady) return;
    if (!elRef.current) return;
    if (mapRef.current) return;

    const { naver } = window;

    const { lat, lng } = initialCenterRef.current;

    const map = new naver.maps.Map(elRef.current, {
      center: new naver.maps.LatLng(lat, lng),
      zoom: 15,
    });

    mapRef.current = map;

    // 마커 생성
    saltBreadShopsMock.forEach((shop) => {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(shop.lat, shop.lng),
        map,
        title: shop.name,
        icon: {
          url: "/image/saltBreadPin.png",
          size: new naver.maps.Size(50, 52),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 26),
        },
      });
    });
  }, [sdkReady]);

  // 3) center 바뀌면 panTo (지도는 재생성 X, 이동만)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.panTo(new window.naver.maps.LatLng(center.lat, center.lng));
  }, [center.lat, center.lng]);

  return <div ref={elRef} style={{ width: "100%", height: "100%" }} />;
}
