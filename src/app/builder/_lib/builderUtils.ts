import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "./builderTypes";

export const STORAGE_KEY = "clio-builder-project-v0-1";
export const SYSTEM_OVERVIEW_ID = "system-overview";
export const CURRENT_SCHEMA_VERSION = 2;

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createArchitectureNode({
  kind,
  project,
  parentId,
  viewType,
  name,
  description,
  lifecycle = "planned",
}: {
  kind: NodeKind;
  project: DocumentationProject;
  parentId: string;
  viewType: DecompositionView;
  name: string;
  description: string;
  lifecycle?: NodeLifecycle;
}): ArchitectureNode {
  const id = createId(kind);

  const siblingCount = project.nodes.filter(
    (node) => node.parentId === parentId && node.viewType === viewType
  ).length;

  return {
    id,
    parentId,
    viewType,
    kind,
    name,
    description,
    lifecycle,
    position: {
      x: 120 + siblingCount * 80,
      y: 140 + (siblingCount % 3) * 120,
    },
  };
}

export function getNodeById(project: DocumentationProject, id: string) {
  return project.nodes.find((node) => node.id === id) ?? null;
}

export function getVisibleNodes({
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

export function getChildCount({
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

export function getCurrentViewLabel(
  project: DocumentationProject,
  focusedNodeId: string
) {
  if (focusedNodeId === SYSTEM_OVERVIEW_ID) return "System Overview";

  return getNodeById(project, focusedNodeId)?.name ?? "Unknown View";
}

export function getBreadcrumbs(project: DocumentationProject, nodeId: string) {
  if (nodeId === SYSTEM_OVERVIEW_ID) {
    return [{ id: SYSTEM_OVERVIEW_ID, name: "System Overview" }];
  }

  const breadcrumbs: Array<{ id: string; name: string }> = [
    { id: SYSTEM_OVERVIEW_ID, name: "System Overview" },
  ];

  let current = getNodeById(project, nodeId);
  const stack: ArchitectureNode[] = [];

  while (current && current.parentId !== SYSTEM_OVERVIEW_ID) {
    stack.unshift(current);
    current = getNodeById(project, current.parentId);
  }

  if (current) stack.unshift(current);

  return [
    ...breadcrumbs,
    ...stack.map((node) => ({
      id: node.id,
      name: node.name,
    })),
  ];
}

export function getAllowedNodeKindsForCurrentView({
  project,
  focusedNodeId,
}: {
  project: DocumentationProject;
  focusedNodeId: string;
}): NodeKind[] {
  if (focusedNodeId === SYSTEM_OVERVIEW_ID) {
    return ["system"];
  }

  const focusedNode = getNodeById(project, focusedNodeId);

  if (!focusedNode) {
    return ["system"];
  }

  if (focusedNode.kind === "system") {
    return ["actor", "layer", "external"];
  }

  if (focusedNode.kind === "layer") {
    return ["component", "api", "database", "external"];
  }

  return ["component", "api", "database", "external"];
}

export function getNodeKindLabel(kind: NodeKind) {
  const labels: Record<NodeKind, string> = {
    system: "System",
    actor: "Actor",
    layer: "Layer",
    component: "Component",
    api: "API",
    database: "Database",
    external: "External System",
  };

  return labels[kind];
}

export function getNodeKindDescription(kind: NodeKind) {
  const descriptions: Record<NodeKind, string> = {
    system: "A software system, product, application, or major platform.",
    actor: "A user, role, stakeholder, or external person/system.",
    layer: "A high-level architecture layer or implementation boundary.",
    component: "A module, feature, service, page, or internal subsystem.",
    api: "An endpoint group, service interface, or communication boundary.",
    database: "A schema, model, collection, table, or persistence boundary.",
    external: "A third-party service or system outside the main boundary.",
  };

  return descriptions[kind];
}