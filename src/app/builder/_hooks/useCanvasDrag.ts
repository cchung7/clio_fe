import * as React from "react";

import type {
  ArchitectureNode,
  DocumentationProject,
  Note,
} from "../_lib/builderTypes";
import {
  getResolvedCanvasNotePosition,
  getResolvedCardPosition,
  type Position,
} from "../_lib/canvasGeometry";

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

type UseCanvasDragProps = {
  clientPointToCanvasPoint: (clientX: number, clientY: number) => Position;
  updateProject: (
    updater: (current: DocumentationProject) => DocumentationProject
  ) => void;
  setSelectedNodeId: (id: string) => void;
};

export function useCanvasDrag({
  clientPointToCanvasPoint,
  updateProject,
  setSelectedNodeId,
}: UseCanvasDragProps) {
  const [dragState, setDragState] = React.useState<DragState | null>(null);

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

  return {
    dragState,
    handleCardPointerDown,
    handleCanvasNotePointerDown,
    handleCanvasPointerMove,
    handleCanvasPointerUp,
  };
}