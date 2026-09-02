import type { ReactNode } from "react";
import { IconClose } from "../../lib/icons";

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-navy-950/50" onClick={onClose} />
      <div
        className={[
          "relative flex max-h-[90dvh] w-full flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl",
          wide ? "sm:max-w-2xl" : "sm:max-w-md",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <p className="font-display font-semibold text-navy-900">{title}</p>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-navy-500 hover:bg-navy-50"
            aria-label="Close"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
