"use client";

import Link from "next/link";
import * as React from "react";
import { Sheet, type SheetRef } from "react-modal-sheet";

import { Logo } from "@/components/shared/brand/Logo";
import { Button } from "@/components/shared/ui/Button";
import { ResponsiveShopDetailPanel } from "./ResponsiveShopDetailPanel";
import { ShopList } from "@/components/features/shop/ShopList";

import { SearchShopItem, getSearchShops } from "@/lib/api/shops";
import { postAuthLogout } from "@/lib/api/auth";

import { getMyLocation } from "@/lib/utils/geolocation";

import { DEFAULT_LOCATION } from "@/lib/constants/location";
import { useMapStore } from "@/lib/store/useMapStroe";
import { useShopSearchStore } from "@/lib/store/useShopSearchStore";
import { useLocationStore } from "@/lib/store/useLocationStore";
import { useAuthStore } from "@/lib/store/auth.store";
import { useSelectedShopStore } from "@/lib/store/useSelectedShopStore";
import { useBottomSheetStageStore } from "@/lib/store/useBottomSheetStageStore";

type MobileBottomSheetProps = {
  className?: string;
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

export function MobileBottomSheet({ className }: MobileBottomSheetProps) {
  /**
   * hydration mismatch 방지
   * - 바텀시트 라이브러리는 클라이언트 환경 의존성이 있어서
   *   마운트 이후에만 렌더링
   */
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sheetRef = React.useRef<SheetRef>(null);

  /**
   * 검색바를 가리지 않기 위한 상단 여백
   * - "지도 위 고정 검색바 + 상단 안전 여백" 높이만큼
   *   바텀시트가 아래에서 시작하도록 제한
   * - 값은 실제 SearchBar 높이에 맞게 조절
   */
  const MOBILE_SEARCHBAR_OFFSET = 88;

  // 지도 중심 라벨은 기존 store 그대로 사용
  const centerLabel = useMapStore((s) => s.centerLabel);
  const setCenter = useMapStore((s) => s.setCenter);
  const setCenterWithLabel = useMapStore((s) => s.setCenterWithLabel);
  const setMyLocation = useLocationStore((s) => s.setMyLocation);

  // 선택된 가게 / 상세 패널 상태는 기존 store 그대로 사용
  const selectedShop = useSelectedShopStore((s) => s.selectedShop);
  const isSidePanelOpen = useSelectedShopStore((s) => s.isSidePanelOpen);
  const openShopDetail = useSelectedShopStore((s) => s.openShopDetail);
  const closeShopDetail = useSelectedShopStore((s) => s.closeShopDetail);

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
   * 바텀시트 높이 단계(store)
   * - 리스트 바텀시트와 상세 패널이 같은 높이 상태를 공유하기 위해 사용
   * - 1: 최소 / 2: 중간 / 3: 최대
   */
  const stage = useBottomSheetStageStore((s) => s.stage);
  const setStage = useBottomSheetStageStore((s) => s.setStage);

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
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const listScrollRef = React.useRef<HTMLDivElement>(null);

  /**
   * 검색어 디바운스(입력 중 API 호출 최소화)
   */
  const debouncedSearch = useDebouncedValue(search, 250);

  /**
   * react-modal-sheet snap point
   * - 첫 값은 0(완전 닫힘), 마지막 값은 1(완전 열림)이어야 함
   * - 여기서 "완전 열림"은 viewport 전체가 아니라
   *   아래에서 설정한 "검색바 아래 영역 전체"를 의미하게 만듦
   */
  const snapPoints = React.useMemo(() => [0, 0.14, 0.7, 1], []);

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

        setShops((prev) =>
          offset === 0 ? data.items : [...prev, ...data.items]
        );
        setHasMore(data.hasMore);
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

  /**
   * 검색 결과가 바뀌었을 때
   * - 검색어가 있고
   * - 첫 페이지이고
   * - 결과가 존재하면
   *   첫 번째 가게 위치로 지도 중심 이동
   */
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
   * 마운트 직후 현재 저장된 높이 단계(stage)로 맞춤
   * - index 0은 라이브러리 요구사항용 closed point
   * - 실제 첫 화면은 store에 저장된 높이 상태를 복원
   */
  React.useEffect(() => {
    if (!mounted) return;

    const t = window.setTimeout(() => {
      sheetRef.current?.snapTo(stage);
    }, 0);

    return () => window.clearTimeout(t);
  }, [mounted, stage]);

  /**
   * 더 보기(페이지네이션)
   * - store에 setOffset이 없으면 작동 못하니, 없을 때는 아무것도 안 함
   */
  const onLoadMore = () => {
    if (!hasMore) return;
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

  /**
   * 서버와 클라이언트 첫 렌더를 맞추기 위해
   * 마운트 전에는 바텀시트를 렌더링하지 않음
   */
  if (!mounted) {
    return (
      <ResponsiveShopDetailPanel
        open={isSidePanelOpen}
        onCloseAction={closeShopDetail}
        shopId={selectedShop?.id ?? "가게 아이디"}
      >
        {/* 필요하면 여기 상세 패널 컴포넌트 넣기 */}
      </ResponsiveShopDetailPanel>
    );
  }

  return (
    <>
      <div className={className}>
        <Sheet
          ref={sheetRef}
          isOpen
          onClose={() => {
            /**
             * 완전 닫힘은 UX상 사용하지 않음
             * 혹시 close 콜백이 불려도 최소 높이로 복귀
             */
            requestAnimationFrame(() => {
              sheetRef.current?.snapTo(1);
              setStage(1);
            });
          }}
          snapPoints={snapPoints}
          initialSnap={stage}
          disableDismiss
          onSnap={(index) => {
            /**
             * 혹시라도 0번 snap(완전 닫힘)으로 이동하면
             * 다시 최소 높이(index=1)로 복귀
             */
            if (index === 0) {
              requestAnimationFrame(() => {
                sheetRef.current?.snapTo(1);
                setStage(1);
              });
              return;
            }

            /**
             * 현재 바텀시트 높이 단계를 전역 store에 저장
             * - 이후 상세 패널이 열릴 때 동일한 높이 단계로 시작할 수 있게 함
             */
            if (index === 1 || index === 2 || index === 3) {
              setStage(index);
            }
          }}
        >
          {/* 
            검색바를 가리지 않도록
            시트 전체가 화면 최상단까지 올라가지 못하게 제한
          */}
          <Sheet.Container
            className="rounded-t-3xl! shadow-2xl!"
            style={{
              top: `${MOBILE_SEARCHBAR_OFFSET}px`,
              height: `calc(100dvh - ${MOBILE_SEARCHBAR_OFFSET}px)`,
            }}
          >
            <Sheet.Header />

            <Sheet.Content disableDrag={false}>
              <div
                className="flex flex-col overflow-hidden bg-white"
                style={{
                  height: `calc(100dvh - ${MOBILE_SEARCHBAR_OFFSET}px)`,
                }}
              >
                <div className="border-b bg-white">
                  <div className="flex h-14 items-center justify-between px-4">
                    <Link href="/" className="inline-flex items-center">
                      <Logo size="md" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {isAuthenticated ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleLogout}
                        >
                          로그아웃
                        </Button>
                      ) : (
                        <Button variant="primary" size="sm" href="/login">
                          로그인
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 pb-3">
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
                </div>

                <div
                  ref={listScrollRef}
                  className="min-h-0 flex-1 overflow-y-auto bg-zinc-50/40 px-4 py-4"
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

                      {hasMore && shops.length > 0 && (
                        <div className="pt-4 pb-4">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={onLoadMore}
                            disabled={
                              loading ||
                              !hasMore ||
                              typeof setOffset !== "function"
                            }
                          >
                            {loading ? "불러오는 중…" : "더 보기"}
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Sheet.Content>
          </Sheet.Container>

          {/* 
            백드롭도 검색바까지 덮지 않도록 top 제한
            - 검색바는 계속 클릭 가능하게 유지하고 싶을 때 유용
          */}
          <Sheet.Backdrop
            className="bg-transparent!"
            style={{
              top: `${MOBILE_SEARCHBAR_OFFSET}px`,
            }}
          />
        </Sheet>
      </div>

      <ResponsiveShopDetailPanel
        open={isSidePanelOpen}
        onCloseAction={closeShopDetail}
        shopId={selectedShop?.id ?? "가게 아이디"}
      />
    </>
  );
}
