"use client";

import { useEffect, useRef, useState } from "react";
import { getShopLocations, type ShopLocation } from "@/lib/api/shops";
import { useSelectedShopStore } from "@/lib/store/useSelectedShopStore";

export default function NaverMapView() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const openShopDetail = useSelectedShopStore((state) => state.openShopDetail);
  const selectedShop = useSelectedShopStore((state) => state.selectedShop);

  const waitForNaver = (): Promise<typeof window.naver> => {
    return new Promise((resolve, reject) => {
      let count = 0;

      const timer = window.setInterval(() => {
        if (window.naver?.maps) {
          clearInterval(timer);
          resolve(window.naver);
          return;
        }

        count += 1;
        if (count > 50) {
          clearInterval(timer);
          reject(new Error("네이버 지도 스크립트 로드 타임아웃"));
        }
      }, 100);
    });
  };

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      if (!mapElementRef.current) return;

      try {
        const naver = await waitForNaver();
        if (cancelled) return;
        if (mapInstanceRef.current) return;

        const map = new naver.maps.Map(mapElementRef.current, {
          center: new naver.maps.LatLng(35.8779, 128.6285),
          zoom: 15,
        });

        mapInstanceRef.current = map;
        setIsMapReady(true);
      } catch (error) {
        console.error("지도 초기화 실패:", error);
      }
    };

    initMap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const clearMarkers = () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };

    const clearCluster = () => {
      if (clusterRef.current) {
        clusterRef.current.setMap(null);
        clusterRef.current = null;
      }
    };

    const renderMarkers = async () => {
      if (!isMapReady) return;
      if (!mapInstanceRef.current) return;

      try {
        const naver = await waitForNaver();
        if (cancelled) return;

        const map = mapInstanceRef.current;
        if (!map) return;

        const [{ default: MarkerClustering }, shops] = await Promise.all([
          import("./markerclustering"),
          getShopLocations(),
        ]);

        if (cancelled) return;

        clearMarkers();
        clearCluster();

        const markers = shops.map((shop: ShopLocation) => {
          const isSelected = selectedShop?.id === shop.id;

          const markerSize = isSelected ? 50 : 30;
          const anchorSize = isSelected ? 34 : 25;

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(Number(shop.lat), Number(shop.lng)),
            title: shop.name,
            icon: {
              url: "/image/saltBreadPin.png",
              size: new naver.maps.Size(markerSize, markerSize),
              scaledSize: new naver.maps.Size(markerSize, markerSize),
              anchor: new naver.maps.Point(anchorSize, anchorSize),
            },
            zIndex: isSelected ? 100 : 1,
          });

          naver.maps.Event.addListener(marker, "click", () => {
            if (selectedShop?.id === shop.id) return;

            openShopDetail({
              id: shop.id,
              lat: Number(shop.lat),
              lng: Number(shop.lng),
              name: shop.name,
            });
          });

          return marker;
        });

        markersRef.current = markers;

        clusterRef.current = new MarkerClustering({
          map,
          markers,
          disableClickZoom: false,
          minClusterSize: 1,
          maxZoom: 14,
          gridSize: 70,
          averageCenter: false,
          icons: [
            {
              content: `
                <div style="
                  width:40px;
                  height:40px;
                  border-radius:9999px;
                  background:#ff8a5b;
                  color:#fff;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-weight:700;
                  font-size:14px;
                  box-shadow:0 2px 6px rgba(0,0,0,0.2);
                ">
                  <span class="cluster-count">0</span>
                </div>
              `,
              size: new naver.maps.Size(40, 40),
              anchor: new naver.maps.Point(20, 20),
            },
            {
              content: `
                <div style="
                  width:46px;
                  height:46px;
                  border-radius:9999px;
                  background:#ff6b6b;
                  color:#fff;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-weight:700;
                  font-size:14px;
                  box-shadow:0 2px 6px rgba(0,0,0,0.2);
                ">
                  <span class="cluster-count">0</span>
                </div>
              `,
              size: new naver.maps.Size(46, 46),
              anchor: new naver.maps.Point(23, 23),
            },
            {
              content: `
                <div style="
                  width:52px;
                  height:52px;
                  border-radius:9999px;
                  background:#ffb347;
                  color:#fff;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-weight:700;
                  font-size:15px;
                  box-shadow:0 2px 6px rgba(0,0,0,0.2);
                ">
                  <span class="cluster-count">0</span>
                </div>
              `,
              size: new naver.maps.Size(52, 52),
              anchor: new naver.maps.Point(26, 26),
            },
          ],
          indexGenerator: [10, 30],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          stylingFunction: (clusterMarker: any, count: number) => {
            const el = clusterMarker.getElement?.();
            if (!el) return;

            const countEl = el.querySelector(".cluster-count");
            if (countEl) {
              countEl.textContent = count > 99 ? "99+" : String(count);
            }
          },
        });
      } catch (error) {
        console.error("마커/클러스터 초기화 실패:", error);
      }
    };

    renderMarkers();

    return () => {
      cancelled = true;
      clearMarkers();
      clearCluster();
    };
  }, [isMapReady, selectedShop, openShopDetail]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!selectedShop) return;
    if (!window.naver?.maps) return;

    const latLng = new window.naver.maps.LatLng(
      selectedShop.lat,
      selectedShop.lng
    );
    mapInstanceRef.current.panTo(latLng);
  }, [selectedShop]);

  return <div ref={mapElementRef} className="h-full w-full" />;
}
