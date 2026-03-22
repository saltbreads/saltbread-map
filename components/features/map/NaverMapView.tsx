"use client";

import { useEffect, useRef } from "react";
import { getShopLocations, type ShopLocation } from "@/lib/api/shops";

export default function NaverMapView() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    // 기존 마커 제거
    const clearMarkers = () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };

    // 기존 클러스터 제거
    const clearCluster = () => {
      if (clusterRef.current) {
        clusterRef.current.setMap(null);
        clusterRef.current = null;
      }
    };

    // 네이버 지도 스크립트 로드 대기
    const waitForNaver = (): Promise<typeof window.naver> => {
      return new Promise((resolve, reject) => {
        let count = 0;

        const timer = window.setInterval(() => {
          // window.naver.maps가 생성되면 로드 완료
          if (window.naver?.maps) {
            clearInterval(timer);
            resolve(window.naver);
            return;
          }

          // 타임아웃 처리 (약 5초)
          count += 1;
          if (count > 50) {
            clearInterval(timer);
            reject(new Error("네이버 지도 스크립트 로드 타임아웃"));
          }
        }, 100);
      });
    };

    const initMap = async () => {
      if (!mapElementRef.current) return;

      try {
        const naver = await waitForNaver();
        if (cancelled) return;

        //  지도 생성
        const map = new naver.maps.Map(mapElementRef.current, {
          center: new naver.maps.LatLng(35.8779, 128.6285), // 초기 중심 (동대구)
          zoom: 11, // 초기 줌 (도시 단위 보기)
        });

        mapInstanceRef.current = map;

        // 클러스터링 라이브러리 + 가게 데이터 동시에 로드
        const [{ default: MarkerClustering }, shops] = await Promise.all([
          import("./markerclustering"),
          getShopLocations(),
        ]);

        if (cancelled) return;

        clearMarkers();
        clearCluster();

        // 마커 생성
        const markers = shops.map((shop: ShopLocation) => {
          return new naver.maps.Marker({
            position: new naver.maps.LatLng(Number(shop.lat), Number(shop.lng)),
            title: shop.name,
            icon: {
              url: "/image/saltBreadPin.png", // 기본 마커 이미지
              size: new naver.maps.Size(50, 50),
              anchor: new naver.maps.Point(25, 25), // 중심 기준점
            },
          });
        });

        markersRef.current = markers;

        // 클러스터 생성
        clusterRef.current = new MarkerClustering({
          map, // 클러스터가 표시될 지도
          markers, // 클러스터링 대상 마커 배열

          disableClickZoom: false,
          // true → 클릭해도 줌 안됨
          // false → 클릭하면 확대됨 (일반적으로 false 사용)

          minClusterSize: 1,
          // 클러스터 최소 개수
          // 1 → 단일 마커도 클러스터 스타일로 처리 가능 (디자인 통일용)
          // 보통은 2 사용

          maxZoom: 14,
          // 이 줌 이상에서는 클러스터 해제 → 개별 마커 표시

          gridSize: 70,
          // 클러스터 묶는 거리 기준 (px)
          // 작을수록 촘촘하게 나뉨 / 클수록 크게 묶임

          averageCenter: false,
          // true → 클러스터 중심을 평균 좌표로 이동
          // false → 기존 위치 유지 (보통 false가 자연스러움)

          icons: [
            // 🔸 클러스터 아이콘 디자인 (3단계)
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
          // 클러스터 크기 기준
          // 0~9 → icons[0]
          // 10~29 → icons[1]
          // 30+ → icons[2]

          // 클러스터 내부 숫자 표시
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
        console.error("지도/클러스터 초기화 실패:", error);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      clearMarkers();
      clearCluster();
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapElementRef} className="h-full w-full" />;
}
