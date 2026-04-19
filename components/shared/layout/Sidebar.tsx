"use client";

import Link from "next/link";
import * as React from "react";

import { Logo } from "@/components/shared/brand/Logo";
import { Button } from "@/components/shared/ui/Button";
import { ResponsiveShopDetailPanel } from "./ResponsiveShopDetailPanel";
import { cn } from "@/lib/utils/cn";

import { SearchController } from "../../features/search/SearchController";
import { ShopList } from "@/components/features/shop/ShopList";
import { SearchShopItem } from "@/lib/api/shops";
import { useMapStore } from "@/lib/store/useMapStroe";
import { useShopSearchStore } from "@/lib/store/useShopSearchStore";
import { getSearchShops } from "@/lib/api/shops";

import { useLocationStore } from "@/lib/store/useLocationStore";
import { DEFAULT_LOCATION } from "@/lib/constants/location";
import { useAuthStore } from "@/lib/store/auth.store";
import { postAuthLogout } from "@/lib/api/auth";
import { useSelectedShopStore } from "@/lib/store/useSelectedShopStore";
import { useSidebarStore } from "@/lib/store/useSidebarStore";

import { getMyLocation } from "@/lib/utils/geolocation";

type SidebarProps = {
  className?: string;
  filterSlot?: React.ReactNode;
  listSlot?: React.ReactNode;
};

/**
 * 입력 디바운스
 * - 타이핑마다 API를 치지 않도록 딜레이를 둠
 */
function useDebouncedValue<T>(value: T, ms = 250) {
  const [v, setV] = React.useState(value);

  React.useEffect(() => {
    const t = window.setTimeout(() => setV(value), ms);
    return () => window.clearTimeout(t);
  }, [value, ms]);

  return v;
}

