import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "./builderTypes";
import { createArchitectureNode } from "./nodeFactory";
import { SYSTEM_OVERVIEW_ID } from "./projectConstants";

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
  const deletedNodeIds = collectDescendantNodeIds(project.nodes, nodeId);

  const deletedNoteIds = new Set(
    project.notes
      .filter(
        (note) => note.targetNodeId && deletedNodeIds.has(note.targetNodeId)
      )
      .map((note) => note.id)
  );

  function isDeletedCanvasItem(id: string) {
    return deletedNodeIds.has(id) || deletedNoteIds.has(id);
  }

  return {
    ...project,
    nodes: project.nodes.filter((node) => !deletedNodeIds.has(node.id)),
    edges: project.edges.filter(
      (edge) =>
        !isDeletedCanvasItem(edge.source) && !isDeletedCanvasItem(edge.target)
    ),
    requirements: project.requirements
      .map((requirement) => ({
        ...requirement,
        relatedNodeIds: requirement.relatedNodeIds.filter(
          (id) => !deletedNodeIds.has(id)
        ),
      }))
      .filter((requirement) => requirement.relatedNodeIds.length > 0),
    notes: project.notes.filter(
      (note) => !note.targetNodeId || !deletedNodeIds.has(note.targetNodeId)
    ),
    changes: project.changes.map((change) => ({
      ...change,
      relatedNodeIds: change.relatedNodeIds.filter(
        (id) => !deletedNodeIds.has(id)
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