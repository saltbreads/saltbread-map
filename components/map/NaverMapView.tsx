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
      zoom: 16,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);

    // 네이버 기본 마커 사용하기
    // saltBreadShopsMock.forEach((shop) => {
    //   new naver.maps.Marker({
    //     position: new naver.maps.LatLng(shop.lat, shop.lng),
    //     map: map, // 이 마커가 어떤 지도 위에 올라갈지 지정
    //     title: shop.name, // 마우스를 올렸을 때 뜨는 이름
    //   });
    // });

    // 커스텀 마커 사용하기
    saltBreadShopsMock.forEach((shop) => {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(shop.lat, shop.lng),
        map: map,
        title: shop.name,
        icon: {
          url: "/image/bread.png",
          size: new naver.maps.Size(50, 52),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 26),
        },
      });
    });
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
