"use client";

import NaverMapView from "@/components/features/map/NaverMapView";
import { Sidebar } from "../shared/layout/Sidebar";

export default function MapPage() {
  return (
    <main className="h-dvh w-dvw flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 min-w-0 h-dvh">
        <NaverMapView />
      </div>
    </main>
  );
}
