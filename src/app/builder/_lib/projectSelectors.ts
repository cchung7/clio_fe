import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
} from "./builderTypes";
import { SYSTEM_OVERVIEW_ID } from "./builderUtils";

export function selectNodeById(project: DocumentationProject, id: string) {
  return project.nodes.find((node) => node.id === id) ?? null;
}

export function selectVisibleNodes({
  project,
  focusedNodeId,
  decompositionView,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
  decompositionView: DecompositionView;
}) {
  return project.nodes.filter(
    (node) =>
      node.parentId === focusedNodeId && node.viewType === decompositionView
  );
}

export function selectChildCount({
  project,
  nodeId,
  decompositionView,
}: {
  project: DocumentationProject;
  nodeId: string;
  decompositionView: DecompositionView;
}) {
  return project.nodes.filter(
    (node) => node.parentId === nodeId && node.viewType === decompositionView
  ).length;
}

export function selectCurrentViewLabel(
  project: DocumentationProject,
  focusedNodeId: string
) {
  if (focusedNodeId === SYSTEM_OVERVIEW_ID) return "System Overview";

  return selectNodeById(project, focusedNodeId)?.name ?? "Unknown View";
}

export function selectBreadcrumbs(
  project: DocumentationProject,
  nodeId: string
) {
  if (nodeId === SYSTEM_OVERVIEW_ID) {
    return [{ id: SYSTEM_OVERVIEW_ID, name: "System Overview" }];
  }

  const breadcrumbs: Array<{ id: string; name: string }> = [
    { id: SYSTEM_OVERVIEW_ID, name: "System Overview" },
  ];

  let current = selectNodeById(project, nodeId);
  const stack: ArchitectureNode[] = [];

  while (current && current.parentId !== SYSTEM_OVERVIEW_ID) {
    stack.unshift(current);
    current = selectNodeById(project, current.parentId);
  }

  if (current) stack.unshift(current);

  return [
    ...breadcrumbs,
    ...stack.map((node) => ({ id: node.id, name: node.name })),
  ];
}

export function selectAllowedNodeKindsForCurrentView({
  project,
  focusedNodeId,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
}): NodeKind[] {
  if (focusedNodeId === SYSTEM_OVERVIEW_ID) {
    return ["system"];
  }

  const focusedNode = selectNodeById(project, focusedNodeId);

  if (!focusedNode) return ["system"];

  if (focusedNode.kind === "system") {
    return ["actor", "layer", "external"];
  }

  if (focusedNode.kind === "layer") {
    return ["component", "api", "database", "external"];
  }

  return ["component", "api", "database", "external"];
}

export function selectRelatedRequirements(
  project: DocumentationProject,
  nodeId: string
) {
  return project.requirements.filter((requirement) =>
    requirement.relatedNodeIds.includes(nodeId)
  );
}

export function selectRelatedNotes(project: DocumentationProject, nodeId: string) {
  return project.notes.filter((note) => note.targetNodeId === nodeId);
}
