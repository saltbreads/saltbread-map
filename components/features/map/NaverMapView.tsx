"use client";

import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/lib/store/useMapStroe";
import { getShopLocations, type ShopLocation } from "@/lib/api/shops";

function isNaverMapsReady(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.naver?.maps?.Map && window.naver?.maps?.LatLng);
}

export default function NaverMapView() {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  const [sdkReady, setSdkReady] = useState(() => isNaverMapsReady());
  const [locations, setLocations] = useState<ShopLocation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const center = useMapStore((s) => s.center);
  const initialCenterRef = useRef(center);

  // 1) SDK 로드 대기
  useEffect(() => {
    if (sdkReady) return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (isNaverMapsReady()) {
        window.clearInterval(timer);
        setSdkReady(true);
        return;
      }
      if (Date.now() - startedAt > 8000) {
        window.clearInterval(timer);
        console.error("[Map] NAVER SDK TIMEOUT");
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [sdkReady]);

  // 2) 지도 최초 생성 (1번만)
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
  }, [sdkReady]);

  // 3) 백엔드에서 좌표 가져오기 (지도 준비된 뒤)
  useEffect(() => {
    const map = mapRef.current;
    if (!sdkReady || !map) return;

    let canceled = false;

    (async () => {
      try {
        setError(null);
        const data = await getShopLocations();
        if (canceled) return;
        setLocations(data);
      } catch (e) {
        if (canceled) return;
        setError(e instanceof Error ? e.message : "Failed to load locations");
      }
    })();

    return () => {
      canceled = true;
    };
  }, [sdkReady]);

  // 4) locations 바뀌면 마커 다시 그리기
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!sdkReady) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const { naver } = window;

    // 새 마커 생성
    const markers = locations.map(
      (shop) =>
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
        })
    );

    markersRef.current = markers;
  }, [sdkReady, locations]);

  // 5) center 바뀌면 panTo
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.panTo(new window.naver.maps.LatLng(center.lat, center.lng));
  }, [center.lat, center.lng]);

  return (
    <div className="relative w-full h-full">
      <div ref={elRef} style={{ width: "100%", height: "100%" }} />

      {/* 선택: 에러 났을 때만 얇게 표시 */}
      {error ? (
        <div className="absolute top-3 left-3 rounded-lg border bg-white px-3 py-2 text-xs font-semibold">
          위치 데이터를 불러오지 못했어: {error}
        </div>
      ) : null}
    </div>
  );
}
