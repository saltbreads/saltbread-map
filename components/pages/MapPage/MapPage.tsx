"use client";

import * as React from "react";

import NaverMapView from "@/components/features/map/NaverMapView";
import { Sidebar } from "../../shared/layout/Sidebar";
import { MobileBottomSheet } from "../../shared/layout/MobileBottomSheet";
import { MobileSearchOverlay } from "./MobileSearchOverlay";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

export default function MapPage() {
  const isMobile = useIsMobile();

  return (
    <main className="h-dvh w-dvw overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        {isMobile === false && <Sidebar />}

        <div className="relative h-dvh min-w-0 flex-1">
          <NaverMapView />

          {/* 모바일일 때 지도 위 검색 UI */}
          {isMobile === true && <MobileSearchOverlay />}

          {/* 모바일일 때만 BottomSheet */}
          {isMobile === true && <MobileBottomSheet />}
        </div>
      </div>
    </main>
  );
}
