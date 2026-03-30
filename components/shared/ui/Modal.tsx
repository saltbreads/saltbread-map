"use client";

import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  children: ReactNode;
  onCloseAction: () => void;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  maxWidthClassName?: string;
};

export function Modal({
  open,
  title,
  children,
  onCloseAction,
  footer,
  closeOnBackdrop = true,
  closeOnEsc = true,
  showCloseButton = true,
  maxWidthClassName = "max-w-xl",
}: Props) {
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, onCloseAction]);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = () => {
    if (!closeOnBackdrop) return;
    onCloseAction();
  };

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 px-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`w-full ${maxWidthClassName} rounded-2xl bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between border-b px-5 py-4">
            {title ? (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            ) : (
              <div />
            )}

            {showCloseButton && (
              <button
                type="button"
                onClick={onCloseAction}
                className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                닫기
              </button>
            )}
          </div>
        )}

        <div className="px-5 py-5">{children}</div>

        {footer && <div className="border-t px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
