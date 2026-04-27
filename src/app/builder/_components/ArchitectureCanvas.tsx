import * as React from "react";
import { Trash2 } from "lucide-react";

import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  Note,
} from "../_lib/builderTypes";
import {
  getBreadcrumbs,
  getChildCount,
  getCurrentViewLabel,
  getNodeById,
  getVisibleNodes,
  SYSTEM_OVERVIEW_ID,
} from "../_lib/builderUtils";

type ArchitectureCanvasProps = {
  project: DocumentationProject;
  focusedNodeId: string;
  selectedNodeId: string;
  decompositionView: DecompositionView;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  setSelectedNodeId: (id: string) => void;
  setFocusedNodeId: (id: string) => void;
};

const CARD_WIDTH = 280;
const CARD_HEIGHT = 132;
const NOTE_WIDTH = 260;
const COLUMN_GAP = 340;
const ROW_GAP = 190;

type Position = {
  x: number;
  y: number;
};

type DragState =
  | {
      targetType: "node";
      id: string;
      offsetX: number;
      offsetY: number;
    }
  | {
      targetType: "note";
      id: string;
      offsetX: number;
      offsetY: number;
    };

type EditableNoteField = "title" | "content" | null;

function formatElementCount(count: number) {
  if (count <= 0) return "No elements";
  return `${count} ${count === 1 ? "element" : "elements"}`;
}

function getDefaultCardPosition(index: number): Position {
  const column = index % 3;
  const row = Math.floor(index / 3);

  return {
    x: 80 + column * COLUMN_GAP,
    y: 80 + row * ROW_GAP,
  };
}

function getDefaultCanvasNotePosition(index: number): Position {
  return {
    x: 140 + index * 28,
    y: 480 + index * 28,
  };
}

function getResolvedCardPosition(node: ArchitectureNode, index: number) {
  if (
    node.position &&
    Number.isFinite(node.position.x) &&
    Number.isFinite(node.position.y)
  ) {
    return node.position;
  }

  return getDefaultCardPosition(index);
}

function getResolvedCanvasNotePosition(note: Note, index: number) {
  if (
    note.canvasPosition &&
    Number.isFinite(note.canvasPosition.x) &&
    Number.isFinite(note.canvasPosition.y)
  ) {
    return note.canvasPosition;
  }

  return getDefaultCanvasNotePosition(index);
}

