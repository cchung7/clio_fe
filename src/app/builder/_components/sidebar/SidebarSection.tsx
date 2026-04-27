import type * as React from "react";

type SidebarSectionProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function SidebarSection({
  icon,
  title,
  description,
  children,
}: SidebarSectionProps) {
  return (
    <section className="clio-panel-soft rounded-xl p-4">
      <div className="mb-1 flex items-center gap-2 text-sm font-bold text-[var(--clio-purple-950)]">
        {icon}
        {title}
      </div>

      {description ? (
        <p className="mb-4 text-xs leading-5 text-[var(--clio-muted)]">
          {description}
        </p>
      ) : null}

      {children}
    </section>
  );
}