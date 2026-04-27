export function NoElementSelected() {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-[var(--clio-purple-950)]">
        No element selected
      </div>

      <p className="text-sm leading-6 text-[var(--clio-muted)]">
        Select a card on the canvas to edit its details.
      </p>
    </div>
  );
}