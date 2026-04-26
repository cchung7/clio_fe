import * as React from "react";
import { Layers, Plus } from "lucide-react";

import type {
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "../_lib/builderTypes";
import {
  getAllowedNodeKindsForCurrentView,
  getCurrentViewLabel,
  getNodeKindDescription,
  getNodeKindLabel,
} from "../_lib/builderUtils";

type BuilderSidebarProps = {
  project: DocumentationProject;
  focusedNodeId: string;
  selectedNodeId: string;
  decompositionView: DecompositionView;
  setSelectedNodeId: (id: string) => void;
  setFocusedNodeId: (id: string) => void;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  addNode: (params: {
    kind: NodeKind;
    name: string;
    description: string;
    lifecycle: NodeLifecycle;
  }) => void;
  resetProject: () => void;
};

export function BuilderSidebar({
  project,
  focusedNodeId,
  selectedNodeId,
  decompositionView,
  setSelectedNodeId,
  setFocusedNodeId,
  updateProject,
  addNode,
  resetProject,
}: BuilderSidebarProps) {
  const allowedKinds = getAllowedNodeKindsForCurrentView({
    project,
    focusedNodeId,
  });

  const currentViewLabel = getCurrentViewLabel(project, focusedNodeId);

  const [newElementKind, setNewElementKind] = React.useState<NodeKind>(
    allowedKinds[0] ?? "component"
  );
  const [newElementName, setNewElementName] = React.useState("");
  const [newElementDescription, setNewElementDescription] = React.useState("");
  const [newElementStatus, setNewElementStatus] =
    React.useState<NodeLifecycle>("planned");

  React.useEffect(() => {
    setNewElementKind(allowedKinds[0] ?? "component");
  }, [focusedNodeId, decompositionView]);

  const currentViewNodes = project.nodes.filter(
    (node) =>
      node.parentId === focusedNodeId && node.viewType === decompositionView
  );

  function handleAddElement() {
    const fallbackLabel = getNodeKindLabel(newElementKind);

    addNode({
      kind: newElementKind,
      name: newElementName.trim() || `New ${fallbackLabel}`,
      description:
        newElementDescription.trim() ||
        getNodeKindDescription(newElementKind),
      lifecycle: newElementStatus,
    });

    setNewElementName("");
    setNewElementDescription("");
    setNewElementStatus("planned");
  }

  return (
    <aside className="clio-sidebar h-full min-h-0 overflow-auto border-r p-4">
      <div className="mb-4">
        <label className="clio-label">Project Name</label>
        <input
          value={project.name}
          onChange={(event) =>
            updateProject((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          className="clio-input mt-1 w-full rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="clio-label">Project Description</label>
        <textarea
          value={project.description}
          onChange={(event) =>
            updateProject((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          rows={4}
          className="clio-input mt-1 w-full rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <section className="clio-panel-soft rounded-xl p-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-[var(--clio-purple-950)]">
          <Layers size={16} />
          Add to Current View
        </div>

        <p className="mb-4 text-xs text-[var(--clio-muted)]">
          Current View:{" "}
          <span className="font-semibold text-[var(--clio-purple-900)]">
            {currentViewLabel}
          </span>
        </p>

        <div className="space-y-3">
          <label className="block">
            <span className="clio-label mb-1 block">Element Type</span>
            <select
              value={newElementKind}
              onChange={(event) =>
                setNewElementKind(event.target.value as NodeKind)
              }
              className="clio-input w-full rounded-lg px-3 py-2 text-sm"
            >
              {allowedKinds.map((kind) => (
                <option key={kind} value={kind}>
                  {getNodeKindLabel(kind)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="clio-label mb-1 block">Name</span>
            <input
              value={newElementName}
              onChange={(event) => setNewElementName(event.target.value)}
              placeholder={`New ${getNodeKindLabel(newElementKind)}`}
              className="clio-input w-full rounded-lg px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="clio-label mb-1 block">Description</span>
            <textarea
              value={newElementDescription}
              onChange={(event) => setNewElementDescription(event.target.value)}
              placeholder={getNodeKindDescription(newElementKind)}
              rows={4}
              className="clio-input w-full rounded-lg px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="clio-label mb-1 block">Status</span>
            <select
              value={newElementStatus}
              onChange={(event) =>
                setNewElementStatus(event.target.value as NodeLifecycle)
              }
              className="clio-input w-full rounded-lg px-3 py-2 text-sm"
            >
              <option value="planned">Planned</option>
              <option value="active">Active</option>
              <option value="changing">Changing</option>
              <option value="deprecated">Deprecated</option>
              <option value="removed">Removed</option>
            </select>
          </label>

          <button
            onClick={handleAddElement}
            className="clio-btn-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            <Plus size={16} />
            Add Element
          </button>
        </div>
      </section>

      <div className="mt-6">
        <div className="clio-label mb-2">Current View Elements</div>

        <div className="space-y-1">
          {currentViewNodes.map((node) => {
            const childCount = project.nodes.filter(
              (item) =>
                item.parentId === node.id && item.viewType === decompositionView
            ).length;

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                onDoubleClick={() => {
                  setSelectedNodeId(node.id);
                  setFocusedNodeId(node.id);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedNodeId === node.id
                    ? "bg-[var(--clio-purple-900)] text-[var(--clio-white)]"
                    : "text-[var(--clio-ink)] hover:bg-[var(--clio-purple-50)]"
                }`}
              >
                <div className="font-semibold">{node.name}</div>
                <div className="text-xs opacity-75">
                  {node.kind} · {node.lifecycle} · {childCount} children
                </div>
              </button>
            );
          })}

          {!currentViewNodes.length ? (
            <p className="rounded-lg border border-dashed border-[var(--clio-border)] p-3 text-sm text-[var(--clio-muted)]">
              This view has no elements yet. Add one above.
            </p>
          ) : null}
        </div>
      </div>

      <button
        onClick={resetProject}
        className="mt-6 w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
      >
        Reset Starter
      </button>
    </aside>
  );
}