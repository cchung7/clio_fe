import * as React from "react";

import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  Note,
} from "../../_lib/builderTypes";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  getResolvedCanvasNotePosition,
  getResolvedCardPosition,
  NOTE_HEIGHT,
  NOTE_WIDTH,
  type CanvasItemRect,
} from "../../_lib/canvasGeometry";
import { getChildCount } from "../../_lib/builderUtils";
import { useCanvasDrag } from "../../_hooks/useCanvasDrag";
import { useCanvasViewport } from "../../_hooks/useCanvasViewport";

import { CanvasCard } from "./CanvasCard";
import { CanvasControls } from "./CanvasControls";
import { CanvasEdges } from "./CanvasEdges";
import { CanvasEmptyState } from "./CanvasEmptyState";
import { CanvasNoteCard } from "./CanvasNoteCard";

type CanvasViewportProps = {
  project: DocumentationProject;
  visibleNodes: ArchitectureNode[];
  canvasNotes: Note[];
  selectedNodeId: string;
  selectedConnectorId: string | null;
  decompositionView: DecompositionView;
  viewportResetToken: number;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  setSelectedNodeId: (id: string) => void;
  setFocusedNodeId: (id: string) => void;
  requestViewportReset: () => void;
  onSelectConnector: (id: string) => void;
};

export function CanvasViewport({
  project,
  visibleNodes,
  canvasNotes,
  selectedNodeId,
  selectedConnectorId,
  decompositionView,
  viewportResetToken,
  updateProject,
  setSelectedNodeId,
  setFocusedNodeId,
  requestViewportReset,
  onSelectConnector,
}: CanvasViewportProps) {
  const {
    viewportRef,
    zoom,
    pan,
    setZoom,
    resetViewport,
    handleWheel,
    clientPointToCanvasPoint,
  } = useCanvasViewport({
    viewportResetToken,
  });

  const {
    dragState,
    handleCardPointerDown,
    handleCanvasNotePointerDown,
    handleCanvasPointerMove,
    handleCanvasPointerUp,
  } = useCanvasDrag({
    clientPointToCanvasPoint,
    updateProject,
    setSelectedNodeId,
  });

  const visibleItemRects = React.useMemo(() => {
    const entries: Array<[string, CanvasItemRect]> = [];

    visibleNodes.forEach((node, index) => {
      const position = getResolvedCardPosition(node, index);

      entries.push([
        node.id,
        {
          id: node.id,
          x: position.x,
          y: position.y,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
        },
      ]);
    });

    canvasNotes.forEach((note, index) => {
      const position = getResolvedCanvasNotePosition(note, index);

      entries.push([
        note.id,
        {
          id: note.id,
          x: position.x,
          y: position.y,
          width: NOTE_WIDTH,
          height: NOTE_HEIGHT,
        },
      ]);
    });

    return new Map(entries);
  }, [visibleNodes, canvasNotes]);

  const visibleItemIds = React.useMemo(
    () => new Set(visibleItemRects.keys()),
    [visibleItemRects]
  );

  const visibleEdges = React.useMemo(
    () =>
      project.edges.filter(
        (edge) =>
          visibleItemIds.has(edge.source) && visibleItemIds.has(edge.target)
      ),
    [project.edges, visibleItemIds]
  );

  return (
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
          <CanvasControls
            zoom={zoom}
            setZoom={setZoom}
            resetViewport={resetViewport}
          />

          <div
            className="absolute left-0 top-0 h-[2200px] w-[2200px]"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            <CanvasEdges
              edges={visibleEdges}
              itemRects={visibleItemRects}
              selectedConnectorId={selectedConnectorId}
              onSelectConnector={onSelectConnector}
            />

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
                  <CanvasCard
                    node={node}
                    elementCount={elementCount}
                    selected={
                      !selectedConnectorId && selectedNodeId === node.id
                    }
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
                      requestViewportReset();
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
        <CanvasEmptyState />
      )}
    </div>
  );
}