"use client";

import { useEffect, useRef } from "react";
import { saltBreadShopsMock } from "@/lib/data/saltBreadShops.mock";

export default function NaverMapView() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const { naver } = window;

    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(35.8779, 128.6285),
      zoom: 16,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);

    saltBreadShopsMock.forEach((shop) => {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(shop.lat, shop.lng),
        map: map,
        title: shop.name,
        icon: {
          url: "/image/saltBreadPin.png",
          size: new naver.maps.Size(50, 52),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(25, 26),
        },
      });
    });
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}
