import * as React from "react";
import { GitBranch, Layers, Plus, StickyNote, Trash2 } from "lucide-react";

import type {
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "../_lib/builderTypes";
import {
  createId,
  getAllowedNodeKindsForCurrentView,
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
  deleteNode: (id: string) => void;
  resetProject: () => void;
};

type AddMode = "element" | "note";

function formatElementCount(count: number) {
  return `${count} ${count === 1 ? "element" : "elements"}`;
}

export function BuilderSidebar({
  project,
  focusedNodeId,
  selectedNodeId,
  decompositionView,
  setSelectedNodeId,
  setFocusedNodeId,
  updateProject,
  addNode,
  deleteNode,
  resetProject,
}: BuilderSidebarProps) {
  const allowedKinds = getAllowedNodeKindsForCurrentView({
    project,
    focusedNodeId,
  });

  const [addMode, setAddMode] = React.useState<AddMode>("element");

  const [newElementKind, setNewElementKind] = React.useState<NodeKind>(
    allowedKinds[0] ?? "component"
  );
  const [newElementName, setNewElementName] = React.useState("");
  const [newElementDescription, setNewElementDescription] = React.useState("");
  const [newElementStatus, setNewElementStatus] =
    React.useState<NodeLifecycle>("planned");

  const [newNoteTitle, setNewNoteTitle] = React.useState("");
  const [newNoteBody, setNewNoteBody] = React.useState("");

  React.useEffect(() => {
    setNewElementKind(allowedKinds[0] ?? "component");
  }, [focusedNodeId, decompositionView, allowedKinds]);

  const currentViewNodes = project.nodes.filter(
    (node) =>
      node.parentId === focusedNodeId && node.viewType === decompositionView
  );

  const canvasNoteCount = project.notes.filter(
    (note) => note.targetNodeId === focusedNodeId && note.showOnCanvas
  ).length;

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

  function handleAddCanvasNote() {
    const offset = canvasNoteCount * 28;

    updateProject((current) => ({
      ...current,
      notes: [
        ...current.notes,
        {
          id: createId("canvas-note"),
          title: newNoteTitle.trim() || "Canvas note",
          type: "note",
          content:
            newNoteBody.trim() ||
            "Add a note, reminder, or design comment for this view.",
          targetNodeId: focusedNodeId,
          includeInExport: true,
          showOnCanvas: true,
          canvasPosition: {
            x: 140 + offset,
            y: 480 + offset,
          },
        },
      ],
    }));

    setNewNoteTitle("");
    setNewNoteBody("");
  }

  return (
    <aside className="clio-sidebar h-full min-h-0 overflow-auto border-r p-4">
      <section className="clio-panel-soft rounded-xl p-4">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-[var(--clio-purple-950)]">
          <Layers size={16} />
          Add to Canvas
        </div>

        <p className="mb-4 text-xs leading-5 text-[var(--clio-muted)]">
          Add architecture elements or visual notes to the current canvas view.
        </p>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] p-1">
          <button
            type="button"
            onClick={() => setAddMode("element")}
            className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
              addMode === "element"
                ? "bg-[var(--clio-purple-900)] text-[var(--clio-white)] shadow-sm"
                : "text-[var(--clio-purple-950)] hover:bg-[var(--clio-purple-50)]"
            }`}
          >
            Element
          </button>

          <button
            type="button"
            onClick={() => setAddMode("note")}
            className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
              addMode === "note"
                ? "bg-[var(--clio-gold-500)] text-[var(--clio-ink)] shadow-sm"
                : "text-[var(--clio-purple-950)] hover:bg-[var(--clio-purple-50)]"
            }`}
          >
            Note
          </button>
        </div>

        {addMode === "element" ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-[var(--clio-border)] bg-[rgba(255,253,248,0.72)] px-3 py-2 text-xs leading-5 text-[var(--clio-muted)]">
              Use elements for systems, layers, components, APIs, databases, and
              external systems.
            </div>

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
                onChange={(event) =>
                  setNewElementDescription(event.target.value)
                }
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
        ) : (
          <div className="space-y-3">
            <div className="rounded-lg border border-[var(--clio-border)] bg-[rgba(255,253,248,0.72)] px-3 py-2 text-xs leading-5 text-[var(--clio-muted)]">
              Use notes for visual reminders, comments, questions, or design
              observations directly on the canvas.
            </div>

            <label className="block">
              <span className="clio-label mb-1 block">Note Title</span>
              <input
                value={newNoteTitle}
                onChange={(event) => setNewNoteTitle(event.target.value)}
                placeholder="Canvas note"
                className="clio-input w-full rounded-lg px-3 py-2 text-sm"
              />
            </label>

            <label className="block">
              <span className="clio-label mb-1 block">Note Body</span>
              <textarea
                value={newNoteBody}
                onChange={(event) => setNewNoteBody(event.target.value)}
                placeholder="Add a note, reminder, or design comment for this view."
                rows={4}
                className="clio-input w-full rounded-lg px-3 py-2 text-sm"
              />
            </label>

            <button
              type="button"
              onClick={handleAddCanvasNote}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--clio-gold-300)] bg-[var(--clio-gold-100)] px-4 py-2 text-sm font-semibold text-[var(--clio-ink)] transition hover:bg-[var(--clio-gold-300)]"
            >
              <StickyNote size={16} />
              Add Note
            </button>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-dashed border-[var(--clio-border)] bg-[rgba(255,253,248,0.64)] p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--clio-purple-950)]">
            <GitBranch size={14} />
            Connector Lines
          </div>

          <p className="mt-1 text-xs leading-5 text-[var(--clio-muted)]">
            Solid, dotted, and arrowed connectors should be added as a dedicated
            line-editing pass next.
          </p>
        </div>
      </section>

      <div className="mt-6">
        <div className="clio-label mb-2">Elements in This View</div>

        <div className="space-y-2">
          {currentViewNodes.map((node) => {
            const elementCount = project.nodes.filter(
              (item) =>
                item.parentId === node.id && item.viewType === decompositionView
            ).length;

            const selected = selectedNodeId === node.id;

            return (
              <div
                key={node.id}
                className={`group grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border px-3 py-2 transition ${
                  selected
                    ? "border-[var(--clio-gold-400)] bg-[var(--clio-gold-100)] text-[var(--clio-ink)] shadow-sm"
                    : "border-[var(--clio-border)] bg-[rgba(255,253,248,0.76)] text-[var(--clio-ink)] hover:border-[var(--clio-purple-border)] hover:bg-[var(--clio-purple-50)]"
                }`}
              >
                <button
                  onClick={() => setSelectedNodeId(node.id)}
                  onDoubleClick={() => {
                    setSelectedNodeId(node.id);
                    setFocusedNodeId(node.id);
                  }}
                  className="min-w-0 text-left text-sm"
                >
                  <div className="truncate font-semibold">{node.name}</div>
                  <div className="text-xs opacity-75">
                    {node.kind} · {node.lifecycle} ·{" "}
                    {formatElementCount(elementCount)}
                  </div>
                </button>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteNode(node.id);
                  }}
                  className="rounded-lg p-2 text-red-700 transition hover:bg-red-50"
                  aria-label={`Delete ${node.name}`}
                  title={`Delete ${node.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
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