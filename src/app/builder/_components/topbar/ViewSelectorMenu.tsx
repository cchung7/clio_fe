import { ChevronDown } from "lucide-react";

import type {
  DecompositionView,
} from "../../_lib/builderTypes";

type ViewSelectorMenuProps = {
  open: boolean;
  decompositionView: DecompositionView;
  onToggle: () => void;
  onClose: () => void;
  setDecompositionView: (view: DecompositionView) => void;
};

const VIEW_OPTIONS: Array<{
  label: string;
  value: DecompositionView;
  disabled?: boolean;
}> = [
  { label: "System View", value: "system" },
  { label: "Functional Decomposition", value: "functional", disabled: true },
  { label: "Object-Oriented Decomposition", value: "object", disabled: true },
  { label: "Domain Decomposition", value: "domain", disabled: true },
];

export function ViewSelectorMenu({
  open,
  decompositionView,
  onToggle,
  setDecompositionView,
}: ViewSelectorMenuProps) {
  const activeView =
    VIEW_OPTIONS.find((item) => item.value === decompositionView)?.label ??
    "System View";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="clio-btn-primary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
      >
        {activeView}
        <ChevronDown size={16} />
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-2 shadow-xl">
          <div className="px-3 pb-2 pt-1">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
              Architecture Views
            </div>

            <p className="mt-1 text-xs leading-5 text-[var(--clio-muted)]">
              Switch between system, functional, object, and domain
              perspectives.
            </p>
          </div>

          <div className="space-y-1">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => {
                  if (option.disabled) return;
                  setDecompositionView(option.value);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  option.value === decompositionView
                    ? "bg-[var(--clio-purple-900)] text-[var(--clio-white)]"
                    : "text-[var(--clio-ink)] hover:bg-[var(--clio-purple-50)]"
                } ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <div className="font-semibold">{option.label}</div>

                {option.disabled ? (
                  <div className="text-xs opacity-75">Coming soon</div>
                ) : null}
              </button>
            ))}
          </div>

          <div className="my-2 border-t border-[var(--clio-border)]" />

          <div className="px-3 py-2">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
              AI-Assisted Views
            </div>

            <p className="mt-1 text-xs leading-5 text-[var(--clio-muted)]">
              Future versions can generate functional, object, or domain views
              from the current system map.
            </p>
          </div>

          <DisabledAiViewButton label="Generate Functional View with AI" />
          <DisabledAiViewButton label="Generate Object View with AI" />
          <DisabledAiViewButton label="Generate Domain View with AI" />
        </div>
      ) : null}
    </div>
  );
}

function DisabledAiViewButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="w-full cursor-not-allowed rounded-lg px-3 py-2 text-left text-sm text-[var(--clio-muted)] opacity-60"
    >
      <div className="font-semibold">{label}</div>
      <div className="text-xs">Coming soon</div>
    </button>
  );
}