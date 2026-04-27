type SystemSummaryTileProps = {
  label: string;
  value: number;
};

export function SystemSummaryTile({ label, value }: SystemSummaryTileProps) {
  return (
    <div className="rounded-lg border border-[var(--clio-purple-border)] bg-[var(--clio-white)] px-3 py-2">
      <div className="text-lg font-bold text-[var(--clio-purple-950)]">
        {value}
      </div>

      <div className="text-[var(--clio-muted)]">{label}</div>
    </div>
  );
}