export function Sidebar({ className }: SidebarProps) {
  // 지도 중심 라벨은 기존 store 그대로 사용
  const centerLabel = useMapStore((s) => s.centerLabel);
  const setCenter = useMapStore((s) => s.setCenter);
  const setCenterWithLabel = useMapStore((s) => s.setCenterWithLabel);
  const setMyLocation = useLocationStore((s) => s.setMyLocation);

  // 선택된 가게 / 사이드패널 상태는 useSelectedShopStore 사용
  const selectedShopId = useSelectedShopStore((s) => s.selectedShop);
  const isSidePanelOpen = useSelectedShopStore((s) => s.isSidePanelOpen);
  const openShopDetail = useSelectedShopStore((s) => s.openShopDetail);
  const closeShopDetail = useSelectedShopStore((s) => s.closeShopDetail);

  /**
   * 사이드바 열림/닫힘 상태(store)
   * - 사이드바를 DOM에서 제거하지 않고 너비만 줄여서
   *   레이아웃 점프를 줄이고 지도 영역이 자연스럽게 늘어나도록 처리
   */
  const isSidebarOpen = useSidebarStore((s) => s.isOpen);
  const openSidebar = useSidebarStore((s) => s.openSidebar);
  const closeSidebar = useSidebarStore((s) => s.closeSidebar);

  /**
   * 검색 상태(store)
   * - search: 검색어
   * - resetPaging: 검색어 바뀌면 offset을 0으로 리셋
   */
  const search = useShopSearchStore((s) => s.search);
  const setSearch = useShopSearchStore((s) => s.setSearch);
  const resetPaging = useShopSearchStore((s) => s.resetPaging);

  /**
   * 페이지네이션(store)
   * - store에 없을 수도 있어서 optional로 처리
   * - 없으면 아래 기본값을 사용
   */
  const offset = useShopSearchStore((s) => s.offset);
  const limit = useShopSearchStore((s) => s.limit);
  const radiusKm = useShopSearchStore((s) => s.radiusKm);
  const setOffset = useShopSearchStore((s) => s.setOffset);

  /**
   * 내 위치(store)
   * - myLocation이 null이면 DEFAULT_LOCATION으로 fallback
   * - 백엔드 설계상 lat/lng는 "내 위치 기준"으로 보내는 게 맞음
   */
  const [queryBaseLoc, setQueryBaseLoc] = React.useState({
    lat: DEFAULT_LOCATION.lat,
    lng: DEFAULT_LOCATION.lng,
  });
  const baseLoc = queryBaseLoc;

  const handleUseMyLocation = async () => {
    try {
      const loc = await getMyLocation();

      setMyLocation(loc);

      // 1. 먼저 offset 초기화 (강제 재조회 트리거)
      if (typeof setOffset === "function") {
        setOffset(0);
      }

      setSearch("");
      resetPaging();

      // 2. 리스트 기준 좌표 변경
      setQueryBaseLoc({
        lat: loc.lat,
        lng: loc.lng,
      });

      // 3. 지도 이동
      setCenterWithLabel(
        {
          center: {
            lat: loc.lat,
            lng: loc.lng,
          },
          label: "내 위치",
        },
        "myLocation"
      );
    } catch (error) {
      console.error("내 위치를 가져오지 못했어:", error);
    }
  };

  /**
   * 인증 상태(store)
   * - 로그인 여부에 따라 버튼 문구/동작 분기
   */
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  /**
   * API 결과 상태
   */
  const [shops, setShops] = React.useState<SearchShopItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const listScrollRef = React.useRef<HTMLDivElement>(null);

  /**
   * 검색어 디바운스(입력 중 API 호출 최소화)
   */
  const debouncedSearch = useDebouncedValue(search, 250);

  /**
   * 가게 검색 API 호출
   * - search / baseLoc / radiusKm / limit / offset 변경 시 재호출
   * - offset==0이면 교체
   * - offset>0이면 누적(append)
   */
  React.useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErrorMsg(null);

      try {
        const q = debouncedSearch.trim();

        const data = await getSearchShops({
          lat: baseLoc.lat,
          lng: baseLoc.lng,
          radiusKm,
          limit,
          offset,
          search: q.length ? q : undefined,
        });

        if (!alive) return;

        setShops((prev) => (offset === 0 ? data : [...prev, ...data]));
      } catch {
        if (!alive) return;
        setErrorMsg("가게 목록을 불러오지 못했어");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [baseLoc.lat, baseLoc.lng, radiusKm, limit, offset, debouncedSearch]);

  React.useEffect(() => {
    const q = debouncedSearch.trim();

    if (!q) return;
    if (offset !== 0) return;
    if (shops.length === 0) return;

    const firstShop = shops[0];

    setCenter(
      {
        lat: Number(firstShop.latitude),
        lng: Number(firstShop.longitude),
      },
      "searchHere"
    );

    listScrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [shops, debouncedSearch, offset, setCenter]);

  /**
   * 가게 상세 패널이 열리면 사이드바도 함께 연다
   * - 리스트 문맥 없이 상세 패널만 단독으로 뜨는 어색한 상태를 방지
   * - 상세 패널이 닫힐 때는 사이드바 상태를 유지
   *   (사용자가 열어둔/닫아둔 흐름을 닫는 시점에 강제로 바꾸지 않음)
   */
  React.useEffect(() => {
    if (isSidePanelOpen && !isSidebarOpen) {
      openSidebar();
    }
  }, [isSidePanelOpen, isSidebarOpen, openSidebar]);

  /**
   * 더 보기(페이지네이션)
   * - store에 setOffset이 없으면 작동 못하니, 없을 때는 아무것도 안 함
   */
  const onLoadMore = () => {
    if (typeof setOffset !== "function") return;
    setOffset(offset + limit);
  };

  /**
   * 로그아웃
   * - 서버 로그아웃 요청 후 프론트 인증 상태 초기화
   * - 서버 요청이 실패해도 클라이언트 상태는 비워서 UI를 로그인 상태로 되돌림
   */
  const handleLogout = async () => {
    try {
      await postAuthLogout();
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();
    }
  };

  return (
    <>
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={openSidebar}
          aria-label="사이드바 열기"
          className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg shadow-md transition hover:bg-zinc-50"
        >
          ☰
        </button>
      )}

      <aside
        className={cn(
          "h-dvh shrink-0 border-r bg-white flex flex-col overflow-hidden transition-[width] duration-300",
          isSidebarOpen ? "w-90" : "w-0 border-r-0",
          className
        )}
        aria-hidden={!isSidebarOpen}
      >
        {isSidebarOpen && (
          <>
            <div className="h-14 px-4 flex items-center justify-between border-b">
              <Link href="/" className="inline-flex items-center">
                <Logo size="md" />
              </Link>

              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <Button variant="secondary" size="sm" onClick={handleLogout}>
                    로그아웃
                  </Button>
                ) : (
                  <Button variant="primary" size="sm" href="/login">
                    로그인
                  </Button>
                )}

                <button
                  type="button"
                  onClick={closeSidebar}
                  aria-label="사이드바 닫기"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm shadow-sm transition hover:bg-zinc-50"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-4 py-3">
              <SearchController
                value={search}
                onValueChangeAction={(v) => {
                  setSearch(v);
                  resetPaging();
                }}
                placeholder="빵집 이름이나 지역을 검색해보세요"
                className="w-full"
              />
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-bold text-zinc-900">
                내 주변 소금빵집
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold text-zinc-600">
                  {centerLabel}
                </div>

                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  aria-label="내 위치 기준으로 정렬"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  📍
                </button>
              </div>
            </div>

            <div
              ref={listScrollRef}
              className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pt-3 bg-zinc-50/40"
            >
              {loading && shops.length === 0 ? (
                <div className="text-sm text-zinc-500">불러오는 중…</div>
              ) : errorMsg ? (
                <div className="text-sm text-red-600">{errorMsg}</div>
              ) : (
                <>
                  <ShopList
                    shops={shops}
                    onSelectAction={(shop) => {
                      openShopDetail({
                        id: shop.id,
                        lat: Number(shop.latitude),
                        lng: Number(shop.longitude),
                        name: shop.name,
                      });

                      setCenter(
                        {
                          lat: Number(shop.latitude),
                          lng: Number(shop.longitude),
                        },
                        "shopClick"
                      );
                    }}
                  />

                  <div className="pt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={onLoadMore}
                      disabled={loading || typeof setOffset !== "function"}
                    >
                      {loading ? "불러오는 중…" : "더 보기"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </aside>

      <ResponsiveShopDetailPanel
        open={isSidePanelOpen}
        onCloseAction={closeShopDetail}
        shopId={selectedShopId?.id ?? "가게 아이디"}
      >
        {/* 필요하면 여기 상세 패널 컴포넌트 넣기 */}
      </ResponsiveShopDetailPanel>
    </>
  );
}
