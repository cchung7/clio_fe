import type {
  ConnectorArrowMode,
  ConnectorLineStyle,
  DocumentationProject,
} from "../../_lib/builderTypes";
import type { CanvasConnectableItem } from "../../_lib/canvasItems";
import {
  deleteConnectorFromProject,
  updateConnectorInProject,
} from "../../_lib/canvasProjectActions";
import { ConfirmDeleteButton } from "../shared/ConfirmDeleteButton";

import {
  ArrowModePicker,
  getArrowLabel,
  LineStylePicker,
} from "./ConnectorControls";

type ConnectorArrowsListProps = {
  edges: DocumentationProject["edges"];
  connectableItems: CanvasConnectableItem[];
  getConnectableItemLabel: (id: string) => string;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
};

export function ConnectorArrowsList({
  edges,
  connectableItems,
  getConnectableItemLabel,
  updateProject,
}: ConnectorArrowsListProps) {
  function updateConnector(
    edgeId: string,
    patch: {
      source?: string;
      target?: string;
      label?: string | undefined;
      lineStyle?: ConnectorLineStyle;
      arrowMode?: ConnectorArrowMode;
    }
  ) {
    updateProject((current) =>
      updateConnectorInProject({
        project: current,
        edgeId,
        patch,
      })
    );
  }

  function deleteConnector(edgeId: string) {
    updateProject((current) =>
      deleteConnectorFromProject({
        project: current,
        edgeId,
      })
    );
  }

  return (
    <div className="mt-6">
      <div className="clio-label mb-2">Connector Arrows</div>

      <div className="space-y-3">
        {edges.map((edge) => (
          <div
            key={edge.id}
            className="rounded-xl border border-[var(--clio-border)] bg-[rgba(255,253,248,0.76)] p-3"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-[var(--clio-ink)]">
                  {getConnectableItemLabel(edge.source)}{" "}
                  {getArrowLabel(edge.arrowMode)}{" "}
                  {getConnectableItemLabel(edge.target)}
                </div>

                <div className="text-xs text-[var(--clio-muted)]">
                  {edge.lineStyle ?? "solid"} · {edge.arrowMode ?? "forward"}
                </div>
              </div>

              <ConfirmDeleteButton
                message="Delete this connector arrow?"
                ariaLabel="Delete connector arrow"
                title="Delete connector arrow"
                onConfirm={() => deleteConnector(edge.id)}
              />
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="clio-label mb-1 block">From</span>
                  <select
                    value={edge.source}
                    onChange={(event) =>
                      updateConnector(edge.id, { source: event.target.value })
                    }
                    className="clio-input w-full rounded-lg px-2 py-1 text-xs"
                  >
                    {connectableItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="clio-label mb-1 block">To</span>
                  <select
                    value={edge.target}
                    onChange={(event) =>
                      updateConnector(edge.id, { target: event.target.value })
                    }
                    className="clio-input w-full rounded-lg px-2 py-1 text-xs"
                  >
                    {connectableItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="clio-label mb-1 block">Label</span>
                <input
                  value={edge.label || ""}
                  onChange={(event) =>
                    updateConnector(edge.id, {
                      label: event.target.value || undefined,
                    })
                  }
                  placeholder="Optional connector label"
                  className="clio-input w-full rounded-lg px-2 py-1 text-xs"
                />
              </label>

              <LineStylePicker
                value={edge.lineStyle ?? "solid"}
                onChange={(value) =>
                  updateConnector(edge.id, { lineStyle: value })
                }
              />

              <ArrowModePicker
                value={edge.arrowMode ?? "forward"}
                onChange={(value) =>
                  updateConnector(edge.id, { arrowMode: value })
                }
              />
            </div>
          </div>
        ))}

        {!edges.length ? (
          <p className="rounded-lg border border-dashed border-[var(--clio-border)] p-3 text-sm text-[var(--clio-muted)]">
            No connector arrows in this view yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}