function ClioCanvasCard({
  node,
  elementCount,
  selected,
  dragging,
  onPointerDown,
  onDoubleClick,
}: {
  node: ArchitectureNode;
  elementCount: number;
  selected: boolean;
  dragging: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      title={node.description}
      onPointerDown={onPointerDown}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onDoubleClick();
      }}
      className={`clio-flow-node absolute rounded-xl px-4 py-3 text-left transition select-none ${
        selected
          ? "ring-2 ring-[var(--clio-purple-700)] ring-offset-2 ring-offset-[var(--clio-paper)]"
          : ""
      } ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        width: CARD_WIDTH,
        minHeight: CARD_HEIGHT,
        touchAction: "none",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-[var(--clio-purple-700)]">
          {node.kind}
        </span>

        <span className="clio-badge clio-badge-gold text-[10px]">
          {node.lifecycle}
        </span>
      </div>

      <div className="mt-2 text-sm font-bold text-[var(--clio-ink)]">
        {node.name}
      </div>

      <div className="mt-1 line-clamp-3 text-xs leading-5 text-[var(--clio-muted)]">
        {node.description || "No description yet."}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-[var(--clio-muted)]">
        <span>{formatElementCount(elementCount)}</span>

        <span className="font-bold text-[var(--clio-purple-700)]">
          Double-click to open
        </span>
      </div>
    </div>
  );
}

function CanvasNoteCard({
  note,
  dragging,
  onPointerDown,
  updateProject,
}: {
  note: Note;
  dragging: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
}) {
  const [editingField, setEditingField] =
    React.useState<EditableNoteField>(null);

  const titleRef = React.useRef<HTMLInputElement | null>(null);
  const contentRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (editingField === "title") {
      titleRef.current?.focus();
      titleRef.current?.select();
    }

    if (editingField === "content") {
      contentRef.current?.focus();
    }
  }, [editingField]);

  function updateCanvasNote(patch: Partial<Note>) {
    updateProject((current) => ({
      ...current,
      notes: current.notes.map((item) =>
        item.id === note.id ? { ...item, ...patch } : item
      ),
    }));
  }

  function deleteCanvasNote() {
    const confirmed = window.confirm("Delete this canvas note?");

    if (!confirmed) return;

    updateProject((current) => ({
      ...current,
      notes: current.notes.filter((item) => item.id !== note.id),
    }));
  }

  return (
    <div
      role="note"
      className="clio-note-card rounded-xl px-4 py-3 text-left"
      style={{
        width: NOTE_WIDTH,
        minHeight: 148,
      }}
    >
      <div
        onPointerDown={onPointerDown}
        className={`mb-2 flex cursor-grab items-center justify-between gap-2 select-none ${
          dragging ? "cursor-grabbing" : ""
        }`}
        style={{
          touchAction: "none",
        }}
      >
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-gold-800)]">
          Note
        </div>

        <button
          type="button"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            deleteCanvasNote();
          }}
          className="relative z-20 rounded-lg p-1.5 text-red-700 transition hover:bg-red-50"
          aria-label={`Delete ${note.title || "canvas note"}`}
          title={`Delete ${note.title || "canvas note"}`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {editingField === "title" ? (
        <input
          ref={titleRef}
          value={note.title || ""}
          placeholder="Note title"
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => updateCanvasNote({ title: event.target.value })}
          onBlur={() => setEditingField(null)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === "Escape") {
              setEditingField(null);
            }
          }}
          className="clio-input w-full rounded-lg px-2 py-1 text-sm font-semibold"
        />
      ) : (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setEditingField("title");
          }}
          className="block w-full rounded-lg px-2 py-1 text-left text-sm font-bold text-[var(--clio-ink)] transition hover:bg-[rgba(255,255,255,0.55)]"
          title="Click to edit note title"
        >
          {note.title || "Canvas note"}
        </button>
      )}

      {editingField === "content" ? (
        <textarea
          ref={contentRef}
          value={note.content}
          placeholder="Note body"
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => updateCanvasNote({ content: event.target.value })}
          onBlur={() => setEditingField(null)}
          rows={4}
          className="clio-input mt-2 w-full rounded-lg px-2 py-1 text-xs leading-5"
        />
      ) : (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setEditingField("content");
          }}
          className="mt-2 block min-h-[4.25rem] w-full rounded-lg px-2 py-1 text-left text-xs leading-5 text-[var(--clio-muted)] transition hover:bg-[rgba(255,255,255,0.55)]"
          title="Click to edit note body"
        >
          {note.content || "No note body yet."}
        </button>
      )}
    </div>
  );
}

export function ArchitectureCanvas({
  project,
  focusedNodeId,
  selectedNodeId,
  decompositionView,
  updateProject,
  setSelectedNodeId,
  setFocusedNodeId,
}: ArchitectureCanvasProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState<Position>({ x: 0, y: 0 });
  const [dragState, setDragState] = React.useState<DragState | null>(null);

  const focusedNode = getNodeById(project, focusedNodeId);

  const visibleNodes = getVisibleNodes({
    project,
    focusedNodeId,
    decompositionView,
  });

  const canvasNotes = project.notes.filter(
    (note) => note.targetNodeId === focusedNodeId && note.showOnCanvas
  );

  const visibleNodeIds = React.useMemo(
    () => new Set(visibleNodes.map((node) => node.id)),
    [visibleNodes]
  );

  const visibleEdges = React.useMemo(
    () =>
      project.edges.filter(
        (edge) =>
          visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
      ),
    [project.edges, visibleNodeIds]
  );

  const nodePositionMap = React.useMemo(() => {
    const entries = visibleNodes.map((node, index) => [
      node.id,
      getResolvedCardPosition(node, index),
    ]);

    return new Map(entries as Array<[string, Position]>);
  }, [visibleNodes]);

  const breadcrumbs = getBreadcrumbs(project, focusedNodeId);
  const currentViewLabel = getCurrentViewLabel(project, focusedNodeId);

  function clientPointToCanvasPoint(clientX: number, clientY: number): Position {
    const viewport = viewportRef.current;

    if (!viewport) {
      return { x: 0, y: 0 };
    }

    const rect = viewport.getBoundingClientRect();

    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  }

  function updateNodePosition(nodeId: string, position: Position) {
    updateProject((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              position,
            }
          : node
      ),
    }));
  }

  function updateCanvasNotePosition(noteId: string, position: Position) {
    updateProject((current) => ({
      ...current,
      notes: current.notes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              canvasPosition: position,
            }
          : note
      ),
    }));
  }

  function handleCardPointerDown(
    node: ArchitectureNode,
    index: number,
    event: React.PointerEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setSelectedNodeId(node.id);

    const currentPosition = getResolvedCardPosition(node, index);
    const pointerPosition = clientPointToCanvasPoint(
      event.clientX,
      event.clientY
    );

    setDragState({
      targetType: "node",
      id: node.id,
      offsetX: pointerPosition.x - currentPosition.x,
      offsetY: pointerPosition.y - currentPosition.y,
    });

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleCanvasNotePointerDown(
    note: Note,
    index: number,
    event: React.PointerEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    const currentPosition = getResolvedCanvasNotePosition(note, index);
    const pointerPosition = clientPointToCanvasPoint(
      event.clientX,
      event.clientY
    );

    setDragState({
      targetType: "note",
      id: note.id,
      offsetX: pointerPosition.x - currentPosition.x,
      offsetY: pointerPosition.y - currentPosition.y,
    });

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleCanvasPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragState) return;

    const pointerPosition = clientPointToCanvasPoint(
      event.clientX,
      event.clientY
    );

    const nextPosition = {
      x: Math.round(pointerPosition.x - dragState.offsetX),
      y: Math.round(pointerPosition.y - dragState.offsetY),
    };

    if (dragState.targetType === "node") {
      updateNodePosition(dragState.id, nextPosition);
      return;
    }

    updateCanvasNotePosition(dragState.id, nextPosition);
  }

  function handleCanvasPointerUp() {
    setDragState(null);
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    event.preventDefault();

    const zoomDelta = event.deltaY > 0 ? -0.08 : 0.08;

    setZoom((current) => {
      const nextZoom = current + zoomDelta;
      return Math.min(Math.max(nextZoom, 0.5), 1.8);
    });
  }

  function openParentView() {
    if (focusedNodeId === SYSTEM_OVERVIEW_ID) return;

    if (!focusedNode || focusedNode.parentId === SYSTEM_OVERVIEW_ID) {
      setFocusedNodeId(SYSTEM_OVERVIEW_ID);
      setSelectedNodeId(SYSTEM_OVERVIEW_ID);
      return;
    }

    setFocusedNodeId(focusedNode.parentId);
    setSelectedNodeId(focusedNode.parentId);
  }

  function resetViewport() {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  return (
    <div className="flex h-[38rem] w-full flex-col xl:h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--clio-border)] bg-[rgba(255,253,248,0.82)] px-4 py-3">
        <div className="min-w-0">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--clio-purple-700)]">
            Current View
          </div>

          <div className="mt-1 text-sm font-semibold text-[var(--clio-purple-950)]">
            {currentViewLabel}
          </div>

          {breadcrumbs.length > 1 ? (
            <div className="mt-1 flex flex-wrap items-center gap-1 text-xs">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.id} className="inline-flex items-center gap-1">
                  <button
                    onClick={() => {
                      setFocusedNodeId(crumb.id);
                      setSelectedNodeId(crumb.id);
                      resetViewport();
                    }}
                    className={`rounded-md px-2 py-1 font-semibold transition hover:bg-[var(--clio-purple-50)] ${
                      crumb.id === focusedNodeId
                        ? "text-[var(--clio-purple-900)]"
                        : "text-[var(--clio-muted)]"
                    }`}
                  >
                    {crumb.name}
                  </button>

                  {index < breadcrumbs.length - 1 ? (
                    <span className="text-[var(--clio-soft-muted)]">/</span>
                  ) : null}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={openParentView}
            disabled={focusedNodeId === SYSTEM_OVERVIEW_ID}
            className="clio-btn-secondary rounded-lg px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous View
          </button>

          <button
            onClick={() => {
              setFocusedNodeId(SYSTEM_OVERVIEW_ID);
              setSelectedNodeId(SYSTEM_OVERVIEW_ID);
              resetViewport();
            }}
            className="clio-btn-secondary rounded-lg px-3 py-2 text-sm font-medium"
          >
            System View
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerCancel={handleCanvasPointerUp}
        onWheel={handleWheel}
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          backgroundColor: "#fbf6ec",
          backgroundImage: "radial-gradient(#cbb89c 1.2px, transparent 1.2px)",
          backgroundSize: "32px 32px",
        }}
      >
        {visibleNodes.length || canvasNotes.length ? (
          <>
            <div className="absolute left-4 bottom-4 z-20 flex flex-col overflow-hidden rounded-xl border border-[var(--clio-purple-border)] bg-[var(--clio-white)] shadow-lg">
              <button
                onClick={() =>
                  setZoom((current) => Math.min(current + 0.1, 1.8))
                }
                className="border-b border-[var(--clio-border)] px-3 py-2 text-lg font-bold hover:bg-[var(--clio-purple-50)]"
                aria-label="Zoom in"
              >
                +
              </button>

              <button
                onClick={() =>
                  setZoom((current) => Math.max(current - 0.1, 0.5))
                }
                className="border-b border-[var(--clio-border)] px-3 py-2 text-lg font-bold hover:bg-[var(--clio-purple-50)]"
                aria-label="Zoom out"
              >
                −
              </button>

              <button
                onClick={resetViewport}
                className="px-3 py-2 text-xs font-bold hover:bg-[var(--clio-purple-50)]"
              >
                1:1
              </button>
            </div>

            <div className="absolute right-4 bottom-4 z-20 rounded-xl border border-[var(--clio-purple-border)] bg-[rgba(255,253,248,0.94)] px-3 py-2 text-xs font-semibold text-[var(--clio-muted)] shadow-lg">
              Zoom: {Math.round(zoom * 100)}%
            </div>

            <div
              className="absolute left-0 top-0 h-[2200px] w-[2200px]"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "top left",
              }}
            >
              <svg
                className="absolute left-0 top-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {visibleEdges.map((edge) => {
                  const source = nodePositionMap.get(edge.source);
                  const target = nodePositionMap.get(edge.target);

                  if (!source || !target) return null;

                  return (
                    <line
                      key={edge.id}
                      x1={source.x + CARD_WIDTH}
                      y1={source.y + CARD_HEIGHT / 2}
                      x2={target.x}
                      y2={target.y + CARD_HEIGHT / 2}
                      stroke="#73569a"
                      strokeWidth="2"
                      strokeDasharray={
                        edge.relationshipType === "calls" ? "6 6" : "0"
                      }
                    />
                  );
                })}
              </svg>

              {visibleNodes.map((node, index) => {
                const position = getResolvedCardPosition(node, index);
                const elementCount = getChildCount({
                  project,
                  nodeId: node.id,
                  decompositionView,
                });

                return (
                  <div
                    key={node.id}
                    style={{
                      position: "absolute",
                      left: position.x,
                      top: position.y,
                    }}
                  >
                    <ClioCanvasCard
                      node={node}
                      elementCount={elementCount}
                      selected={selectedNodeId === node.id}
                      dragging={
                        dragState?.targetType === "node" &&
                        dragState.id === node.id
                      }
                      onPointerDown={(event) =>
                        handleCardPointerDown(node, index, event)
                      }
                      onDoubleClick={() => {
                        setSelectedNodeId(node.id);
                        setFocusedNodeId(node.id);
                        resetViewport();
                      }}
                    />
                  </div>
                );
              })}

              {canvasNotes.map((note, index) => {
                const position = getResolvedCanvasNotePosition(note, index);

                return (
                  <div
                    key={note.id}
                    style={{
                      position: "absolute",
                      left: position.x,
                      top: position.y,
                    }}
                  >
                    <CanvasNoteCard
                      note={note}
                      dragging={
                        dragState?.targetType === "note" &&
                        dragState.id === note.id
                      }
                      updateProject={updateProject}
                      onPointerDown={(event) =>
                        handleCanvasNotePointerDown(note, index, event)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center">
            <div className="clio-panel max-w-md rounded-2xl p-6">
              <div className="text-lg font-bold text-[var(--clio-purple-950)]">
                This view is empty.
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--clio-muted)]">
                Open Project and create an element for this current view.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}