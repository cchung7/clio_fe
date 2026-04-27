import { FileText, PanelRight } from "lucide-react";

type ResponsiveDrawerDockProps = {
  onOpenProject: () => void;
  onOpenDetails: () => void;
};

export function ResponsiveDrawerDock({
  onOpenProject,
  onOpenDetails,
}: ResponsiveDrawerDockProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-[var(--clio-purple-border)] bg-[rgba(255,253,248,0.96)] px-4 py-3 shadow-sm backdrop-blur xl:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-2 overflow-hidden rounded-2xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-1 shadow-sm">
        <button
          onClick={onOpenProject}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-[var(--clio-purple-950)] transition hover:bg-[var(--clio-purple-50)]"
        >
          <FileText size={17} />
          Project
        </button>

        <button
          onClick={onOpenDetails}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--clio-gold-500)] px-4 py-2.5 text-sm font-bold text-[var(--clio-ink)] shadow-sm transition hover:bg-[var(--clio-gold-300)]"
        >
          <PanelRight size={17} />
          Inspector
        </button>
      </div>
    </div>
  );
}