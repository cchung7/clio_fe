import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "./builderTypes";
import {
  createArchitectureNode,
  createId,
  SYSTEM_OVERVIEW_ID,
} from "./builderUtils";

export type CreateNodeInput = {
  kind: NodeKind;
  parentId: string;
  viewType: DecompositionView;
  name: string;
  description: string;
  lifecycle: NodeLifecycle;
};

export function collectDescendantNodeIds(
  nodes: ArchitectureNode[],
  nodeId: string
): Set<string> {
  const ids = new Set<string>([nodeId]);
  let changed = true;

  while (changed) {
    changed = false;

    for (const node of nodes) {
      if (ids.has(node.parentId) && !ids.has(node.id)) {
        ids.add(node.id);
        changed = true;
      }
    }
  }

  return ids;
}

export function createNodeForProject(
  project: DocumentationProject,
  input: CreateNodeInput
) {
  const node = createArchitectureNode({
    kind: input.kind,
    project,
    parentId: input.parentId,
    viewType: input.viewType,
    name: input.name,
    description: input.description,
    lifecycle: input.lifecycle,
  });

  return {
    node,
    project: {
      ...project,
      nodes: [...project.nodes, node],
    },
  };
}

export function updateNodeInProject(
  project: DocumentationProject,
  id: string,
  patch: Partial<ArchitectureNode>
): DocumentationProject {
  return {
    ...project,
    nodes: project.nodes.map((node) =>
      node.id === id ? { ...node, ...patch } : node
    ),
  };
}

export function deleteNodeFromProject(
  project: DocumentationProject,
  nodeId: string
): DocumentationProject {
  const deletedIds = collectDescendantNodeIds(project.nodes, nodeId);

  return {
    ...project,
    nodes: project.nodes.filter((node) => !deletedIds.has(node.id)),
    edges: project.edges.filter(
      (edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)
    ),
    requirements: project.requirements
      .map((requirement) => ({
        ...requirement,
        relatedNodeIds: requirement.relatedNodeIds.filter(
          (id) => !deletedIds.has(id)
        ),
      }))
      .filter((requirement) => requirement.relatedNodeIds.length > 0),
    notes: project.notes.filter(
      (note) => !note.targetNodeId || !deletedIds.has(note.targetNodeId)
    ),
    changes: project.changes.map((change) => ({
      ...change,
      relatedNodeIds: change.relatedNodeIds.filter(
        (id) => !deletedIds.has(id)
      ),
    })),
  };
}

export function getNextFocusedNodeIdAfterDelete({
  project,
  nodeId,
  focusedNodeId,
}: {
  project: DocumentationProject;
  nodeId: string;
  focusedNodeId: string;
}) {
  const nodeToDelete = project.nodes.find((node) => node.id === nodeId);

  if (!nodeToDelete) return focusedNodeId;

  const idsToDelete = collectDescendantNodeIds(project.nodes, nodeId);

  return idsToDelete.has(focusedNodeId)
    ? nodeToDelete.parentId || SYSTEM_OVERVIEW_ID
    : focusedNodeId;
}

export function createRequirementForNode(
  project: DocumentationProject,
  nodeId: string
): DocumentationProject {
  const nextNumber = project.requirements.length + 1;
  const id = createId("req");

  return {
    ...project,
    requirements: [
      ...project.requirements,
      {
        id,
        code: `REQ-${String(nextNumber).padStart(3, "0")}`,
        title: "New Requirement",
        statement: "The system shall ...",
        type: "functional",
        priority: "medium",
        relatedNodeIds: [nodeId],
      },
    ],
  };
}

export function createNoteForNode(
  project: DocumentationProject,
  nodeId: string
): DocumentationProject {
  const id = createId("note");

  return {
    ...project,
    notes: [
      ...project.notes,
      {
        id,
        title: "New Note",
        content: "Write a note about this element.",
        type: "note",
        targetNodeId: nodeId,
        includeInExport: true,
      },
    ],
  };
}

export function createSnapshotForProject({
  project,
  version,
  title,
}: {
  project: DocumentationProject;
  version: string;
  title?: string | null;
}): DocumentationProject {
  return {
    ...project,
    currentVersion: version,
    snapshots: [
      ...project.snapshots,
      {
        id: createId("snapshot"),
        version,
        title: title || "Architecture snapshot",
        summary:
          "Saved a snapshot of the current architecture, requirements, and notes.",
        createdAt: new Date().toISOString(),
        state: {
          nodes: project.nodes.map((node) => ({
            ...node,
            position: node.position ? { ...node.position } : undefined,
          })),
          edges: project.edges.map((edge) => ({ ...edge })),
          requirements: project.requirements.map((requirement) => ({
            ...requirement,
            relatedNodeIds: [...requirement.relatedNodeIds],
          })),
          notes: project.notes.map((note) => ({
            ...note,
            canvasPosition: note.canvasPosition
              ? { ...note.canvasPosition }
              : undefined,
          })),
        },
      },
    ],
  };
}