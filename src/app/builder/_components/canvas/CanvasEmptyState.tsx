export function CanvasEmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center">
      <div className="clio-panel max-w-md rounded-2xl p-6">
        <div className="text-lg font-bold text-[var(--clio-purple-950)]">
          This view is empty.
        </div>

        <p className="mt-2 text-sm leading-6 text-[var(--clio-muted)]">
          Open Project and create an element, note, or arrow for this current
          view.
        </p>
      </div>
    </div>
  );
}