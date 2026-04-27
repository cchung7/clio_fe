import * as React from "react";
import { FileText, X } from "lucide-react";

type DrawerProps = {
  open: boolean;
  title: string;
  side?: "left" | "right";
  onClose: () => void;
  children: React.ReactNode;
};

export function Drawer({
  open,
  title,
  side = "left",
  onClose,
  children,
}: DrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-[rgba(21,19,29,0.42)]"
        onClick={onClose}
      />

      <aside
        className={`absolute top-0 h-full w-[min(94vw,430px)] overflow-auto bg-[var(--clio-white)] shadow-2xl ${
          side === "left" ? "left-0" : "right-0"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--clio-border)] bg-[var(--clio-white)] px-4 py-3">
          <div className="flex items-center gap-2 font-bold text-[var(--clio-purple-950)]">
            <FileText size={18} />
            {title}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-[var(--clio-purple-50)]"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </aside>
    </div>
  );
}