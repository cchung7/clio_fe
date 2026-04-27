import type { ArchitectureNode, Note } from "./builderTypes";

export type Position = {
  x: number;
  y: number;
};

export type CanvasItemRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const CARD_WIDTH = 280;
export const CARD_HEIGHT = 132;
export const NOTE_WIDTH = 260;
export const NOTE_HEIGHT = 160;

const COLUMN_GAP = 340;
const ROW_GAP = 190;

export function getDefaultCardPosition(index: number): Position {
  const column = index % 3;
  const row = Math.floor(index / 3);

  return {
    x: 80 + column * COLUMN_GAP,
    y: 80 + row * ROW_GAP,
  };
}

export function getDefaultCanvasNotePosition(index: number): Position {
  return {
    x: 140 + index * 28,
    y: 480 + index * 28,
  };
}

export function getResolvedCardPosition(
  node: ArchitectureNode,
  index: number
): Position {
  if (
    node.position &&
    Number.isFinite(node.position.x) &&
    Number.isFinite(node.position.y)
  ) {
    return node.position;
  }

  return getDefaultCardPosition(index);
}

export function getResolvedCanvasNotePosition(
  note: Note,
  index: number
): Position {
  if (
    note.canvasPosition &&
    Number.isFinite(note.canvasPosition.x) &&
    Number.isFinite(note.canvasPosition.y)
  ) {
    return note.canvasPosition;
  }

  return getDefaultCanvasNotePosition(index);
}

export function getRectCenter(rect: CanvasItemRect): Position {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

export function getBoundaryPoint(
  fromRect: CanvasItemRect,
  toRect: CanvasItemRect
): Position {
  const from = getRectCenter(fromRect);
  const to = getRectCenter(toRect);

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (dx === 0 && dy === 0) return from;

  const scaleX =
    dx === 0 ? Number.POSITIVE_INFINITY : fromRect.width / 2 / Math.abs(dx);
  const scaleY =
    dy === 0 ? Number.POSITIVE_INFINITY : fromRect.height / 2 / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);

  return {
    x: from.x + dx * scale,
    y: from.y + dy * scale,
  };
}