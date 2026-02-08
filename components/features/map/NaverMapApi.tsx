"use client";

import { useEffect, useRef } from "react";
import { getShopLocations, type ShopLocation } from "@/lib/api/shops";

/**
 * API 기반 마커 렌더링 참고 구현체
 * 백엔드 리팩토링 이후 getShopLocations 연동 시 참고용
 */
export default function NaverMapViewApi() {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const { naver } = window;

    const map = new naver.maps.Map(mapRef.current, {
      // 지도의 초기 중심 좌표 (현재 설정: 동대구역)
      center: new naver.maps.LatLng(35.8779, 128.6285),
      // 초기 확대 레벨 (1~21, 숫자가 클수록 가까이 보임)
      zoom: 16,
    });

    const clearMarkers = () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };

    const renderMarkers = (shops: ShopLocation[]) => {
      clearMarkers();

      // 네이버 기본 마커 사용하기
      // saltBreadShopsMock.forEach((shop) => {
      //   new naver.maps.Marker({
      //     position: new naver.maps.LatLng(shop.lat, shop.lng),
      //     map: map, // 이 마커가 어떤 지도 위에 올라갈지 지정
      //     title: shop.name, // 마우스를 올렸을 때 뜨는 이름
      //   });
      // });

      // 커스텀 마커 사용하기
      markersRef.current = shops.map((shop) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(shop.latitude, shop.longitude),
          map,
          title: shop.name,
          icon: {
            url: "/image/saltBreadPin.png",
            size: new naver.maps.Size(50, 50),
            anchor: new naver.maps.Point(25, 26),
          },
        });

        return marker;
      });
    };

    (async () => {
      try {
        const shops = await getShopLocations();
        renderMarkers(shops);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      clearMarkers();
    };
  }, []);

  return <div ref={mapRef} className="w-full h-full" />;
}
