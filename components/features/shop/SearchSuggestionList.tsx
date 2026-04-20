"use client";

import * as React from "react";

export type SearchSuggestionItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type SearchSuggestionListProps = {
  items: SearchSuggestionItem[];
  title?: string;
  emptyText?: string;
  onSelectAction?: (item: SearchSuggestionItem) => void;
  onCloseAction?: () => void;
};

export function SearchSuggestionList({
  items,
  title = "검색 결과",
  emptyText = "검색 결과가 없어요.",
  onSelectAction,
  onCloseAction,
}: SearchSuggestionListProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
          <p className="mt-0.5 text-xs text-zinc-500">총 {items.length}곳</p>
        </div>

        {onCloseAction && (
          <button
            type="button"
            onClick={onCloseAction}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm text-zinc-600 transition hover:bg-zinc-50"
            aria-label="목록 닫기"
          >
            ✕
          </button>
        )}
      </div>

      {/* 리스트 */}
      <div className="max-h-80 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-zinc-500">
            {emptyText}
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelectAction?.(item)}
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-zinc-800 transition hover:bg-amber-50 hover:text-zinc-900"
                >
                  <span className="truncate font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
