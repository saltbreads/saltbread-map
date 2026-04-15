"use client";

import * as React from "react";

type ClusterShopNameItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type ClusterShopNameListProps = {
  shops: ClusterShopNameItem[];
  title?: string;
  onSelectAction?: (shop: ClusterShopNameItem) => void;
  onCloseAction?: () => void;
};

export function ClusterShopNameList({
  shops,
  title = "이 클러스터의 가게",
  onSelectAction,
  onCloseAction,
}: ClusterShopNameListProps) {
  return (
    <div className="w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
          <p className="mt-0.5 text-xs text-zinc-500">총 {shops.length}곳</p>
        </div>

        {onCloseAction ? (
          <button
            type="button"
            onClick={onCloseAction}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm text-zinc-600 transition hover:bg-zinc-50"
            aria-label="목록 닫기"
          >
            ✕
          </button>
        ) : null}
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {shops.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-zinc-500">
            표시할 가게가 없어요.
          </div>
        ) : (
          <ul className="space-y-1">
            {shops.map((shop) => (
              <li key={shop.id}>
                <button
                  type="button"
                  onClick={() => onSelectAction?.(shop)}
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-zinc-800 transition hover:bg-amber-50 hover:text-zinc-900"
                >
                  <span className="truncate font-medium">{shop.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
