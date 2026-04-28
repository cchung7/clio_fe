import type {
  ArchitectureEdge,
  ConnectorArrowMode,
  ConnectorLineStyle,
  DecompositionView,
  DocumentationProject,
} from "../../_lib/builderTypes";
import {
  deleteConnectorFromProject,
  updateConnectorInProject,
} from "../../_lib/canvasProjectActions";
import { useCurrentCanvasItems } from "../../_hooks/useCurrentCanvasItems";
import { ConfirmDeleteButton } from "../shared/ConfirmDeleteButton";
import {
  ArrowModePicker,
  getArrowLabel,
  LineStylePicker,
} from "../sidebar/ConnectorControls";

type ConnectorInspectorFieldsProps = {
  edge: ArchitectureEdge;
  project: DocumentationProject;
  focusedNodeId: string;
  decompositionView: DecompositionView;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  onDelete: () => void;
};

export function ConnectorInspectorFields({
  edge,
  project,
  focusedNodeId,
  decompositionView,
  updateProject,
  onDelete,
}: ConnectorInspectorFieldsProps) {
  const { connectableItems, getConnectableItemLabel } = useCurrentCanvasItems({
    project,
    focusedNodeId,
    decompositionView,
  });

  function updateConnector(patch: {
    source?: string;
    target?: string;
    label?: string | undefined;
    lineStyle?: ConnectorLineStyle;
    arrowMode?: ConnectorArrowMode;
  }) {
    const nextSource = patch.source ?? edge.source;
    const nextTarget = patch.target ?? edge.target;

    if (nextSource === nextTarget) {
      window.alert("Connector source and target must be different.");
      return;
    }

    updateProject((current) =>
      updateConnectorInProject({
        project: current,
        edgeId: edge.id,
        patch,
      })
    );
  }

  function deleteConnector() {
    updateProject((current) =>
      deleteConnectorFromProject({
        project: current,
        edgeId: edge.id,
      })
    );

    onDelete();
  }

  return (
    <div className="space-y-5">
      <section>
        <div className="clio-label mb-1">Connector Inspector</div>

        <div className="rounded-xl border border-[var(--clio-purple-border)] bg-[rgba(255,253,248,0.88)] p-3">
          <div className="text-sm font-bold text-[var(--clio-purple-950)]">
            {getConnectableItemLabel(edge.source)} {getArrowLabel(edge.arrowMode)}{" "}
            {getConnectableItemLabel(edge.target)}
          </div>

          <div className="mt-1 text-xs text-[var(--clio-muted)]">
            {edge.lineStyle ?? "solid"} · {edge.arrowMode ?? "forward"}
            {edge.label ? ` · ${edge.label}` : ""}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="clio-label mb-1 block">From</span>

            <select
              value={edge.source}
              onChange={(event) =>
                updateConnector({ source: event.target.value })
              }
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
              value={edge.target}
              onChange={(event) =>
                updateConnector({ target: event.target.value })
              }
              className="clio-input w-full rounded-lg px-3 py-2 text-sm"
            >
              {connectableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label} ({item.type})
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
              updateConnector({
                label: event.target.value || undefined,
              })
            }
            placeholder="Optional connector label"
            className="clio-input w-full rounded-lg px-3 py-2 text-sm"
          />
        </label>

        <LineStylePicker
          value={edge.lineStyle ?? "solid"}
          onChange={(value) => updateConnector({ lineStyle: value })}
        />

        <ArrowModePicker
          value={edge.arrowMode ?? "forward"}
          onChange={(value) => updateConnector({ arrowMode: value })}
        />
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50/60 p-4">
        <div className="mb-1 text-sm font-bold text-red-800">
          Delete Connector
        </div>

        <p className="mb-3 text-xs leading-5 text-red-700">
          Remove this connector arrow from the current canvas view.
        </p>

        <ConfirmDeleteButton
          message="Delete this connector arrow?"
          ariaLabel="Delete connector arrow"
          title="Delete connector arrow"
          className="inline-flex items-center justify-center rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          onConfirm={deleteConnector}
        />
      </section>
    </div>
  );
}