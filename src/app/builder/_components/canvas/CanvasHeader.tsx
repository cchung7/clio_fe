type CanvasBreadcrumb = {
  id: string;
  name: string;
};

type CanvasHeaderProps = {
  breadcrumbs: CanvasBreadcrumb[];
  currentViewLabel: string;
  focusedNodeId: string;
  isAtSystemOverview: boolean;
  onOpenBreadcrumb: (id: string) => void;
  onOpenParentView: () => void;
  onOpenSystemView: () => void;
};

export function CanvasHeader({
  breadcrumbs,
  currentViewLabel,
  focusedNodeId,
  isAtSystemOverview,
  onOpenBreadcrumb,
  onOpenParentView,
  onOpenSystemView,
}: CanvasHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--clio-border)] bg-[rgba(255,253,248,0.82)] px-4 py-3">
      <div className="min-w-0">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
          Current View
        </div>

        <div className="mt-1 text-sm font-semibold text-[var(--clio-purple-950)]">
          {currentViewLabel}
        </div>

        {breadcrumbs.length > 1 ? (
          <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.id} className="inline-flex items-center gap-1">
                <button
                  onClick={() => onOpenBreadcrumb(crumb.id)}
                  className={`rounded-md px-2 py-1 font-semibold transition hover:bg-[var(--clio-purple-50)] ${
                    crumb.id === focusedNodeId
                      ? "text-[var(--clio-purple-900)]"
                      : "text-[var(--clio-muted)]"
                  }`}
                >
                  {crumb.name}
                </button>

                {index < breadcrumbs.length - 1 ? (
                  <span className="text-[var(--clio-soft-muted)]">/</span>
                ) : null}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenParentView}
          disabled={isAtSystemOverview}
          className="clio-btn-secondary rounded-lg px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous View
        </button>

        <button
          onClick={onOpenSystemView}
          className="clio-btn-secondary rounded-lg px-3 py-2 text-sm font-medium"
        >
          System View
        </button>
      </div>
    </div>
  );
}