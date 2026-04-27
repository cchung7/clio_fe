import type {
  ArchitectureNode,
  DecompositionView,
  DocumentationProject,
  NodeKind,
  NodeLifecycle,
} from "./builderTypes";
import { createId } from "./idUtils";

export type CreateArchitectureNodeInput = {
  kind: NodeKind;
  project: DocumentationProject;
  parentId: string;
  viewType: DecompositionView;
  name: string;
  description: string;
  lifecycle?: NodeLifecycle;
};

export function createArchitectureNode({
  kind,
  project,
  parentId,
  viewType,
  name,
  description,
  lifecycle = "planned",
}: CreateArchitectureNodeInput): ArchitectureNode {
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