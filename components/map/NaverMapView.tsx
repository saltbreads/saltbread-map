"use client";

import { useEffect, useRef } from "react";
import { saltBreadShopsMock } from "@/lib/data/saltBreadShops.mock";
export default function NaverMapView() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const { naver } = window;

    const mapOptions: naver.maps.MapOptions = {
      // 지도의 초기 중심 좌표 (현재 설정: 동대구역)
      center: new naver.maps.LatLng(35.8779, 128.6285),
      // 초기 확대 레벨 (1~21, 숫자가 클수록 가까이 보임)
      zoom: 14,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);

    saltBreadShopsMock.forEach((shop) => {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(shop.lat, shop.lng),
        map: map, // 이 마커가 어떤 지도 위에 올라갈지 지정
        title: shop.name, // 마우스를 올렸을 때 뜨는 이름
      });
    });
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
