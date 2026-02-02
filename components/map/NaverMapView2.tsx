"use client";

import { useEffect, useRef } from "react";
import { getShopLocations, type ShopLocation } from "@/lib/api/shops";

export default function NaverMapView2() {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const { naver } = window;

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(35.8779, 128.6285),
      zoom: 16,
    });

    const clearMarkers = () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };

    const renderMarkers = (shops: ShopLocation[]) => {
      clearMarkers();

      markersRef.current = shops.map((shop) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(shop.latitude, shop.longitude),
          map,
          title: shop.name,
          icon: {
            url: "/image/bread.png",
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
