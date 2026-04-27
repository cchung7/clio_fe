import type {
  ConnectorArrowMode,
  ConnectorLineStyle,
} from "../../_lib/builderTypes";

export function getArrowLabel(arrowMode?: ConnectorArrowMode) {
  if (arrowMode === "none") return "—";
  if (arrowMode === "backward") return "←";
  if (arrowMode === "both") return "↔";
  return "→";
}

export function LineStylePicker({
  value,
  onChange,
}: {
  value: ConnectorLineStyle;
  onChange: (value: ConnectorLineStyle) => void;
}) {
  return (
    <div>
      <div className="clio-label mb-2">Line Style</div>

      <div className="grid grid-cols-2 gap-2">
        <ConnectorOptionButton
          label="Solid"
          active={value === "solid"}
          onClick={() => onChange("solid")}
        />

        <ConnectorOptionButton
          label="Dotted"
          active={value === "dotted"}
          onClick={() => onChange("dotted")}
        />
      </div>
    </div>
  );
}

export function ArrowModePicker({
  value,
  onChange,
}: {
  value: ConnectorArrowMode;
  onChange: (value: ConnectorArrowMode) => void;
}) {
  return (
    <div>
      <div className="clio-label mb-2">Arrow Direction</div>

      <div className="grid grid-cols-4 gap-2">
        <ConnectorOptionButton
          label="—"
          active={value === "none"}
          onClick={() => onChange("none")}
        />

        <ConnectorOptionButton
          label="→"
          active={value === "forward"}
          onClick={() => onChange("forward")}
        />

        <ConnectorOptionButton
          label="←"
          active={value === "backward"}
          onClick={() => onChange("backward")}
        />

        <ConnectorOptionButton
          label="↔"
          active={value === "both"}
          onClick={() => onChange("both")}
        />
      </div>
    </div>
  );
}

function ConnectorOptionButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2 py-2 text-sm font-bold transition ${
        active
          ? "border-[var(--clio-purple-700)] bg-[var(--clio-purple-900)] text-[var(--clio-white)]"
          : "border-[var(--clio-border)] bg-[var(--clio-white)] text-[var(--clio-ink)] hover:bg-[var(--clio-purple-50)]"
      }`}
    >
      {label}
    </button>
  );
}