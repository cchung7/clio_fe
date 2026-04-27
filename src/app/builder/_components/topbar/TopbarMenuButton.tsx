import type { ReactNode } from "react";

type TopbarMenuButtonProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

export function TopbarMenuButton({
  icon,
  label,
  onClick,
}: TopbarMenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[var(--clio-ink)] hover:bg-[var(--clio-purple-50)]"
    >
      {icon}
      {label}
    </button>
  );
}