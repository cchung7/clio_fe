import { GitBranch } from "lucide-react";

import type {
  ConnectorArrowMode,
  ConnectorLineStyle,
} from "../../_lib/builderTypes";
import type { CanvasConnectableItem } from "../../_lib/canvasItems";
import { ArrowModePicker, LineStylePicker } from "./ConnectorControls";

type AddConnectorFormProps = {
  connectableItems: CanvasConnectableItem[];
  connectorSourceId: string;
  connectorTargetId: string;
  connectorLabel: string;
  connectorLineStyle: ConnectorLineStyle;
  connectorArrowMode: ConnectorArrowMode;
  setConnectorSourceId: (id: string) => void;
  setConnectorTargetId: (id: string) => void;
  setConnectorLabel: (value: string) => void;
  setConnectorLineStyle: (value: ConnectorLineStyle) => void;
  setConnectorArrowMode: (value: ConnectorArrowMode) => void;
  onAddConnector: () => void;
};

export function AddConnectorForm({
  connectableItems,
  connectorSourceId,
  connectorTargetId,
  connectorLabel,
  connectorLineStyle,
  connectorArrowMode,
  setConnectorSourceId,
  setConnectorTargetId,
  setConnectorLabel,
  setConnectorLineStyle,
  setConnectorArrowMode,
  onAddConnector,
}: AddConnectorFormProps) {
  if (connectableItems.length < 2) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--clio-border)] p-3 text-sm text-[var(--clio-muted)]">
        Add at least two elements or notes before creating an arrow.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-[var(--clio-border)] bg-[rgba(255,253,248,0.72)] px-3 py-2 text-xs leading-5 text-[var(--clio-muted)]">
        Create arrows between visible elements and notes in the current canvas.
      </div>

      <label className="block">
        <span className="clio-label mb-1 block">From</span>
        <select
          value={connectorSourceId}
          onChange={(event) => setConnectorSourceId(event.target.value)}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        >
          {connectableItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} ({item.type})
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="clio-label mb-1 block">To</span>
        <select
          value={connectorTargetId}
          onChange={(event) => setConnectorTargetId(event.target.value)}
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        >
          {connectableItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label} ({item.type})
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="clio-label mb-1 block">Label Optional</span>
        <input
          value={connectorLabel}
          onChange={(event) => setConnectorLabel(event.target.value)}
          placeholder="uses, calls, explains..."
          className="clio-input w-full rounded-lg px-3 py-2 text-sm"
        />
      </label>

      <LineStylePicker
        value={connectorLineStyle}
        onChange={setConnectorLineStyle}
      />

      <ArrowModePicker
        value={connectorArrowMode}
        onChange={setConnectorArrowMode}
      />

      <button
        type="button"
        onClick={onAddConnector}
        className="clio-btn-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
      >
        <GitBranch size={16} />
        Add Arrow
      </button>
    </div>
  );
}