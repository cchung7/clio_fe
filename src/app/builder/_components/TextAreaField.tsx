type TextAreaFieldProps = {
  label: string;
  helper?: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
};

export function TextAreaField({
  label,
  helper,
  value,
  rows = 3,
  onChange,
}: TextAreaFieldProps) {
  return (
    <label className="block text-sm">
      <span className="clio-label mb-1 block">{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="clio-input w-full rounded-lg px-3 py-2 text-sm"
      />

      {helper ? (
        <span className="text-xs text-[var(--clio-muted)]">{helper}</span>
      ) : null}
    </label>
  );
}