type SegmentedControlOption<T extends string> = {
  label: string;
  value: T;
  activeClassName?: string;
};

type SegmentedControlProps<T extends string> = {
  value: T;
  options: Array<SegmentedControlOption<T>>;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
};

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  columns = 2,
}: SegmentedControlProps<T>) {
  const gridColumnsClass =
    columns === 4
      ? "grid-cols-4"
      : columns === 3
        ? "grid-cols-3"
        : "grid-cols-2";

  return (
    <div
      className={`grid ${gridColumnsClass} gap-2 rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-1`}
    >
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg px-2 py-2 text-xs font-bold transition ${
              active
                ? option.activeClassName ??
                  "bg-[var(--clio-purple-900)] text-[var(--clio-white)] shadow-sm"
                : "text-[var(--clio-purple-950)] hover:bg-[var(--clio-purple-50)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}