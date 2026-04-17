"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getShopLocations, type ShopLocation } from "@/lib/api/shops";
import { useSelectedShopStore } from "@/lib/store/useSelectedShopStore";
import { useMapStore } from "@/lib/store/useMapStroe";
import { useClusterShopStore } from "@/lib/store/useClusterShopStore"; // ✅ 클러스터 리스트 store 추가
import { ClusterShopNameList } from "@/components/features/shop/ClusterShopNameList"; // ✅ 지도 위 이름 리스트 오버레이 컴포넌트 추가
import { useSidebarStore } from "@/lib/store/useSidebarStore";

type MarkerWithShopData = naver.maps.Marker & {
  __shopData?: {
    id: string;
    name: string;
    lat: number;
    lng: number;
  };
};

// markerclustering에서 넘어오는 cluster 타입 최소 정의
type NaverCluster = {
  getMarkers: () => naver.maps.Marker[];
  getCenter: () => naver.maps.LatLng;
};

// setMap 사용 여부만 확인하기 위한 최소 타입
type ClusterWithSetMap = {
  setMap?: (map: naver.maps.Map | null) => void;
};

type OverlayPosition = {
  left: number;
  top: number;
};

export default function NaverMapView() {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const clusterRef = useRef<unknown>(null);
  const resizeTimeoutRef = useRef<number | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // 클릭한 클러스터 중심 좌표를 저장해두고, 지도 이동/줌 시 필요한 흐름에 사용
  const clusterCenterRef = useRef<naver.maps.LatLng | null>(null);

  // 상세 모달이 열려 있을 때, 클러스터 클릭 후 "살짝 오른쪽으로 민 센터 좌표"를 저장
  const shiftedCenterRef = useRef<naver.maps.LatLng | null>(null);

  // 클러스터 클릭 직후 map click 이벤트가 연달아 들어와 오버레이가 닫히는 현상을 막기 위한 플래그
  const ignoreNextMapClickRef = useRef(false);

  // 지도 위 이름 리스트의 실제 픽셀 위치
  const [overlayPosition, setOverlayPosition] = useState<OverlayPosition>({
    left: 0,
    top: 0,
  });

  const openShopDetail = useSelectedShopStore((state) => state.openShopDetail);
  const selectedShop = useSelectedShopStore((state) => state.selectedShop);
  const isSidePanelOpen = useSelectedShopStore(
    (state) => state.isSidePanelOpen
  ); // 상세 모달 열림 여부에 따라 지도 중심 이동/오버레이 배치 전략 분기

  const center = useMapStore((s) => s.center);
  const setCenter = useMapStore((s) => s.setCenter);

  const isSidebarOpen = useSidebarStore((s) => s.isOpen);

  const openClusterList = useClusterShopStore((s) => s.openClusterList); // ✅ 클러스터 리스트 열기 함수
  const clusterShops = useClusterShopStore((s) => s.clusterShops); // ✅ 지도 위에 띄울 클러스터 가게 목록
  const isClusterListOpen = useClusterShopStore((s) => s.isClusterListOpen); // ✅ 클러스터 이름 리스트 표시 여부
  const clearClusterList = useClusterShopStore((s) => s.clearClusterList); // ✅ 클러스터 이름 리스트 닫기 함수

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

  // 특정 좌표를 화면 픽셀 기준으로 좌우/상하 오프셋한 새로운 지도 좌표로 변환
  //   - 상세 모달이 열렸을 때 클러스터 중심을 "살짝 오른쪽"으로 밀어 배치하기 위해 사용
  const getShiftedLatLng = useCallback(
    (
      baseLatLng: naver.maps.LatLng,
      offsetX: number,
      offsetY: number
    ): naver.maps.LatLng => {
      const map = mapInstanceRef.current;

      if (!map || !window.naver?.maps) {
        return baseLatLng;
      }

      const projection = map.getProjection();
      if (!projection) {
        return baseLatLng;
      }

      const baseOffset = projection.fromCoordToOffset(baseLatLng);

      const shiftedCoord = projection.fromOffsetToCoord(
        new window.naver.maps.Point(
          baseOffset.x + offsetX,
          baseOffset.y + offsetY
        )
      );

      // fromOffsetToCoord 결과는 TS 상 Coord 로 잡히므로,
      // 최종적으로 LatLng 객체를 명시적으로 다시 만들어 반환
      return new window.naver.maps.LatLng(
        Number(shiftedCoord.y),
        Number(shiftedCoord.x)
      );
    },
    []
  );

  // 상세 모달이 열려 있을 때:
  // 지도 좌표와 무관하게, 화면 안의 거의 고정된 위치에 이름 리스트를 배치
  const getSidePanelOpenOverlayPosition = useCallback(() => {
    const mapElement = mapElementRef.current;

    if (!mapElement) {
      return { left: 0, top: 0 };
    }

    const overlayWidth = 288; // w-72 기준
    const overlayHeight = 180; // 현재 리스트 UI 기준 대략적인 높이
    const margin = 12;

    // 기존에 잘 맞았던 위치 유지
    const anchorX = mapElement.clientWidth * 0.56;
    const anchorY = mapElement.clientHeight * 0.5;

    const left = Math.max(
      margin,
      Math.min(anchorX, mapElement.clientWidth - overlayWidth - margin)
    );

    const top = Math.max(
      margin,
      Math.min(
        anchorY - overlayHeight / 2,
        mapElement.clientHeight - overlayHeight - margin
      )
    );

    return { left, top };
  }, []);

  // 상세 모달이 닫혀 있을 때:
  // 클러스터 위치를 따라다니지 않고, 화면 기준 고정 위치에 이름 리스트를 배치
  const getSidePanelClosedOverlayPosition = useCallback(() => {
    const mapElement = mapElementRef.current;

    if (!mapElement) {
      return { left: 0, top: 0 };
    }

    const overlayWidth = 288; // w-72 기준
    const overlayHeight = 180; // 현재 리스트 UI 기준 대략적인 높이
    const margin = 12;

    // 닫힘 상태에서는 지도 중앙 기준 + 살짝 오른쪽에 고정
    const centerX = mapElement.clientWidth * 0.5;
    const centerY = mapElement.clientHeight * 0.5;
    const anchorX = centerX + 120;
    const anchorY = centerY;

    const left = Math.max(
      margin,
      Math.min(anchorX, mapElement.clientWidth - overlayWidth - margin)
    );

    const top = Math.max(
      margin,
      Math.min(
        anchorY - overlayHeight / 2,
        mapElement.clientHeight - overlayHeight - margin
      )
    );

    return { left, top };
  }, []);

  // ✅ 현재 상태에 맞게 오버레이 위치를 계산하는 통합 함수
  const getOverlayPosition = useCallback((): OverlayPosition => {
    if (isSidePanelOpen) {
      return getSidePanelOpenOverlayPosition();
    }

    return getSidePanelClosedOverlayPosition();
  }, [
    isSidePanelOpen,
    getSidePanelOpenOverlayPosition,
    getSidePanelClosedOverlayPosition,
  ]);

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

  /**
   * 사이드바 열림/닫힘으로 지도 컨테이너 크기가 바뀔 때
   * 강제 재마운트 대신 브라우저 resize 이벤트를 발생시켜
   * 지도 라이브러리가 현재 컨테이너 크기에 맞춰 다시 계산하도록 유도
   * - transition-[width] duration-300 과 맞춰 약간 기다렸다가 한 번 더 호출
   * - 현재 center 기준으로 다시 panTo 해서 보이는 위치가 어색하게 밀리지 않도록 보정
   */
  useEffect(() => {
    if (!isMapReady) return;
    if (!mapInstanceRef.current) return;
    if (!window.naver?.maps) return;

    const triggerMapResize = () => {
      window.dispatchEvent(new Event("resize"));

      const map = mapInstanceRef.current;
      if (!map) return;

      const latLng = new window.naver.maps.LatLng(center.lat, center.lng);
      map.panTo(latLng);

      if (useClusterShopStore.getState().isClusterListOpen) {
        setOverlayPosition(getOverlayPosition());
      }
    };

    // width transition 시작 직후 한 번
    triggerMapResize();

    // width transition 종료 시점에 한 번 더
    if (resizeTimeoutRef.current) {
      window.clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = window.setTimeout(() => {
      triggerMapResize();
    }, 320);

    return () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, [isSidebarOpen, isMapReady, center.lat, center.lng, getOverlayPosition]);

  useEffect(() => {
    let cancelled = false;

    const clearMarkers = () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };

    const clearCluster = () => {
      const cluster = clusterRef.current as ClusterWithSetMap | null;

      if (cluster?.setMap) {
        cluster.setMap(null);
      }

      clusterRef.current = null;
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

          // 클러스터 클릭 시 다시 꺼내 쓸 수 있도록
          // 각 마커 객체에 가게 정보를 직접 저장
          (marker as MarkerWithShopData).__shopData = {
            id: shop.id,
            name: shop.name,
            lat: Number(shop.lat),
            lng: Number(shop.lng),
          };

          naver.maps.Event.addListener(marker, "click", () => {
            if (selectedShop?.id === shop.id) return;

            // 일반 마커를 직접 클릭했을 때는 클러스터 이름 리스트를 닫음
            clearClusterList();
            clusterCenterRef.current = null;
            shiftedCenterRef.current = null;
            ignoreNextMapClickRef.current = false;

            openShopDetail({
              id: shop.id,
              lat: Number(shop.lat),
              lng: Number(shop.lng),
              name: shop.name,
            });

            setCenter(
              {
                lat: Number(shop.lat),
                lng: Number(shop.lng),
              },
              "shopClick"
            );
          });

          return marker;
        });

        markersRef.current = markers;

        const clusterInstance = new MarkerClustering({
          map,
          markers,
          disableClickZoom: true,
          minClusterSize: 1,
          maxZoom: 14,
          gridSize: 100,
          averageCenter: false,
          icons: [
            {
              content: `
                <div style="
                  width:48px;
                  height:48px;
                  border-radius:9999px;
                  background:#fff;
                  border:4px solid #93643e; /* 브랜드 컬러 */
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  font-weight:700;
                  font-size:14px;
                  color:#cc9666; /* 숫자도 브랜드 컬러 */
                  box-shadow:0 4px 10px rgba(0,0,0,0.15);
                ">
                  <span class="cluster-count">0</span>
                </div>
              `,
              size: new naver.maps.Size(48, 48),
              anchor: new naver.maps.Point(24, 24),
            },
          ],
          indexGenerator: [10, 30],
          stylingFunction: (
            clusterMarker: { getElement?: () => Element | null },
            count: number
          ) => {
            const el = clusterMarker.getElement?.();
            if (!el) return;

            const countEl = el.querySelector(".cluster-count");
            if (countEl) {
              countEl.textContent = count > 99 ? "99+" : String(count);
            }
          },
        });

        clusterRef.current = clusterInstance;

        // 클러스터 클릭 이벤트 추가
        naver.maps.Event.addListener(
          clusterInstance,
          "clusterclick",
          (cluster: NaverCluster) => {
            const markers = cluster.getMarkers();

            const shops = markers
              .map((marker) => (marker as MarkerWithShopData).__shopData)
              .filter(
                (shop): shop is NonNullable<MarkerWithShopData["__shopData"]> =>
                  Boolean(shop)
              );

            // 클러스터 클릭 직후 발생하는 map click은 한 번 무시해서 깜박임 방지
            ignoreNextMapClickRef.current = true;

            // 클릭한 클러스터 중심 좌표를 저장
            const clusterCenter = cluster.getCenter();
            clusterCenterRef.current = clusterCenter;

            if (isSidePanelOpen) {
              // 상세 모달이 열려 있을 때는
              // 클러스터를 화면 중심보다 살짝 왼쪽에 보이게 만들기 위해
              // 지도 중심 좌표를 "클러스터보다 오른쪽"으로 이동
              const shiftedCenter = getShiftedLatLng(clusterCenter, 140, 0);
              shiftedCenterRef.current = shiftedCenter;

              map.panTo(shiftedCenter);
            } else {
              // 상세 모달이 닫혀 있을 때는 기존처럼 클러스터를 중앙 쪽으로 이동
              shiftedCenterRef.current = null;

              map.panTo(clusterCenter);
            }

            // 오버레이는 이제 상태별 고정 위치를 사용
            const nextPosition = getOverlayPosition();
            setOverlayPosition(nextPosition);

            // 클러스터 리스트 store에 저장 → 지도 위 이름 리스트 오버레이 렌더링
            openClusterList(shops);
          }
        );

        // 지도 이동/줌 이후에도 오버레이 위치를 다시 계산
        naver.maps.Event.addListener(map, "idle", () => {
          if (!useClusterShopStore.getState().isClusterListOpen) return;

          const nextPosition = getOverlayPosition();
          setOverlayPosition(nextPosition);
        });

        // 지도 빈 영역을 클릭하면 이름 리스트 닫기
        naver.maps.Event.addListener(map, "click", () => {
          // 클러스터 클릭 직후 이어서 들어오는 map click 한 번은 무시
          if (ignoreNextMapClickRef.current) {
            ignoreNextMapClickRef.current = false;
            return;
          }

          clearClusterList();
          clusterCenterRef.current = null;
          shiftedCenterRef.current = null;
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
  }, [
    isMapReady,
    selectedShop,
    openShopDetail,
    setCenter,
    openClusterList,
    clearClusterList,
    isSidePanelOpen,
    getShiftedLatLng,
    getOverlayPosition,
  ]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (!window.naver?.maps) return;

    const latLng = new window.naver.maps.LatLng(center.lat, center.lng);

    mapInstanceRef.current.panTo(latLng);
  }, [center]);

  return (
    // 지도 위 오버레이를 띄우기 위해 바깥 래퍼를 relative로 감쌈
    <div className="relative h-full w-full overflow-hidden">
      <div ref={mapElementRef} className="h-full w-full" />

      {isClusterListOpen && (
        // 클러스터 클릭 시 지도 위에 가게 이름 리스트를 오버레이로 표시
        <div
          className="absolute z-20"
          style={{
            left: overlayPosition.left,
            top: overlayPosition.top,
          }}
        >
          <ClusterShopNameList
            shops={clusterShops}
            title="소금빵 가게"
            onCloseAction={() => {
              clearClusterList();
              clusterCenterRef.current = null;
              shiftedCenterRef.current = null;
              ignoreNextMapClickRef.current = false;
            }}
            onSelectAction={(shop) => {
              // 이름 리스트에서 가게를 클릭하면 기존 상세 패널 흐름 재사용
              clearClusterList();
              clusterCenterRef.current = null;
              shiftedCenterRef.current = null;
              ignoreNextMapClickRef.current = false;

              openShopDetail({
                id: shop.id,
                lat: shop.lat,
                lng: shop.lng,
                name: shop.name,
              });

              setCenter(
                {
                  lat: shop.lat,
                  lng: shop.lng,
                },
                "shopClick"
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
