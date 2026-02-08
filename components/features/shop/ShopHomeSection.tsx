"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { CopyButton } from "@/components/shared/ui/CopyButton";
type AddressInfo = {
  /** 대표 표시(첫 줄) */
  display: string;

  /** 펼쳤을 때 보여줄 상세 3줄 (필요한 것만 넣어도 됨) */
  road?: string; // 도로명
  jibun?: string; // 지번
  zip?: string; // 우편번호
};

type TransitInfo = {
  /** 예: "남산역 2번 출구에서 976m" */
  label: string;
};

type BusinessStatus = "OPEN" | "CLOSED" | "BREAK" | "UNKNOWN";

type WeeklyHoursItem = {
  dayLabel: string; // "월", "화" ... 또는 "02/04(화)"
  hoursText: string; // "10:00 - 20:00" / "휴무"
  isClosed?: boolean;
};

type ContactLinks = {
  instagram?: string;
  kakao?: string;
  website?: string;
};

type Props = {
  className?: string;

  address: AddressInfo;
  transit?: TransitInfo;

  business: {
    status: BusinessStatus;
    statusText: string; // "영업 중", "영업 종료", "휴무" 등
    todayText?: string; // "오늘 10:00 ~ 20:00" 같은 보조 문구
    weekly?: WeeklyHoursItem[]; // 오늘부터 7일치
  };

  phone?: {
    label?: string; // "전화번호 보기" 텍스트 커스텀
    number?: string; // 실제 번호(없으면 버튼 비활성)
  };

  links?: ContactLinks;
};

/** ===== helpers ===== */

function StatusDot({ status }: { status: BusinessStatus }) {
  const cls =
    status === "OPEN"
      ? "bg-emerald-500"
      : status === "CLOSED"
      ? "bg-zinc-400"
      : status === "BREAK"
      ? "bg-amber-500"
      : "bg-zinc-300";
  return <span className={cn("inline-block h-2 w-2 rounded-full", cls)} />;
}

function Row({
  icon,
  children,
  className,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 py-2", className)}>
      <div className="mt-[2px] w-5 shrink-0 text-zinc-400">{icon}</div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function ShopHomeSection({
  className,
  address,
  transit,
  business,
  phone,
  links,
}: Props) {
  const [addrOpen, setAddrOpen] = React.useState(false);
  const [hoursOpen, setHoursOpen] = React.useState(false);
  const [showPhone, setShowPhone] = React.useState(false);

  const hasAnyAddressDetail = !!(address.road || address.jibun || address.zip);
  const weekly = business.weekly ?? [];

  return (
    <div className={cn("w-full", className)}>
      {/* ===== Address ===== */}
      <Row icon={<span>📍</span>}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-[14px] font-semibold text-zinc-900">
                {address.display}
              </p>

              {hasAnyAddressDetail ? (
                <button
                  type="button"
                  onClick={() => setAddrOpen((v) => !v)}
                  className="shrink-0 text-xs font-semibold text-zinc-500 hover:text-zinc-700"
                  aria-expanded={addrOpen}
                >
                  {addrOpen ? "▲" : "▼"}
                </button>
              ) : null}
            </div>
          </div>

          {/* 대표 주소 복사 */}
          <CopyButton text={address.display} />
        </div>

        {/* 상세 주소 (도로명/지번/우편번호) */}
        {addrOpen ? (
          <div className="mt-2 space-y-2 rounded-xl bg-zinc-50 p-3">
            {address.road ? (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-500">도로명</p>
                  <p className="break-words text-[13px] text-zinc-800">
                    {address.road}
                  </p>
                </div>
                <CopyButton text={address.road} />
              </div>
            ) : null}

            {address.jibun ? (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-500">지번</p>
                  <p className="break-words text-[13px] text-zinc-800">
                    {address.jibun}
                  </p>
                </div>
                <CopyButton text={address.jibun} />
              </div>
            ) : null}

            {address.zip ? (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-500">
                    우편번호
                  </p>
                  <p className="break-words text-[13px] text-zinc-800">
                    {address.zip}
                  </p>
                </div>
                <CopyButton text={address.zip} />
              </div>
            ) : null}

            {!address.road && !address.jibun && !address.zip ? (
              <p className="text-xs text-zinc-500">상세 주소 정보가 없어요.</p>
            ) : null}
          </div>
        ) : null}
      </Row>

      {/* ===== Transit ===== */}
      {transit?.label ? (
        <Row icon={<span>🚇</span>}>
          <p className="text-[13px] text-zinc-700">{transit.label}</p>
        </Row>
      ) : null}

      {/* divider */}
      <div className="my-2 h-px w-full bg-zinc-100" />

      {/* ===== Business Hours ===== */}
      <Row icon={<span>🕒</span>}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <StatusDot status={business.status} />
              <p className="text-[14px] font-semibold text-zinc-900">
                {business.statusText}
              </p>

              {weekly.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setHoursOpen((v) => !v)}
                  className="shrink-0 text-xs font-semibold text-zinc-500 hover:text-zinc-700"
                  aria-expanded={hoursOpen}
                >
                  {hoursOpen ? "자세히 ▲" : "자세히 ▼"}
                </button>
              ) : null}
            </div>

            {business.todayText ? (
              <p className="mt-1 text-[13px] text-zinc-600">
                {business.todayText}
              </p>
            ) : null}
          </div>
        </div>

        {hoursOpen && weekly.length > 0 ? (
          <ul className="mt-2 space-y-1 rounded-xl bg-zinc-50 p-3">
            {weekly.slice(0, 7).map((d, idx) => (
              <li
                key={`${d.dayLabel}-${idx}`}
                className="flex items-center justify-between gap-3 text-[13px]"
              >
                <span className="text-zinc-600">{d.dayLabel}</span>
                <span
                  className={cn(
                    "font-semibold",
                    d.isClosed ? "text-zinc-400" : "text-zinc-800"
                  )}
                >
                  {d.hoursText}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </Row>

      {/* ===== Phone ===== */}
      <Row icon={<span>📞</span>}>
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowPhone((v) => !v)}
            className={cn(
              "text-left text-[14px] font-semibold",
              phone?.number ? "text-zinc-900" : "text-zinc-400"
            )}
            disabled={!phone?.number}
          >
            {showPhone && phone?.number
              ? phone.number
              : phone?.label ?? "전화번호 보기"}
          </button>

          {showPhone && phone?.number ? (
            <CopyButton text={phone.number} />
          ) : (
            <span className="text-xs text-zinc-400"> </span>
          )}
        </div>

        {!phone?.number ? (
          <p className="mt-1 text-[12px] text-zinc-400">
            전화번호 정보가 없어요.
          </p>
        ) : null}
      </Row>

      {/* ===== Links ===== */}
      {(links?.instagram || links?.kakao || links?.website) && (
        <>
          <div className="my-2 h-px w-full bg-zinc-100" />

          <Row icon={<span>🔗</span>}>
            <div className="flex flex-col gap-2">
              {links.website ? (
                <a
                  href={links.website}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-[13px] font-semibold text-brand-primary hover:underline"
                >
                  웹사이트
                </a>
              ) : null}

              {links.instagram ? (
                <a
                  href={links.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-[13px] font-semibold text-brand-primary hover:underline"
                >
                  인스타그램
                </a>
              ) : null}

              {links.kakao ? (
                <a
                  href={links.kakao}
                  target="_blank"
                  rel="noreferrer"
                  className="w-fit text-[13px] font-semibold text-brand-primary hover:underline"
                >
                  카카오톡
                </a>
              ) : null}
            </div>
          </Row>
        </>
      )}
    </div>
  );
}
