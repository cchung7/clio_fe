import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  Note,
} from "./builderTypes";

export type CanvasConnectableItem = {
  id: string;
  label: string;
  type: "element" | "note";
};

export function getCurrentViewNodes({
  project,
  focusedNodeId,
  decompositionView,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
  decompositionView: DecompositionView;
}): ArchitectureNode[] {
  return project.nodes.filter(
    (node) =>
      node.parentId === focusedNodeId && node.viewType === decompositionView
  );
}

export function getCanvasNotes({
  project,
  focusedNodeId,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
}): Note[] {
  return project.notes.filter(
    (note) => note.targetNodeId === focusedNodeId && note.showOnCanvas
  );
}

export function getConnectableCanvasItems({
  currentViewNodes,
  canvasNotes,
}: {
  currentViewNodes: ArchitectureNode[];
  canvasNotes: Note[];
}): CanvasConnectableItem[] {
  return [
    ...currentViewNodes.map((node) => ({
      id: node.id,
      label: node.name,
      type: "element" as const,
    })),
    ...canvasNotes.map((note) => ({
      id: note.id,
      label: note.title || "Canvas note",
      type: "note" as const,
    })),
  ];
}

export function getCurrentViewEdges({
  project,
  connectableItemIds,
}: {
  project: DocumentationProject;
  connectableItemIds: Set<string>;
}) {
  return project.edges.filter(
    (edge) =>
      connectableItemIds.has(edge.source) && connectableItemIds.has(edge.target)
  );
}

export function getConnectableItemLabel(
  connectableItems: CanvasConnectableItem[],
  id: string
) {
  return connectableItems.find((item) => item.id === id)?.label ?? "Unknown";
}